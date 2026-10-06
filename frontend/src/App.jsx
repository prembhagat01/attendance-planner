import { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Footer from "./components/Footer.jsx";

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

  // Decide which page to show
  let page;
  if (showAdminLogin) {
    page = <AdminLogin onLogin={handleLogin} onBack={() => setShowAdminLogin(false)} />;
  } else if (!name) {
    page = <Login onLogin={handleLogin} />;
  } else if (role === "admin") {
    page = <AdminDashboard name={name} onLogout={handleLogout} />;
  } else {
    page = (
      <Dashboard
        name={name}
        onLogout={handleLogout}
        onAdmin={() => setShowAdminLogin(true)}
      />
    );
  }

  // The footer is shown under every page
  return (
    <div className="app">
      {page}
      <Footer />
    </div>
  );
}