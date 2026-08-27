import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const skillsTable = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  percentage: integer("percentage").notNull(),
  category: text("category").notNull().default("technical"),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const insertSkillSchema = createInsertSchema(skillsTable).omit({ id: true });
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skillsTable.$inferSelect;
