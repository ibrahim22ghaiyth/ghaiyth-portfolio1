import { FormEvent, useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { useAuthStore } from "../../store/useAuthStore";
import { api } from "../../lib/api";

export function SettingsPage() {
  const user = useAuthStore((state) => state.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setStatus(null);

    if (newPassword.length < 6) {
      setStatus({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    setSaving(true);
    try {
      await api.put("/auth/password", {
        current_password: currentPassword,
        new_password: newPassword
      });
      setStatus({ type: "ok", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Could not update password.";
      setStatus({ type: "error", text: message });
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-indigo-400";

  return (
    <>
      <PageHeader title="Settings" description="Manage your account and security." />

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-[2rem] border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Account</h2>
          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm font-bold text-slate-500">Name</p>
              <p className="font-black">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Email</p>
              <p className="font-black">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Role</p>
              <p className="font-black">{user?.role}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Change password</h2>
          <form className="mt-5 space-y-3" onSubmit={changePassword}>
            <input
              type="password"
              className={inputClass}
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className={inputClass}
              placeholder="New password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className={inputClass}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {status && (
              <p
                className={
                  status.type === "ok"
                    ? "font-bold text-emerald-600"
                    : "font-bold text-rose-600"
                }
              >
                {status.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-indigo-600 px-5 py-3 font-black text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Update password"}
            </button>
          </form>
        </article>
      </section>
    </>
  );
}
