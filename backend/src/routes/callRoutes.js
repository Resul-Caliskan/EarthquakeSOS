// routes/callRoutes.js
const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');

router.post('/calls', callController.createCall);
router.post('/calls/:callId/teams/:teamId', callController.assignTeamToCall);

module.exports = router;
