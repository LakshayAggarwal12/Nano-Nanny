const { analyzeWithAI } = require("../services/aiService");
const { calculateRisk } = require("../utils/riskLogic");
const { sendDoctorEmail } = require("../services/emailService");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "exora_dev_secret";

exports.analyzePatientData = async (req, res) => {
  try {
    const { symptoms, description } = req.body;

    if (!symptoms || !description) {
      return res.status(400).json({
        message: "Symptoms and description are required",
      });
    }

    const aiResponse = await analyzeWithAI(symptoms, description);
    const riskLevel = calculateRisk(symptoms);

    if (riskLevel === "Intermediate" || riskLevel === "Severe") {
      await sendDoctorEmail(symptoms, description, riskLevel);
    }

    // Auto-save journal if user is authenticated
    let journalId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const result = db
          .prepare(
            `INSERT INTO journals (user_id, symptoms, description, risk_level, ai_advice)
             VALUES (?, ?, ?, ?, ?)`
          )
          .run(decoded.id, JSON.stringify(symptoms), description, riskLevel, aiResponse || "");
        journalId = result.lastInsertRowid;
      } catch {
        // Not authenticated — skip saving
      }
    }

    res.json({ symptoms, riskLevel, aiAdvice: aiResponse, journalId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};