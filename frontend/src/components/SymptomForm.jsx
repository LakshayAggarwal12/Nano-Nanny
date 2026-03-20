import React, { useState } from "react";
import CheckboxList from "./CheckboxList";
import { symptoms } from "../utils/symptomList";
import { analyzeSymptoms } from "../services/api";
import { useNavigate } from "react-router-dom";

const SymptomForm = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClear = () => {
    setSelectedSymptoms([]);
    setDescription("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSymptoms.length === 0) {
      alert("Please select at least one symptom.");
      return;
    }
    if (!description.trim()) {
      alert("Please describe your current condition.");
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeSymptoms({
        symptoms: selectedSymptoms,
        description,
      });

      if (result && result.riskLevel) {
        navigate("/result", { state: result });
      } else {
        alert(result?.message || "No response from server.");
      }
    } catch (error) {
      alert("Backend connection failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* Symptom Selection Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon">🩺</div>
          <div>
            <div className="card-title">Select Your Symptoms</div>
            <div className="card-desc">Check all that apply since your surgery</div>
          </div>
        </div>

        <CheckboxList
          options={symptoms}
          selected={selectedSymptoms}
          setSelected={setSelectedSymptoms}
        />
      </div>

      {/* Description Card */}
      <div className="card" style={{ marginTop: "20px" }}>
        <div className="card-header">
          <div className="card-icon">📝</div>
          <div>
            <div className="card-title">Describe Your Condition</div>
            <div className="card-desc">Provide any additional details about how you feel</div>
          </div>
        </div>

        <label className="field-label">
          <span className="field-label-icon">💬</span>
          Patient Notes
        </label>
        <textarea
          placeholder="e.g. I've had a mild fever since yesterday, with swelling around the incision site..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="divider" />

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="loader-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Analyzing…
              </>
            ) : (
              <>🧠 Analyze Recovery</>
            )}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleClear}
          >
            🔄 Reset Form
          </button>

          <button
            type="button"
            className="btn-danger"
            onClick={() => alert("Emergency contact feature coming soon!")}
          >
            🚨 Emergency
          </button>
        </div>
      </div>

    </form>
  );
};

export default SymptomForm;
