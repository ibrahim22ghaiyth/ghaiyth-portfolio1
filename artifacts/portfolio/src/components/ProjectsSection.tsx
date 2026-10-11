import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, Github } from "lucide-react";
import { useState } from "react";
import { caseStudies } from "@/data/caseStudies";
import { useLanguage } from "@/contexts/LanguageContext";

const statusStyles = {
  live: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  prototype: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  development: "border-sky-500/30 bg-sky-500/10 text-sky-400",
} as const;

export function ProjectsSection() {
  const { t, lang } = useLanguage();
  const [openId, setOpenId] = useState("");
  const isArabic = lang === "ar";

  const labels = {
    heading: t.projects.title,
    eyebrow: isArabic ? "مختارات من العمل" : "Selected work",
    problem: isArabic ? "المشكلة" : "The problem",
    solution: isArabic ? "الحل الذي بنيته" : "The solution I built",
    stack: isArabic ? "التقنيات" : "The stack",
    outcome: isArabic ? "الحالة والنتيجة" : "Status and outcome",
    details: t.projects.openDetails,
    status: t.projects.status,
    builtFor: isArabic ? "مصمم لـ" : "Built for",
    myRole: isArabic ? "دورتي" : "My role",
    statusLabel: {
      live: t.projects.statusLive,
      prototype: t.projects.statusPrototype,
      development: t.projects.statusDevelopment,
    },
  };

  return (
    <section id="projects" className="brand-section relative overflow-hidden py-24 sm:py-28 md:py-32">
      {/* Background decoration */}
      <div className="absolute top-1/3 left-0 h-52 w-52 rounded-full bg-[var(--brand-blue)]/[0.02] blur-[70px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-[var(--brand-blue)]/[0.03] blur-[60px] pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 max-w-3xl"
        >
          <p className="brand-eyebrow mb-4">{labels.eyebrow}</p>
          <h2 className="brand-heading mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {labels.heading}
          </h2>
          <div className="accent-bar mb-5" />
          <p className="brand-copy max-w-xl text-base leading-8">{t.projects.subtitle}</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          {caseStudies.map((project, index) => {
            const content = isArabic ? project.ar : project.en;
            const imageAlt = isArabic ? project.image.alt.ar : project.image.alt.en;
            const isOpen = openId === project.id;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="gradient-border card-sweep group flex flex-col overflow-hidden rounded-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image.src}
                    alt={imageAlt}
                    width={project.image.width}
                    height={project.image.height}
                    loading="lazy"
                    decoding="async"
                    className="img-zoom h-full w-full object-cover object-top"
                  />
                  {/* Multi-layer gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Status badge */}
                  <div className="absolute top-4 start-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-md ${statusStyles[project.status]}`}>
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                      </span>
                      {labels.statusLabel[project.status]}
                    </span>
                  </div>

                  {/* Hover reveal arrow */}
                  <div className="absolute bottom-4 end-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-md opacity-0 translate-y-2 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
                    <ExternalLink size={15} className="text-white" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="brand-heading mb-3 text-xl font-bold leading-snug transition-colors duration-300 group-hover:text-[var(--brand-blue)] sm:text-2xl">
                    {content.name}
                  </h3>

                  <p className="brand-copy mb-5 text-sm leading-7">{content.summary}</p>

                  <div className="mb-6 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-2.5 py-1 font-mono text-[11px] text-[var(--brand-text-2)] transition-colors duration-300 group-hover:border-[var(--brand-blue)]/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto space-y-2.5">
                    {project.links?.live || project.links?.github ? (
                      <div className="flex gap-2.5">
                        {project.links?.live ? (
                          <a
                            href={project.links.live}
                            target="_blank"
                            rel="noreferrer"
                            className="brand-button btn-glow inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold"
                          >
                            {t.projects.liveDemo} <ExternalLink size={15} />
                          </a>
                        ) : null}
                        {project.links?.github ? (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${content.name} GitHub`}
                            className="btn-outline icon-magnetic inline-flex min-h-11 w-12 items-center justify-center rounded-lg"
                          >
                            <Github size={17} />
                          </a>
                        ) : null}
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? "" : project.id)}
                      aria-expanded={isOpen}
                      className="btn-outline inline-flex min-h-11 w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold"
                    >
                      {labels.details}
                      <ChevronDown size={16} className={isOpen ? "rotate-180 transition-transform duration-300" : "transition-transform duration-300"} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 grid gap-4 rounded-lg border border-[var(--brand-line-soft)] bg-[var(--brand-panel-2)] p-5 text-sm leading-7 text-[var(--brand-text-2)]">
                          {[
                            [labels.builtFor, content.audience],
                            [labels.myRole, content.role],
                            [labels.problem, content.problem],
                            [labels.solution, content.solution],
                            [labels.stack, content.stack],
                            [labels.outcome, content.outcome],
                          ].map(([label, body]) => (
                            <section key={label}>
                              <h4 className="brand-eyebrow mb-1.5">{label}</h4>
                              <p className="brand-copy">{body}</p>
                            </section>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
