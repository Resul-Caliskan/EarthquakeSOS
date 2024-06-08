// routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.post('/teams', teamController.createTeam);
router.post('/teams/:teamId/members/:userWebId', teamController.addMemberToTeam);
router.get('/teams', teamController.getTeams);
module.exports = router;
