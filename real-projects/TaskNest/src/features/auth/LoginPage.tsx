import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/useAuthStore";

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("ibrahim@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      setAuth(response.data.user, response.data.token);
      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-5">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="mb-8">
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-indigo-600 font-black text-white">TN</div>
          <h1 className="text-3xl font-black">Login to TaskNest</h1>
          <p className="mt-2 text-slate-500">Full-stack task manager with server and database.</p>
        </div>

        {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</div>}

        <label className="mb-2 block text-sm font-bold">Email</label>
        <input className="mb-4 w-full rounded-2xl border p-4 outline-none focus:border-indigo-500" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="mb-2 block text-sm font-bold">Password</label>
        <input type="password" className="mb-5 w-full rounded-2xl border p-4 outline-none focus:border-indigo-500" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="w-full rounded-2xl bg-indigo-600 p-4 font-black text-white">Login</button>

        <p className="mt-5 text-center text-sm text-slate-500">
          No account? <Link className="font-bold text-indigo-600" to="/register">Create one</Link>
        </p>
      </form>
    </main>
  );
}
