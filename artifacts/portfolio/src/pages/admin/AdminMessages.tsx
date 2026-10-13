import { useState } from "react";
import { useListMessages, useUpdateMessage, useDeleteMessage, getListMessagesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader, LoadingState, EmptyState, StatusPill, DialogShell, FormField } from "@/components/admin/shared";

export function AdminMessages() {
  const { t } = useLanguage();
  const { data: messages, isLoading } = useListMessages();
  const updateMessage = useUpdateMessage();
  const deleteMessage = useDeleteMessage();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedMessage = messages?.find((message) => message.id === selectedId);

  if (isLoading) return <LoadingState label={t.common.loading} />;

  const statusLabel = (status: string) => {
    switch (status) {
      case "unread": return t.admin.unread;
      case "read": return t.admin.read;
      case "replied": return t.admin.replied;
      case "archived": return t.admin.archived;
      default: return status;
    }
  };

  const handleStatusChange = (id: number, status: string) => {
    updateMessage.mutate(
      { id, data: { status } as any },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() }) }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm(t.admin.deleteConfirm)) {
      deleteMessage.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() });
            if (selectedId === id) setSelectedId(null);
          }
        }
      );
    }
  };

  const openMessage = (id: number, status: string) => {
    setSelectedId(id);
    if (status === "unread") handleStatusChange(id, "read");
  };

  return (
    <div>
      <PageHeader title={t.admin.messages} subtitle={t.admin.manageMessages} />

      {!messages?.length ? (
        <EmptyState icon={<Mail size={20} />} title={t.admin.messages} description={t.admin.manageMessages} />
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:gap-4"
              onClick={() => openMessage(msg.id, msg.status)}
            >
              <div className="min-w-0 flex-1 cursor-pointer">
                <div className="flex flex-wrap items-center gap-2">
                  {msg.status === "unread" ? (
                    <MailOpen size={14} className="shrink-0 text-primary" />
                  ) : null}
                  <span className="text-sm font-semibold text-foreground">{msg.name}</span>
                  <StatusPill
                    status={msg.status === "unread" ? "unread" : msg.status === "archived" ? "inactive" : "read"}
                    label={statusLabel(msg.status)}
                  />
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{msg.email}</p>
                <p className="mt-1 line-clamp-1 text-sm text-foreground/80">{msg.subject}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                  {format(new Date(msg.createdAt), "MMM d, yyyy")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Select value={msg.status} onValueChange={(value: any) => handleStatusChange(msg.id, value)}>
                  <SelectTrigger className="h-8 w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unread">{t.admin.unread}</SelectItem>
                    <SelectItem value="read">{t.admin.read}</SelectItem>
                    <SelectItem value="replied">{t.admin.replied}</SelectItem>
                    <SelectItem value="archived">{t.admin.archived}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="destructive" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(msg.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DialogShell
        open={!!selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
        title={t.admin.messageDetails}
        maxWidth="max-w-xl"
      >
        {selectedMessage ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={t.admin.from}>
                <p className="text-sm text-foreground">{selectedMessage.name}</p>
                <p className="text-xs text-muted-foreground">{selectedMessage.email}</p>
              </FormField>
              <FormField label={t.admin.date}>
                <p className="text-sm text-foreground">{format(new Date(selectedMessage.createdAt), "PPP p")}</p>
              </FormField>
            </div>
            <FormField label={t.admin.subject}>
              <p className="text-sm font-medium text-foreground">{selectedMessage.subject}</p>
            </FormField>
            <FormField label={t.admin.message}>
              <div className="whitespace-pre-wrap rounded-lg border border-border bg-background p-4 text-sm leading-6 text-foreground/90">
                {selectedMessage.message}
              </div>
            </FormField>
          </div>
        ) : (
          <p className="py-4 text-sm text-muted-foreground">{t.admin.messageNotFound}</p>
        )}
      </DialogShell>
    </div>
  );
}
