import { useState } from "react";
import { getPercent, safeBunks, classesNeeded, getStatus } from "../attendance.js";

export default function SubjectCard({ subject, onMark, onDelete }) {
  const { _id, name, attended, total, required } = subject;

  const [skip, setSkip] = useState(0); // what-if: classes I might skip
  const [target, setTarget] = useState(required); // my own target % for this subject

  const percent = getPercent(attended, total);
  const status = getStatus(attended, total, required);
  const bunks = safeBunks(attended, total, required);
  const needed = classesNeeded(attended, total, required);

  // What-if: my percentage after skipping some classes
  const afterSkip = getPercent(attended, total + skip);

  // Target calculator: classes to attend (or skip) for my own target %
  const targetIsValid = target >= 1 && target <= 99;
  const neededForTarget = targetIsValid ? classesNeeded(attended, total, target) : 0;
  const spareForTarget = targetIsValid ? safeBunks(attended, total, target) : 0;

  let targetMessage;
  if (!targetIsValid) {
    targetMessage = "Enter a target between 1 and 99";
  } else if (neededForTarget > 0) {
    targetMessage = `Attend the next ${neededForTarget} classes of this subject in a row to reach ${target}%`;
  } else {
    const word = spareForTarget === 1 ? "class" : "classes";
    targetMessage = `You are already above ${target}%. You can miss ${spareForTarget} more ${word} and stay there`;
  }

  // Circle progress: the stroke length is based on the percentage
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const filled = (Math.min(percent, 100) / 100) * circumference;

  // Message under the circle
  let message;
  if (status === "danger") {
    message = `Attend the next ${needed} classes in a row to reach ${required}%`;
  } else if (bunks === 0) {
    message = "Right on the edge. Do not miss the next class";
  } else {
    message = `You can miss ${bunks} more ${bunks === 1 ? "class" : "classes"} safely`;
  }

  return (
    <div className={"card " + status}>
      <div className="card-top">
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r={radius} className="ring-bg" />
          <circle
            cx="55"
            cy="55"
            r={radius}
            className="ring"
            strokeDasharray={`${filled} ${circumference}`}
            transform="rotate(-90 55 55)"
          />
          <text x="55" y="61" textAnchor="middle" className="ring-text">
            {percent.toFixed(0)}%
          </text>
        </svg>
        <div>
          <h3>{name}</h3>
          <p className="count">{attended} of {total} classes attended</p>
          <p className="count">Minimum needed: {required}%</p>
        </div>
      </div>

      <p className="message">{message}</p>

      <div className="actions">
        <button className="btn-present" onClick={() => onMark(_id, true)}>Present</button>
        <button className="btn-absent" onClick={() => onMark(_id, false)}>Absent</button>
      </div>

      {/* What if I skip some classes? */}
      <div className="whatif">
        <label>
          If I skip the next
          <input
            type="number"
            min="0"
            value={skip}
            onChange={(e) => setSkip(Math.max(0, Number(e.target.value)))}
          />
          classes, I will be at <b>{afterSkip.toFixed(1)}%</b>
        </label>
      </div>

      {/* How many classes do I need for my own target? */}
      <div className="whatif">
        <label>
          I want
          <input
            type="number"
            min="1"
            max="99"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          />
          % in this subject
        </label>
        <p className="whatif-result">{targetMessage}</p>
      </div>

      <button className="remove" onClick={() => onDelete(_id)}>Remove subject</button>
    </div>
  );
}