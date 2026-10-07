const express = require("express");
const catchErrors = require("../utils/catchErrors");
const controller = require("../controllers/authController");

const router = express.Router();

router.post("/register", catchErrors(controller.register));
router.post("/verify-otp", catchErrors(controller.verifyOtp));
router.post("/resend-otp", catchErrors(controller.resendOtp));
router.post("/login", catchErrors(controller.login));

module.exports = router;