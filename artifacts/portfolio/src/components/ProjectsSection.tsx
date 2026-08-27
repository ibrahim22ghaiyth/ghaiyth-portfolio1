import { motion } from "framer-motion";
import { ChevronDown, ExternalLink, Github } from "lucide-react";
import { useState } from "react";
import { caseStudies } from "@/data/caseStudies";
import { useLanguage } from "@/contexts/LanguageContext";

export function ProjectsSection() {
  const { lang } = useLanguage();
  const [openId, setOpenId] = useState(caseStudies[0]?.id || "");
  const isArabic = lang === "ar";

  const labels = isArabic
    ? {
        heading: "المشاريع",
        problem: "المشكلة",
        solution: "الحل الذي بنيته",
        stack: "التقنيات",
        outcome: "النتيجة",
        details: "تفاصيل المشروع",
      }
    : {
        heading: "Projects",
        problem: "The problem",
        solution: "The solution I built",
        stack: "The stack",
        outcome: "The outcome",
        details: "Project details",
      };

  return (
    <section id="projects" className="brand-section relative border-y border-[var(--brand-line-soft)] py-24">
      <div className="container mx-auto px-6">
        <div className={`mb-10 ${isArabic ? "text-right" : "text-left"}`}>
          <h2 className="brand-heading mb-4 text-3xl font-extrabold md:text-5xl">
            {labels.heading}
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {caseStudies.map((project, index) => {
            const content = isArabic ? project.ar : project.en;
            const imageAlt = isArabic ? project.image.alt.ar : project.image.alt.en;
            const isOpen = openId === project.id;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="brand-panel flex flex-col overflow-hidden rounded-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--brand-line-soft)] bg-[var(--brand-panel-2)]">
                  <img
                    src={project.image.src}
                    alt={imageAlt}
                    width={project.image.width}
                    height={project.image.height}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition duration-700 hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold leading-snug text-[var(--brand-heading)]">
                      {content.name}
                    </h3>
                    <div className="flex shrink-0 gap-3">
                      {project.links?.github ? (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${content.name} GitHub`}
                          className="text-muted-foreground transition hover:text-primary"
                        >
                          <Github size={20} />
                        </a>
                      ) : null}
                      {project.links?.live ? (
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={content.name}
                          className="text-muted-foreground transition hover:text-[var(--brand-heading)]"
                        >
                          <ExternalLink size={20} />
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <p className="mb-6 flex-1 text-sm leading-7 text-[var(--brand-text-2)]">
                    {content.summary}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-[var(--brand-line)] bg-[var(--brand-tag-bg)] px-2.5 py-1 text-[11px] font-mono text-[var(--brand-text)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? "" : project.id)}
                    aria-expanded={isOpen}
                    className="inline-flex min-h-11 items-center justify-between rounded-md border border-primary/35 bg-[var(--brand-tag-bg)] px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    {labels.details}
                    <ChevronDown size={17} className={isOpen ? "rotate-180 transition" : "transition"} />
                  </button>

                  {isOpen ? (
                    <div className="mt-5 grid gap-4 rounded-md border border-[var(--brand-line-soft)] bg-[var(--brand-panel-2)] p-4 text-sm leading-7 text-[var(--brand-text-2)]">
                      {[
                        [labels.problem, content.problem],
                        [labels.solution, content.solution],
                        [labels.stack, content.stack],
                        [labels.outcome, content.outcome],
                      ].map(([label, body]) => (
                        <section key={label}>
                          <h4 className="mb-1 font-bold text-[var(--brand-heading)]">{label}</h4>
                          <p>{body}</p>
                        </section>
                      ))}
                    </div>
                  ) : null}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
