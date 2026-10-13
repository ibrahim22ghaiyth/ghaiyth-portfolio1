import { useState } from "react";

type TranslateResult = {
  translatedText: string;
};

export function useTranslate() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = async (text: string, sourceLang: "ar" | "en", targetLang: "ar" | "en"): Promise<string | null> => {
    if (!text.trim()) return null;

    setIsTranslating(true);
    setError(null);

    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text, sourceLang, targetLang }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: "Translation failed" }));
        throw new Error(err.error || "Translation failed");
      }

      const data = (await response.json()) as TranslateResult;
      return data.translatedText;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Translation failed";
      setError(message);
      return null;
    } finally {
      setIsTranslating(false);
    }
  };

  const translateToAr = (text: string) => translate(text, "en", "ar");
  const translateToEn = (text: string) => translate(text, "ar", "en");

  return { translate, translateToAr, translateToEn, isTranslating, error };
}
