require("dotenv").config();

const express       = require("express");
const cors          = require("cors");
const connectDB     = require("./config/database");

const analyzeRoutes = require("./routes/analyzeRoutes");
const authRoutes    = require("./routes/authRoutes");
const journalRoutes = require("./routes/journalRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/analyze",  analyzeRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/journals", journalRoutes);

app.get("/", (req, res) => res.send("Backend is running 🚀"));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
  });
});
