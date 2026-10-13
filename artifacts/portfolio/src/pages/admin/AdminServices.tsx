import { useState } from "react";
import { useListServices, useCreateService, useUpdateService, useDeleteService, getListServicesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, LoadingState, EmptyState, StatusPill, FormField, DialogShell, BilingualFields } from "@/components/admin/shared";

export function AdminServices() {
  const { t } = useLanguage();
  const { data: services, isLoading } = useListServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "", description: "", titleAr: "", descriptionAr: "",
    icon: "Code2", order: 0, active: true,
  });

  if (isLoading) return <LoadingState label={t.common.loading} />;

  const openDialog = (service?: any) => {
    if (service) {
      setEditingId(service.id);
      setFormData({
        title: service.title, description: service.description,
        titleAr: service.titleAr || "", descriptionAr: service.descriptionAr || "",
        icon: service.icon, order: service.order, active: service.active,
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", description: "", titleAr: "", descriptionAr: "", icon: "Code2", order: 0, active: true });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const payload = { ...formData, titleAr: formData.titleAr || null, descriptionAr: formData.descriptionAr || null };
    if (editingId) {
      updateService.mutate({ id: editingId, data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() }); setIsDialogOpen(false); toast({ title: t.admin.serviceUpdated }); },
      });
    } else {
      createService.mutate({ data: payload }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() }); setIsDialogOpen(false); toast({ title: t.admin.serviceCreated }); },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm(t.admin.deleteServiceConfirm)) {
      deleteService.mutate({ id }, {
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListServicesQueryKey() }); toast({ title: t.admin.serviceDeleted }); },
      });
    }
  };

  return (
    <div>
      <PageHeader
        title={t.admin.services}
        subtitle={t.admin.manageServices}
        action={<Button onClick={() => openDialog()}><Plus size={16} />{t.admin.addService}</Button>}
      />

      {!services?.length ? (
        <EmptyState icon={<Briefcase size={20} />} title={t.admin.services} description={t.admin.manageServices} />
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{service.title}</h3>
                  <StatusPill status={service.active ? "active" : "inactive"} label={service.active ? t.common.active : t.common.off} />
                </div>
                {service.titleAr ? (
                  <p className="mt-1 text-sm text-muted-foreground" dir="rtl">{service.titleAr}</p>
                ) : null}
                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">{service.description}</p>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground/70">
                  <span>{service.icon}</span>
                  <span>#{service.order}</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="sm" onClick={() => openDialog(service)}>{t.common.edit}</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>{t.common.delete}</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DialogShell
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingId ? t.admin.editService : t.admin.addService}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>{t.common.cancel}</Button>
            <Button onClick={handleSave} disabled={createService.isPending || updateService.isPending}>{t.common.save}</Button>
          </>
        }
      >
        <BilingualFields
          enLabel={t.admin.titleEn}
          arLabel={t.admin.titleAr}
          enPlaceholder={t.admin.serviceTitlePlaceholder}
          arPlaceholder={t.admin.serviceTitleArPlaceholder}
          enValue={formData.title}
          arValue={formData.titleAr}
          onEnChange={v => setFormData({ ...formData, title: v })}
          onArChange={v => setFormData({ ...formData, titleAr: v })}
          optional={t.common.optional}
        />
        <BilingualFields
          enLabel={t.admin.descEn}
          arLabel={t.admin.descAr}
          enType="textarea"
          arType="textarea"
          enValue={formData.description}
          arValue={formData.descriptionAr}
          onEnChange={v => setFormData({ ...formData, description: v })}
          onArChange={v => setFormData({ ...formData, descriptionAr: v })}
          optional={t.common.optional}
        />
        <FormField label={t.admin.iconLucide}>
          <Input value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} />
        </FormField>
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
