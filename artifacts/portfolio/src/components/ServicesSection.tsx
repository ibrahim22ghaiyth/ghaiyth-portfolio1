import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useListServices } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

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
    <section id="services" className="brand-section py-24 relative">
      <div className="container mx-auto px-6">

        <div className="mb-16">
          <h2 className="brand-heading text-3xl md:text-5xl font-bold mb-4 inline-block">
            {t.services.title}
            <div className="h-1 w-1/3 bg-primary mt-2 rounded-full" />
          </h2>
          <p className="text-muted-foreground font-mono">{t.services.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-8 rounded-2xl brand-panel h-64">
                <Skeleton className="w-14 h-14 rounded-xl mb-6 bg-[var(--brand-panel-2)]" />
                <Skeleton className="h-6 w-1/2 mb-3 bg-[var(--brand-panel-2)]" />
                <Skeleton className="h-4 w-full mb-2 bg-[var(--brand-panel-2)]" />
                <Skeleton className="h-4 w-4/5 bg-[var(--brand-panel-2)]" />
              </div>
            ))
          ) : (
            displayServices.map((service, index) => {
              const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Code2;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group p-8 rounded-2xl brand-panel hover:border-primary/50 transition-all hover:glow-md relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Icon size={120} />
                  </div>

                  <div className="w-14 h-14 rounded-xl bg-[var(--brand-tag-bg)] flex items-center justify-center mb-6 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon size={28} />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-[var(--brand-heading)]">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed relative z-10">
                    {service.description}
                  </p>
                </motion.div>
              );
            })
          )}
        </div>

      </div>
    </section>
  );
}
