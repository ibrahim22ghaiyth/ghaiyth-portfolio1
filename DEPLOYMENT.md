# Deployment Notes

This project must run with a persistent PostgreSQL database in production.

Required Railway variable:

```text
DATABASE_URL
```

Without `DATABASE_URL`, the site can still run, but admin changes use temporary
memory storage. Messages, project edits, services, skills, and visitor analytics
will be lost after every redeploy or restart.

On Railway:

1. Add a PostgreSQL database to the project.
2. Make sure the portfolio service has access to `DATABASE_URL`.
3. Redeploy the portfolio service.

The build command runs `scripts/ensure-db.mjs`, which syncs the database schema
before building the production app whenever `DATABASE_URL` is available.
