const User = require("../models/user");

async function AreYouSafe(req, res) {
  const { statue, id } = req.body;
  try {
    const updateStatue = User.findByIdAndUpdate(id, { statue: statue });
    res.status(200).json({ message: "Durum Başarıyla Güncellendi" });
  } catch (error) {
    res.status(500).json({
      message: "Durum Güncellenirken Bir Hata Oluştu Lütfen Tekrar Deneyiniz",
    });
  }
}

module.exports={AreYouSafe};
