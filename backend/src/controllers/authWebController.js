// controllers/authWebController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userWeb");

exports.register = async (req, res) => {
  try {
    const { email, password, name, surname, phone, address } = req.body;
    const fullName = `${name} ${surname}`;
    // Şifre hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluşturma
    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      phone,
      address,
    });

    await newUser.save();

    res.status(201).json({ message: "Kayıt başarılı" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı veritabanında arama
    const user = await User.findOne({ email });

    // Kullanıcı yoksa hata döndür
    if (!user) {
      return res.status(401).json({ message: "Geçersiz email veya şifre" });
    }

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Geçersiz email veya şifre" });
    }

    // JWT oluştur
    const token = jwt.sign({ userId: user._id }, "şifre", {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
