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
const { userCache } = require("../config/userCache");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { getSocketIo } = require("../config/notificationConfig");
const ffmpeg = require("fluent-ffmpeg");

// Multer ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../datas");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, "audio_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Base URL for server
const BASE_URL = config.BASE_URL || "https://earthquakesos.onrender.com"; // Use the appropriate base URL for your server

async function updateCoordinate(req, res) {
  const { coordinate, id, message, date } = req.body;
  const record = req.file ? req.file.filename : "";

  console.log("Coordinate:", coordinate);
  try {
    const updateCoordinateUser = await User.findByIdAndUpdate(
      id,
      {
        coordinate: coordinate,
        message: message,
        record: record,
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

    // Convert 3GP to MP3
    const mp3FilePath = path.join(
      __dirname,
      `../datas/audio_${Date.now()}.mp3`
    );
    ffmpeg(req.file.path)
      .toFormat("mp3")
      .on("end", function () {
        // Soket bağlantısını al
        const io = getSocketIo();

        // İstemcilere güncelleme mesajı gönder
        io.emit("emergencyWeb", {
          id: updateCoordinateUser._id,
          name: updateCoordinateUser.name, // Kullanıcının adını kullanabilirsiniz
          message: updateCoordinateUser.message,
          time: updateCoordinateUser.createdAt,
          audioUrl: `${BASE_URL}/datas/${path.basename(mp3FilePath)}`,
          healthInfo: updateCoordinateUser.healthInfo,
          coordinate: updateCoordinateUser.coordinate,
        });

        res.status(200).json({
          message: "Koordinat Başarılı Bir Şekilde Alındı",
          data: updateCoordinateUser,
        });
      })
      .on("error", function (err) {
        console.error("Error converting file:", err);
        res.status(500).json({
          message: "Dosya dönüştürülürken bir hata oluştu",
        });
      })
      .save(mp3FilePath);
  } catch (error) {
    console.error("Error updating coordinate:", error);
    res.status(500).json({
      message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
    });
  }
}

async function getAllEmergency(req, res) {
  try {
    // Statue değeri false olan tüm kullanıcıları çek
    const users = await User.find({ statue: false });

    // Kullanıcılar bulunamazsa
    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "Acil durum çağrısı yapan kullanıcı bulunamadı",
      });
    }

    // Kullanıcılar bulunduysa, her kullanıcı için record URL'sini oluştur
    const usersWithRecordUrls = users.map((user) => {
      return {
        ...user._doc,
        recordUrl: user.record ? `${BASE_URL}/datas/${user.record}` : null,
      };
    });

    // Kullanıcı bilgilerini döndür
    res.status(200).json({
      message: "Acil durum çağrısı yapan kullanıcılar başarıyla alındı",
      data: usersWithRecordUrls,
    });
  } catch (error) {
    // Hata durumunda logla ve hata mesajını döndür
    console.error("Error fetching emergency users:", error);
    res.status(500).json({
      message:
        "Acil durum çağrısı yapan kullanıcılar alınırken bir hata oluştu",
    });
  }
}

module.exports = {
  getAllEmergency,
  updateCoordinate,
  uploadMiddleware: upload.single("record"),
};
