import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuthStore } from "../../store/useAuthStore";

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await api.post("/auth/register", { name, email, password });
    setAuth(response.data.user, response.data.token);
    navigate("/");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-5">
      <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-black">Create Account</h1>
        <p className="mt-2 text-slate-500">Start managing projects and tasks.</p>

        <label className="mb-2 mt-6 block text-sm font-bold">Name</label>
        <input className="mb-4 w-full rounded-2xl border p-4 outline-none focus:border-indigo-500" value={name} onChange={(e) => setName(e.target.value)} />

        <label className="mb-2 block text-sm font-bold">Email</label>
        <input className="mb-4 w-full rounded-2xl border p-4 outline-none focus:border-indigo-500" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="mb-2 block text-sm font-bold">Password</label>
        <input type="password" className="mb-5 w-full rounded-2xl border p-4 outline-none focus:border-indigo-500" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="w-full rounded-2xl bg-indigo-600 p-4 font-black text-white">Create Account</button>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have account? <Link className="font-bold text-indigo-600" to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
