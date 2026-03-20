const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  saveJournal,
  getJournals,
  getProgress,
} = require("../controllers/journalController");

// All journal routes require authentication
router.use(authenticate);

router.post("/", saveJournal);           // Save a new journal entry (symptom check)
router.get("/", getJournals);            // Get all journals for logged-in user
router.get("/progress", getProgress);    // Get aggregated progress data

module.exports = router;
