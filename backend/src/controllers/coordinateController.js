const config = require("../config/config");
const User = require("../models/user");
const { userCache } = require("../config/userCache");

async function updateCoordinate(req, res) {
  const { coordinate, id, message, record } = req.body;
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

async function getSafetyCoordinates(req, res) {
  try {
    // const response= axios.get("güvenli yerler url");
    //const safetyAreas= response.data.safetyAreas;
  } catch (error) {}
}

module.exports = { updateCoordinate };
