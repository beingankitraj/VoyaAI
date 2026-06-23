import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bot, Sparkles, Palette, BookOpen, Heart } from "lucide-react";
import { useEffect, useRef } from "react";
import { useThreads } from "@/lib/use-threads";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { createThread } = useThreads();
  const navigate = useNavigate();
  const created = useRef(false);

  const startChat = (seed?: string) => {
    if (created.current) return;
    created.current = true;
    const t = createThread();
    void navigate({
      to: "/chat/$threadId",
      params: { threadId: t.id },
      search: seed ? { q: seed } : undefined,
    });
  };

  // Reset guard when component remounts
  useEffect(() => () => { created.current = false; }, []);

  return (
    <div className="scrollbar-thin h-full overflow-y-auto">
      <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center px-6 py-12">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl brand-gradient text-white shadow-lg">
            <Bot className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Hi, I'm <span className="brand-gradient-text">Voya</span>
          </h1>
          <p className="mt-3 max-w-lg text-balance text-muted-foreground">
            Your warm, intelligent companion. Ask anything, create freely, or
            explore one of the tools in the sidebar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { icon: Sparkles, label: "Brainstorm ideas for a weekend project", color: "text-amber-500" },
            { icon: Palette, label: "Design a mood board for a cozy café", color: "text-pink-500" },
            { icon: BookOpen, label: "Help me draft the opening of a short story", color: "text-indigo-500" },
            { icon: Heart, label: "Reflect with me on how my week went", color: "text-rose-500" },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => startChat(s.label)}
              className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <s.icon className={`mt-0.5 h-5 w-5 shrink-0 ${s.color}`} />
              <span className="text-sm font-medium text-card-foreground">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => startChat()}
            className="inline-flex items-center gap-2 rounded-full brand-gradient px-6 py-3 text-sm font-medium text-white shadow-md transition hover:opacity-95"
          >
            <Bot className="h-4 w-4" /> Start a new chat
          </button>
        </div>
      </div>
    </div>
  );
}
