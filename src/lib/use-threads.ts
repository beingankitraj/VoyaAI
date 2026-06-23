import { useCallback, useEffect, useState } from "react";
import type { UIMessage } from "ai";
import { storage, newId, type Thread } from "@/lib/storage";

let memoryThreads: Thread[] | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function ensureLoaded() {
  if (memoryThreads === null) {
    memoryThreads = storage.loadThreads();
  }
  return memoryThreads;
}

function persist() {
  if (memoryThreads) storage.saveThreads(memoryThreads);
}

export function useThreads() {
  const [, setTick] = useState(0);

  useEffect(() => {
    ensureLoaded();
    setTick((n) => n + 1);
    const fn = () => setTick((n) => n + 1);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);

  const createThread = useCallback((title = "New Chat"): Thread => {
    const t: Thread = { id: newId(), title, updatedAt: Date.now(), messages: [] };
    memoryThreads = [t, ...(memoryThreads ?? [])];
    persist();
    notify();
    return t;
  }, []);

  const deleteThread = useCallback((id: string) => {
    memoryThreads = (memoryThreads ?? []).filter((t) => t.id !== id);
    persist();
    notify();
  }, []);

  const updateThread = useCallback(
    (id: string, patch: Partial<Thread> | ((t: Thread) => Partial<Thread>)) => {
      memoryThreads = (memoryThreads ?? []).map((t) =>
        t.id === id
          ? { ...t, ...(typeof patch === "function" ? patch(t) : patch), updatedAt: Date.now() }
          : t,
      );
      persist();
      notify();
    },
    [],
  );

  const getThread = useCallback((id: string): Thread | undefined => {
    return (memoryThreads ?? ensureLoaded()).find((t) => t.id === id);
  }, []);

  const setMessages = useCallback(
    (id: string, messages: UIMessage[]) => {
      updateThread(id, (t) => ({
        messages,
        title:
          t.title && t.title !== "New Chat"
            ? t.title
            : deriveTitle(messages) || t.title,
      }));
    },
    [updateThread],
  );

  return {
    threads: memoryThreads ?? [],
    createThread,
    deleteThread,
    updateThread,
    getThread,
    setMessages,
  };
}

function deriveTitle(messages: UIMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "";
  const text = first.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  return text.slice(0, 48) + (text.length > 48 ? "…" : "");
}
