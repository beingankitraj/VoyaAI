import { createFileRoute } from "@tanstack/react-router";
import { Users, Briefcase, GraduationCap, HeartPulse, Code2, Sparkles } from "lucide-react";
import { useState } from "react";
import { ChatPanel } from "@/components/chat-panel";
import { PageHeader } from "@/components/page-shell";

export const Route = createFileRoute("/team")({
  head: () => ({ meta: [{ title: "AI Team — Voya AI" }] }),
  component: TeamPage,
});

const TEAM = [
  {
    id: "coach",
    name: "Maya — Life Coach",
    desc: "Gentle accountability and reflection",
    icon: HeartPulse,
    persona:
      "Maya, a warm and curious life coach. Ask powerful questions, reflect feelings, and offer one small actionable step.",
  },
  {
    id: "engineer",
    name: "Theo — Senior Engineer",
    desc: "Pragmatic code review and design",
    icon: Code2,
    persona:
      "Theo, a no-nonsense senior software engineer. Be terse, direct, and prioritize clarity, correctness, and maintainability.",
  },
  {
    id: "tutor",
    name: "Sage — Tutor",
    desc: "Patient explanations for any topic",
    icon: GraduationCap,
    persona:
      "Sage, a kind and patient tutor. Explain concepts step-by-step with analogies, then check understanding.",
  },
  {
    id: "marketer",
    name: "Rio — Marketing Lead",
    desc: "Brand voice, copy, positioning",
    icon: Briefcase,
    persona:
      "Rio, a sharp marketing lead. Help craft punchy copy, positioning, and audience insights.",
  },
] as const;

function TeamPage() {
  const [active, setActive] = useState<(typeof TEAM)[number] | null>(null);

  if (!active) {
    return (
      <div className="flex h-full flex-col">
        <PageHeader
          icon={Users}
          title="AI Team"
          description="Pick a specialist to talk with."
        />
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto grid max-w-5xl gap-4 px-6 py-6 sm:grid-cols-2">
            {TEAM.map((m) => (
              <button
                key={m.id}
                onClick={() => setActive(m)}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl brand-gradient text-white">
                  <m.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{m.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    <Sparkles className="h-3 w-3" /> Start session
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border bg-card/40 px-6 py-4">
        <button
          onClick={() => setActive(null)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Team
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl brand-gradient text-white">
            <active.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">{active.name}</p>
            <p className="text-xs text-muted-foreground">{active.desc}</p>
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <ChatPanel
          threadId={`team-${active.id}`}
          mode="team"
          persona={active.persona}
          placeholder={`Talk to ${active.name.split(" ")[0]}…`}
        />
      </div>
    </div>
  );
}
