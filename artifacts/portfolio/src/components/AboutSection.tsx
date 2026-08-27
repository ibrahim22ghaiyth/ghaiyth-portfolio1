import { motion } from "framer-motion";
import { GraduationCap, Layers3, ShieldCheck, Users } from "lucide-react";
import { useListSkills } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

const fallbackSkills = [
  { id: "fallback-react", name: "React / TypeScript", nameAr: "React / TypeScript", percentage: 92, category: "Frontend", active: true },
  { id: "fallback-node", name: "Node.js / Express", nameAr: "Node.js / Express", percentage: 88, category: "Backend", active: true },
  { id: "fallback-db", name: "PostgreSQL / Drizzle", nameAr: "PostgreSQL / Drizzle", percentage: 82, category: "Database", active: true },
  { id: "fallback-ui", name: "Tailwind CSS / UI Systems", nameAr: "Tailwind CSS / أنظمة الواجهات", percentage: 90, category: "Frontend", active: true },
  { id: "fallback-admin", name: "Admin Dashboards", nameAr: "لوحات التحكم الإدارية", percentage: 86, category: "Systems", active: true },
  { id: "fallback-leadership", name: "Team Leadership / Planning", nameAr: "قيادة الفرق والتخطيط", percentage: 84, category: "Management", active: true },
];

export function AboutSection() {
  const { data: skills, isLoading } = useListSkills();
  const { t, lang } = useLanguage();

  const databaseSkills = skills?.filter((skill) => skill.active) || [];
  const activeSkills = databaseSkills.length > 0 ? databaseSkills : fallbackSkills;
  const translatedPillars = [
    { icon: GraduationCap, label: t.about.pillar1Title, text: t.about.pillar1Text },
    { icon: Layers3, label: t.about.pillar2Title, text: t.about.pillar2Text },
    { icon: ShieldCheck, label: t.about.pillar3Title, text: t.about.pillar3Text },
    { icon: Users, label: t.about.pillar4Title, text: t.about.pillar4Text },
  ];

  return (
    <section id="about" className="brand-section py-24 relative overflow-hidden">
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_70%_35%,var(--brand-cyan-glow),transparent_48%)] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_0.9fr] gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">// {t.about.eyebrow}</p>
            <h2 className="brand-heading text-3xl md:text-5xl font-extrabold mb-4 inline-block">
              {t.about.title}
            </h2>
            <div className="space-y-6 brand-copy leading-8 mt-6">
              <p>{t.about.bio1}</p>
              <p>{t.about.bio2}</p>
              <p>{t.about.bio3}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              <div className="p-5 rounded-lg brand-panel">
                <div className="text-3xl font-bold text-primary mb-1">{t.about.yearsExp}</div>
                <div className="text-sm text-muted-foreground font-mono">{t.about.yearsExpLabel}</div>
              </div>
              <div className="p-5 rounded-lg brand-panel">
                <div className="text-3xl font-bold text-primary mb-1">{t.about.projectsCount}</div>
                <div className="text-sm text-muted-foreground font-mono">{t.about.projectsCountLabel}</div>
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {translatedPillars.map((pillar) => (
                <div key={pillar.label} className="rounded-lg border border-[var(--brand-line)] bg-[var(--brand-panel)] p-4">
                  <pillar.icon className="mb-3 text-primary" size={22} />
                  <h3 className="mb-2 font-bold text-[var(--brand-heading)]">{pillar.label}</h3>
                  <p className="text-sm leading-6 text-[var(--brand-muted)]">{pillar.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-lg brand-panel relative"
          >
            <h3 className="text-2xl font-bold mb-8 text-[var(--brand-heading)]">{t.about.proficiency}</h3>

            <div className="space-y-6">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <Skeleton className="h-4 w-24 bg-[var(--brand-panel-2)]" />
                      <Skeleton className="h-4 w-8 bg-[var(--brand-panel-2)]" />
                    </div>
                    <Skeleton className="h-2 w-full bg-[var(--brand-panel-2)] rounded-full" />
                  </div>
                ))
              ) : (
                activeSkills.map((skill, index) => {
                  const displayName = (lang === "ar" && skill.nameAr) ? skill.nameAr : skill.name;
                  return (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-2">
                        <span className="font-mono text-sm text-[var(--brand-text)]">{displayName}</span>
                        <span className="font-mono text-sm text-primary">{skill.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-[var(--brand-line)]">
                        <motion.div
                          className="h-full bg-primary relative"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                        >
                          <div className="absolute inset-0 bg-[var(--brand-cyan-glow)] w-full animate-[shimmer_2s_infinite]" />
                        </motion.div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
