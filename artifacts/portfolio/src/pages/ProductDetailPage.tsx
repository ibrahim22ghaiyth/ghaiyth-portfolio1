import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MessageCircle, PackageCheck, ShieldCheck } from "lucide-react";
import { Link, useParams } from "wouter";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";

type ProductDetails = {
  id: number;
  slug?: string | null;
  title: string;
  description: string;
  titleAr?: string | null;
  descriptionAr?: string | null;
  tags?: string[];
  priceLabel?: string | null;
  imageUrl?: string | null;
  requestUrl?: string | null;
  template?: string | null;
  purchaseLabel?: string | null;
  purchaseNote?: string | null;
  deliveryType?: string | null;
};

async function fetchProduct(slug?: string) {
  if (!slug) throw new Error("Missing product");
  const response = await fetch(`/api/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load product");
  return response.json() as Promise<ProductDetails>;
}

function createWhatsAppProductUrl(title: string, lang: string) {
  const message = lang === "ar"
    ? `مرحباً، أريد شراء المنتج: ${title}`
    : `Hello, I want to buy this product: ${title}`;
  return `https://wa.me/9647805808975?text=${encodeURIComponent(message)}`;
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLanguage();
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    retry: 1,
  });

  const title = product ? (lang === "ar" && product.titleAr ? product.titleAr : product.title) : "";
  const description = product ? (lang === "ar" && product.descriptionAr ? product.descriptionAr : product.description) : "";
  const checkoutLabel = product?.purchaseLabel || t.products.requestProduct;
  const checkoutUrl = product ? product.requestUrl || createWhatsAppProductUrl(title, lang) : "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <section className="stage-dark relative overflow-hidden pb-16 pt-32 sm:pt-36" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="hero-mesh absolute inset-0 pointer-events-none" />
          <div className="hero-grid absolute inset-0 pointer-events-none" />
          <div className="container relative z-10 mx-auto px-4 sm:px-6">
            <Link href={lang === "en" ? "/en/products" : "/products"} className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/70 backdrop-blur-sm transition-colors hover:border-white/25 hover:text-white">
              <ArrowLeft size={15} className="rtl:rotate-180" />
              {t.nav.products}
            </Link>

            {isLoading ? (
              <div className="rounded-xl border border-white/8 bg-white/4 p-10 text-center text-white/40 backdrop-blur-sm">{t.common.loading}</div>
            ) : isError || !product ? (
              <div className="rounded-xl border border-white/8 bg-white/4 p-10 text-center backdrop-blur-sm">
                <PackageCheck className="mx-auto mb-3 text-white/30" size={40} strokeWidth={1.5} />
                <h1 className="text-2xl font-bold text-white">{t.notFound.title}</h1>
              </div>
            ) : (
              <div className="max-w-3xl">
                <div className="brand-eyebrow mb-4" style={{ color: "#3B82F6" }}>
                  {product.template || "digital"}
                </div>
                <h1 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">{title}</h1>
                <div className="accent-bar" />
              </div>
            )}
          </div>
        </section>

        {product && !isError ? (
          <section className="brand-section py-16 sm:py-20" dir={lang === "ar" ? "rtl" : "ltr"}>
            <div className="container mx-auto px-4 sm:px-6">
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <div className="brand-panel overflow-hidden rounded-xl">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={title} className="aspect-[4/3] w-full object-cover" />
                  ) : (
                    <div className="grid aspect-[4/3] place-items-center text-primary">
                      <PackageCheck size={72} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <div className="brand-panel rounded-xl p-7 sm:p-9">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="brand-eyebrow">{product.template || "digital"}</span>
                    {product.deliveryType ? (
                      <span className="rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-2.5 py-1 font-mono text-xs brand-muted">
                        {product.deliveryType}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="brand-heading mb-5 text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
                  <div className="accent-bar mb-6" />
                  <p className="brand-copy whitespace-pre-line text-base leading-8">{description}</p>
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {(product.tags || []).map((tag) => (
                      <span key={tag} className="rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel-2)] px-2.5 py-1 font-mono text-[11px] text-[var(--brand-text-2)]">{tag}</span>
                    ))}
                  </div>
                  <div className="brand-panel mt-8 rounded-xl p-6">
                    <div className="brand-heading mb-2 flex items-center gap-2 font-bold">
                      <ShieldCheck size={18} className="text-primary" />
                      <span>{product.priceLabel || t.products.betaShort}</span>
                    </div>
                    <p className="brand-copy text-sm leading-7">
                      {product.purchaseNote || t.products.paymentNote}
                    </p>
                  </div>
                  <a href={checkoutUrl} target="_blank" rel="noreferrer" className="brand-button mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-lg px-6 py-4 text-base font-semibold">
                    {checkoutLabel}
                    <MessageCircle size={18} />
                  </a>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        <Footer />
      </main>
    </div>
  );
}
