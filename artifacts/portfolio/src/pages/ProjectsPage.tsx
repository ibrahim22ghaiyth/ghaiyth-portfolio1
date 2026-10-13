import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, Github, FolderGit2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useListProjects } from "@workspace/api-client-react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";

const statusStyles = {
  live: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  prototype: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  development: "border-sky-500/30 bg-sky-500/10 text-sky-400",
} as const;

export function ProjectsPage() {
  const { t, lang } = useLanguage();
  const { data: projects } = useListProjects();
  const [openId, setOpenId] = useState("");
  const isArabic = lang === "ar";

  const activeProjects = (projects || []).filter((p) => p.active);

  const labels = {
    heading: t.projects.title,
    eyebrow: isArabic ? "جميع المشاريع" : "All projects",
    problem: isArabic ? "المشكلة" : "The problem",
    solution: isArabic ? "الحل الذي بنيته" : "The solution I built",
    stack: isArabic ? "التقنيات" : "The stack",
    outcome: isArabic ? "الحالة والنتيجة" : "Status and outcome",
    details: t.projects.openDetails,
    builtFor: isArabic ? "مصمم لـ" : "Built for",
    myRole: isArabic ? "دورتي" : "My role",
    backHome: isArabic ? "العودة للرئيسية" : "Back to home",
    statusLabel: {
      live: t.projects.statusLive,
      prototype: t.projects.statusPrototype,
      development: t.projects.statusDevelopment,
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <section className="stage-dark relative overflow-hidden pb-16 pt-32 sm:pt-36" dir={isArabic ? "rtl" : "ltr"}>
          <div className="hero-mesh absolute inset-0 pointer-events-none" />
          <div className="hero-grid absolute inset-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="brand-eyebrow mb-4 inline-flex items-center gap-2" style={{ color: "#3B82F6" }}>
                <FolderGit2 size={14} />
                {labels.eyebrow}
              </div>
              <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">{labels.heading}</h1>
              <div className="accent-bar mb-5" />
              <p className="max-w-2xl text-base leading-8 text-white/40">{t.projects.subtitle}</p>
              <div className="mt-8">
                <Link href={isArabic ? "/" : "/en"} className="btn-ghost-dark inline-flex items-center justify-center gap-2.5 rounded-lg px-7 py-4 text-sm font-semibold">
                  {labels.backHome}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-section py-24 sm:py-28">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
              {activeProjects.map((project, index) => {
                const title = isArabic && project.titleAr ? project.titleAr : project.title;
                const summary = isArabic && project.descriptionAr ? project.descriptionAr : project.description;
                const imageAlt = isArabic && project.imageAltAr ? project.imageAltAr : (project.imageAltEn || project.title);
                const status = (project.status || "live") as keyof typeof statusStyles;
                const isOpen = openId === String(project.id);

                const audience = isArabic ? project.audienceAr : project.audienceEn;
                const role = isArabic ? project.roleAr : project.roleEn;
                const problem = isArabic ? project.problemAr : project.problemEn;
                const solution = isArabic ? project.solutionAr : project.solutionEn;
                const stackDesc = isArabic ? project.stackDescAr : project.stackDescEn;
                const outcome = isArabic ? project.outcomeAr : project.outcomeEn;

                return (
                  <motion.article
                    key={project.id}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="gradient-border card-sweep group flex flex-col overflow-hidden rounded-xl"
                    dir={isArabic ? "rtl" : "ltr"}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={imageAlt}
                          loading="lazy"
                          decoding="async"
                          className="img-zoom h-full w-full object-cover object-top"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[var(--brand-panel-2)] to-[var(--brand-panel)]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      <div className="absolute top-4 start-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-md ${statusStyles[status] || statusStyles.live}`}>
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                          </span>
                          {labels.statusLabel[status] || labels.statusLabel.live}
                        </span>
                      </div>

                      <div className="absolute bottom-4 end-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-md opacity-0 translate-y-2 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
                        <ExternalLink size={15} className="text-white" />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <h3 className="brand-heading mb-3 text-xl font-bold leading-snug transition-colors duration-300 group-hover:text-[var(--brand-blue)] sm:text-2xl">
                        {title}
                      </h3>

                      <p className="brand-copy mb-5 text-sm leading-7">{summary}</p>

                      <div className="mb-6 flex flex-wrap gap-1.5">
                        {(project.techStack || []).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-2.5 py-1 font-mono text-[11px] text-[var(--brand-text-2)] transition-colors duration-300 group-hover:border-[var(--brand-blue)]/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto space-y-2.5">
                        {project.liveUrl || project.githubUrl ? (
                          <div className="flex gap-2.5">
                            {project.liveUrl ? (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="brand-button btn-glow inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold"
                              >
                                {t.projects.liveDemo} <ExternalLink size={15} />
                              </a>
                            ) : null}
                            {project.githubUrl ? (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${title} GitHub`}
                                className="btn-outline icon-magnetic inline-flex min-h-11 w-12 items-center justify-center rounded-lg"
                              >
                                <Github size={17} />
                              </a>
                            ) : null}
                          </div>
                        ) : null}

                        {audience || role || problem || solution || stackDesc || outcome ? (
                          <button
                            type="button"
                            onClick={() => setOpenId(isOpen ? "" : String(project.id))}
                            aria-expanded={isOpen}
                            className="btn-outline inline-flex min-h-11 w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold"
                          >
                            {labels.details}
                            <ChevronDown size={16} className={isOpen ? "rotate-180 transition-transform duration-300" : "transition-transform duration-300"} />
                          </button>
                        ) : null}
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
                                audience ? [labels.builtFor, audience] : null,
                                role ? [labels.myRole, role] : null,
                                problem ? [labels.problem, problem] : null,
                                solution ? [labels.solution, solution] : null,
                                stackDesc ? [labels.stack, stackDesc] : null,
                                outcome ? [labels.outcome, outcome] : null,
                              ].filter(Boolean).map(([label, body]) => (
                                <section key={label as string}>
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
        <Footer />
      </main>
    </div>
  );
}