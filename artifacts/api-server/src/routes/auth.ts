import { Router } from "express";
import crypto from "node:crypto";
import { requireAdmin, signAdminToken } from "../middlewares/auth";

const router = Router();

const isProductionRuntime = process.env.NODE_ENV === "production" || Boolean(
  process.env.RAILWAY_ENVIRONMENT_NAME ||
  process.env.RAILWAY_ENVIRONMENT ||
  process.env.RAILWAY_PROJECT_ID,
);

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || (isProductionRuntime ? "" : "admin");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (isProductionRuntime ? "" : "Admin@2024");

if (isProductionRuntime && (!ADMIN_USERNAME || ADMIN_PASSWORD.length < 10)) {
  throw new Error("ADMIN_USERNAME and a strong ADMIN_PASSWORD must be set in production.");
}

function safeCompare(value: string, expected: string): boolean {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  if (valueBuffer.length !== expectedBuffer.length) {
    crypto.timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }
  return crypto.timingSafeEqual(valueBuffer, expectedBuffer);
}

router.post("/auth/login", (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  const normalizedUsername = username?.trim().toLowerCase();
  const normalizedAdminUsername = ADMIN_USERNAME.trim().toLowerCase();
  const normalizedPassword = password?.trim();

  if (!normalizedUsername || !normalizedPassword) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }
  if (safeCompare(normalizedUsername, normalizedAdminUsername) && safeCompare(normalizedPassword, ADMIN_PASSWORD)) {
    const token = signAdminToken(ADMIN_USERNAME);
    res.json({ token, username: ADMIN_USERNAME });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.get("/auth/me", requireAdmin, (req, res) => {
  const admin = (req as typeof req & { admin: { username: string } }).admin;
  res.json({ username: admin.username });
});

export default router;
