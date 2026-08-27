// api/chat.js — Vercel serverless function.
// Keeps your Groq API key on the server (never exposed to the browser).
// The frontend calls /api/chat ; this function forwards the request to Groq.

import { groqChat } from "./_groq.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { system, messages, max_tokens } = req.body || {};
    const data = await groqChat({ system, messages, max_tokens });
    return res.status(200).json(data);
  } catch (e) {
    return res.status(e.status || 500).json({ error: String(e.message || e) });
  }
}
