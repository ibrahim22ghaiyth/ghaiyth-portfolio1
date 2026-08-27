import { useState } from "react";
import { useListMessages, useUpdateMessage, useDeleteMessage, getListMessagesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const statusKeys = {
  unread: "unread",
  read: "read",
  replied: "replied",
  archived: "archived",
} as const;

export function AdminMessages() {
  const { t } = useLanguage();
  const { data: messages, isLoading } = useListMessages();
  const updateMessage = useUpdateMessage();
  const deleteMessage = useDeleteMessage();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedMessage = messages?.find((message) => message.id === selectedId);

  if (isLoading) return <div>{t.common.loading}</div>;

  const statusLabel = (status: keyof typeof statusKeys | string) => {
    if (status === "unread") return t.admin.unread;
    if (status === "read") return t.admin.read;
    if (status === "replied") return t.admin.replied;
    if (status === "archived") return t.admin.archived;
    return status;
  };

  const handleStatusChange = (id: number, status: "unread" | "read" | "replied" | "archived") => {
    updateMessage.mutate(
      { id, data: { status } },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() })
      }
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
    if (status === "unread") {
      handleStatusChange(id, "read");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread": return "bg-primary text-primary-foreground";
      case "read": return "bg-secondary text-secondary-foreground";
      case "replied": return "bg-green-500 text-foreground";
      case "archived": return "bg-muted text-muted-foreground";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t.admin.messages}</h1>
        <p className="text-muted-foreground font-mono text-sm">{t.admin.manageMessages}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border text-xs font-mono text-muted-foreground uppercase">
          <div className="col-span-3">{t.admin.sender}</div>
          <div className="col-span-4">{t.admin.subject}</div>
          <div className="col-span-2">{t.admin.date}</div>
          <div className="col-span-2">{t.common.status}</div>
          <div className="col-span-1" />
        </div>
        <div className="divide-y divide-border">
          {messages?.map(msg => (
            <div key={msg.id} className="p-4 hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => openMessage(msg.id, msg.status)}>
              <div className="grid gap-4 md:grid-cols-12 md:items-center">
                <div className="md:col-span-3">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-foreground">{msg.name}</div>
                    <Badge className={`md:hidden ${getStatusColor(msg.status)}`}>{statusLabel(msg.status)}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{msg.email}</div>
                </div>
                <div className="text-sm text-foreground/80 md:col-span-4 md:truncate">{msg.subject}</div>
                <div className="text-xs text-muted-foreground md:col-span-2">
                  {format(new Date(msg.createdAt), "MMM d, yyyy")}
                </div>
                <div className="md:col-span-2" onClick={event => event.stopPropagation()}>
                  <Select value={msg.status} onValueChange={(value: any) => handleStatusChange(msg.id, value)}>
                    <SelectTrigger className="h-9 w-full text-xs border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unread">{t.admin.unread}</SelectItem>
                      <SelectItem value="read">{t.admin.read}</SelectItem>
                      <SelectItem value="replied">{t.admin.replied}</SelectItem>
                      <SelectItem value="archived">{t.admin.archived}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end md:col-span-1" onClick={event => event.stopPropagation()}>
                  <Button variant="destructive" size="sm" className="h-9 w-9 p-0" onClick={() => handleDelete(msg.id)} aria-label={t.common.delete}>
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="sm:max-w-[600px] border-border bg-card text-foreground shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t.admin.messageDetails}</DialogTitle>
          </DialogHeader>
          {selectedMessage ? (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-mono text-muted-foreground uppercase mb-1">{t.admin.from}</div>
                  <div className="text-sm text-foreground">{selectedMessage.name} ({selectedMessage.email})</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-muted-foreground uppercase mb-1">{t.admin.date}</div>
                  <div className="text-sm text-foreground">{format(new Date(selectedMessage.createdAt), "PPP p")}</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-muted-foreground uppercase mb-1">{t.admin.subject}</div>
                <div className="text-sm font-medium text-foreground">{selectedMessage.subject}</div>
              </div>
              <div>
                <div className="text-xs font-mono text-muted-foreground uppercase mb-1">{t.admin.message}</div>
                <div className="text-sm text-foreground/90 whitespace-pre-wrap bg-background p-4 rounded-lg border border-border">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-sm text-foreground/60">
              {t.admin.messageNotFound}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
