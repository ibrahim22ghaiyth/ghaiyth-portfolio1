const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

const CHUNK_CHAR_LIMIT = 7000;
const MAX_RETRIES = 2;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function splitForTranslation(text: string): string[] {
  if (text.length <= CHUNK_CHAR_LIMIT) return [text];

  const paragraphs = text.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length > CHUNK_CHAR_LIMIT && current) {
      chunks.push(current);
      current = paragraph;
    } else {
      current = candidate;
    }
    while (current.length > CHUNK_CHAR_LIMIT * 1.5) {
      chunks.push(current.slice(0, CHUNK_CHAR_LIMIT));
      current = current.slice(CHUNK_CHAR_LIMIT);
    }
  }

  if (current.trim()) chunks.push(current);
  return chunks.length ? chunks : [text.slice(0, CHUNK_CHAR_LIMIT)];
}

function buildPrompt(text: string, sourceName: string, targetName: string) {
  return `You are a professional translator. Translate the following text from ${sourceName} to ${targetName}.
Rules:
- Keep the same tone and style (professional, natural)
- Preserve all Markdown formatting exactly: headings, lists, code fences, bold/italic, links, tables
- Keep code blocks, URLs, and technical identifiers unchanged
- Do NOT add explanations, notes, or quotes around the translation
- Output ONLY the translated text

Text to translate:
${text}`;
}

async function callGemini(prompt: string, apiKey: string): Promise<string> {
  let lastStatus = 0;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(GEMINI_ENDPOINT, {
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
        signal: AbortSignal.timeout(30_000),
      });

      if (response.ok) {
        const data = await response.json();
        const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!translated) {
          throw new Error("Empty translation response");
        }
        return translated.trim();
      }

      lastStatus = response.status;
      if (attempt < MAX_RETRIES && (response.status === 429 || response.status >= 500)) {
        await sleep(800 * (attempt + 1));
        continue;
      }
      throw new Error(`Gemini API error ${response.status}`);
    } catch (err) {
      const isTimeout = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
      if (isTimeout && attempt < MAX_RETRIES) {
        await sleep(800 * (attempt + 1));
        continue;
      }
      if (err instanceof Error && err.message.startsWith("Gemini API error")) throw err;
      if (isTimeout) throw new Error("Gemini API timeout");
      if (attempt < MAX_RETRIES) {
        await sleep(800 * (attempt + 1));
        continue;
      }
      throw err;
    }
  }

  throw new Error(`Gemini unavailable (last status ${lastStatus})`);
}

async function callOpenAI(prompt: string, apiKey: string): Promise<string> {
  let lastStatus = 0;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(OPENAI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a professional translator. Output ONLY the translated text with no notes, quotes, or explanations.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 4096,
        }),
        signal: AbortSignal.timeout(60_000),
      });

      if (response.ok) {
        const data = await response.json();
        const translated = data?.choices?.[0]?.message?.content;
        if (!translated) {
          throw new Error("Empty translation response");
        }
        return translated.trim();
      }

      lastStatus = response.status;
      if (attempt < MAX_RETRIES && (response.status === 429 || response.status >= 500)) {
        await sleep(1200 * (attempt + 1));
        continue;
      }
      const errBody = await response.text().catch(() => "");
      throw new Error(`OpenAI API error ${response.status} ${errBody.slice(0, 150)}`);
    } catch (err) {
      const isTimeout = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
      if (isTimeout && attempt < MAX_RETRIES) {
        await sleep(1200 * (attempt + 1));
        continue;
      }
      if (err instanceof Error && err.message.startsWith("OpenAI API error")) throw err;
      if (attempt < MAX_RETRIES) {
        await sleep(1200 * (attempt + 1));
        continue;
      }
      throw err;
    }
  }

  throw new Error(`OpenAI unavailable (last status ${lastStatus})`);
}

export async function translateText(
  text: string,
  sourceLang: "ar" | "en",
  targetLang: "ar" | "en",
): Promise<string> {
  if (!text.trim() || sourceLang === targetLang) return text;

  const sourceName = sourceLang === "ar" ? "Arabic" : "English";
  const targetName = targetLang === "ar" ? "Arabic" : "English";

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();

  if (!geminiKey && !openaiKey) {
    throw new Error("Translation service is not configured");
  }

  const chunks = splitForTranslation(text);
  const translatedChunks: string[] = [];

  for (const chunk of chunks) {
    const prompt = buildPrompt(chunk, sourceName, targetName);
    let translated: string | null = null;
    const failures: string[] = [];

    if (geminiKey) {
      try {
        translated = await callGemini(prompt, geminiKey);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        failures.push(`gemini: ${message}`);
        console.warn("[translate] Gemini failed, trying OpenAI:", message);
      }
    }

    if (!translated && openaiKey) {
      try {
        translated = await callOpenAI(prompt, openaiKey);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        failures.push(`openai: ${message}`);
        console.warn("[translate] OpenAI failed:", message);
      }
    }

    if (!translated) {
      throw new Error(failures.join(" | ") || "All translation providers failed");
    }

    translatedChunks.push(translated);
    if (chunks.length > 1) await sleep(300);
  }

  return translatedChunks.join("\n\n");
}
