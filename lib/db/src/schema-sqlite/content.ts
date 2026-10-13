import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contentTable = sqliteTable("content", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  type: text("type").notNull().default("text"),
});
