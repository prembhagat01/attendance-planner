// Runs every day at 8 AM and emails students whose attendance is in danger or on the edge.
const cron = require("node-cron");
const Subject = require("../models/Subject");
const { getPercent, classesNeeded, getStatus } = require("./attendance");
const { sendEmail } = require("./sendEmail");

async function sendSubjectAlerts() {
  const subjects = await Subject.find().populate("user", "name email emailVerified");

  // Group the problem subjects by student
  const byStudent = {};
  for (const s of subjects) {
    if (!s.user || s.user.emailVerified === false) continue;

    const status = getStatus(s.attended, s.total, s.required);
    if (status === "safe") continue;

    const percent = getPercent(s.attended, s.total).toFixed(0);
    const line =
      status === "danger"
        ? `${s.name}: ${percent}% (attend the next ${classesNeeded(s.attended, s.total, s.required)} classes to recover)`
        : `${s.name}: ${percent}% (right on the edge, do not miss the next class)`;

    const id = s.user._id.toString();
    if (!byStudent[id]) byStudent[id] = { user: s.user, lines: [] };
    byStudent[id].lines.push(line);
  }

  for (const { user, lines } of Object.values(byStudent)) {
    const text = `Hi ${user.name},\n\nYour attendance needs attention:\n\n${lines.join("\n")}\n\n- Bunkwise`;
    try {
      await sendEmail(user.email, "Attendance alert from Bunkwise", text);
    } catch (err) {
      console.log("Alert email failed:", err.message);
    }
  }
}

function startAlerts() {
  cron.schedule("0 8 * * *", () => {
    sendSubjectAlerts().catch((err) => console.log("Alert job failed:", err.message));
  });
  console.log("Daily alert job scheduled for 8 AM");
}

module.exports = { startAlerts, sendSubjectAlerts };