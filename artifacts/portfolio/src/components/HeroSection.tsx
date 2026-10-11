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

const floatingShapes = [
  { size: 180, x: "8%", y: "15%", delay: 0, type: "orb-blue" },
  { size: 120, x: "75%", y: "10%", delay: 2, type: "orb-cyan" },
  { size: 200, x: "60%", y: "70%", delay: 4, type: "orb-purple" },
  { size: 100, x: "15%", y: "75%", delay: 1, type: "orb-blue" },
];

const particles = [
  { x: "12%", y: "20%", delay: 0, duration: 3 },
  { x: "25%", y: "60%", delay: 0.5, duration: 4 },
  { x: "40%", y: "30%", delay: 1, duration: 3.5 },
  { x: "55%", y: "80%", delay: 1.5, duration: 4.5 },
  { x: "70%", y: "25%", delay: 2, duration: 3 },
  { x: "85%", y: "55%", delay: 0.8, duration: 4 },
  { x: "30%", y: "85%", delay: 2.5, duration: 3.5 },
  { x: "65%", y: "45%", delay: 1.2, duration: 4.2 },
  { x: "90%", y: "15%", delay: 0.3, duration: 3.8 },
  { x: "5%", y: "50%", delay: 1.8, duration: 4.1 },
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
      className="stage-dark noise relative min-h-[100svh] overflow-hidden pt-24 pb-16 sm:pt-28 md:pt-32 md:pb-24"
    >
      {/* Base mesh + grid */}
      <div className="hero-mesh absolute inset-0 pointer-events-none" />
      <div className="hero-grid absolute inset-0 pointer-events-none" />

      {/* Floating orbs */}
      {floatingShapes.map((shape, i) => (
        <div
          key={i}
          className={`orb ${shape.type} animate-drift`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            animationDelay: `${shape.delay}s`,
            animationDuration: `${12 + i * 2}s`,
          }}
        />
      ))}

      {/* Particle dots */}
      {particles.map((p, i) => (
        <div
          key={`p-${i}`}
          className="particle animate-pulse-glow"
          style={{
            left: p.x,
            top: p.y,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Geometric shapes */}
      <div className="absolute top-[20%] left-[5%] hidden h-16 w-16 rotate-45 rounded-lg border border-[#3B82F6]/10 animate-float-slow lg:block" />
      <div className="absolute top-[60%] right-[8%] hidden h-10 w-10 rounded-full border border-[#3B82F6]/8 animate-float-delay-2 lg:block" />
      <div className="absolute top-[35%] right-[15%] hidden h-8 w-8 rotate-12 rounded-sm bg-[#3B82F6]/5 animate-float-delay-1 lg:block" />
      <div className="absolute bottom-[20%] left-[12%] hidden h-6 w-6 rounded-full bg-[#3B82F6]/8 animate-float-delay-3 lg:block" />

      <div className="container relative z-10 mx-auto flex min-h-[calc(100svh-8rem)] items-center px-4 sm:px-6">
        <div className="grid w-full items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-6 text-center md:items-start md:text-start"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-medium tracking-wide text-white/60">{t.hero.availability}</span>
            </motion.div>

            <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-white min-[390px]:text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem]">
              {firstName}{" "}
              <span className="text-gradient-animated">{lastName}</span>
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
                className="brand-button btn-glow inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-lg px-7 py-3.5 text-sm font-semibold"
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
              {[t.hero.benefit1, t.hero.benefit2, t.hero.benefit3].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2 text-[13px] text-white/45"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]/15">
                    <Check size={10} className="text-[#3B82F6]" />
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>

            <div className="w-full max-w-lg pt-4 md:max-w-none">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/25">
                {t.hero.techArsenal}
              </p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                    className="glass flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-white/40 transition-all duration-300 hover:border-[#3B82F6]/40 hover:text-[#3B82F6] hover:shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                  >
                    <tech.icon className="h-3.5 w-3.5" />
                    <span className="font-mono text-[11px]">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Code card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto hidden w-full max-w-[340px] md:block lg:max-w-[400px]"
          >
            {/* Orbit rings behind card */}
            <div className="orbit-ring hidden lg:block" />
            <div className="orbit-ring-2 hidden lg:block" />

            {/* Floating tech badges around card */}
            <motion.div
              className="glass absolute -top-4 -left-6 z-20 hidden items-center gap-1.5 rounded-lg px-3 py-2 lg:flex animate-float"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <SiReact className="h-4 w-4 text-[#61DAFB]" />
              <span className="font-mono text-[11px] text-white/50">React</span>
            </motion.div>
            <motion.div
              className="glass absolute -right-6 top-1/4 z-20 hidden items-center gap-1.5 rounded-lg px-3 py-2 lg:flex animate-float-delay-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <SiTypescript className="h-4 w-4 text-[#3178C6]" />
              <span className="font-mono text-[11px] text-white/50">TS</span>
            </motion.div>
            <motion.div
              className="glass absolute -bottom-4 -left-4 z-20 hidden items-center gap-1.5 rounded-lg px-3 py-2 lg:flex animate-float-delay-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              <SiNextdotjs className="h-4 w-4 text-white" />
              <span className="font-mono text-[11px] text-white/50">Next</span>
            </motion.div>
            <motion.div
              className="glass absolute -right-4 bottom-1/3 z-20 hidden items-center gap-1.5 rounded-lg px-3 py-2 lg:flex animate-float-delay-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
            >
              <SiNodedotjs className="h-4 w-4 text-[#5FA04E]" />
              <span className="font-mono text-[11px] text-white/50">Node</span>
            </motion.div>

            <div className="glass-strong relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 via-transparent to-[#3B82F6]/5" />

              {/* Window chrome */}
              <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-white/8 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  </div>
                  <span className="ms-3 font-mono text-xs font-medium text-white/30">ibrahimig.com</span>
                </div>
                <span className="font-mono text-xs text-[#3B82F6]">{"{"}</span>
              </div>

              {/* Portrait */}
              <div className="absolute inset-0 flex items-center justify-center pt-8 pb-16">
                <div className="glow-ring neon-glow relative h-48 w-48 overflow-hidden rounded-full border border-white/15 lg:h-56 lg:w-56">
                  <img
                    src="/profile-cutout.png"
                    alt="Ibrahim Ghaiyth"
                    className="h-full w-full scale-110 object-cover object-[50%_22%] translate-x-[6%]"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
                </div>
              </div>

              {/* Code footer */}
              <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/8 px-5 py-4">
                <p className="font-mono text-[11px] text-white/25">
                  <span className="text-[#3B82F6]">const</span> profile = {"{"}
                </p>
                <p className="ps-4 font-mono text-[11px] text-white/35">
                  role: <span className="text-[#3B82F6]">"Full-Stack Developer"</span>
                  <span className="typing-cursor" />
                </p>
                <p className="font-mono text-[11px] text-white/25">{"}"}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0D14] to-transparent pointer-events-none" />
    </section>
  );
}
