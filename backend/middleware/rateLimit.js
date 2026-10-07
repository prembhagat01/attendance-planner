const rateLimit = require("express-rate-limit");

// Allows only a few tries in a time window. Extra tries get a "429 Too Many Requests" reply.
function limit(minutes, max, message) {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    limit: max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
  });
}

// The numbers are not too small, because many students share one college Wi-Fi address.
exports.loginLimit = limit(15, 30, "Too many login attempts. Please try again in 15 minutes.");
exports.registerLimit = limit(60, 20, "Too many sign ups from this network. Please try again later.");
exports.otpLimit = limit(15, 30, "Too many code attempts. Please try again in 15 minutes.");
exports.resendLimit = limit(10, 10, "Too many requests for a new code. Please wait a few minutes.");
exports.adminLoginLimit = limit(15, 5, "Too many admin login attempts. Try again in 15 minutes.");