const express = require('express');
const router = express.Router();
const { updateCoordinate, uploadMiddleware } = require('../controllers/yourController');

router.put('/coordinate/send-my-coordinate', uploadMiddleware, updateCoordinate);

module.exports = router;
