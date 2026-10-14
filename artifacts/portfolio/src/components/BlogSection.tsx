import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Filter, Newspaper } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiUrl } from "@/lib/api-base";

type BlogPost = {
  id: number;
  title: string;
  titleAr?: string | null;
  excerpt: string;
  excerptAr?: string | null;
  slug: string;
  category?: string | null;
  categoryAr?: string | null;
  readingMinutes?: number | null;
  coverImageUrl?: string | null;
  tags?: string[];
  featured: boolean;
  publishedAt: string;
};

async function fetchBlogPosts() {
  const response = await fetch(apiUrl("/api/blog-posts"), { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load blog posts");
  return response.json() as Promise<BlogPost[]>;
}

export function BlogSection({ limit, showFilters }: { limit?: number; showFilters?: boolean }) {
  const { t, lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
    retry: 1,
  });

  const isAr = lang === "ar";

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      const label = isAr && post.categoryAr ? post.categoryAr : post.category || post.categoryAr;
      if (!label) continue;
      counts.set(label, (counts.get(label) || 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count }));
  }, [posts, isAr]);

  const visiblePosts = useMemo(() => {
    if (!activeCategory) return posts;
    return posts.filter((post) => {
      const label = isAr && post.categoryAr ? post.categoryAr : post.category || post.categoryAr;
      return label === activeCategory;
    });
  }, [posts, activeCategory, isAr]);

  return (
    <section id="blog" className="brand-section relative overflow-hidden py-24 sm:py-28" dir={lang === "ar" ? "rtl" : "ltr"}>
      <div className="absolute top-1/3 end-0 h-52 w-52 rounded-full bg-[var(--brand-blue)]/[0.02] blur-[70px] pointer-events-none" />
      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="brand-eyebrow mb-4 inline-flex items-center gap-2">
              <Newspaper size={13} />
              {t.blog.beta}
            </div>
            <h2 className="brand-heading mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{t.blog.title}</h2>
            <div className="accent-bar mb-5" />
            <p className="brand-copy max-w-2xl text-base leading-8">{t.blog.subtitle}</p>
          </div>
          {limit && posts.length > limit ? (
            <Link href={isAr ? "/blog" : "/en/blog"} className="btn-outline group inline-flex min-h-12 items-center gap-2.5 rounded-xl px-7 py-3 text-sm font-semibold">
              {isAr ? "عرض كل المقالات" : "View all articles"}
              <span className="font-mono text-xs text-[var(--brand-muted)]">({posts.length})</span>
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:scale-110" />
            </Link>
          ) : null}
        </div>

        {showFilters && categories.length > 1 ? (
          <div className="mb-10 flex flex-wrap items-center gap-2">
            <span className="brand-eyebrow me-1 inline-flex items-center gap-1.5">
              <Filter size={12} />
              {isAr ? "التصنيف" : "Category"}
            </span>
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === null
                  ? "border-[var(--brand-blue)]/40 bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]"
                  : "border-[var(--brand-line)] bg-[var(--brand-panel-2)] text-[var(--brand-text-2)] hover:border-[var(--brand-blue)]/25"
              }`}
            >
              {isAr ? "الكل" : "All"}
              <span className="ms-1.5 font-mono text-[10px] opacity-70">{posts.length}</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.label}
                type="button"
                onClick={() => setActiveCategory(activeCategory === category.label ? null : category.label)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                  activeCategory === category.label
                    ? "border-[var(--brand-blue)]/40 bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]"
                    : "border-[var(--brand-line)] bg-[var(--brand-panel-2)] text-[var(--brand-text-2)] hover:border-[var(--brand-blue)]/25"
                }`}
              >
                {category.label}
                <span className="ms-1.5 font-mono text-[10px] opacity-70">{category.count}</span>
              </button>
            ))}
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
            {Array.from({ length: limit ?? 6 }).map((_, index) => (
              <div key={index} className="brand-panel h-96 rounded-xl p-0">
                <div className="aspect-[16/10] animate-pulse rounded-t-xl bg-[var(--brand-panel-2)]" />
                <div className="space-y-3 p-6">
                  <div className="h-3 w-20 animate-pulse rounded bg-[var(--brand-panel-2)]" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[var(--brand-panel-2)]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[var(--brand-panel-2)]" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--brand-panel-2)]" />
                </div>
              </div>
            ))}
          </div>
        ) : isError || visiblePosts.length === 0 ? (
          <div className="brand-panel rounded-xl border-dashed p-10 text-center">
            <h3 className="brand-heading text-xl font-bold">{t.blog.emptyTitle}</h3>
            <p className="mt-2 text-sm brand-copy">{t.blog.emptyText}</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3 lg:gap-6">
            {visiblePosts.slice(0, limit ?? visiblePosts.length).map((post, index) => {
              const title = (isAr && post.titleAr ? post.titleAr : post.title || post.titleAr) || "";
              const excerpt = (isAr && post.excerptAr ? post.excerptAr : post.excerpt || post.excerptAr) || "";
              const category = (isAr && post.categoryAr ? post.categoryAr : post.category || post.categoryAr) || "";

              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: Math.min(index * 0.08, 0.4), duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="gradient-border card-sweep group flex h-full flex-col overflow-hidden rounded-xl"
                >
                  <Link href={`${isAr ? "" : "/en"}/blog/${post.slug}`} className="flex h-full flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {post.coverImageUrl ? (
                        <img
                          src={post.coverImageUrl}
                          alt={title}
                          loading="lazy"
                          decoding="async"
                          className="img-zoom h-full w-full object-cover object-top"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[var(--brand-panel-2)] to-[var(--brand-panel)] text-primary">
                          <Newspaper size={40} strokeWidth={1.5} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      {category ? (
                        <span className="absolute start-4 top-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                          {category}
                        </span>
                      ) : null}
                      <span className="absolute end-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold text-white/85 backdrop-blur-md">
                        <Clock size={11} />
                        {isAr ? `${post.readingMinutes || 5} د` : `${post.readingMinutes || 5} min`}
                      </span>
                      <div className="absolute bottom-4 end-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 opacity-0 translate-y-2 backdrop-blur-md transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight size={15} className="text-white" />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <div className="mb-3 flex items-center gap-2 text-xs brand-muted">
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString(isAr ? "ar-IQ" : "en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                      <h3 className="brand-heading mb-3 text-xl font-bold leading-snug transition-colors duration-300 group-hover:text-[var(--brand-blue)]">
                        {title}
                      </h3>
                      <p className="brand-copy mb-5 line-clamp-3 text-sm leading-7">{excerpt}</p>
                      <div className="mt-auto flex flex-wrap gap-1.5">
                        {(post.tags || []).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-2.5 py-1 font-mono text-[11px] text-[var(--brand-text-2)] transition-colors group-hover:border-[var(--brand-blue)]/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
