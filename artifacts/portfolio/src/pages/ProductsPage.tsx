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

const templateStyles: Record<string, string> = {
  standard: "border-primary/20",
  ebook: "border-emerald-400/35",
  software: "border-cyan-400/35",
  webapp: "border-blue-500/35",
  bundle: "border-amber-400/35",
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
      <main className="pt-28">
        <section className="relative overflow-hidden py-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,var(--brand-blue-glow),transparent_35%)]" />
          <div className="container relative mx-auto px-6">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="rounded-2xl border border-[var(--brand-line)] bg-[var(--brand-panel)] p-7 md:p-10" dir={lang === "ar" ? "rtl" : "ltr"}>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-[var(--brand-tag-bg)] px-4 py-2 text-xs font-bold text-primary">
                  <Sparkles size={15} />
                  {t.products.beta}
                </div>
                <h1 className="text-4xl font-black leading-tight text-[var(--brand-heading)] md:text-6xl">{t.products.title}</h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--brand-text-2)]">{t.products.subtitle}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href="#product-catalog" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-primary-foreground shadow-[0_18px_50px_var(--brand-blue-glow)] transition hover:-translate-y-0.5">
                    <PackageCheck size={18} />
                    {t.products.cta}
                  </a>
                  <a href="#order-process" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-6 py-4 font-bold text-[var(--brand-heading)] transition hover:border-primary/45">
                    {t.products.emailCta}
                    <ArrowUpRight size={18} />
                  </a>
                </div>
              </div>

              <div className="grid gap-4">
                {t.products.promises.map((promise, index) => (
                  <motion.div
                    key={promise}
                    initial={{ opacity: 0, x: lang === "ar" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-center gap-4 rounded-xl border border-[var(--brand-line)] bg-[var(--brand-panel)] p-5"
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[var(--brand-tag-bg)] text-primary">
                      <BadgeCheck size={21} />
                    </span>
                    <p className="font-semibold text-[var(--brand-heading)]">{promise}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="product-catalog" className="pb-24">
          <div className="container mx-auto px-6">
            <div className="mb-8" dir={lang === "ar" ? "rtl" : "ltr"}>
              <h2 className="text-3xl font-black text-[var(--brand-heading)]">{t.products.catalogTitle}</h2>
              <p className="mt-3 max-w-2xl text-[var(--brand-text-2)]">{t.products.catalogSubtitle}</p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {products.map((product, index) => {
                const Icon = productIcons[index % productIcons.length];
                const detailHref = product.slug ? `${lang === "en" ? "/en" : ""}/products/${product.slug}` : "";
                const templateClass = templateStyles[product.template || "standard"] || templateStyles.standard;
                return (
                  <motion.article
                    key={product.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className={`group rounded-2xl border bg-[var(--brand-panel)] p-6 transition hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_18px_55px_var(--brand-blue-glow)] ${templateClass}`}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  >
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--brand-tag-bg)] text-primary">
                        <Icon size={24} />
                      </span>
                      <span className="rounded-full border border-primary/30 bg-[var(--brand-tag-bg)] px-3 py-1 text-sm font-black text-primary">
                        {product.priceLabel || t.products.betaShort}
                      </span>
                    </div>
                    {product.imageUrl ? (
                      <Link href={detailHref || "#"} className="mb-5 block aspect-video overflow-hidden rounded-xl border border-[var(--brand-line)] bg-[var(--brand-panel-2)]">
                        <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
                      </Link>
                    ) : null}
                    {product.template ? (
                      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">{product.template}</div>
                    ) : null}
                    <Link href={detailHref || "#"} className="block">
                      <h3 className="text-2xl font-black text-[var(--brand-heading)] transition group-hover:text-primary">{product.title}</h3>
                    </Link>
                    <p className="mt-3 min-h-32 text-sm leading-7 text-[var(--brand-text-2)]">{product.description}</p>
                    {product.purchaseNote ? (
                      <p className="mt-3 rounded-lg border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-3 py-2 text-xs leading-6 text-[var(--brand-muted)]">
                        {product.purchaseNote}
                      </p>
                    ) : null}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-[var(--brand-tag-bg)] px-3 py-1 text-xs text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a href={product.checkoutUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground transition hover:-translate-y-0.5">
                      {product.purchaseLabel || t.products.requestProduct}
                      <MessageCircle size={17} />
                    </a>
                  </motion.article>
                );
              })}
            </div>
            <div id="order-process" className="mt-8 rounded-2xl border border-primary/25 bg-[var(--brand-tag-bg)] p-5 text-sm leading-7 text-[var(--brand-heading)]" dir={lang === "ar" ? "rtl" : "ltr"}>
              <div className="mb-2 flex items-center gap-2 font-black text-primary">
                <MessageCircle size={18} />
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
