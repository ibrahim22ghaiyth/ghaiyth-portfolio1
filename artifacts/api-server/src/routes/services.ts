import { Router } from "express";
import { db, servicesTable } from "@workspace/db";
import { eq, asc, count } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

const defaultServices = [
  {
    title: "Websites and Landing Pages",
    titleAr: "مواقع وصفحات تعريفية",
    description: "Modern, responsive websites for personal brands, businesses, campaigns, and service pages with clear structure and strong calls to action.",
    descriptionAr: "مواقع حديثة ومتجاوبة للعلامات الشخصية والأعمال والحملات وصفحات الخدمات، بتنظيم واضح ودعوات تواصل مباشرة.",
    icon: "MonitorSmartphone",
    order: 1,
    active: true,
  },
  {
    title: "Admin Dashboards",
    titleAr: "لوحات تحكم وإدارة",
    description: "Secure control panels for managing projects, services, messages, products, blog posts, and operational content without editing code.",
    descriptionAr: "لوحات أدمن آمنة لإدارة المشاريع والخدمات والرسائل والمنتجات والمدونة والمحتوى التشغيلي بدون تعديل الكود.",
    icon: "LayoutDashboard",
    order: 2,
    active: true,
  },
  {
    title: "Database Systems",
    titleAr: "أنظمة بيانات خلفية",
    description: "Persistent backend systems that keep client data, requests, visitor analytics, and content safe after every deployment or update.",
    descriptionAr: "أنظمة باكند وقواعد بيانات تحفظ الرسائل والطلبات والزوار والمحتوى بعد كل تحديث أو نشر جديد.",
    icon: "Database",
    order: 3,
    active: true,
  },
  {
    title: "Launch and Optimization",
    titleAr: "الإطلاق والتحسين",
    description: "Deployment setup, SEO foundations, performance improvements, security hardening, and a cleaner workflow from GitHub to production.",
    descriptionAr: "تجهيز النشر، أساسيات SEO، تحسين الأداء، تشديد الحماية، وترتيب مسار العمل من GitHub إلى الموقع الحي.",
    icon: "Rocket",
    order: 4,
    active: true,
  },
];

async function ensureDefaultServices() {
  const [result] = await db.select({ value: count() }).from(servicesTable);
  if (Number(result?.value ?? 0) === 0) {
    await db.insert(servicesTable).values(defaultServices);
  }
}

router.get("/services", async (req, res) => {
  await ensureDefaultServices();
  const services = await db
    .select()
    .from(servicesTable)
    .orderBy(asc(servicesTable.order), asc(servicesTable.id));
  res.json(services);
});

router.post("/services", requireAdmin, async (req, res) => {
  const { title, description, titleAr, descriptionAr, icon, order, active } = req.body as {
    title: string;
    description: string;
    titleAr?: string | null;
    descriptionAr?: string | null;
    icon: string;
    order?: number;
    active?: boolean;
  };
  if (!title || !description || !icon) {
    res.status(400).json({ error: "title, description, icon are required" });
    return;
  }
  const [service] = await db
    .insert(servicesTable)
    .values({
      title,
      description,
      titleAr: titleAr ?? null,
      descriptionAr: descriptionAr ?? null,
      icon,
      order: order ?? 0,
      active: active ?? true,
    })
    .returning();
  res.status(201).json(service);
});

router.put("/services/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { title, description, titleAr, descriptionAr, icon, order, active } = req.body as {
    title: string;
    description: string;
    titleAr?: string | null;
    descriptionAr?: string | null;
    icon: string;
    order?: number;
    active?: boolean;
  };
  const [service] = await db
    .update(servicesTable)
    .set({
      title,
      description,
      titleAr: titleAr ?? null,
      descriptionAr: descriptionAr ?? null,
      icon,
      order: order ?? 0,
      active: active ?? true,
    })
    .where(eq(servicesTable.id, id))
    .returning();
  if (!service) { res.status(404).json({ error: "Service not found" }); return; }
  res.json(service);
});

router.delete("/services/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(servicesTable).where(eq(servicesTable.id, id));
  res.status(204).send();
});

export default router;
