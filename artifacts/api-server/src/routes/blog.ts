import { Router } from "express";
import { asc, desc, eq } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";
import { defaultBlogPosts } from "../data/defaultBlogPosts";
import { translateText } from "../lib/gemini";
import { logger } from "../lib/logger";

const router = Router();

function cleanSlug(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || `post-${Date.now()}`;
}

function isUniqueViolation(error: any): boolean {
  if (error?.code === "23505") return true;
  const message = String(error?.message || error?.cause?.message || "");
  return /UNIQUE constraint failed|SQLITE_CONSTRAINT|duplicate key value/i.test(message);
}

function mapPayload(body: any) {
  const title = String(body.title || body.titleAr || "").trim();
  const excerpt = String(body.excerpt || body.excerptAr || "").trim();
  const slug = cleanSlug(String(body.slug || title));

  return {
    title,
    titleAr: body.titleAr ? String(body.titleAr) : null,
    excerpt,
    excerptAr: body.excerptAr ? String(body.excerptAr) : null,
    content: body.content ? String(body.content) : "",
    contentAr: body.contentAr ? String(body.contentAr) : null,
    slug,
    category: body.category ? String(body.category) : null,
    categoryAr: body.categoryAr ? String(body.categoryAr) : null,
    readingMinutes: Number.isFinite(Number(body.readingMinutes)) ? Number(body.readingMinutes) : null,
    coverImageUrl: body.coverImageUrl ? String(body.coverImageUrl) : null,
    tags: Array.isArray(body.tags) ? body.tags.map(String).filter(Boolean) : [],
    featured: Boolean(body.featured),
    order: Number(body.order) || 0,
    active: body.active ?? true,
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
  };
}

let defaultPostsReady: Promise<void> | null = null;

function ensureDefaultBlogPosts() {
  defaultPostsReady ??= (async () => {
    for (const post of defaultBlogPosts) {
      const [existing] = await db
        .select({ id: blogPostsTable.id })
        .from(blogPostsTable)
        .where(eq(blogPostsTable.slug, post.slug));

      if (!existing) {
        await db.insert(blogPostsTable).values({
          ...post,
          tags: [...post.tags],
          publishedAt: new Date(),
        });
      }
    }
  })().catch((error) => {
    defaultPostsReady = null;
    logger.error({ err: error }, "Unable to ensure default blog posts");
    throw error;
  });

  return defaultPostsReady;
}

router.get("/blog-posts", async (_req, res) => {
  await ensureDefaultBlogPosts();
  const posts = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.active, true))
    .orderBy(asc(blogPostsTable.order), desc(blogPostsTable.publishedAt), desc(blogPostsTable.id));
  res.json(posts);
});

router.get("/blog-posts/:slug", async (req, res) => {
  await ensureDefaultBlogPosts();
  const [post] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, String(req.params.slug)));

  if (!post || !post.active) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.json(post);
});

router.get("/admin/blog-posts", requireAdmin, async (_req, res) => {
  await ensureDefaultBlogPosts();
  const posts = await db
    .select()
    .from(blogPostsTable)
    .orderBy(asc(blogPostsTable.order), desc(blogPostsTable.publishedAt), desc(blogPostsTable.id));
  res.json(posts);
});

router.post("/admin/blog-posts", requireAdmin, async (req, res) => {
  const data = mapPayload(req.body);

  if (!data.title || !data.excerpt || !data.slug) {
    res.status(400).json({ error: "title, excerpt, and slug are required" });
    return;
  }

  try {
    const [post] = await db.insert(blogPostsTable).values(data).returning();
    res.status(201).json(post);
  } catch (error: any) {
    logger.error({ err: error }, "Unable to save blog post");
    if (isUniqueViolation(error)) {
      res.status(409).json({ error: "A blog post with this slug already exists" });
      return;
    }
    res.status(500).json({ error: "Unable to save blog post" });
  }
});

router.put("/admin/blog-posts/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const data = mapPayload(req.body);
  if (!data.title || !data.excerpt || !data.slug) {
    res.status(400).json({ error: "title, excerpt, and slug are required" });
    return;
  }

  let post;
  try {
    [post] = await db
      .update(blogPostsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(blogPostsTable.id, id))
      .returning();
  } catch (error: any) {
    logger.error({ err: error }, "Unable to save blog post");
    if (isUniqueViolation(error)) {
      res.status(409).json({ error: "A blog post with this slug already exists" });
      return;
    }
    res.status(500).json({ error: "Unable to save blog post" });
    return;
  }

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.json(post);
});

router.delete("/admin/blog-posts/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
  res.status(204).send();
});

router.post("/admin/blog-posts/translate-missing", requireAdmin, async (req, res) => {
  const batchSize = Math.min(Math.max(Number(req.body?.batchSize) || 4, 1), 8);

  const posts = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.active, true))
    .orderBy(asc(blogPostsTable.order), asc(blogPostsTable.id));

  const needsTranslation = posts.filter(
    (post) =>
      (post.contentAr && !post.content?.trim()) ||
      (post.titleAr && !post.title?.trim()) ||
      (post.excerptAr && !post.excerpt?.trim()),
  );

  const batch = needsTranslation.slice(0, batchSize);
  const translated: Array<{ id: number; slug: string }> = [];
  const errors: Array<{ id: number; slug: string; error: string }> = [];

  for (const post of batch) {
    try {
      const title = post.title?.trim() ? post.title : await translateText(post.titleAr || "", "ar", "en");
      const excerpt = post.excerpt?.trim() ? post.excerpt : await translateText(post.excerptAr || "", "ar", "en");
      const content = post.content?.trim()
        ? post.content
        : await translateText(post.contentAr || "", "ar", "en");

      await db
        .update(blogPostsTable)
        .set({ title, excerpt, content, updatedAt: new Date() })
        .where(eq(blogPostsTable.id, post.id));

      translated.push({ id: post.id, slug: post.slug });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Translation failed";
      logger.error({ err, slug: post.slug }, "Bulk translation failed for post");
      errors.push({ id: post.id, slug: post.slug, error: message });
    }
  }

  const remaining = Math.max(needsTranslation.length - translated.length, 0);
  res.json({ translated, errors, remaining, totalNeedingTranslation: needsTranslation.length });
});

export default router;
