const express = require("express");
const {
  updateCoordinate,
  uploadMiddleware,
  getAllEmergency,
} = require("../controllers/coordinateController");
const router = express.Router();

router.put(
  "/coordinate/send-my-coordinate",
  uploadMiddleware,
  updateCoordinate
);
router.get("/coordinate/emergency", getAllEmergency);

module.exports = router;
