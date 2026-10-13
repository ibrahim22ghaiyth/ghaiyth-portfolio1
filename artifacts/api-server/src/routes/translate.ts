import { Router } from "express";
import { z } from "zod/v4";
import { requireAdmin } from "../middlewares/auth";

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

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    res.status(500).json({ error: "Translation service is not configured" });
    return;
  }

  const sourceName = sourceLang === "ar" ? "Arabic" : "English";
  const targetName = targetLang === "ar" ? "Arabic" : "English";

  const prompt = `You are a professional translator. Translate the following text from ${sourceName} to ${targetName}.
Rules:
- Keep the same tone and style (professional, natural)
- Preserve any formatting, line breaks, and special characters
- Do NOT add explanations, notes, or quotes around the translation
- Output ONLY the translated text

Text to translate:
${text}`;

  const maxRetries = 2;
  let lastStatus = 0;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 8192,
            },
          }),
          signal: AbortSignal.timeout(25_000),
        },
      );

      if (response.ok) {
        const data = await response.json();
        const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!translated) {
          console.error("[translate] Empty response from Gemini");
          res.status(502).json({ error: "Empty translation response" });
          return;
        }

        res.json({ translatedText: translated.trim() });
        return;
      }

      lastStatus = response.status;
      // Retry only on transient errors (429 rate-limit, 5xx overload)
      if (attempt < maxRetries && (response.status === 429 || response.status >= 500)) {
        const waitMs = 800 * (attempt + 1);
        console.warn(`[translate] Gemini ${response.status}, retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      const errBody = await response.text();
      console.error("[translate] Gemini API error:", response.status, errBody.slice(0, 200));
      res.status(502).json({ error: "Translation service error" });
      return;
    } catch (err) {
      if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
        lastStatus = 408;
        if (attempt < maxRetries) {
          const waitMs = 800 * (attempt + 1);
          console.warn(`[translate] Timeout, retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise((r) => setTimeout(r, waitMs));
          continue;
        }
        res.status(502).json({ error: "Translation service timed out" });
        return;
      }
      console.error("[translate] Fetch error:", err);
      res.status(502).json({ error: "Translation service unreachable" });
      return;
    }
  }

  console.error("[translate] All retries exhausted, last status:", lastStatus);
  res.status(502).json({ error: "Translation service unavailable, try again shortly" });
});

export default router;
