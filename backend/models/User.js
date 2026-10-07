const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // stored as a hash, never plain text
    role: { type: String, enum: ["student", "admin"], default: "student" },
    lastActive: { type: Date, default: Date.now },

    // Email verification. Old accounts count as verified (default true).
    emailVerified: { type: Boolean, default: true },
    otpHash: String, // the code is stored as a hash, like a password
    otpExpires: Date,
    otpAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);