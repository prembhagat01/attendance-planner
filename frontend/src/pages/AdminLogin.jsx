import { useState } from "react";
import { api } from "../api.js";

export default function AdminLogin({ onLogin, onBack }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await api("/admin/login", "POST", form);
      onLogin(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-login">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Admin login</h2>
        <input name="email" type="email" placeholder="Admin email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Admin password" onChange={handleChange} />
        {error && <p className="error">{error}</p>}
        <button className="btn-main">Log in</button>
        <p className="switch" onClick={onBack}>Back</p>
      </form>
    </div>
  );
}