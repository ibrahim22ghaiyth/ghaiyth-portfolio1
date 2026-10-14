import { motion } from "framer-motion";
import {
  Award,
  Briefcase,
  ExternalLink,
  GraduationCap,
  Languages,
  Layers3,
  Lightbulb,
  MessageSquare,
  Target,
  Timer,
  Users,
  User,
  Heart,
} from "lucide-react";
import { useListSkills } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

const fallbackSkills = [
  { id: "fallback-react", name: "React / Next.js", nameAr: "React / Next.js", category: "Frontend", active: true, level: 92 },
  { id: "fallback-ts", name: "TypeScript / JavaScript", nameAr: "TypeScript / JavaScript", category: "Frontend", active: true, level: 90 },
  { id: "fallback-html", name: "HTML5 / CSS3", nameAr: "HTML5 / CSS3", category: "Frontend", active: true, level: 95 },
  { id: "fallback-tailwind", name: "Tailwind CSS / UI Systems", nameAr: "Tailwind CSS / أنظمة الواجهات", category: "Frontend", active: true, level: 90 },
  { id: "fallback-node", name: "Node.js / Express", nameAr: "Node.js / Express", category: "Backend", active: true, level: 85 },
  { id: "fallback-php", name: "PHP / REST APIs", nameAr: "PHP / واجهات REST", category: "Backend", active: true, level: 80 },
  { id: "fallback-postgres", name: "PostgreSQL / Drizzle ORM", nameAr: "PostgreSQL / Drizzle ORM", category: "Database", active: true, level: 85 },
  { id: "fallback-mysql", name: "MySQL / MongoDB", nameAr: "MySQL / MongoDB", category: "Database", active: true, level: 82 },
  { id: "fallback-git", name: "Git / GitHub", nameAr: "Git / GitHub", category: "Tools", active: true, level: 88 },
  { id: "fallback-linux", name: "Linux / Nginx", nameAr: "Linux / Nginx", category: "Tools", active: true, level: 78 },
  { id: "fallback-deploy", name: "Netlify / Railway / CI/CD", nameAr: "Netlify / Railway / CI/CD", category: "Tools", active: true, level: 82 },
  { id: "fallback-security", name: "Security / CSP / CSRF / RBAC", nameAr: "الحماية / CSP / CSRF / RBAC", category: "Tools", active: true, level: 75 },
];

const softSkillIcons = [Lightbulb, Target, MessageSquare, Timer, Users, Heart];

export function AboutSection() {
  const { data: skills, isLoading } = useListSkills();
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";

  const databaseSkills = skills?.filter((skill) => skill.active) || [];
  const activeSkills = databaseSkills.length > 0 ? databaseSkills : fallbackSkills;

  const skillGroups = activeSkills.reduce<Record<string, typeof fallbackSkills>>((groups, skill) => {
    const key = skill.category || "General";
    groups[key] = groups[key] || [];
    groups[key].push(skill as (typeof fallbackSkills)[number]);
    return groups;
  }, {});

  const softSkills = [
    { icon: softSkillIcons[0], title: t.about.softSkillLeadership, text: t.about.softSkillLeadershipDesc },
    { icon: softSkillIcons[1], title: t.about.softSkillProblemSolving, text: t.about.softSkillProblemSolvingDesc },
    { icon: softSkillIcons[2], title: t.about.softSkillCommunication, text: t.about.softSkillCommunicationDesc },
    { icon: softSkillIcons[3], title: t.about.softSkillTimeManagement, text: t.about.softSkillTimeManagementDesc },
    { icon: softSkillIcons[4], title: t.about.softSkillTeamwork, text: t.about.softSkillTeamworkDesc },
    { icon: softSkillIcons[5], title: t.about.softSkillSelfLearning, text: t.about.softSkillSelfLearningDesc },
  ];

  const languages = [
    { name: t.about.languageArabic, level: t.about.languageArabicLevel, flag: "AR", isNative: true, percent: 100 },
    { name: t.about.languageEnglish, level: t.about.languageEnglishLevel, flag: "EN", isNative: false, percent: 85 },
  ];

  const education = [
    {
      icon: GraduationCap,
      name: t.about.educationUniName,
      degree: t.about.educationUniDegree,
      period: t.about.educationUniPeriod,
      desc: "",
      current: true,
    },
    {
      icon: User,
      name: t.about.educationPreName,
      degree: t.about.educationPreDegree,
      period: t.about.educationPrePeriod,
      desc: t.about.educationPreDesc,
      current: false,
    },
  ];

  return (
    <section id="about" className="brand-section relative overflow-hidden py-24 sm:py-28 md:py-32">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 h-56 w-56 rounded-full bg-[var(--brand-blue)]/[0.03] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 h-44 w-44 rounded-full bg-[var(--brand-blue)]/[0.02] blur-[70px] pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 max-w-3xl"
        >
          <p className="brand-eyebrow mb-4">{t.about.eyebrow}</p>
          <h2 className="brand-heading mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {t.about.title}
          </h2>
          <div className="accent-bar mb-6" />
          <div className="space-y-5 brand-copy leading-8 text-[15px]">
            <p>{t.about.bio1}</p>
            <p>{t.about.bio2}</p>
            <p>{t.about.bio3}</p>
          </div>
        </motion.div>

        {/* Experience + Education — Timeline style */}
        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          {/* Experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h3 className="brand-heading mb-2 flex items-center gap-3 text-xl font-bold">
              <Briefcase size={20} className="text-primary" strokeWidth={1.8} />
              {t.about.experienceTitle}
            </h3>
            <p className="brand-muted mb-6 text-sm">{t.about.experienceSubtitle}</p>

            {/* Timeline item */}
            <div className="relative ps-8">
              <div className="timeline-line" />
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="gradient-border card-sweep group relative rounded-xl p-7 sm:p-8"
              >
                <div className="timeline-dot absolute -start-8 top-8" />
                <div className="absolute top-6 end-6">
                  <span className="pulse-dot inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {t.about.experienceFreelancePeriod}
                  </span>
                </div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/15 bg-[var(--brand-tag-bg)] text-primary transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(59,130,246,0.12)]">
                  <Briefcase size={22} strokeWidth={1.8} />
                </div>
                <h4 className="brand-heading mb-2 text-lg font-bold">{t.about.experienceFreelanceRole}</h4>
                <p className="brand-copy text-sm leading-7">{t.about.experienceFreelanceDesc}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="brand-heading mb-2 flex items-center gap-3 text-xl font-bold">
              <GraduationCap size={20} className="text-primary" strokeWidth={1.8} />
              {t.about.educationTitle}
            </h3>
            <p className="brand-muted mb-6 text-sm">{t.about.educationSubtitle}</p>

            {/* Timeline items */}
            <div className="relative ps-8">
              <div className="timeline-line" />
              <div className="space-y-6">
                {education.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
                    className="gradient-border card-sweep group relative rounded-xl p-6 sm:p-7"
                  >
                    <div className="timeline-dot absolute -start-8 top-7" />
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-[var(--brand-tag-bg)] text-primary transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.1)]">
                        <item.icon size={20} strokeWidth={1.8} />
                      </div>
                      {item.current ? (
                        <span className="pulse-dot inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-bold text-sky-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                          {item.period}
                        </span>
                      ) : (
                        <span className="brand-muted text-xs font-medium">{item.period}</span>
                      )}
                    </div>
                    <h4 className="brand-heading mb-1 text-base font-bold">{item.name}</h4>
                    <p className="text-sm font-medium text-primary">{item.degree}</p>
                    {item.desc ? (
                      <p className="brand-copy mt-2 text-sm leading-6">{item.desc}</p>
                    ) : null}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <h3 className="brand-heading mb-2 flex items-center gap-3 text-xl font-bold">
            <Award size={20} className="text-primary" strokeWidth={1.8} />
            {t.about.certificationsTitle}
          </h3>
          <p className="brand-muted mb-6 text-sm">{t.about.certificationsSubtitle}</p>

          <a
            href="https://www.freecodecamp.org/certification/ibrahim_ghaiyth/responsive-web-design"
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-border card-sweep group block max-w-2xl rounded-xl p-6 sm:p-7"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-[var(--brand-tag-bg)] text-primary transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.1)]">
                <Award size={20} strokeWidth={1.8} />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {t.about.certFccIssuer}
              </span>
            </div>
            <h4 className="brand-heading mb-1 text-base font-bold">{t.about.certFccName}</h4>
            <p className="brand-copy mt-2 text-sm leading-6">{t.about.certFccDesc}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              {t.about.certFccVerify}
              <ExternalLink size={14} strokeWidth={2} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
            </span>
          </a>
        </motion.div>

        {/* Languages + Soft Skills */}
        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h3 className="brand-heading mb-2 flex items-center gap-3 text-xl font-bold">
              <Languages size={20} className="text-primary" strokeWidth={1.8} />
              {t.about.languagesTitle}
            </h3>
            <p className="brand-muted mb-6 text-sm">{t.about.languagesSubtitle}</p>

            <div className="grid grid-cols-2 gap-4">
              {languages.map((lang, i) => (
                <motion.div
                  key={lang.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                  className="gradient-border card-sweep rounded-xl p-6 text-center"
                >
                  <div className="mb-4 text-5xl font-bold bg-gradient-to-br from-[var(--brand-blue)]/20 to-[var(--brand-blue)]/5 bg-clip-text text-transparent select-none">
                    {lang.flag}
                  </div>
                  <h4 className="brand-heading mb-3 text-lg font-bold">{lang.name}</h4>
                  <div className="skill-bar-track mb-2">
                    <motion.div
                      className="skill-bar-fill"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: lang.percent / 100 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                    lang.isNative
                      ? "border border-primary/30 bg-[var(--brand-tag-bg)] text-primary"
                      : "border border-[var(--brand-line)] bg-[var(--brand-panel-2)] text-[var(--brand-text-2)]"
                  }`}>
                    {lang.level}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Soft Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="brand-heading mb-2 flex items-center gap-3 text-xl font-bold">
              <Target size={20} className="text-primary" strokeWidth={1.8} />
              {t.about.softSkillsTitle}
            </h3>
            <p className="brand-muted mb-6 text-sm">{t.about.softSkillsSubtitle}</p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {softSkills.map((skill, i) => (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.05 + i * 0.05 }}
                  className="gradient-border card-sweep rounded-xl p-5"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-primary/15 bg-[var(--brand-tag-bg)] text-primary transition-all duration-300 hover:shadow-[0_0_12px_rgba(59,130,246,0.1)] hover:scale-105">
                    <skill.icon size={18} strokeWidth={1.8} />
                  </div>
                  <h4 className="brand-heading mb-1 text-sm font-bold">{skill.title}</h4>
                  <p className="brand-muted text-xs leading-5">{skill.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Technical Skills with animated bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h3 className="brand-heading mb-2 flex items-center gap-3 text-xl font-bold">
            <Layers3 size={20} className="text-primary" strokeWidth={1.8} />
            {t.about.proficiency}
          </h3>

          {isLoading ? (
            <div className="mt-6 space-y-7">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="mb-3 h-4 w-24 bg-[var(--brand-panel-2)]" />
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 4 }).map((__, j) => (
                      <Skeleton key={j} className="h-9 w-24 rounded-md bg-[var(--brand-panel-2)]" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(skillGroups).map(([category, items], gi) => (
                <div key={category}>
                  <h4 className="brand-eyebrow mb-4">{category}</h4>
                  <div className="space-y-3">
                    {items.map((skill, si) => {
                      const displayName = (lang === "ar" && skill.nameAr) ? skill.nameAr : skill.name;
                      const level = skill.level || 80;
                      return (
                        <motion.div
                          key={skill.id}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: gi * 0.08 + si * 0.04 }}
                          className="group"
                        >
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-[13px] text-[var(--brand-text)] transition-colors group-hover:text-[var(--brand-blue)]">
                              {displayName}
                            </span>
                            <span className="font-mono text-[10px] text-[var(--brand-muted)] opacity-0 transition-opacity group-hover:opacity-100">
                              {level}%
                            </span>
                          </div>
                          <div className="skill-bar-track">
                            <motion.div
                              className="skill-bar-fill"
                              initial={{ scaleX: 0 }}
                              whileInView={{ scaleX: level / 100 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.2 + gi * 0.08 + si * 0.04, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
