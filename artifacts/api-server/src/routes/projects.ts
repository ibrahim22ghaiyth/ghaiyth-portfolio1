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
  const { title, description, titleAr, descriptionAr, techStack, liveUrl, githubUrl, imageUrl, featured, order, active,
    status, imageAltEn, imageAltAr, audienceEn, audienceAr, roleEn, roleAr, problemEn, problemAr,
    solutionEn, solutionAr, stackDescEn, stackDescAr, outcomeEn, outcomeAr } =
    req.body as any;
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
      status: status ?? "live",
      imageAltEn: imageAltEn ?? null,
      imageAltAr: imageAltAr ?? null,
      audienceEn: audienceEn ?? null,
      audienceAr: audienceAr ?? null,
      roleEn: roleEn ?? null,
      roleAr: roleAr ?? null,
      problemEn: problemEn ?? null,
      problemAr: problemAr ?? null,
      solutionEn: solutionEn ?? null,
      solutionAr: solutionAr ?? null,
      stackDescEn: stackDescEn ?? null,
      stackDescAr: stackDescAr ?? null,
      outcomeEn: outcomeEn ?? null,
      outcomeAr: outcomeAr ?? null,
    })
    .returning();
  res.status(201).json(project);
});

router.put("/projects/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = req.body as any;
  const [project] = await db
    .update(projectsTable)
    .set({
      title: body.title,
      description: body.description,
      titleAr: body.titleAr ?? null,
      descriptionAr: body.descriptionAr ?? null,
      techStack: body.techStack ?? [],
      liveUrl: body.liveUrl ?? null,
      githubUrl: body.githubUrl ?? null,
      imageUrl: body.imageUrl ?? null,
      featured: body.featured ?? false,
      order: body.order ?? 0,
      active: body.active ?? true,
      status: body.status ?? "live",
      imageAltEn: body.imageAltEn ?? null,
      imageAltAr: body.imageAltAr ?? null,
      audienceEn: body.audienceEn ?? null,
      audienceAr: body.audienceAr ?? null,
      roleEn: body.roleEn ?? null,
      roleAr: body.roleAr ?? null,
      problemEn: body.problemEn ?? null,
      problemAr: body.problemAr ?? null,
      solutionEn: body.solutionEn ?? null,
      solutionAr: body.solutionAr ?? null,
      stackDescEn: body.stackDescEn ?? null,
      stackDescAr: body.stackDescAr ?? null,
      outcomeEn: body.outcomeEn ?? null,
      outcomeAr: body.outcomeAr ?? null,
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
