const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

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

export async function translateText(
  text: string,
  sourceLang: "ar" | "en",
  targetLang: "ar" | "en",
): Promise<string> {
  if (!text.trim() || sourceLang === targetLang) return text;

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Translation service is not configured");
  }

  const sourceName = sourceLang === "ar" ? "Arabic" : "English";
  const targetName = targetLang === "ar" ? "Arabic" : "English";

  const chunks = splitForTranslation(text);
  const translatedChunks: string[] = [];

  for (const chunk of chunks) {
    const prompt = `You are a professional translator. Translate the following text from ${sourceName} to ${targetName}.
Rules:
- Keep the same tone and style (professional, natural)
- Preserve all Markdown formatting exactly: headings, lists, code fences, bold/italic, links, tables
- Keep code blocks, URLs, and technical identifiers unchanged
- Do NOT add explanations, notes, or quotes around the translation
- Output ONLY the translated text

Text to translate:
${chunk}`;

    translatedChunks.push(await callGemini(prompt, apiKey));
    if (chunks.length > 1) await sleep(300);
  }

  return translatedChunks.join("\n\n");
}
