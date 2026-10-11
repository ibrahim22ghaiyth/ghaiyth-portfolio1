import { motion } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  Languages,
  Layers3,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Target,
  Timer,
  Trophy,
  Users,
  User,
  Heart,
} from "lucide-react";
import { useListSkills } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

const fallbackSkills = [
  { id: "fallback-react", name: "React / Next.js", nameAr: "React / Next.js", category: "Frontend", active: true },
  { id: "fallback-ts", name: "TypeScript / JavaScript", nameAr: "TypeScript / JavaScript", category: "Frontend", active: true },
  { id: "fallback-html", name: "HTML5 / CSS3", nameAr: "HTML5 / CSS3", category: "Frontend", active: true },
  { id: "fallback-tailwind", name: "Tailwind CSS / UI Systems", nameAr: "Tailwind CSS / أنظمة الواجهات", category: "Frontend", active: true },
  { id: "fallback-node", name: "Node.js / Express", nameAr: "Node.js / Express", category: "Backend", active: true },
  { id: "fallback-php", name: "PHP / REST APIs", nameAr: "PHP / واجهات REST", category: "Backend", active: true },
  { id: "fallback-postgres", name: "PostgreSQL / Drizzle ORM", nameAr: "PostgreSQL / Drizzle ORM", category: "Database", active: true },
  { id: "fallback-mysql", name: "MySQL / MongoDB", nameAr: "MySQL / MongoDB", category: "Database", active: true },
  { id: "fallback-git", name: "Git / GitHub", nameAr: "Git / GitHub", category: "Tools", active: true },
  { id: "fallback-linux", name: "Linux / Nginx", nameAr: "Linux / Nginx", category: "Tools", active: true },
  { id: "fallback-deploy", name: "Netlify / Railway / CI/CD", nameAr: "Netlify / Railway / CI/CD", category: "Tools", active: true },
  { id: "fallback-security", name: "Security / CSP / CSRF / RBAC", nameAr: "الحماية / CSP / CSRF / RBAC", category: "Tools", active: true },
];

const softSkillIcons = [Trophy, Lightbulb, MessageSquare, Timer, Users, Heart];

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
    { name: t.about.languageArabic, level: t.about.languageArabicLevel, flag: "AR", isNative: true },
    { name: t.about.languageEnglish, level: t.about.languageEnglishLevel, flag: "EN", isNative: false },
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
      <div className="container mx-auto px-4 sm:px-6">

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

        {/* Experience + Education */}
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

            <div className="brand-panel card-lift relative rounded-xl p-7 sm:p-8">
              <div className="absolute top-6 end-6">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {t.about.experienceFreelancePeriod}
                </span>
              </div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/15 bg-[var(--brand-tag-bg)] text-primary">
                <Briefcase size={22} strokeWidth={1.8} />
              </div>
              <h4 className="brand-heading mb-2 text-lg font-bold">{t.about.experienceFreelanceRole}</h4>
              <p className="brand-copy text-sm leading-7">{t.about.experienceFreelanceDesc}</p>
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

            <div className="space-y-4">
              {education.map((item) => (
                <div key={item.name} className="brand-panel card-lift rounded-xl p-6 sm:p-7">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-[var(--brand-tag-bg)] text-primary">
                      <item.icon size={20} strokeWidth={1.8} />
                    </div>
                    {item.current ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-bold text-sky-500">
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
                </div>
              ))}
            </div>
          </motion.div>
        </div>

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
              {languages.map((lang) => (
                <div key={lang.name} className="brand-panel card-lift rounded-xl p-6 text-center">
                  <div className="mb-4 text-4xl font-bold text-[var(--brand-panel-2)] select-none">
                    {lang.flag}
                  </div>
                  <h4 className="brand-heading mb-1 text-lg font-bold">{lang.name}</h4>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                    lang.isNative
                      ? "border border-primary/30 bg-[var(--brand-tag-bg)] text-primary"
                      : "border border-[var(--brand-line)] bg-[var(--brand-panel-2)] text-[var(--brand-text-2)]"
                  }`}>
                    {lang.level}
                  </span>
                </div>
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
              {softSkills.map((skill) => (
                <div key={skill.title} className="brand-panel card-lift rounded-xl p-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-primary/15 bg-[var(--brand-tag-bg)] text-primary">
                    <skill.icon size={17} strokeWidth={1.8} />
                  </div>
                  <h4 className="brand-heading mb-1 text-sm font-bold">{skill.title}</h4>
                  <p className="brand-muted text-xs leading-5">{skill.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Technical Skills */}
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
              {Object.entries(skillGroups).map(([category, items]) => (
                <div key={category}>
                  <h4 className="brand-eyebrow mb-3">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => {
                      const displayName = (lang === "ar" && skill.nameAr) ? skill.nameAr : skill.name;
                      return (
                        <span
                          key={skill.id}
                          className="rounded-lg border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-3 py-1.5 text-[13px] text-[var(--brand-text)] transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          {displayName}
                        </span>
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
