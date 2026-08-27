// Production server for Railway (and any plain Node host).
// Serves the built frontend (dist/) and the /api/chat endpoint backed by Groq.

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { groqChat } from "./api/_groq.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { system, messages, max_tokens } = req.body || {};
    const data = await groqChat({ system, messages, max_tokens });
    res.status(200).json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: String(e.message || e) });
  }
});

const distDir = path.join(__dirname, "dist");
app.use(express.static(distDir));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
