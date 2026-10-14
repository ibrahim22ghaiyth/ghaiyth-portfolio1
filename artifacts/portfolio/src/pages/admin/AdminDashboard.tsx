import { useListServices, useListSkills, useListProjects, useListMessages } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Code, FolderGit2, Mail, Globe2, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, LoadingState } from "@/components/admin/shared";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiUrl } from "@/lib/api-base";

type AnalyticsSummary = {
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
      const response = await fetch(apiUrl("/api/admin/analytics"), {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Unable to load analytics");
      return response.json() as Promise<AnalyticsSummary>;
    },
    refetchInterval: 30_000,
    retry: 1,
  });

  const unreadMessages = messages?.filter((m) => m.status === "unread").length || 0;

  const stats = [
    { label: t.admin.totalServices, value: services?.length || 0, icon: Briefcase },
    { label: t.admin.totalSkills, value: skills?.length || 0, icon: Code },
    { label: t.admin.totalProjects, value: projects?.length || 0, icon: FolderGit2 },
    { label: t.admin.unreadMessages, value: unreadMessages, icon: Mail },
    { label: t.admin.siteVisits, value: analytics?.totalVisits || 0, icon: Globe2 },
    { label: t.admin.countries, value: analytics?.uniqueCountries || 0, icon: MapPin },
  ];

  return (
    <div>
      <PageHeader
        title={t.admin.dashboard}
        subtitle={t.admin.welcome}
        action={
          <Button variant="outline" size="sm" onClick={() => refetchAnalytics()}>
            <RefreshCw size={14} />
            {t.admin.refreshVisitors}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon size={15} />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold text-foreground">{t.admin.visitorCountries}</h2>
          <div className="space-y-2.5">
            {analyticsLoading ? (
              <LoadingState />
            ) : analyticsError ? (
              <p className="text-sm text-muted-foreground">{t.admin.visitorLoadError}</p>
            ) : analytics?.countries.length ? (
              analytics.countries.map((item) => (
                <div key={item.country} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.country}</span>
                  <span className="font-medium text-primary">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t.admin.noVisits}</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-4 text-sm font-semibold text-foreground">{t.admin.recentVisits}</h2>
          <div className="space-y-2.5">
            {analyticsLoading ? (
              <LoadingState />
            ) : analyticsError ? (
              <p className="text-sm text-muted-foreground">{t.admin.recentVisitsError}</p>
            ) : analytics?.recentVisits.length ? (
              analytics.recentVisits.slice(0, 6).map((visit, index) => (
                <div key={`${visit.createdAt}-${index}`} className="flex items-center justify-between gap-4 text-sm">
                  <span className="truncate text-muted-foreground">{visit.path}</span>
                  <span className="shrink-0 font-medium text-primary">{visit.country}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t.admin.recentVisitsEmpty}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
