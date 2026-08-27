import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { api } from "../../lib/api";
import type { Project, Task } from "../../types";

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState<number | "">("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  async function load() {
    const [tasksResponse, projectsResponse] = await Promise.all([
      api.get("/tasks"),
      api.get("/projects")
    ]);

    setTasks(tasksResponse.data.tasks);
    setProjects(projectsResponse.data.projects);
    if (!projectId && projectsResponse.data.projects[0]) {
      setProjectId(projectsResponse.data.projects[0].id);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createTask(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !projectId) return;

    await api.post("/tasks", {
      title,
      project_id: Number(projectId),
      priority,
      status: "todo",
      description: ""
    });

    setTitle("");
    load();
  }

  async function updateStatus(task: Task, status: Task["status"]) {
    await api.put(`/tasks/${task.id}`, { status });
    load();
  }

  async function deleteTask(id: number) {
    await api.delete(`/tasks/${id}`);
    load();
  }

  const columns: { key: Task["status"]; title: string }[] = [
    { key: "todo", title: "To Do" },
    { key: "in_progress", title: "In Progress" },
    { key: "done", title: "Done" }
  ];

  return (
    <>
      <PageHeader title="Tasks" description="Create, filter, and update your task workflow." />

      <form onSubmit={createTask} className="mb-8 grid gap-3 rounded-[2rem] border bg-white p-5 shadow-sm lg:grid-cols-[1fr_220px_180px_auto]">
        <input className="rounded-2xl border p-4 outline-none focus:border-indigo-500" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select className="rounded-2xl border p-4 outline-none focus:border-indigo-500" value={projectId} onChange={(e) => setProjectId(Number(e.target.value))}>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
        <select className="rounded-2xl border p-4 outline-none focus:border-indigo-500" value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="rounded-2xl bg-indigo-600 px-6 font-black text-white">Add Task</button>
      </form>

      <section className="grid gap-5 xl:grid-cols-3">
        {columns.map((column) => (
          <div key={column.key} className="rounded-[2rem] border bg-white p-5 shadow-sm">
            <h2 className="mb-5 text-xl font-black">{column.title}</h2>
            <div className="space-y-4">
              {tasks.filter((task) => task.status === column.key).map((task) => (
                <article key={task.id} className="rounded-2xl border bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-black">{task.title}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${
                      task.priority === "high" ? "bg-red-100 text-red-700" :
                      task.priority === "medium" ? "bg-amber-100 text-amber-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>{task.priority}</span>
                  </div>
                  <p className="text-sm text-slate-500">{task.project_name}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => updateStatus(task, "todo")} className="rounded-xl bg-white px-3 py-2 text-xs font-bold">Todo</button>
                    <button onClick={() => updateStatus(task, "in_progress")} className="rounded-xl bg-white px-3 py-2 text-xs font-bold">Progress</button>
                    <button onClick={() => updateStatus(task, "done")} className="rounded-xl bg-white px-3 py-2 text-xs font-bold">Done</button>
                    <button onClick={() => deleteTask(task.id)} className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600">Delete</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
