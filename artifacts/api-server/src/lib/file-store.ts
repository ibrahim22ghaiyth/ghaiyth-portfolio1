import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";

const DATA_DIR = join(process.cwd(), ".data-store");
const DATA_FILE = join(DATA_DIR, "persisted.json");
const BACKUP_FILE = join(DATA_DIR, "persisted.backup.json");
const TEMP_FILE = join(DATA_DIR, "persisted.tmp.json");

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
  ensureDir();

  // Try main file first
  if (existsSync(DATA_FILE)) {
    try {
      const raw = readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      return { ...DEFAULT_STATE, ...parsed, nextIds: { ...DEFAULT_STATE.nextIds, ...parsed.nextIds } };
    } catch {
      // corrupt main file, try backup
    }
  }

  // Try backup file
  if (existsSync(BACKUP_FILE)) {
    try {
      const raw = readFileSync(BACKUP_FILE, "utf-8");
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      const state = { ...DEFAULT_STATE, ...parsed, nextIds: { ...DEFAULT_STATE.nextIds, ...parsed.nextIds } };
      // Restore from backup
      saveState(state);
      console.log("[file-store] Restored from backup");
      return state;
    } catch {
      // backup also corrupt
    }
  }

  return structuredClone(DEFAULT_STATE);
}

export function saveState(state: PersistedState): void {
  try {
    ensureDir();

    // Create backup of current file before overwriting
    if (existsSync(DATA_FILE)) {
      try {
        copyFileSync(DATA_FILE, BACKUP_FILE);
      } catch {
        // backup failed, continue anyway
      }
    }

    // Atomic write: write to temp file, then rename
    writeFileSync(TEMP_FILE, JSON.stringify(state, null, 2), "utf-8");
    renameSync(TEMP_FILE, DATA_FILE);
  } catch (err) {
    console.error("[file-store] Failed to persist state:", err);
  }
}

export function nextId(state: PersistedState, entity: string): number {
  const current = state.nextIds[entity] ?? 1;
  state.nextIds[entity] = current + 1;
  return current;
}