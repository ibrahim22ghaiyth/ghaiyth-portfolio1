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

const seedTestimonials = [
  {
    clientName: "Academic Accountant Team",
    clientNameAr: "فريق المحاسب الأكاديمي",
    company: "Academic Accountant",
    companyAr: "المحاسب الأكاديمي",
    projectName: "Accounting and training platform",
    projectNameAr: "منصة محاسبة وتدريب مالي",
    feedback:
      "Ibrahim delivered a professional bilingual platform with clean pages, a practical admin panel, and the security details we needed before launch.",
    feedbackAr:
      "إبراهيم أنجز منصة احترافية ثنائية اللغة بصفحات مرتبة ولوحة إدارة عملية وتفاصيل حماية كنا نحتاجها قبل الإطلاق.",
    rating: 5,
    order: 1,
    active: true,
  },
  {
    clientName: "Qassitha Product Team",
    clientNameAr: "فريق قسّطها",
    company: "Qassitha",
    companyAr: "قسّطها",
    projectName: "Installment tracking interface",
    projectNameAr: "واجهة متابعة الأقساط",
    feedback:
      "The workflow became clearer and easier to present. The interface focuses on the real daily problem instead of adding unnecessary complexity.",
    feedbackAr:
      "صار مسار العمل أوضح وأسهل بالعرض. الواجهة ركزت على المشكلة اليومية الحقيقية بدون تعقيد زائد.",
    rating: 5,
    order: 2,
    active: true,
  },
  {
    clientName: "Architect Planning Client",
    clientNameAr: "عميل منصة مِعمار",
    company: "Architect",
    companyAr: "مِعمار",
    projectName: "Project planning assistant",
    projectNameAr: "مساعد تخطيط المشاريع",
    feedback:
      "The product helped turn loose project ideas into a structured plan with clear steps, bilingual content, and a polished user experience.",
    feedbackAr:
      "المنتج ساعد بتحويل أفكار المشاريع غير المرتبة إلى خطة واضحة بخطوات منظمة ومحتوى ثنائي اللغة وتجربة استخدام مصقولة.",
    rating: 5,
    order: 3,
    active: true,
  },
];

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
