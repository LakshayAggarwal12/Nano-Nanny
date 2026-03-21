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

    // ── AI call — never crash the response if this fails ──
    let aiResponse = "Please monitor your symptoms and contact your doctor if your condition worsens.";
    try {
      aiResponse = await analyzeWithAI(symptoms, description);
    } catch (aiErr) {
      console.error("AI call failed (using fallback):", aiErr.message);
    }

    const riskLevel = calculateRisk(symptoms);

    // ── Email — never crash the response if this fails ──
    if (riskLevel === "Intermediate" || riskLevel === "Severe") {
      try {
        await sendDoctorEmail(symptoms, description, riskLevel);
      } catch (emailErr) {
        console.error("Email failed (non-critical):", emailErr.message);
      }
    }

    // ── Auto-save journal if user is authenticated ──
    let journalId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token   = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const entry   = await Journal.create({
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
    console.error("analyzePatientData error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
