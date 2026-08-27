import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const servicesTable = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  titleAr: text("title_ar"),
  descriptionAr: text("description_ar"),
  icon: text("icon").notNull(),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const insertServiceSchema = createInsertSchema(servicesTable).omit({ id: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof servicesTable.$inferSelect;
