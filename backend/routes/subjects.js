const express = require("express");
const Subject = require("../models/Subject");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth); // every route below needs a logged-in user

// GET /api/subjects - all subjects of the logged-in student
router.get("/", async (req, res) => {
  const subjects = await Subject.find({ user: req.userId });
  res.json(subjects);
});

// POST /api/subjects - add a subject (can start with existing attendance)
router.post("/", async (req, res) => {
  const { name, required, attended, total } = req.body;
  if (!name) return res.status(400).json({ message: "Subject name is required" });
  if (required && (required < 1 || required > 99))
    return res.status(400).json({ message: "Required % must be between 1 and 99" });
  if (attended < 0 || total < 0)
    return res.status(400).json({ message: "Numbers cannot be negative" });
  if (Number(attended) > Number(total))
    return res.status(400).json({ message: "Attended cannot be more than total" });

  const subject = await Subject.create({
    user: req.userId,
    name,
    required: required || 75,
    attended: attended || 0,
    total: total || 0,
  });
  res.json(subject);
});

// POST /api/subjects/:id/mark - mark one class as present or absent
router.post("/:id/mark", async (req, res) => {
  const subject = await Subject.findOne({ _id: req.params.id, user: req.userId });
  if (!subject) return res.status(404).json({ message: "Subject not found" });

  subject.total += 1;
  if (req.body.present) subject.attended += 1;
  await subject.save();
  res.json(subject);
});

// DELETE /api/subjects/:id
router.delete("/:id", async (req, res) => {
  await Subject.deleteOne({ _id: req.params.id, user: req.userId });
  res.json({ message: "Deleted" });
});

module.exports = router;
