import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { BlogSection } from "@/components/BlogSection";
import { useLanguage } from "@/contexts/LanguageContext";

export function BlogPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <section className="stage-dark relative overflow-hidden pb-16 pt-32 sm:pt-36" dir="ltr">
          <div className="hero-mesh absolute inset-0 pointer-events-none" />
          <div className="hero-grid absolute inset-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6" dir={t.common.loading ? "ltr" : "ltr"}>
            <div className="max-w-3xl" dir="auto">
              <p className="brand-eyebrow mb-4" style={{ color: "#6BA3FF" }}>{t.blog.beta}</p>
              <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">{t.blog.pageTitle}</h1>
              <div className="accent-bar mb-5" />
              <p className="max-w-2xl text-base leading-8 text-white/40">{t.blog.pageSubtitle}</p>
            </div>
          </div>
        </section>
        <BlogSection />
        <Footer />
      </main>
    </div>
  );
}
