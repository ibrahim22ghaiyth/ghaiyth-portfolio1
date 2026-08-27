import { useState } from "react";
import { useListServices, useCreateService, useUpdateService, useDeleteService, getListServicesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

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
    title: "",
    description: "",
    titleAr: "",
    descriptionAr: "",
    icon: "Code2",
    order: 0,
    active: true,
  });

  if (isLoading) return <div>{t.common.loading}</div>;

  const openDialog = (service?: any) => {
    if (service) {
      setEditingId(service.id);
      setFormData({
        title: service.title,
        description: service.description,
        titleAr: service.titleAr || "",
        descriptionAr: service.descriptionAr || "",
        icon: service.icon,
        order: service.order,
        active: service.active,
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", description: "", titleAr: "", descriptionAr: "", icon: "Code2", order: 0, active: true });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      titleAr: formData.titleAr || null,
      descriptionAr: formData.descriptionAr || null,
    };
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.admin.services}</h1>
          <p className="text-muted-foreground font-mono text-sm">{t.admin.manageServices}</p>
        </div>
        <Button onClick={() => openDialog()}>{t.admin.addService}</Button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-xs font-mono text-muted-foreground uppercase">
          <div className="col-span-3">{t.admin.titleEn}</div>
          <div className="col-span-3">{t.admin.titleAr}</div>
          <div className="col-span-2">{t.admin.icon}</div>
          <div className="col-span-1">{t.common.order}</div>
          <div className="col-span-1">{t.common.status}</div>
          <div className="col-span-2" />
        </div>
        <div className="divide-y divide-border">
          {services?.map(service => (
            <div key={service.id} className="grid grid-cols-12 gap-4 p-4 items-center">
              <div className="col-span-3 font-medium text-foreground truncate">{service.title}</div>
              <div className="col-span-3 text-muted-foreground truncate" dir="rtl">{service.titleAr || <span className="text-muted-foreground/40 italic">-</span>}</div>
              <div className="col-span-2 text-muted-foreground">{service.icon}</div>
              <div className="col-span-1 text-muted-foreground">{service.order}</div>
              <div className="col-span-1">
                <span className={`px-2 py-1 rounded text-xs ${service.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                  {service.active ? t.common.active : t.common.off}
                </span>
              </div>
              <div className="col-span-2 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => openDialog(service)}>{t.common.edit}</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>{t.common.delete}</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? t.admin.editService : t.admin.addService}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.titleEn}</label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="bg-background border-border" placeholder={t.admin.serviceTitlePlaceholder} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.titleAr} ({t.common.optional})</label>
                <Input value={formData.titleAr} onChange={e => setFormData({ ...formData, titleAr: e.target.value })} className="bg-background border-border text-right" dir="rtl" placeholder={t.admin.serviceTitleArPlaceholder} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.descEn}</label>
                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.descAr} ({t.common.optional})</label>
                <Textarea value={formData.descriptionAr} onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })} className="bg-background border-border text-right" dir="rtl" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.iconLucide}</label>
              <Input value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="bg-background border-border" />
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
            <Button onClick={handleSave} disabled={createService.isPending || updateService.isPending}>{t.common.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
