import { useState } from "react";
import { useListSkills, useCreateSkill, useUpdateSkill, useDeleteSkill, getListSkillsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export function AdminSkills() {
  const { t } = useLanguage();
  const { data: skills, isLoading } = useListSkills();
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    nameAr: "",
    percentage: 50,
    category: "Frontend",
    order: 0,
    active: true,
  });

  if (isLoading) return <div>{t.common.loading}</div>;

  const openDialog = (skill?: any) => {
    if (skill) {
      setEditingId(skill.id);
      setFormData({
        name: skill.name,
        nameAr: skill.nameAr || "",
        percentage: skill.percentage,
        category: skill.category,
        order: skill.order,
        active: skill.active,
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", nameAr: "", percentage: 50, category: "Frontend", order: 0, active: true });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const payload = { ...formData, nameAr: formData.nameAr || null };
    if (editingId) {
      updateSkill.mutate({ id: editingId, data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() }); setIsDialogOpen(false); toast({ title: t.admin.skillUpdated }); },
      });
    } else {
      createSkill.mutate({ data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() }); setIsDialogOpen(false); toast({ title: t.admin.skillCreated }); },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm(t.admin.deleteSkillConfirm)) {
      deleteSkill.mutate({ id }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListSkillsQueryKey() }); toast({ title: t.admin.skillDeleted }); },
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.admin.skills}</h1>
          <p className="text-muted-foreground font-mono text-sm">{t.admin.manageSkills}</p>
        </div>
        <Button onClick={() => openDialog()}>{t.admin.addSkill}</Button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-xs font-mono text-muted-foreground uppercase">
          <div className="col-span-3">{t.admin.nameEn}</div>
          <div className="col-span-3">{t.admin.nameAr}</div>
          <div className="col-span-2">{t.admin.category}</div>
          <div className="col-span-3">{t.admin.percentage}</div>
          <div className="col-span-1" />
        </div>
        <div className="divide-y divide-border">
          {skills?.map(skill => (
            <div key={skill.id} className="grid grid-cols-12 gap-4 p-4 items-center">
              <div className="col-span-3 font-medium text-foreground">
                {skill.name}
                {!skill.active && <span className="ml-2 text-xs text-red-400 font-normal bg-red-500/10 px-1 rounded">{t.common.inactive}</span>}
              </div>
              <div className="col-span-3 text-muted-foreground text-sm" dir="rtl">{skill.nameAr || <span className="text-muted-foreground/40 italic">-</span>}</div>
              <div className="col-span-2 text-muted-foreground text-sm">{skill.category}</div>
              <div className="col-span-3 flex items-center gap-2">
                <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: `${skill.percentage}%` }} />
                </div>
                <span className="text-xs text-muted-foreground font-mono w-8">{skill.percentage}%</span>
              </div>
              <div className="col-span-1 flex justify-end gap-1">
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={() => openDialog(skill)}>{t.common.edit}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editingId ? t.admin.editSkill : t.admin.addSkill}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.nameEn}</label>
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-background border-border" placeholder={t.admin.skillNamePlaceholder} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.nameAr} ({t.common.optional})</label>
                <Input value={formData.nameAr} onChange={e => setFormData({ ...formData, nameAr: e.target.value })} className="bg-background border-border text-right" dir="rtl" placeholder={t.admin.skillNameArPlaceholder} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.category}</label>
              <Select value={formData.category} onValueChange={val => setFormData({ ...formData, category: val })}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend">{t.admin.categoryFrontend}</SelectItem>
                  <SelectItem value="Backend">{t.admin.categoryBackend}</SelectItem>
                  <SelectItem value="Database">{t.admin.categoryDatabase}</SelectItem>
                  <SelectItem value="Other">{t.admin.categoryOther}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.percentage}</label>
                <span className="text-xs text-primary">{formData.percentage}%</span>
              </div>
              <Slider value={[formData.percentage]} max={100} step={1} onValueChange={([val]) => setFormData({ ...formData, percentage: val })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.common.order}</label>
                <Input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase block">{t.common.active}</label>
                <Switch checked={formData.active} onCheckedChange={checked => setFormData({ ...formData, active: checked })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t.common.cancel}</Button>
            <Button onClick={handleSave} disabled={createSkill.isPending || updateSkill.isPending}>{t.common.save}</Button>
            {editingId ? <Button variant="destructive" onClick={() => handleDelete(editingId)}>{t.common.delete}</Button> : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
