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
    <section id="projects" className="brand-section relative py-24 sm:py-28 md:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-14 max-w-3xl">
          <p className="brand-eyebrow mb-4">{labels.eyebrow}</p>
          <h2 className="brand-heading mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {labels.heading}
          </h2>
          <div className="accent-bar mb-5" />
          <p className="brand-copy max-w-xl text-base leading-8">{t.projects.subtitle}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          {caseStudies.map((project, index) => {
            const content = isArabic ? project.ar : project.en;
            const imageAlt = isArabic ? project.image.alt.ar : project.image.alt.en;
            const isOpen = openId === project.id;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="brand-panel card-lift group flex flex-col overflow-hidden rounded-xl"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute top-4 start-4">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-sm ${statusStyles[project.status]}`}>
                      {labels.statusLabel[project.status]}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <h3 className="brand-heading mb-3 text-xl font-bold leading-snug sm:text-2xl">
                    {content.name}
                  </h3>

                  <p className="brand-copy mb-5 text-sm leading-7">{content.summary}</p>

                  <div className="mb-6 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-2.5 py-1 font-mono text-[11px] text-[var(--brand-text-2)]"
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
                            className="brand-button inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold"
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
                            className="btn-outline inline-flex min-h-11 w-12 items-center justify-center rounded-lg"
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
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
