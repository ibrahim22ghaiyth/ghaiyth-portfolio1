import { useQuery } from "@tanstack/react-query";
import { Quote, Star } from "lucide-react";
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

const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    clientName: "Academic Accountant Team",
    clientNameAr: "فريق المحاسب الأكاديمي",
    company: "Academic Accountant",
    companyAr: "المحاسب الأكاديمي",
    projectName: "Accounting and training platform",
    projectNameAr: "منصة محاسبة وتدريب مالي",
    feedback: "Ibrahim delivered a professional bilingual platform with clean pages, a practical admin panel, and the security details we needed before launch.",
    feedbackAr: "إبراهيم أنجز منصة احترافية ثنائية اللغة بصفحات مرتبة ولوحة إدارة عملية وتفاصيل حماية كنا نحتاجها قبل الإطلاق.",
    rating: 5,
    order: 1,
    active: true,
  },
  {
    id: 2,
    clientName: "Qassitha Product Team",
    clientNameAr: "فريق قسّطها",
    company: "Qassitha",
    companyAr: "قسّطها",
    projectName: "Installment tracking interface",
    projectNameAr: "واجهة متابعة الأقساط",
    feedback: "The workflow became clearer and easier to present, with an interface focused on the real daily problem instead of unnecessary complexity.",
    feedbackAr: "صار مسار العمل أوضح وأسهل بالعرض، والواجهة ركزت على المشكلة اليومية الحقيقية بدون تعقيد زائد.",
    rating: 5,
    order: 2,
    active: true,
  },
  {
    id: 3,
    clientName: "Architect Planning Client",
    clientNameAr: "عميل منصة مِعمار",
    company: "Architect",
    companyAr: "مِعمار",
    projectName: "Project planning assistant",
    projectNameAr: "مساعد تخطيط المشاريع",
    feedback: "The product helped turn loose project ideas into a structured plan with clear steps, bilingual content, and a polished user experience.",
    feedbackAr: "المنتج ساعد بتحويل أفكار المشاريع غير المرتبة إلى خطة واضحة بخطوات منظمة ومحتوى ثنائي اللغة وتجربة استخدام مصقولة.",
    rating: 5,
    order: 3,
    active: true,
  },
];

export function TestimonialsSection() {
  const { lang } = useLanguage();
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

  const testimonials = (data && data.length > 0 ? data : fallbackTestimonials)
    .filter((item) => item.active)
    .sort((a, b) => a.order - b.order || a.id - b.id);

  return (
    <section id="testimonials" className="brand-section border-t border-[var(--brand-line-soft)] py-20" dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto px-6">
        <div className={`mb-10 max-w-3xl ${isAr ? "text-right" : "text-left"}`}>
          <h2 className="text-3xl font-black text-[var(--brand-heading)] md:text-5xl">
            {isAr ? "آراء العملاء" : "Client Feedback"}
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => {
            const clientName = isAr ? testimonial.clientNameAr || testimonial.clientName : testimonial.clientName;
            const company = isAr ? testimonial.companyAr || testimonial.company : testimonial.company;
            const projectName = isAr ? testimonial.projectNameAr || testimonial.projectName : testimonial.projectName;
            const feedback = isAr ? testimonial.feedbackAr || testimonial.feedback : testimonial.feedback;

            return (
              <article key={testimonial.id} className="rounded-lg border border-[var(--brand-line-soft)] bg-[var(--brand-panel)] p-6 shadow-[var(--brand-shadow-soft)]">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <Quote className="text-primary" size={24} />
                  <div className="flex gap-1 text-primary">
                    {Array.from({ length: Math.max(1, Math.min(5, testimonial.rating)) }).map((_, index) => (
                      <Star key={index} size={14} className="fill-current" />
                    ))}
                  </div>
                </div>
                <p className="min-h-32 text-sm leading-7 text-[var(--brand-text-2)]">
                  {feedback}
                </p>
                <div className="mt-6 border-t border-[var(--brand-line-soft)] pt-4">
                  <p className="font-bold text-[var(--brand-heading)]">{clientName}</p>
                  <p className="text-xs text-[var(--brand-muted)]">
                    {company}{projectName ? ` - ${projectName}` : ""}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
