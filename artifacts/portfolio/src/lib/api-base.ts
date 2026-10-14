/**
 * Base URL prepended to every relative API path (`/api/...`).
 *
 * - Development: empty string -> same origin -> Vite dev proxy (`/api` -> localhost:5000).
 * - Production build (Cloudflare Pages has no API): defaults to the Worker API.
 * - Override with `VITE_API_BASE_URL` at build time. Set it to `""` to force same-origin.
 */
const DEFAULT_API_BASE = "https://ibrahimig.ibrah769khalil.workers.dev";

const envBase = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL: string =
  envBase !== undefined
    ? envBase.replace(/\/+$/, "")
    : import.meta.env.PROD
      ? DEFAULT_API_BASE
      : "";

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
}
