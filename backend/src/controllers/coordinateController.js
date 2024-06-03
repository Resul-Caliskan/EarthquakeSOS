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
// controllers/coordinateController.js
// src/controllers/coordinateController.js


// // Bu Çalışmıştı
// const { ObjectId } = require('mongodb');
// const multer = require('multer');
// const { Readable } = require('stream');
// const path = require('path');
// const config = require("../config/config");
// const User = require("../models/user");
// const { getSocketIo } = require("../config/notificationConfig");
// const { getBucket } = require("../config/mongo");

// // Multer memory storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// async function updateCoordinate(req, res) {
//   const { coordinate, id, message, date } = req.body;
//   let recordId = null;

//   if (req.file) {
//     const readableStream = new Readable();
//     readableStream.push(req.file.buffer);
//     readableStream.push(null);

//     const uploadStream = getBucket().openUploadStream(`audio_${Date.now()}${path.extname(req.file.originalname)}`);
//     readableStream.pipe(uploadStream);

//     uploadStream.on('finish', async () => {
//       recordId = uploadStream.id;

//       try {
//         const updateCoordinateUser = await User.findByIdAndUpdate(
//           id,
//           {
//             coordinate: coordinate,
//             message: message,
//             record: recordId,
//             statue: false,
//             createdAt: date,
//           },
//           { new: true }
//         );

//         if (!updateCoordinateUser) {
//           return res.status(404).json({ message: "Kullanıcı bulunamadı" });
//         }

//         const io = getSocketIo();

//         let audioContent = null;
//         const downloadStream = getBucket().openDownloadStream(recordId);
//         let data = [];

//         downloadStream.on('data', (chunk) => {
//           data.push(chunk);
//         });

//         downloadStream.on('end', () => {
//           audioContent = Buffer.concat(data).toString('base64');

//           io.emit("emergencyWeb", {
//             id: updateCoordinateUser._id,
//             name: updateCoordinateUser.name,
//             message: updateCoordinateUser.message,
//             time: updateCoordinateUser.createdAt,
//             audio: audioContent,
//             healthInfo: updateCoordinateUser.healthInfo,
//             coordinate: updateCoordinateUser.coordinate,
//           });

//           res.status(200).json({
//             message: "Koordinat Başarılı Bir Şekilde Alındı",
//             data: updateCoordinateUser,
//           });
//         });

//         downloadStream.on('error', (error) => {
//           console.error('Error reading file:', error);
//           res.status(500).json({
//             message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
//           });
//         });
//       } catch (error) {
//         console.error("Error updating coordinate:", error);
//         res.status(500).json({
//           message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
//         });
//       }
//     });

//     uploadStream.on('error', (error) => {
//       console.error('Error uploading file:', error);
//       res.status(500).json({
//         message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
//       });
//     });
//   } else {
//     try {
//       const updateCoordinateUser = await User.findByIdAndUpdate(
//         id,
//         {
//           coordinate: coordinate,
//           message: message,
//           record: recordId,
//           statue: false,
//           createdAt: date,
//         },
//         { new: true }
//       );

//       if (!updateCoordinateUser) {
//         return res.status(404).json({ message: "Kullanıcı bulunamadı" });
//       }

//       const io = getSocketIo();

//       io.emit("emergencyWeb", {
//         id: updateCoordinateUser._id,
//         name: updateCoordinateUser.name,
//         message: updateCoordinateUser.message,
//         time: updateCoordinateUser.createdAt,
//         audio: null,
//         healthInfo: updateCoordinateUser.healthInfo,
//         coordinate: updateCoordinateUser.coordinate,
//       });

//       res.status(200).json({
//         message: "Koordinat Başarılı Bir Şekilde Alındı",
//         data: updateCoordinateUser,
//       });
//     } catch (error) {
//       console.error("Error updating coordinate:", error);
//       res.status(500).json({
//         message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
//       });
//     }
//   }
// }

// async function getAllEmergency(req, res) {
//   try {
//     const users = await User.find({ statue: false });

//     if (!users || users.length === 0) {
//       return res.status(404).json({ message: "Acil durum çağrısı yapan kullanıcı bulunamadı" });
//     }

//     const usersWithRecordUrls = await Promise.all(users.map(async (user) => {
//       let audioContent = null;
//       if (user.record) {
//         const downloadStream = getBucket().openDownloadStream(new ObjectId(user.record));
//         let data = [];

//         await new Promise((resolve, reject) => {
//           downloadStream.on('data', (chunk) => {
//             data.push(chunk);
//           });

//           downloadStream.on('end', () => {
//             audioContent = Buffer.concat(data).toString('base64');
//             resolve();
//           });

//           downloadStream.on('error', (error) => {
//             reject(error);
//           });
//         });
//       }

//       return {
//         ...user._doc,
//         record: audioContent,
//       };
//     }));

//     res.status(200).json({
//       message: "Acil durum çağrısı yapan kullanıcılar başarıyla alındı",
//       data: usersWithRecordUrls,
//     });
//   } catch (error) {
//     console.error("Error fetching emergency users:", error);
//     res.status(500).json({
//       message: "Acil durum çağrısı yapan kullanıcılar alınırken bir hata oluştu",
//     });
//   }
// }

// module.exports = {
//   getAllEmergency,
//   updateCoordinate,
//   uploadMiddleware: upload.single("record"),
// };


const { ObjectId } = require('mongodb');
const multer = require('multer');
const { Readable } = require('stream');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const config = require("../config/config");
const User = require("../models/user");
const { getSocketIo } = require("../config/notificationConfig");
const { getBucket } = require("../config/mongo");

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function updateCoordinate(req, res) {
  const { coordinate, id, message, date } = req.body;
  let recordId = null;

  if (req.file) {
    const inputBuffer = req.file.buffer;
    const mp3Buffer = await convertToMp3(inputBuffer);

    const readableStream = new Readable();
    readableStream.push(mp3Buffer);
    readableStream.push(null);

    const uploadStream = getBucket().openUploadStream(`audio_${Date.now()}.mp3`);
    readableStream.pipe(uploadStream);

    uploadStream.on('finish', async () => {
      recordId = uploadStream.id;

      try {
        const updateCoordinateUser = await User.findByIdAndUpdate(
          id,
          {
            coordinate: coordinate,
            message: message,
            record: recordId,
            statue: false,
            createdAt: date,
          },
          { new: true }
        );

        if (!updateCoordinateUser) {
          return res.status(404).json({ message: "Kullanıcı bulunamadı" });
        }

        const io = getSocketIo();

        let audioContent = null;
        const downloadStream = getBucket().openDownloadStream(recordId);
        let data = [];

        downloadStream.on('data', (chunk) => {
          data.push(chunk);
        });

        downloadStream.on('end', () => {
          audioContent = Buffer.concat(data).toString('base64');

          io.emit("emergencyWeb", {
            id: updateCoordinateUser._id,
            name: updateCoordinateUser.name,
            message: updateCoordinateUser.message,
            time: updateCoordinateUser.createdAt,
            audio: audioContent,
            healthInfo: updateCoordinateUser.healthInfo,
            coordinate: updateCoordinateUser.coordinate,
          });

          res.status(200).json({
            message: "Koordinat Başarılı Bir Şekilde Alındı",
            data: updateCoordinateUser,
          });
        });

        downloadStream.on('error', (error) => {
          console.error('Error reading file:', error);
          res.status(500).json({
            message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
          });
        });
      } catch (error) {
        console.error("Error updating coordinate:", error);
        res.status(500).json({
          message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
        });
      }
    });

    uploadStream.on('error', (error) => {
      console.error('Error uploading file:', error);
      res.status(500).json({
        message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
      });
    });
  } else {
    try {
      const updateCoordinateUser = await User.findByIdAndUpdate(
        id,
        {
          coordinate: coordinate,
          message: message,
          record: recordId,
          statue: false,
          createdAt: date,
        },
        { new: true }
      );

      if (!updateCoordinateUser) {
        return res.status(404).json({ message: "Kullanıcı bulunamadı" });
      }

      const io = getSocketIo();

      io.emit("emergencyWeb", {
        id: updateCoordinateUser._id,
        name: updateCoordinateUser.name,
        message: updateCoordinateUser.message,
        time: updateCoordinateUser.createdAt,
        audio: null,
        healthInfo: updateCoordinateUser.healthInfo,
        coordinate: updateCoordinateUser.coordinate,
      });

      res.status(200).json({
        message: "Koordinat Başarılı Bir Şekilde Alındı",
        data: updateCoordinateUser,
      });
    } catch (error) {
      console.error("Error updating coordinate:", error);
      res.status(500).json({
        message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
      });
    }
  }
}

async function convertToMp3(buffer) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    ffmpeg(stream)
      .toFormat('mp3')
      .on('data', (chunk) => {
        chunks.push(chunk);
      })
      .on('end', () => {
        resolve(Buffer.concat(chunks));
      })
      .on('error', (error) => {
        reject(error);
      })
      .run();
  });
}

async function getAllEmergency(req, res) {
  try {
    const users = await User.find({ statue: false });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Acil durum çağrısı yapan kullanıcı bulunamadı" });
    }

    const usersWithRecordUrls = await Promise.all(users.map(async (user) => {
      let audioContent = null;
      if (user.record) {
        const downloadStream = getBucket().openDownloadStream(new ObjectId(user.record));
        let data = [];

        await new Promise((resolve, reject) => {
          downloadStream.on('data', (chunk) => {
            data.push(chunk);
          });

          downloadStream.on('end', () => {
            audioContent = Buffer.concat(data).toString('base64');
            resolve();
          });

          downloadStream.on('error', (error) => {
            reject(error);
          });
        });
      }

      return {
        ...user._doc,
        record: audioContent,
      };
    }));

    res.status(200).json({
      message: "Acil durum çağrısı yapan kullanıcılar başarıyla alındı",
      data: usersWithRecordUrls,
    });
  } catch (error) {
    console.error("Error fetching emergency users:", error);
    res.status(500).json({
      message: "Acil durum çağrısı yapan kullanıcılar alınırken bir hata oluştu",
    });
  }
}

module.exports = {
  getAllEmergency,
  updateCoordinate,
  uploadMiddleware: upload.single("record"),
};
