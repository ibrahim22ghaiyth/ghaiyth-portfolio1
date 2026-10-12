import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  titleAr: text("title_ar"),
  descriptionAr: text("description_ar"),
  techStack: text("tech_stack").array().notNull().default([]),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  imageUrl: text("image_url"),
  featured: boolean("featured").notNull().default(false),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  status: text("status").notNull().default("live"),
  imageAltEn: text("image_alt_en"),
  imageAltAr: text("image_alt_ar"),
  audienceEn: text("audience_en"),
  audienceAr: text("audience_ar"),
  roleEn: text("role_en"),
  roleAr: text("role_ar"),
  problemEn: text("problem_en"),
  problemAr: text("problem_ar"),
  solutionEn: text("solution_en"),
  solutionAr: text("solution_ar"),
  stackDescEn: text("stack_desc_en"),
  stackDescAr: text("stack_desc_ar"),
  outcomeEn: text("outcome_en"),
  outcomeAr: text("outcome_ar"),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
