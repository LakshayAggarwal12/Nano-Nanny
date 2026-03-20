const { analyzeWithAI }   = require("../services/aiService");
const { calculateRisk }   = require("../utils/riskLogic");
const { sendDoctorEmail } = require("../services/emailService");
const jwt     = require("jsonwebtoken");
const Journal = require("../models/Journal");

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
    const riskLevel  = calculateRisk(symptoms);

    if (riskLevel === "Intermediate" || riskLevel === "Severe") {
      await sendDoctorEmail(symptoms, description, riskLevel);
    }

    // Auto-save journal if user is authenticated
    let journalId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token   = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const entry = await Journal.create({
          userId:      decoded.id,
          symptoms,
          description,
          riskLevel,
          aiAdvice: aiResponse || "",
        });

        journalId = entry._id;
      } catch {
        // Not authenticated or token invalid — skip saving
      }
    }

    res.json({ symptoms, riskLevel, aiAdvice: aiResponse, journalId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
