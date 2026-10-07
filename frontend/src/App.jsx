import { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [name, setName] = useState(localStorage.getItem("name"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  // The admin page opens only when you type /admin in the address bar
  const isAdminPage = window.location.pathname === "/admin";

  function handleLogin(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("role", data.role);
    setName(data.name);
    setRole(data.role);
  }

  function handleLogout() {
    localStorage.clear();
    setName(null);
    setRole(null);
  }

  // Decide which page to show
  let page;
  if (role === "admin") {
    page = <AdminDashboard name={name} onLogout={handleLogout} />;
  } else if (isAdminPage) {
    page = <AdminLogin onLogin={handleLogin} onBack={() => (window.location.href = "/")} />;
  } else if (!name) {
    page = <Login onLogin={handleLogin} />;
  } else {
    page = <Dashboard name={name} onLogout={handleLogout} />;
  }

  return (
    <div className="app">
      {page}
      <Footer />
    </div>
  );
}