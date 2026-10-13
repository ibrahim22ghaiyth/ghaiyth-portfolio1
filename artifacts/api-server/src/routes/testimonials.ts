import { Router } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

const testimonialInputSchema = z.object({
  clientName: z.string().trim().min(2).max(120),
  clientNameAr: z.string().trim().max(120).optional().nullable().transform((value) => value || null),
  company: z.string().trim().min(2).max(160),
  companyAr: z.string().trim().max(160).optional().nullable().transform((value) => value || null),
  feedback: z.string().trim().min(10).max(900),
  feedbackAr: z.string().trim().max(900).optional().nullable().transform((value) => value || null),
  projectName: z.string().trim().max(160).optional().nullable().transform((value) => value || null),
  projectNameAr: z.string().trim().max(160).optional().nullable().transform((value) => value || null),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  order: z.coerce.number().int().min(0).max(10000).default(0),
  active: z.boolean().default(true),
});

const seedTestimonials: Array<{
  clientName: string;
  clientNameAr: string | null;
  company: string;
  companyAr: string | null;
  feedback: string;
  feedbackAr: string | null;
  projectName: string | null;
  projectNameAr: string | null;
  rating: number;
  order: number;
  active: boolean;
}> = [];

let tableReady: Promise<void> | null = null;

function ensureTestimonialsTable() {
  tableReady ??= (async () => {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id serial PRIMARY KEY,
        client_name text NOT NULL,
        client_name_ar text,
        company text NOT NULL,
        company_ar text,
        feedback text NOT NULL,
        feedback_ar text,
        project_name text,
        project_name_ar text,
        rating integer NOT NULL DEFAULT 5,
        "order" integer NOT NULL DEFAULT 0,
        active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
  })();
  return tableReady;
}

async function ensureSeedTestimonials() {
  await ensureTestimonialsTable();
  if (seedTestimonials.length === 0) return;
  const existing = await db.select({ id: testimonialsTable.id }).from(testimonialsTable).limit(1);
  if (existing.length === 0) {
    await db.insert(testimonialsTable).values(seedTestimonials);
  }
}

function parseId(raw: unknown): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

router.get("/testimonials", async (_req, res) => {
  await ensureSeedTestimonials();
  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .where(eq(testimonialsTable.active, true))
    .orderBy(asc(testimonialsTable.order), asc(testimonialsTable.id));
  res.json(testimonials);
});

router.get("/admin/testimonials", requireAdmin, async (_req, res) => {
  await ensureSeedTestimonials();
  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .orderBy(asc(testimonialsTable.order), asc(testimonialsTable.id));
  res.json(testimonials);
});

router.post("/admin/testimonials", requireAdmin, async (req, res) => {
  await ensureTestimonialsTable();
  const parsed = testimonialInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid testimonial input" });
    return;
  }

  const [testimonial] = await db.insert(testimonialsTable).values(parsed.data).returning();
  res.status(201).json(testimonial);
});

router.put("/admin/testimonials/:id", requireAdmin, async (req, res) => {
  await ensureTestimonialsTable();
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = testimonialInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid testimonial input" });
    return;
  }

  const [testimonial] = await db
    .update(testimonialsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(testimonialsTable.id, id))
    .returning();

  if (!testimonial) {
    res.status(404).json({ error: "Testimonial not found" });
    return;
  }

  res.json(testimonial);
});

router.delete("/admin/testimonials/:id", requireAdmin, async (req, res) => {
  await ensureTestimonialsTable();
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id));
  res.status(204).send();
});

export default router;
