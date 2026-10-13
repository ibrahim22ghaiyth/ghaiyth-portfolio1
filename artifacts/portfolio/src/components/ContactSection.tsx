import { motion } from "framer-motion";
import { Github, Instagram, Linkedin, Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useSendMessage } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export function ContactSection() {
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const sendMessage = useSendMessage();
  const { toast } = useToast();

  const whatsappText = isAr
    ? "مرحباً إبراهيم، أريد مناقشة مشروع ويب جديد."
    : "Hello Ibrahim, I want to discuss a new web project.";
  const whatsappHref = `https://wa.me/9647805808975?text=${encodeURIComponent(whatsappText)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sendMessage.isPending) return;
    sendMessage.mutate(
      {
        data: {
          ...formData,
          subject: isAr ? "استفسار من موقع ibrahimig.com" : "Inquiry via ibrahimig.com",
        },
      },
      {
        onSuccess: () => {
          toast({ title: t.contact.successTitle, description: t.contact.successDesc });
          setFormData({ name: "", email: "", message: "" });
        },
        onError: () => {
          toast({ title: t.contact.errorTitle, description: t.contact.errorDesc, variant: "destructive" });
        },
      },
    );
  };

  const getInputCls = (field: string) =>
    `w-full rounded-lg border bg-[var(--brand-panel-2)] px-4 py-3.5 text-[var(--brand-heading)] placeholder:text-[var(--brand-muted)] transition-all duration-300 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.06)] ${
      focusedField === field ? "border-primary" : "border-[var(--brand-line)]"
    }`;

  return (
    <section id="contact" className="brand-section relative overflow-hidden py-24 sm:py-28 md:py-32">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 h-52 w-52 rounded-full bg-[var(--brand-blue)]/[0.03] blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-[var(--brand-blue)]/[0.02] blur-[70px] pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <p className="brand-eyebrow mb-4">{t.contact.eyebrow}</p>
          <h2 className="brand-heading mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {t.contact.title} <span className="text-primary">{t.contact.titleHighlight}</span> {t.contact.titleEnd}
          </h2>
          <div className="accent-bar mx-auto mb-6" />
          <p className="brand-copy mx-auto max-w-2xl text-base leading-8">{t.contact.subtitle}</p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-5">
          <motion.div
            className="space-y-8 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h3 className="brand-heading mb-2 text-xl font-bold">{t.contact.getInTouch}</h3>
              <p className="text-sm brand-muted">{t.contact.getInTouchSub}</p>
            </div>

            <div className="space-y-3">
              <a href="mailto:info@ibrahimig.com" className="gradient-border card-sweep group flex items-center gap-4 rounded-xl p-5 break-all">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-[var(--brand-tag-bg)] text-primary transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(59,130,246,0.12)] group-hover:scale-105">
                  <Mail size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="brand-eyebrow mb-0.5">{t.contact.emailLabel}</div>
                  <div className="text-sm font-semibold text-[var(--brand-heading)] transition-colors group-hover:text-[var(--brand-blue)]">info@ibrahimig.com</div>
                </div>
              </a>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="gradient-border card-sweep group flex items-center gap-4 rounded-xl p-5 break-all">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-[var(--brand-tag-bg)] text-primary transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(59,130,246,0.12)] group-hover:scale-105">
                  <MessageCircle size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="brand-eyebrow mb-0.5">{t.contact.whatsapp}</div>
                  <div className="text-sm font-semibold text-[var(--brand-heading)] transition-colors group-hover:text-[var(--brand-blue)]" dir="ltr">+964 7805808975</div>
                </div>
              </a>
            </div>

            <div>
              <h4 className="brand-eyebrow mb-3">{t.contact.social}</h4>
              <div className="flex gap-3">
                {[
                  { icon: Github, href: "https://github.com/ibrahim22ghaiyth", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/ibrahim-ghaiyth-3144a1350", label: "LinkedIn" },
                  { icon: Instagram, href: "https://www.instagram.com/ib.et", label: "Instagram" },
                  { icon: MessageCircle, href: whatsappHref, label: "WhatsApp" },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                    className="gradient-border icon-magnetic flex h-12 w-12 items-center justify-center rounded-xl text-[var(--brand-muted)] hover:text-primary hover:shadow-[0_0_16px_rgba(59,130,246,0.1)]"
                  >
                    <social.icon size={19} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.form
            className="gradient-border card-sweep space-y-5 rounded-xl p-7 sm:p-8 md:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.12 }}
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="brand-eyebrow">{t.contact.name}</label>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  required
                  minLength={2}
                  maxLength={100}
                  className={getInputCls("name")}
                  placeholder={t.contact.namePlaceholder}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="brand-eyebrow">{t.contact.email}</label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  required
                  maxLength={254}
                  className={getInputCls("email")}
                  placeholder={t.contact.emailPlaceholder}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="contact-message" className="brand-eyebrow">{t.contact.message}</label>
              <textarea
                id="contact-message"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                required
                minLength={5}
                maxLength={5000}
                className={`${getInputCls("message")} h-36 resize-none`}
                placeholder={t.contact.messagePlaceholder}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={sendMessage.isPending}
              className="brand-button btn-glow mt-2 flex w-full items-center justify-center gap-2.5 rounded-lg py-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sendMessage.isPending ? t.contact.sendingBtn : t.contact.sendBtn} <Send size={17} />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
