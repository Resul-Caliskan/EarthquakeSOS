const config = require("../config/config");
const User = require("../models/user");
const { userCache } = require("../config/userCache");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

async function updateCoordinate(req, res) {
  const { coordinate, id, message } = req.body;
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
      },
      { new: true }
    );

    if (!updateCoordinateUser) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
      });
    }

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

async function getAllEmergency(req, res) {
  try {
    // Statue değeri false olan tüm kullanıcıları çek
    const users = await User.find({ statue: false });

    // Kullanıcılar bulunamazsa
    if (!users) {
      return res.status(404).json({
        message: "Acil durum çağrısı yapan kullanıcı bulunamadı",
      });
    }

    // Kullanıcılar bulunduysa, tüm kullanıcı bilgilerini döndür
    res.status(200).json({
      message: "Acil durum çağrısı yapan kullanıcılar başarıyla alındı",
      data: users,
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
