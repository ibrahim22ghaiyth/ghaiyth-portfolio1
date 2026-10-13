import { Router } from "express";
import crypto from "node:crypto";
import { requireAdmin, signAdminToken } from "../middlewares/auth";

const router = Router();

function isProductionRuntime(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    Boolean(
      process.env.RAILWAY_ENVIRONMENT_NAME ||
        process.env.RAILWAY_ENVIRONMENT ||
        process.env.RAILWAY_PROJECT_ID ||
        globalThis.navigator?.userAgent?.includes("Cloudflare-Workers"),
    )
  );
}

function getAdminCredentials(): { username: string; password: string } {
  const production = isProductionRuntime();
  const username = process.env.ADMIN_USERNAME || (production ? "" : "admin");
  const password = process.env.ADMIN_PASSWORD || (production ? "" : "Admin@2024");

  if (production && (!username || password.length < 10)) {
    throw new Error("ADMIN_USERNAME and a strong ADMIN_PASSWORD must be set in production.");
  }

  return { username, password };
}

function safeCompare(value: string, expected: string): boolean {
  const valueHash = crypto.createHash("sha256").update(value, "utf8").digest();
  const expectedHash = crypto.createHash("sha256").update(expected, "utf8").digest();
  return crypto.timingSafeEqual(valueHash, expectedHash);
}

router.post("/auth/login", (req, res) => {
  const { username: ADMIN_USERNAME, password: ADMIN_PASSWORD } = getAdminCredentials();
  const { username, password } = req.body as { username?: string; password?: string };
  const normalizedUsername = username?.trim().toLowerCase();
  const normalizedAdminUsername = ADMIN_USERNAME.trim().toLowerCase();
  const normalizedPassword = password?.trim();

  if (!normalizedUsername || !normalizedPassword) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }
  const usernameMatches = safeCompare(normalizedUsername, normalizedAdminUsername);
  const passwordMatches = safeCompare(normalizedPassword, ADMIN_PASSWORD);
  if (usernameMatches && passwordMatches) {
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
