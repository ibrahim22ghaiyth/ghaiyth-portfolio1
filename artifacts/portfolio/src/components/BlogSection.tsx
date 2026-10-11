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
  const { data: posts = [], isLoading, isError } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
    retry: 1,
  });

  return (
    <section id="blog" className="brand-section relative py-24 sm:py-28" dir="ltr">
      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="max-w-3xl">
            <div className="brand-eyebrow mb-4 inline-flex items-center gap-2">
              <Newspaper size={13} />
              {t.blog.beta}
            </div>
            <h2 className="brand-heading mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{t.blog.title}</h2>
            <div className="accent-bar mb-5" />
            <p className="brand-copy max-w-2xl text-base leading-8">{t.blog.subtitle}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="brand-panel rounded-xl p-10 text-center brand-muted">
            {t.common.loading}
          </div>
        ) : isError ? (
          <div className="brand-panel rounded-xl border-dashed p-10 text-center">
            <h3 className="brand-heading text-xl font-bold">{t.blog.emptyTitle}</h3>
            <p className="mt-2 text-sm brand-copy">{t.blog.emptyText}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="brand-panel rounded-xl border-dashed p-10 text-center">
            <h3 className="brand-heading text-xl font-bold">{t.blog.emptyTitle}</h3>
            <p className="mt-2 text-sm brand-copy">{t.blog.emptyText}</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
            {posts.slice(0, limit ?? posts.length).map((post, index) => {
              const title = lang === "ar" && post.titleAr ? post.titleAr : post.title;
              const excerpt = lang === "ar" && post.excerptAr ? post.excerptAr : post.excerpt;

              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="brand-panel card-lift group overflow-hidden rounded-xl"
                >
                  <Link href={`${lang === "en" ? "/en" : ""}/blog/${post.slug}`} className="block h-full">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--brand-panel-2)]">
                      {post.coverImageUrl ? (
                        <img src={post.coverImageUrl} alt={title} className="img-zoom h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-primary">
                          <Newspaper size={40} strokeWidth={1.5} />
                        </div>
                      )}
                      <span className="absolute end-3 top-3 rounded-full border border-[var(--brand-line)] bg-[var(--brand-panel)]/90 px-3 py-1 text-[11px] font-semibold text-primary backdrop-blur-sm">
                        {post.featured ? t.blog.featured : t.blog.betaShort}
                      </span>
                    </div>
                    <div className="p-6" dir={lang === "ar" ? "rtl" : "ltr"}>
                      <div className="mb-3 flex items-center gap-2 text-xs brand-muted">
                        <CalendarDays size={13} />
                        <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString(lang === "ar" ? "ar-IQ" : "en-US")}</time>
                      </div>
                      <h3 className="brand-heading text-lg font-bold leading-snug">{title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 brand-copy">{excerpt}</p>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-1.5">
                          {(post.tags || []).slice(0, 2).map((tag) => (
                            <span key={tag} className="rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-2.5 py-1 font-mono text-[11px] text-[var(--brand-text-2)]">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--brand-line)] text-primary transition-colors group-hover:border-primary/40">
                          <ArrowUpRight size={15} />
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
