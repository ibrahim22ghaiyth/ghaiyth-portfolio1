import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import router from "./routes";
import { logger } from "./lib/logger";
import { clientTemplatePath, getPublicSeoPage, publicOrigin, publicSitemapXml, redirectArPath, renderPublicPage } from "./seo/public-pages";

const app: Express = express();
const isProduction = process.env.NODE_ENV === "production";
const indexNowKey = "3b56f74b2f2a4f14b799e1b6c9b0e6d7";

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.set("trust proxy", 1);
app.use((req, res, next) => {
  if (!isProduction) {
    next();
    return;
  }

  const host = req.hostname;
  const proto = req.get("x-forwarded-proto") || req.protocol;
  const isCustomDomain = host === "ibrahimig.com" || host === "www.ibrahimig.com";
  const needsWww = host === "ibrahimig.com";
  const needsHttps = proto !== "https";

  if (isCustomDomain && (needsWww || needsHttps)) {
    res.redirect(301, `https://www.ibrahimig.com${req.originalUrl}`);
    return;
  }

  next();
});
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "blob:", "https:"],
        "font-src": ["'self'", "data:"],
        "connect-src": ["'self'", "https://wa.me", "https://api.github.com"],
        "frame-ancestors": ["'none'"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    hsts: isProduction
      ? {
          maxAge: 15552000,
          includeSubDomains: true,
          preload: false,
        }
      : false,
  }),
);
app.use((_req, res, next) => {
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self)");
  next();
});
app.use(
  cors({
    origin: isProduction ? [/^https:\/\/([a-z0-9-]+\.)?ibrahimig\.com$/i] : true,
    credentials: false,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(
  "/api/admin",
  rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 120,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(
  "/api/auth/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(
  "/api/messages",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use("/api", router);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(moduleDir, "../../portfolio/dist/public");

if (existsSync(clientDistPath)) {
  const templatePath = clientTemplatePath(clientDistPath);

  app.get("/sitemap.xml", (_req, res) => {
    res.type("application/xml").send(publicSitemapXml());
  });

  app.get(`/${indexNowKey}.txt`, (_req, res) => {
    res.type("text/plain").send(indexNowKey);
  });

  app.get(/^\/ar(?:\/.*)?$/, (req, res) => {
    const target = redirectArPath(req.path) || "/";
    res.redirect(301, `${publicOrigin()}${target === "/" ? "/" : target}`);
  });

  app.get(["/", "/products", "/blog", "/en", "/en/products", "/en/blog"], (req, res) => {
    const page = getPublicSeoPage(req.path);
    if (page) {
      res.type("html").send(renderPublicPage(templatePath, page));
      return;
    }

    res.sendFile(path.join(clientDistPath, "index.html"));
  });

  app.get(/^\/en\/.+$/, (req, res) => {
    const page = getPublicSeoPage(req.path);
    if (page) {
      res.type("html").send(renderPublicPage(templatePath, page));
      return;
    }

    res.sendFile(path.join(clientDistPath, "index.html"));
  });

  app.get(/^\/blog\/.+$/, (req, res) => {
    const page = getPublicSeoPage(req.path);
    if (page) {
      res.type("html").send(renderPublicPage(templatePath, page));
      return;
    }

    res.sendFile(path.join(clientDistPath, "index.html"));
  });

  app.use(
    "/assets",
    express.static(path.join(clientDistPath, "assets"), {
      immutable: true,
      maxAge: "1y",
    }),
  );
  app.use(
    express.static(clientDistPath, {
      index: false,
      setHeaders(res, filePath) {
        if (/\.(?:png|jpe?g|webp|gif|svg|ico|woff2?|ttf|pdf)$/i.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=604800");
        }
      },
    }),
  );
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  logger.error({ err }, "Unhandled request error");

  const rawStatus =
    typeof err === "object" && err !== null && "status" in err ? Number((err as { status?: unknown }).status) : NaN;
  const status = Number.isInteger(rawStatus) && rawStatus >= 400 && rawStatus < 600 ? rawStatus : 500;

  res.status(status).json({ error: status >= 500 ? "Internal server error" : "Bad request" });
});

export default app;
