import { useState } from "react";
import { getPercent, safeBunks, classesNeeded, getStatus } from "../attendance.js";

export default function SubjectCard({ subject, onMark, onDelete }) {
  const { _id, name, attended, total, required } = subject;
  const [skip, setSkip] = useState(0); // for the what-if simulator

  const percent = getPercent(attended, total);
  const status = getStatus(attended, total, required);
  const bunks = safeBunks(attended, total, required);
  const needed = classesNeeded(attended, total, required);
  const afterSkip = getPercent(attended, total + skip);

  // Circle progress: stroke length is based on the percentage
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const filled = (Math.min(percent, 100) / 100) * circumference;

  let message;
  if (status === "danger") message = `Attend the next ${needed} classes in a row to reach ${required}%`;
  else if (bunks === 0) message = "Right on the edge. Do not miss the next class";
  else message = `You can miss ${bunks} more ${bunks === 1 ? "class" : "classes"} safely`;

  return (
    <div className={"card " + status}>
      <div className="card-top">
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r={radius} className="ring-bg" />
          <circle
            cx="55" cy="55" r={radius} className="ring"
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

      <div className="whatif">
        <label>
          If I skip the next
          <input type="number" min="0" value={skip}
            onChange={(e) => setSkip(Number(e.target.value))} />
          classes, I will be at <b>{afterSkip.toFixed(1)}%</b>
        </label>
      </div>

      <button className="remove" onClick={() => onDelete(_id)}>Remove subject</button>
    </div>
  );
}
