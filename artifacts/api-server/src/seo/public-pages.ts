import { readFileSync } from "node:fs";
import { defaultBlogPosts } from "../data/defaultBlogPosts";
import { legacyArchiveTitles, projectArchive } from "../data/projectArchive";

type Locale = "ar" | "en";
type PageKind = "home" | "products" | "blog" | "blogPost";

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
];

const arabicBlogKeywords =
  "SEO عربي, تحسين محركات البحث العربية, مقالات تقنية عربية, تطوير ويب عربي, مطور ويب في العراق, مبرمج مواقع العراق, برمجة مواقع في العراق, تصميم مواقع العراق, فهرسة المواقع العربية, لوحات تحكم, React, Node.js, PostgreSQL, إبراهيم غيث, ابراهيم غيث";

const blogPostPages: SeoPage[] = defaultBlogPosts.flatMap((post) => [
  {
    kind: "blogPost",
    locale: "ar",
    path: `/blog/${post.slug}`,
    title: `${post.titleAr} | مدونة إبراهيم غيث`,
    description: post.excerptAr,
    keywords: [...post.tags, arabicBlogKeywords].join(", "),
    heading: post.titleAr,
    lead: post.excerptAr,
    sections: [
      {
        title: "مقال تقني عربي",
        body: post.contentAr.split("\n").find(Boolean) || post.excerptAr,
        items: ["SEO عربي", "تطوير ويب", "برمجة مواقع", "هندسة تطبيقات", "فهرسة المواقع"],
      },
    ],
  },
  {
    kind: "blogPost",
    locale: "en",
    path: `/en/blog/${post.slug}`,
    title: `${post.title} | Ibrahim Ghaiyth Blog`,
    description: post.excerpt,
    keywords: [...post.tags, "Arabic SEO", "Iraq web developer", "technical SEO", "web development"].join(", "),
    heading: post.title,
    lead: post.excerpt,
    sections: [
      {
        title: "Technical Article",
        body: post.content.split("\n").find(Boolean) || post.excerpt,
        items: ["Technical SEO", "Web development", "Architecture", "Crawlability"],
      },
    ],
  },
]);

const allPages = [...pages, ...blogPostPages];
const byPath = new Map(allPages.map((page) => [page.path, page]));

export function normalizePublicPath(rawPath: string) {
  return rawPath.split("?")[0].replace(/\/+$/, "") || "/";
}

export function getPublicSeoPage(rawPath: string) {
  return byPath.get(normalizePublicPath(rawPath)) || null;
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
    ar: `${origin}/${suffix.replace(/^\//, "")}`.replace(/\/$/, "/"),
    en: `${origin}/en${suffix}`,
    xDefault: `${origin}/`,
  };
}

function canonical(page: SeoPage) {
  return page.path === "/" ? `${origin}/` : `${origin}${page.path}`;
}

function jsonLd(page: SeoPage) {
  const isArabic = page.locale === "ar";
  const pageType = page.kind === "blogPost" ? "Article" : "WebPage";
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
    {
      "@context": "https://schema.org",
      "@type": pageType,
      name: page.title,
      headline: page.title,
      description: page.description,
      url: canonical(page),
      isPartOf: { "@id": `${origin}/#website` },
      about: { "@id": `${origin}/#ibrahim-ghaiyth` },
      author: { "@id": `${origin}/#ibrahim-ghaiyth` },
      publisher: { "@id": `${origin}/#website` },
      inLanguage: page.locale,
    },
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
    <meta name="theme-color" content="#0B1829" />
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
    <meta property="og:image" content="${origin}/opengraph.jpg" />
    <meta property="og:locale" content="${locale}" />
    <meta property="og:locale:alternate" content="${alternateLocale}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${origin}/opengraph.jpg" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <script type="application/ld+json">${jsonLd(page).replace(/</g, "\\u003c")}</script>
  `;
}

export function renderPublicPage(templatePath: string, page: SeoPage) {
  const template = readFileSync(templatePath, "utf8");
  const assetTags = (template.match(/<(?:script|link)[^>]+(?:><\/script>|\/?>)/g) || [])
    .filter((tag) => tag.includes("/assets/"))
    .join("\n");

  return template
    .replace(/<html[^>]*>/, `<html lang="${page.locale}" dir="${page.locale === "ar" ? "rtl" : "ltr"}">`)
    .replace(/<head>[\s\S]*?<\/head>/, `<head>${renderHead(page)}\n${assetTags}</head>`)
    .replace('<div id="root"></div>', `<div id="root"></div><noscript>${renderStaticBody(page)}</noscript>`);
}

export function publicSitemapXml() {
  const urls = allPages
    .map((page) => {
      const alt = alternates(page);
      return `  <url>
    <loc>${canonical(page)}</loc>
    <xhtml:link rel="alternate" hreflang="ar-IQ" href="${alt.ar}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${alt.ar}" />
    <xhtml:link rel="alternate" hreflang="en" href="${alt.en}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${alt.xDefault}" />
    <lastmod>${lastModified}</lastmod>
    <changefreq>${page.kind === "blogPost" ? "monthly" : "weekly"}</changefreq>
    <priority>${page.kind === "home" ? "1.0" : page.kind === "blogPost" ? "0.7" : "0.8"}</priority>
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
${urls}
${showcaseUrls}
</urlset>`;
}
