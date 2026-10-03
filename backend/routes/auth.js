const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Fill in all fields" });
  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
     role: "student",
  });

  res.json({ token: makeToken(user._id), name: user.name, role: user.role });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Wrong email or password" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong email or password" });

  res.json({ token: makeToken(user._id), name: user.name, role: user.role });
});

module.exports = router;
