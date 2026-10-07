const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");

const makeToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// Make a 6 digit code, save its hash, and email the code
async function sendOtp(user) {
  const otp = String(crypto.randomInt(100000, 1000000));

  user.otpHash = await bcrypt.hash(otp, 8);
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 minutes
  user.otpAttempts = 0;
  await user.save();

  await sendEmail(
    user.email,
    "Your Bunkwise verification code",
    `Hi ${user.name},\n\nYour verification code is ${otp}. It expires in 10 minutes.\n\n- Bunkwise`
  );
}

// POST /api/auth/register - creates an unverified account and emails a code
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Fill in all fields" });
  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });

  const existing = await User.findOne({ email });
  if (existing && existing.emailVerified)
    return res.status(400).json({ message: "Email already registered" });

  // A half-finished signup (never verified) can try again with new details
  const hashed = await bcrypt.hash(password, 10);
  let user = existing;
  if (user) {
    user.name = name;
    user.password = hashed;
  } else {
    user = new User({ name, email, password: hashed, role: "student", emailVerified: false });
  }

  try {
    await sendOtp(user);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Could not send the verification email. Try again." });
  }

  res.json({ needsVerification: true, email });
};

// POST /api/auth/verify-otp - checks the code and logs the user in
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.otpHash)
    return res.status(400).json({ message: "No verification is pending for this email" });
  if (user.emailVerified)
    return res.status(400).json({ message: "Already verified. Please log in." });
  if (user.otpExpires < new Date())
    return res.status(400).json({ message: "The code expired. Send a new one." });
  if (user.otpAttempts >= 5)
    return res.status(400).json({ message: "Too many wrong tries. Send a new code." });

  const match = await bcrypt.compare(String(otp), user.otpHash);
  if (!match) {
    user.otpAttempts += 1;
    await user.save();
    return res.status(400).json({ message: "Wrong code" });
  }

  user.emailVerified = true;
  user.otpHash = undefined;
  user.otpExpires = undefined;
  user.otpAttempts = 0;
  await user.save();

  res.json({ token: makeToken(user._id), name: user.name, role: user.role });
};

// POST /api/auth/resend-otp - sends a fresh code
exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.emailVerified)
    return res.status(400).json({ message: "No verification is pending for this email" });

  // Allow a new code only 1 minute after the last one
  const msLeft = user.otpExpires ? user.otpExpires - Date.now() : 0;
  if (msLeft > 9 * 60 * 1000)
    return res.status(400).json({ message: "Please wait a minute before asking again" });

  try {
    await sendOtp(user);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Could not send the verification email. Try again." });
  }

  res.json({ message: "Code sent" });
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.role === "admin")
    return res.status(400).json({ message: "Wrong email or password" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong email or password" });

  if (!user.emailVerified)
    return res.status(403).json({
      message: "Please verify your email first",
      needsVerification: true,
      email,
    });

  res.json({ token: makeToken(user._id), name: user.name, role: user.role });
};