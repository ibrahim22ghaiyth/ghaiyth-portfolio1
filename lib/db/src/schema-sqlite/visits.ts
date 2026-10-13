import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const visitsTable = sqliteTable("visits", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientId: text("client_id"),
  country: text("country").notNull().default("Unknown"),
  path: text("path").notNull().default("/"),
  userAgent: text("user_agent").notNull().default(""),
  visitorKey: text("visitor_key").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
