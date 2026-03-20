import React from "react";

const CheckboxList = ({ options = [], selected = [], setSelected }) => {
  const handleChange = (value) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((item) => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <>
      <div className="symptom-grid">
        {options.map((option, index) => {
          const isActive = selected.includes(option);
          return (
            <label
              key={index}
              className={`symptom-pill ${isActive ? "active" : ""}`}
              
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => handleChange(option)}
              />
              <span className="pill-check">
                {isActive ? "✓" : ""}
              </span>
              {option}
            </label>
          );
        })}
      </div>
      <p className="selected-count">
        <span>{selected.length}</span> symptom{selected.length !== 1 ? "s" : ""} selected
      </p>
    </>
  );
};

export default CheckboxList;
