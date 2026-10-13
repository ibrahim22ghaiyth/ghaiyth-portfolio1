import { getDatabaseUrl } from "@workspace/db/connection-string";
import type { SeoBlogPost } from "./public-pages";

const CACHE_TTL_MS = 30_000;

let cache: { at: number; posts: SeoBlogPost[] } | null = null;

async function loadPosts(): Promise<SeoBlogPost[]> {
  if (getDatabaseUrl()) {
    const { db, blogPostsTable } = await import("@workspace/db");
    const { eq, desc } = await import("drizzle-orm");
    const rows = await db
      .select()
      .from(blogPostsTable)
      .where(eq(blogPostsTable.active, true))
      .orderBy(desc(blogPostsTable.publishedAt), desc(blogPostsTable.id));
    return rows;
  }

  const { loadState } = await import("../lib/file-store");
  const state = loadState();
  return state.blogPosts
    .filter((post: { active: boolean }) => post.active)
    .sort(
      (a: { publishedAt: string }, b: { publishedAt: string }) =>
        Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
    );
}

export async function getSeoBlogPosts(): Promise<SeoBlogPost[]> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.posts;
  try {
    const posts = await loadPosts();
    cache = { at: Date.now(), posts };
    return posts;
  } catch (err) {
    console.error("[seo] Unable to load blog posts for SEO:", err);
    return cache?.posts ?? [];
  }
}

export async function getSeoBlogPost(slug: string): Promise<SeoBlogPost | null> {
  const posts = await getSeoBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}
