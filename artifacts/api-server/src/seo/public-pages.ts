import { readFileSync } from "node:fs";
import { legacyArchiveTitles, projectArchive } from "../data/projectArchive";

type Locale = "ar" | "en";
type PageKind = "home" | "products" | "blog" | "projects" | "blogPost";

type SeoPage = {
  kind: PageKind;
  locale: Locale;
  path: string;
  title: string;
  description: string;
  keywords: string;
  heading: string;
  lead: string;
  sections: Array<{ title: string; body: string; items?: string[] }>;
  image?: string;
  publishedAt?: string;
  category?: string;
  tags?: string[];
};

export type SeoBlogPost = {
  slug: string;
  title: string;
  titleAr?: string | null;
  excerpt: string;
  excerptAr?: string | null;
  contentAr?: string | null;
  category?: string | null;
  categoryAr?: string | null;
  tags?: string[] | null;
  coverImageUrl?: string | null;
  readingMinutes?: number | null;
  publishedAt: string | Date;
};

const origin = "https://www.ibrahimig.com";
const lastModified = "2026-07-11";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const pages: SeoPage[] = [
  {
    kind: "home",
    locale: "ar",
    path: "/",
    title: "إبراهيم غيث | مطور ويب في العراق ولوحات تحكم احترافية",
    description:
      "إبراهيم غيث مطور ويب عراقي يبني مواقع وأنظمة ويب احترافية، لوحات تحكم، CMS، واجهات API، ومنتجات رقمية للشركات والأفراد في العراق والمنطقة العربية.",
    keywords:
      "إبراهيم غيث, ابراهيم غيث, إبراهيم غايث, ابراهيم غايث, Ibrahim Ghaiyth, Ibrahim Ghaith, مطور ويب في العراق, مطور ويب العراق, مبرمج مواقع العراق, مطور مواقع بغداد, تصميم مواقع العراق, برمجة مواقع للشركات, لوحات تحكم, CMS, React, Node.js, PostgreSQL",
    heading: "إبراهيم غيث",
    lead:
      "مطور برمجيات يبني أنظمة ويب حقيقية للأفراد والشركات، مع واجهات سريعة، لوحات إدارة آمنة، وبيانات محفوظة بعد كل تحديث.",
    sections: [
      {
        title: "الخدمات",
        body: "حلول ويب عملية تشمل المواقع التعريفية، لوحات التحكم، أنظمة البيانات، التكاملات، وتحسينات الإطلاق.",
        items: ["مواقع ثنائية اللغة", "لوحات تحكم وCMS", "واجهات API آمنة", "منتجات رقمية"],
      },
      {
        title: "المشاريع",
        body: "أرشيف مشاريع حقيقية يشمل واجهات ويب، أنظمة إدارة، لوحات تحكم، وتجارب رقمية قابلة للتطوير.",
      },
      {
        title: "من أنا",
        body: "إبراهيم غيث، ويكتب اسمه بالإنكليزية Ibrahim Ghaiyth، كما قد يبحث البعض عنه بصيغة Ibrahim Ghaith.",
      },
      {
        title: "التواصل",
        body: "يمكن التواصل عبر البريد الإلكتروني info@ibrahimig.com أو واتساب +964 7805808975.",
      },
    ],
  },
  {
    kind: "home",
    locale: "en",
    path: "/en",
    title: "Ibrahim Ghaiyth | Full-Stack Web Systems Developer in Iraq",
    description:
      "Bilingual Arabic and English web systems for businesses across Iraq and the Arab world: dashboards, CMS platforms, APIs, and digital products.",
    keywords:
      "Ibrahim Ghaiyth, Ibrahim Ghaith, Iraq web developer, Baghdad web developer, full stack developer Iraq, React developer, Node.js developer, admin dashboards, CMS, PostgreSQL",
    heading: "Ibrahim Ghaiyth",
    lead: "Full-stack developer building bilingual Arabic and English web systems for businesses across Iraq and the Arab world.",
    sections: [
      {
        title: "Services",
        body: "Business websites, admin dashboards, CMS platforms, secure APIs, integrations, and launch optimization.",
        items: ["Bilingual websites", "Admin dashboards and CMS", "Secure APIs", "Digital products"],
      },
      { title: "Projects", body: "Real case studies, interfaces, and operational web products." },
      {
        title: "About",
        body: "Ibrahim Ghaiyth, also written Ibrahim Ghaith, focuses on reliable full-stack delivery, organized data, and maintainable web products.",
      },
      { title: "Contact", body: "Contact info@ibrahimig.com or WhatsApp +964 7805808975." },
    ],
  },
  {
    kind: "products",
    locale: "ar",
    path: "/products",
    title: "منتجات رقمية وكتب إلكترونية في العراق | إبراهيم غيث",
    description:
      "منتجات رقمية من إبراهيم غيث تشمل كتب إلكترونية، قوالب عمل، أدوات برمجية، وتطبيقات ويب صغيرة متاحة للطلب عبر واتساب.",
    keywords:
      "منتجات رقمية العراق, كتب إلكترونية, قوالب مواقع, أدوات برمجية, تطبيقات ويب, بيع منتجات رقمية في العراق, إبراهيم غيث, ابراهيم غيث, Digital products Iraq",
    heading: "منتجات رقمية جاهزة للشراء",
    lead: "متجر مستقل للكتب الإلكترونية والقوالب والأدوات البرمجية وتطبيقات الويب المصغرة.",
    sections: [
      {
        title: "كتالوج المنتجات",
        body: "كل منتج يحتوي على وصف مفصل وسعر واضح، ويتم تأكيد الطلب والتسليم حالياً عبر واتساب.",
        items: ["كتب PDF", "قوالب مشاريع", "تطبيقات ويب صغيرة", "أدوات أعمال"],
      },
    ],
  },
  {
    kind: "products",
    locale: "en",
    path: "/en/products",
    title: "Digital Products and E-books | Ibrahim Ghaiyth",
    description:
      "Digital products by Ibrahim Ghaiyth: e-books, templates, software tools, and small web apps available to order through WhatsApp.",
    keywords: "digital products, e-books, web app templates, software tools, Ibrahim Ghaiyth, Iraq",
    heading: "Digital products ready to order",
    lead: "A dedicated store for e-books, practical templates, software tools, and small web apps.",
    sections: [
      {
        title: "Product Catalog",
        body: "Each product includes clear pricing, a detailed description, and a digital delivery path.",
        items: ["PDF e-books", "Project templates", "Small web apps", "Business tools"],
      },
    ],
  },
  {
    kind: "blog",
    locale: "ar",
    path: "/blog",
    title: "مدونة SEO عربي وتطوير ويب في العراق | إبراهيم غيث",
    description:
      "مدونة إبراهيم غيث لمقالات تقنية عربية عن تطوير الويب، SEO العربي، تحسين محركات البحث، فهرسة المواقع، لوحات التحكم، النشر، قواعد البيانات، وبناء المنتجات الرقمية.",
    keywords:
      "مدونة تطوير ويب, SEO عربي, تحسين محركات البحث العربية, SEO العراق, تصدر نتائج البحث, فهرسة المواقع, sitemap, robots.txt, لوحات تحكم, نشر مواقع, إبراهيم غيث, ابراهيم غيث, مطور ويب في العراق, مبرمج مواقع العراق",
    heading: "المدونة التقنية",
    lead: "مقالات عملية باللغة العربية والإنكليزية عن تطوير الويب، SEO العربي، الفهرسة، لوحات التحكم، النشر، واستمرارية البيانات.",
    sections: [
      {
        title: "مقالات تقنية قابلة للفهرسة",
        body: "محتوى عربي تقني مرتب لمحركات البحث والزوار، مع عناوين واضحة وروابط داخلية وموضوعات مرتبطة بتطوير الويب والسوق العراقي والعربي.",
        items: ["SEO العربي", "فهرسة المواقع", "لوحات التحكم", "هندسة تطبيقات الويب", "الأداء"],
      },
    ],
  },
  {
    kind: "blog",
    locale: "en",
    path: "/en/blog",
    title: "Web Development and Arabic SEO Blog | Ibrahim Ghaiyth",
    description:
      "Technical articles by Ibrahim Ghaiyth about web systems, admin dashboards, Arabic SEO, deployment, databases, performance, and digital products.",
    keywords:
      "Ibrahim Ghaiyth blog, Arabic SEO, web development Iraq, technical SEO, admin dashboards, deployment, PostgreSQL, Iraq developer",
    heading: "Technical blog",
    lead: "A practical archive for writing about client systems, dashboards, deployment, Arabic SEO, and digital products.",
    sections: [
      {
        title: "Technical articles",
        body: "Bilingual articles focused on practical web engineering, crawlability, data persistence, and production readiness.",
        items: ["Arabic SEO", "Web architecture", "Indexability", "Deployment", "Databases"],
      },
    ],
  },
  {
    kind: "projects",
    locale: "ar",
    path: "/projects",
    title: "مشاريع ويب من إبراهيم غيث: دراسات حالة وتنفيذ حقيقي | Ibrahim Ghaiyth",
    description:
      "أرشيف مشاريع إبراهيم غيث: لوحات تحكم، مواقع ويب، أنظمة API، ومنتجات رقمية مع دراسات حالة تقنية تشرح المشكلة والحل والنتيجة.",
    keywords:
      "مشاريع مطور ويب العراق, أعمال إبراهيم غيث, دراسات حالة برمجية, لوحات تحكم, أنظمة ويب, React Node.js, مشاريع ويب بغداد, إبراهيم غيث, ابراهيم غيث",
    heading: "مشاريع ويب حقيقية",
    lead: "دراسات حالة تقنية تشرح المشكلة والحل والنتيجة في أنظمة ويب فعلية.",
    sections: [
      {
        title: "أرشيف المشاريع",
        body: "كل مشروع يوثّق التقنيات المستخدمة والقرارات المعمارية ونتائج التنفيذ.",
        items: ["لوحات تحكم", "أنظمة API", "مواقع ثنائية اللغة", "منتجات رقمية"],
      },
    ],
  },
  {
    kind: "projects",
    locale: "en",
    path: "/en/projects",
    title: "Web Projects by Ibrahim Ghaiyth: Case Studies and Real Builds",
    description:
      "Ibrahim Ghaiyth's project archive: admin dashboards, web platforms, API systems, and digital products with technical case studies.",
    keywords:
      "Ibrahim Ghaiyth projects, web developer Iraq portfolio, admin dashboards, case studies, React Node.js projects, Baghdad developer",
    heading: "Real web projects",
    lead: "Technical case studies covering the problem, the solution, and the outcome of real web systems.",
    sections: [
      {
        title: "Project Archive",
        body: "Each project documents the stack, the architectural decisions, and the delivery results.",
        items: ["Admin dashboards", "API systems", "Bilingual websites", "Digital products"],
      },
    ],
  },
];

const arabicBlogKeywords =
  "SEO عربي, تحسين محركات البحث العربية, مقالات تقنية عربية, تطوير ويب عربي, مطور ويب في العراق, مبرمج مواقع العراق, برمجة مواقع في العراق, تصميم مواقع العراق, فهرسة المواقع العربية, لوحات تحكم, React, Node.js, PostgreSQL, إبراهيم غيث, ابراهيم غيث";

export function normalizePublicPath(rawPath: string) {
  return rawPath.split("?")[0].replace(/\/+$/, "") || "/";
}

const byPath = new Map(pages.map((page) => [page.path, page]));

export function getPublicSeoPage(rawPath: string) {
  return byPath.get(normalizePublicPath(rawPath)) || null;
}

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`>|-]{1,3}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function postOgImage(post: SeoBlogPost) {
  const cover = post.coverImageUrl?.trim();
  if (!cover || cover.startsWith("data:")) return `${origin}/opengraph.jpg`;
  if (/^https?:\/\//.test(cover)) return cover;
  const path = cover.startsWith("/") ? cover : `/${cover}`;
  if (path.endsWith(".svg")) return `${origin}${path.replace(/\.svg$/, ".png")}`;
  return `${origin}${path}`;
}

export function buildBlogPostSeoPage(post: SeoBlogPost, locale: Locale): SeoPage {
  const isArabic = locale === "ar";
  const title = (isArabic ? post.titleAr || post.title : post.title || post.titleAr) || post.slug;
  const excerpt = (isArabic ? post.excerptAr || post.excerpt : post.excerpt || post.excerptAr) || "";
  const category = (isArabic ? post.categoryAr || post.category : post.category || post.categoryAr) || "";
  const tags = post.tags || [];
  const leadBody = stripMarkdown(isArabic ? post.contentAr || "" : "").slice(0, 320);

  return {
    kind: "blogPost",
    locale,
    path: isArabic ? `/blog/${post.slug}` : `/en/blog/${post.slug}`,
    title: isArabic ? `${title} | مدونة إبراهيم غيث` : `${title} | Ibrahim Ghaiyth Blog`,
    description: excerpt,
    keywords: [category, ...tags, isArabic ? arabicBlogKeywords : "Ibrahim Ghaiyth blog, web development Iraq, technical articles, Arabic SEO"].filter(Boolean).join(", "),
    heading: title,
    lead: excerpt,
    image: postOgImage(post),
    publishedAt: new Date(post.publishedAt).toISOString(),
    category,
    tags,
    sections: [
      {
        title: isArabic ? "مقال تقني عربي" : "Technical Article",
        body: leadBody || excerpt,
        items: [category, ...tags.slice(0, 4)].filter(Boolean),
      },
    ],
  };
}

export function blogPostSeoPaths(slugs: string[]) {
  return slugs.flatMap((slug) => [`/blog/${slug}`, `/en/blog/${slug}`]);
}

export function hasPublicSeoPage(rawPath: string) {
  return byPath.has(normalizePublicPath(rawPath));
}

export function redirectArPath(rawPath: string) {
  const pathOnly = rawPath.split("?")[0].replace(/\/+$/, "") || "/";
  if (pathOnly === "/ar") return "/";
  if (pathOnly.startsWith("/ar/")) return pathOnly.replace(/^\/ar/, "") || "/";
  return null;
}

export function publicOrigin() {
  return origin;
}

export function clientTemplatePath(clientDistPath: string) {
  return `${clientDistPath}/index.html`;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function alternates(page: SeoPage) {
  if (page.kind === "blogPost") {
    const slug = page.path.split("/").pop() || "";
    return {
      ar: `${origin}/blog/${slug}`,
      en: `${origin}/en/blog/${slug}`,
      xDefault: `${origin}/blog/${slug}`,
    };
  }

  const suffix = page.kind === "home" ? "" : `/${page.kind}`;
  return {
    ar: `${origin}${suffix}`,
    en: `${origin}/en${suffix}`,
    xDefault: `${origin}/`,
  };
}

function canonical(page: SeoPage) {
  return page.path === "/" ? `${origin}/` : `${origin}${page.path}`;
}

function jsonLd(page: SeoPage) {
  const isArabic = page.locale === "ar";
  const isPost = page.kind === "blogPost";
  const pageType = isPost ? "Article" : "WebPage";
  const ogImage = page.image || `${origin}/opengraph.jpg`;

  const pageEntity = {
    "@context": "https://schema.org",
    "@type": pageType,
    name: page.title,
    headline: page.title,
    description: page.description,
    url: canonical(page),
    image: ogImage,
    isPartOf: { "@id": `${origin}/#website` },
    about: { "@id": `${origin}/#ibrahim-ghaiyth` },
    author: { "@id": `${origin}/#ibrahim-ghaiyth` },
    publisher: { "@id": `${origin}/#website` },
    inLanguage: page.locale,
    ...(isPost
      ? {
          datePublished: page.publishedAt,
          dateModified: page.publishedAt,
          articleSection: page.category || undefined,
          keywords: (page.tags || []).join(", "),
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": canonical(page),
          },
        }
      : {}),
  };

  return JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${origin}/#ibrahim-ghaiyth`,
      name: "Ibrahim Ghaiyth",
      alternateName: ["Ibrahim Ghaith", "إبراهيم غيث", "ابراهيم غيث", "إبراهيم غايث", "ابراهيم غايث"],
      jobTitle: "Full-Stack Web Systems Developer",
      url: `${origin}/`,
      image: `${origin}/opengraph.jpg`,
      email: "info@ibrahimig.com",
      telephone: "+9647805808975",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IQ",
      },
      sameAs: [
        "https://github.com/ibrahim22ghaiyth",
        "https://www.linkedin.com/in/ibrahim-ghaiyth-3144a1350",
        "https://www.instagram.com/ib.et",
      ],
      knowsAbout: ["Web development", "Arabic SEO", "React", "Node.js", "PostgreSQL", "Admin dashboards", "CMS platforms", "Bilingual websites"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${origin}/#website`,
      name: "Ibrahim Ghaiyth",
      alternateName: "إبراهيم غيث",
      url: `${origin}/`,
      inLanguage: ["ar", "en"],
      publisher: { "@id": `${origin}/#ibrahim-ghaiyth` },
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${origin}/#service`,
      name: isArabic ? "إبراهيم غيث لتطوير أنظمة الويب" : "Ibrahim Ghaiyth Web Systems",
      url: `${origin}/`,
      areaServed: ["Iraq", "Baghdad", "Arab region", "MENA"],
      serviceType: ["Web development", "Admin dashboards", "CMS platforms", "Secure APIs", "Digital products", "Arabic SEO"],
      founder: { "@id": `${origin}/#ibrahim-ghaiyth` },
    },
    pageEntity,
  ]);
}

function renderStaticBody(page: SeoPage) {
  const ctaHref = page.locale === "ar" ? "/#contact" : "/en#contact";
  const cta = page.locale === "ar" ? "ابدأ مشروعك" : "Start a Project";
  const languageHref = page.locale === "ar" ? "/en" : "/";
  const languageLabel = page.locale === "ar" ? "English" : "العربية";
  const sections = page.sections
    .map((section) => {
      const items = section.items?.length ? `<ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
      return `<section><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.body)}</p>${items}</section>`;
    })
    .join("");

  return `<main dir="${page.locale === "ar" ? "rtl" : "ltr"}">
    <nav><a href="${languageHref}">${languageLabel}</a></nav>
    <header><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.lead)}</p><a href="${ctaHref}">${cta}</a></header>
    ${sections}
  </main>`;
}

function renderHead(page: SeoPage) {
  const alt = alternates(page);
  const pageCanonical = canonical(page);
  const locale = page.locale === "ar" ? "ar_IQ" : "en_US";
  const alternateLocale = page.locale === "ar" ? "en_US" : "ar_IQ";
  const ogType = page.kind === "blogPost" ? "article" : "website";
  const ogImage = page.image || `${origin}/opengraph.jpg`;
  const articleMeta =
    page.kind === "blogPost" && page.publishedAt
      ? `
    <meta property="article:published_time" content="${escapeHtml(page.publishedAt)}" />
    <meta property="article:author" content="Ibrahim Ghaiyth" />
    ${page.category ? `<meta property="article:section" content="${escapeHtml(page.category)}" />` : ""}
    ${(page.tags || []).map((tag) => `<meta property="article:tag" content="${escapeHtml(tag)}" />`).join("\n    ")}`
      : "";

  return `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${escapeHtml(page.description)}" />
    <meta name="keywords" content="${escapeHtml(page.keywords)}" />
    <meta name="author" content="Ibrahim Ghaiyth" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="theme-color" content="#F5F6F8" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0E1116" media="(prefers-color-scheme: dark)" />
    <link rel="canonical" href="${pageCanonical}" />
    <link rel="alternate" hreflang="ar-IQ" href="${alt.ar}" />
    <link rel="alternate" hreflang="ar" href="${alt.ar}" />
    <link rel="alternate" hreflang="en" href="${alt.en}" />
    <link rel="alternate" hreflang="x-default" href="${alt.xDefault}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${pageCanonical}" />
    <meta property="og:site_name" content="Ibrahim Ghaiyth" />
    <meta property="og:image" content="${escapeHtml(ogImage)}" />${articleMeta}
    <meta property="og:locale" content="${locale}" />
    <meta property="og:locale:alternate" content="${alternateLocale}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <script src="/theme-boot.js"></script>
    <script type="application/ld+json">${jsonLd(page).replace(/</g, "\\u003c")}</script>
  `;
}

const templateCache = new Map<string, { template: string; assetTags: string }>();

function readTemplate(templatePath: string) {
  const cached = templateCache.get(templatePath);
  if (cached) return cached;

  const template = readFileSync(templatePath, "utf8");
  const assetTags = (template.match(/<(?:script|link)[^>]+(?:><\/script>|\/?>)/g) || [])
    .filter((tag) => tag.includes("/assets/"))
    .join("\n");

  const entry = { template, assetTags };
  templateCache.set(templatePath, entry);
  return entry;
}

export function renderPublicPage(templatePath: string, page: SeoPage) {
  const { template, assetTags } = readTemplate(templatePath);

  return template
    .replace(/<html[^>]*>/, `<html lang="${page.locale}" dir="${page.locale === "ar" ? "rtl" : "ltr"}">`)
    .replace(/<head>[\s\S]*?<\/head>/, `<head>${renderHead(page)}\n${assetTags}</head>`)
    .replace('<div id="root"></div>', `<div id="root"></div><noscript>${renderStaticBody(page)}</noscript>`);
}

export function publicSitemapXml(posts: SeoBlogPost[] = []) {
  const staticUrls = pages
    .map((page) => {
      const alt = alternates(page);
      return `  <url>
    <loc>${canonical(page)}</loc>
    <xhtml:link rel="alternate" hreflang="ar-IQ" href="${alt.ar}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${alt.ar}" />
    <xhtml:link rel="alternate" hreflang="en" href="${alt.en}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${alt.xDefault}" />
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.kind === "home" ? "1.0" : "0.8"}</priority>
  </url>`;
    })
    .join("\n");

  const postUrls = posts
    .map((post) => {
      const lastmod = new Date(post.publishedAt).toISOString().slice(0, 10);
      return `  <url>
    <loc>${origin}/blog/${post.slug}</loc>
    <xhtml:link rel="alternate" hreflang="ar-IQ" href="${origin}/blog/${post.slug}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${origin}/blog/${post.slug}" />
    <xhtml:link rel="alternate" hreflang="en" href="${origin}/en/blog/${post.slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/blog/${post.slug}" />
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${origin}/en/blog/${post.slug}</loc>
    <xhtml:link rel="alternate" hreflang="ar-IQ" href="${origin}/blog/${post.slug}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${origin}/blog/${post.slug}" />
    <xhtml:link rel="alternate" hreflang="en" href="${origin}/en/blog/${post.slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/blog/${post.slug}" />
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join("\n");

  const showcaseUrls = [...projectArchive.map((project) => project.title), ...legacyArchiveTitles]
    .map((title) => slugify(title))
    .filter(Boolean)
    .map((slug) => `  <url>
    <loc>${origin}/showcase/${slug}/</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticUrls}
${postUrls}
${showcaseUrls}
</urlset>`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function blogRssXml(locale: "ar" | "en", posts: SeoBlogPost[]) {
  const siteTitle =
    locale === "ar" ? "مدونة إبراهيم غيث — تقنية وتطوير ويب" : "Ibrahim Ghaiyth Blog — Engineering & Web Development";
  const siteLink = locale === "ar" ? `${origin}/blog` : `${origin}/en/blog`;
  const feedLink = locale === "ar" ? `${origin}/rss.xml` : `${origin}/en/rss.xml`;

  const items = posts
    .slice(0, 30)
    .map((post) => {
      const title = (locale === "ar" ? post.titleAr || post.title : post.title || post.titleAr) || post.slug;
      const excerpt = locale === "ar" ? post.excerptAr || post.excerpt : post.excerpt || post.excerptAr;
      const link = locale === "ar" ? `${origin}/blog/${post.slug}` : `${origin}/en/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(excerpt || "")}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${escapeXml(siteLink)}</link>
    <atom:link href="${escapeXml(feedLink)}" rel="self" type="application/rss+xml"/>
    <description>${escapeXml(locale === "ar" ? "مقالات تقنية عملية بالعربية عن تطوير الويب والأنظمة والإنتاج." : "Practical technical articles about web development, systems, and production engineering.")}</description>
    <language>${locale === "ar" ? "ar" : "en"}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;
}
