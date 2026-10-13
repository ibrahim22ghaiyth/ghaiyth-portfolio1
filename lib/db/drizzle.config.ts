import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { getDatabaseUrl } from "./src/connection-string";

config();

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
