import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import type { UIMessage } from "ai";
import { ChatPanel } from "@/components/chat-panel";
import { useThreads } from "@/lib/use-threads";

export const Route = createFileRoute("/chat/$threadId")({
  validateSearch: z.object({ q: z.string().optional() }),
  component: ChatRoute,
});

function ChatRoute() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const { getThread, setMessages } = useThreads();
  const [ready, setReady] = useState(false);

  const initial = useMemo<UIMessage[]>(() => {
    const t = getThread(threadId);
    return (t?.messages ?? []) as UIMessage[];
  }, [threadId, getThread]);

  useEffect(() => {
    const exists = getThread(threadId);
    if (!exists) {
      void navigate({ to: "/", replace: true });
      return;
    }
    setReady(true);
  }, [threadId, getThread, navigate]);

  if (!ready) return null;

  return (
    <ChatPanel
      key={threadId}
      threadId={threadId}
      initialMessages={initial}
      onMessagesChange={(m) => setMessages(threadId, m)}
      welcome={
        <div className="flex flex-col items-center pt-12 text-center text-muted-foreground">
          <p className="text-sm">Start the conversation — Voya is listening.</p>
        </div>
      }
      suggestions={
        initial.length === 0
          ? [
              "Help me plan my week",
              "Suggest a creative project I could start today",
              "Explain quantum computing simply",
              "Write a haiku about morning coffee",
            ]
          : undefined
      }
      placeholder="Message Voya AI…"
    />
  );
}
