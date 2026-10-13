import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import type { D1Database } from "@cloudflare/workers-types";
import * as schema from "./schema-sqlite";

export type D1Db = DrizzleD1Database<typeof schema>;

export let db: D1Db;

export function initD1(d1: D1Database): D1Db {
  db = drizzle(d1, { schema });
  return db;
}

export function isD1Initialized(): boolean {
  return Boolean(db);
}

export * from "./schema-sqlite";
