import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const blogPostsTable = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleAr: text("title_ar"),
  excerpt: text("excerpt").notNull(),
  excerptAr: text("excerpt_ar"),
  content: text("content").notNull().default(""),
  contentAr: text("content_ar"),
  slug: text("slug").notNull().unique(),
  coverImageUrl: text("cover_image_url"),
  tags: text("tags").array().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPostsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPostsTable.$inferSelect;
