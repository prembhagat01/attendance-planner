const express = require("express");
const auth = require("../middleware/auth");
const catchErrors = require("../utils/catchErrors");
const controller = require("../controllers/subjectController");

const router = express.Router();
router.use(auth); // every route below needs a logged-in user

router.get("/", catchErrors(controller.getSubjects));
router.post("/", catchErrors(controller.addSubject));
router.post("/:id/mark", catchErrors(controller.markClass));
router.delete("/:id", catchErrors(controller.deleteSubject));

module.exports = router;