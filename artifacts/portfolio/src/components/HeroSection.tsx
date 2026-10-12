import { motion } from "framer-motion";
import { ArrowRight, Braces, Download, MessageCircle, Play, ShieldCheck, Terminal } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  SiDocker,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

const stack = [
  { icon: SiReact, name: "React" },
  { icon: SiNextdotjs, name: "Next" },
  { icon: SiTypescript, name: "TypeScript" },
  { icon: SiNodedotjs, name: "Node" },
  { icon: SiPostgresql, name: "Postgres" },
  { icon: SiTailwindcss, name: "Tailwind" },
  { icon: SiJavascript, name: "JS" },
  { icon: SiDocker, name: "Docker" },
];

const consoleLines = [
  { prompt: "$", command: "pnpm create product --stack=full", result: "scaffolded secure web app" },
  { prompt: ">", command: "connect(database, api, dashboard)", result: "latency checked, auth enabled" },
  { prompt: "✓", command: "deploy --client-ready", result: "live preview shipped" },
];

const metrics = [
  { label: "UI", value: "98", suffix: "%" },
  { label: "API", value: "24", suffix: "ms" },
  { label: "DX", value: "A", suffix: "+" },
];

export function HeroSection() {
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";
  const heroName = t.hero.name;

  return (
    <section id="home" className="dev-hero relative min-h-[100svh] overflow-hidden pt-24 pb-12 sm:pt-28 md:pt-32">
      <div className="dev-grid absolute inset-0 pointer-events-none" />
      <div className="dev-scan absolute inset-0 pointer-events-none" />
      <div className="dev-wire dev-wire-a" />
      <div className="dev-wire dev-wire-b" />

      <div className="container relative z-10 mx-auto flex min-h-[calc(100svh-8rem)] items-center px-4 sm:px-6">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="mb-7 inline-flex items-center gap-3 rounded-sm border border-emerald-400/30 bg-emerald-400/8 px-3 py-2 font-mono text-[11px] text-emerald-300 shadow-[0_0_24px_rgba(52,211,153,0.08)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
              {t.hero.availability}
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-[1.25] tracking-normal text-[var(--brand-heading)] sm:text-5xl md:text-6xl lg:text-[4.5rem] lg:leading-[1.2]">
              <span className="block pb-1">{isAr ? "نبني تجارب رقمية" : "We build digital"}</span>
              <span className="dev-title block pb-1">{isAr ? "تُحوّل الزيارات" : "experiences that"}</span>
              <span className="block">{isAr ? "إلى نتائج" : "convert visitors"}</span>
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="rounded-sm border border-[var(--brand-line)] bg-[var(--brand-panel)] px-3 py-1.5 font-mono text-xs text-[var(--brand-text-2)]">
                {heroName}
              </span>
              <span className="rounded-sm border border-[var(--brand-blue)]/25 bg-[var(--brand-blue)]/8 px-3 py-1.5 font-mono text-xs text-[var(--brand-blue)]">
                {t.hero.title}
              </span>
            </div>

            <p className="mt-7 max-w-2xl text-base leading-9 text-[var(--brand-text-2)] sm:text-lg">
              {t.hero.description}
            </p>

            <div className="mt-9 grid max-w-xl grid-cols-1 gap-3.5 min-[460px]:grid-cols-2">
              <a
                href={`https://wa.me/9647805808975?text=${encodeURIComponent(
                  isAr
                    ? "مرحباً إبراهيم، أريد أطلب موقع أو نظام ويب. ممكن تفاصيل؟"
                    : "Hello Ibrahim, I want to order a website or web system. Can I get details?",
                )}`}
                target="_blank"
                rel="noreferrer"
                className="brand-button btn-glow inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-sm px-6 py-3 text-sm font-bold"
              >
                <MessageCircle size={17} /> {t.hero.whatsapp}
              </a>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-ghost-dark inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-sm px-6 py-3 text-sm font-bold"
              >
                {t.hero.hireMe} <ArrowRight size={17} />
              </button>
              <button
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-ghost-dark inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-sm px-6 py-3 text-sm font-bold"
              >
                <Play size={17} /> {t.hero.viewProjects}
              </button>
              <a
                href="/ibrahim-ghaiyth-cv.pdf"
                download="Ibrahim-Ghaiyth-CV.pdf"
                className="btn-ghost-dark inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-sm px-6 py-3 text-sm font-bold"
              >
                <Download size={17} /> {t.hero.downloadCv}
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-2.5">
              {[t.hero.benefit1, t.hero.benefit2, t.hero.benefit3].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-sm border border-[var(--brand-line)] bg-[var(--brand-panel)] px-3 py-2 text-xs text-[var(--brand-text-2)]">
                  <ShieldCheck size={14} className="text-emerald-300" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="mb-4 grid gap-4 sm:grid-cols-[0.75fr_1fr]">
              <div className="profile-panel relative flex min-h-[18rem] items-center justify-center overflow-hidden rounded-sm border border-[var(--brand-line)] bg-gradient-to-br from-[var(--brand-panel-2)] to-[var(--brand-panel)]">
                {/* Decorative orbit rings */}
                <div className="absolute h-48 w-48 rounded-full border border-dashed border-[var(--brand-blue)]/15 animate-spin-slow" />
                <div className="absolute h-60 w-60 rounded-full border border-dashed border-[var(--brand-accent)]/10 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "40s" }} />

                {/* Circular portrait with gradient ring */}
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[var(--brand-blue)] via-[var(--brand-accent)] to-[var(--brand-blue)] opacity-60 blur-[2px]" />
                  <div className="relative h-36 w-36 overflow-hidden rounded-full border-2 border-[var(--brand-panel)] sm:h-40 sm:w-40">
                    <img
                      src="/profile-cutout.png"
                      alt="Ibrahim Ghaiyth"
                      className="h-full w-full scale-110 object-cover object-[50%_22%] translate-x-[6%]"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </div>
                  {/* Online dot */}
                  <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-[var(--brand-panel)] bg-emerald-400" />
                </div>

                {/* Name badge */}
                <div className="absolute inset-x-4 bottom-4 rounded-sm border border-[var(--brand-line)] bg-[var(--brand-panel)]/80 px-3 py-2 backdrop-blur-md">
                  <p className="font-mono text-[11px] text-[var(--brand-blue)]">Full-stack Developer</p>
                  <p className="text-xs text-[var(--brand-text-2)]">Ibrahim Ghaiyth</p>
                </div>
              </div>

              <div className="grid content-stretch gap-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-sm border border-[var(--brand-line)] bg-[var(--brand-panel)] p-4">
                    <p className="font-mono text-[11px] text-[var(--brand-muted)]">{metric.label}</p>
                    <p className="mt-2 font-mono text-3xl font-black text-[var(--brand-heading)]">
                      {metric.value}<span className="text-base text-[var(--brand-blue)]">{metric.suffix}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="dev-console relative overflow-hidden rounded-sm border border-[var(--brand-line)] bg-[var(--brand-panel)] shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />
                  <span className="ms-3 font-mono text-xs text-[var(--brand-muted)]">ig://workspace/portfolio</span>
                </div>
                <Terminal size={16} className="text-cyan-200/80" />
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                {consoleLines.map((line, index) => (
                  <motion.div
                    key={line.command}
                    initial={{ opacity: 0, x: isAr ? 16 : -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.14, duration: 0.42 }}
                    className="font-mono"
                  >
                    <p className="text-sm text-[var(--brand-text)]">
                      <span className="me-2 text-cyan-300">{line.prompt}</span>
                      <span>{line.command}</span>
                    </p>
                    <p className="mt-1 ps-5 text-xs text-emerald-300/70">{line.result}</p>
                  </motion.div>
                ))}

                <div className="relative overflow-hidden rounded-sm border border-cyan-300/15 bg-cyan-300/[0.035] p-4">
                  <div className="mb-3 flex items-center justify-between font-mono text-[11px] text-[var(--brand-muted)]">
                    <span>runtime.pipeline</span>
                    <span>online</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      initial={{ width: "12%" }}
                      animate={{ width: "92%" }}
                      transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase text-[var(--brand-muted)]">
                    <Braces size={13} /> {t.hero.techArsenal}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {stack.map((tech, index) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.75 + index * 0.04, duration: 0.32 }}
                        className="group grid min-h-16 place-items-center rounded-sm border border-[var(--brand-line)] bg-[var(--brand-panel-2)] text-[var(--brand-text-2)] transition hover:border-cyan-300/35 hover:bg-cyan-300/8 hover:text-cyan-500"
                        title={tech.name}
                      >
                        <tech.icon className="h-6 w-6" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--brand-bg)] to-transparent" />
    </section>
  );
}
