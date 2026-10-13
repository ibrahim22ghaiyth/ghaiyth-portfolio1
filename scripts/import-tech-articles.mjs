import { readFileSync } from "node:fs";
import path from "node:path";

const SOURCE = process.argv[2] || "C:/Users/LOQ/Downloads/ig-tech-articles";
const API = process.env.API_BASE || "http://localhost:5000";

const EN = {
  "web-performance-core-web-vitals": {
    title: "Web Performance: How to Actually Make Your Pages Faster?",
    excerpt:
      "From measuring real user experience to fixing the causes of slowness — without guessing.",
    category: "Web Development",
  },
  "designing-rest-apis": {
    title: "Designing REST APIs That Scale and Stay Maintainable",
    excerpt: "Clear contracts, understandable resources, and responses clients can rely on.",
    category: "Backend & APIs",
  },
  "postgresql-indexes-query-plans": {
    title: "PostgreSQL Indexes: When They Speed Queries Up and When They Hurt",
    excerpt: "Understand EXPLAIN and the execution plan before adding another index.",
    category: "Databases",
  },
  "web-security-xss-sqli-csrf": {
    title: "Web Application Security: XSS, SQL Injection, and CSRF",
    excerpt: "Three common risks and practical defenses in design and implementation.",
    category: "Cybersecurity",
  },
  "docker-containers-practical": {
    title: "Docker in Practice: Reproducible Containers from Development to Production",
    excerpt: "Decouple your app from its environment while minding security and image size.",
    category: "DevOps",
  },
  "git-branching-code-review": {
    title: "Git and Teamwork: Small Branches and Effective Code Review",
    excerpt: "A workflow that reduces conflicts and keeps changes reviewable and revertable.",
    category: "Developer Tools",
  },
  "ci-cd-github-actions": {
    title: "CI/CD: From Code Changes to Trustworthy Deployments",
    excerpt: "Automating checks, builds, and releases without turning your pipeline into a black box.",
    category: "DevOps",
  },
  "typescript-practical-javascript": {
    title: "TypeScript for Developers: Clearer Types, Fewer Bugs",
    excerpt: "Adopt type-checking gradually without treating it as a substitute for testing.",
    category: "JavaScript",
  },
  "react-state-rendering-performance": {
    title: "React: Managing State and Cutting Re-renders Without Complexity",
    excerpt: "Start with a clear state model, then improve performance based on measurement.",
    category: "Frontend",
  },
  "nodejs-event-loop-async": {
    title: "The Node.js Event Loop: Why You Shouldn't Block the Thread",
    excerpt: "Understand the difference between async I/O and heavy computation.",
    category: "Backend",
  },
  "postgresql-data-modeling-constraints": {
    title: "Database Design: Relationships and Constraints That Protect Your Data",
    excerpt: "Make critical business rules part of the schema, not assumptions in the UI.",
    category: "Databases",
  },
  "http-dns-tls-cdn-request-flow": {
    title: "What Happens When You Open a Website? From DNS to TLS and CDN",
    excerpt: "The request journey across the network layers every web app depends on.",
    category: "Networking & the Web",
  },
  "web-accessibility-wcag-practical": {
    title: "Web Accessibility: An Interface for Everyone, Not One Segment",
    excerpt: "Semantic HTML, keyboard support, contrast, and usable forms.",
    category: "User Experience",
  },
  "responsive-css-grid-flexbox-container-queries": {
    title: "Modern Responsive Design with Grid, Flexbox, and Container Queries",
    excerpt: "Design for content and space instead of chasing device sizes one by one.",
    category: "Frontend & CSS",
  },
  "websockets-realtime-architecture": {
    title: "WebSockets: Building Real-time Updates Without Overloading the Server",
    excerpt: "When you need a bidirectional connection and how to run it safely.",
    category: "Backend & Real-time",
  },
  "authentication-sessions-tokens": {
    title: "Authentication, Sessions, and Tokens: Choosing What Fits Your App",
    excerpt: "A practical comparison of server sessions and tokens without reducing security to JWT.",
    category: "Security & Applications",
  },
  "web-caching-strategy": {
    title: "Caching Strategy: Where to Store Data and How to Keep It Fresh",
    excerpt: "Browser, CDN, server, and database: every layer has its trade-offs.",
    category: "Performance & Architecture",
  },
  "automated-testing-pyramid-playwright": {
    title: "Automated Testing: Layers That Cover Behavior, Not Coverage Numbers",
    excerpt: "Unit, integration, and browser tests; each layer has a different purpose.",
    category: "Software Quality",
  },
  "observability-logs-metrics-traces": {
    title: "Observability: Connecting Logs, Metrics, and Traces to Understand Production",
    excerpt: "Don't just know the system failed; know where, why, and who was affected.",
    category: "SRE & Operations",
  },
  "building-reliable-ai-features-rag": {
    title: "Adding AI to a Web App: RAG, Evaluation, and Data Protection",
    excerpt: "Build a useful, testable feature instead of bolting a chat box onto everything.",
    category: "Applied AI",
  },
};

function stripFrontmatter(text) {
  const match = text.match(/^---\n[\s\S]*?\n---\n/);
  return match ? text.slice(match[0].length) : text;
}

function preprocessMarkdown(raw, id) {
  let body = stripFrontmatter(raw);
  body = body.replace(/^# .+\n/, "");
  body = body.replace(/\.\.\/images\/article-\d+\.svg/g, `/blog-covers/article-${String(id).padStart(2, "0")}.svg`);
  body = body.replace(/\n\*\*الوسوم:\*\*[^\n]*\n/g, "\n");
  body = body.replace(/\n© [^\n]*\n?$/g, "\n");
  return body.trim();
}

function authHeaders() {
  const token = process.env.ADMIN_TOKEN;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function login() {
  const response = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "Admin@2024" }),
  });
  if (!response.ok) throw new Error(`Login failed: ${response.status}`);
  const { token } = await response.json();
  process.env.ADMIN_TOKEN = token;
}

async function existingSlugs() {
  const response = await fetch(`${API}/api/admin/blog-posts`, { headers: authHeaders() });
  if (!response.ok) throw new Error(`List failed: ${response.status}`);
  const posts = await response.json();
  return new Set(posts.map((post) => post.slug));
}

async function main() {
  await login();
  const index = JSON.parse(readFileSync(path.join(SOURCE, "article-index.json"), "utf8"));
  const have = await existingSlugs();
  const baseDate = Date.UTC(2026, 5, 1);

  let created = 0;
  let skipped = 0;

  for (const article of index) {
    if (have.has(article.slug)) {
      skipped += 1;
      continue;
    }

    const mdPath = path.join(SOURCE, "markdown", `${String(article.id).padStart(2, "0")}-${article.slug}.md`);
    const raw = readFileSync(mdPath, "utf8");
    const contentAr = preprocessMarkdown(raw, article.id);
    const en = EN[article.slug];

    const payload = {
      title: en.title,
      titleAr: article.title,
      excerpt: en.excerpt,
      excerptAr: article.subtitle,
      content: "",
      contentAr,
      slug: article.slug,
      category: en.category,
      categoryAr: article.category,
      readingMinutes: article.minutes,
      coverImageUrl: `/blog-covers/article-${String(article.id).padStart(2, "0")}.svg`,
      tags: article.tags,
      featured: false,
      order: article.id,
      active: true,
      publishedAt: new Date(baseDate + (article.id - 1) * 3 * 86_400_000).toISOString(),
    };

    const response = await fetch(`${API}/api/admin/blog-posts`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`FAIL ${article.slug}: ${response.status} ${body.slice(0, 200)}`);
      process.exitCode = 1;
      continue;
    }

    created += 1;
    console.log(`created ${article.id} ${article.slug}`);
  }

  console.log(`done: created=${created} skipped=${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
