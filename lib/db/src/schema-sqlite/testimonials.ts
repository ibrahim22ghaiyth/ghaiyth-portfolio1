import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const testimonialsTable = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientName: text("client_name").notNull(),
  clientNameAr: text("client_name_ar"),
  company: text("company").notNull(),
  companyAr: text("company_ar"),
  feedback: text("feedback").notNull(),
  feedbackAr: text("feedback_ar"),
  projectName: text("project_name"),
  projectNameAr: text("project_name_ar"),
  rating: integer("rating").notNull().default(5),
  order: integer("order").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
