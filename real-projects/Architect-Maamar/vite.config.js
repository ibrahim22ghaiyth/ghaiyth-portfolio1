import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { groqChat } from "./api/_groq.js";

// Dev-only middleware that emulates the /api/chat Vercel function so the
// AI assistant works with plain `npm run dev` (no Vercel CLI needed).
function apiChatDevPlugin() {
  return {
    name: "api-chat-dev",
    configureServer(server) {
      server.middlewares.use("/api/chat", (req, res, next) => {
        if (req.method !== "POST") return next();
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
          try {
            const { system, messages, max_tokens } = JSON.parse(body || "{}");
            const data = await groqChat({ system, messages, max_tokens });
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify(data));
          } catch (e) {
            res.statusCode = e.status || 500;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ error: String(e.message || e) }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || env.GROQ_API_KEY;
  process.env.GROQ_MODEL = process.env.GROQ_MODEL || env.GROQ_MODEL;

  return {
    plugins: [react(), apiChatDevPlugin()],
  };
});
