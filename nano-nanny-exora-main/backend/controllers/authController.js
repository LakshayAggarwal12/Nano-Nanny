const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

const JWT_SECRET = process.env.JWT_SECRET || "exora_dev_secret";
const JWT_EXPIRES = "7d";

const signToken = (user) =>
  jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const result = db
      .prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
      .run(name, email, hashed);

    const user = db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ?").get(result.lastInsertRowid);
    const token = signToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    const { password: _, ...safeUser } = user;

    res.json({ user: safeUser, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// GET /api/auth/me  (protected)
exports.getMe = (req, res) => {
  const user = db
    .prepare("SELECT id, name, email, created_at FROM users WHERE id = ?")
    .get(req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};
