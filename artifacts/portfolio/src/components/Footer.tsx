import { ArrowUp, Github, Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import { BrandLogo } from "@/components/BrandLogo";
import { useLanguage } from "@/contexts/LanguageContext";

const footerParticles = [
  { x: "10%", y: "30%", delay: 0, duration: 4 },
  { x: "30%", y: "60%", delay: 1, duration: 3.5 },
  { x: "50%", y: "20%", delay: 0.5, duration: 4.5 },
  { x: "70%", y: "70%", delay: 1.5, duration: 3 },
  { x: "85%", y: "40%", delay: 2, duration: 4 },
];

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
    <footer className="stage-dark noise relative overflow-hidden">
      <div className="hero-mesh absolute inset-0 pointer-events-none opacity-60" />
      <div className="hero-grid absolute inset-0 pointer-events-none opacity-40" />

      {/* Floating particles */}
      {footerParticles.map((p, i) => (
        <div
          key={i}
          className="particle animate-pulse-glow"
          style={{
            left: p.x,
            top: p.y,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Glow orbs */}
      <div className="orb orb-blue animate-drift absolute -bottom-20 -left-20 h-48 w-48 opacity-40" />
      <div className="orb orb-cyan animate-drift absolute -top-10 -right-10 h-36 w-36 opacity-30" style={{ animationDelay: "3s" }} />

      {/* Top divider glow line */}
      <div className="divider-glow absolute inset-x-0 top-0" />

      <div className="container relative z-10 mx-auto grid gap-10 px-4 py-16 sm:px-6 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.9fr] lg:items-start">
        <div>
          <div className="glass mb-5 flex h-24 w-28 items-center justify-center rounded-xl">
            <BrandLogo className="h-20 w-20 sm:h-24 sm:w-24" eager variant="dark" />
          </div>
          <p className="max-w-xs text-sm leading-6 text-white/35">{t.footer.summary}</p>
          <div className="mt-6 h-px w-16 bg-gradient-to-r from-[#3B82F6]/40 to-transparent" />
        </div>

        <div>
          <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/25">{t.footer.navigation}</h2>
          <nav className="grid gap-3.5">
            {links.map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="group w-fit text-sm text-white/45 transition-all duration-300 hover:text-white"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="h-px w-0 bg-[#3B82F6] transition-all duration-300 group-hover:w-3" />
                  {label}
                </span>
              </button>
            ))}
            <button onClick={() => goTo("/products")} className="group w-fit text-sm text-white/45 transition-all duration-300 hover:text-white">
              <span className="inline-flex items-center gap-2">
                <span className="h-px w-0 bg-[#3B82F6] transition-all duration-300 group-hover:w-3" />
                {t.nav.products}
              </span>
            </button>
            <button onClick={() => goTo("/blog")} className="group w-fit text-sm text-white/45 transition-all duration-300 hover:text-white">
              <span className="inline-flex items-center gap-2">
                <span className="h-px w-0 bg-[#3B82F6] transition-all duration-300 group-hover:w-3" />
                {t.nav.blog}
              </span>
            </button>
          </nav>
        </div>

        <div>
          <h2 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/25">{t.footer.contact}</h2>
          <div className="grid justify-items-start gap-3.5 text-sm text-white/45 rtl:justify-items-end">
            <a href="mailto:info@ibrahimig.com" className="group inline-flex items-center gap-3 transition-colors hover:text-white">
              <span dir="ltr">info@ibrahimig.com</span>
              <Mail size={15} className="shrink-0 text-white/30 transition-colors group-hover:text-[#3B82F6]" />
            </a>
            <a href="https://wa.me/9647805808975" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 transition-colors hover:text-white">
              <span dir="ltr">+964 7805808975</span>
              <MessageCircle size={15} className="shrink-0 text-white/30 transition-colors group-hover:text-[#3B82F6]" />
            </a>
          </div>
          <h3 className="mb-4 mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/25">{t.footer.social}</h3>
          <div className="flex gap-3">
            {[
              { icon: Github, href: "https://github.com/ibrahim22ghaiyth", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/ibrahim-ghaiyth-3144a1350", label: "LinkedIn" },
              { icon: Instagram, href: "https://www.instagram.com/ib.et", label: "Instagram" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="glass icon-magnetic grid h-11 w-11 place-items-center rounded-xl text-white/40 hover:border-white/25 hover:text-white hover:shadow-[0_0_16px_rgba(59,130,246,0.12)]"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-white/25 sm:flex-row sm:px-6">
          <p>&copy; {new Date().getFullYear()} Ibrahim Ghaiyth. {t.footer.rights}</p>
          <button onClick={() => scrollTo("home")} className="group inline-flex items-center gap-2 transition-colors hover:text-white/60">
            {t.footer.backToTop}
            <ArrowUp size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
