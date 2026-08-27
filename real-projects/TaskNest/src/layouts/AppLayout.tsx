import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/settings", label: "Settings", icon: Settings }
];

export function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r bg-white p-6 lg:block">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 font-black text-white">TN</div>
            <div>
              <h1 className="text-xl font-black">TaskNest</h1>
              <p className="text-sm text-slate-500">Task Manager</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold ${
                  isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-slate-100 p-4">
          <p className="font-bold">{user?.name}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <button onClick={handleLogout} className="mt-4 flex items-center gap-2 text-sm font-bold text-red-600">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl p-5 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
