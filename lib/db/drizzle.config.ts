import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { getDatabaseUrl } from "./src/connection-string";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(moduleDir, "../../.env") });

const databaseUrl = getDatabaseUrl();

if (!databaseUrl) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: databaseUrl,
  },
});
