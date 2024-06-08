// models/Call.js
const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' }
});

const Call = mongoose.model('Call', callSchema);

module.exports = Call;
