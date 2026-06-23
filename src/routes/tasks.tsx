import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Plus, Trash2, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader, PageContainer } from "@/components/page-shell";
import { storage, newId } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Task = { id: string; text: string; done: boolean; createdAt: number };

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Tasks — Voya AI" }] }),
  component: TasksPage,
});

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");

  useEffect(() => setTasks(storage.loadTasks()), []);
  useEffect(() => storage.saveTasks(tasks), [tasks]);

  const add = () => {
    const v = text.trim();
    if (!v) return;
    setTasks((t) => [{ id: newId(), text: v, done: false, createdAt: Date.now() }, ...t]);
    setText("");
  };

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={ListChecks}
        title="Tasks"
        description={`${remaining} open • ${tasks.length} total`}
      />
      <div className="flex-1 overflow-y-auto">
        <PageContainer>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              add();
            }}
            className="flex gap-2"
          >
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a task…"
              className="h-11"
            />
            <Button type="submit" className="h-11 brand-gradient text-white">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </form>

          <ul className="mt-6 flex flex-col gap-2">
            {tasks.length === 0 && (
              <li className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No tasks yet. Add one above.
              </li>
            )}
            {tasks.map((t) => (
              <li
                key={t.id}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <button
                  onClick={() =>
                    setTasks((list) =>
                      list.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
                    )
                  }
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                    t.done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  }`}
                  aria-label="Toggle"
                >
                  {t.done && <Check className="h-4 w-4" />}
                </button>
                <span
                  className={`flex-1 text-sm ${
                    t.done ? "text-muted-foreground line-through" : "text-card-foreground"
                  }`}
                >
                  {t.text}
                </span>
                <button
                  onClick={() => setTasks((list) => list.filter((x) => x.id !== t.id))}
                  className="text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </PageContainer>
      </div>
    </div>
  );
}
