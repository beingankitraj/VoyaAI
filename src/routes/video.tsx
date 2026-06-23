import { createFileRoute } from "@tanstack/react-router";
import { Video, Sparkles } from "lucide-react";
import { PageHeader, PageContainer } from "@/components/page-shell";

export const Route = createFileRoute("/video")({
  head: () => ({ meta: [{ title: "Video Companion — Voya AI" }] }),
  component: VideoPage,
});

function VideoPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={Video}
        title="Video Companion"
        description="Plan, script and storyboard your next video."
      />
      <div className="flex-1 overflow-y-auto">
        <PageContainer>
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient text-white">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-semibold">Coming online soon</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Video Companion will help you draft scripts, plan shots and turn
              ideas into storyboards. For now, use Story Builder or a chat to
              outline your next video.
            </p>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
