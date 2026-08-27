const getValue = (name: string) => process.env[name]?.trim();

export function getDatabaseUrl() {
  const directUrl =
    getValue("DATABASE_URL") ||
    getValue("DATABASE_PRIVATE_URL") ||
    getValue("DATABASE_PUBLIC_URL") ||
    getValue("POSTGRES_URL") ||
    getValue("POSTGRES_PRIVATE_URL") ||
    getValue("POSTGRES_PUBLIC_URL");

  if (directUrl) return directUrl;

  const host = getValue("PGHOST") || getValue("POSTGRES_HOST");
  const port = getValue("PGPORT") || getValue("POSTGRES_PORT") || "5432";
  const user = getValue("PGUSER") || getValue("POSTGRES_USER");
  const password = getValue("PGPASSWORD") || getValue("POSTGRES_PASSWORD");
  const database = getValue("PGDATABASE") || getValue("POSTGRES_DB");

  if (!host || !user || !password || !database) return "";

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}`;
}
