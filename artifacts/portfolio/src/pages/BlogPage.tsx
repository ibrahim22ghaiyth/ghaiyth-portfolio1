import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { BlogSection } from "@/components/BlogSection";
import { useLanguage } from "@/contexts/LanguageContext";

export function BlogPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-28">
        <section className="container mx-auto px-6 pb-4">
          <div className="rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-panel)] px-6 py-8">
            <p className="mb-3 text-sm font-bold text-primary">{t.blog.beta}</p>
            <h1 className="text-4xl font-black text-[var(--brand-heading)] md:text-6xl">{t.blog.pageTitle}</h1>
            <p className="mt-4 max-w-3xl text-[var(--brand-text-2)]">{t.blog.pageSubtitle}</p>
          </div>
        </section>
        <BlogSection />
        <Footer />
      </main>
    </div>
  );
}
