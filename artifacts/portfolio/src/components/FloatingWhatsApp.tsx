import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function FloatingWhatsApp() {
  const { lang } = useLanguage();
  const text = lang === "ar"
    ? "مرحباً إبراهيم، أريد مناقشة مشروع ويب."
    : "Hello Ibrahim, I want to discuss a web project.";
  const href = `https://wa.me/9647805808975?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={lang === "ar" ? "تواصل عبر واتساب" : "Contact on WhatsApp"}
      className="fixed bottom-5 end-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_18px_45px_rgba(37,211,102,0.35)] transition hover:-translate-y-1 focus-visible:outline-white"
    >
      <MessageCircle size={26} />
    </a>
  );
}
