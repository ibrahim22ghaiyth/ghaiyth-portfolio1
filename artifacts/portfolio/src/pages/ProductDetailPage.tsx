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
      <main className="pt-28">
        <section className="relative overflow-hidden py-12" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,var(--brand-cyan-glow),transparent_30%),radial-gradient(circle_at_80%_50%,var(--brand-blue-glow),transparent_36%)]" />
          <div className="container relative mx-auto px-6">
            <Link href={lang === "en" ? "/en/products" : "/products"} className="mb-8 inline-flex items-center gap-2 rounded-md border border-[var(--brand-line)] bg-[var(--brand-panel)] px-4 py-2 text-sm font-bold text-primary">
              <ArrowLeft size={16} />
              {t.nav.products}
            </Link>

            {isLoading ? (
              <div className="brand-panel rounded-xl p-8 text-center text-[var(--brand-muted)]">{t.common.loading}</div>
            ) : isError || !product ? (
              <div className="brand-panel rounded-xl p-8 text-center">
                <PackageCheck className="mx-auto mb-3 text-primary" />
                <h1 className="text-2xl font-black text-[var(--brand-heading)]">{t.notFound.title}</h1>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
                <div className="brand-panel overflow-hidden rounded-2xl">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={title} className="aspect-[4/3] w-full object-cover" />
                  ) : (
                    <div className="grid aspect-[4/3] place-items-center text-primary">
                      <PackageCheck size={72} />
                    </div>
                  )}
                </div>
                <div className="brand-panel rounded-2xl p-6 md:p-8">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[var(--brand-tag-bg)] px-3 py-1 text-xs font-bold uppercase text-primary">
                      {product.template || "digital"}
                    </span>
                    {product.deliveryType ? (
                      <span className="rounded-full border border-[var(--brand-line)] px-3 py-1 text-xs text-[var(--brand-muted)]">
                        {product.deliveryType}
                      </span>
                    ) : null}
                  </div>
                  <h1 className="text-4xl font-black leading-tight text-[var(--brand-heading)] md:text-6xl">{title}</h1>
                  <p className="mt-5 whitespace-pre-line text-lg leading-8 text-[var(--brand-text-2)]">{description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {(product.tags || []).map((tag) => (
                      <span key={tag} className="rounded-full bg-[var(--brand-tag-bg)] px-3 py-1 text-xs text-primary">{tag}</span>
                    ))}
                  </div>
                  <div className="mt-8 rounded-xl border border-[var(--brand-line)] bg-[var(--brand-panel-2)] p-5">
                    <div className="mb-2 flex items-center gap-2 font-black text-[var(--brand-heading)]">
                      <ShieldCheck size={18} className="text-primary" />
                      <span>{product.priceLabel || t.products.betaShort}</span>
                    </div>
                    {product.purchaseNote ? (
                      <p className="text-sm leading-7 text-[var(--brand-text-2)]">{product.purchaseNote}</p>
                    ) : (
                      <p className="text-sm leading-7 text-[var(--brand-text-2)]">{t.products.paymentNote}</p>
                    )}
                  </div>
                  <a href={checkoutUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-black text-primary-foreground shadow-[0_18px_50px_var(--brand-blue-glow)]">
                    {checkoutLabel}
                    <MessageCircle size={19} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
