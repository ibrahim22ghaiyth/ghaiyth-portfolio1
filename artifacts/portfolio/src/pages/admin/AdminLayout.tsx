import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Briefcase, Code, FolderGit2, Mail, FileText, LogOut,
  Newspaper, PackageCheck, MessageSquareQuote, Menu, X, ExternalLink,
} from "lucide-react";
import { useListMessages } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const navItems = [
  { href: "/admin", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/admin/services", labelKey: "services", icon: Briefcase },
  { href: "/admin/skills", labelKey: "skills", icon: Code },
  { href: "/admin/projects", labelKey: "projects", icon: FolderGit2 },
  { href: "/admin/blog", labelKey: "blog", icon: Newspaper },
  { href: "/admin/products", labelKey: "products", icon: PackageCheck },
  { href: "/admin/testimonials", labelKey: "testimonials", icon: MessageSquareQuote },
  { href: "/admin/messages", labelKey: "messages", icon: Mail },
  { href: "/admin/content", labelKey: "content", icon: FileText },
] as const;

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { t, lang } = useLanguage();
  const { data: messages } = useListMessages();
  const [mobileOpen, setMobileOpen] = useState(false);

  const unreadCount = messages?.filter((m) => m.status === "unread").length || 0;

  const getLabel = (key: string): string => {
    if (key === "testimonials") return lang === "ar" ? "آراء العملاء" : "Testimonials";
    return (t.admin as Record<string, string>)[key] || key;
  };

  const isActive = (href: string) => {
    if (href === "/admin") return location === "/admin";
    return location.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setLocation("/admin/login");
  };

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <item.icon size={18} className="shrink-0" />
            <span className="truncate">{getLabel(item.labelKey)}</span>
            {item.labelKey === "messages" && unreadCount > 0 ? (
              <span className="ms-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {unreadCount}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="dark flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-e border-border bg-card lg:flex">
        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
              IG
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">Admin</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title={lang === "ar" ? "عرض الموقع" : "View site"}
          >
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <NavList />
        </div>

        <div className="border-t border-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={18} />
            {t.admin.logout}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-y-0 start-0 z-50 w-72 border-e border-border bg-card transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
              IG
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">Admin</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>
        <div className="py-4">
          <NavList onNavigate={() => setMobileOpen(false)} />
        </div>
        <div className="absolute bottom-0 start-0 end-0 border-t border-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={18} />
            {t.admin.logout}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold text-foreground">IG Admin</span>
          <div className="ms-auto flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
            >
              <ExternalLink size={16} />
            </a>
            <button
              onClick={handleLogout}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
