import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Check, X, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const beforeItems = [
  { label: "زمن التحميل", value: "4.8 ثانية" },
  { label: "معدل الهروب", value: "87%" },
  { label: "الأزرار", value: "غير واضحة" },
  { label: "الجوال", value: "معطوب" },
  { label: "الطلبات", value: "0" },
];

const afterItems = [
  { label: "زمن التحميل", value: "0.9 ثانية" },
  { label: "معدل الهروب", value: "12%" },
  { label: "الأزرار", value: "واضحة ومقنعة" },
  { label: "الجوال", value: "مثالي" },
  { label: "الطلبات", value: "تتدفق" },
];

export function TransformationDemo() {
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";
  const [view, setView] = useState<"before" | "after">("before");

  return (
    <section id="demo" className="brand-section relative overflow-hidden py-24 sm:py-28 md:py-32">
      <div className="container relative mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-3xl"
        >
          <p className="brand-eyebrow mb-4 flex items-center gap-2">
            <Zap size={14} />
            {isAr ? "تجربة حية" : "Live demo"}
          </p>
          <h2 className="brand-heading mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {isAr ? "من موقع ميت إلى موقع يبيع" : "From dead site to selling machine"}
          </h2>
          <div className="accent-bar mb-5" />
          <p className="brand-copy max-w-xl text-base leading-8">
            {isAr
              ? "اضغط على الزر لتشاهد الفرق. هذا مثال توضيحي على ما يحدث عندما يُعاد بناء موقع بشكل صحيح."
              : "Click the button to see the difference. This is a demo of what happens when a site is rebuilt properly."}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: isAr ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-6 flex gap-3">
              <button
                onClick={() => setView("before")}
                className={`rounded-sm px-5 py-2.5 font-mono text-sm font-bold transition-all duration-300 ${
                  view === "before"
                    ? "bg-red-500/15 text-red-400 border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                    : "border border-[var(--brand-line)] text-[var(--brand-text-2)] hover:border-red-500/30 hover:text-red-400"
                }`}
              >
                {isAr ? "قبل" : "Before"}
              </button>
              <button
                onClick={() => setView("after")}
                className={`rounded-sm px-5 py-2.5 font-mono text-sm font-bold transition-all duration-300 ${
                  view === "after"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    : "border border-[var(--brand-line)] text-[var(--brand-text-2)] hover:border-emerald-500/30 hover:text-emerald-400"
                }`}
              >
                {isAr ? "بعد" : "After"}
              </button>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-[var(--brand-line)] bg-[var(--brand-panel)] shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${view === "before" ? "bg-red-400/80" : "bg-emerald-300/80"}`} />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="ms-3 font-mono text-xs text-[var(--brand-muted)]">
                    {view === "before" ? "old-site.com" : "new-site.com"}
                  </span>
                </div>
                <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold ${
                  view === "before"
                    ? "bg-red-500/15 text-red-400"
                    : "bg-emerald-500/15 text-emerald-400"
                }`}>
                  {view === "before" ? (isAr ? "معطوب" : "BROKEN") : (isAr ? "يعمل" : "LIVE")}
                </span>
              </div>

              <div className="p-6 sm:p-8">
                {view === "before" ? (
                  <motion.div
                    key="before"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                      <p className="text-center text-lg font-bold text-red-400/70">
                        {isAr ? "مرحبا بكم في موقعنا" : "Welcome to our site"}
                      </p>
                      <p className="mt-2 text-center text-xs text-red-400/40">
                        {isAr ? "نحن شركة رائدة في مجال ما..." : "We are a leading company in..."}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 flex-1 rounded bg-white/5" />
                      <div className="h-8 flex-1 rounded bg-white/5" />
                      <div className="h-8 flex-1 rounded bg-white/5" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-white/5" />
                      <div className="h-3 w-4/5 rounded bg-white/5" />
                      <div className="h-3 w-3/5 rounded bg-white/5" />
                    </div>
                    <div className="rounded-lg border border-dashed border-red-500/30 bg-red-500/5 p-3 text-center">
                      <p className="text-xs text-red-400/60">
                        {isAr ? "زر غير واضح..." : "Unclear button..."}
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <X size={16} className="text-red-400" />
                      <span className="text-xs text-red-400/60">
                        {isAr ? "لا CTA، لا طلبات" : "No CTA, no orders"}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="after"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <div className="rounded-lg border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-blue-500/5 p-4">
                      <p className="text-center text-lg font-bold text-emerald-300">
                        {isAr ? "جاهز للانطلاق؟" : "Ready to launch?"}
                      </p>
                      <p className="mt-2 text-center text-xs text-[var(--brand-text-2)]">
                        {isAr ? "احجز الآن واحصل على خصم 20%" : "Book now and get 20% off"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 flex-1 rounded bg-[var(--brand-blue)]/20 border border-[var(--brand-blue)]/30" />
                      <div className="h-8 flex-1 rounded bg-white/5" />
                      <div className="h-8 flex-1 rounded bg-white/5" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-white/8" />
                      <div className="h-3 w-4/5 rounded bg-white/8" />
                      <div className="h-3 w-3/5 rounded bg-white/8" />
                    </div>
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
                      <p className="text-xs font-bold text-emerald-300">
                        {isAr ? "اطلب الآن ←" : "Order now →"}
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <Check size={16} className="text-emerald-400" />
                      <span className="text-xs text-emerald-400/80">
                        {isAr ? "CTA واضح، طلبات تتدفق" : "Clear CTA, orders flowing"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isAr ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-3">
              {(view === "before" ? beforeItems : afterItems).map((item, index) => (
                <motion.div
                  key={`${view}-${item.label}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.35 }}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-all duration-500 ${
                    view === "before"
                      ? "border-red-500/15 bg-red-500/5"
                      : "border-emerald-500/15 bg-emerald-500/5"
                  }`}
                >
                  <span className="text-sm text-[var(--brand-text-2)]">{item.label}</span>
                  <span className={`font-mono text-sm font-bold ${
                    view === "before" ? "text-red-400" : "text-emerald-400"
                  }`}>
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-[var(--brand-line)] bg-[var(--brand-panel)] p-6">
              <p className="mb-4 font-mono text-xs uppercase text-[var(--brand-muted)]">
                {isAr ? "النتيجة" : "The result"}
              </p>
              <motion.p
                key={`result-${view}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`text-lg font-bold leading-relaxed ${
                  view === "before" ? "text-red-400/80" : "text-emerald-300"
                }`}
              >
                {view === "before"
                  ? isAr
                    ? "زائر واحد فقط من 8 سيتواصل معك. الباقي يرحل إلى المنافس."
                    : "Only 1 in 8 visitors will contact you. The rest leave to competitors."
                  : isAr
                    ? "الموقع يبيع حتى وأنت نائم. كل زائر يرى سبباً واضحاً للتواصل معك."
                    : "The site sells even while you sleep. Every visitor sees a clear reason to contact you."}
              </motion.p>
              <div className="mt-5 flex items-center gap-3">
                <a
                  href={`https://wa.me/9647805808975?text=${encodeURIComponent(
                    isAr ? "مرحباً إبراهيم، أريد أبني موقع يبيع مثل هذا." : "Hello Ibrahim, I want a site that sells like this.",
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="brand-button btn-glow inline-flex items-center gap-2 rounded-sm px-5 py-3 text-sm font-bold"
                >
                  {isAr ? "ابدأ الآن" : "Start now"} <ArrowRight size={16} />
                </a>
                <span className="font-mono text-xs text-[var(--brand-muted)]">
                  {isAr ? "استشارة مجانية" : "Free consultation"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}