import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquareQuote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

type Testimonial = {
  id: number;
  clientName: string;
  clientNameAr?: string | null;
  company: string;
  companyAr?: string | null;
  feedback: string;
  feedbackAr?: string | null;
  projectName?: string | null;
  projectNameAr?: string | null;
  rating: number;
  order: number;
  active: boolean;
};

const emptyForm = {
  clientName: "",
  clientNameAr: "",
  company: "",
  companyAr: "",
  projectName: "",
  projectNameAr: "",
  feedback: "",
  feedbackAr: "",
  rating: 5,
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

export function AdminTestimonials() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const labels = isAr
    ? {
        title: "آراء العملاء",
        subtitle: "إضافة وتعديل آراء العملاء المعروضة بالموقع.",
        add: "إضافة رأي",
        edit: "تعديل الرأي",
        clientName: "اسم العميل بالإنكليزي",
        clientNameAr: "اسم العميل بالعربي",
        company: "الشركة بالإنكليزي",
        companyAr: "الشركة بالعربي",
        project: "المشروع بالإنكليزي",
        projectAr: "المشروع بالعربي",
        feedback: "الرأي بالإنكليزي",
        feedbackAr: "الرأي بالعربي",
        rating: "التقييم",
        saved: "تم حفظ الرأي",
        deleted: "تم حذف الرأي",
        deleteConfirm: "هل تريد حذف هذا الرأي؟",
      }
    : {
        title: "Testimonials",
        subtitle: "Add and edit client feedback shown on the public site.",
        add: "Add Testimonial",
        edit: "Edit Testimonial",
        clientName: "Client name EN",
        clientNameAr: "Client name AR",
        company: "Company EN",
        companyAr: "Company AR",
        project: "Project EN",
        projectAr: "Project AR",
        feedback: "Feedback EN",
        feedbackAr: "Feedback AR",
        rating: "Rating",
        saved: "Testimonial saved",
        deleted: "Testimonial deleted",
        deleteConfirm: "Delete this testimonial?",
      };

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const response = await fetch("/api/admin/testimonials", {
        headers: authHeaders(),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Unable to load testimonials");
      return response.json() as Promise<Testimonial[]>;
    },
  });

  const openDialog = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingId(testimonial.id);
      setFormData({
        clientName: testimonial.clientName,
        clientNameAr: testimonial.clientNameAr || "",
        company: testimonial.company,
        companyAr: testimonial.companyAr || "",
        projectName: testimonial.projectName || "",
        projectNameAr: testimonial.projectNameAr || "",
        feedback: testimonial.feedback,
        feedbackAr: testimonial.feedbackAr || "",
        rating: testimonial.rating,
        order: testimonial.order,
        active: testimonial.active,
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }
    setIsDialogOpen(true);
  };

  const payload = {
    clientName: formData.clientName,
    clientNameAr: formData.clientNameAr || null,
    company: formData.company,
    companyAr: formData.companyAr || null,
    projectName: formData.projectName || null,
    projectNameAr: formData.projectNameAr || null,
    feedback: formData.feedback,
    feedbackAr: formData.feedbackAr || null,
    rating: formData.rating,
    order: formData.order,
    active: formData.active,
  };

  const saveTestimonial = async () => {
    const response = await fetch(editingId ? `/api/admin/testimonials/${editingId}` : "/api/admin/testimonials", {
      method: editingId ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Unable to save testimonial");
    await queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    await queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    setIsDialogOpen(false);
    toast({ title: labels.saved });
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm(labels.deleteConfirm)) return;
    const response = await fetch(`/api/admin/testimonials/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error("Unable to delete testimonial");
    await queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    await queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    toast({ title: labels.deleted });
  };

  if (isLoading) return <div>{isAr ? "جاري التحميل..." : "Loading..."}</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">{labels.title}</h1>
          <p className="text-sm text-muted-foreground font-mono">{labels.subtitle}</p>
        </div>
        <Button onClick={() => openDialog()}>{labels.add}</Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {testimonials?.map((testimonial) => (
          <article key={testimonial.id} className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
            {!testimonial.active ? (
              <span className="absolute right-3 top-3 rounded-full bg-destructive px-2.5 py-1 text-xs font-bold text-destructive-foreground">
                Inactive
              </span>
            ) : null}
            <MessageSquareQuote className="mb-4 text-primary" size={24} />
            <h2 className="text-lg font-bold text-foreground">{testimonial.clientName}</h2>
            {testimonial.clientNameAr ? <p className="text-sm text-primary/80" dir="rtl">{testimonial.clientNameAr}</p> : null}
            <p className="mt-1 text-xs text-muted-foreground">{testimonial.company}</p>
            <p className="mt-4 line-clamp-4 text-sm leading-6 text-muted-foreground">{testimonial.feedback}</p>
            <div className="mt-4 flex gap-1 text-primary">
              {Array.from({ length: testimonial.rating }).map((_, index) => (
                <Star key={index} size={14} className="fill-current" />
              ))}
            </div>
            <div className="mt-5 flex justify-between gap-2 border-t border-border pt-4">
              <Button variant="outline" size="sm" onClick={() => openDialog(testimonial)}>Edit</Button>
              <Button variant="destructive" size="sm" onClick={() => void deleteTestimonial(testimonial.id)}>Delete</Button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editingId ? labels.edit : labels.add}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{labels.clientName}</label>
                <Input value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{labels.clientNameAr}</label>
                <Input value={formData.clientNameAr} onChange={(e) => setFormData({ ...formData, clientNameAr: e.target.value })} dir="rtl" className="text-right" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{labels.company}</label>
                <Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{labels.companyAr}</label>
                <Input value={formData.companyAr} onChange={(e) => setFormData({ ...formData, companyAr: e.target.value })} dir="rtl" className="text-right" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{labels.project}</label>
                <Input value={formData.projectName} onChange={(e) => setFormData({ ...formData, projectName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{labels.projectAr}</label>
                <Input value={formData.projectNameAr} onChange={(e) => setFormData({ ...formData, projectNameAr: e.target.value })} dir="rtl" className="text-right" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{labels.feedback}</label>
                <Textarea value={formData.feedback} onChange={(e) => setFormData({ ...formData, feedback: e.target.value })} className="min-h-32" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{labels.feedbackAr}</label>
                <Textarea value={formData.feedbackAr} onChange={(e) => setFormData({ ...formData, feedbackAr: e.target.value })} dir="rtl" className="min-h-32 text-right" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">{labels.rating}</label>
                <Input type="number" min={1} max={5} value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-muted-foreground">Order</label>
                <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase text-muted-foreground">Active</label>
                <Switch checked={formData.active} onCheckedChange={(checked) => setFormData({ ...formData, active: checked })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => void saveTestimonial()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
