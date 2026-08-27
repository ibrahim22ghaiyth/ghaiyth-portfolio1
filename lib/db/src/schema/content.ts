import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contentTable = pgTable("content", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  type: text("type").notNull().default("text"),
});

export const insertContentSchema = createInsertSchema(contentTable);
export type InsertContent = z.infer<typeof insertContentSchema>;
export type ContentItem = typeof contentTable.$inferSelect;
