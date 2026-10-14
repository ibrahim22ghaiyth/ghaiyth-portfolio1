import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Languages, Newspaper, Star, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslateButton } from "@/components/admin/shared";
import { useTranslate } from "@/hooks/use-translate";
import { apiUrl } from "@/lib/api-base";

type BlogPost = {
  id: number;
  title: string;
  titleAr?: string | null;
  excerpt: string;
  excerptAr?: string | null;
  content: string;
  contentAr?: string | null;
  slug: string;
  category?: string | null;
  categoryAr?: string | null;
  readingMinutes?: number | null;
  coverImageUrl?: string | null;
  tags: string[];
  featured: boolean;
  order: number;
  active: boolean;
  publishedAt: string;
};

const blankForm = {
  title: "",
  titleAr: "",
  excerpt: "",
  excerptAr: "",
  content: "",
  contentAr: "",
  slug: "",
  category: "",
  categoryAr: "",
  readingMinutes: 5,
  coverImageUrl: "",
  tags: "",
  featured: false,
  order: 0,
  active: true,
};

function authHeaders() {
  const token = localStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function toSlug(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `post-${Date.now()}`;
}

export function AdminBlog() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(blankForm);
  const { translate, isTranslating } = useTranslate();

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

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const response = await fetch(apiUrl("/api/admin/blog-posts"), { headers: authHeaders(), cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load blog posts");
      return response.json() as Promise<BlogPost[]>;
    },
  });

  const savePost = useMutation({
    mutationFn: async () => {
      const payload = {
        ...formData,
        slug: formData.slug || toSlug(formData.title),
        titleAr: formData.titleAr || null,
        excerptAr: formData.excerptAr || null,
        contentAr: formData.contentAr || null,
        category: formData.category || null,
        categoryAr: formData.categoryAr || null,
        readingMinutes: Number(formData.readingMinutes) || 5,
        coverImageUrl: formData.coverImageUrl || null,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      };
      const response = await fetch(apiUrl(editingId ? `/api/admin/blog-posts/${editingId}` : "/api/admin/blog-posts"), {
        method: editingId ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || "Unable to save post");
      }
      return response.json() as Promise<BlogPost>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      setIsDialogOpen(false);
      toast({ title: editingId ? t.admin.blogUpdated : t.admin.blogCreated });
    },
    onError: (error) => {
      toast({
        title: t.admin.blogSaveFailed,
        description: error instanceof Error ? error.message : t.admin.apiConnectionError,
        variant: "destructive",
      });
    },
  });

  const deletePost = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(apiUrl(`/api/admin/blog-posts/${id}`), {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!response.ok) throw new Error("Unable to delete post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast({ title: t.admin.blogDeleted });
    },
  });

  const translateMissing = useMutation({
    mutationFn: async () => {
      const response = await fetch(apiUrl("/api/admin/blog-posts/translate-missing"), {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ batchSize: 4 }),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || "Unable to translate posts");
      }
      return response.json() as Promise<{ translated: unknown[]; errors: Array<{ slug: string; error: string }>; remaining: number }>;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      const done = result.translated.length;
      if (result.remaining > 0) {
        toast({
          title: `تمت ترجمة ${done} مقالة`,
          description: `باقي ${result.remaining} مقالة — اضغط الزر مرة أخرى للمتابعة`,
        });
      } else {
        toast({ title: `تمت ترجمة ${done} مقالة` });
      }
    },
    onError: (error) => {
      toast({
        title: t.admin.blogSaveFailed,
        description: error instanceof Error ? error.message : t.admin.apiConnectionError,
        variant: "destructive",
      });
    },
  });

  const missingEnglishCount = posts.filter(
    (post) => post.contentAr && !post.content?.trim(),
  ).length;

  const openDialog = (post?: BlogPost) => {
    if (post) {
      setEditingId(post.id);
      setFormData({
        title: post.title,
        titleAr: post.titleAr || "",
        excerpt: post.excerpt,
        excerptAr: post.excerptAr || "",
        content: post.content || "",
        contentAr: post.contentAr || "",
        slug: post.slug,
        category: post.category || "",
        categoryAr: post.categoryAr || "",
        readingMinutes: post.readingMinutes || 5,
        coverImageUrl: post.coverImageUrl || "",
        tags: post.tags?.join(", ") || "",
        featured: post.featured,
        order: post.order,
        active: post.active,
      });
    } else {
      setEditingId(null);
      setFormData(blankForm);
    }
    setIsDialogOpen(true);
  };

  const handleImageFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: t.admin.chooseImage });
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast({ title: t.admin.imageTooLarge, description: t.admin.imageTooLargeDesc });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setFormData((current) => ({ ...current, coverImageUrl: String(reader.result || "") }));
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return <div>{t.common.loading}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">{t.admin.blog}</h1>
          <p className="text-sm text-muted-foreground font-mono">{t.admin.manageBlog}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {missingEnglishCount > 0 ? (
            <Button
              variant="outline"
              onClick={() => translateMissing.mutate()}
              disabled={translateMissing.isPending}
              className="gap-2"
            >
              <Languages size={15} />
              {translateMissing.isPending ? "..." : `ترجمة المقالات الإنجليزية (${missingEnglishCount})`}
            </Button>
          ) : null}
          <Button onClick={() => openDialog()}>{t.admin.addBlogPost}</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-video bg-background">
              {post.coverImageUrl ? (
                <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-primary">
                  <ImagePlus size={34} />
                </div>
              )}
              {post.featured ? (
                <span className="absolute start-3 top-3 inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                  <Star size={12} /> {t.admin.featured}
                </span>
              ) : null}
              {!post.active ? (
                <span className="absolute end-3 top-3 rounded-md bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
                  {t.common.inactive}
                </span>
              ) : null}
            </div>
            <div className="space-y-3 p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-primary">
                <Newspaper size={14} />
                <span>{post.slug}</span>
                {post.category ? <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">{post.category}</span> : null}
                {post.contentAr && !post.content?.trim() ? (
                  <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">EN ناقص</span>
                ) : null}
              </div>
              <h2 className="text-xl font-bold text-foreground">{post.title}</h2>
              {post.titleAr ? <p className="text-sm text-primary/75" dir="rtl">{post.titleAr}</p> : null}
              <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2">
                {post.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" onClick={() => openDialog(post)}>{t.common.edit}</Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm(t.admin.deleteBlogConfirm)) deletePost.mutate(post.id);
                  }}
                >
                  {t.common.delete}
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-3xl overflow-y-auto border-border bg-card">
          <DialogHeader>
            <DialogTitle>{editingId ? t.admin.editBlogPost : t.admin.addBlogPost}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.titleEn}</label>
                <Input value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} />
                <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("title", "titleAr")} disabled={isTranslating || !formData.title.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.titleAr}</label>
                <Input value={formData.titleAr} onChange={(event) => setFormData({ ...formData, titleAr: event.target.value })} dir="rtl" className="text-right" />
                <div className="flex justify-end"><TranslateButton onClick={() => trArToEn("titleAr", "title")} disabled={isTranslating || !formData.titleAr.trim()} label={isTranslating ? "..." : "→ EN"} /></div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.slug}</label>
              <Input value={formData.slug} onChange={(event) => setFormData({ ...formData, slug: event.target.value })} placeholder={toSlug(formData.title) || "post-slug"} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.categoryEn}</label>
                <Input value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })} />
                <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("category", "categoryAr")} disabled={isTranslating || !formData.category.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.categoryAr}</label>
                <Input value={formData.categoryAr} onChange={(event) => setFormData({ ...formData, categoryAr: event.target.value })} dir="rtl" className="text-right" />
                <div className="flex justify-end"><TranslateButton onClick={() => trArToEn("categoryAr", "category")} disabled={isTranslating || !formData.categoryAr.trim()} label={isTranslating ? "..." : "→ EN"} /></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.readingMinutes}</label>
                <Input type="number" min={1} max={120} value={formData.readingMinutes} onChange={(event) => setFormData({ ...formData, readingMinutes: Number(event.target.value) || 5 })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.excerptEn}</label>
                <Textarea value={formData.excerpt} onChange={(event) => setFormData({ ...formData, excerpt: event.target.value })} className="h-24" />
                <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("excerpt", "excerptAr")} disabled={isTranslating || !formData.excerpt.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.excerptAr}</label>
                <Textarea value={formData.excerptAr} onChange={(event) => setFormData({ ...formData, excerptAr: event.target.value })} className="h-24 text-right" dir="rtl" />
                <div className="flex justify-end"><TranslateButton onClick={() => trArToEn("excerptAr", "excerpt")} disabled={isTranslating || !formData.excerptAr.trim()} label={isTranslating ? "..." : "→ EN"} /></div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.contentEn}</label>
                <Textarea value={formData.content} onChange={(event) => setFormData({ ...formData, content: event.target.value })} className="h-32" />
                <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("content", "contentAr")} disabled={isTranslating || !formData.content.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.contentAr}</label>
                <Textarea value={formData.contentAr} onChange={(event) => setFormData({ ...formData, contentAr: event.target.value })} className="h-32 text-right" dir="rtl" />
                <div className="flex justify-end"><TranslateButton onClick={() => trArToEn("contentAr", "content")} disabled={isTranslating || !formData.contentAr.trim()} label={isTranslating ? "..." : "→ EN"} /></div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.projectImage}</label>
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-5 text-center hover:bg-primary/10">
                <Upload size={22} className="text-primary" />
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.admin.uploadImage}</div>
                  <div className="text-xs text-muted-foreground">{t.admin.uploadHint}</div>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={(event) => handleImageFile(event.target.files?.[0])} />
              </label>
              {formData.coverImageUrl ? (
                <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-background">
                  <img src={formData.coverImageUrl} alt={t.common.imagePreview} className="h-full w-full object-cover" />
                </div>
              ) : null}
              <Input
                value={formData.coverImageUrl}
                onChange={(event) => setFormData({ ...formData, coverImageUrl: event.target.value })}
                placeholder={t.admin.pasteImageUrl}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.admin.tags}</label>
                <Input value={formData.tags} onChange={(event) => setFormData({ ...formData, tags: event.target.value })} placeholder="SEO, Web, Admin" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{t.common.order}</label>
                <Input type="number" value={formData.order} onChange={(event) => setFormData({ ...formData, order: Number(event.target.value) || 0 })} />
              </div>
              <div className="flex items-end gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={formData.featured} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} />
                  {t.admin.featured}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={formData.active} onCheckedChange={(checked) => setFormData({ ...formData, active: checked })} />
                  {t.common.active}
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t.common.cancel}</Button>
            <Button
              onClick={() => savePost.mutate()}
              disabled={savePost.isPending || (!formData.title.trim() && !formData.titleAr.trim()) || (!formData.excerpt.trim() && !formData.excerptAr.trim())}
            >
              {t.common.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
