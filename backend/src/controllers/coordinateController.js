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

    // Convert 3GP to MP3 in memory
    const inputStream = new stream.PassThrough();
    inputStream.end(file.buffer);

    const outputStream = new stream.PassThrough();
    const buffers = [];
    outputStream.on("data", (chunk) => buffers.push(chunk));
    outputStream.on("end", async () => {
      const mp3Buffer = Buffer.concat(buffers);

      // Update the user's record field directly
      const updateCoordinateUser = await User.findByIdAndUpdate(
        id,
        {
          coordinate: coordinate,
          message: message,
          record: mp3Buffer, // Directly save the MP3 buffer
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
      const base64Audio = mp3Buffer.toString("base64");
      const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

      // İstemcilere güncelleme mesajı gönder
      io.emit("emergencyWeb", {
        id: updateCoordinateUser._id,
        name: updateCoordinateUser.name,
        message: updateCoordinateUser.message,
        time: updateCoordinateUser.createdAt,
        audioUrl: audioUrl,
        healthInfo: updateCoordinateUser.healthInfo,
        coordinate: updateCoordinateUser.coordinate,
      });

      res.status(200).json({
        message: "Koordinat Başarılı Bir Şekilde Alındı",
        data: updateCoordinateUser,
      });
    });

    ffmpeg(inputStream)
      .toFormat("mp3")
      .on("error", (err) => {
        console.error("Error converting file:", err);
        if (!res.headersSent) {
          res.status(500).json({
            message: "Dosya dönüştürülürken bir hata oluştu",
          });
        }
      })
      .pipe(outputStream);
  } catch (error) {
    console.error("Error updating coordinate:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
      });
    }
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

        if (user.record) {
          base64Audio = user.record.toString("base64");
        }

        return {
          ...user._doc,
          recordUrl: base64Audio
            ? `data:audio/mp3;base64,${base64Audio}`
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

module.exports = {
  updateCoordinate,
  getAllEmergency,
  uploadMiddleware: upload.single("record"),
};

// const config = require("../config/config");
// const User = require("../models/user");
// const { getBucket } = require("../config/mongo");
// const { getSocketIo } = require("../config/notificationConfig");
// const multer = require("multer");
// const path = require("path");
// const ffmpeg = require("fluent-ffmpeg");
// const stream = require("stream");
// const { v4: uuidv4 } = require("uuid");

// // Configure multer to store files in memory
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const BASE_URL = config.BASE_URL || "https://earthquakesos.onrender.com";

// async function updateCoordinate(req, res) {
//   const { coordinate, id, message, date } = req.body;
//   const files = req.files; // Updated to handle multiple files

//   const audioFile = files.find(file => file.fieldname === 'record');
//   const imageFile = files.find(file => file.fieldname === 'image');

//   console.log("Coordinate:", coordinate);
//   try {
//     if (!audioFile) {
//       return res.status(400).json({
//         message: "Ses dosyası yüklenmedi",
//       });
//     }

//     const uniqueAudioFilename = `audio_${uuidv4()}.mp3`;
//     const uniqueImageFilename = imageFile ? `image_${uuidv4()}.jpg` : null;

//     // Convert 3GP to MP3 in memory
//     const inputStream = new stream.PassThrough();
//     inputStream.end(audioFile.buffer);

//     const outputStream = new stream.PassThrough();
//     const buffers = [];
//     outputStream.on("data", (chunk) => buffers.push(chunk));
//     outputStream.on("end", async () => {
//       const mp3Buffer = Buffer.concat(buffers);

//       // Upload the converted file to GridFS
//       const bucket = getBucket();
//       const uploadStream = bucket.openUploadStream(uniqueAudioFilename, {
//         contentType: "audio/mp3",
//       });

//       const readableStream = new stream.PassThrough();
//       readableStream.end(mp3Buffer);

//       readableStream
//         .pipe(uploadStream)
//         .on("error", (err) => {
//           console.error("Error uploading file to GridFS:", err);
//           res.status(500).json({
//             message: "Dosya yüklenirken bir hata oluştu",
//           });
//         })
//         .on("finish", async () => {
//           console.log("Audio file uploaded to GridFS successfully");

//           let imageUploadUrl = null;
//           if (imageFile) {
//             // Upload the image file to GridFS
//             const imageUploadStream = bucket.openUploadStream(uniqueImageFilename, {
//               contentType: "image/jpeg",
//             });

//             const imageReadableStream = new stream.PassThrough();
//             imageReadableStream.end(imageFile.buffer);

//             await new Promise((resolve, reject) => {
//               imageReadableStream
//                 .pipe(imageUploadStream)
//                 .on("error", (err) => {
//                   console.error("Error uploading image to GridFS:", err);
//                   res.status(500).json({
//                     message: "Resim dosyası yüklenirken bir hata oluştu",
//                   });
//                   reject(err);
//                 })
//                 .on("finish", () => {
//                   console.log("Image file uploaded to GridFS successfully");
//                   imageUploadUrl = `${BASE_URL}/datas/${uniqueImageFilename}`;
//                   resolve();
//                 });
//             });
//           }

//           const updateCoordinateUser = await User.findByIdAndUpdate(
//             id,
//             {
//               coordinate: coordinate,
//               message: message,
//               record: uniqueAudioFilename,
//               image: uniqueImageFilename,
//               statue: false,
//               createdAt: date,
//             },
//             { new: true }
//           );

//           if (!updateCoordinateUser) {
//             return res.status(404).json({
//               message: "Kullanıcı bulunamadı",
//             });
//           }

//           // Soket bağlantısını al
//           const io = getSocketIo();

//           // İstemcilere güncelleme mesajı gönder
//           io.emit("emergencyWeb", {
//             id: updateCoordinateUser._id,
//             name: updateCoordinateUser.name,
//             message: updateCoordinateUser.message,
//             time: updateCoordinateUser.createdAt,
//             audioUrl: `${BASE_URL}/datas/${uniqueAudioFilename}`,
//             imageUrl: imageUploadUrl,
//             healthInfo: updateCoordinateUser.healthInfo,
//             coordinate: updateCoordinateUser.coordinate,
//           });

//           res.status(200).json({
//             message: "Koordinat Başarılı Bir Şekilde Alındı",
//             data: updateCoordinateUser,
//           });
//         });
//     });

//     ffmpeg(inputStream)
//       .toFormat("mp3")
//       .on("error", (err) => {
//         console.error("Error converting file:", err);
//         res.status(500).json({
//           message: "Dosya dönüştürülürken bir hata oluştu",
//         });
//       })
//       .pipe(outputStream);
//   } catch (error) {
//     console.error("Error updating coordinate:", error);
//     res.status(500).json({
//       message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
//     });
//   }
// }

// async function getAllEmergency(req, res) {
//   try {
//     // Fetch users with statue set to false
//     const users = await User.find({ statue: false });

//     if (!users || users.length === 0) {
//       return res.status(404).json({
//         message: "Acil durum çağrısı yapan kullanıcı bulunamadı",
//       });
//     }

//     // Fetch audio files from GridFS and convert them to base64
//     const usersWithRecordUrls = await Promise.all(
//       users.map(async (user) => {
//         let base64Audio = null;
//         let imageUrl = null;

//         if (user.record) {
//           const bucket = getBucket();
//           const downloadStream = bucket.openDownloadStreamByName(user.record);

//           const chunks = [];
//           for await (const chunk of downloadStream) {
//             chunks.push(chunk);
//           }

//           const buffer = Buffer.concat(chunks);
//           base64Audio = buffer.toString("base64");
//         }

//         if (user.image) {
//           imageUrl = `${BASE_URL}/datas/${user.image}`;
//         }

//         return {
//           ...user._doc,
//           recordUrl: base64Audio
//             ? `data:audio/mp3;base64,${base64Audio}`
//             : null,
//           imageUrl: imageUrl,
//         };
//       })
//     );

//     // Return the user data with audio files as base64
//     res.status(200).json({
//       message: "Acil durum çağrısı yapan kullanıcılar başarıyla alındı",
//       data: usersWithRecordUrls,
//     });
//   } catch (error) {
//     console.error("Error fetching emergency users:", error);
//     res.status(500).json({
//       message:
//         "Acil durum çağrısı yapan kullanıcılar alınırken bir hata oluştu",
//     });
//   }
// }

// module.exports = {
//   updateCoordinate,
//   getAllEmergency,
//   uploadMiddleware: upload.fields([
//     { name: 'record', maxCount: 1 },
//     { name: 'image', maxCount: 1 },
//   ]),
// };

// const config = require("../config/config");
// const User = require("../models/user");
// const { getBucket } = require("../config/mongo");
// const { getSocketIo } = require("../config/notificationConfig");
// const multer = require("multer");
// const path = require("path");
// const ffmpeg = require("fluent-ffmpeg");
// const stream = require("stream");
// const { v4: uuidv4 } = require("uuid");

// // Configure multer to store files in memory
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const BASE_URL = config.BASE_URL || "https://earthquakesos.onrender.com";

// async function updateCoordinate(req, res) {
//   const { coordinate, id, message, date } = req.body;
//   const files = req.files; // Updated to handle multiple files

//   const audioFile = files['record'] ? files['record'][0] : null;
//   const imageFile = files['image'] ? files['image'][0] : null;

//   console.log("Coordinate:", coordinate);
//   try {
//     if (!audioFile) {
//       return res.status(400).json({
//         message: "Ses dosyası yüklenmedi",
//       });
//     }

//     const uniqueAudioFilename = `audio_${uuidv4()}.mp3`;
//     const uniqueImageFilename = imageFile ? `image_${uuidv4()}.jpg` : null;

//     // Convert 3GP to MP3 in memory
//     const inputStream = new stream.PassThrough();
//     inputStream.end(audioFile.buffer);

//     const outputStream = new stream.PassThrough();
//     const buffers = [];
//     outputStream.on("data", (chunk) => buffers.push(chunk));
//     outputStream.on("end", async () => {
//       const mp3Buffer = Buffer.concat(buffers);

//       // Upload the converted file to GridFS
//       const bucket = getBucket();
//       const uploadStream = bucket.openUploadStream(uniqueAudioFilename, {
//         contentType: "audio/mp3",
//       });

//       const readableStream = new stream.PassThrough();
//       readableStream.end(mp3Buffer);

//       readableStream
//         .pipe(uploadStream)
//         .on("error", (err) => {
//           console.error("Error uploading file to GridFS:", err);
//           res.status(500).json({
//             message: "Dosya yüklenirken bir hata oluştu",
//           });
//         })
//         .on("finish", async () => {
//           console.log("Audio file uploaded to GridFS successfully");

//           let imageUploadUrl = null;
//           if (imageFile) {
//             // Upload the image file to GridFS
//             const imageUploadStream = bucket.openUploadStream(uniqueImageFilename, {
//               contentType: "image/jpeg",
//             });

//             const imageReadableStream = new stream.PassThrough();
//             imageReadableStream.end(imageFile.buffer);

//             await new Promise((resolve, reject) => {
//               imageReadableStream
//                 .pipe(imageUploadStream)
//                 .on("error", (err) => {
//                   console.error("Error uploading image to GridFS:", err);
//                   res.status(500).json({
//                     message: "Resim dosyası yüklenirken bir hata oluştu",
//                   });
//                   reject(err);
//                 })
//                 .on("finish", () => {
//                   console.log("Image file uploaded to GridFS successfully");
//                   imageUploadUrl = `${BASE_URL}/datas/${uniqueImageFilename}`;
//                   resolve();
//                 });
//             });
//           }

//           const updateCoordinateUser = await User.findByIdAndUpdate(
//             id,
//             {
//               coordinate: coordinate,
//               message: message,
//               record: uniqueAudioFilename,
//               image: uniqueImageFilename,
//               statue: false,
//               createdAt: date,
//             },
//             { new: true }
//           );

//           if (!updateCoordinateUser) {
//             return res.status(404).json({
//               message: "Kullanıcı bulunamadı",
//             });
//           }

//           // Soket bağlantısını al
//           const io = getSocketIo();

//           // İstemcilere güncelleme mesajı gönder
//           io.emit("emergencyWeb", {
//             id: updateCoordinateUser._id,
//             name: updateCoordinateUser.name,
//             message: updateCoordinateUser.message,
//             time: updateCoordinateUser.createdAt,
//             audioUrl: `${BASE_URL}/datas/${uniqueAudioFilename}`,
//             imageUrl: imageUploadUrl,
//             healthInfo: updateCoordinateUser.healthInfo,
//             coordinate: updateCoordinateUser.coordinate,
//           });

//           res.status(200).json({
//             message: "Koordinat Başarılı Bir Şekilde Alındı",
//             data: updateCoordinateUser,
//           });
//         });
//     });

//     ffmpeg(inputStream)
//       .toFormat("mp3")
//       .on("error", (err) => {
//         console.error("Error converting file:", err);
//         res.status(500).json({
//           message: "Dosya dönüştürülürken bir hata oluştu",
//         });
//       })
//       .pipe(outputStream);
//   } catch (error) {
//     console.error("Error updating coordinate:", error);
//     res.status(500).json({
//       message: "Koordinat Alınırken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
//     });
//   }
// }

// async function getAllEmergency(req, res) {
//   try {
//     // Fetch users with statue set to false
//     const users = await User.find({ statue: false });

//     if (!users || users.length === 0) {
//       return res.status(404).json({
//         message: "Acil durum çağrısı yapan kullanıcı bulunamadı",
//       });
//     }

//     // Fetch audio files from GridFS and convert them to base64
//     const usersWithRecordUrls = await Promise.all(
//       users.map(async (user) => {
//         let base64Audio = null;
//         let imageUrl = null;

//         if (user.record) {
//           const bucket = getBucket();
//           const downloadStream = bucket.openDownloadStreamByName(user.record);

//           const chunks = [];
//           for await (const chunk of downloadStream) {
//             chunks.push(chunk);
//           }

//           const buffer = Buffer.concat(chunks);
//           base64Audio = buffer.toString("base64");
//         }

//         if (user.image) {
//           imageUrl = `${BASE_URL}/datas/${user.image}`;
//         }

//         return {
//           ...user._doc,
//           recordUrl: base64Audio
//             ? `data:audio/mp3;base64,${base64Audio}`
//             : null,
//           imageUrl: imageUrl,
//         };
//       })
//     );

//     // Return the user data with audio files as base64
//     res.status(200).json({
//       message: "Acil durum çağrısı yapan kullanıcılar başarıyla alındı",
//       data: usersWithRecordUrls,
//     });
//   } catch (error) {
//     console.error("Error fetching emergency users:", error);
//     res.status(500).json({
//       message:
//         "Acil durum çağrısı yapan kullanıcılar alınırken bir hata oluştu",
//     });
//   }
// }

// module.exports = {
//   updateCoordinate,
//   getAllEmergency,
//   uploadMiddleware: upload.fields([
//     { name: 'record', maxCount: 1 },
//     { name: 'image', maxCount: 1 },
//   ]),
// };
