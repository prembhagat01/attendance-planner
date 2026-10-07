const Subject = require("../models/Subject");

// GET /api/subjects - all subjects of the logged-in student
exports.getSubjects = async (req, res) => {
  const subjects = await Subject.find({ user: req.userId });
  res.json(subjects);
};

// POST /api/subjects - add a subject (can start with existing attendance)
exports.addSubject = async (req, res) => {
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
};

// POST /api/subjects/:id/mark - mark one class as present or absent
exports.markClass = async (req, res) => {
  const subject = await Subject.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { $inc: { total: 1, attended: req.body.present ? 1 : 0 } },
    { new: true } // send back the updated subject
  );

  if (!subject) return res.status(404).json({ message: "Subject not found" });
  res.json(subject);
};

// DELETE /api/subjects/:id
exports.deleteSubject = async (req, res) => {
  await Subject.deleteOne({ _id: req.params.id, user: req.userId });
  res.json({ message: "Deleted" });
};