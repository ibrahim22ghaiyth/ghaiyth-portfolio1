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

  const inputCls =
    "w-full rounded-lg border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-4 py-3.5 text-[var(--brand-heading)] placeholder:text-[var(--brand-muted)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors";

  return (
    <section id="contact" className="brand-section relative py-24 sm:py-28 md:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="brand-eyebrow mb-4">{t.contact.eyebrow}</p>
          <h2 className="brand-heading mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {t.contact.title} <span className="text-primary">{t.contact.titleHighlight}</span> {t.contact.titleEnd}
          </h2>
          <div className="accent-bar mx-auto mb-6" />
          <p className="brand-copy mx-auto max-w-2xl text-base leading-8">{t.contact.subtitle}</p>
        </div>

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
              <a href="mailto:info@ibrahimig.com" className="brand-panel card-lift flex items-center gap-4 rounded-xl p-5 group break-all">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-[var(--brand-tag-bg)] text-primary">
                  <Mail size={19} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="brand-eyebrow mb-0.5">{t.contact.emailLabel}</div>
                  <div className="text-sm font-semibold text-[var(--brand-heading)]">info@ibrahimig.com</div>
                </div>
              </a>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="brand-panel card-lift flex items-center gap-4 rounded-xl p-5 group break-all">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-[var(--brand-tag-bg)] text-primary">
                  <MessageCircle size={19} strokeWidth={1.8} />
                </div>
                <div>
                  <div className="brand-eyebrow mb-0.5">{t.contact.whatsapp}</div>
                  <div className="text-sm font-semibold text-[var(--brand-heading)]" dir="ltr">+964 7805808975</div>
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
                  <a key={i} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className="brand-panel flex h-11 w-11 items-center justify-center rounded-lg text-[var(--brand-muted)] transition-colors hover:border-primary/40 hover:text-primary">
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.form
            className="brand-panel space-y-5 rounded-xl p-7 sm:p-8 md:col-span-3"
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
                  required
                  minLength={2}
                  maxLength={100}
                  className={inputCls}
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
                  required
                  maxLength={254}
                  className={inputCls}
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
                required
                minLength={5}
                maxLength={5000}
                className={`${inputCls} h-36 resize-none`}
                placeholder={t.contact.messagePlaceholder}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={sendMessage.isPending}
              className="brand-button mt-2 flex w-full items-center justify-center gap-2.5 rounded-lg py-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sendMessage.isPending ? t.contact.sendingBtn : t.contact.sendBtn} <Send size={17} />
            </button>
            <p className="text-xs leading-5 brand-muted">{t.contact.formNote}</p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
