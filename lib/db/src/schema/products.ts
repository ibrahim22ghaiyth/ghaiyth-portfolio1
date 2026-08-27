import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  titleAr: text("title_ar"),
  descriptionAr: text("description_ar"),
  tags: text("tags").array().notNull().default([]),
  priceLabel: text("price_label"),
  imageUrl: text("image_url"),
  requestUrl: text("request_url"),
  template: text("template").notNull().default("standard"),
  purchaseLabel: text("purchase_label"),
  purchaseNote: text("purchase_note"),
  deliveryType: text("delivery_type").notNull().default("digital"),
  featured: boolean("featured").notNull().default(false),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
