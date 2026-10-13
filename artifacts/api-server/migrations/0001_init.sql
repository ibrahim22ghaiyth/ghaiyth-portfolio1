CREATE TABLE IF NOT EXISTS "content" (
  "key" TEXT PRIMARY KEY NOT NULL,
  "value" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'text'
);

CREATE TABLE IF NOT EXISTS "messages" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'unread',
  "created_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "visits" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "client_id" TEXT,
  "country" TEXT NOT NULL DEFAULT 'Unknown',
  "path" TEXT NOT NULL DEFAULT '/',
  "user_agent" TEXT NOT NULL DEFAULT '',
  "visitor_key" TEXT NOT NULL,
  "created_at" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "services" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "title_ar" TEXT,
  "description_ar" TEXT,
  "icon" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "active" INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS "skills" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "name" TEXT NOT NULL,
  "name_ar" TEXT,
  "percentage" INTEGER NOT NULL,
  "category" TEXT NOT NULL DEFAULT 'technical',
  "order" INTEGER NOT NULL DEFAULT 0,
  "active" INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS "projects" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "title_ar" TEXT,
  "description_ar" TEXT,
  "tech_stack" TEXT NOT NULL DEFAULT '[]',
  "live_url" TEXT,
  "github_url" TEXT,
  "image_url" TEXT,
  "featured" INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL DEFAULT 0,
  "active" INTEGER NOT NULL DEFAULT 1,
  "status" TEXT NOT NULL DEFAULT 'live',
  "image_alt_en" TEXT,
  "image_alt_ar" TEXT,
  "audience_en" TEXT,
  "audience_ar" TEXT,
  "role_en" TEXT,
  "role_ar" TEXT,
  "problem_en" TEXT,
  "problem_ar" TEXT,
  "solution_en" TEXT,
  "solution_ar" TEXT,
  "stack_desc_en" TEXT,
  "stack_desc_ar" TEXT,
  "outcome_en" TEXT,
  "outcome_ar" TEXT
);

CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" TEXT NOT NULL,
  "title_ar" TEXT,
  "excerpt" TEXT NOT NULL,
  "excerpt_ar" TEXT,
  "content" TEXT NOT NULL DEFAULT '',
  "content_ar" TEXT,
  "slug" TEXT NOT NULL,
  "category" TEXT,
  "category_ar" TEXT,
  "reading_minutes" INTEGER DEFAULT 5,
  "cover_image_url" TEXT,
  "tags" TEXT NOT NULL DEFAULT '[]',
  "featured" INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL DEFAULT 0,
  "active" INTEGER NOT NULL DEFAULT 1,
  "published_at" INTEGER NOT NULL,
  "created_at" INTEGER NOT NULL,
  "updated_at" INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_slug_unique" ON "blog_posts" ("slug");

CREATE TABLE IF NOT EXISTS "products" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "slug" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "title_ar" TEXT,
  "description_ar" TEXT,
  "tags" TEXT NOT NULL DEFAULT '[]',
  "price_label" TEXT,
  "image_url" TEXT,
  "request_url" TEXT,
  "template" TEXT NOT NULL DEFAULT 'standard',
  "purchase_label" TEXT,
  "purchase_note" TEXT,
  "delivery_type" TEXT NOT NULL DEFAULT 'digital',
  "featured" INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL DEFAULT 0,
  "active" INTEGER NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX IF NOT EXISTS "products_slug_unique" ON "products" ("slug");

CREATE TABLE IF NOT EXISTS "testimonials" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "client_name" TEXT NOT NULL,
  "client_name_ar" TEXT,
  "company" TEXT NOT NULL,
  "company_ar" TEXT,
  "feedback" TEXT NOT NULL,
  "feedback_ar" TEXT,
  "project_name" TEXT,
  "project_name_ar" TEXT,
  "rating" INTEGER NOT NULL DEFAULT 5,
  "order" INTEGER NOT NULL DEFAULT 0,
  "active" INTEGER NOT NULL DEFAULT 1,
  "created_at" INTEGER NOT NULL,
  "updated_at" INTEGER NOT NULL
);
