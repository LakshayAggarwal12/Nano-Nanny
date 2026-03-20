import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000/api";

// ── Risk helpers ─────────────────────────────────────────
const riskColor = (level = "") => {
  const l = level.toLowerCase();
  if (l === "severe")       return "var(--red)";
  if (l === "intermediate") return "var(--red)";
  if (l === "moderate")     return "var(--amber)";
  return "var(--green)";
};

const riskBg = (level = "") => {
  const l = level.toLowerCase();
  if (l === "severe" || l === "intermediate") return "rgba(248,113,113,0.10)";
  if (l === "moderate")  return "rgba(251,191,36,0.10)";
  return "rgba(52,211,153,0.10)";
};

const riskEmoji = (level = "") => {
  const l = level.toLowerCase();
  if (l === "severe" || l === "intermediate") return "🔴";
  if (l === "moderate") return "🟡";
  return "🟢";
};

const trendLabel = (t) => ({
  improving: { icon: "📈", text: "Improving", color: "var(--green)" },
  worsening: { icon: "📉", text: "Needs Attention", color: "var(--red)" },
  stable:    { icon: "➡️", text: "Stable", color: "var(--amber)" },
}[t] || { icon: "➡️", text: "Stable", color: "var(--amber)" });

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// ── Mini bar chart ────────────────────────────────────────
const RiskTimeline = ({ entries }) => {
  if (!entries?.length) return null;
  const max = 4;
  const W = 100 / entries.length;

  return (
    <div style={{ padding: "16px 0 0" }}>
      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Risk Score Timeline
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
        {entries.map((e, i) => {
          const h = Math.max(12, (e.riskScore / max) * 72);
          return (
            <div
              key={i}
              title={`${fmtDate(e.date)}: ${e.riskLevel} (${e.symptomCount} symptoms)`}
              style={{
                flex: 1,
                height: h,
                background: riskColor(e.riskLevel),
                borderRadius: "4px 4px 0 0",
                opacity: 0.8,
                transition: "opacity 0.2s",
                cursor: "default",
                minWidth: 6,
              }}
            />
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: "0.7rem", color: "var(--text-muted)" }}>
        <span>{fmtDate(entries[0].date)}</span>
        <span>{fmtDate(entries[entries.length - 1].date)}</span>
      </div>
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────
const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [tab,     setTab]     = useState("overview");  // overview | history

  useEffect(() => {
    if (!token) { navigate("/login"); return; }

    fetch(`${API}/journals/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.message) throw new Error(d.message);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="loader-overlay" style={{ paddingTop: 80 }}>
      <div className="loader-spinner" />
      <p className="loader-text">Loading your recovery data…</p>
    </div>
  );

  if (error) return (
    <div className="container">
      <div className="card" style={{ textAlign: "center", padding: "40px" }}>
        <p style={{ color: "var(--red)", marginBottom: 16 }}>⚠️ {error}</p>
        <button className="btn-primary" onClick={() => navigate("/")}>Back to Home</button>
      </div>
    </div>
  );

  const { entries = [], summary } = data || {};
  const trend = summary ? trendLabel(summary.trend) : null;

  return (
    <div className="container">

      {/* Header */}
      <div className="hero" style={{ paddingTop: 24, paddingBottom: 28 }}>
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Recovery Dashboard
        </div>
        <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>
          Hello, <span className="accent">{user?.name?.split(" ")[0]}</span> 👋
        </h1>
        <p className="hero-subtitle" style={{ marginBottom: 0 }}>
          {summary
            ? `Tracking your recovery across ${summary.totalEntries} check-in${summary.totalEntries !== 1 ? "s" : ""}`
            : "Complete a symptom check to start tracking your recovery"}
        </p>
      </div>

      {/* No data state */}
      {!summary && (
        <div className="card" style={{ textAlign: "center", padding: "48px 32px" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>📋</div>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 10 }}>
            No Recovery Data Yet
          </h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: 28 }}>
            Complete your first symptom check to begin tracking your recovery journey.
            Every check-in you complete while logged in will be saved here automatically.
          </p>
          <button className="btn-primary" style={{ display: "inline-flex", minWidth: 200 }} onClick={() => navigate("/")}>
            🩺 Start First Check-in
          </button>
        </div>
      )}

      {summary && (
        <>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["overview", "history"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={tab === t ? "btn-primary" : "btn-secondary"}
                style={{ padding: "9px 20px", fontSize: "0.88rem" }}
              >
                {t === "overview" ? "📊 Overview" : "📅 History"}
              </button>
            ))}
          </div>

          {/* ── Overview Tab ─────────────────────────────── */}
          {tab === "overview" && (
            <>
              {/* Stats row */}
              <div className="result-grid" style={{ marginBottom: 20 }}>

                <div className="result-meta-card">
                  <div className="meta-label">Current Risk Level</div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "10px 16px", borderRadius: 999, marginTop: 6,
                    background: riskBg(summary.currentRisk),
                    border: `1px solid ${riskColor(summary.currentRisk)}40`,
                    color: riskColor(summary.currentRisk),
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem",
                  }}>
                    {riskEmoji(summary.currentRisk)} {summary.currentRisk}
                  </div>
                </div>

                <div className="result-meta-card">
                  <div className="meta-label">Recovery Trend</div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8, marginTop: 8,
                    color: trend.color, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem",
                  }}>
                    {trend.icon} {trend.text}
                  </div>
                  {summary.improvementPercent !== 0 && (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>
                      {Math.abs(summary.improvementPercent)}%{" "}
                      {summary.improvementPercent > 0 ? "improvement" : "increase"} in risk score
                    </div>
                  )}
                </div>

                <div className="result-meta-card">
                  <div className="meta-label">Total Check-ins</div>
                  <div style={{ fontSize: "2rem", fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--teal)", marginTop: 4 }}>
                    {summary.totalEntries}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
                    Since {fmtDate(summary.firstEntry)}
                  </div>
                </div>

                <div className="result-meta-card">
                  <div className="meta-label">Last Check-in</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginTop: 6 }}>
                    {fmtDate(summary.latestEntry)}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
                    Most recent entry
                  </div>
                </div>
              </div>

              {/* Risk distribution */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                  <div className="card-icon">📊</div>
                  <div>
                    <div className="card-title">Risk Distribution</div>
                    <div className="card-desc">Breakdown of all your check-in risk levels</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {Object.entries(summary.riskCounts).map(([level, count]) => (
                    <div key={level} style={{
                      flex: 1, minWidth: 100, padding: "14px 16px",
                      borderRadius: "var(--radius-md)",
                      background: riskBg(level),
                      border: `1px solid ${riskColor(level)}30`,
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: riskColor(level), fontFamily: "var(--font-display)" }}>
                        {count}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: 2 }}>
                        {level}
                      </div>
                    </div>
                  ))}
                </div>

                <RiskTimeline entries={entries} />
              </div>

              {/* Top symptoms */}
              {summary.topSymptoms?.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <div className="card-icon">🩺</div>
                    <div>
                      <div className="card-title">Most Frequent Symptoms</div>
                      <div className="card-desc">Symptoms reported most across all check-ins</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {summary.topSymptoms.map(({ name, count }) => {
                      const pct = Math.round((count / summary.totalEntries) * 100);
                      return (
                        <div key={name}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.88rem" }}>
                            <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{name}</span>
                            <span style={{ color: "var(--text-muted)" }}>{count}× ({pct}%)</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.07)" }}>
                            <div style={{
                              height: "100%", width: `${pct}%`, borderRadius: 3,
                              background: "linear-gradient(90deg, var(--teal), var(--blue))",
                              transition: "width 0.6s ease",
                            }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="divider" />
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-primary" onClick={() => navigate("/")}>
                      🩺 New Check-in
                    </button>
                    <button className="btn-secondary" onClick={() => setTab("history")}>
                      📅 View Full History
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── History Tab ────────────────────────────────── */}
          {tab === "history" && (
            <div className="card">
              <div className="card-header">
                <div className="card-icon">📅</div>
                <div>
                  <div className="card-title">Check-in History</div>
                  <div className="card-desc">All {entries.length} recorded symptom checks — newest first</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[...entries].reverse().map((entry, i) => (
                  <div key={entry.id} style={{
                    padding: "16px 18px",
                    borderRadius: "var(--radius-md)",
                    background: riskBg(entry.riskLevel),
                    border: `1px solid ${riskColor(entry.riskLevel)}25`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "1.1rem" }}>{riskEmoji(entry.riskLevel)}</span>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: riskColor(entry.riskLevel) }}>
                          {entry.riskLevel}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {fmtDate(entry.date)}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {entry.symptoms.map((s, si) => (
                        <span key={si} style={{
                          padding: "3px 9px", borderRadius: 999, fontSize: "0.75rem",
                          background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)",
                          color: "var(--teal)", fontWeight: 600,
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider" />
              <button className="btn-primary" onClick={() => navigate("/")}>
                🩺 Add New Check-in
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
