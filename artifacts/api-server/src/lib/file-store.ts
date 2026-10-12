import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const DATA_DIR = join(process.cwd(), ".data-store");
const DATA_FILE = join(DATA_DIR, "persisted.json");

type PersistedState = {
  services: any[];
  skills: any[];
  projects: any[];
  products: any[];
  blogPosts: any[];
  testimonials: any[];
  messages: any[];
  content: any[];
  nextIds: Record<string, number>;
};

const DEFAULT_STATE: PersistedState = {
  services: [],
  skills: [],
  projects: [],
  products: [],
  blogPosts: [],
  testimonials: [],
  messages: [],
  content: [],
  nextIds: {
    service: 1,
    skill: 1,
    project: 1,
    product: 1,
    blogPost: 1,
    testimonial: 1,
    message: 1,
  },
};

function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadState(): PersistedState {
  try {
    ensureDir();
    if (existsSync(DATA_FILE)) {
      const raw = readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return { ...DEFAULT_STATE, ...parsed, nextIds: { ...DEFAULT_STATE.nextIds, ...parsed.nextIds } };
    }
  } catch {
    // corrupt file, fall through to defaults
  }
  return structuredClone(DEFAULT_STATE);
}

export function saveState(state: PersistedState): void {
  try {
    ensureDir();
    writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("[file-store] Failed to persist state:", err);
  }
}

export function nextId(state: PersistedState, entity: string): number {
  const current = state.nextIds[entity] ?? 1;
  state.nextIds[entity] = current + 1;
  return current;
}
