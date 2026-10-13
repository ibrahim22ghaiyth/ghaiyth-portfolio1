import { Link, useLocation } from "wouter";
import { LayoutDashboard, Briefcase, Code, FolderGit2, Mail, FileText, LogOut, Newspaper, PackageCheck, MessageSquareQuote } from "lucide-react";
import { useListMessages } from "@workspace/api-client-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { t, lang } = useLanguage();
  const { data: messages } = useListMessages();
  
  const unreadCount = messages?.filter(m => m.status === "unread").length || 0;

  const links = [
    { href: "/admin", label: t.admin.dashboard, icon: LayoutDashboard },
    { href: "/admin/services", label: t.admin.services, icon: Briefcase },
    { href: "/admin/skills", label: t.admin.skills, icon: Code },
    { href: "/admin/projects", label: t.admin.projects, icon: FolderGit2 },
    { href: "/admin/blog", label: t.admin.blog, icon: Newspaper },
    { href: "/admin/products", label: t.admin.products, icon: PackageCheck },
    { href: "/admin/testimonials", label: lang === "ar" ? "آراء العملاء" : "Testimonials", icon: MessageSquareQuote },
    { href: "/admin/messages", label: t.admin.messages, icon: Mail, badge: unreadCount },
    { href: "/admin/content", label: t.admin.content, icon: FileText },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setLocation("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark flex flex-col lg:flex-row">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="font-mono font-bold text-lg text-foreground tracking-wider">{t.admin.brand}</div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground"
          >
            <LogOut size={14} />
            {t.admin.logout}
          </button>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
          {links.map((link) => {
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={cn(
                    "relative flex min-w-max items-center gap-2 rounded-full px-3 py-2 text-xs transition-colors",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "bg-card text-muted-foreground"
                  )}
                >
                  <link.icon size={15} />
                  <span>{link.label}</span>
                  {link.badge && link.badge > 0 ? (
                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                      {link.badge}
                    </span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </nav>
      </header>
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex-col hidden lg:flex">
        <div className="p-6 border-b border-border">
          <div className="font-mono font-bold text-xl text-foreground tracking-wider">{t.admin.brand}</div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  <link.icon size={18} />
                  <span className="text-sm font-medium">{link.label}</span>
                  {link.badge && link.badge > 0 ? (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">{t.admin.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
