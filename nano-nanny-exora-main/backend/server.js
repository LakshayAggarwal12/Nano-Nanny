require("dotenv").config();

const express = require("express");
const cors = require("cors");

const analyzeRoutes = require("./routes/analyzeRoutes");
const authRoutes    = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");

// Initialise DB on startup
const connectDB = require("./config/database");
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/analyze",  analyzeRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/journals", journalRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});