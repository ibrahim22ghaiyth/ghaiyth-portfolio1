import { useQuery } from "@tanstack/react-query";
import { Quote, ShieldCheck, FolderOpen, Code2, Github } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

type Testimonial = {
  id: number;
  clientName: string;
  clientNameAr?: string | null;
  company: string;
  companyAr?: string | null;
  feedback: string;
  feedbackAr?: string | null;
  projectName?: string | null;
  projectNameAr?: string | null;
  rating: number;
  order: number;
  active: boolean;
};

export function TestimonialsSection() {
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";
  const { data } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const response = await fetch("/api/testimonials", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load testimonials");
      return response.json() as Promise<Testimonial[]>;
    },
    retry: 1,
  });

  const testimonials = (data || [])
    .filter((item) => item.active)
    .sort((a, b) => a.order - b.order || a.id - b.id);

  if (testimonials.length === 0) {
    const points = [
      { icon: FolderOpen, title: t.proof.point1Title, text: t.proof.point1Text },
      { icon: Code2, title: t.proof.point2Title, text: t.proof.point2Text },
      { icon: ShieldCheck, title: t.proof.point3Title, text: t.proof.point3Text },
    ];

    return (
      <section id="testimonials" className="brand-section relative py-24 sm:py-28" dir={isAr ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-14 max-w-3xl">
            <p className="brand-eyebrow mb-4">{t.proof.eyebrow}</p>
            <h2 className="brand-heading mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              {t.proof.title}
            </h2>
            <div className="accent-bar mb-5" />
            <p className="brand-copy max-w-2xl text-base leading-8">{t.proof.subtitle}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
            {points.map((point, index) => (
              <motion.article
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                className="brand-panel card-lift rounded-xl p-7 sm:p-8"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/15 bg-[var(--brand-tag-bg)] text-primary">
                  <point.icon size={22} strokeWidth={1.8} />
                </div>
                <h3 className="brand-heading mb-3 text-lg font-bold">{point.title}</h3>
                <p className="brand-copy text-sm leading-7">{point.text}</p>
              </motion.article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="brand-button inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-lg px-7 py-3.5 text-sm font-semibold"
            >
              {t.proof.cta} <FolderOpen size={17} />
            </button>
            <a
              href="https://github.com/ibrahim22ghaiyth"
              target="_blank"
              rel="noreferrer"
              className="btn-outline inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-lg px-7 py-3.5 text-sm font-semibold"
            >
              GitHub <Github size={17} />
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="brand-section relative py-24 sm:py-28" dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-14 max-w-3xl">
          <p className="brand-eyebrow mb-4">{isAr ? "آراء العملاء" : "Client Feedback"}</p>
          <h2 className="brand-heading mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {isAr ? "ماذا قال عملائي" : "What clients say"}
          </h2>
          <div className="accent-bar" />
        </div>

        <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {testimonials.map((testimonial, index) => {
            const clientName = isAr ? testimonial.clientNameAr || testimonial.clientName : testimonial.clientName;
            const company = isAr ? testimonial.companyAr || testimonial.company : testimonial.company;
            const projectName = isAr ? testimonial.projectNameAr || testimonial.projectName : testimonial.projectName;
            const feedback = isAr ? testimonial.feedbackAr || testimonial.feedback : testimonial.feedback;

            return (
              <motion.article
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                className="brand-panel card-lift rounded-xl p-7 sm:p-8"
              >
                <Quote className="mb-5 text-primary" size={24} strokeWidth={1.8} />
                <p className="min-h-32 text-sm leading-7 brand-copy">{feedback}</p>
                <div className="mt-6 border-t border-[var(--brand-line-soft)] pt-5">
                  <p className="brand-heading font-bold">{clientName}</p>
                  <p className="text-xs brand-muted">
                    {company}{projectName ? ` — ${projectName}` : ""}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
