import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const blogPostsTable = sqliteTable(
  "blog_posts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    titleAr: text("title_ar"),
    excerpt: text("excerpt").notNull(),
    excerptAr: text("excerpt_ar"),
    content: text("content").notNull().default(""),
    contentAr: text("content_ar"),
    slug: text("slug").notNull(),
    category: text("category"),
    categoryAr: text("category_ar"),
    readingMinutes: integer("reading_minutes").default(5),
    coverImageUrl: text("cover_image_url"),
    tags: text("tags", { mode: "json" })
      .$type<string[]>()
      .notNull()
      .$defaultFn(() => []),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    order: integer("order").notNull().default(0),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    publishedAt: integer("published_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [unique("blog_posts_slug_unique").on(table.slug)],
);
