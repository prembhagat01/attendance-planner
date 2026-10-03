import { useEffect, useState } from "react";
import { api } from "../api.js";
import { getPercent, getStatus, classesNeeded, safeBunks } from "../attendance.js";
import SubjectCard from "../components/SubjectCard.jsx";

// Empty values for the "Add subject" form
const emptyForm = { name: "", required: 75, attended: 0, total: 0 };

// Decides what the goal box should say
function getGoalMessage(goal, attended, total) {
  if (goal < 1 || goal > 99) return "Enter a goal between 1 and 99";
  if (total === 0) return "Add your subjects to see your plan";

  const needed = classesNeeded(attended, total, goal);
  if (needed > 0) {
    return `Attend the next ${needed} classes in a row to reach ${goal}% overall`;
  }

  const canMiss = safeBunks(attended, total, goal);
  const word = canMiss === 1 ? "class" : "classes";
  return `You are already above ${goal}%. You can miss ${canMiss} more ${word} and still stay there`;
}

export default function Dashboard({ name, onLogout, onAdmin }) {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  // The overall goal is saved in the browser so it stays after a refresh
  const [goal, setGoal] = useState(Number(localStorage.getItem("goal")) || 75);

  // ---------- Talking to the backend ----------
  async function loadSubjects() {
    const data = await api("/subjects");
    setSubjects(data);
  }

  useEffect(() => {
    loadSubjects();
  }, []);

  async function addSubject(e) {
    e.preventDefault();
    try {
      await api("/subjects", "POST", form);
      setForm(emptyForm);
      setError("");
      loadSubjects();
    } catch (err) {
      setError(err.message);
    }
  }

  async function markClass(id, present) {
    await api(`/subjects/${id}/mark`, "POST", { present });
    loadSubjects();
  }

  async function removeSubject(id) {
    await api(`/subjects/${id}`, "DELETE");
    loadSubjects();
  }

  // ---------- Small handlers ----------
  // One function for every input in the form. The input's "name" tells us which field to update.
  function handleFormChange(e) {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? Number(value) : value;
    setForm({ ...form, [name]: newValue });
  }

  function handleGoalChange(e) {
    const value = Number(e.target.value);
    setGoal(value);
    localStorage.setItem("goal", value);
  }

  // ---------- Numbers shown on the page ----------
  // Subjects in danger come first so the student notices them
  const statusOrder = { danger: 0, warning: 1, safe: 2 };
  const sortedSubjects = [...subjects].sort((a, b) => {
    const statusA = getStatus(a.attended, a.total, a.required);
    const statusB = getStatus(b.attended, b.total, b.required);
    return statusOrder[statusA] - statusOrder[statusB];
  });

  const subjectsBelowLimit = subjects.filter(
    (s) => getStatus(s.attended, s.total, s.required) === "danger"
  ).length;

  // Overall attendance across all subjects
  const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
  const overallPercent = getPercent(totalAttended, totalClasses);

  // Goal box
  const goalMessage = getGoalMessage(goal, totalAttended, totalClasses);
  const goalIsValid = goal >= 1 && goal <= 99;
  const needsMoreClasses = goalIsValid && classesNeeded(totalAttended, totalClasses, goal) > 0;

  // ---------- What appears on the screen ----------
  return (
    <div className="dashboard">
      <header>
        <h1>Hi {name}</h1>
        <div className="header-buttons">
          <button className="btn-ghost btn-small" onClick={onAdmin}>
            Admin
          </button>
          <button className="btn-ghost" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>
      {/* Three boxes at the top */}
      <section className="summary">
        <div>
          <strong>{overallPercent.toFixed(0)}%</strong>
          <span>overall attendance</span>
        </div>
        <div>
          <strong>{subjects.length}</strong>
          <span>subjects tracked</span>
        </div>
        <div className={subjectsBelowLimit ? "bad" : ""}>
          <strong>{subjectsBelowLimit}</strong>
          <span>{subjectsBelowLimit ? "below the limit" : "all safe"}</span>
        </div>
      </section>

      {/* Overall goal */}
      <section className="target-box">
        <label>
          My overall attendance goal (%)
          <input type="number" min="1" max="99" value={goal} onChange={handleGoalChange} />
        </label>
        <p className={needsMoreClasses ? "target-text need" : "target-text"}>{goalMessage}</p>
      </section>

      {/* Add subject form */}
      <form className="add-form" onSubmit={addSubject}>
        <label>
          Subject name
          <input
            name="name"
            placeholder="e.g. Operating Systems"
            value={form.name}
            onChange={handleFormChange}
          />
        </label>
        <label>
          Minimum attendance needed (%)
          <input
            name="required"
            type="number"
            placeholder="e.g. 75"
            value={form.required}
            onChange={handleFormChange}
          />
        </label>
        <label>
          Classes attended so far
          <input
            name="attended"
            type="number"
            placeholder="e.g. 12"
            value={form.attended}
            onChange={handleFormChange}
          />
        </label>
        <label>
          Total classes held so far
          <input
            name="total"
            type="number"
            placeholder="e.g. 16"
            value={form.total}
            onChange={handleFormChange}
          />
        </label>
        <button className="btn-main">Add subject</button>
      </form>
      {error && <p className="error">{error}</p>}

      {/* Subject cards */}
      {subjects.length === 0 ? (
        <p className="empty">
          Add your first subject above to see how many classes you can safely skip.
        </p>
      ) : (
        <div className="grid">
          {sortedSubjects.map((subject) => (
            <SubjectCard
              key={subject._id}
              subject={subject}
              onMark={markClass}
              onDelete={removeSubject}
            />
          ))}
        </div>
      )}
    </div>
  );
}