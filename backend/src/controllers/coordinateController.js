const config = require("../config/config");
const User = require("../models/user");
const { userCache } = require("../config/userCache");

async function updateCoordinate(req, res) {
  const { coordinate, id } = req.body;
  try {
    const updateCoordinateUser = await User.findByIdAndUpdate(id, {
      coordinate: coordinate,
    });

    res.status(200).json({ message: "Koordinat Başarılı Bir Şekilde Alındı" });
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
