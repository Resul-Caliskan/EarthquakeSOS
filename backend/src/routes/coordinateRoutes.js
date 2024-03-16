const express = require("express");
const coordinateRoutes = require("../controllers/coordinateController");
const router = express.Router();

router.put("/coordinate/send-my-coordinate", coordinateRoutes.updateCoordinate);

module.exports = router;
