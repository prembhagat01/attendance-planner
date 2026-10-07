const express = require("express");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const catchErrors = require("../utils/catchErrors");
const controller = require("../controllers/adminController");

const router = express.Router();

router.post("/login", catchErrors(controller.login));
router.get("/users", auth, catchErrors(adminOnly), catchErrors(controller.getUsers));

module.exports = router;