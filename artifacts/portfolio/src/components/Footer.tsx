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
    <footer className="relative overflow-hidden border-t border-[var(--brand-line)] bg-[var(--brand-panel)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_45%,var(--brand-blue-glow),transparent_35%)]" />
      <div className="container relative mx-auto grid gap-7 px-6 py-8 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.7fr_0.9fr] lg:items-start">
        <div>
          <div className="footer-logo-stage mb-3 flex h-24 w-28 items-center justify-center rounded-xl">
            <BrandLogo className="h-20 w-20 sm:h-24 sm:w-24" eager />
          </div>
          <p className="max-w-xs text-xs leading-5 text-[var(--brand-text-2)]">{t.footer.summary}</p>
        </div>

        <div>
          <h2 className="mb-5 font-bold text-[var(--brand-heading)]">{t.footer.navigation}</h2>
          <nav className="grid gap-3">
            {links.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="w-fit text-sm text-[var(--brand-muted)] transition hover:text-primary">
                {label}
              </button>
            ))}
            <button onClick={() => goTo("/products")} className="w-fit text-sm text-[var(--brand-muted)] transition hover:text-primary">
              {t.nav.products}
            </button>
            <button onClick={() => goTo("/blog")} className="w-fit text-sm text-[var(--brand-muted)] transition hover:text-primary">
              {t.nav.blog}
            </button>
          </nav>
        </div>

        <div>
          <h2 className="mb-5 font-bold text-[var(--brand-heading)]">{t.footer.contact}</h2>
          <div className="grid justify-items-start gap-4 text-sm text-[var(--brand-text-2)] rtl:justify-items-end">
            <a href="mailto:info@ibrahimig.com" className="inline-flex items-center gap-3 hover:text-primary">
              <span dir="ltr">info@ibrahimig.com</span>
              <Mail size={17} className="shrink-0" />
            </a>
            <a href="https://wa.me/9647805808975" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 hover:text-primary">
              <span dir="ltr">+964 7805808975</span>
              <MessageCircle size={17} className="shrink-0" />
            </a>
          </div>
          <h3 className="mb-4 mt-6 text-sm font-bold text-[var(--brand-heading)]">{t.footer.social}</h3>
          <div className="flex gap-3">
            {[
              { icon: Github, href: "https://github.com/ibrahim22ghaiyth", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/ibrahim-ghaiyth-3144a1350", label: "LinkedIn" },
              { icon: Instagram, href: "https://www.instagram.com/ib.et", label: "Instagram" },
            ].map(({ icon: Icon, href, label }) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-md border border-[var(--brand-line)] text-[var(--brand-muted)] transition hover:border-primary hover:bg-[var(--brand-tag-bg)] hover:text-primary">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--brand-line-soft)]">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 py-4 text-center text-xs text-[var(--brand-muted)] sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Ibrahim Ghaiyth. {t.footer.rights}</p>
          <button onClick={() => scrollTo("home")} className="inline-flex items-center gap-2 transition hover:text-primary">
            {t.footer.backToTop} <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
