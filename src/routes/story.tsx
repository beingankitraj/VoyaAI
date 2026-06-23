import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { ChatPanel } from "@/components/chat-panel";
import { PageHeader } from "@/components/page-shell";

export const Route = createFileRoute("/story")({
  head: () => ({ meta: [{ title: "Story Builder — Voya AI" }] }),
  component: StoryPage,
});

function StoryPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={BookOpen}
        title="Story Builder"
        description="Craft narratives with literary flair."
      />
      <div className="min-h-0 flex-1">
        <ChatPanel
          threadId="story-builder"
          mode="story"
          placeholder="Pitch a premise, a character, a setting…"
          welcome={
            <div className="pt-8 text-center text-sm text-muted-foreground">
              Start with a seed: a character, a place, a feeling.
            </div>
          }
          suggestions={[
            "A lighthouse keeper finds a letter that wasn't meant for them",
            "Two strangers stuck in an elevator during a power outage",
            "Help me outline a short story about a found family",
            "Write the first paragraph of a magical realism novel set in Lisbon",
          ]}
        />
      </div>
    </div>
  );
}
