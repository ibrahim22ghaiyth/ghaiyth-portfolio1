import { Readable } from "node:stream";
import type { IncomingMessage, ServerResponse } from "node:http";

type ExpressApp = (req: IncomingMessage, res: ServerResponse) => unknown;

function buildHeaders(headers: Headers): Record<string, string | string[] | undefined> {
  const out: Record<string, string | string[] | undefined> = {};
  headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === "set-cookie") {
      const existing = out[k];
      out[k] = Array.isArray(existing) ? [...existing, value] : [value];
    } else {
      out[k] = value;
    }
  });
  return out;
}

function concat(chunks: Uint8Array[]): Uint8Array {
  let total = 0;
  for (const c of chunks) total += c.length;
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

/**
 * All methods are assigned as own properties in the constructor.
 * Express calls Object.setPrototypeOf(res, app.response), which would wipe
 * prototype methods and expose real node:http internals that expect real state.
 */
function createNodeCompatResponse() {
  const state = {
    statusCode: 200,
    statusMessage: "OK",
    headersSent: false,
    finished: false,
    writableEnded: false,
    headerStore: {} as Record<string, string | string[] | undefined>,
    chunks: [] as Uint8Array[],
    resolveFn: null as ((response: Response) => void) | null,
    rejectFn: null as ((err: Error) => void) | null,
    finishHandlers: [] as Array<() => void>,
  };

  const settle = () => {
    if (!state.resolveFn || !state.finished) return;
    const bodyBytes = concat(state.chunks);
    const headers = new Headers();
    for (const [key, value] of Object.entries(state.headerStore)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) {
        for (const v of value) headers.append(key, String(v));
      } else {
        headers.set(key, String(value));
      }
    }
    const init: ResponseInit = { status: state.statusCode, headers };
    try {
      state.resolveFn(bodyBytes.length > 0 ? new Response(bodyBytes, init) : new Response(null, init));
    } catch {
      state.resolveFn(new Response(null, init));
    }
  };

  const res: Record<string, any> = {
    statusCode: 200,
    statusMessage: "OK",
    headersSent: false,
    finished: false,
    writableEnded: false,
    writable: true,
    sendDate: true,
    headers: state.headerStore,
  };

  Object.defineProperties(res, {
    statusCode: {
      get: () => state.statusCode,
      set: (v: number) => {
        state.statusCode = v;
      },
      enumerable: true,
    },
    statusMessage: {
      get: () => state.statusMessage,
      set: (v: string) => {
        state.statusMessage = v;
      },
      enumerable: true,
    },
    headersSent: {
      get: () => state.headersSent,
      set: (v: boolean) => {
        state.headersSent = v;
      },
      enumerable: true,
    },
    finished: {
      get: () => state.finished,
      set: (v: boolean) => {
        state.finished = v;
      },
      enumerable: true,
    },
    writableEnded: {
      get: () => state.writableEnded,
      set: (v: boolean) => {
        state.writableEnded = v;
      },
      enumerable: true,
    },
  });

  res.setHeader = (name: string, value: string | number | readonly string[]) => {
    state.headerStore[name.toLowerCase()] = value as string | string[];
    return res;
  };
  res.getHeader = (name: string) => state.headerStore[name.toLowerCase()];
  res.getHeaders = () => ({ ...state.headerStore });
  res.hasHeader = (name: string) => name.toLowerCase() in state.headerStore;
  res.removeHeader = (name: string) => {
    delete state.headerStore[name.toLowerCase()];
  };
  res.flushHeaders = () => {
    state.headersSent = true;
  };

  res.writeHead = (
    statusCode: number,
    statusMessageOrHeaders?: string | Record<string, string | number | readonly string[]>,
    maybeHeaders?: Record<string, string | number | readonly string[]>,
  ) => {
    state.statusCode = statusCode;
    if (typeof statusMessageOrHeaders === "string") {
      state.statusMessage = statusMessageOrHeaders;
      if (maybeHeaders) {
        for (const [k, v] of Object.entries(maybeHeaders)) res.setHeader(k, v);
      }
    } else if (statusMessageOrHeaders) {
      for (const [k, v] of Object.entries(statusMessageOrHeaders)) res.setHeader(k, v);
    }
    state.headersSent = true;
    return res;
  };

  res.write = (chunk: Uint8Array | string, encodingOrCb?: unknown, cb?: unknown): boolean => {
    const done = typeof encodingOrCb === "function" ? encodingOrCb : cb;
    if (typeof chunk === "string") {
      state.chunks.push(new TextEncoder().encode(chunk));
    } else if (chunk) {
      state.chunks.push(chunk);
    }
    if (typeof done === "function") (done as () => void)();
    return true;
  };

  res.end = (chunk?: unknown, encodingOrCb?: unknown, cb?: unknown) => {
    const done = typeof chunk === "function" ? chunk : typeof encodingOrCb === "function" ? encodingOrCb : cb;
    if (chunk && typeof chunk !== "function") {
      res.write(chunk as Uint8Array | string);
    }
    state.finished = true;
    state.writableEnded = true;
    state.headersSent = true;
    for (const h of state.finishHandlers) h();
    settle();
    if (typeof done === "function") (done as () => void)();
    return res;
  };

  res.on = (event: string, handler: (...args: unknown[]) => void) => {
    if (event === "finish" || event === "close") {
      if (state.finished) handler();
      else state.finishHandlers.push(handler as () => void);
    }
    return res;
  };
  res.once = res.on;
  res.emit = () => false;
  res.removeAllListeners = () => {
    state.finishHandlers = [];
    return res;
  };

  res.assign = (resolve: (response: Response) => void, reject: (err: Error) => void) => {
    state.resolveFn = resolve;
    state.rejectFn = reject;
    if (state.finished) settle();
  };

  return res as unknown as ServerResponse & {
    assign: (resolve: (r: Response) => void, reject: (e: Error) => void) => void;
  };
}

function createNodeCompatRequestWithStream(request: Request) {
  const headers = buildHeaders(request.headers);
  const rawHeaders: string[] = [];
  request.headers.forEach((value, key) => {
    rawHeaders.push(key, value);
  });
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "";
  const parsed = new URL(request.url);

  const readable = new Readable({
    read() {
      /* fed via push */
    },
  });

  const req = readable as unknown as Readable & Record<string, unknown>;
  req.method = request.method;
  req.url = parsed.pathname + parsed.search;
  req.headers = headers;
  req.rawHeaders = rawHeaders;
  req.httpVersion = "1.1";
  req.httpVersionMajor = 1;
  req.httpVersionMinor = 1;
  req.trailers = {};
  req.rawTrailers = [];
  req.socket = { remoteAddress: ip };
  req.connection = { remoteAddress: ip };
  req.destroyed = false;

  return { req: req as unknown as IncomingMessage, readable };
}

async function readRequestBody(request: Request): Promise<Uint8Array | null> {
  if (request.method === "GET" || request.method === "HEAD") return null;
  if (!request.body) return null;
  try {
    return new Uint8Array(await request.arrayBuffer());
  } catch {
    return null;
  }
}

export function createExpressFetchHandler(app: ExpressApp) {
  return async (request: Request): Promise<Response> => {
    const { req, readable } = createNodeCompatRequestWithStream(request);
    const res = createNodeCompatResponse();

    // Buffer body fully before Express runs so body-parser never races the stream.
    const bodyBytes = await readRequestBody(request);
    if (bodyBytes && bodyBytes.length > 0) {
      readable.push(bodyBytes);
    }
    readable.push(null);

    const responsePromise = new Promise<Response>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Express handler timed out after 30s"));
      }, 30_000);

      res.assign(
        (response) => {
          clearTimeout(timeout);
          resolve(response);
        },
        (err) => {
          clearTimeout(timeout);
          reject(err);
        },
      );

      try {
        const result = app(req, res);
        if (result && typeof (result as Promise<unknown>).then === "function") {
          (result as Promise<unknown>).catch((err: unknown) => {
            clearTimeout(timeout);
            reject(err instanceof Error ? err : new Error(String(err)));
          });
        }
      } catch (err) {
        clearTimeout(timeout);
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });

    return responsePromise;
  };
}
