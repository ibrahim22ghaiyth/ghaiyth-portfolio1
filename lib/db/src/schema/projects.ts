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
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;
