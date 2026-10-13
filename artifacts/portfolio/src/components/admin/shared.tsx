import { Loader2, Languages } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/hooks/use-translate";

export function PageHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">{icon}</div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? <p className="max-w-sm text-xs text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

const statusStyles = {
  active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  inactive: "border-red-500/30 bg-red-500/10 text-red-400",
  featured: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  live: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  prototype: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  development: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  unread: "border-sky-500/30 bg-sky-500/10 text-sky-400",
  read: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
} as const;

export function StatusPill({
  status,
  label,
  className,
}: {
  status: keyof typeof statusStyles;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        statusStyles[status] || statusStyles.active,
        className,
      )}
    >
      {label}
    </span>
  );
}

export function FormField({
  label,
  optional,
  children,
  className,
}: {
  label: string;
  optional?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-xs font-medium text-muted-foreground">
        {label}
        {optional ? <span className="text-muted-foreground/60"> ({optional})</span> : null}
      </label>
      {children}
    </div>
  );
}

export function TranslateButton({
  onClick,
  disabled,
  label = "Translate",
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="h-7 gap-1.5 px-2 text-xs text-primary hover:text-primary"
    >
      <Languages size={13} />
      {label}
    </Button>
  );
}

export function BilingualFields({
  enLabel,
  arLabel,
  enPlaceholder,
  arPlaceholder,
  enValue,
  arValue,
  onEnChange,
  onArChange,
  enType = "input",
  arType = "input",
  optional,
}: {
  enLabel: string;
  arLabel: string;
  enPlaceholder?: string;
  arPlaceholder?: string;
  enValue: string;
  arValue: string;
  onEnChange: (v: string) => void;
  onArChange: (v: string) => void;
  enType?: "input" | "textarea";
  arType?: "input" | "textarea";
  optional?: string;
}) {
  const { translate, isTranslating } = useTranslate();

  const handleEnToAr = async () => {
    if (!enValue.trim()) return;
    const result = await translate(enValue, "en", "ar");
    if (result) onArChange(result);
  };

  const handleArToEn = async () => {
    if (!arValue.trim()) return;
    const result = await translate(arValue, "ar", "en");
    if (result) onEnChange(result);
  };

  const renderField = (type: string, value: string, onChange: (v: string) => void, placeholder?: string, dir?: "rtl" | "ltr") => {
    if (type === "textarea") {
      return (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={dir}
          className={dir === "rtl" ? "text-right" : ""}
          rows={3}
        />
      );
    }
    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className={dir === "rtl" ? "text-right" : ""}
      />
    );
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField label={enLabel} optional={optional}>
        {renderField(enType, enValue, onEnChange, enPlaceholder, "ltr")}
        <div className="flex justify-end">
          <TranslateButton
            onClick={handleEnToAr}
            disabled={isTranslating || !enValue.trim()}
            label={isTranslating ? "Translating..." : "→ Arabic"}
          />
        </div>
      </FormField>
      <FormField label={arLabel} optional={optional}>
        {renderField(arType, arValue, onArChange, arPlaceholder, "rtl")}
        <div className="flex justify-end">
          <TranslateButton
            onClick={handleArToEn}
            disabled={isTranslating || !arValue.trim()}
            label={isTranslating ? "Translating..." : "→ English"}
          />
        </div>
      </FormField>
    </div>
  );
}

export function DialogShell({
  open,
  onOpenChange,
  title,
  children,
  footer,
  maxWidth = "max-w-2xl",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto sm:w-auto", maxWidth)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">{children}</div>
        {footer ? <DialogFooter className="gap-2 pt-4">{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}
