import { createFileRoute } from "@tanstack/react-router";
import { Award, Trophy, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader, PageContainer } from "@/components/page-shell";
import { storage } from "@/lib/storage";

type AchievementDef = {
  id: string;
  title: string;
  desc: string;
  check: () => boolean;
};

const DEFS: AchievementDef[] = [
  {
    id: "first-chat",
    title: "First Conversation",
    desc: "Start your first chat with Voya",
    check: () => storage.loadThreads().some((t) => t.messages.length > 0),
  },
  {
    id: "task-master",
    title: "Task Master",
    desc: "Complete 5 tasks",
    check: () => storage.loadTasks().filter((t) => t.done).length >= 5,
  },
  {
    id: "reflective",
    title: "Reflective Soul",
    desc: "Write 3 journal entries",
    check: () => storage.loadJournal().length >= 3,
  },
  {
    id: "writer",
    title: "Note Taker",
    desc: "Create your first workspace note",
    check: () => storage.loadWorkspace().length >= 1,
  },
  {
    id: "explorer",
    title: "Explorer",
    desc: "Start 5 different chat threads",
    check: () => storage.loadThreads().length >= 5,
  },
  {
    id: "deep-thinker",
    title: "Deep Thinker",
    desc: "Have a 10-message conversation",
    check: () =>
      storage.loadThreads().some((t) => t.messages.length >= 10),
  },
];

export const Route = createFileRoute("/achievements")({
  head: () => ({ meta: [{ title: "Achievements — Voya AI" }] }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const [unlocked, setUnlocked] = useState<Record<string, { unlockedAt: number }>>({});

  useEffect(() => {
    const stored = storage.loadAchievements();
    const updated = { ...stored };
    let changed = false;
    DEFS.forEach((d) => {
      if (!updated[d.id] && d.check()) {
        updated[d.id] = { unlockedAt: Date.now() };
        changed = true;
      }
    });
    if (changed) storage.saveAchievements(updated);
    setUnlocked(updated);
  }, []);

  const count = Object.keys(unlocked).length;

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={Award}
        title="Achievements"
        description={`${count} of ${DEFS.length} unlocked`}
      />
      <div className="flex-1 overflow-y-auto">
        <PageContainer>
          <div className="grid gap-3 sm:grid-cols-2">
            {DEFS.map((d) => {
              const u = unlocked[d.id];
              return (
                <div
                  key={d.id}
                  className={`flex items-start gap-3 rounded-2xl border p-4 ${
                    u
                      ? "border-primary/40 bg-accent/40"
                      : "border-border bg-card opacity-70"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      u ? "brand-gradient text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {u ? <Trophy className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{d.title}</h3>
                    <p className="text-sm text-muted-foreground">{d.desc}</p>
                    {u && (
                      <p className="mt-1 text-xs text-primary">
                        Unlocked {new Date(u.unlockedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
