import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET || "";
  if (isProductionRuntime() && secret.length < 32) {
    throw new Error("JWT_SECRET must be set to at least 32 characters in production.");
  }
  return secret || "local-development-secret-only";
}

export interface AdminPayload {
  username: string;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"],
      issuer: "ibrahimig-admin",
      audience: "ibrahimig-dashboard",
    }) as AdminPayload;
    (req as Request & { admin: AdminPayload }).admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function signAdminToken(username: string): string {
  return jwt.sign({ username }, getJwtSecret(), {
    expiresIn: "2h",
    issuer: "ibrahimig-admin",
    audience: "ibrahimig-dashboard",
  });
}
