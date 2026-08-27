import { useEffect, useState } from "react";
import { CheckCircle2, Clock, FolderKanban, Flame, ListTodo } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { api } from "../../lib/api";

type Stats = {
  total: number;
  todo: number;
  in_progress: number;
  done: number;
  high_priority: number;
  total_projects: number;
};

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get("/dashboard/stats").then((response) => setStats(response.data.stats));
  }, []);

  const items = [
    { label: "Total Tasks", value: stats?.total ?? 0, icon: ListTodo },
    { label: "In Progress", value: stats?.in_progress ?? 0, icon: Clock },
    { label: "Completed", value: stats?.done ?? 0, icon: CheckCircle2 },
    { label: "High Priority", value: stats?.high_priority ?? 0, icon: Flame },
    { label: "Projects", value: stats?.total_projects ?? 0, icon: FolderKanban }
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your projects, task progress, and high-priority work." />

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <article key={item.label} className="rounded-[2rem] border bg-white p-6 shadow-sm">
            <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
              <item.icon size={22} />
            </div>
            <p className="text-sm font-bold text-slate-500">{item.label}</p>
            <h2 className="mt-2 text-4xl font-black">{item.value}</h2>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-[2rem] border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black">Project Health</h2>
        <p className="mt-2 text-slate-500">This area can be extended with charts and team productivity reports.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="font-bold">Completion Rate</p>
            <div className="mt-4 h-3 rounded-full bg-slate-200">
              <div className="h-3 w-2/3 rounded-full bg-indigo-600" />
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="font-bold">Current Focus</p>
            <p className="mt-2 text-slate-500">High priority tasks and overdue items.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="font-bold">Next Improvement</p>
            <p className="mt-2 text-slate-500">Add team members and comments module.</p>
          </div>
        </div>
      </section>
    </>
  );
}
