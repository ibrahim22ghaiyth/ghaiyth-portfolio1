import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { and, asc, eq, or, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { requireAdmin } from "../middlewares/auth";
import { logger } from "../lib/logger";
import { defaultProducts } from "../data/defaultProducts";

const router = Router();

const optionalUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .optional()
  .nullable()
  .transform((value) => (value ? value : null))
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" || value.startsWith("/");
    } catch {
      return value.startsWith("/");
    }
  }, "Invalid URL");

const imageUrlSchema = z
  .string()
  .trim()
  .max(2_800_000)
  .optional()
  .nullable()
  .transform((value) => (value ? value : null))
  .refine((value) => {
    if (!value) return true;
    if (/^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=]+$/i.test(value)) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:" || value.startsWith("/");
    } catch {
      return value.startsWith("/");
    }
  }, "Invalid image URL");

const productTemplateSchema = z.enum(["standard", "ebook", "software", "webapp", "bundle"]).default("standard");

const productInputSchema = z.object({
  slug: z.string().trim().max(90).optional().nullable().transform((value) => value || null),
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().min(10).max(4000),
  titleAr: z.string().trim().max(140).optional().nullable().transform((value) => value || null),
  descriptionAr: z.string().trim().max(4000).optional().nullable().transform((value) => value || null),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  priceLabel: z.string().trim().max(80).optional().nullable().transform((value) => value || null),
  imageUrl: imageUrlSchema,
  requestUrl: optionalUrlSchema,
  template: productTemplateSchema,
  purchaseLabel: z.string().trim().max(90).optional().nullable().transform((value) => value || null),
  purchaseNote: z.string().trim().max(1600).optional().nullable().transform((value) => value || null),
  deliveryType: z.string().trim().max(40).default("digital"),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).max(10000).default(0),
  active: z.boolean().default(true),
});

function cleanSlug(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
  return slug || `product-${Date.now()}`;
}

function mapProductPayload(data: z.infer<typeof productInputSchema>) {
  return {
    ...data,
    slug: cleanSlug(data.slug || data.title),
  };
}

function parseId(raw: unknown): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function isUniqueViolation(error: any): boolean {
  if (error?.code === "23505") return true;
  const message = String(error?.message || error?.cause?.message || "");
  return /UNIQUE constraint failed|SQLITE_CONSTRAINT|duplicate key value/i.test(message);
}

let productSchemaReady: Promise<void> | null = null;

function ensureProductSchema() {
  productSchemaReady ??= (async () => {
    // SQLite does not support ADD COLUMN IF NOT EXISTS. Columns already exist
    // in migrations/0001_init.sql; only fix data + seed defaults.
    const migrations: Array<() => Promise<unknown>> = [
      () => db.execute(sql`UPDATE products SET purchase_label = 'Buy via WhatsApp' WHERE LOWER(purchase_label) LIKE 'pay by card'`),
      () => db.execute(sql`UPDATE products SET request_url = 'https://wa.me/9647805808975' WHERE request_url IS NULL OR request_url = ''`),
    ];

    for (const migrate of migrations) {
      try {
        await migrate();
      } catch (error: any) {
        const message = String(error?.message || error?.cause?.message || "");
        if (/duplicate column|already exists|no such column|syntax error/i.test(message)) continue;
        logger.error({ err: error }, "Product schema migration failed");
      }
    }

    for (const product of defaultProducts) {
      const [existing] = await db
        .select({ id: productsTable.id })
        .from(productsTable)
        .where(eq(productsTable.slug, product.slug));

      if (!existing) {
        await db.insert(productsTable).values({
          ...product,
          tags: [...product.tags],
        });
      }
    }
  })().catch((error) => {
    productSchemaReady = null;
    logger.error({ err: error }, "Unable to ensure product schema");
    throw error;
  });

  return productSchemaReady;
}

router.get("/products", async (_req, res) => {
  await ensureProductSchema();
  const products = await db
    .select()
    .from(productsTable)
    .orderBy(asc(productsTable.order), asc(productsTable.id));
  res.json(products);
});

router.get("/products/:slugOrId", async (req, res) => {
  await ensureProductSchema();
  const raw = String(req.params.slugOrId || "").trim();
  const id = parseId(raw);
  const condition = id
    ? or(eq(productsTable.id, id), eq(productsTable.slug, raw))
    : eq(productsTable.slug, raw);

  const [product] = await db
    .select()
    .from(productsTable)
    .where(and(condition, eq(productsTable.active, true)));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(product);
});

router.post("/products", requireAdmin, async (req, res) => {
  await ensureProductSchema();
  const parsed = productInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid product input", details: parsed.error.issues });
    return;
  }

  try {
    const [product] = await db.insert(productsTable).values(mapProductPayload(parsed.data)).returning();
    res.status(201).json(product);
  } catch (error: any) {
    logger.error({ err: error }, "Unable to save product");
    if (isUniqueViolation(error)) {
      res.status(409).json({ error: "A product with this slug already exists" });
      return;
    }
    res.status(500).json({ error: "Unable to save product" });
  }
});

router.put("/products/:id", requireAdmin, async (req, res) => {
  await ensureProductSchema();
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = productInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid product input", details: parsed.error.issues });
    return;
  }

  let product;
  try {
    [product] = await db
      .update(productsTable)
      .set(mapProductPayload(parsed.data))
      .where(eq(productsTable.id, id))
      .returning();
  } catch (error: any) {
    logger.error({ err: error }, "Unable to save product");
    if (isUniqueViolation(error)) {
      res.status(409).json({ error: "A product with this slug already exists" });
      return;
    }
    res.status(500).json({ error: "Unable to save product" });
    return;
  }

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(product);
});

router.delete("/products/:id", requireAdmin, async (req, res) => {
  await ensureProductSchema();
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.status(204).send();
});

export default router;
