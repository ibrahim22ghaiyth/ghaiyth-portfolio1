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
  const packages = t.packages.items;
  const { data: databaseProductsRaw } = useListProducts();
  const featuredProducts = ((databaseProductsRaw as ProductWithDetails[] | undefined) || [])
    .filter((product) => product.active)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order || a.id - b.id)
    .slice(0, 3);

  return (
    <section
      id="packages"
      className="brand-section relative overflow-hidden border-y border-[var(--brand-line-soft)] py-20 sm:py-24"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--brand-cyan-glow),transparent_30%),radial-gradient(circle_at_80%_70%,var(--brand-blue-glow),transparent_34%)]" />
      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-[var(--brand-tag-bg)] px-4 py-2 text-xs font-bold text-primary">
              <PackageCheck size={15} />
              {t.packages.eyebrow}
            </div>
            <h2 className="text-3xl font-black leading-tight text-[var(--brand-heading)] sm:text-4xl md:text-5xl">
              {t.packages.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--brand-text-2)] sm:text-base">
              {t.packages.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="https://wa.me/9647805808975"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[0_16px_45px_var(--brand-blue-glow)] transition hover:-translate-y-0.5"
            >
              {t.packages.viewAll}
              <ArrowUpRight size={17} />
            </a>
            <a
              href="https://wa.me/9647805808975"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-primary/35 bg-[var(--brand-tag-bg)] px-5 py-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              {t.packages.secondaryCta}
              <MessageCircle size={17} />
            </a>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {packages.map((item, index) => {
            const Icon = productIcons[index % productIcons.length];
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="brand-panel group flex min-h-full flex-col rounded-xl p-5 transition hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_18px_55px_var(--brand-blue-glow)]"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-[var(--brand-tag-bg)] text-primary">
                    <Icon size={23} />
                  </span>
                  {index === 1 ? (
                    <span className="rounded-full border border-primary/30 px-3 py-1 text-xs font-bold text-primary">
                      {t.packages.featured}
                    </span>
                  ) : null}
                </div>
                <h3 className="text-xl font-black text-[var(--brand-heading)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--brand-text-2)]">{item.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[var(--brand-tag-bg)] px-3 py-1 text-xs text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-5 space-y-3 border-t border-[var(--brand-line-soft)] pt-5">
                  {item.points.map((point) => (
                    <div key={point} className="flex items-start gap-3 text-sm leading-6 text-[var(--brand-text-2)]">
                      <BadgeCheck size={16} className="mt-1 shrink-0 text-primary" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
                <a
                  href="https://wa.me/9647805808975"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-primary/35 bg-[var(--brand-panel-2)] px-4 py-3 text-sm font-bold text-[var(--brand-heading)] transition group-hover:border-primary/60 group-hover:text-primary"
                >
                  {t.packages.primaryCta}
                  <MessageCircle size={16} />
                </a>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-3">
          {t.packages.promises.map((promise) => (
            <div key={promise} className="flex items-center gap-3 rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-4 py-3 text-sm font-semibold text-[var(--brand-heading)]">
              <BadgeCheck size={17} className="shrink-0 text-primary" />
              <span>{promise}</span>
            </div>
          ))}
        </div>

        {featuredProducts.length > 0 ? (
          <div className="mt-14">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-black text-[var(--brand-heading)]">{t.products.catalogTitle}</h3>
                <p className="mt-2 text-sm text-[var(--brand-text-2)]">{t.products.catalogSubtitle}</p>
              </div>
              <Link href={lang === "en" ? "/en/products" : "/products"} className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                {t.products.cta}
                <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {featuredProducts.map((product) => {
                const title = lang === "ar" && product.titleAr ? product.titleAr : product.title;
                const description = lang === "ar" && product.descriptionAr ? product.descriptionAr : product.description;
                const href = `${lang === "en" ? "/en" : ""}/products/${product.slug || product.id}`;

                return (
                  <Link key={product.id} href={href} className="brand-panel group block overflow-hidden rounded-xl transition hover:-translate-y-1 hover:border-primary/45">
                    <div className="aspect-video bg-[var(--brand-panel-2)]">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="grid h-full place-items-center text-primary">
                          <PackageCheck size={36} />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">{product.template || "digital"}</div>
                      <h4 className="text-lg font-black text-[var(--brand-heading)]">{title}</h4>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--brand-text-2)]">{description}</p>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-sm font-black text-primary">{product.priceLabel || t.products.betaShort}</span>
                        <span className="rounded-md border border-primary/30 px-3 py-2 text-xs font-bold text-primary">
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
