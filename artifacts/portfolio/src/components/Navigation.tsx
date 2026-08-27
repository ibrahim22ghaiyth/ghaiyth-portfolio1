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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
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

  const goToRoute = (href: string, id?: string) => {
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
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[96%] max-w-6xl mx-auto rounded-full",
          isScrolled ? "glass shadow-lg" : "bg-transparent",
        )}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="px-3 py-3 sm:px-4 flex items-center justify-between relative">
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection("home")}
              aria-label={t.nav.home}
              className="grid h-12 w-16 place-items-center overflow-hidden rounded-md border border-[var(--brand-line)] bg-[var(--brand-logo-bg)] shadow-[0_8px_28px_var(--brand-blue-glow)]"
            >
              <BrandLogo className="h-11 w-14" eager />
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-1 flex-1 justify-center px-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => link.type === "route" ? goToRoute(link.href, link.id) : scrollToSection(link.id)}
                className={cn(
                  "whitespace-nowrap px-2 py-2 rounded-full text-sm font-medium transition-all duration-300 xl:px-3.5",
                  (link.type === "route" ? currentRouteKey === link.href : currentRouteKey === "/" && activeSection === link.id)
                    ? "bg-[var(--brand-tag-bg)] text-primary shadow-[0_0_10px_var(--brand-cyan-glow)] border border-primary/30"
                    : "text-muted-foreground hover:text-[var(--brand-heading)] hover:bg-[var(--brand-panel-2)] border border-transparent",
                )}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all border",
                "bg-[var(--brand-tag-bg)] border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground",
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
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                "bg-[var(--brand-tag-bg)] border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground",
              )}
            >
              <Languages size={14} />
              {lang === "en" ? "العربية" : "English"}
            </a>
          </div>

          <button
            className="xl:hidden text-foreground p-1 ms-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm xl:hidden flex flex-col items-center justify-center gap-6">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => link.type === "route" ? goToRoute(link.href, link.id) : scrollToSection(link.id)}
              className={cn(
                "text-2xl font-medium tracking-wide transition-all",
                (link.type === "route" ? currentRouteKey === link.href : currentRouteKey === "/" && activeSection === link.id)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </button>
          ))}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-[var(--brand-tag-bg)] border-primary/30 text-primary"
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
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border bg-[var(--brand-tag-bg)] border-primary/30 text-primary"
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
