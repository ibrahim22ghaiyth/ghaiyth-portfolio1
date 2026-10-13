import { useListContent, useUpdateContent, getListContentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, LoadingState, EmptyState, FormField } from "@/components/admin/shared";

export function AdminContent() {
  const { t } = useLanguage();
  const { data: contentItems, isLoading } = useListContent();
  const updateContent = useUpdateContent();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});

  if (isLoading) return <LoadingState label={t.common.loading} />;

  const handleSave = (key: string) => {
    const value = editingValues[key];
    if (value === undefined) return;
    updateContent.mutate(
      { key, data: { value } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListContentQueryKey() });
          toast({ title: t.admin.contentUpdated });
        },
      }
    );
  };

  return (
    <div>
      <PageHeader title={t.admin.contentManagement} subtitle={t.admin.updateContent} />

      {!contentItems?.length ? (
        <EmptyState icon={<FileText size={20} />} title={t.admin.contentManagement} description={t.admin.updateContent} />
      ) : (
        <div className="space-y-4">
          {contentItems.map((item) => (
            <div key={item.key} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <FormField label={item.key}>
                <Textarea
                  value={editingValues[item.key] ?? item.value}
                  onChange={(e) => setEditingValues({ ...editingValues, [item.key]: e.target.value })}
                  rows={4}
                />
              </FormField>
              <div className="mt-3 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => handleSave(item.key)}
                  disabled={editingValues[item.key] === undefined || editingValues[item.key] === item.value}
                >
                  {t.admin.saveChanges}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
