import { motion } from "framer-motion";
import { ArrowRight, Download, MessageCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiTypescript,
} from "react-icons/si";
import { BrandLogo } from "@/components/BrandLogo";

export function HeroSection() {
  const { t, lang } = useLanguage();

  const techStack = [
    { icon: SiHtml5, name: "HTML" },
    { icon: SiCss, name: "CSS" },
    { icon: SiJavascript, name: "JavaScript" },
    { icon: SiTypescript, name: "TypeScript" },
    { icon: SiReact, name: "React" },
    { icon: SiNextdotjs, name: "Next.js" },
    { icon: SiNodedotjs, name: "Node.js" },
    { icon: SiPostgresql, name: "PostgreSQL" },
    { icon: SiMongodb, name: "MongoDB" },
  ];

  const heroName = t.hero.name;
  const heroTitle = t.hero.title;
  const heroDescription = t.hero.description;
  const availability = t.hero.availability;

  const [firstName, ...lastNameParts] = heroName.split(" ");
  const lastName = lastNameParts.join(" ");
  const initials = (firstName?.[0] || "") + (lastName?.[0] || "");
  return (
    <section id="home" className="brand-section hero-surface min-h-[100svh] pt-24 pb-10 sm:pt-28 md:pt-28 md:pb-16 flex items-center relative overflow-hidden border-b border-[var(--brand-line-soft)]">
      <div className="absolute inset-0 hero-ambient pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="container mx-auto grid gap-7 px-4 sm:px-6 md:grid-cols-2 md:gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-5 text-center md:items-start md:gap-6 md:text-start"
        >
          <div className="inline-flex max-w-full items-center gap-2 rounded-md border border-primary/30 bg-[var(--brand-tag-bg)] px-3 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rotate-45 bg-primary shadow-[0_0_16px_var(--brand-cyan-glow)]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-primary sm:text-xs sm:tracking-[0.18em]">{availability}</span>
          </div>

          <div className="space-y-4">
            <h1 className="brand-heading max-w-3xl text-3xl font-extrabold leading-[1.12] tracking-normal min-[390px]:text-4xl sm:text-5xl md:text-7xl">
              {firstName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-cyan-bright)]">{lastName}</span>
            </h1>
            <h2 className="text-base font-semibold text-[var(--brand-text)] sm:text-lg md:text-2xl">
              {heroTitle}
            </h2>
          </div>

          <p className="brand-copy max-w-xl text-sm leading-6 sm:text-base sm:leading-7 md:text-lg md:leading-8">
            {heroDescription}
          </p>

          <div className="grid w-full grid-cols-1 gap-2.5 pt-1 min-[430px]:grid-cols-3 md:w-auto md:gap-3 md:pt-2">
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="brand-button inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-bold shadow-[0_0_28px_var(--brand-blue-glow)] transition"
            >
              {t.hero.hireMe} <ArrowRight size={18} />
            </button>
            <a
              href="https://wa.me/9647805808975"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-primary/35 bg-[var(--brand-tag-bg)] px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              {t.hero.whatsapp} <MessageCircle size={18} />
            </a>
            <a
              href="/ibrahim-ghaiyth-cv.html"
              download="Ibrahim-Ghaiyth-CV.html"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-5 py-3 text-sm font-bold text-[var(--brand-heading)] transition hover:border-primary/50 hover:bg-[var(--brand-tag-bg)]"
            >
              {t.hero.downloadCv} <Download size={18} />
            </a>
          </div>

          <div className="grid w-full gap-3 pt-2 sm:grid-cols-3 md:pt-4">
            {[t.hero.benefit1, t.hero.benefit2, t.hero.benefit3].map((item) => (
              <div key={item} className="brand-panel rounded-md px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-text)]">
                  <Sparkles size={15} className="text-primary" />
                  {item}
                </div>
              </div>
            ))}
          </div>

          <div className="hidden pt-8 w-full sm:block">
            <p className="text-xs font-mono text-muted-foreground mb-4 uppercase tracking-wider">// {t.hero.techArsenal}</p>
            <div className="flex flex-wrap gap-3">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel)] hover:bg-[var(--brand-panel-2)] hover:border-primary/50 transition-all group"
                >
                  <tech.icon className="text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-xs text-muted-foreground group-hover:text-[var(--brand-heading)] transition-colors">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto w-full max-w-[292px] aspect-[4/5] min-[390px]:max-w-[318px] sm:max-w-[380px] md:max-w-[430px]"
        >
          <div className="absolute inset-8 rounded-full bg-[var(--brand-blue-glow)] blur-3xl" />
          <div className="relative h-full w-full overflow-hidden rounded-2xl brand-panel">
            <div className="absolute inset-0 hero-portrait-surface" />
            <div className="absolute left-3 top-3 z-20 rounded-xl border border-[var(--brand-line)] bg-[var(--brand-logo-bg)]/85 p-2 shadow-[0_14px_36px_var(--brand-blue-glow)] sm:left-5 sm:top-5">
              <BrandLogo className="h-14 w-14 min-[390px]:h-16 min-[390px]:w-16 sm:h-24 sm:w-24" eager />
            </div>

            <motion.div
              className="absolute right-4 top-5 z-20 rounded-md border border-primary/35 bg-background/80 px-2.5 py-1.5 font-mono text-[10px] font-bold text-primary sm:right-5 sm:top-6 sm:px-3 sm:text-xs"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            >
              {initials}.
            </motion.div>
            <motion.div
              className="absolute right-4 top-16 z-20 rounded-md border border-[var(--brand-line)] bg-background/75 px-2.5 py-2 font-mono text-[9px] text-[var(--brand-muted)] sm:right-5 sm:top-20 sm:px-3 sm:text-[10px]"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div>const profile = {"{"}</div>
              <div className="ps-3 text-primary">role: "developer"</div>
              <div>{"}"}</div>
            </motion.div>

            <div className="absolute bottom-9 left-1/2 z-20 h-44 w-44 -translate-x-1/2 min-[390px]:h-52 min-[390px]:w-52 sm:bottom-12 sm:h-64 sm:w-64">
              <motion.div
                className="absolute -inset-3 rounded-full border border-dashed border-primary/35"
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-3 rounded-full border border-primary/25 shadow-[0_0_48px_var(--brand-cyan-glow)]" />
              <div className="relative h-full w-full overflow-hidden rounded-full border border-primary/35 bg-[var(--brand-logo-bg)] p-1.5 shadow-[0_22px_60px_var(--brand-blue-glow)]">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-[var(--brand-logo-bg)] ring-1 ring-[var(--brand-line)]">
                  <img
                    src="/profile-cutout.png"
                    alt="Ibrahim Ghaiyth"
                    className="h-full w-full object-cover object-[50%_18%] brightness-105 contrast-110 saturate-95"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(to_bottom,var(--brand-cyan-glow),transparent_38%)] opacity-50" />
                </div>
              </div>
              <motion.div
                className="absolute -left-4 top-12 rounded-md border border-[var(--brand-line)] bg-background/85 px-2 py-1 font-mono text-[8px] text-primary sm:-left-10 sm:top-14 sm:text-[10px]"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                &lt;code /&gt;
              </motion.div>
              <motion.div
                className="absolute -right-4 bottom-10 rounded-md border border-[var(--brand-line)] bg-background/85 px-2 py-1 font-mono text-[8px] text-[var(--brand-muted)] sm:-right-9 sm:bottom-12 sm:text-[10px]"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              >
                deploy()
              </motion.div>
            </div>

            <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary sm:text-xs sm:tracking-[0.22em]">
              &lt;developer /&gt;
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
