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
import {
  blogRssXml,
  buildBlogPostSeoPage,
  clientTemplatePath,
  getPublicSeoPage,
  indexNowKey,
  publicOrigin,
  publicSitemapXml,
  readTemplate,
  redirectArPath,
  renderPublicPage,
  renderPublicPageWithTemplate,
} from "./seo/public-pages";
import { getSeoBlogPost, getSeoBlogPosts } from "./seo/blog-source";

const isProduction = process.env.NODE_ENV === "production";

export type SeoTemplateBundle = { template: string; assetTags: string };

export type CreateAppOptions = {
  serveStatic?: boolean;
  seoTemplate?: SeoTemplateBundle;
};

function applySeoRoutes(app: Express, resolveTemplate: (req: Request) => SeoTemplateBundle | null) {
  app.get("/sitemap.xml", async (_req, res) => {
    const posts = await getSeoBlogPosts();
    res.type("application/xml").send(publicSitemapXml(posts));
  });

  app.get("/rss.xml", async (_req, res) => {
    const posts = await getSeoBlogPosts();
    res.type("application/rss+xml").send(blogRssXml("ar", posts));
  });

  app.get("/en/rss.xml", async (_req, res) => {
    const posts = await getSeoBlogPosts();
    res.type("application/rss+xml").send(blogRssXml("en", posts));
  });

  app.get(`/${indexNowKey}.txt`, (_req, res) => {
    res.type("text/plain").send(indexNowKey);
  });

  app.get(/^\/ar(?:\/.*)?$/, (req, res) => {
    const target = redirectArPath(req.path) || "/";
    res.redirect(301, `${publicOrigin()}${target === "/" ? "/" : target}`);
  });

  app.get(["/", "/products", "/blog", "/projects", "/en", "/en/products", "/en/blog", "/en/projects"], (req, res) => {
    const page = getPublicSeoPage(req.path);
    const bundle = resolveTemplate(req);
    if (page && bundle) {
      res.type("html").send(renderPublicPageWithTemplate(bundle.template, bundle.assetTags, page));
      return;
    }

    if (bundle) {
      res.type("html").send(bundle.template);
      return;
    }

    res.status(404).json({ error: "Not found" });
  });

  app.get(/^\/en\/.+$/, async (req, res) => {
    const bundle = resolveTemplate(req);

    if (req.path.startsWith("/en/blog/")) {
      const slug = decodeURIComponent(req.path.slice("/en/blog/".length));
      const post = await getSeoBlogPost(slug);
      if (post && bundle) {
        res.type("html").send(renderPublicPageWithTemplate(bundle.template, bundle.assetTags, buildBlogPostSeoPage(post, "en")));
        return;
      }
    }

    const page = getPublicSeoPage(req.path);
    if (page && bundle) {
      res.type("html").send(renderPublicPageWithTemplate(bundle.template, bundle.assetTags, page));
      return;
    }

    if (bundle) {
      res.type("html").send(bundle.template);
      return;
    }

    res.status(404).json({ error: "Not found" });
  });

  app.get(/^\/blog\/.+$/, async (req, res) => {
    const bundle = resolveTemplate(req);
    const slug = decodeURIComponent(req.path.slice("/blog/".length));
    const post = await getSeoBlogPost(slug);
    if (post && bundle) {
      res.type("html").send(renderPublicPageWithTemplate(bundle.template, bundle.assetTags, buildBlogPostSeoPage(post, "ar")));
      return;
    }

    const page = getPublicSeoPage(req.path);
    if (page && bundle) {
      res.type("html").send(renderPublicPageWithTemplate(bundle.template, bundle.assetTags, page));
      return;
    }

    if (bundle) {
      res.type("html").send(bundle.template);
      return;
    }

    res.status(404).json({ error: "Not found" });
  });
}

export function createApp(options: CreateAppOptions = {}): Express {
  const serveStatic = options.serveStatic ?? true;
  const app: Express = express();

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
      origin: isProduction ? [/^https:\/\/([a-z0-9-]+\.)?ibrahimig\.com$/i, /^https:\/\/([a-z0-9-]+\.)?ibrahimig\.pages\.dev$/i, /^https:\/\/([a-z0-9-]+\.)?ibrahimig\.workers\.dev$/i] : true,
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

  if (options.seoTemplate) {
    const bundle = options.seoTemplate;
    applySeoRoutes(app, () => bundle);
  } else if (serveStatic) {
    const moduleDir = path.dirname(fileURLToPath(import.meta.url));
    const clientDistPath = path.resolve(moduleDir, "../../portfolio/dist/public");

    if (existsSync(clientDistPath)) {
      const templatePath = clientTemplatePath(clientDistPath);

      applySeoRoutes(app, () => readTemplate(templatePath));

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

  return app;
}

export { renderPublicPage };
