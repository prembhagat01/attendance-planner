const mongoose = require("mongoose");

// One document per subject. We only store counts, percentages are calculated on the frontend.
const subjectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  required: { type: Number, default: 75 }, // minimum attendance % needed
  attended: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
});

module.exports = mongoose.model("Subject", subjectSchema);
