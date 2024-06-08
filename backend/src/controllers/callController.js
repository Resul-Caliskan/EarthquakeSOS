// controllers/callController.js
const Call = require('../models/Call');
const Team = require('../models/Team');
const User = require('../models/user');

exports.createCall = async (req, res) => {
  try {
    const call = new Call(req.body);
    await call.save();
    res.status(201).json(call);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.assignTeamToCall = async (req, res) => {
  try {
    const call = await Call.findById(req.params.callId);
    const team = await Team.findById(req.params.teamId);
    if (!call || !team) {
      return res.status(404).json({ message: 'Call or Team not found' });
    }

    call.team = team._id;
    await call.save();

    res.status(200).json(call);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
