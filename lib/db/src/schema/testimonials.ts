import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const testimonialsTable = pgTable("testimonials", {
  id: serial("id").primaryKey(),
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
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonialsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonialsTable.$inferSelect;
