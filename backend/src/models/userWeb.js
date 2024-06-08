// models/UserWeb.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  role: { type: String, required: true },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const UserWeb = mongoose.model("UserWeb", userSchema);

module.exports = UserWeb;
