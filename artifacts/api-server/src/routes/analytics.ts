import { Router } from "express";
import type { Request } from "express";
import { desc, sql } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { getDatabaseUrl } from "@workspace/db/connection-string";

type MemoryVisit = {
  id: string;
  country: string;
  path: string;
  userAgent: string;
  visitorKey: string;
  clientId: string | null;
  createdAt: Date;
};

type DbModule = typeof import("@workspace/db");

const router = Router();
const visits: MemoryVisit[] = [];
const seenVisitors = new Map<string, number>();
const dbModulePromise: Promise<DbModule | null> = getDatabaseUrl()
  ? import("@workspace/db")
  : Promise.resolve(null);

const getHeader = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
};

const normalizeCountry = (country?: string) => {
  const trimmed = country?.trim();
  if (!trimmed) return "Unknown";
  return trimmed.length > 32 ? trimmed.slice(0, 32) : trimmed;
};

const getVisitPayload = (req: Request) => {
  const clientId = String(req.body?.clientId || "").slice(0, 120);
  const path = String(req.body?.path || "/").slice(0, 250);
  const clientCountry = String(req.body?.country || "");
  const headerCountry =
    getHeader(req.headers["cf-ipcountry"]) ||
    getHeader(req.headers["x-vercel-ip-country"]) ||
    getHeader(req.headers["x-country-code"]);
  const country = normalizeCountry(headerCountry || clientCountry);
  const userAgent = getHeader(req.headers["user-agent"]).slice(0, 300);
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const visitorKey = clientId || `${ip}:${userAgent}`;

  return { clientId: clientId || null, path, country, userAgent, visitorKey };
};

router.post("/analytics/visit", async (req, res) => {
  const payload = getVisitPayload(req);
  const now = Date.now();

  try {
    const dbModule = await dbModulePromise;

    if (dbModule) {
      const { db, visitsTable } = dbModule;
      const windowStart = new Date(now - 30 * 60 * 1000);
      const [recentVisit] = await db
        .select({ id: visitsTable.id })
        .from(visitsTable)
        .where(sql`${visitsTable.visitorKey} = ${payload.visitorKey} and ${visitsTable.createdAt} >= ${windowStart}`)
        .limit(1);

      if (!recentVisit) {
        await db.insert(visitsTable).values(payload);
      }

      res.status(204).send();
      return;
    }
  } catch (error) {
    req.log?.error({ err: error }, "Failed to persist analytics visit");
  }

  const lastSeen = seenVisitors.get(payload.visitorKey);
  const shouldRecord = !lastSeen || now - lastSeen > 30 * 60 * 1000;
  seenVisitors.set(payload.visitorKey, now);

  if (shouldRecord) {
    visits.unshift({
      id: `${now}-${Math.random().toString(36).slice(2)}`,
      ...payload,
      createdAt: new Date(now),
    });

    if (visits.length > 5000) {
      visits.length = 5000;
    }
  }

  res.status(204).send();
});

router.get("/admin/analytics", requireAdmin, async (req, res) => {
  const storageMode = getDatabaseUrl() ? "database" : "memory";

  try {
    const dbModule = await dbModulePromise;

    if (dbModule) {
      const { db, visitsTable } = dbModule;
      const [total] = await db.select({ count: sql<number>`count(*)::int` }).from(visitsTable);
      const countryRows = await db
        .select({
          country: visitsTable.country,
          count: sql<number>`count(*)::int`,
        })
        .from(visitsTable)
        .groupBy(visitsTable.country)
        .orderBy(sql`count(*) desc`);
      const recentVisits = await db
        .select({
          country: visitsTable.country,
          path: visitsTable.path,
          createdAt: visitsTable.createdAt,
        })
        .from(visitsTable)
        .orderBy(desc(visitsTable.createdAt))
        .limit(20);

      res.json({
        storageMode,
        totalVisits: total?.count || 0,
        uniqueCountries: countryRows.length,
        countries: countryRows,
        recentVisits: recentVisits.map((visit) => ({
          country: visit.country,
          path: visit.path,
          createdAt: visit.createdAt.toISOString(),
        })),
      });
      return;
    }
  } catch (error) {
    req.log?.error({ err: error }, "Failed to load persisted analytics");
  }

  const countries = new Map<string, number>();

  for (const visit of visits) {
    countries.set(visit.country, (countries.get(visit.country) || 0) + 1);
  }

  res.json({
    storageMode,
    totalVisits: visits.length,
    uniqueCountries: countries.size,
    countries: [...countries.entries()]
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count),
    recentVisits: visits.slice(0, 20).map((visit) => ({
      country: visit.country,
      path: visit.path,
      createdAt: visit.createdAt.toISOString(),
    })),
  });
});

export default router;
