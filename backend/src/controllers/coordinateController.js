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
      message: "Koordinat Alınırken Bir hata Oluştu Lütfen Tekrar Deneyiniz",
    });
  }
}

async function getSafetyCoordinates(req,res){
    try {
        
    } catch (error) {
        
    }
}
module.exports = { updateCoordinate };
