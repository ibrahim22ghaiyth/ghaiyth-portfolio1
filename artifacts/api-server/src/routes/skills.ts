import { Router } from "express";
import { db, skillsTable } from "@workspace/db";
import { eq, asc, count } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

const defaultSkills = [
  {
    name: "React / TypeScript",
    nameAr: "React / TypeScript",
    percentage: 92,
    category: "Frontend",
    order: 1,
    active: true,
  },
  {
    name: "Node.js / Express",
    nameAr: "Node.js / Express",
    percentage: 88,
    category: "Backend",
    order: 2,
    active: true,
  },
  {
    name: "PostgreSQL / Drizzle",
    nameAr: "PostgreSQL / Drizzle",
    percentage: 84,
    category: "Database",
    order: 3,
    active: true,
  },
  {
    name: "Tailwind CSS / UI Systems",
    nameAr: "Tailwind CSS / أنظمة الواجهات",
    percentage: 90,
    category: "Frontend",
    order: 4,
    active: true,
  },
  {
    name: "Deployment / Railway / GitHub",
    nameAr: "النشر / Railway / GitHub",
    percentage: 82,
    category: "DevOps",
    order: 5,
    active: true,
  },
];

async function ensureDefaultSkills() {
  const [result] = await db.select({ value: count() }).from(skillsTable);
  if (Number(result?.value ?? 0) === 0) {
    await db.insert(skillsTable).values(defaultSkills);
  }
}

router.get("/skills", async (req, res) => {
  await ensureDefaultSkills();
  const skills = await db
    .select()
    .from(skillsTable)
    .orderBy(asc(skillsTable.order), asc(skillsTable.id));
  res.json(skills);
});

router.post("/skills", requireAdmin, async (req, res) => {
  const { name, nameAr, percentage, category, order, active } = req.body as {
    name: string;
    nameAr?: string | null;
    percentage: number;
    category: string;
    order?: number;
    active?: boolean;
  };
  if (!name || percentage === undefined || !category) {
    res.status(400).json({ error: "name, percentage, category are required" });
    return;
  }
  const [skill] = await db
    .insert(skillsTable)
    .values({ name, nameAr: nameAr ?? null, percentage, category, order: order ?? 0, active: active ?? true })
    .returning();
  res.status(201).json(skill);
});

router.put("/skills/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { name, nameAr, percentage, category, order, active } = req.body as {
    name: string;
    nameAr?: string | null;
    percentage: number;
    category: string;
    order?: number;
    active?: boolean;
  };
  const [skill] = await db
    .update(skillsTable)
    .set({ name, nameAr: nameAr ?? null, percentage, category, order: order ?? 0, active: active ?? true })
    .where(eq(skillsTable.id, id))
    .returning();
  if (!skill) { res.status(404).json({ error: "Skill not found" }); return; }
  res.json(skill);
});

router.delete("/skills/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(skillsTable).where(eq(skillsTable.id, id));
  res.status(204).send();
});

export default router;
