const config = require("../config/config");
const User = require("../models/user");
const { userCache } = require("../config/userCache");
const multer = require("multer");
const path = require("path");

// Multer ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "datas/");
  },
  filename: function (req, file, cb) {
    cb(null, "audio_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

async function updateCoordinate(req, res) {
  const { coordinate, id, message } = req.body;
  const record = req.file ? req.file.filename : "";

  console.log("Cordinate", coordinate);
  try {
    const updateCoordinateUser = await User.findByIdAndUpdate(id, {
      coordinate: coordinate,
      message: message,
      record: record,
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

// Multer middleware'ini ayrı bir nesne olarak dışa aktar
module.exports = {
  updateCoordinate,
  uploadMiddleware: upload.single("record"),
};
