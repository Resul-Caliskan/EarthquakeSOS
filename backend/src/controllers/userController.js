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

async function saveHealthInfo(req, res) {
  const { userId, healthInfo } = req.body;
  console.log("userId:",userId);
  console.log("Health:",healthInfo);
  try {
    // Find the user by ID and update their health information
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { healthInfo: healthInfo },
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Health information saved successfully" });
  } catch (error) {
    console.error("Error saving health information:", error);
    res
      .status(500)
      .json({ message: "An error occurred while saving health information" });
  }
}
module.exports = { AreYouSafe, saveHealthInfo };
