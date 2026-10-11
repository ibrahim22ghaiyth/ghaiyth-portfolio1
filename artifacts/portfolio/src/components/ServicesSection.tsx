import { motion } from "framer-motion";
import { Code2, Database, LayoutDashboard, MonitorSmartphone, Rocket, type LucideIcon } from "lucide-react";
import { useListServices } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

const serviceIcons: Record<string, LucideIcon> = {
  MonitorSmartphone,
  LayoutDashboard,
  Database,
  Rocket,
};

export function ServicesSection() {
  const { data: services, isLoading } = useListServices();
  const { t, lang } = useLanguage();

  const activeServices = services?.filter(s => s.active) || [];
  const displayServices = activeServices.length > 0
    ? activeServices.map(service => ({
        id: service.id,
        icon: service.icon,
        title: (lang === "ar" && service.titleAr) ? service.titleAr : service.title,
        description: (lang === "ar" && service.descriptionAr) ? service.descriptionAr : service.description,
      }))
    : t.services.items.map((service, index) => ({
        id: `fallback-${index}`,
        icon: service.icon,
        title: service.title,
        description: service.description,
      }));

  return (
    <section id="services" className="brand-section relative overflow-hidden py-24 sm:py-28 md:py-32">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[var(--brand-blue)]/[0.03] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[var(--brand-blue)]/[0.02] blur-[60px] pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 max-w-3xl"
        >
          <p className="brand-eyebrow mb-4">
            {lang === "ar" ? "الخدمات" : "Services"}
          </p>
          <h2 className="brand-heading mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {t.services.title}
          </h2>
          <div className="accent-bar mb-5" />
          <p className="brand-copy max-w-xl text-base leading-8">{t.services.subtitle}</p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-8 rounded-xl brand-panel h-64">
                <Skeleton className="w-12 h-12 rounded-lg mb-6 bg-[var(--brand-panel-2)]" />
                <Skeleton className="h-6 w-1/2 mb-4 bg-[var(--brand-panel-2)]" />
                <Skeleton className="h-4 w-full mb-2 bg-[var(--brand-panel-2)]" />
                <Skeleton className="h-4 w-4/5 bg-[var(--brand-panel-2)]" />
              </div>
            ))
          ) : (
            displayServices.map((service, index) => {
              const Icon = serviceIcons[service.icon] || Code2;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="gradient-border card-sweep group relative overflow-hidden rounded-xl p-7 sm:p-8"
                >
                  {/* Animated background glow on hover */}
                  <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[var(--brand-blue)]/5 opacity-0 blur-[40px] transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="absolute top-6 end-6 font-mono text-6xl font-bold leading-none text-[var(--brand-panel-2)] select-none transition-all duration-500 group-hover:text-[var(--brand-blue)]/10 group-hover:scale-110">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="relative">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/15 bg-[var(--brand-tag-bg)] text-primary transition-all duration-400 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_rgba(11,94,215,0.12)] group-hover:scale-105">
                      <Icon size={24} strokeWidth={1.8} />
                    </div>

                    <h3 className="brand-heading mb-3 text-xl font-bold transition-colors duration-300 group-hover:text-[var(--brand-blue)]">
                      {service.title}
                    </h3>
                    <p className="brand-copy text-sm leading-7">{service.description}</p>

                    {/* Bottom accent line that grows on hover */}
                    <div className="mt-6 h-px w-0 bg-gradient-to-r from-[var(--brand-blue)] to-transparent transition-all duration-500 group-hover:w-full" />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
