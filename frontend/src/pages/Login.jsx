import { useState } from "react";
import { api } from "../api.js";

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const path = isRegister ? "/auth/register" : "/auth/login";
      const data = await api(path, "POST", form);
      onLogin(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-intro">
        <h1>Know exactly how many classes you can skip.</h1>
        <p>
          Bunkwise tracks every subject, tells you when you are close to a
          shortage, and shows how many classes you need to recover.
        </p>
        <div className="sample-ring">
          <span>3</span>
          <small>classes you can still miss in DBMS</small>
        </div>
      </div>

      <form className="login-card" onSubmit={handleSubmit}>
        <h2>{isRegister ? "Create your account" : "Welcome back"}</h2>
        {isRegister && (
          <input name="name" placeholder="Your name" onChange={handleChange} />
        )}
        <input name="email" type="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        {error && <p className="error">{error}</p>}
        <button className="btn-main">{isRegister ? "Sign up" : "Log in"}</button>
        <p className="switch" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Already have an account? Log in" : "New here? Create an account"}
        </p>
      </form>
    </div>
  );
}