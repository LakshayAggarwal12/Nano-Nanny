const db = require("../config/database");

// POST /api/journals  — save a completed symptom check
exports.saveJournal = (req, res) => {
  try {
    const { symptoms, description, riskLevel, aiAdvice } = req.body;
    const userId = req.user.id;

    if (!symptoms || !description || !riskLevel)
      return res.status(400).json({ message: "Missing required fields" });

    const result = db
      .prepare(
        `INSERT INTO journals (user_id, symptoms, description, risk_level, ai_advice)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(userId, JSON.stringify(symptoms), description, riskLevel, aiAdvice || "");

    const entry = db
      .prepare("SELECT * FROM journals WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json({ journal: parseJournal(entry) });
  } catch (err) {
    console.error("Save journal error:", err);
    res.status(500).json({ message: "Could not save journal entry" });
  }
};

// GET /api/journals  — all entries for current user (newest first)
exports.getJournals = (req, res) => {
  try {
    const rows = db
      .prepare(
        `SELECT * FROM journals WHERE user_id = ? ORDER BY created_at DESC`
      )
      .all(req.user.id);

    res.json({ journals: rows.map(parseJournal) });
  } catch (err) {
    console.error("Get journals error:", err);
    res.status(500).json({ message: "Could not fetch journals" });
  }
};

// GET /api/journals/progress  — aggregated timeline for dashboard
exports.getProgress = (req, res) => {
  try {
    const userId = req.user.id;

    const rows = db
      .prepare(
        `SELECT id, symptoms, risk_level, created_at
         FROM journals WHERE user_id = ?
         ORDER BY created_at ASC`
      )
      .all(userId);

    if (rows.length === 0) {
      return res.json({ entries: [], summary: null });
    }

    // Build timeline entries
    const entries = rows.map((r) => {
      const symptoms = JSON.parse(r.symptoms || "[]");
      return {
        id: r.id,
        date: r.created_at,
        riskLevel: r.risk_level,
        symptomCount: symptoms.length,
        symptoms,
        riskScore: riskToScore(r.risk_level),
      };
    });

    // Summary stats
    const latest = entries[entries.length - 1];
    const first = entries[0];
    const riskCounts = { Low: 0, Moderate: 0, Intermediate: 0, Severe: 0 };
    entries.forEach((e) => {
      const key = normaliseRisk(e.riskLevel);
      if (riskCounts[key] !== undefined) riskCounts[key]++;
    });

    // Trend: compare average score of first half vs second half
    const mid = Math.floor(entries.length / 2);
    const avgFirst = avg(entries.slice(0, mid || 1).map((e) => e.riskScore));
    const avgLast  = avg(entries.slice(mid).map((e) => e.riskScore));
    const trend = avgLast < avgFirst ? "improving" : avgLast > avgFirst ? "worsening" : "stable";

    // All-time symptom frequency
    const symFreq = {};
    entries.forEach((e) =>
      e.symptoms.forEach((s) => {
        symFreq[s] = (symFreq[s] || 0) + 1;
      })
    );
    const topSymptoms = Object.entries(symFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      entries,
      summary: {
        totalEntries: entries.length,
        firstEntry: first.date,
        latestEntry: latest.date,
        currentRisk: latest.riskLevel,
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
function parseJournal(r) {
  return {
    ...r,
    symptoms: JSON.parse(r.symptoms || "[]"),
  };
}

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
