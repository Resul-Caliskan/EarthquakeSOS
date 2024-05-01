const express = require('express');
const router = express.Router();
const earthquakeController = require('../controllers/earthquakeAlertController');

// POST isteği ile gelen earthquake bildirimini işle
router.post('/earthquake', earthquakeController.handleEarthquake);

module.exports = router;