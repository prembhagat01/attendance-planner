const express = require("express");
const catchErrors = require("../utils/catchErrors");
const controller = require("../controllers/authController");
const { loginLimit, registerLimit, otpLimit, resendLimit } = require("../middleware/rateLimit");

const router = express.Router();

router.post("/register", registerLimit, catchErrors(controller.register));
router.post("/verify-otp", otpLimit, catchErrors(controller.verifyOtp));
router.post("/resend-otp", resendLimit, catchErrors(controller.resendOtp));
router.post("/login", loginLimit, catchErrors(controller.login));

module.exports = router;