const express = require("express");
const {
  updateCoordinate,
  uploadMiddleware,
  getAllEmergency,
  handleEmergency,
  updateCoordinateNotification,
} = require("../controllers/coordinateController");
const router = express.Router();

router.put(
  "/coordinate/send-my-coordinate",
  uploadMiddleware,
  updateCoordinate
);
router.get("/coordinate/emergency", getAllEmergency);
router.put("/coordinate/handle-emergency", handleEmergency);
router.put("/coordinate/notification", updateCoordinateNotification);

module.exports = router;
