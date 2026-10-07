const express = require("express");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const catchErrors = require("../utils/catchErrors");
const controller = require("../controllers/adminController");
const { adminLoginLimit } = require("../middleware/rateLimit");

const router = express.Router();

router.post("/login", adminLoginLimit, catchErrors(controller.login));
router.get("/users", auth, catchErrors(adminOnly), catchErrors(controller.getUsers));

module.exports = router;