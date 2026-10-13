import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function AdminLogin() {
  const { t, lang } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { data: { username, password } },
      {
        onSuccess: (data) => {
          localStorage.setItem("admin_token", data.token);
          setLocation("/admin");
        },
        onError: (error) => {
          const status = "status" in error ? error.status : undefined;
          const description =
            status === 401
              ? t.admin.invalidCredentials
              : error instanceof Error
                ? error.message
                : t.admin.apiConnectionError;
          toast({ title: t.admin.error, description, variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <ShieldCheck size={28} className="text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">{t.admin.loginTitle}</h1>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-username" className="text-xs font-medium text-muted-foreground">
                {t.admin.username}
              </label>
              <Input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="text-xs font-medium text-muted-foreground">
                {t.admin.password}
              </label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? t.admin.loggingIn : t.admin.login}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link
            href={lang === "ar" ? "/" : "/en"}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={12} />
            {lang === "ar" ? "العودة للموقع" : "Back to site"}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
