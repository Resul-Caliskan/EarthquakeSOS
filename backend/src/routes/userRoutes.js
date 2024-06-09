const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/user/statue", userController.AreYouSafe);
router.post("/user/health", userController.saveHealthInfo);
module.exports = router;
