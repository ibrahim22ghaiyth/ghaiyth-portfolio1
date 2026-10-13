import type { D1Database } from "@cloudflare/workers-types";
import type { Express } from "express";
import { createApp } from "./app";
import { createExpressFetchHandler } from "./lib/express-fetch-adapter";
import { initD1 } from "@workspace/db/d1";
import { assetTags, template } from "virtual:client-template";

type Env = {
  DB: D1Database;
  ASSETS: { fetch(request: Request): Promise<Response> };
  JWT_SECRET: string;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  GEMINI_API_KEY?: string;
  OPENAI_API_KEY?: string;
  SESSION_SECRET?: string;
};

let cachedListener: ((request: Request) => Promise<Response>) | null = null;
let cachedEnv: Env | null = null;

function ensureApp(env: Env): (request: Request) => Promise<Response> {
  if (cachedListener && cachedEnv === env) {
    return cachedListener;
  }

  process.env.NODE_ENV ??= "production";
  process.env.JWT_SECRET = env.JWT_SECRET || env.SESSION_SECRET || "";
  process.env.SESSION_SECRET = env.SESSION_SECRET || env.JWT_SECRET || "";
  process.env.ADMIN_USERNAME = env.ADMIN_USERNAME;
  process.env.ADMIN_PASSWORD = env.ADMIN_PASSWORD;
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  if (env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;

  initD1(env.DB);

  const app = createApp({
    serveStatic: false,
    seoTemplate: { template, assetTags },
  }) as unknown as Express;

  cachedListener = createExpressFetchHandler(app as unknown as (req: never, res: never) => unknown) as (
    request: Request,
  ) => Promise<Response>;
  cachedEnv = env;
  return cachedListener;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const listener = ensureApp(env);
      return await listener(request);
    } catch (error) {
      console.error("[worker] Unhandled error:", error, (error as Error)?.stack);
      return new Response(`Internal server error: ${(error as Error)?.message || "unknown"}`, {
        status: 500,
        headers: { "content-type": "text/plain" },
      });
    }
  },
};
