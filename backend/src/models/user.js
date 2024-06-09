const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  healthInfo: {
    kronikHastaliklar: [{ type: String }],
    alerjiler: [{ type: String }],
    ilaclar: [{ type: String }],
  },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  isRescued: { type: Boolean },
  coordinate: [{ type: String }],
  statue: { type: Boolean },
  message: { type: String },
  record: { type: Buffer },
  image: { type: Buffer },
  createdAt: { type: Date },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
