// Run this ONE time to create the admin account.
// Usage: node createAdmin.js 'Your Name' you@email.com 'YourStrongPassword'
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function main() {
  const [, , name, email, password] = process.argv;

  if (!name || !email || !password) {
    console.log("Usage: node createAdmin.js 'Your Name' you@email.com 'YourPassword'");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  // Only one admin is allowed. If one exists, stop.
  const existing = await User.findOne({ role: "admin" });
  if (existing) {
    console.log("An admin already exists. Nothing was created.");
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed, role: "admin" });

  console.log("Admin created. You can now log in from the Admin button.");
  process.exit(0);
}

main().catch((err) => {
  console.log("Failed:", err.message);
  process.exit(1);
});