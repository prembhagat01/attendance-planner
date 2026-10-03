const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // stored as a hash, never plain text
  role: { type: String, enum: ["student", "admin"], default: "student" },
});

module.exports = mongoose.model("User", userSchema);
