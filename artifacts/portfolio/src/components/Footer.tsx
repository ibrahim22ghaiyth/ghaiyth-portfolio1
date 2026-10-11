import { ArrowUp, Github, Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import { BrandLogo } from "@/components/BrandLogo";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t, lang } = useLanguage();
  const [, setLocation] = useLocation();
  const links = [
    ["home", t.nav.home],
    ["services", t.nav.services],
    ["projects", t.nav.projects],
    ["about", t.nav.about],
    ["contact", t.nav.contact],
  ] as const;

  const scrollTo = (id: string) => {
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    if (!["/", "/en"].includes(window.location.pathname)) {
      setLocation(lang === "en" ? "/en" : "/");
      window.setTimeout(scroll, 80);
      return;
    }
    scroll();
  };

  const goTo = (path: string) => {
    setLocation(lang === "en" ? `/en${path}` : path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="stage-dark relative overflow-hidden">
      <div className="hero-mesh absolute inset-0 pointer-events-none opacity-60" />
      <div className="hero-grid absolute inset-0 pointer-events-none opacity-40" />

      <div className="container relative z-10 mx-auto grid gap-10 px-4 py-16 sm:px-6 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.9fr] lg:items-start">
        <div>
          <div className="mb-5 flex h-24 w-28 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <BrandLogo className="h-20 w-20 sm:h-24 sm:w-24" eager />
          </div>
          <p className="max-w-xs text-sm leading-6 text-white/35">{t.footer.summary}</p>
        </div>

        <div>
          <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/25">{t.footer.navigation}</h2>
          <nav className="grid gap-3.5">
            {links.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="w-fit text-sm text-white/45 transition-colors hover:text-white">
                {label}
              </button>
            ))}
            <button onClick={() => goTo("/products")} className="w-fit text-sm text-white/45 transition-colors hover:text-white">
              {t.nav.products}
            </button>
            <button onClick={() => goTo("/blog")} className="w-fit text-sm text-white/45 transition-colors hover:text-white">
              {t.nav.blog}
            </button>
          </nav>
        </div>

        <div>
          <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/25">{t.footer.contact}</h2>
          <div className="grid justify-items-start gap-3.5 text-sm text-white/45 rtl:justify-items-end">
            <a href="mailto:info@ibrahimig.com" className="inline-flex items-center gap-3 transition-colors hover:text-white">
              <span dir="ltr">info@ibrahimig.com</span>
              <Mail size={15} className="shrink-0" />
            </a>
            <a href="https://wa.me/9647805808975" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 transition-colors hover:text-white">
              <span dir="ltr">+964 7805808975</span>
              <MessageCircle size={15} className="shrink-0" />
            </a>
          </div>
          <h3 className="mb-4 mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/25">{t.footer.social}</h3>
          <div className="flex gap-3">
            {[
              { icon: Github, href: "https://github.com/ibrahim22ghaiyth", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/ibrahim-ghaiyth-3144a1350", label: "LinkedIn" },
              { icon: Instagram, href: "https://www.instagram.com/ib.et", label: "Instagram" },
            ].map(({ icon: Icon, href, label }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/4 text-white/40 transition-colors hover:border-white/25 hover:text-white">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-white/25 sm:flex-row sm:px-6">
          <p>&copy; {new Date().getFullYear()} Ibrahim Ghaiyth. {t.footer.rights}</p>
          <button onClick={() => scrollTo("home")} className="inline-flex items-center gap-2 transition-colors hover:text-white/60">
            {t.footer.backToTop} <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
