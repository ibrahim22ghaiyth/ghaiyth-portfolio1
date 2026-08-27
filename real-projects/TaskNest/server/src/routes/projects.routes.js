const express = require("express");
const { z } = require("zod");
const db = require("../db/connection");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().default(""),
  color: z.string().optional().default("#4f46e5"),
  status: z.enum(["active", "planning", "archived"]).optional().default("active")
});

router.get("/", (req, res) => {
  const projects = db.prepare(`
    SELECT
      p.*,
      COUNT(t.id) as task_count,
      SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) as done_count
    FROM projects p
    LEFT JOIN tasks t ON t.project_id = p.id
    WHERE p.user_id = ?
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `).all(req.user.id);

  res.json({ projects });
});

router.post("/", (req, res) => {
  const data = projectSchema.parse(req.body);

  const result = db.prepare(`
    INSERT INTO projects (user_id, name, description, color, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(req.user.id, data.name, data.description, data.color, data.status);

  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ project });
});

router.put("/:id", (req, res) => {
  const data = projectSchema.partial().parse(req.body);
  const project = db.prepare("SELECT * FROM projects WHERE id = ? AND user_id = ?").get(req.params.id, req.user.id);

  if (!project) return res.status(404).json({ message: "Project not found" });

  const updated = {
    name: data.name ?? project.name,
    description: data.description ?? project.description,
    color: data.color ?? project.color,
    status: data.status ?? project.status
  };

  db.prepare(`
    UPDATE projects
    SET name = ?, description = ?, color = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(updated.name, updated.description, updated.color, updated.status, req.params.id, req.user.id);

  res.json({ project: db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id) });
});

router.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM projects WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ message: "Project not found" });
  res.json({ message: "Project deleted" });
});

module.exports = router;
