import React from "react";
import { useNavigate } from "react-router-dom";
import SymptomForm from "../components/SymptomForm";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container">

      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          AI-Powered Monitoring
        </div>
        <h1>
          Smart <span className="accent">Recovery</span> Monitoring<br />
          After Surgery
        </h1>
        <p className="hero-subtitle">
          Select your current symptoms and let our AI engine analyze your
          post-operative recovery status — instantly and accurately.
        </p>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-value">98.4%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>
          <div className="stat">
            <div className="stat-value">12k+</div>
            <div className="stat-label">Patients Monitored</div>
          </div>
          <div className="stat">
            <div className="stat-value">&lt;2s</div>
            <div className="stat-label">Analysis Time</div>
          </div>
        </div>
      </div>

      {/* Info Chips */}
      <div className="info-strip">
        <div className="info-chip">
          <span className="info-chip-icon">🔒</span>
          <span><strong>Secure</strong> — HIPAA Compliant</span>
        </div>
        <div className="info-chip">
          <span className="info-chip-icon">🧠</span>
          <span><strong>AI-Driven</strong> — Claude-powered analysis</span>
        </div>
        <div className="info-chip">
          <span className="info-chip-icon">📡</span>
          <span><strong>Real-time</strong> — Instant doctor alerts</span>
        </div>
      </div>

      {/* Login banner for guests */}
      {!user && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 20px",
          borderRadius: "var(--radius-md)",
          background: "rgba(0,212,170,0.07)",
          border: "1px solid rgba(0,212,170,0.2)",
          marginBottom: 24,
          flexWrap: "wrap",
        }}>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            💡 <strong style={{ color: "var(--teal)" }}>Log in</strong> to automatically save your check-ins and track your recovery progress over time.
          </p>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button className="btn-ghost" style={{ padding: "7px 14px", fontSize: "0.82rem" }} onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="btn-primary" style={{ padding: "7px 14px", fontSize: "0.82rem" }} onClick={() => navigate("/register")}>
              Create Account
            </button>
          </div>
        </div>
      )}

      {/* Logged-in welcome back */}
      {user && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 20px",
          borderRadius: "var(--radius-md)",
          background: "rgba(0,212,170,0.07)",
          border: "1px solid rgba(0,212,170,0.2)",
          marginBottom: 24,
          flexWrap: "wrap",
        }}>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--text-secondary)" }}>
            ✅ Logged in as <strong style={{ color: "var(--teal)" }}>{user.name}</strong> — your check-ins are being saved automatically.
          </p>
          <button className="btn-secondary" style={{ padding: "7px 14px", fontSize: "0.82rem" }} onClick={() => navigate("/dashboard")}>
            📊 View Dashboard
          </button>
        </div>
      )}

      {/* Form Card */}
      <SymptomForm />

    </div>
  );
};

export default Home;
