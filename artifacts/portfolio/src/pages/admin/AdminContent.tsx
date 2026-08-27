import { useListContent, useUpdateContent, getListContentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export function AdminContent() {
  const { t } = useLanguage();
  const { data: contentItems, isLoading } = useListContent();
  const updateContent = useUpdateContent();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingValues, setEditingValues] = useState<Record<string, string>>({});

  if (isLoading) return <div>{t.common.loading}</div>;

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.admin.contentManagement}</h1>
        <p className="text-muted-foreground font-mono text-sm">{t.admin.updateContent}</p>
      </div>

      <div className="space-y-6">
        {contentItems?.map((item) => (
          <div key={item.key} className="p-6 rounded-2xl bg-card border border-border space-y-4">
            <label className="text-sm font-mono text-primary uppercase tracking-wider">{item.key}</label>
            <Textarea
              className="bg-background border-border text-foreground min-h-[100px]"
              value={editingValues[item.key] ?? item.value}
              onChange={(e) => setEditingValues({ ...editingValues, [item.key]: e.target.value })}
            />
            <Button
              onClick={() => handleSave(item.key)}
              disabled={editingValues[item.key] === undefined || editingValues[item.key] === item.value}
            >
              {t.admin.saveChanges}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
