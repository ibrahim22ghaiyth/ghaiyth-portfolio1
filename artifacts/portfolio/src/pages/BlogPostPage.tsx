import React, { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock,
  Copy,
  Hash,
  ListTree,
  Newspaper,
  Share2,
  Tag,
} from "lucide-react";
import { Link, useParams } from "wouter";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

type BlogPost = {
  id: number;
  title: string;
  titleAr?: string | null;
  excerpt: string;
  excerptAr?: string | null;
  content: string;
  contentAr?: string | null;
  slug: string;
  category?: string | null;
  categoryAr?: string | null;
  readingMinutes?: number | null;
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

async function fetchRelatedPosts(slug?: string) {
  const response = await fetch("/api/blog-posts", { cache: "no-store" });
  if (!response.ok) return [] as BlogPost[];
  const posts = (await response.json()) as BlogPost[];
  return posts.filter((post) => post.slug !== slug).slice(0, 3);
}

function slugifyHeading(text: string, index: number) {
  const slug = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${slug || "section"}-${index}`;
}

const Markdown = ReactMarkdown as unknown as React.FC<{
  children: string;
  remarkPlugins?: unknown[];
  breaks?: boolean;
}>;

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function updateDocumentSeo(post: BlogPost, title: string, excerpt: string, lang: "ar" | "en") {
  const origin = "https://www.ibrahimig.com";
  const canonical = lang === "ar" ? `${origin}/blog/${post.slug}` : `${origin}/en/blog/${post.slug}`;
  const fullTitle = lang === "ar" ? `${title} | مدونة إبراهيم غيث` : `${title} | Ibrahim Ghaiyth Blog`;

  document.title = fullTitle;
  setMeta("name", "name", "description", excerpt);
  setMeta("property", "property", "og:title", fullTitle);
  setMeta("property", "property", "og:description", excerpt);
  setMeta("property", "property", "og:type", "article");
  setMeta("property", "property", "og:url", canonical);
  setMeta("name", "name", "twitter:title", fullTitle);
  setMeta("name", "name", "twitter:description", excerpt);

  if (post.coverImageUrl && !post.coverImageUrl.startsWith("data:")) {
    const image = /^https?:\/\//.test(post.coverImageUrl)
      ? post.coverImageUrl
      : `${origin}${post.coverImageUrl.startsWith("/") ? "" : "/"}${post.coverImageUrl}`;
    setMeta("property", "property", "og:image", image);
    setMeta("name", "name", "twitter:image", image);
  }

  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = canonical;
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const isAr = lang === "ar";

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchBlogPost(slug),
    retry: 1,
  });

  const { data: related = [] } = useQuery({
    queryKey: ["blog-posts-related", slug],
    queryFn: () => fetchRelatedPosts(slug),
    retry: 0,
  });

  const title = (post ? (isAr && post.titleAr ? post.titleAr : post.title || post.titleAr) : "") || "";
  const excerpt = (post ? (isAr && post.excerptAr ? post.excerptAr : post.excerpt || post.excerptAr) : "") || "";
  const content = (post ? (isAr && post.contentAr ? post.contentAr : post.content || post.contentAr) : "") || "";
  const category = (post ? (isAr && post.categoryAr ? post.categoryAr : post.category || post.categoryAr) : "") || "";
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    if (post && title) {
      updateDocumentSeo(post, title, excerpt, lang === "en" ? "en" : "ar");
    }
  }, [post, title, excerpt, lang]);

  const toc = useMemo(() => {
    if (!content) return [] as Array<{ id: string; text: string }>;
    const matches = [...content.matchAll(/^##\s+(.+)$/gm)];
    return matches.map((match, index) => ({
      id: slugifyHeading(match[1], index),
      text: match[1].trim(),
    }));
  }, [content]);

  const markdownContent = useMemo(() => {
    if (!content) return "";
    let index = -1;
    return content.replace(/^##\s+(.+)$/gm, (full, text) => {
      index += 1;
      return `<span id="${slugifyHeading(text, index)}"></span>\n\n## ${text}`;
    });
  }, [content]);

  const shareLinks = useMemo(() => {
    const encoded = encodeURIComponent(pageUrl);
    const encodedTitle = encodeURIComponent(title);
    return {
      x: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
    };
  }, [pageUrl, title]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      toast({ title: isAr ? "تم نسخ الرابط" : "Link copied" });
    } catch {
      toast({ title: isAr ? "تعذر نسخ الرابط" : "Unable to copy link", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <section className="stage-dark relative overflow-hidden pb-16 pt-32 sm:pt-36" dir={isAr ? "rtl" : "ltr"}>
          <div className="hero-mesh absolute inset-0 pointer-events-none" />
          <div className="hero-grid absolute inset-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6">
            <Link
              href={isAr ? "/blog" : "/en/blog"}
              className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 backdrop-blur-sm transition-colors hover:border-white/25 hover:text-white"
            >
              <ArrowLeft size={15} className="rtl:rotate-180" />
              {t.nav.blog}
            </Link>

            {isLoading ? (
              <div className="max-w-3xl space-y-4">
                <div className="h-4 w-40 animate-pulse rounded bg-white/8" />
                <div className="h-10 w-3/4 animate-pulse rounded bg-white/8" />
                <div className="h-10 w-1/2 animate-pulse rounded bg-white/8" />
              </div>
            ) : isError || !post ? (
              <div className="rounded-xl border border-white/8 bg-white/4 p-10 text-center backdrop-blur-sm">
                <Newspaper className="mx-auto mb-3 text-white/30" size={36} strokeWidth={1.5} />
                <h1 className="text-2xl font-bold text-white">{t.blog.emptyTitle}</h1>
              </div>
            ) : (
              <div className="max-w-3xl">
                <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-white/40">
                  {category ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-1 text-xs font-semibold text-[#60A5FA]">
                      <Hash size={12} />
                      {category}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={14} />
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString(isAr ? "ar-IQ" : "en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={13} />
                    {isAr ? `${post.readingMinutes || 5} دقائق قراءة` : `${post.readingMinutes || 5} min read`}
                  </span>
                </div>
                <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">{title}</h1>
                {excerpt ? <p className="mb-6 max-w-2xl text-base leading-8 text-white/45">{excerpt}</p> : null}
                <div className="accent-bar" />
                {(post.tags || []).length > 0 ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {(post.tags || []).map((tag) => (
                      <span key={tag} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/40">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>

        {post && !isError ? (
          <section className="brand-section py-16 sm:py-20" dir={isAr ? "rtl" : "ltr"}>
            <div className="container mx-auto px-4 sm:px-6">
              <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_260px]">
                <article className="min-w-0">
                  {post.coverImageUrl ? (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="gradient-border mb-10 aspect-[1200/560] overflow-hidden rounded-xl"
                    >
                      <img src={post.coverImageUrl} alt={title} className="h-full w-full object-cover" loading="eager" />
                    </motion.div>
                  ) : null}

                  <div className="article-prose brand-panel mb-10 rounded-xl p-7 sm:p-9">
                    <Markdown remarkPlugins={[remarkGfm]} breaks>
                      {markdownContent}
                    </Markdown>
                  </div>

                  <div className="brand-panel flex flex-wrap items-center justify-between gap-4 rounded-xl p-5 sm:p-6">
                    <div className="flex items-center gap-3 text-sm brand-muted">
                      <Share2 size={16} className="text-[var(--brand-blue)]" />
                      <span className="font-semibold">{isAr ? "شارك المقال" : "Share this article"}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={shareLinks.x}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-outline inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-xs font-semibold"
                      >
                        X / Twitter
                      </a>
                      <a
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-outline inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-xs font-semibold"
                      >
                        LinkedIn
                      </a>
                      <a
                        href={shareLinks.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-outline inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-xs font-semibold"
                      >
                        WhatsApp
                      </a>
                      <button type="button" onClick={copyLink} className="btn-outline inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-xs font-semibold">
                        <Copy size={13} />
                        {isAr ? "نسخ" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <p className="mt-6 text-center text-xs brand-muted">
                    © {new Date(post.publishedAt).getFullYear()} Ibrahim Ghaiyth (IG) ·{" "}
                    <a href="https://www.ibrahimig.com" className="transition-colors hover:text-[var(--brand-blue)]">
                      ibrahimig.com
                    </a>
                  </p>

                  {related.length > 0 ? (
                    <div className="mt-14">
                      <div className="mb-8">
                        <div className="brand-eyebrow mb-3 inline-flex items-center gap-2">
                          <Newspaper size={13} />
                          {isAr ? "مقالات ذات صلة" : "Related articles"}
                        </div>
                        <h2 className="brand-heading text-2xl font-bold">
                          {isAr ? "تابع القراءة" : "Keep reading"}
                        </h2>
                        <div className="accent-bar mt-4" />
                      </div>
                      <div className="grid gap-5 sm:grid-cols-3">
                        {related.map((item, index) => {
                          const relatedTitle = (isAr && item.titleAr ? item.titleAr : item.title || item.titleAr) || "";
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 16 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.08, duration: 0.4 }}
                            >
                              <Link
                                href={`${isAr ? "" : "/en"}/blog/${item.slug}`}
                                className="gradient-border card-sweep group flex h-full flex-col overflow-hidden rounded-xl"
                              >
                                {item.coverImageUrl ? (
                                  <div className="relative aspect-[16/9] overflow-hidden">
                                    <img
                                      src={item.coverImageUrl}
                                      alt={relatedTitle}
                                      loading="lazy"
                                      className="img-zoom h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                  </div>
                                ) : null}
                                <div className="flex flex-1 flex-col p-5">
                                  <h3 className="brand-heading mb-2 text-sm font-bold leading-snug transition-colors group-hover:text-[var(--brand-blue)]">
                                    {relatedTitle}
                                  </h3>
                                  <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs font-semibold text-[var(--brand-blue)]">
                                    {isAr ? "اقرأ المقال" : "Read article"}
                                    <ArrowUpRight size={13} />
                                  </span>
                                </div>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </article>

                {toc.length > 1 ? (
                  <aside className="hidden lg:block">
                    <div className="sticky top-28 space-y-4">
                      <div className="brand-panel rounded-xl p-5">
                        <div className="brand-eyebrow mb-4 inline-flex items-center gap-2">
                          <ListTree size={13} />
                          {isAr ? "محتويات المقال" : "On this page"}
                        </div>
                        <nav className="space-y-2.5">
                          {toc.map((item) => (
                            <a
                              key={item.id}
                              href={`#${item.id}`}
                              className="block text-sm leading-6 brand-copy transition-colors hover:text-[var(--brand-blue)]"
                            >
                              {item.text}
                            </a>
                          ))}
                        </nav>
                      </div>
                      <div className="brand-panel rounded-xl p-5">
                        <div className="brand-eyebrow mb-3 inline-flex items-center gap-2">
                          <Tag size={13} />
                          {isAr ? "الوسوم" : "Tags"}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(post.tags || []).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-2.5 py-1 font-mono text-[11px] text-[var(--brand-text-2)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </aside>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
        <Footer />
      </main>
    </div>
  );
}
