// Tiny localStorage helpers, SSR-safe.
import type { UIMessage } from "ai";

export type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const KEYS = {
  threads: "voya.threads",
  theme: "voya.theme",
  tasks: "voya.tasks",
  journal: "voya.journal",
  achievements: "voya.achievements",
  workspace: "voya.workspace",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

export const storage = {
  loadThreads: () => read<Thread[]>(KEYS.threads, []),
  saveThreads: (t: Thread[]) => write(KEYS.threads, t),

  loadTasks: () =>
    read<Array<{ id: string; text: string; done: boolean; createdAt: number }>>(
      KEYS.tasks,
      [],
    ),
  saveTasks: (t: unknown) => write(KEYS.tasks, t),

  loadJournal: () =>
    read<
      Array<{ id: string; mood: string; note: string; createdAt: number }>
    >(KEYS.journal, []),
  saveJournal: (j: unknown) => write(KEYS.journal, j),

  loadAchievements: () =>
    read<Record<string, { unlockedAt: number }>>(KEYS.achievements, {}),
  saveAchievements: (a: unknown) => write(KEYS.achievements, a),

  loadWorkspace: () =>
    read<Array<{ id: string; title: string; body: string; updatedAt: number }>>(
      KEYS.workspace,
      [],
    ),
  saveWorkspace: (w: unknown) => write(KEYS.workspace, w),

  loadTheme: () => read<"light" | "dark">(KEYS.theme, "light"),
  saveTheme: (t: "light" | "dark") => write(KEYS.theme, t),
};

export function newId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
