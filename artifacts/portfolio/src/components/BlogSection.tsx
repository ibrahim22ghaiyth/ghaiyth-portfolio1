import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Newspaper } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

type BlogPost = {
  id: number;
  title: string;
  titleAr?: string | null;
  excerpt: string;
  excerptAr?: string | null;
  slug: string;
  coverImageUrl?: string | null;
  tags?: string[];
  featured: boolean;
  publishedAt: string;
};

async function fetchBlogPosts() {
  const response = await fetch("/api/blog-posts", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load blog posts");
  return response.json() as Promise<BlogPost[]>;
}

export function BlogSection({ limit }: { limit?: number }) {
  const { t, lang } = useLanguage();
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
    retry: 1,
  });

  return (
    <section id="blog" className="relative overflow-hidden py-24" dir="ltr">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--brand-blue-glow),transparent_28%)]" />
      <div className="container relative mx-auto px-6">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-[var(--brand-tag-bg)] px-4 py-2 text-xs font-bold text-primary">
              <Newspaper size={15} />
              {t.blog.beta}
            </div>
            <h2 className="text-4xl font-black text-[var(--brand-heading)] md:text-5xl">{t.blog.title}</h2>
            <p className="mt-4 max-w-2xl text-[var(--brand-text-2)]">{t.blog.subtitle}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-[var(--brand-line)] bg-[var(--brand-panel)] p-8 text-center text-[var(--brand-muted)]">
            {t.common.loading}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--brand-line)] bg-[var(--brand-panel)] p-8 text-center">
            <h3 className="text-xl font-bold text-[var(--brand-heading)]">{t.blog.emptyTitle}</h3>
            <p className="mt-2 text-sm text-[var(--brand-text-2)]">{t.blog.emptyText}</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {posts.slice(0, limit ?? posts.length).map((post, index) => {
              const title = lang === "ar" && post.titleAr ? post.titleAr : post.title;
              const excerpt = lang === "ar" && post.excerptAr ? post.excerptAr : post.excerpt;

              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group overflow-hidden rounded-xl border border-[var(--brand-line)] bg-[var(--brand-panel)] transition hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_18px_50px_var(--brand-blue-glow)]"
                >
                  <Link href={`${lang === "en" ? "/en" : ""}/blog/${post.slug}`} className="block h-full">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--brand-panel-2)]">
                      {post.coverImageUrl ? (
                        <img src={post.coverImageUrl} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-primary">
                          <Newspaper size={38} />
                        </div>
                      )}
                      <span className="absolute end-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-bold text-primary backdrop-blur">
                        {post.featured ? t.blog.featured : t.blog.betaShort}
                      </span>
                    </div>
                    <div className="p-5" dir={lang === "ar" ? "rtl" : "ltr"}>
                      <div className="mb-3 flex items-center gap-2 text-xs text-[var(--brand-muted)]">
                        <CalendarDays size={14} />
                        <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString(lang === "ar" ? "ar-IQ" : "en-US")}</time>
                      </div>
                      <h3 className="text-xl font-black leading-snug text-[var(--brand-heading)]">{title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--brand-text-2)]">{excerpt}</p>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {(post.tags || []).slice(0, 2).map((tag) => (
                            <span key={tag} className="rounded-full bg-[var(--brand-tag-bg)] px-2.5 py-1 text-[11px] text-primary">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="grid h-9 w-9 place-items-center rounded-md border border-[var(--brand-line)] text-primary">
                          <ArrowUpRight size={16} />
                        </span>
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
