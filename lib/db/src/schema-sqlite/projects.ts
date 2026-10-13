import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projectsTable = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  titleAr: text("title_ar"),
  descriptionAr: text("description_ar"),
  techStack: text("tech_stack", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .$defaultFn(() => []),
  liveUrl: text("live_url"),
  githubUrl: text("github_url"),
  imageUrl: text("image_url"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  order: integer("order").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
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
