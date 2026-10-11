import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Newspaper } from "lucide-react";
import { Link, useParams } from "wouter";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";

type BlogPost = {
  id: number;
  title: string;
  titleAr?: string | null;
  excerpt: string;
  excerptAr?: string | null;
  content: string;
  contentAr?: string | null;
  slug: string;
  coverImageUrl?: string | null;
  tags?: string[];
  publishedAt: string;
};

async function fetchBlogPost(slug?: string) {
  if (!slug) throw new Error("Missing slug");
  const response = await fetch(`/api/blog-posts/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load blog post");
  return response.json() as Promise<BlogPost>;
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLanguage();
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchBlogPost(slug),
    retry: 1,
  });

  const title = post ? (lang === "ar" && post.titleAr ? post.titleAr : post.title) : "";
  const excerpt = post ? (lang === "ar" && post.excerptAr ? post.excerptAr : post.excerpt) : "";
  const content = post ? (lang === "ar" && post.contentAr ? post.contentAr : post.content) : "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <section className="stage-dark relative overflow-hidden pb-16 pt-32 sm:pt-36" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="hero-mesh absolute inset-0 pointer-events-none" />
          <div className="hero-grid absolute inset-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6">
            <Link href={lang === "en" ? "/en/blog" : "/blog"} className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 backdrop-blur-sm transition-colors hover:border-white/25 hover:text-white">
              <ArrowLeft size={15} className="rtl:rotate-180" />
              {t.nav.blog}
            </Link>

            {isLoading ? (
              <div className="rounded-xl border border-white/8 bg-white/4 p-10 text-center text-white/40 backdrop-blur-sm">{t.common.loading}</div>
            ) : isError || !post ? (
              <div className="rounded-xl border border-white/8 bg-white/4 p-10 text-center backdrop-blur-sm">
                <Newspaper className="mx-auto mb-3 text-white/30" size={36} strokeWidth={1.5} />
                <h1 className="text-2xl font-bold text-white">{t.blog.emptyTitle}</h1>
              </div>
            ) : (
              <div className="max-w-3xl">
                <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-white/35">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={14} />
                    <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString(lang === "ar" ? "ar-IQ" : "en-US")}</time>
                  </span>
                  {(post.tags || []).map((tag) => (
                    <span key={tag} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/40">{tag}</span>
                  ))}
                </div>
                <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">{title}</h1>
                <div className="accent-bar" />
              </div>
            )}
          </div>
        </section>

        {post && !isError ? (
          <section className="brand-section py-16 sm:py-20" dir={lang === "ar" ? "rtl" : "ltr"}>
            <div className="container mx-auto px-4 sm:px-6">
              <article className="mx-auto max-w-4xl">
                {post.coverImageUrl ? (
                  <div className="brand-panel mb-10 aspect-[16/9] overflow-hidden rounded-xl">
                    <img src={post.coverImageUrl} alt={title} className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <p className="brand-copy mb-10 text-lg leading-8">{excerpt}</p>
                <div className="brand-panel whitespace-pre-line rounded-xl p-7 text-base leading-9 text-[var(--brand-text)] sm:p-9">
                  {content}
                </div>
              </article>
            </div>
          </section>
        ) : null}
        <Footer />
      </main>
    </div>
  );
}
