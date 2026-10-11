import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useActiveSection } from "@/hooks/use-active-section";
import { Menu, X, Languages, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeMode } from "@/contexts/ThemeContext";
import { BrandLogo } from "@/components/BrandLogo";

export function Navigation() {
  const { t, lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useThemeMode();
  const [location, setLocation] = useLocation();

  const localizedPath = (path: string, nextLang = lang) => {
    if (nextLang === "en") return path === "/" ? "/en" : `/en${path}`;
    return path;
  };

  const currentRouteKey = location.replace(/^\/en/, "") || "/";

  const NAV_LINKS = [
    { id: "home", label: t.nav.home, type: "section" as const },
    { id: "services", label: t.nav.services, type: "section" as const },
    { id: "projects", label: t.nav.projects, type: "section" as const },
    { id: "products", label: t.nav.products, type: "route" as const, href: "/products" },
    { id: "blog", label: t.nav.blog, type: "route" as const, href: "/blog" },
    { id: "about", label: t.nav.about, type: "section" as const },
    { id: "contact", label: t.nav.contact, type: "section" as const },
  ];

  const sectionLinks = NAV_LINKS.filter((link) => link.type === "section");
  const activeSection = useActiveSection(sectionLinks.map((link) => link.id));
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isOnHome = currentRouteKey === "/";
  const overHero = isOnHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    const homePath = localizedPath("/");
    if (currentRouteKey !== "/") {
      setLocation(homePath);
      window.setTimeout(scroll, 80);
      return;
    }
    scroll();
  };

  const goToRoute = (href: string) => {
    setMobileMenuOpen(false);
    setLocation(localizedPath(href));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLang = () => {
    const nextLang = lang === "en" ? "ar" : "en";
    setLang(nextLang);
    const route = currentRouteKey === "/" ? "/" : currentRouteKey;
    setLocation(localizedPath(route, nextLang));
  };

  const languageHref = localizedPath(currentRouteKey === "/" ? "/" : currentRouteKey, lang === "en" ? "ar" : "en");

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-all duration-300",
          overHero
            ? "border-white/8 bg-transparent"
            : "border-[var(--brand-line-soft)] bg-background/85",
        )}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <button
            onClick={() => scrollToSection("home")}
            aria-label={t.nav.home}
            className={cn(
              "grid h-10 w-14 shrink-0 place-items-center overflow-hidden rounded-md border transition-colors",
              overHero
                ? "border-white/12 bg-white/8"
                : "border-[var(--brand-line)] bg-[var(--brand-logo-bg)]",
            )}
          >
            <BrandLogo className="h-9 w-12" eager variant={overHero ? "dark" : undefined} />
          </button>

          <div className="hidden xl:flex flex-1 items-center justify-center gap-0.5 px-2">
            {NAV_LINKS.map((link) => {
              const active =
                link.type === "route"
                  ? currentRouteKey === link.href
                  : currentRouteKey === "/" && activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => (link.type === "route" ? goToRoute(link.href) : scrollToSection(link.id))}
                  aria-current={active ? "page" : undefined}
                  data-active={active || undefined}
                  className={cn(
                    "nav-link relative whitespace-nowrap px-3 py-2 text-sm transition-colors duration-200",
                    overHero
                      ? active
                        ? "font-medium text-white after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:bg-[#6BA3FF]"
                        : "text-white/55 hover:text-white"
                      : active
                        ? "font-medium text-[var(--brand-heading)] after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:bg-primary"
                        : "text-muted-foreground hover:text-[var(--brand-heading)]",
                  )}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={cn(
                "nav-icon-btn flex h-9 w-9 items-center justify-center rounded-md border transition-colors",
                overHero
                  ? "border-white/12 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                  : "border-[var(--brand-line)] bg-[var(--brand-panel)] text-foreground hover:border-primary hover:text-primary",
              )}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <a
              href={languageHref}
              onClick={(event) => {
                event.preventDefault();
                toggleLang();
              }}
              title={lang === "en" ? "Switch to Arabic" : "Switch to English"}
              aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
              className={cn(
                "nav-icon-btn flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                overHero
                  ? "border-white/12 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                  : "border-[var(--brand-line)] bg-[var(--brand-panel)] text-foreground hover:border-primary hover:text-primary",
              )}
            >
              <Languages size={14} />
              {lang === "en" ? "العربية" : "English"}
            </a>
          </div>

          <button
            className={cn(
              "p-1 xl:hidden ms-1 transition-colors",
              overHero ? "text-white" : "text-foreground",
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#05070B] xl:hidden flex flex-col items-center justify-center gap-6">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => link.type === "route" ? goToRoute(link.href) : scrollToSection(link.id)}
              className={cn(
                "text-2xl font-medium tracking-wide transition-all",
                (link.type === "route" ? currentRouteKey === link.href : currentRouteKey === "/" && activeSection === link.id)
                  ? "text-[#6BA3FF]"
                  : "text-white/50 hover:text-white",
              )}
            >
              {link.label}
            </button>
          ))}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-white/12 bg-white/5 text-white/70"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a
              href={languageHref}
              onClick={(event) => {
                event.preventDefault();
                toggleLang();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-md border border-white/12 bg-white/5 px-4 py-2 text-sm font-medium text-white/70"
            >
              <Languages size={16} />
              {lang === "en" ? "العربية" : "English"}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
