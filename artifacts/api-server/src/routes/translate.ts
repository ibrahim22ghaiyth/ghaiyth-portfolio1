import { Router } from "express";
import { z } from "zod/v4";
import { requireAdmin } from "../middlewares/auth";
import { translateText } from "../lib/gemini";

const router = Router();

const translateInputSchema = z.object({
  text: z.string().min(1).max(10000),
  sourceLang: z.enum(["ar", "en"]),
  targetLang: z.enum(["ar", "en"]),
});

// Rate limit: max 30 translations per minute per admin session
const translateTimestamps: number[] = [];
function isRateLimited(): boolean {
  const now = Date.now();
  while (translateTimestamps.length && translateTimestamps[0] < now - 60_000) {
    translateTimestamps.shift();
  }
  if (translateTimestamps.length >= 30) return true;
  translateTimestamps.push(now);
  return false;
}

router.post("/admin/translate", requireAdmin, async (req, res) => {
  if (isRateLimited()) {
    res.status(429).json({ error: "Too many translation requests. Wait a minute." });
    return;
  }

  const parsed = translateInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid translate input" });
    return;
  }

  const { text, sourceLang, targetLang } = parsed.data;

  if (sourceLang === targetLang) {
    res.json({ translatedText: text });
    return;
  }

  try {
    const translatedText = await translateText(text, sourceLang, targetLang);
    res.json({ translatedText });
  } catch (err) {
    console.error("[translate] Translation failed:", err);
    res.status(502).json({ error: "Translation service unavailable, try again shortly" });
  }
});

export default router;
