const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/user");
const { userCache } = require("../config/userCache");

async function register(req, res) {
  const { email, password, name } = req.body;
  console.log(email + " " + password + " " + name);
  try {
    const user = await User.findOne({ email }); // Kullanıcıyı veritabanından kontrol et
    if (user) {
      return res.status(400).json({
        message:
          "Mail adresi ile giriş kaydolunmuş.\nLütfen başka bir mail adresi ile giriş yapınız.",
      });
    }
    const newUser = new User({
      email,
      password,
      name,
      statue: true,
    });
    newUser.save();
    res.json({ message: "Kayıt olma işlemi başarıyla tamamlandı" });
  } catch (error) {
    res.status(500).json({ message: "Sunucu Hatası", error });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  console.log(email + " " + password);
  try {
    const user = await User.findOne({ email, password }); // Kullanıcıyı veritabanından kontrol et
    console.log("KULLANICI: ", user);
    if (!user) {
      return res.status(400).json({ message: "Geçersiz Kullanıcı Bilgileri" }); // yok ise geçersiz dön
    }
    const id = user._id;
    userCache.set(id.toString(), user); // varsa kullanıcıyı cache'e kaydet

    const accessToken = jwt.sign({ id }, config.secretKey, {
      expiresIn: "365d",
    });

    res.json({
      message: "Giriş İşlemi Başarılı",
      accessToken: accessToken,
      userName: user.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu Hatası", error });
  }
}

module.exports = { login, register };
