const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.put("/user/statue", userController.AreYouSafe);
router.put("/user/health", userController.saveHealthInfo);
module.exports = router;
