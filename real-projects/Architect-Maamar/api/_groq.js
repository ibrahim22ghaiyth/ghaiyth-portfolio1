// Shared helper that calls Groq's OpenAI-compatible chat API and returns a
// response shaped like the Anthropic Messages API: { content: [{ type: "text", text }] }

const DEFAULT_MODEL = "openai/gpt-oss-120b";

// GPT-OSS models on Groq support a separate "reasoning" channel — keeping it
// low keeps replies fast and leaves more of max_tokens for the actual answer.
const REASONING_MODELS = /^openai\/gpt-oss|^qwen\//;

export async function groqChat({ system, messages, max_tokens }) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("Missing GROQ_API_KEY env variable");

  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;
  const body = {
    model,
    max_tokens: max_tokens || 1024,
    messages: [
      ...(system ? [{ role: "system", content: system }] : []),
      ...(messages || []),
    ],
  };
  if (REASONING_MODELS.test(model)) {
    body.reasoning_effort = process.env.GROQ_REASONING_EFFORT || "low";
  }

  let r, data;
  for (let attempt = 0; attempt < 2; attempt++) {
    r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
    });
    if (r.status !== 429 && r.status < 500) break;
    if (attempt === 0) await new Promise((res) => setTimeout(res, 600));
  }

  data = await r.json();
  if (!r.ok) {
    const err = new Error(data?.error?.message || `Groq API error (${r.status})`);
    err.status = r.status;
    throw err;
  }

  const text = data.choices?.[0]?.message?.content || "";
  return { content: [{ type: "text", text }] };
}
