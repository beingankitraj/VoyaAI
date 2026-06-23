import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Lock, Database, Trash2, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, PageContainer } from "@/components/page-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy — Voya AI" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const clearAll = () => {
    if (typeof window === "undefined") return;
    if (!confirm("Erase every chat, task, note and journal entry from this browser?")) return;
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith("voya."))
      .forEach((k) => window.localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader icon={ShieldCheck} title="Privacy" description="Your data, your device." />
      <div className="flex-1 overflow-y-auto">
        <PageContainer>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card icon={Database} title="Local-first storage">
              All your chats, tasks, notes and journal entries are stored in this
              browser's <code className="rounded bg-muted px-1 py-0.5 text-xs">localStorage</code>.
              They never leave your device unless you send a message to the AI.
            </Card>
            <Card icon={Server} title="What we send to the AI">
              Only your active conversation is sent to the Lovable AI Gateway to
              generate a response. We don't store it server-side.
            </Card>
            <Card icon={Lock} title="No account, no tracking">
              No sign-up, no profile, no analytics. You're anonymous.
            </Card>
            <Card icon={Trash2} title="Erase everything">
              One click and your local Voya AI data is gone for good.
              <Button
                variant="destructive"
                className="mt-4"
                onClick={clearAll}
              >
                <Trash2 className="h-4 w-4" /> Erase all my data
              </Button>
            </Card>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-1 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}
