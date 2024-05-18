const express = require("express");
const { updateCoordinate, uploadMiddleware }= require("../controllers/coordinateController");
const router = express.Router();

router.put('/coordinate/send-my-coordinate', uploadMiddleware, updateCoordinate);

module.exports = router;
