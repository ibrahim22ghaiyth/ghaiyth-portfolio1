const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./db/connection");
const initDatabase = require("./db/init");

// Ensure schema exists (and seed on first run) before serving requests.
initDatabase({ seed: true, log: false });

const authRoutes = require("./routes/auth.routes");
const projectsRoutes = require("./routes/projects.routes");
const tasksRoutes = require("./routes/tasks.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, app: "TaskNest API", version: "1.0.0" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((error, req, res, next) => {
  if (error.name === "ZodError") {
    return res.status(400).json({ message: "Validation error", issues: error.issues });
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`TaskNest API running on http://localhost:${port}`);
});
