import { AlertCircle, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const homePath = location.startsWith("/en") ? "/en" : "/";

  return (
    <div className="stage-dark relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4">
      <div className="hero-mesh absolute inset-0 pointer-events-none" />
      <div className="hero-grid absolute inset-0 pointer-events-none" />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-white/10 bg-white/4 p-8 backdrop-blur-sm sm:p-10">
        <div className="mb-5 flex items-center gap-4">
          <span className="grid h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400">
            <AlertCircle size={22} strokeWidth={1.8} />
          </span>
          <h1 className="text-2xl font-bold text-white">{t.notFound.title}</h1>
        </div>

        <p className="mb-8 text-sm leading-7 text-white/40">{t.notFound.description}</p>

        <Link
          href={homePath}
          className="brand-button inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-lg px-7 py-3.5 text-sm font-semibold"
        >
          {t.nav.home} <ArrowRight size={16} className="rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
