import { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  const [name, setName] = useState(localStorage.getItem("name"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  function handleLogin(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("role", data.role);
    setName(data.name);
    setRole(data.role);
    setShowAdminLogin(false);
  }

  function handleLogout() {
    localStorage.clear();
    setName(null);
    setRole(null);
  }

  if (showAdminLogin) {
    return <AdminLogin onLogin={handleLogin} onBack={() => setShowAdminLogin(false)} />;
  }

  if (!name) {
    return <Login onLogin={handleLogin} />;
  }

  if (role === "admin") {
    return <AdminDashboard name={name} onLogout={handleLogout} />;
  }

  return (
    <Dashboard
      name={name}
      onLogout={handleLogout}
      onAdmin={() => setShowAdminLogin(true)}
    />
  );
}