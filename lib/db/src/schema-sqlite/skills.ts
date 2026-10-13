import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const skillsTable = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  percentage: integer("percentage").notNull(),
  category: text("category").notNull().default("technical"),
  order: integer("order").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});
