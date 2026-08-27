const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const db = require("../db/connection");
const auth = require("../middleware/auth");

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "7d" }
  );
}

router.post("/register", (req, res) => {
  const data = registerSchema.parse(req.body);

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(data.email);
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = bcrypt.hashSync(data.password, 10);
  const result = db.prepare(`
    INSERT INTO users (name, email, password_hash)
    VALUES (?, ?, ?)
  `).run(data.name, data.email, passwordHash);

  const user = db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(result.lastInsertRowid);
  const token = createToken(user);

  res.status(201).json({ user, token });
});

router.post("/login", (req, res) => {
  const data = loginSchema.parse(req.body);

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(data.email);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const ok = bcrypt.compareSync(data.password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = createToken(safeUser);

  res.json({ user: safeUser, token });
});

router.get("/me", auth, (req, res) => {
  const user = db.prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?").get(req.user.id);
  res.json({ user });
});

const changePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(6)
});

router.put("/password", auth, (req, res) => {
  const data = changePasswordSchema.parse(req.body);

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const ok = bcrypt.compareSync(data.current_password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  const newHash = bcrypt.hashSync(data.new_password, 10);
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(newHash, user.id);

  res.json({ message: "Password updated successfully" });
});

module.exports = router;
