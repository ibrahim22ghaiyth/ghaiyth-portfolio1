import { createContext, useContext, useEffect, useState } from "react";
import { en } from "@/locales/en";
import { ar } from "@/locales/ar";
import type { Translations } from "@/locales/en";

export type Lang = "en" | "ar";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  setLang: () => {},
  t: en,
  isRtl: false,
});

function langFromPath(): Lang | null {
  if (typeof window === "undefined") return null;
  const segment = window.location.pathname.split("/").filter(Boolean)[0];
  return segment === "en" ? "en" : null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const pathLang = langFromPath();
    if (pathLang) return pathLang;
    return "ar";
  });

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("site_lang", newLang);
  };

  useEffect(() => {
    const pathLang = langFromPath();
    if (pathLang && pathLang !== lang) {
      setLangState(pathLang);
      localStorage.setItem("site_lang", pathLang);
      return;
    }

    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = lang === "ar" ? ar : en;
  const isRtl = lang === "ar";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
