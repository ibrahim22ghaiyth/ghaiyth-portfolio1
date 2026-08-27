const express = require("express");
const { z } = require("zod");
const db = require("../db/connection");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

const taskSchema = z.object({
  project_id: z.number(),
  title: z.string().min(2),
  description: z.string().optional().default(""),
  status: z.enum(["todo", "in_progress", "done"]).optional().default("todo"),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  due_date: z.string().optional().nullable()
});

router.get("/", (req, res) => {
  const { status, priority, project_id } = req.query;
  const clauses = ["t.user_id = ?"];
  const values = [req.user.id];

  if (status) {
    clauses.push("t.status = ?");
    values.push(status);
  }

  if (priority) {
    clauses.push("t.priority = ?");
    values.push(priority);
  }

  if (project_id) {
    clauses.push("t.project_id = ?");
    values.push(project_id);
  }

  const tasks = db.prepare(`
    SELECT t.*, p.name as project_name, p.color as project_color
    FROM tasks t
    JOIN projects p ON p.id = t.project_id
    WHERE ${clauses.join(" AND ")}
    ORDER BY
      CASE t.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
      t.due_date ASC
  `).all(...values);

  res.json({ tasks });
});

router.post("/", (req, res) => {
  const data = taskSchema.parse(req.body);

  const project = db.prepare("SELECT id FROM projects WHERE id = ? AND user_id = ?").get(data.project_id, req.user.id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  const result = db.prepare(`
    INSERT INTO tasks (project_id, user_id, title, description, status, priority, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(data.project_id, req.user.id, data.title, data.description, data.status, data.priority, data.due_date || null);

  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ task });
});

router.put("/:id", (req, res) => {
  const data = taskSchema.partial().parse(req.body);
  const task = db.prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?").get(req.params.id, req.user.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const updated = {
    project_id: data.project_id ?? task.project_id,
    title: data.title ?? task.title,
    description: data.description ?? task.description,
    status: data.status ?? task.status,
    priority: data.priority ?? task.priority,
    due_date: data.due_date ?? task.due_date
  };

  db.prepare(`
    UPDATE tasks
    SET project_id = ?, title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `).run(updated.project_id, updated.title, updated.description, updated.status, updated.priority, updated.due_date, req.params.id, req.user.id);

  res.json({ task: db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id) });
});

router.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
  if (result.changes === 0) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
});

module.exports = router;
