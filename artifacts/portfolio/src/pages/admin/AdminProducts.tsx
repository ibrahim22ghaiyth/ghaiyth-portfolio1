import { useState } from "react";
import {
  getListProductsQueryKey,
  useCreateProduct,
  useDeleteProduct,
  useListProducts,
  useUpdateProduct,
  type Product,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, ImagePlus, LayoutTemplate, Star, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { TranslateButton } from "@/components/admin/shared";
import { useTranslate } from "@/hooks/use-translate";

const emptyForm = {
  slug: "",
  title: "",
  description: "",
  titleAr: "",
  descriptionAr: "",
  tags: "",
  priceLabel: "",
  imageUrl: "",
  requestUrl: "https://wa.me/9647805808975",
  template: "standard",
  purchaseLabel: "",
  purchaseNote: "",
  deliveryType: "digital",
  featured: false,
  order: 0,
  active: true,
};

type ProductTemplate = "standard" | "ebook" | "software" | "webapp" | "bundle";

type ProductWithDetails = Product & {
  slug?: string | null;
  template?: ProductTemplate | string | null;
  purchaseLabel?: string | null;
  purchaseNote?: string | null;
  deliveryType?: string | null;
};

const productTemplates: Array<{ id: ProductTemplate; label: string; description: string }> = [
  { id: "standard", label: "Standard", description: "Product card" },
  { id: "ebook", label: "E-book", description: "PDF, guide, book" },
  { id: "software", label: "Software", description: "Tool or script" },
  { id: "webapp", label: "Web App", description: "Hosted app" },
  { id: "bundle", label: "Bundle", description: "Pack offer" },
];

export function AdminProducts() {
  const { t } = useLanguage();
  const { data: productsRaw, isLoading } = useListProducts();
  const products = productsRaw as ProductWithDetails[] | undefined;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { translate, isTranslating } = useTranslate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const trEnToAr = async (enField: string, arField: string) => {
    const val = (formData as any)[enField];
    if (!val?.trim()) return;
    const r = await translate(val, "en", "ar");
    if (r) setFormData((f: any) => ({ ...f, [arField]: r }));
  };
  const trArToEn = async (arField: string, enField: string) => {
    const val = (formData as any)[arField];
    if (!val?.trim()) return;
    const r = await translate(val, "ar", "en");
    if (r) setFormData((f: any) => ({ ...f, [enField]: r }));
  };

  const openProductsPage = () => {
    window.open("/products", "_blank", "noopener,noreferrer");
  };

  const openDialog = (product?: ProductWithDetails) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        slug: product.slug || "",
        title: product.title,
        description: product.description,
        titleAr: product.titleAr || "",
        descriptionAr: product.descriptionAr || "",
        tags: product.tags?.join(", ") || "",
        priceLabel: product.priceLabel || "",
        imageUrl: product.imageUrl || "",
        requestUrl: product.requestUrl || "",
        template: (product.template as ProductTemplate) || "standard",
        purchaseLabel: product.purchaseLabel || "",
        purchaseNote: product.purchaseNote || "",
        deliveryType: product.deliveryType || "digital",
        featured: product.featured,
        order: product.order,
        active: product.active,
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setIsDialogOpen(true);
  };

  const productPayload = {
    slug: formData.slug || null,
    title: formData.title,
    description: formData.description,
    titleAr: formData.titleAr || null,
    descriptionAr: formData.descriptionAr || null,
    tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    priceLabel: formData.priceLabel || null,
    imageUrl: formData.imageUrl || null,
    requestUrl: formData.requestUrl || null,
    template: formData.template,
    purchaseLabel: formData.purchaseLabel || null,
    purchaseNote: formData.purchaseNote || null,
    deliveryType: formData.deliveryType || "digital",
    featured: formData.featured,
    order: formData.order,
    active: formData.active,
  };

  const handleImageFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid image", description: "Please choose a PNG, JPG, WEBP, or GIF image.", variant: "destructive" });
      return;
    }
    if (file.size > 2_000_000) {
      toast({ title: "Image too large", description: "Use an image under 2 MB for fast loading.", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({ ...current, imageUrl: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: t.admin.error,
        description: "Product title and description are required.",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      updateProduct.mutate(
        { id: editingId, data: productPayload as any },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
            setIsDialogOpen(false);
            toast({ title: t.admin.productUpdated });
          },
          onError: (error) => {
            toast({
              title: t.admin.error,
              description: error instanceof Error ? error.message : t.admin.apiConnectionError,
              variant: "destructive",
            });
          },
        },
      );
    } else {
      createProduct.mutate(
        { data: productPayload as any },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
            setIsDialogOpen(false);
            toast({ title: t.admin.productCreated });
          },
          onError: (error) => {
            toast({
              title: t.admin.error,
              description: error instanceof Error ? error.message : t.admin.apiConnectionError,
              variant: "destructive",
            });
          },
        },
      );
    }
  };

  const handleDelete = (id: number) => {
    if (confirm(t.admin.deleteProductConfirm)) {
      deleteProduct.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
            toast({ title: t.admin.productDeleted });
          },
        },
      );
    }
  };

  if (isLoading) return <div>{t.common.loading}</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">{t.admin.products}</h1>
          <p className="text-sm text-muted-foreground font-mono">{t.admin.manageProducts}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={openProductsPage}>
            <ExternalLink size={16} />
            {t.admin.viewProductsPage}
          </Button>
          <Button onClick={() => openDialog()}>{t.admin.addProduct}</Button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products?.map((product) => (
          <article key={product.id} className={`relative overflow-hidden rounded-2xl border bg-card transition ${product.active ? "border-border" : "border-destructive/35 opacity-80"}`}>
            {!product.active ? (
              <div className="pointer-events-none absolute right-3 top-3 z-20">
                <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
                  {t.common.inactive}
                </span>
              </div>
            ) : null}
            {product.featured ? (
              <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                <Star size={12} className="fill-current" />
                {t.admin.featured}
              </div>
            ) : null}
            <div className="aspect-video border-b border-border bg-background">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                  <ImagePlus size={34} />
                </div>
              )}
            </div>
            <div className="space-y-4 p-5">
              <div>
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
                  <LayoutTemplate size={12} />
                  {product.template || "standard"}
                </div>
                <h2 className="text-lg font-bold text-foreground">{product.title}</h2>
                {product.titleAr ? <p className="text-sm text-primary/80" dir="rtl">{product.titleAr}</p> : null}
              </div>
              <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{product.description}</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="text-xs text-muted-foreground">
                  <div>{product.priceLabel || t.products.betaShort}</div>
                  {product.slug ? <div className="font-mono">/{product.slug}</div> : null}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openDialog(product)}>{t.common.edit}</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>{t.common.delete}</Button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editingId ? t.admin.editProduct : t.admin.addProduct}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <label className="mb-3 block text-xs font-mono uppercase text-muted-foreground">Product template</label>
              <div className="grid gap-2 sm:grid-cols-5">
                {productTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, template: template.id })}
                    className={`rounded-lg border p-3 text-left transition ${
                      formData.template === template.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/45"
                    }`}
                  >
                    <div className="text-xs font-bold">{template.label}</div>
                    <div className="mt-1 text-[10px] opacity-75">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.titleEn}</label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("title", "titleAr")} disabled={isTranslating || !formData.title.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.titleAr} ({t.common.optional})</label>
                <Input value={formData.titleAr} onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })} dir="rtl" className="text-right" />
                <div className="flex justify-end"><TranslateButton onClick={() => trArToEn("titleAr", "title")} disabled={isTranslating || !formData.titleAr.trim()} label={isTranslating ? "..." : "→ EN"} /></div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">Slug / page URL</label>
                <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="auto-from-title" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">Delivery type</label>
                <Input value={formData.deliveryType} onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })} placeholder="digital / pdf / license" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.descEn}</label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-28" />
                <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("description", "descriptionAr")} disabled={isTranslating || !formData.description.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.descAr} ({t.common.optional})</label>
                <Textarea value={formData.descriptionAr} onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })} dir="rtl" className="min-h-28 text-right" />
                <div className="flex justify-end"><TranslateButton onClick={() => trArToEn("descriptionAr", "description")} disabled={isTranslating || !formData.descriptionAr.trim()} label={isTranslating ? "..." : "→ EN"} /></div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.tags}</label>
                <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder={t.admin.tagsPlaceholder} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.priceLabel}</label>
                <Input value={formData.priceLabel} onChange={(e) => setFormData({ ...formData, priceLabel: e.target.value })} placeholder={t.admin.priceLabelPlaceholder} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.productImage}</label>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder={t.admin.pasteImageUrl} />
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-bold hover:border-primary/45">
                  <Upload size={16} />
                  Upload
                  <input className="hidden" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => handleImageFile(event.target.files?.[0])} />
                </label>
              </div>
              {formData.imageUrl ? (
                <div className="aspect-video overflow-hidden rounded-xl border border-border bg-background">
                  <img src={formData.imageUrl} alt={t.common.imagePreview} className="h-full w-full object-cover" />
                </div>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.requestUrl}</label>
                <Input value={formData.requestUrl} onChange={(e) => setFormData({ ...formData, requestUrl: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">WhatsApp button label</label>
                <Input value={formData.purchaseLabel} onChange={(e) => setFormData({ ...formData, purchaseLabel: e.target.value })} placeholder={t.products.requestProduct} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">WhatsApp order note</label>
                <Textarea value={formData.purchaseNote} onChange={(e) => setFormData({ ...formData, purchaseNote: e.target.value })} className="min-h-24" placeholder="Order through WhatsApp, confirm product name, delivery details..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.common.order}</label>
                <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-muted-foreground">{t.admin.featured}</label>
                <Switch checked={formData.featured} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-muted-foreground">{t.common.active}</label>
                <Switch checked={formData.active} onCheckedChange={(checked) => setFormData({ ...formData, active: checked })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t.common.cancel}</Button>
            <Button onClick={handleSave} disabled={createProduct.isPending || updateProduct.isPending || !formData.title.trim() || !formData.description.trim()}>
              {t.common.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
