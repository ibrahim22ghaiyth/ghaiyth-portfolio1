import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, MessageCircle, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useListProducts, type Product } from "@workspace/api-client-react";
import { useLanguage } from "@/contexts/LanguageContext";

const productIcons = [PackageCheck, ShieldCheck, Sparkles];

type ProductWithDetails = Product & {
  slug?: string | null;
  template?: string | null;
  purchaseLabel?: string | null;
  purchaseNote?: string | null;
};

export function ProductsSection() {
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";
  const packages = t.packages.items;
  const { data: databaseProductsRaw } = useListProducts();
  const featuredProducts = ((databaseProductsRaw as ProductWithDetails[] | undefined) || [])
    .filter((product) => product.active)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order || a.id - b.id)
    .slice(0, 3);

  const waHref = (topic: string) =>
    `https://wa.me/9647805808975?text=${encodeURIComponent(
      isAr ? `مرحباً إبراهيم، أريد الاستفسار عن ${topic}.` : `Hello Ibrahim, I would like to ask about ${topic}.`
    )}`;

  return (
    <section id="packages" className="brand-section relative py-24 sm:py-28 md:py-32" dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="brand-eyebrow mb-4 flex items-center gap-2">
              <PackageCheck size={14} />
              {t.packages.eyebrow}
            </div>
            <h2 className="brand-heading mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              {t.packages.title}
            </h2>
            <div className="accent-bar mb-5" />
            <p className="brand-copy max-w-2xl text-base leading-8">{t.packages.subtitle}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={waHref(isAr ? "باقات الخدمات" : "service packages")}
              target="_blank"
              rel="noreferrer"
              className="brand-button inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-lg px-7 py-3.5 text-sm font-semibold"
            >
              {t.packages.viewAll} <ArrowUpRight size={17} />
            </a>
            <a
              href={waHref(isAr ? "باقات الخدمات" : "service packages")}
              target="_blank"
              rel="noreferrer"
              className="btn-outline inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-lg px-7 py-3.5 text-sm font-semibold"
            >
              {t.packages.secondaryCta} <MessageCircle size={17} />
            </a>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
          {packages.map((item, index) => {
            const Icon = productIcons[index % productIcons.length];
            const isFeatured = index === 1;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={`brand-panel card-lift group flex min-h-full flex-col rounded-xl p-7 sm:p-8 ${isFeatured ? "border-primary/30 relative" : ""}`}
              >
                {isFeatured ? (
                  <div className="absolute -top-px start-8 end-8 h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent" />
                ) : null}

                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/15 bg-[var(--brand-tag-bg)] text-primary">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  {isFeatured ? (
                    <span className="rounded-full border border-primary/30 bg-[var(--brand-tag-bg)] px-3 py-1 text-[11px] font-bold text-primary">
                      {t.packages.featured}
                    </span>
                  ) : null}
                </div>

                <h3 className="brand-heading mb-3 text-xl font-bold">{item.title}</h3>
                <p className="brand-copy mb-5 text-sm leading-7">{item.description}</p>

                <div className="mb-6 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-2.5 py-1 font-mono text-[11px] text-[var(--brand-text-2)]">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mb-6 space-y-3 border-t border-[var(--brand-line-soft)] pt-5">
                  {item.points.map((point) => (
                    <div key={point} className="flex items-start gap-3 text-sm leading-6 brand-copy">
                      <BadgeCheck size={16} className="mt-1 shrink-0 text-primary" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={waHref(isAr ? `الباقة: ${item.title}` : `the package: ${item.title}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold group-hover:border-primary group-hover:text-primary"
                >
                  {t.packages.primaryCta} <MessageCircle size={16} />
                </a>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {t.packages.promises.map((promise) => (
            <div key={promise} className="flex items-center gap-3 border-t border-[var(--brand-line)] py-4 text-sm font-semibold text-[var(--brand-heading)]">
              <BadgeCheck size={18} className="shrink-0 text-primary" />
              <span>{promise}</span>
            </div>
          ))}
        </div>

        {featuredProducts.length > 0 ? (
          <div className="mt-16">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="brand-heading text-2xl font-bold">{t.products.catalogTitle}</h3>
                <p className="mt-2 text-sm brand-copy">{t.products.catalogSubtitle}</p>
              </div>
              <Link href={lang === "en" ? "/en/products" : "/products"} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                {t.products.cta} <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3 lg:gap-6">
              {featuredProducts.map((product) => {
                const title = lang === "ar" && product.titleAr ? product.titleAr : product.title;
                const description = lang === "ar" && product.descriptionAr ? product.descriptionAr : product.description;
                const href = `${lang === "en" ? "/en" : ""}/products/${product.slug || product.id}`;

                return (
                  <Link key={product.id} href={href} className="brand-panel card-lift group block overflow-hidden rounded-xl">
                    <div className="aspect-video overflow-hidden bg-[var(--brand-panel-2)]">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={title} className="img-zoom h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="grid h-full place-items-center text-primary">
                          <PackageCheck size={40} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="brand-eyebrow mb-2">{product.template || "digital"}</div>
                      <h4 className="brand-heading text-lg font-bold">{title}</h4>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 brand-copy">{description}</p>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <span className="text-sm font-bold text-primary">{product.priceLabel || t.products.betaShort}</span>
                        <span className="btn-outline rounded-lg px-3.5 py-1.5 text-xs font-semibold">
                          {product.purchaseLabel || t.products.requestProduct}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
