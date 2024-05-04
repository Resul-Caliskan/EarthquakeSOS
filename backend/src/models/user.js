const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  coordinate: [{ type: String }],
  statue: { type: Boolean },
  message: { type: String },
  record:{type:String}
});

const User = mongoose.model("User", userSchema);

module.exports = User;
