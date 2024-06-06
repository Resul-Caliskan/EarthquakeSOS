// routes/authWebRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authWebController");

// Kayıt rotası
router.post("/register", authController.register);

// Giriş rotası
router.post("/login", authController.login);

module.exports = router;
