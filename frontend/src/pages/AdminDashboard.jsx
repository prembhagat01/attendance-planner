import { useEffect, useState } from "react";
import { api } from "../api.js";

// Turns "premkumar@gmail.com" into "pr***@gmail.com"
function hideEmail(email) {
  const [first, domain] = email.split("@");
  return first.slice(0, 2) + "***@" + domain;
}

function showDate(date) {
  return new Date(date).toLocaleDateString();
}

export default function AdminDashboard({ name, onLogout }) {
  const [data, setData] = useState(null);
  const [hide, setHide] = useState(true); // emails are hidden by default
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/users")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="dashboard">
        <p className="error">{error}</p>
        <button className="btn-ghost" onClick={onLogout}>Log out</button>
      </div>
    );
  }

  if (!data) return <p className="empty">Loading...</p>;

  return (
    <div className="dashboard">
      <header>
        <h1>Admin: {name}</h1>
        <button className="btn-ghost" onClick={onLogout}>Log out</button>
      </header>

      <section className="summary admin-summary">
        <div>
          <strong>{data.total}</strong>
          <span>registered students</span>
        </div>
        <div>
          <strong>{data.activeThisWeek}</strong>
          <span>active this week</span>
        </div>
        <div>
          <strong>{data.joinedThisWeek}</strong>
          <span>joined this week</span>
        </div>
        <div>
          <strong>{data.subjects}</strong>
          <span>subjects tracked</span>
        </div>
      </section>

      <label className="check">
        <input type="checkbox" checked={hide} onChange={(e) => setHide(e.target.checked)} />
        Hide emails
      </label>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Last active</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{hide ? hideEmail(u.email) : u.email}</td>
                <td>{showDate(u.createdAt)}</td>
                <td>{showDate(u.lastActive)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}