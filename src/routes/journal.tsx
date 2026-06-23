import { createFileRoute } from "@tanstack/react-router";
import { Heart, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader, PageContainer } from "@/components/page-shell";
import { storage, newId } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatPanel } from "@/components/chat-panel";

type Entry = { id: string; mood: string; note: string; createdAt: number };

const MOODS = ["😊", "🙂", "😐", "😔", "😢", "😡", "😴", "🤔"];

export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [{ title: "Emotional Journal — Voya AI" }] }),
  component: JournalPage,
});

function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [mood, setMood] = useState("🙂");
  const [note, setNote] = useState("");
  const [tab, setTab] = useState<"journal" | "talk">("journal");

  useEffect(() => setEntries(storage.loadJournal()), []);
  useEffect(() => storage.saveJournal(entries), [entries]);

  const add = () => {
    const v = note.trim();
    if (!v) return;
    setEntries((list) => [
      { id: newId(), mood, note: v, createdAt: Date.now() },
      ...list,
    ]);
    setNote("");
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={Heart}
        title="Emotional Journal"
        description="Track how you feel — talk it through with Voya."
      />
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-5xl gap-1 px-6">
          {(["journal", "talk"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-3 py-2 text-sm font-medium ${
                tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "journal" ? "My Entries" : "Talk to Voya"}
              {tab === t && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 brand-gradient rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === "journal" ? (
        <div className="flex-1 overflow-y-auto">
          <PageContainer>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                How are you feeling?
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl transition ${
                      mood === m
                        ? "border-primary bg-accent"
                        : "border-border hover:bg-accent/50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind today?"
                rows={4}
                className="mt-3"
              />
              <div className="mt-3 flex justify-end">
                <Button onClick={add} disabled={!note.trim()} className="brand-gradient text-white">
                  <Plus className="h-4 w-4" /> Save entry
                </Button>
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {entries.length === 0 && (
                <li className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                  No entries yet. Your first reflection starts here.
                </li>
              )}
              {entries.map((e) => (
                <li
                  key={e.id}
                  className="group rounded-2xl border border-border bg-card p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{e.mood}</div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        {new Date(e.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm">{e.note}</p>
                    </div>
                    <button
                      onClick={() =>
                        setEntries((list) => list.filter((x) => x.id !== e.id))
                      }
                      className="opacity-0 transition group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </PageContainer>
        </div>
      ) : (
        <div className="min-h-0 flex-1">
          <ChatPanel
            threadId="journal-companion"
            mode="journal"
            placeholder="What's weighing on you today?"
            welcome={
              <div className="pt-8 text-center text-sm text-muted-foreground">
                I'm here to listen. Nothing leaves this browser.
              </div>
            }
            suggestions={[
              "I feel overwhelmed by work",
              "Help me unpack a difficult conversation",
              "I want to feel more grounded today",
              "I'm not sure why I feel this way",
            ]}
          />
        </div>
      )}
    </div>
  );
}
