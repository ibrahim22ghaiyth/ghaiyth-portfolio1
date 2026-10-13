import { useState } from "react";
import { useListProjects, useCreateProject, useUpdateProject, useDeleteProject, getListProjectsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslateButton } from "@/components/admin/shared";
import { useTranslate } from "@/hooks/use-translate";
import { ExternalLink, Github, ImagePlus, Star, Upload } from "lucide-react";

export function AdminProjects() {
  const { t } = useLanguage();
  const { data: projects, isLoading } = useListProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const queryClient = useQueryClient();
  const { toast } = useToast();
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [techStackInput, setTechStackInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    titleAr: "",
    descriptionAr: "",
    techStack: [] as string[],
    liveUrl: "",
    githubUrl: "",
    imageUrl: "",
    featured: false,
    order: 0,
    active: true,
    status: "live",
    imageAltEn: "",
    imageAltAr: "",
    audienceEn: "",
    audienceAr: "",
    roleEn: "",
    roleAr: "",
    problemEn: "",
    problemAr: "",
    solutionEn: "",
    solutionAr: "",
    stackDescEn: "",
    stackDescAr: "",
    outcomeEn: "",
    outcomeAr: "",
  });

  if (isLoading) return <div>{t.common.loading}</div>;

  const openDialog = (project?: any) => {
    if (project) {
      setEditingId(project.id);
      setTechStackInput(project.techStack?.join(", ") || "");
      setFormData({
        title: project.title,
        description: project.description,
        titleAr: project.titleAr || "",
        descriptionAr: project.descriptionAr || "",
        techStack: project.techStack || [],
        liveUrl: project.liveUrl || "",
        githubUrl: project.githubUrl || "",
        imageUrl: project.imageUrl || "",
        featured: project.featured,
        order: project.order,
        active: project.active,
        status: project.status || "live",
        imageAltEn: project.imageAltEn || "",
        imageAltAr: project.imageAltAr || "",
        audienceEn: project.audienceEn || "",
        audienceAr: project.audienceAr || "",
        roleEn: project.roleEn || "",
        roleAr: project.roleAr || "",
        problemEn: project.problemEn || "",
        problemAr: project.problemAr || "",
        solutionEn: project.solutionEn || "",
        solutionAr: project.solutionAr || "",
        stackDescEn: project.stackDescEn || "",
        stackDescAr: project.stackDescAr || "",
        outcomeEn: project.outcomeEn || "",
        outcomeAr: project.outcomeAr || "",
      });
    } else {
      setEditingId(null);
      setTechStackInput("");
      setFormData({ title: "", description: "", titleAr: "", descriptionAr: "", techStack: [], liveUrl: "", githubUrl: "", imageUrl: "", featured: false, order: 0, active: true, status: "live", imageAltEn: "", imageAltAr: "", audienceEn: "", audienceAr: "", roleEn: "", roleAr: "", problemEn: "", problemAr: "", solutionEn: "", solutionAr: "", stackDescEn: "", stackDescAr: "", outcomeEn: "", outcomeAr: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const processedData = {
      ...formData,
      techStack: techStackInput.split(",").map(item => item.trim()).filter(Boolean),
      titleAr: formData.titleAr || null,
      descriptionAr: formData.descriptionAr || null,
    };
    if (editingId) {
      updateProject.mutate({ id: editingId, data: processedData }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() }); setIsDialogOpen(false); toast({ title: t.admin.projectUpdated }); },
      });
    } else {
      createProject.mutate({ data: processedData }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() }); setIsDialogOpen(false); toast({ title: t.admin.projectCreated }); },
      });
    }
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
    reader.onload = () => {
      setFormData({ ...formData, imageUrl: String(reader.result || "") });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (id: number) => {
    if (confirm(t.admin.deleteProjectConfirm)) {
      deleteProject.mutate({ id }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() }); toast({ title: t.admin.projectDeleted }); },
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.admin.projects}</h1>
          <p className="text-muted-foreground font-mono text-sm">{t.admin.manageProjects}</p>
        </div>
        <Button onClick={() => openDialog()}>{t.admin.addProject}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects?.map(project => (
          <div key={project.id} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col group relative">
            {!project.active && (
              <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center pointer-events-none">
                <span className="bg-red-500 text-foreground px-3 py-1 rounded text-sm font-bold uppercase tracking-widest shadow-xl">{t.common.inactive}</span>
              </div>
            )}
            {project.featured && (
              <div className="absolute top-2 left-2 z-20 bg-primary text-foreground text-xs px-2 py-1 rounded-md flex items-center gap-1">
                <Star size={12} className="fill-white" /> {t.admin.featured}
              </div>
            )}

            <div className="relative aspect-video overflow-hidden border-b border-border bg-background">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-blue-500/10">
                  <ImagePlus className="text-primary/70" size={34} />
                </div>
              )}
            </div>
            <div className="p-5 sm:p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-bold text-foreground mb-1">{project.title}</h3>
              {project.titleAr && <p className="text-sm text-primary/70 mb-2" dir="rtl">{project.titleAr}</p>}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack?.slice(0, 3).map((tech: string, index: number) => (
                  <span key={index} className="text-xs bg-muted/50 px-2 py-1 rounded text-foreground/70">{tech}</span>
                ))}
                {project.techStack?.length > 3 && (
                  <span className="text-xs bg-muted/50 px-2 py-1 rounded text-foreground/70">+{project.techStack.length - 3}</span>
                )}
              </div>

              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border">
                {project.githubUrl && <Github size={16} className="text-muted-foreground" />}
                {project.liveUrl && <ExternalLink size={16} className="text-muted-foreground" />}
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="sm" className="h-8" onClick={() => openDialog(project)}>{t.common.edit}</Button>
                  <Button variant="destructive" size="sm" className="h-8" onClick={() => handleDelete(project.id)}>{t.common.delete}</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? t.admin.editProject : t.admin.addProject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.titleEn}</label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="bg-background border-border" />
                <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("title", "titleAr")} disabled={isTranslating || !formData.title.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.titleAr} ({t.common.optional})</label>
                <Input value={formData.titleAr} onChange={e => setFormData({ ...formData, titleAr: e.target.value })} className="bg-background border-border text-right" dir="rtl" />
                <div className="flex justify-end"><TranslateButton onClick={() => trArToEn("titleAr", "title")} disabled={isTranslating || !formData.titleAr.trim()} label={isTranslating ? "..." : "→ EN"} /></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.descEn}</label>
                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-background border-border h-24" />
                <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("description", "descriptionAr")} disabled={isTranslating || !formData.description.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.descAr} ({t.common.optional})</label>
                <Textarea value={formData.descriptionAr} onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })} className="bg-background border-border h-24 text-right" dir="rtl" />
                <div className="flex justify-end"><TranslateButton onClick={() => trArToEn("descriptionAr", "description")} disabled={isTranslating || !formData.descriptionAr.trim()} label={isTranslating ? "..." : "→ EN"} /></div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.techStack}</label>
              <Input value={techStackInput} onChange={e => setTechStackInput(e.target.value)} placeholder={t.admin.techStackPlaceholder} className="bg-background border-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.liveUrl}</label>
                <Input value={formData.liveUrl} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.githubUrl}</label>
                <Input value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} className="bg-background border-border" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.projectImage}</label>
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-5 text-center transition-colors hover:bg-primary/10">
                <Upload size={22} className="text-primary" />
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.admin.uploadImage}</div>
                  <div className="text-xs text-muted-foreground">{t.admin.uploadHint}</div>
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/*"
                  className="hidden"
                  onChange={(event) => handleImageFile(event.target.files?.[0])}
                />
              </label>
              {formData.imageUrl ? (
                <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-background">
                  <img src={formData.imageUrl} alt={t.common.imagePreview} className="h-full w-full object-cover" />
                </div>
              ) : null}
              <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {t.admin.pasteUrl}
                <span className="h-px flex-1 bg-border" />
              </div>
              <Input
                value={formData.imageUrl}
                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder={t.admin.pasteImageUrl}
                className="bg-background border-border"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.common.order}</label>
                <Input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase block">{t.admin.featured}</label>
                <Switch checked={formData.featured} onCheckedChange={checked => setFormData({ ...formData, featured: checked })} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase block">{t.common.active}</label>
                <Switch checked={formData.active} onCheckedChange={checked => setFormData({ ...formData, active: checked })} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">الحالة / Status</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                <option value="live">منشور / Live</option>
                <option value="prototype">نموذج أولي / Prototype</option>
                <option value="development">قيد التطوير / Development</option>
              </select>
            </div>
            <div className="border-t border-border pt-4">
              <p className="mb-3 text-sm font-semibold text-foreground">تفاصيل دراسة الحالة / Case Study Details</p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">وصف الصورة (إنكليزي)</label>
                    <Input value={formData.imageAltEn} onChange={e => setFormData({ ...formData, imageAltEn: e.target.value })} className="bg-background border-border" />
                    <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("imageAltEn", "imageAltAr")} disabled={isTranslating || !formData.imageAltEn.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">وصف الصورة (عربي)</label>
                    <Input value={formData.imageAltAr} onChange={e => setFormData({ ...formData, imageAltAr: e.target.value })} className="bg-background border-border text-right" dir="rtl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">الفئة المستهدفة (إنكليزي)</label>
                    <Textarea value={formData.audienceEn} onChange={e => setFormData({ ...formData, audienceEn: e.target.value })} className="bg-background border-border h-20" />
                    <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("audienceEn", "audienceAr")} disabled={isTranslating || !formData.audienceEn.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">الفئة المستهدفة (عربي)</label>
                    <Textarea value={formData.audienceAr} onChange={e => setFormData({ ...formData, audienceAr: e.target.value })} className="bg-background border-border h-20 text-right" dir="rtl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">الدور (إنكليزي)</label>
                    <Textarea value={formData.roleEn} onChange={e => setFormData({ ...formData, roleEn: e.target.value })} className="bg-background border-border h-20" />
                    <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("roleEn", "roleAr")} disabled={isTranslating || !formData.roleEn.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">الدور (عربي)</label>
                    <Textarea value={formData.roleAr} onChange={e => setFormData({ ...formData, roleAr: e.target.value })} className="bg-background border-border h-20 text-right" dir="rtl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">المشكلة (إنكليزي)</label>
                    <Textarea value={formData.problemEn} onChange={e => setFormData({ ...formData, problemEn: e.target.value })} className="bg-background border-border h-20" />
                    <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("problemEn", "problemAr")} disabled={isTranslating || !formData.problemEn.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">المشكلة (عربي)</label>
                    <Textarea value={formData.problemAr} onChange={e => setFormData({ ...formData, problemAr: e.target.value })} className="bg-background border-border h-20 text-right" dir="rtl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">الحل (إنكليزي)</label>
                    <Textarea value={formData.solutionEn} onChange={e => setFormData({ ...formData, solutionEn: e.target.value })} className="bg-background border-border h-20" />
                    <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("solutionEn", "solutionAr")} disabled={isTranslating || !formData.solutionEn.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">الحل (عربي)</label>
                    <Textarea value={formData.solutionAr} onChange={e => setFormData({ ...formData, solutionAr: e.target.value })} className="bg-background border-border h-20 text-right" dir="rtl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">التقنيات - وصف (إنكليزي)</label>
                    <Textarea value={formData.stackDescEn} onChange={e => setFormData({ ...formData, stackDescEn: e.target.value })} className="bg-background border-border h-16" />
                    <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("stackDescEn", "stackDescAr")} disabled={isTranslating || !formData.stackDescEn.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">التقنيات - وصف (عربي)</label>
                    <Textarea value={formData.stackDescAr} onChange={e => setFormData({ ...formData, stackDescAr: e.target.value })} className="bg-background border-border h-16 text-right" dir="rtl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">النتيجة (إنكليزي)</label>
                    <Textarea value={formData.outcomeEn} onChange={e => setFormData({ ...formData, outcomeEn: e.target.value })} className="bg-background border-border h-20" />
                    <div className="flex justify-end"><TranslateButton onClick={() => trEnToAr("outcomeEn", "outcomeAr")} disabled={isTranslating || !formData.outcomeEn.trim()} label={isTranslating ? "..." : "→ عربي"} /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase">النتيجة (عربي)</label>
                    <Textarea value={formData.outcomeAr} onChange={e => setFormData({ ...formData, outcomeAr: e.target.value })} className="bg-background border-border h-20 text-right" dir="rtl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t.common.cancel}</Button>
            <Button onClick={handleSave} disabled={createProject.isPending || updateProject.isPending}>{t.common.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
