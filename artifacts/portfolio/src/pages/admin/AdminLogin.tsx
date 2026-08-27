import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function AdminLogin() {
  const { t } = useLanguage();
  const [username, setUsername] = useState("admin");
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

          toast({
            title: t.admin.error,
            description,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground dark p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl bg-card border border-border shadow-2xl"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-foreground">{t.admin.loginTitle}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.username}</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background border-border"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-muted-foreground uppercase">{t.admin.password}</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-border"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-6"
            disabled={login.isPending}
          >
            {login.isPending ? t.admin.loggingIn : t.admin.login}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
