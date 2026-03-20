const Journal = require("../models/Journal");

// POST /api/journals — save a completed symptom check
exports.saveJournal = async (req, res) => {
  try {
    const { symptoms, description, riskLevel, aiAdvice } = req.body;
    const userId = req.user.id;

    if (!symptoms || !description || !riskLevel)
      return res.status(400).json({ message: "Missing required fields" });

    const entry = await Journal.create({
      userId,
      symptoms,
      description,
      riskLevel,
      aiAdvice: aiAdvice || "",
    });

    res.status(201).json({ journal: entry });
  } catch (err) {
    console.error("Save journal error:", err);
    res.status(500).json({ message: "Could not save journal entry" });
  }
};

// GET /api/journals — all entries for current user (newest first)
exports.getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ journals });
  } catch (err) {
    console.error("Get journals error:", err);
    res.status(500).json({ message: "Could not fetch journals" });
  }
};

// GET /api/journals/progress — aggregated timeline for dashboard
exports.getProgress = async (req, res) => {
  try {
    const rows = await Journal.find({ userId: req.user.id })
      .sort({ createdAt: 1 });

    if (rows.length === 0) {
      return res.json({ entries: [], summary: null });
    }

    const entries = rows.map((r) => ({
      id:           r._id,
      date:         r.createdAt,
      riskLevel:    r.riskLevel,
      symptomCount: r.symptoms.length,
      symptoms:     r.symptoms,
      riskScore:    riskToScore(r.riskLevel),
    }));

    const latest = entries[entries.length - 1];
    const first  = entries[0];

    const riskCounts = { Low: 0, Moderate: 0, Intermediate: 0, Severe: 0 };
    entries.forEach((e) => {
      const key = normaliseRisk(e.riskLevel);
      if (riskCounts[key] !== undefined) riskCounts[key]++;
    });

    const mid      = Math.floor(entries.length / 2);
    const avgFirst = avg(entries.slice(0, mid || 1).map((e) => e.riskScore));
    const avgLast  = avg(entries.slice(mid).map((e) => e.riskScore));
    const trend    = avgLast < avgFirst ? "improving" : avgLast > avgFirst ? "worsening" : "stable";

    const symFreq = {};
    entries.forEach((e) =>
      e.symptoms.forEach((s) => { symFreq[s] = (symFreq[s] || 0) + 1; })
    );
    const topSymptoms = Object.entries(symFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      entries,
      summary: {
        totalEntries:       entries.length,
        firstEntry:         first.date,
        latestEntry:        latest.date,
        currentRisk:        latest.riskLevel,
        trend,
        riskCounts,
        topSymptoms,
        improvementPercent:
          entries.length > 1
            ? Math.round(((avgFirst - avgLast) / avgFirst) * 100)
            : 0,
      },
    });
  } catch (err) {
    console.error("Get progress error:", err);
    res.status(500).json({ message: "Could not fetch progress" });
  }
};

// ── Helpers ──────────────────────────────────────────────
function riskToScore(level = "") {
  const map = { low: 1, moderate: 2, intermediate: 3, severe: 4 };
  return map[level.toLowerCase()] || 1;
}

function normaliseRisk(level = "") {
  const l = level.toLowerCase();
  if (l === "severe")       return "Severe";
  if (l === "intermediate") return "Intermediate";
  if (l === "moderate")     return "Moderate";
  return "Low";
}

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
