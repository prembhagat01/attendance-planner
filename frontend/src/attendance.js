// All attendance maths lives here, so it is easy to explain and test.

// Current attendance percentage
export function getPercent(attended, total) {
  if (total === 0) return 100;
  return (attended / total) * 100;
}

// How many classes can I still miss and stay at or above the required %?
// Solve: attended / (total + x) >= required / 100
export function safeBunks(attended, total, required) {
  const x = Math.floor((attended * 100) / required - total);
  return x > 0 ? x : 0;
}

// How many classes in a row must I attend to reach the required %?
// Solve: (attended + y) / (total + y) >= required / 100
export function classesNeeded(attended, total, required) {
  if (getPercent(attended, total) >= required) return 0;
  return Math.ceil((required * total - 100 * attended) / (100 - required));
}

// Status decides the colour and message on the card
export function getStatus(attended, total, required) {
  const percent = getPercent(attended, total);
  if (percent < required) return "danger";
  if (safeBunks(attended, total, required) <= 1) return "warning";
  return "safe";
}
