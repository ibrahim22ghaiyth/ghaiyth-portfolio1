import { motion } from "framer-motion";
import { ArrowRight, Check, Download, MessageCircle } from "lucide-react";
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

export function HeroSection() {
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";

  const heroName = t.hero.name;
  const [firstName, ...lastNameParts] = heroName.split(" ");
  const lastName = lastNameParts.join(" ");

  return (
    <section
      id="home"
      className="stage-dark relative min-h-[100svh] overflow-hidden pt-24 pb-16 sm:pt-28 md:pt-32 md:pb-24"
    >
      <div className="hero-mesh absolute inset-0 pointer-events-none" />
      <div className="hero-grid absolute inset-0 pointer-events-none" />

      <div className="container relative z-10 mx-auto flex min-h-[calc(100svh-8rem)] items-center px-4 sm:px-6">
        <div className="grid w-full items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-6 text-center md:items-start md:text-start"
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-medium tracking-wide text-white/60">{t.hero.availability}</span>
            </div>

            <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-white min-[390px]:text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem]">
              {firstName}{" "}
              <span className="gradient-text">{lastName}</span>
            </h1>

            <p className="max-w-xl text-base font-medium text-white/50 sm:text-lg md:text-xl">
              {t.hero.title}
            </p>

            <p className="max-w-xl text-sm leading-7 text-white/40 sm:text-base sm:leading-8">
              {t.hero.description}
            </p>

            <div className="grid w-full max-w-lg grid-cols-1 gap-3 pt-2 min-[430px]:grid-cols-2 md:w-auto md:max-w-none md:pt-4">
              <button
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="brand-button inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-lg px-7 py-3.5 text-sm font-semibold"
              >
                {t.hero.viewProjects} <ArrowRight size={17} />
              </button>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-ghost-dark inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-lg px-7 py-3.5 text-sm font-semibold"
              >
                {t.hero.hireMe} <ArrowRight size={17} />
              </button>
              <a
                href={`https://wa.me/9647805808975?text=${encodeURIComponent(
                  isAr
                    ? "مرحباً إبراهيم، أريد مناقشة مشروع ويب جديد."
                    : "Hello Ibrahim, I want to discuss a new web project."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost-dark inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-lg px-7 py-3.5 text-sm font-semibold"
              >
                {t.hero.whatsapp} <MessageCircle size={17} />
              </a>
              <a
                href="/ibrahim-ghaiyth-cv.pdf"
                download="Ibrahim-Ghaiyth-CV.pdf"
                className="btn-ghost-dark inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-lg px-7 py-3.5 text-sm font-semibold"
              >
                {t.hero.downloadCv} <Download size={17} />
              </a>
            </div>

            <ul className="grid w-full max-w-lg gap-2.5 pt-2 sm:grid-cols-3 md:max-w-none md:pt-3">
              {[t.hero.benefit1, t.hero.benefit2, t.hero.benefit3].map((item) => (
                <li key={item} className="flex items-center gap-2 text-[13px] text-white/45">
                  <Check size={14} className="shrink-0 text-[#6BA3FF]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="w-full max-w-lg pt-4 md:max-w-none">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/25">
                {t.hero.techArsenal}
              </p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-1.5 rounded-md border border-white/8 bg-white/4 px-2.5 py-1.5 text-white/40 transition-colors hover:border-[#6BA3FF]/40 hover:text-[#6BA3FF]"
                  >
                    <tech.icon className="h-3.5 w-3.5" />
                    <span className="font-mono text-[11px]">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto hidden w-full max-w-[340px] md:block lg:max-w-[400px]"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B5ED7]/10 via-transparent to-[#0B5ED7]/5" />

              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-white/8 bg-white/[0.04] px-5 py-4 backdrop-blur-sm">
                <span className="font-mono text-xs font-medium text-white/30">ibrahimig.com</span>
                <span className="font-mono text-xs text-[#6BA3FF]">{"{"}</span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glow-ring relative h-48 w-48 overflow-hidden rounded-full border border-white/15 lg:h-56 lg:w-56">
                  <img
                    src="/profile-cutout.png"
                    alt="Ibrahim Ghaiyth"
                    className="h-full w-full object-cover object-[50%_18%]"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/8 bg-white/[0.04] px-5 py-4 backdrop-blur-sm">
                <p className="font-mono text-[11px] text-white/25">
                  <span className="text-[#6BA3FF]">const</span> profile = {"{"}
                </p>
                <p className="ps-4 font-mono text-[11px] text-white/35">
                  role: <span className="text-[#6BA3FF]">"Full-Stack Developer"</span>
                </p>
                <p className="font-mono text-[11px] text-white/25">{"}"}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
