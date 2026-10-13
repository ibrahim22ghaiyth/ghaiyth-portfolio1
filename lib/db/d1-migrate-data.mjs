import pg from "pg";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const envRaw = await readFile(path.resolve(moduleDir, "../../.env"), "utf8");

function env(name) {
  const match = envRaw.match(new RegExp(`^${name}=(.*)$`, "m"));
  return match ? match[1].trim() : "";
}

const TOKEN = env("CLOUDFLARE_API_TOKEN");
const DATABASE_URL = env("DATABASE_URL");
const ACCOUNT_ID = "b31a79a2f471196e377d61c95b7463d2";
const DB_ID = "ff8c8a1a-70fa-41bd-b9b3-5a8e756883e3";

if (!TOKEN || !DATABASE_URL) {
  console.error("Missing CLOUDFLARE_API_TOKEN or DATABASE_URL in .env");
  process.exit(1);
}

async function d1Query(sql, params = []) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ sql, params }),
  });
  const data = await res.json();
  if (!data.success) {
    console.error("D1 error:", JSON.stringify(data.errors));
    throw new Error(data.errors?.[0]?.message || "D1 query failed");
  }
  return data.result;
}

const pool = new pg.Pool({ connectionString: DATABASE_URL, max: 2 });

function toUnixSeconds(value) {
  if (value == null) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Math.floor(date.getTime() / 1000);
}

function toJsonArray(value) {
  if (value == null) return "[]";
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return JSON.stringify(Array.isArray(parsed) ? parsed : [parsed]);
    } catch {
      return "[]";
    }
  }
  return "[]";
}

const TABLES = {
  content: {
    columns: ["key", "value", "type"],
    map: (row) => [row.key, row.value, row.type],
  },
  messages: {
    columns: ["name", "email", "subject", "message", "status", "created_at"],
    map: (row) => [row.name, row.email, row.subject, row.message, row.status || "unread", toUnixSeconds(row.created_at)],
  },
  visits: {
    columns: ["client_id", "country", "path", "user_agent", "visitor_key", "created_at"],
    map: (row) => [
      row.client_id,
      row.country || "Unknown",
      row.path || "/",
      row.user_agent ?? "",
      row.visitor_key ?? "",
      toUnixSeconds(row.created_at),
    ],
  },
  services: {
    columns: ["title", "description", "title_ar", "description_ar", "icon", "order", "active"],
    map: (row) => [row.title, row.description, row.title_ar, row.description_ar, row.icon, row.order ?? 0, row.active ? 1 : 0],
  },
  skills: {
    columns: ["name", "name_ar", "percentage", "category", "order", "active"],
    map: (row) => [row.name, row.name_ar, row.percentage, row.category, row.order ?? 0, row.active ? 1 : 0],
  },
  projects: {
    columns: [
      "title", "description", "title_ar", "description_ar", "tech_stack", "live_url", "github_url", "image_url",
      "featured", "order", "active", "status", "image_alt_en", "image_alt_ar", "audience_en", "audience_ar",
      "role_en", "role_ar", "problem_en", "problem_ar", "solution_en", "solution_ar",
      "stack_desc_en", "stack_desc_ar", "outcome_en", "outcome_ar",
    ],
    map: (row) => [
      row.title, row.description, row.title_ar, row.description_ar, toJsonArray(row.tech_stack),
      row.live_url, row.github_url, row.image_url, row.featured ? 1 : 0, row.order ?? 0, row.active ? 1 : 0,
      row.status || "live", row.image_alt_en, row.image_alt_ar, row.audience_en, row.audience_ar,
      row.role_en, row.role_ar, row.problem_en, row.problem_ar, row.solution_en, row.solution_ar,
      row.stack_desc_en, row.stack_desc_ar, row.outcome_en, row.outcome_ar,
    ],
  },
  blog_posts: {
    columns: [
      "title", "title_ar", "excerpt", "excerpt_ar", "content", "content_ar", "slug",
      "category", "category_ar", "reading_minutes", "cover_image_url", "tags",
      "featured", "order", "active", "published_at", "created_at", "updated_at",
    ],
    map: (row) => [
      row.title, row.title_ar, row.excerpt, row.excerpt_ar, row.content || "", row.content_ar, row.slug,
      row.category, row.category_ar, row.reading_minutes, row.cover_image_url, toJsonArray(row.tags),
      row.featured ? 1 : 0, row.order ?? 0, row.active ? 1 : 0,
      toUnixSeconds(row.published_at), toUnixSeconds(row.created_at), toUnixSeconds(row.updated_at),
    ],
  },
  products: {
    columns: [
      "slug", "title", "description", "title_ar", "description_ar", "tags",
      "price_label", "image_url", "request_url", "template", "purchase_label", "purchase_note",
      "delivery_type", "featured", "order", "active",
    ],
    map: (row) => [
      row.slug, row.title, row.description, row.title_ar, row.description_ar, toJsonArray(row.tags),
      row.price_label, row.image_url, row.request_url, row.template || "standard",
      row.purchase_label, row.purchase_note, row.delivery_type || "digital",
      row.featured ? 1 : 0, row.order ?? 0, row.active ? 1 : 0,
    ],
  },
  testimonials: {
    columns: [
      "client_name", "client_name_ar", "company", "company_ar", "feedback", "feedback_ar",
      "project_name", "project_name_ar", "rating", "order", "active", "created_at", "updated_at",
    ],
    map: (row) => [
      row.client_name, row.client_name_ar, row.company, row.company_ar, row.feedback, row.feedback_ar,
      row.project_name, row.project_name_ar, row.rating ?? 5, row.order ?? 0, row.active ? 1 : 0,
      toUnixSeconds(row.created_at), toUnixSeconds(row.updated_at),
    ],
  },
};

let totalInserted = 0;

for (const [pgTable, config] of Object.entries(TABLES)) {
  const { rows } = await pool.query(`SELECT * FROM "${pgTable}"`);
  console.log(`${pgTable}: ${rows.length} rows from PostgreSQL`);

  if (rows.length === 0) continue;

  const placeholders = config.columns.map((_, i) => `?${i + 1}`).join(", ");
  const insertSql = `INSERT INTO "${pgTable}" (${config.columns.map((c) => `"${c}"`).join(", ")}) VALUES (${placeholders})`;

  for (const row of rows) {
    const params = config.map(row);
    await d1Query(insertSql, params);
    totalInserted += 1;
  }

  const [countResult] = await d1Query(`SELECT COUNT(*) AS c FROM "${pgTable}"`);
  console.log(`  -> inserted into D1, count now: ${countResult?.results?.[0]?.c ?? "?"}`);
}

await pool.end();
console.log(`\nDone. Total rows migrated: ${totalInserted}`);
