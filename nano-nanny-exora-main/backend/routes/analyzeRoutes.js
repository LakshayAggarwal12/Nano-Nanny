const express = require("express");
const router = express.Router();

const { analyzePatientData } = require("../controllers/analyzeController");

router.post("/", analyzePatientData);

module.exports = router;