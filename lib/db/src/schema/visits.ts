import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const visitsTable = pgTable("visits", {
  id: serial("id").primaryKey(),
  clientId: text("client_id"),
  country: text("country").notNull().default("Unknown"),
  path: text("path").notNull().default("/"),
  userAgent: text("user_agent").notNull().default(""),
  visitorKey: text("visitor_key").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type VisitRecord = typeof visitsTable.$inferSelect;
