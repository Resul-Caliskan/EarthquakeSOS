const config = require("../config/config");
const User = require("../models/user");
const Team = require("../models/Team");
const { getSocketIo } = require("../config/notificationConfig");
const multer = require("multer");
const stream = require("stream");
const ffmpeg = require("fluent-ffmpeg");
const { v4: uuidv4 } = require("uuid");

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const BASE_URL = config.BASE_URL || "https://earthquakesos.onrender.com";

async function updateCoordinate(req, res) {
  const { coordinate, id, message, date } = req.body;
  const recordFile = req.files["record"] ? req.files["record"][0] : null;
  const imageFile = req.files["image"] ? req.files["image"][0] : null;

  console.log("Coordinate:", coordinate);
  if (!recordFile) {
    return res.status(400).json({
      message: "Ses dosyası yüklenmedi",
    });
  }

  try {
    // Convert 3GP to MP3 in memory
    const inputStream = new stream.PassThrough();
    inputStream.end(recordFile.buffer);

    const outputStream = new stream.PassThrough();
    const buffers = [];

    outputStream.on("data", (chunk) => buffers.push(chunk));
    outputStream.on("end", async () => {
      try {
        const mp3Buffer = Buffer.concat(buffers);

        // Process image file if exists
        let base64Image = null;
        if (imageFile) {
          base64Image = imageFile.buffer.toString("base64");
        }

        // Update the user's record field directly
        const updateCoordinateUser = await User.findByIdAndUpdate(
          id,
          {
            coordinate: coordinate,
            message: message,
            record: mp3Buffer, // Directly save the MP3 buffer
            image: base64Image, // Save the image as Base64 string
            statue: false,
            createdAt: date,
          },
          { new: true }
        );

        if (!updateCoordinateUser) {
          return res.status(404).json({
            message: "Kullanıcı bulunamadı",
          });
        }

        // Convert mp3Buffer to Base64 URL
        const base64Audio = mp3Buffer.toString("base64");
        const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

        // Soket bağlantısını al
        const io = getSocketIo();

        // İstemcilere güncelleme mesajı gönder
        io.emit("emergencyWeb", {
          id: updateCoordinateUser._id,
          name: updateCoordinateUser.name,
          message: updateCoordinateUser.message,
          time: updateCoordinateUser.createdAt,
          audioUrl: audioUrl, // Send as Base64 URL
          imageUrl: base64Image
            ? `data:image/jpeg;base64,${base64Image}`
            : null,
          healthInfo: updateCoordinateUser.healthInfo,
          coordinate: updateCoordinateUser.coordinate,
        });

        res.status(200).json({
          message: "Koordinat Başarılı Bir Şekilde Alındı",
          data: updateCoordinateUser,
        });
      } catch (updateError) {
        console.error("Error updating coordinate:", updateError);
        if (!res.headersSent) {
          res.status(500).json({
            message: "Koordinat güncellenirken bir hata oluştu",
          });
        }
      }
    });

    ffmpeg(inputStream)
      .toFormat("mp3")
      .on("start", () => {
        console.log("Conversion started");
      })
      .on("progress", (progress) => {
        if (progress.percent) {
          console.log(`Processing: ${progress.percent}% done`);
        }
      })
      .on("error", (err) => {
        console.error("Error converting file:", err);
        if (!res.headersSent) {
          res.status(500).json({
            message: "Dosya dönüştürülürken bir hata oluştu",
          });
        }
        outputStream.end(); // Ensure the output stream is closed on error
      })
      .on("end", () => {
        console.log("Conversion finished");
        outputStream.end();
      })
      .pipe(outputStream, { end: true }); // Ensure the output stream is ended properly
  } catch (error) {
    console.error("Error processing request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
      });
    }
  }
}
async function updateCoordinateNotification(req, res) {
  const { coordinate, date, message, id } = req.body;
  console.log("Cordinate", coordinate);
  try {
    const updateCoordinateUser = await User.findByIdAndUpdate(id, {
      coordinate: coordinate,
      message: message,
      currentDate: date,
    });

    res.status(200).json({
      message: "Koordinat Başarılı Bir Şekilde Alındı",
      data: updateCoordinateUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
    });
  }
}

async function getAllEmergency(req, res) {
  try {
    const users = await User.find({ statue: false });

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "Acil durum çağrısı yapan kullanıcı bulunamadı",
      });
    }

    const usersWithRecordUrls = await Promise.all(
      users.map(async (user) => {
        let base64Audio = null;
        let base64Image = null;

        if (user.record) {
          base64Audio = user.record.toString("base64");
        }
        if (user.image) {
          base64Image = user.image;
        }

        return {
          ...user._doc,
          recordUrl: base64Audio
            ? `data:audio/mp3;base64,${base64Audio}`
            : null,
          imageUrl: base64Image
            ? `data:image/jpeg;base64,${base64Image}`
            : null,
        };
      })
    );

    res.status(200).json({
      message: "Acil durum çağrısı yapan kullanıcılar başarıyla alındı",
      data: usersWithRecordUrls,
    });
  } catch (error) {
    console.error("Error fetching emergency users:", error);
    res.status(500).json({
      message:
        "Acil durum çağrısı yapan kullanıcılar alınırken bir hata oluştu",
    });
  }
}

async function handleEmergency(req, res) {
  const { userId, teamId } = req.body;

  try {
    // Update the user with the specified user ID
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { team: teamId, isRescued: false } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
      });
    }
    const team = await Team.findByIdAndUpdate(
      teamId,
      { $set: { isOnTask: true } },
      { new: true }
    );
    res.status(200).json({
      message: "Acil durum güncellemesi başarıyla yapıldı",
      data: user,
    });
  } catch (error) {
    console.error("Error handling emergency:", error);
    res.status(500).json({
      message: "Acil durum güncellemesi sırasında bir hata oluştu",
    });
  }
}

module.exports = {
  updateCoordinate,
  getAllEmergency,
  handleEmergency,
  updateCoordinateNotification,
  uploadMiddleware: upload.fields([
    { name: "record", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
};
