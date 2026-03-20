const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    symptoms:    { type: [String], default: [] },
    description: { type: String, default: "" },
    riskLevel:   { type: String, default: "" },
    aiAdvice:    { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Journal", journalSchema);
