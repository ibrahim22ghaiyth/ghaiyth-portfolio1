import { useState } from "react";
import { useListSkills, useCreateSkill, useUpdateSkill, useDeleteSkill, getListSkillsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, LoadingState, EmptyState, StatusPill, FormField, DialogShell } from "@/components/admin/shared";

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
    name: "", nameAr: "", percentage: 50, category: "Frontend", order: 0, active: true,
  });

  if (isLoading) return <LoadingState label={t.common.loading} />;

  const openDialog = (skill?: any) => {
    if (skill) {
      setEditingId(skill.id);
      setFormData({
        name: skill.name, nameAr: skill.nameAr || "", percentage: skill.percentage,
        category: skill.category, order: skill.order, active: skill.active,
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
    <div>
      <PageHeader
        title={t.admin.skills}
        subtitle={t.admin.manageSkills}
        action={<Button onClick={() => openDialog()}><Plus size={16} />{t.admin.addSkill}</Button>}
      />

      {!skills?.length ? (
        <EmptyState icon={<Code size={20} />} title={t.admin.skills} description={t.admin.manageSkills} />
      ) : (
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{skill.name}</h3>
                  <StatusPill status={skill.active ? "active" : "inactive"} label={skill.active ? t.common.active : t.common.inactive} />
                </div>
                {skill.nameAr ? <p className="mt-1 text-sm text-muted-foreground" dir="rtl">{skill.nameAr}</p> : null}
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${skill.percentage}%` }} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{skill.percentage}%</span>
                </div>
                <div className="mt-1.5 text-[11px] text-muted-foreground/70">{skill.category}</div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="sm" onClick={() => openDialog(skill)}>{t.common.edit}</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(skill.id)}>{t.common.delete}</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DialogShell
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingId ? t.admin.editSkill : t.admin.addSkill}
        maxWidth="max-w-lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t.common.cancel}</Button>
            <Button onClick={handleSave} disabled={createSkill.isPending || updateSkill.isPending}>{t.common.save}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={t.admin.nameEn}>
            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder={t.admin.skillNamePlaceholder} />
          </FormField>
          <FormField label={t.admin.nameAr} optional={t.common.optional}>
            <Input value={formData.nameAr} onChange={e => setFormData({ ...formData, nameAr: e.target.value })} className="text-right" dir="rtl" placeholder={t.admin.skillNameArPlaceholder} />
          </FormField>
        </div>
        <FormField label={t.admin.category}>
          <Select value={formData.category} onValueChange={val => setFormData({ ...formData, category: val })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Frontend">{t.admin.categoryFrontend}</SelectItem>
              <SelectItem value="Backend">{t.admin.categoryBackend}</SelectItem>
              <SelectItem value="Database">{t.admin.categoryDatabase}</SelectItem>
              <SelectItem value="Other">{t.admin.categoryOther}</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-xs font-medium text-muted-foreground">{t.admin.percentage}</span>
            <span className="text-xs font-medium text-primary">{formData.percentage}%</span>
          </div>
          <Slider value={[formData.percentage]} max={100} step={1} onValueChange={([val]) => setFormData({ ...formData, percentage: val })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={t.common.order}>
            <Input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
          </FormField>
          <FormField label={t.common.active}>
            <Switch checked={formData.active} onCheckedChange={checked => setFormData({ ...formData, active: checked })} />
          </FormField>
        </div>
      </DialogShell>
    </div>
  );
}
