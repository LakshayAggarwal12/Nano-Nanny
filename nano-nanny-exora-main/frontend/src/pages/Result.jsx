import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResultCard from "../components/ResultCard";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center", padding: "56px 40px" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 10 }}>
            No Result Data Found
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: 28 }}>
            Please complete a symptom analysis to see your recovery report.
          </p>
          <button className="btn-primary" style={{ display: "inline-flex", minWidth: 180 }} onClick={() => navigate("/")}>
            🏠 Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <ResultCard data={data} />
    </div>
  );
};

export default Result;
