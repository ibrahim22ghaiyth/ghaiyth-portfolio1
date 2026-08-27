import { motion } from "framer-motion";
import { Github, Instagram, Linkedin, Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useSendMessage } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export function ContactSection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const sendMessage = useSendMessage();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage.mutate(
      { data: formData },
      {
        onSuccess: () => {
          toast({
            title: t.contact.successTitle,
            description: t.contact.successDesc,
          });
          setFormData({ name: "", email: "", subject: "", message: "" });
        },
        onError: () => {
          toast({
            title: t.contact.errorTitle,
            description: t.contact.errorDesc,
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <section id="contact" className="brand-section py-24 relative border-t border-[var(--brand-line-soft)]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">// {t.contact.eyebrow}</p>
          <h2 className="brand-heading text-3xl md:text-5xl font-extrabold mb-6">
            {t.contact.title} <span className="text-primary">{t.contact.titleHighlight}</span> {t.contact.titleEnd}
          </h2>
          <p className="brand-copy max-w-2xl mx-auto leading-7">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-12 max-w-5xl mx-auto">
          <motion.div
            className="md:col-span-2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-xl font-bold text-[var(--brand-heading)] mb-2">{t.contact.getInTouch}</h3>
              <p className="text-muted-foreground text-sm">{t.contact.getInTouchSub}</p>
            </div>

            <div className="space-y-4">
              <a href="mailto:info@ibrahimig.com" className="flex items-center gap-4 p-4 rounded-xl bg-card border border-[var(--brand-line)] hover:border-primary/30 transition-colors group break-all">
                <div className="w-10 h-10 shrink-0 rounded-md bg-[var(--brand-tag-bg)] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-mono mb-1">{t.contact.emailLabel}</div>
                  <div className="text-sm font-medium text-[var(--brand-heading)]">info@ibrahimig.com</div>
                </div>
              </a>
              <a href="https://wa.me/9647805808975" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-xl bg-card border border-[var(--brand-line)] hover:border-primary/30 transition-colors group break-all">
                <div className="w-10 h-10 shrink-0 rounded-md bg-[var(--brand-tag-bg)] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-mono mb-1">{t.contact.whatsapp}</div>
                  <div className="text-sm font-medium text-[var(--brand-heading)]" dir="ltr">+964 7805808975</div>
                </div>
              </a>
            </div>

            <div>
              <h4 className="text-sm font-mono text-muted-foreground mb-4 uppercase tracking-wider">{t.contact.social}</h4>
              <div className="flex gap-4">
                {[
                  { icon: Github, href: "https://github.com/ibrahim22ghaiyth", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/ibrahim-ghaiyth-3144a1350", label: "LinkedIn" },
                  { icon: Instagram, href: "https://www.instagram.com/ib.et", label: "Instagram" },
                  { icon: MessageCircle, href: "https://wa.me/9647805808975", label: "WhatsApp" },
                ].map((social, i) => (
                  <a key={i} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className="w-12 h-12 rounded-md bg-card border border-[var(--brand-line)] flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary/50 transition-all">
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.form
            className="md:col-span-3 space-y-4 p-8 rounded-lg brand-panel"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="text-xs font-mono text-muted-foreground uppercase">{t.contact.name}</label>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-background border border-[var(--brand-line)] rounded-lg px-4 py-3 text-[var(--brand-heading)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder={t.contact.namePlaceholder}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-xs font-mono text-muted-foreground uppercase">{t.contact.email}</label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-background border border-[var(--brand-line)] rounded-lg px-4 py-3 text-[var(--brand-heading)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder={t.contact.emailPlaceholder}
                />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <label htmlFor="contact-subject" className="text-xs font-mono text-muted-foreground uppercase">{t.contact.subject}</label>
              <input
                id="contact-subject"
                type="text"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                required
                className="w-full bg-background border border-[var(--brand-line)] rounded-lg px-4 py-3 text-[var(--brand-heading)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder={t.contact.subjectPlaceholder}
              />
            </div>
            <div className="space-y-2 pt-2">
              <label htmlFor="contact-message" className="text-xs font-mono text-muted-foreground uppercase">{t.contact.message}</label>
              <textarea
                id="contact-message"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                required
                className="w-full bg-background border border-[var(--brand-line)] rounded-lg px-4 py-3 text-[var(--brand-heading)] h-32 resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder={t.contact.messagePlaceholder}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={sendMessage.isPending}
              className="brand-button w-full flex items-center justify-center gap-2 py-4 rounded-md font-bold mt-4 transition-all hover:glow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendMessage.isPending ? t.contact.sendingBtn : t.contact.sendBtn} <Send size={18} />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}


