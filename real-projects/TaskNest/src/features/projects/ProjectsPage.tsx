import { FormEvent, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { api } from "../../lib/api";
import type { Project } from "../../types";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function loadProjects() {
    const response = await api.get("/projects");
    setProjects(response.data.projects);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function createProject(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;

    await api.post("/projects", {
      name,
      description,
      color: "#4f46e5",
      status: "active"
    });

    setName("");
    setDescription("");
    loadProjects();
  }

  async function deleteProject(id: number) {
    await api.delete(`/projects/${id}`);
    loadProjects();
  }

  return (
    <>
      <PageHeader title="Projects" description="Create and manage project spaces for your tasks." />

      <form onSubmit={createProject} className="mb-8 grid gap-3 rounded-[2rem] border bg-white p-5 shadow-sm md:grid-cols-[1fr_1.4fr_auto]">
        <input className="rounded-2xl border p-4 outline-none focus:border-indigo-500" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="rounded-2xl border p-4 outline-none focus:border-indigo-500" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 font-black text-white">
          <Plus size={18} /> Add
        </button>
      </form>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article key={project.id} className="rounded-[2rem] border bg-white p-6 shadow-sm">
            <div className="mb-5 h-2 w-20 rounded-full" style={{ background: project.color }} />
            <h2 className="text-2xl font-black">{project.name}</h2>
            <p className="mt-2 min-h-12 text-slate-500">{project.description}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Tasks</p>
                <p className="text-2xl font-black">{project.task_count ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Done</p>
                <p className="text-2xl font-black">{project.done_count ?? 0}</p>
              </div>
            </div>
            <button onClick={() => deleteProject(project.id)} className="mt-5 rounded-xl text-sm font-bold text-red-600">
              Delete Project
            </button>
          </article>
        ))}
      </section>
    </>
  );
}
