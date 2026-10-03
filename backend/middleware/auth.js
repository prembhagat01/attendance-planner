const jwt = require("jsonwebtoken");

// Runs before protected routes. Checks the token and attaches the user id to the request.
module.exports = function (req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");

  if (!token) return res.status(401).json({ message: "Please log in first" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Session expired, please log in again" });
  }
};
