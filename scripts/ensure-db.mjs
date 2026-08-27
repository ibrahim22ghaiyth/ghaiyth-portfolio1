import { spawnSync } from "node:child_process";

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.DATABASE_PRIVATE_URL ||
  process.env.DATABASE_PUBLIC_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRIVATE_URL ||
  process.env.POSTGRES_PUBLIC_URL ||
  (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE ? "pg-components" : "");

if (!databaseUrl) {
  console.log("DATABASE_URL is not set; skipping database schema sync.");
  process.exit(0);
}

const result = spawnSync("corepack", ["pnpm", "--filter", "@workspace/db", "run", "push"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
