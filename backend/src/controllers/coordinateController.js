// const config = require("../config/config");
// const User = require("../models/user");
// const { userCache } = require("../config/userCache");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const { getSocketIo } = require("../config/notificationConfig");

// // Multer ayarları
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const dir = path.join(__dirname, "../datas");
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir);
//     }
//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, "audio_" + Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });

// // Base URL for server
// const BASE_URL = config.BASE_URL || "https://earthquakesos.onrender.com"; // Use the appropriate base URL for your server

// async function updateCoordinate(req, res) {
//   const { coordinate, id, message, date } = req.body;
//   const record = req.file ? req.file.filename : "";

//   console.log("Coordinate:", coordinate);
//   try {
//     const updateCoordinateUser = await User.findByIdAndUpdate(
//       id,
//       {
//         coordinate: coordinate,
//         message: message,
//         record: record,
//         statue: false,
//         createdAt: date,
//       },
//       { new: true }
//     );

//     if (!updateCoordinateUser) {
//       return res.status(404).json({
//         message: "Kullanıcı bulunamadı",
//       });
//     }

//     // Soket bağlantısını al
//     const io = getSocketIo();

//     // İstemcilere güncelleme mesajı gönder
//     io.emit("emergencyWeb", {
//       id: updateCoordinateUser._id,
//       name: updateCoordinateUser.name, // Kullanıcının adını kullanabilirsiniz
//       message: updateCoordinateUser.message,
//       time: updateCoordinateUser.createdAt,
//       audioUrl: updateCoordinateUser.record
//         ? `${BASE_URL}/datas/${updateCoordinateUser.record}`
//         : null,
//       healthInfo: updateCoordinateUser.healthInfo,
//       coordinate: updateCoordinateUser.coordinate,
//     });

//     res.status(200).json({
//       message: "Koordinat Başarılı Bir Şekilde Alındı",
//       data: updateCoordinateUser,
//     });
//   } catch (error) {
//     console.error("Error updating coordinate:", error);
//     res.status(500).json({
//       message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
//     });
//   }
// }

// async function getAllEmergency(req, res) {
//   try {
//     // Statue değeri false olan tüm kullanıcıları çek
//     const users = await User.find({ statue: false });

//     // Kullanıcılar bulunamazsa
//     if (!users || users.length === 0) {
//       return res.status(404).json({
//         message: "Acil durum çağrısı yapan kullanıcı bulunamadı",
//       });
//     }

//     // Kullanıcılar bulunduysa, her kullanıcı için record URL'sini oluştur
//     const usersWithRecordUrls = users.map((user) => {
//       return {
//         ...user._doc,
//         recordUrl: user.record ? `${BASE_URL}/datas/${user.record}` : null,
//       };
//     });

//     // Kullanıcı bilgilerini döndür
//     res.status(200).json({
//       message: "Acil durum çağrısı yapan kullanıcılar başarıyla alındı",
//       data: usersWithRecordUrls,
//     });
//   } catch (error) {
//     // Hata durumunda logla ve hata mesajını döndür
//     console.error("Error fetching emergency users:", error);
//     res.status(500).json({
//       message:
//         "Acil durum çağrısı yapan kullanıcılar alınırken bir hata oluştu",
//     });
//   }
// }

// module.exports = {
//   getAllEmergency,
//   updateCoordinate,
//   uploadMiddleware: upload.single("record"),
// };
const config = require("../config/config");
const User = require("../models/user");
const { getBucket } = require("../config/mongo");
const { getSocketIo } = require("../config/notificationConfig");
const multer = require("multer");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const stream = require("stream");
const { Readable } = require("stream");
const { v4: uuidv4 } = require("uuid");

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const BASE_URL = config.BASE_URL || "https://earthquakesos.onrender.com";

async function updateCoordinate(req, res) {
  const { coordinate, id, message, date } = req.body;
  const file = req.file;

  console.log("Coordinate:", coordinate);
  try {
    if (!file) {
      return res.status(400).json({
        message: "Dosya yüklenmedi",
      });
    }

    // Generate a unique filename
    const uniqueFilename = `audio_${uuidv4()}.mp3`;

    // Convert 3GP to MP3 in memory
    const inputStream = new stream.PassThrough();
    inputStream.end(file.buffer);

    const outputStream = new stream.PassThrough();
    const buffers = [];
    outputStream.on("data", (chunk) => buffers.push(chunk));
    outputStream.on("end", async () => {
      const mp3Buffer = Buffer.concat(buffers);

      // Upload the converted file to GridFS
      const bucket = getBucket();
      const uploadStream = bucket.openUploadStream(uniqueFilename, {
        contentType: "audio/mp3",
      });

      const readableStream = new stream.PassThrough();
      readableStream.end(mp3Buffer);

      readableStream
        .pipe(uploadStream)
        .on("error", (err) => {
          console.error("Error uploading file to GridFS:", err);
          res.status(500).json({
            message: "Dosya yüklenirken bir hata oluştu",
          });
        })
        .on("finish", async () => {
          console.log("File uploaded to GridFS successfully");

          const updateCoordinateUser = await User.findByIdAndUpdate(
            id,
            {
              coordinate: coordinate,
              message: message,
              record: uniqueFilename,
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

          // Soket bağlantısını al
          const io = getSocketIo();

          // İstemcilere güncelleme mesajı gönder
          io.emit("emergencyWeb", {
            id: updateCoordinateUser._id,
            name: updateCoordinateUser.name,
            message: updateCoordinateUser.message,
            time: updateCoordinateUser.createdAt,
            audioUrl: `${BASE_URL}/datas/${uniqueFilename}`,
            healthInfo: updateCoordinateUser.healthInfo,
            coordinate: updateCoordinateUser.coordinate,
          });

          res.status(200).json({
            message: "Koordinat Başarılı Bir Şekilde Alındı",
            data: updateCoordinateUser,
          });
        });
    });

    ffmpeg(inputStream)
      .toFormat("mp3")
      .on("error", (err) => {
        console.error("Error converting file:", err);
        res.status(500).json({
          message: "Dosya dönüştürülürken bir hata oluştu",
        });
      })
      .pipe(outputStream);
  } catch (error) {
    console.error("Error updating coordinate:", error);
    res.status(500).json({
      message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
    });
  }
}

async function getAllEmergency(req, res) {
  try {
    // Fetch users with statue set to false
    const users = await User.find({ statue: false });

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "Acil durum çağrısı yapan kullanıcı bulunamadı",
      });
    }

    // Fetch audio files from GridFS and convert them to base64
    const usersWithRecordUrls = await Promise.all(
      users.map(async (user) => {
        let base64Audio = null;

        if (user.record) {
          const bucket = getBucket();
          const downloadStream = bucket.openDownloadStreamByName(user.record);

          const chunks = [];
          for await (const chunk of downloadStream) {
            chunks.push(chunk);
          }

          const buffer = Buffer.concat(chunks);
          base64Audio = buffer.toString("base64");
        }

        return {
          ...user._doc,
          recordUrl: base64Audio
            ? `data:audio/mp3;base64,${base64Audio}`
            : null,
        };
      })
    );

    // Return the user data with audio files as base64
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

module.exports = {
  updateCoordinate,
  getAllEmergency,
  uploadMiddleware: upload.single("record"),
};
