const User = require("../models/User");

// Use after auth middleware. Only the admin can pass.
module.exports = async function (req, res, next) {
  const user = await User.findById(req.userId);
  if (!user || user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
};