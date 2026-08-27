import { Router } from "express";
import { db, projectsTable } from "@workspace/db";
import { asc, eq, inArray } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { projectArchive } from "../data/projectArchive";

const router = Router();

async function ensureArchiveProjects() {
  const titles = projectArchive.map((project) => project.title);
  const existingProjects = await db
    .select({ id: projectsTable.id, title: projectsTable.title })
    .from(projectsTable)
    .where(inArray(projectsTable.title, titles));
  const existingTitles = new Map(existingProjects.map((project) => [project.title, project.id]));
  const missingProjects = projectArchive.filter((project) => !existingTitles.has(project.title));

  if (missingProjects.length) {
    await db.insert(projectsTable).values(missingProjects);
  }

}

router.get("/projects", async (req, res) => {
  await ensureArchiveProjects();
  const projects = await db
    .select()
    .from(projectsTable)
    .orderBy(asc(projectsTable.order), asc(projectsTable.id));
  res.json(projects);
});

router.post("/projects", requireAdmin, async (req, res) => {
  const { title, description, titleAr, descriptionAr, techStack, liveUrl, githubUrl, imageUrl, featured, order, active } =
    req.body as {
      title: string;
      description: string;
      titleAr?: string | null;
      descriptionAr?: string | null;
      techStack: string[];
      liveUrl?: string | null;
      githubUrl?: string | null;
      imageUrl?: string | null;
      featured?: boolean;
      order?: number;
      active?: boolean;
    };
  if (!title || !description) {
    res.status(400).json({ error: "title and description are required" });
    return;
  }
  const [project] = await db
    .insert(projectsTable)
    .values({
      title,
      description,
      titleAr: titleAr ?? null,
      descriptionAr: descriptionAr ?? null,
      techStack: techStack ?? [],
      liveUrl: liveUrl ?? null,
      githubUrl: githubUrl ?? null,
      imageUrl: imageUrl ?? null,
      featured: featured ?? false,
      order: order ?? 0,
      active: active ?? true,
    })
    .returning();
  res.status(201).json(project);
});

router.put("/projects/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { title, description, titleAr, descriptionAr, techStack, liveUrl, githubUrl, imageUrl, featured, order, active } =
    req.body as {
      title: string;
      description: string;
      titleAr?: string | null;
      descriptionAr?: string | null;
      techStack: string[];
      liveUrl?: string | null;
      githubUrl?: string | null;
      imageUrl?: string | null;
      featured?: boolean;
      order?: number;
      active?: boolean;
    };
  const [project] = await db
    .update(projectsTable)
    .set({
      title,
      description,
      titleAr: titleAr ?? null,
      descriptionAr: descriptionAr ?? null,
      techStack: techStack ?? [],
      liveUrl: liveUrl ?? null,
      githubUrl: githubUrl ?? null,
      imageUrl: imageUrl ?? null,
      featured: featured ?? false,
      order: order ?? 0,
      active: active ?? true,
    })
    .where(eq(projectsTable.id, id))
    .returning();
  if (!project) { res.status(404).json({ error: "Project not found" }); return; }
  res.json(project);
});

router.delete("/projects/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(projectsTable).where(eq(projectsTable.id, id));
  res.status(204).send();
});

export default router;
