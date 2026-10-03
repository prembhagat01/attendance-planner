const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Subject = require("../models/Subject");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

const router = express.Router();

// Admin login (there is no register here on purpose)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email, role: "admin" });
  if (!admin) return res.status(400).json({ message: "Wrong email or password" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(400).json({ message: "Wrong email or password" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, name: admin.name, role: "admin" });
});

// All students and a few numbers (only the admin can open this)
router.get("/users", auth, adminOnly, async (req, res) => {
  const users = await User.find({ role: "student" })
    .select("-password") // never send passwords
    .sort({ createdAt: -1 }); // newest first

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeThisWeek = users.filter((u) => u.lastActive >= weekAgo).length;
  const joinedThisWeek = users.filter((u) => u.createdAt >= weekAgo).length;
  const subjects = await Subject.countDocuments();

  res.json({ users, total: users.length, activeThisWeek, joinedThisWeek, subjects });
});

module.exports = router;