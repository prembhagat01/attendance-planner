import { useState } from "react";
import { api } from "../api.js";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login", "register" or "otp"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function sendAgain() {
    try {
      await api("/auth/resend-otp", "POST", { email: form.email });
      setInfo("A new code was sent to " + form.email);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      if (mode === "otp") {
        const data = await api("/auth/verify-otp", "POST", { email: form.email, otp });
        onLogin(data);
      } else if (mode === "register") {
        await api("/auth/register", "POST", form);
        setMode("otp");
        setInfo("We sent a 6-digit code to " + form.email + ". Check your spam folder too.");
      } else {
        const data = await api("/auth/login", "POST", form);
        onLogin(data);
      }
    } catch (err) {
      // A registered but unverified user logging in is sent to the code step
      if (err.data && err.data.needsVerification) {
        setMode("otp");
        setInfo("Please verify your email. Tap 'Send a new code' if you have no code.");
      } else {
        setError(err.message);
      }
    }
  }

  const title =
    mode === "otp" ? "Verify your email" : mode === "register" ? "Create your account" : "Welcome back";

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
        <h2>{title}</h2>

        {mode === "otp" ? (
          <input
            placeholder="6-digit code"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        ) : (
          <>
            {mode === "register" && (
              <input name="name" placeholder="Your name" onChange={handleChange} />
            )}
            <input name="email" type="email" placeholder="Email" onChange={handleChange} />
            <input name="password" type="password" placeholder="Password" onChange={handleChange} />
          </>
        )}

        {info && <p className="info">{info}</p>}
        {error && <p className="error">{error}</p>}

        <button className="btn-main">
          {mode === "otp" ? "Verify" : mode === "register" ? "Sign up" : "Log in"}
        </button>

        {mode === "otp" && (
          <p className="switch" onClick={sendAgain}>Send a new code</p>
        )}

        <p
          className="switch"
          onClick={() => {
            setError("");
            setInfo("");
            setMode(mode === "login" ? "register" : "login");
          }}
        >
          {mode === "login" ? "New here? Create an account" : "Back to log in"}
        </p>
      </form>
    </div>
  );
}