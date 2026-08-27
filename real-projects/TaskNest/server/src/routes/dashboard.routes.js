const express = require("express");
const db = require("../db/connection");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.get("/stats", (req, res) => {
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) as todo,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
      SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done,
      SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority
    FROM tasks
    WHERE user_id = ?
  `).get(req.user.id);

  const projects = db.prepare(`
    SELECT COUNT(*) as total_projects
    FROM projects
    WHERE user_id = ?
  `).get(req.user.id);

  res.json({ stats: { ...stats, total_projects: projects.total_projects } });
});

module.exports = router;
