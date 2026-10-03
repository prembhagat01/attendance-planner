// Same maths as the frontend, used by the teacher dashboard and email alerts.

function getPercent(attended, total) {
  if (total === 0) return 100;
  return (attended / total) * 100;
}

function safeBunks(attended, total, required) {
  const x = Math.floor((attended * 100) / required - total);
  return x > 0 ? x : 0;
}

function classesNeeded(attended, total, required) {
  if (getPercent(attended, total) >= required) return 0;
  return Math.ceil((required * total - 100 * attended) / (100 - required));
}

function getStatus(attended, total, required) {
  if (getPercent(attended, total) < required) return "danger";
  if (safeBunks(attended, total, required) <= 1) return "warning";
  return "safe";
}

module.exports = { getPercent, safeBunks, classesNeeded, getStatus };
