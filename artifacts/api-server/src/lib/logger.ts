import pino from "pino";

type LogFn = {
  (obj: unknown, msg?: string, ...args: unknown[]): void;
  (msg: string, ...args: unknown[]): void;
};

export type Logger = Record<string, LogFn> & {
  child(bindings: Record<string, unknown>): Logger;
};

function createConsoleLogger(bindings: Record<string, unknown> = {}): any {
  const prefix = Object.keys(bindings).length
    ? `[${Object.entries(bindings)
        .map(([k, v]) => `${k}=${v}`)
        .join(" ")}] `
    : "";

  const emit =
    (level: string): LogFn =>
    (first: unknown, second?: unknown, ...rest: unknown[]) => {
      const line = typeof first === "string" ? `${prefix}${first}` : prefix;
      const payload =
        typeof first === "string"
          ? [line, second, ...rest].filter((v) => v !== undefined)
          : [line, first, ...(second !== undefined ? [second] : []), ...rest].filter((v) => v !== undefined);

      if (level === "error" || level === "fatal") {
        console.error(...(payload as unknown[]));
      } else if (level === "warn") {
        console.warn(...(payload as unknown[]));
      } else {
        console.log(...(payload as unknown[]));
      }
    };

  return {
    level: "info",
    silent: () => undefined,
    msgPrefix: "",
    trace: emit("trace"),
    debug: emit("debug"),
    info: emit("info"),
    warn: emit("warn"),
    error: emit("error"),
    fatal: emit("fatal"),
    child: (childBindings: Record<string, unknown>) => createConsoleLogger({ ...bindings, ...childBindings }),
  };
}

function isWorkerRuntime(): boolean {
  try {
    const nav = (globalThis as { navigator?: { userAgent?: string } }).navigator;
    if (nav?.userAgent?.includes("Cloudflare-Workers")) return true;
  } catch {
    /* ignore */
  }
  return typeof process === "undefined" || !process.versions?.node;
}

function createPinoLogger(): any | null {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    return pino({
      level: process.env.LOG_LEVEL ?? "info",
      redact: [
        "req.headers.authorization",
        "req.headers.cookie",
        "res.headers['set-cookie']",
      ],
      ...(isProduction
        ? {}
        : {
            transport: {
              target: "pino-pretty",
              options: { colorize: true },
            },
          }),
    });
  } catch {
    return null;
  }
}

export const logger: any =
  isWorkerRuntime() ? createConsoleLogger() : createPinoLogger() ?? createConsoleLogger();

