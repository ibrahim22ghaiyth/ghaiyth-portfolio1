import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const envRaw = await readFile(path.resolve(moduleDir, "../.env"), "utf8");
const TOKEN = (envRaw.match(/^CLOUDFLARE_API_TOKEN=(.+)$/m) || [])[1]?.trim();

const ACCOUNT_ID = "b31a79a2f471196e377d61c95b7463d2";
const DB_ID = "ff8c8a1a-70fa-41bd-b9b3-5a8e756883e3";

if (!TOKEN) {
  console.error("CLOUDFLARE_API_TOKEN missing");
  process.exit(1);
}

async function d1Query(sql, params = []) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
  });
  const data = await res.json();
  if (!data.success) {
    console.error("D1 query failed:", JSON.stringify(data.errors, null, 2));
    throw new Error(data.errors?.[0]?.message || "D1 query failed");
  }
  return data.result;
}

const migrationPath = path.resolve(moduleDir, "../artifacts/api-server/migrations/0001_init.sql");
const sql = await readFile(migrationPath, "utf8");
console.log("Applying migration:", migrationPath);
const result = await d1Query(sql);
console.log("Migration applied.", JSON.stringify({ results: result?.[0]?.results?.length ?? 0, success: true }, null, 2));

const tables = await d1Query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
console.log("Tables:", tables[0]?.results?.map((r) => r.name).join(", "));
