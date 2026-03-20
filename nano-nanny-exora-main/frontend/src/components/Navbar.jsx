import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate         = useNavigate();
  const location         = useLocation();
  const { user, logout } = useAuth();

  const tabs = [
    { id: "home",      label: "Home",               icon: "🏠", path: "/" },
    { id: "dashboard", label: "Recovery Dashboard",  icon: "📊", path: "/dashboard" },
    { id: "symptoms",  label: "Symptom Check",       icon: "🩺", path: "/" },
  ];

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav className="navbar">
      {/* Logo */}
      <a className="navbar-logo" onClick={() => navigate("/")}>
        <div className="logo-icon">🫀</div>
        <span className="logo-text">Nano<span>Nanny</span></span>
      </a>

      {/* Nav Tabs */}
      <div className="navbar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${location.pathname === tab.path ? "active" : ""}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="nav-tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right Actions */}
      <div className="navbar-actions">
        <button className="notification-btn" title="Alerts">
          🔔
          <span className="notif-dot" />
        </button>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="btn-ghost"
              onClick={() => navigate("/dashboard")}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--teal), var(--blue))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.75rem", fontWeight: 800, color: "#080e1c", flexShrink: 0,
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </span>
              <span style={{ fontSize: "0.85rem", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name?.split(" ")[0]}
              </span>
            </button>
            <button className="btn-login" onClick={handleLogout}>🚪 Logout</button>
          </div>
        ) : (
          <>
            <button className="btn-ghost" onClick={() => navigate("/register")}>Sign Up</button>
            <button className="btn-login" onClick={() => navigate("/login")}>🔐 Login</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
