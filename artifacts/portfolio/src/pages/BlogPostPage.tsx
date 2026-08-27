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
      <main className="pt-28">
        <section className="relative overflow-hidden py-12" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,var(--brand-blue-glow),transparent_34%)]" />
          <div className="container relative mx-auto px-6">
            <Link href={lang === "en" ? "/en/blog" : "/blog"} className="mb-8 inline-flex items-center gap-2 rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel)] px-4 py-2 text-sm font-bold text-primary">
              <ArrowLeft size={16} />
              {t.nav.blog}
            </Link>

            {isLoading ? (
              <div className="brand-panel rounded-xl p-8 text-center text-[var(--brand-muted)]">{t.common.loading}</div>
            ) : isError || !post ? (
              <div className="brand-panel rounded-xl p-8 text-center">
                <Newspaper className="mx-auto mb-3 text-primary" />
                <h1 className="text-2xl font-black text-[var(--brand-heading)]">{t.blog.emptyTitle}</h1>
              </div>
            ) : (
              <article className="mx-auto max-w-4xl">
                {post.coverImageUrl ? (
                  <div className="mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-panel)]">
                    <img src={post.coverImageUrl} alt={title} className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-[var(--brand-muted)]">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={16} />
                    <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString(lang === "ar" ? "ar-IQ" : "en-US")}</time>
                  </span>
                  {(post.tags || []).map((tag) => (
                    <span key={tag} className="rounded-full bg-[var(--brand-tag-bg)] px-3 py-1 text-xs text-primary">{tag}</span>
                  ))}
                </div>
                <h1 className="text-4xl font-black leading-tight text-[var(--brand-heading)] md:text-6xl">{title}</h1>
                <p className="mt-5 text-lg leading-8 text-[var(--brand-text-2)]">{excerpt}</p>
                <div className="mt-10 whitespace-pre-line rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-panel)] p-6 text-base leading-9 text-[var(--brand-text)] md:p-8">
                  {content}
                </div>
              </article>
            )}
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}

