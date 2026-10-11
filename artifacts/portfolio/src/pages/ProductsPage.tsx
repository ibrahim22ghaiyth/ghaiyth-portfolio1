import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Download, MessageCircle, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useListProducts, type Product } from "@workspace/api-client-react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";

const productIcons = [PackageCheck, ShieldCheck, Download];

type ProductWithDetails = Product & {
  slug?: string | null;
  template?: string | null;
  purchaseLabel?: string | null;
  purchaseNote?: string | null;
  deliveryType?: string | null;
};

function createWhatsAppProductUrl(title: string, lang: string) {
  const message = lang === "ar"
    ? `مرحباً، أريد شراء المنتج: ${title}`
    : `Hello, I want to buy this product: ${title}`;
  return `https://wa.me/9647805808975?text=${encodeURIComponent(message)}`;
}

export function ProductsPage() {
  const { t, lang } = useLanguage();
  const { data: databaseProductsRaw } = useListProducts();
  const databaseProducts = databaseProductsRaw as ProductWithDetails[] | undefined;
  const visibleProducts = (databaseProducts || [])
    .filter((product) => product.active)
    .sort((a, b) => a.order - b.order || a.id - b.id)
    .map((product) => ({
      title: lang === "ar" && product.titleAr ? product.titleAr : product.title,
      description: lang === "ar" && product.descriptionAr ? product.descriptionAr : product.description,
      tags: product.tags,
      priceLabel: product.priceLabel,
      imageUrl: product.imageUrl,
      checkoutUrl: product.requestUrl || createWhatsAppProductUrl(lang === "ar" && product.titleAr ? product.titleAr : product.title, lang),
      slug: product.slug || String(product.id),
      template: product.template || "standard",
      purchaseLabel: product.purchaseLabel || "",
      purchaseNote: product.purchaseNote || "",
      deliveryType: product.deliveryType || "",
    }));
  const products = databaseProducts ? visibleProducts : t.products.items.map((product) => ({
    ...product,
    imageUrl: null,
    checkoutUrl: createWhatsAppProductUrl(product.title, lang),
    slug: "",
    template: "standard",
    purchaseLabel: "",
    purchaseNote: "",
    deliveryType: "",
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <section className="stage-dark relative overflow-hidden pb-16 pt-32 sm:pt-36" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="hero-mesh absolute inset-0 pointer-events-none" />
          <div className="hero-grid absolute inset-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="brand-eyebrow mb-4 inline-flex items-center gap-2" style={{ color: "#3B82F6" }}>
                  <Sparkles size={14} />
                  {t.products.beta}
                </div>
                <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">{t.products.title}</h1>
                <div className="accent-bar mb-5" />
                <p className="max-w-2xl text-base leading-8 text-white/40">{t.products.subtitle}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href="#product-catalog" className="brand-button inline-flex items-center justify-center gap-2.5 rounded-lg px-7 py-4 text-sm font-semibold">
                    <PackageCheck size={17} />
                    {t.products.cta}
                  </a>
                  <a href="#order-process" className="btn-ghost-dark inline-flex items-center justify-center gap-2.5 rounded-lg px-7 py-4 text-sm font-semibold">
                    {t.products.emailCta}
                    <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>

              <div className="grid gap-3">
                {t.products.promises.map((promise, index) => (
                  <motion.div
                    key={promise}
                    initial={{ opacity: 0, x: lang === "ar" ? -16 : 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.08 }}
                    className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/4 p-4 backdrop-blur-sm"
                  >
                    <span className="grid h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#3B82F6]">
                      <BadgeCheck size={20} strokeWidth={1.8} />
                    </span>
                    <p className="text-sm font-medium text-white/60">{promise}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="product-catalog" className="brand-section py-24 sm:py-28">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-12 max-w-3xl" dir={lang === "ar" ? "rtl" : "ltr"}>
              <h2 className="brand-heading mb-5 text-3xl font-bold leading-tight sm:text-4xl">{t.products.catalogTitle}</h2>
              <div className="accent-bar mb-5" />
              <p className="brand-copy max-w-2xl text-base leading-8">{t.products.catalogSubtitle}</p>
            </div>

            <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
              {products.map((product, index) => {
                const Icon = productIcons[index % productIcons.length];
                const detailHref = product.slug ? `${lang === "en" ? "/en" : ""}/products/${product.slug}` : "";
                return (
                  <motion.article
                    key={product.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: index * 0.08, duration: 0.45 }}
                    className="brand-panel card-lift group flex min-h-full flex-col rounded-xl p-7 sm:p-8"
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  >
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <span className="grid h-12 w-12 items-center justify-center rounded-lg border border-primary/15 bg-[var(--brand-tag-bg)] text-primary">
                        <Icon size={22} strokeWidth={1.8} />
                      </span>
                      <span className="btn-outline rounded-lg px-3.5 py-1.5 text-sm font-bold">
                        {product.priceLabel || t.products.betaShort}
                      </span>
                    </div>
                    {product.imageUrl ? (
                      <Link href={detailHref || "#"} className="mb-5 block aspect-video overflow-hidden rounded-lg border border-[var(--brand-line)] bg-[var(--brand-panel-2)]">
                        <img src={product.imageUrl} alt={product.title} className="img-zoom h-full w-full object-cover" />
                      </Link>
                    ) : null}
                    {product.template ? (
                      <div className="brand-eyebrow mb-2">{product.template}</div>
                    ) : null}
                    <Link href={detailHref || "#"} className="block">
                      <h3 className="brand-heading text-xl font-bold transition-colors group-hover:text-primary">{product.title}</h3>
                    </Link>
                    <p className="brand-copy mt-3 min-h-32 text-sm leading-7">{product.description}</p>
                    {product.purchaseNote ? (
                      <p className="brand-muted mt-3 rounded-lg border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-3.5 py-2.5 text-xs leading-6">
                        {product.purchaseNote}
                      </p>
                    ) : null}
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {product.tags.map((tag) => (
                        <span key={tag} className="rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-2.5 py-1 font-mono text-[11px] text-[var(--brand-text-2)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a href={product.checkoutUrl} target="_blank" rel="noreferrer" className="brand-button mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-semibold">
                      {product.purchaseLabel || t.products.requestProduct}
                      <MessageCircle size={16} />
                    </a>
                  </motion.article>
                );
              })}
            </div>

            <div id="order-process" className="brand-panel mt-10 rounded-xl p-6 text-sm leading-7 brand-copy" dir={lang === "ar" ? "rtl" : "ltr"}>
              <div className="brand-heading mb-2 flex items-center gap-2 font-bold">
                <MessageCircle size={17} className="text-primary" />
                <span>{t.products.paymentSoon}</span>
              </div>
              <p>{t.products.paymentNote}</p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
