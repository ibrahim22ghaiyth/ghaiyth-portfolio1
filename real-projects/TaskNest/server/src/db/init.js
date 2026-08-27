const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const db = require("./connection");

// Creates the schema (idempotent) and seeds demo data on first run.
// Safe to call on every server start: schema uses CREATE TABLE IF NOT EXISTS,
// and seeding only happens when there is no data yet.
function initDatabase({ seed = true, log = false } = {}) {
  const schemaPath = path.join(__dirname, "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");
  db.exec(schema);

  if (!seed) return;

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get("ibrahim@example.com");

  let userId;
  if (!existing) {
    const passwordHash = bcrypt.hashSync("password123", 10);
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `).run("Ibrahim Ghaiyth", "ibrahim@example.com", passwordHash, "admin");
    userId = result.lastInsertRowid;
  } else {
    userId = existing.id;
  }

  const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects WHERE user_id = ?").get(userId).count;

  if (projectCount === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (user_id, name, description, color, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    const website = insertProject.run(userId, "Client Website Launch", "Website delivery tasks for a client project.", "#4f46e5", "active").lastInsertRowid;
    const crm = insertProject.run(userId, "CRM Dashboard", "Internal dashboard tasks and reports.", "#0f766e", "active").lastInsertRowid;
    const app = insertProject.run(userId, "Mobile App Planning", "Planning board for app features.", "#c2410c", "planning").lastInsertRowid;

    const insertTask = db.prepare(`
      INSERT INTO tasks (project_id, user_id, title, description, status, priority, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertTask.run(website, userId, "Finalize homepage copy", "Review and approve homepage content.", "done", "high", "2026-06-15");
    insertTask.run(website, userId, "Prepare responsive QA", "Check mobile, tablet, and desktop layouts.", "in_progress", "medium", "2026-06-18");
    insertTask.run(website, userId, "Send launch checklist", "Prepare checklist before publishing.", "todo", "high", "2026-06-20");

    insertTask.run(crm, userId, "Build reports page", "Add monthly analytics and lead stats.", "in_progress", "high", "2026-06-21");
    insertTask.run(crm, userId, "Add settings form", "Workspace preferences and notification settings.", "todo", "medium", "2026-06-24");

    insertTask.run(app, userId, "Define MVP features", "List required app features for first release.", "todo", "medium", "2026-06-28");
  }

  if (log) {
    console.log("Database initialized successfully.");
    console.log("Demo login: ibrahim@example.com / password123");
  }
}

module.exports = initDatabase;

// Allow running directly:  node server/src/db/init.js
if (require.main === module) {
  initDatabase({ seed: true, log: true });
}
