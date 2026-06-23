import { createFileRoute } from "@tanstack/react-router";
import { FolderKanban, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader, PageContainer } from "@/components/page-shell";
import { storage, newId } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Note = { id: string; title: string; body: string; updatedAt: number };

export const Route = createFileRoute("/workspace")({
  head: () => ({ meta: [{ title: "Workspace — Voya AI" }] }),
  component: WorkspacePage,
});

function WorkspacePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = storage.loadWorkspace();
    setNotes(loaded);
    setActiveId(loaded[0]?.id ?? null);
  }, []);
  useEffect(() => storage.saveWorkspace(notes), [notes]);

  const active = notes.find((n) => n.id === activeId) ?? null;

  const create = () => {
    const n: Note = {
      id: newId(),
      title: "Untitled note",
      body: "",
      updatedAt: Date.now(),
    };
    setNotes((list) => [n, ...list]);
    setActiveId(n.id);
  };

  const update = (patch: Partial<Note>) => {
    if (!active) return;
    setNotes((list) =>
      list.map((n) => (n.id === active.id ? { ...n, ...patch, updatedAt: Date.now() } : n)),
    );
  };

  const remove = (id: string) => {
    setNotes((list) => list.filter((n) => n.id !== id));
    if (id === activeId) setActiveId(null);
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={FolderKanban}
        title="Workspace"
        description="Quick notes and scratchpads, saved in this browser."
      />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/30 sm:flex">
          <div className="p-3">
            <Button onClick={create} variant="outline" className="w-full">
              <Plus className="h-4 w-4" /> New note
            </Button>
          </div>
          <div className="scrollbar-thin flex-1 overflow-y-auto px-2 pb-3">
            {notes.length === 0 && (
              <p className="px-3 py-6 text-xs text-muted-foreground">No notes yet.</p>
            )}
            {notes.map((n) => (
              <button
                key={n.id}
                onClick={() => setActiveId(n.id)}
                className={`group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                  n.id === activeId
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/60"
                }`}
              >
                <span className="flex-1 truncate">{n.title || "Untitled"}</span>
                <Trash2
                  className="h-3.5 w-3.5 opacity-0 transition hover:text-destructive group-hover:opacity-60"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(n.id);
                  }}
                />
              </button>
            ))}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {active ? (
            <div className="mx-auto flex h-full w-full max-w-3xl flex-col p-6">
              <Input
                value={active.title}
                onChange={(e) => update({ title: e.target.value })}
                className="border-0 bg-transparent px-0 text-2xl font-semibold shadow-none focus-visible:ring-0"
              />
              <Textarea
                value={active.body}
                onChange={(e) => update({ body: e.target.value })}
                placeholder="Start writing…"
                className="mt-4 flex-1 resize-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
              <div>
                <FolderKanban className="mx-auto mb-3 h-10 w-10 opacity-40" />
                <p>Select or create a note to get started.</p>
                <Button onClick={create} className="mt-4 brand-gradient text-white">
                  <Plus className="h-4 w-4" /> New note
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
