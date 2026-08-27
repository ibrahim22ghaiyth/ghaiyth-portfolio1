import { useListServices, useListSkills, useListProjects, useListMessages } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Code, FolderGit2, Mail, Globe2, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

type AnalyticsSummary = {
  storageMode?: "database" | "memory";
  totalVisits: number;
  uniqueCountries: number;
  countries: { country: string; count: number }[];
  recentVisits: { country: string; path: string; createdAt: string }[];
};

export function AdminDashboard() {
  const { t } = useLanguage();
  const { data: services } = useListServices();
  const { data: skills } = useListSkills();
  const { data: projects } = useListProjects();
  const { data: messages } = useListMessages();
  const {
    data: analytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/admin/analytics", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Unable to load analytics");
      return response.json() as Promise<AnalyticsSummary>;
    },
    refetchInterval: 30_000,
    retry: 1,
  });

  const unreadMessages = messages?.filter(m => m.status === "unread").length || 0;

  const stats = [
    { label: t.admin.totalServices, value: services?.length || 0, icon: Briefcase },
    { label: t.admin.totalSkills, value: skills?.length || 0, icon: Code },
    { label: t.admin.totalProjects, value: projects?.length || 0, icon: FolderGit2 },
    { label: t.admin.unreadMessages, value: unreadMessages, icon: Mail },
    { label: t.admin.siteVisits, value: analytics?.totalVisits || 0, icon: Globe2 },
    { label: t.admin.countries, value: analytics?.uniqueCountries || 0, icon: MapPin },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t.admin.dashboard}</h1>
            <p className="text-muted-foreground font-mono text-sm">{t.admin.welcome}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchAnalytics()}
            className="w-full sm:w-auto"
          >
            <RefreshCw size={16} />
            {t.admin.refreshVisitors}
          </Button>
        </div>
      </div>

      {analytics?.storageMode === "memory" ? (
        <div className="rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">
          {t.admin.temporaryAnalytics}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-card border border-border flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground font-mono text-sm uppercase">{stat.label}</span>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <stat.icon size={18} />
              </div>
            </div>
            <div className="text-4xl font-bold text-foreground mt-auto">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">{t.admin.visitorCountries}</h2>
          <div className="space-y-3">
            {analyticsLoading ? (
              <p className="text-sm text-muted-foreground">{t.admin.loadingVisitors}</p>
            ) : analyticsError ? (
              <p className="text-sm text-red-400">{t.admin.visitorLoadError}</p>
            ) : analytics?.countries.length ? analytics.countries.map((item) => (
              <div key={item.country} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.country}</span>
                <span className="font-mono text-primary">{item.count}</span>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">{t.admin.noVisits}</p>
            )}
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">{t.admin.recentVisits}</h2>
          <div className="space-y-3">
            {analyticsLoading ? (
              <p className="text-sm text-muted-foreground">{t.admin.loadingRecentVisits}</p>
            ) : analyticsError ? (
              <p className="text-sm text-red-400">{t.admin.recentVisitsError}</p>
            ) : analytics?.recentVisits.length ? analytics.recentVisits.slice(0, 6).map((visit, index) => (
              <div key={`${visit.createdAt}-${index}`} className="flex items-center justify-between gap-4 text-sm">
                <span className="truncate text-muted-foreground">{visit.path}</span>
                <span className="shrink-0 font-mono text-primary">{visit.country}</span>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">{t.admin.recentVisitsEmpty}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
