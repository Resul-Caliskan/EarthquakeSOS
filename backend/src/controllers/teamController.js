// controllers/teamController.js
const Team = require('../models/Team');
const UserWeb = require('../models/userWeb');

exports.createTeam = async (req, res) => {
  try {
    const team = new Team(req.body);
    await team.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addMemberToTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    const userWeb = await UserWeb.findById(req.params.userWebId);
    
    if (!team || !userWeb) {
      return res.status(404).json({ message: 'Team or User not found' });
    }

    // Check if user is already a member of the team
    if (team.members.includes(userWeb._id)) {
      return res.status(400).json({ message: 'User is already a member of this team' });
    }

    team.members.push(userWeb._id);
    userWeb.team = team._id;

    await team.save();
    await userWeb.save();

    res.status(200).json(team);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTeams = async (req, res) => {
    try {
      const teams = await Team.find().populate('members');
      res.status(200).json(teams);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };