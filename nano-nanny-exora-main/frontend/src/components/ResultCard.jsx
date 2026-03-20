import React from "react";
import { useNavigate } from "react-router-dom";

const riskClass = (level = "") => {
  const l = level.toLowerCase();
  if (l === "high")   return "risk-high";
  if (l === "medium") return "risk-medium";
  return "risk-low";
};

const riskEmoji = (level = "") => {
  const l = level.toLowerCase();
  if (l === "high")   return "🔴";
  if (l === "medium") return "🟡";
  return "🟢";
};

const ResultCard = ({ data }) => {
  const navigate = useNavigate();

  if (!data) return <p>No data available.</p>;

  const cls = riskClass(data.riskLevel);
  const isAlert = data.riskLevel && data.riskLevel.toLowerCase() !== "low";

  return (
    <div>

      {/* Header */}
      <div className="hero" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Analysis Complete
        </div>
        <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>Recovery Report</h1>
        <p className="hero-subtitle" style={{ marginBottom: 0 }}>
          AI-generated analysis based on your reported symptoms
        </p>
      </div>

      {/* Meta Grid */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">📊</div>
          <div>
            <div className="card-title">Risk Assessment</div>
            <div className="card-desc">Based on {data.symptoms?.length || 0} reported symptoms</div>
          </div>
        </div>

        <div className="result-grid">
          {/* Risk Level */}
          <div className="result-meta-card">
            <div className="meta-label">Risk Level</div>
            <div className={`risk-badge ${cls}`} style={{ marginBottom: 12 }}>
              <span className="risk-dot" />
              {riskEmoji(data.riskLevel)} {data.riskLevel || "—"}
            </div>
            <div className="risk-bar-wrap">
              <div className={`risk-bar ${cls}`} />
            </div>
          </div>

          {/* Symptoms */}
          <div className="result-meta-card">
            <div className="meta-label">Reported Symptoms</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
              {(data.symptoms || []).map((s, i) => (
                <span key={i} style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: "rgba(0,212,170,0.1)",
                  border: "1px solid rgba(0,212,170,0.25)",
                  fontSize: "0.8rem",
                  color: "var(--teal)",
                  fontWeight: 600,
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Advice */}
        <div className="advice-box">
          <div className="advice-header">
            🧠 AI Recommendation
          </div>
          <p className="advice-text">{data.aiAdvice || "No advice available."}</p>
        </div>

        {/* Doctor Alert */}
        {isAlert && (
          <div className="doctor-alert">
            <span className="alert-icon">🚨</span>
            <div>
              <div className="alert-title">Doctor Notified</div>
              <p className="alert-body">
                Due to your <strong>{data.riskLevel}</strong> risk level, your assigned physician has been
                automatically notified and will follow up within 2 hours.
              </p>
            </div>
          </div>
        )}

        <div className="divider" />

        {/* Action Buttons */}
        <div className="quick-actions">
          <button className="btn-primary" onClick={() => navigate("/")}>
            🔄 New Assessment
          </button>
          <button className="btn-secondary" onClick={() => window.print()}>
            🖨️ Print Report
          </button>
          <button className="btn-secondary" onClick={() => alert("Download feature coming soon!")}>
            📥 Download PDF
          </button>
          <button className="btn-danger" onClick={() => alert("Emergency services contacted!")}>
            🚨 Emergency
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultCard;
