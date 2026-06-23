import { createFileRoute } from "@tanstack/react-router";
import { Palette, Sparkles, Loader2, Download } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateImage } from "@/lib/image-gen.functions";
import { PageHeader, PageContainer } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/designer")({
  head: () => ({ meta: [{ title: "AI Designer — Voya AI" }] }),
  component: DesignerPage,
});

const EXAMPLES = [
  "A cozy minimalist café logo, warm earth tones, hand-drawn feel",
  "Hero illustration for a meditation app: soft pastel mountains at dawn",
  "Bold geometric pattern for a tech brand, indigo and coral",
  "Mood board: Scandinavian living room, plants, natural light, photoreal",
];

function DesignerPage() {
  const gen = useServerFn(generateImage);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (text?: string) => {
    const p = (text ?? prompt).trim();
    if (!p) return;
    setLoading(true);
    setError(null);
    setImg(null);
    try {
      const res = await gen({ data: { prompt: p } });
      setImg(res.imageUrl);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        icon={Palette}
        title="AI Designer"
        description="Describe an image and Voya will bring it to life."
      />
      <div className="flex-1 overflow-y-auto">
        <PageContainer>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A surreal forest with floating lanterns, painterly style…"
              rows={3}
              className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{prompt.length}/2000</span>
              <Button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="brand-gradient text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Designing…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate
                  </>
                )}
              </Button>
            </div>
          </form>

          {!img && !loading && (
            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Try one of these
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {EXAMPLES.map((e) => (
                  <button
                    key={e}
                    onClick={() => {
                      setPrompt(e);
                      void submit(e);
                    }}
                    className="rounded-xl border border-border bg-card p-3 text-left text-sm hover:border-primary/50 hover:bg-accent"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-6 flex aspect-square w-full max-w-xl items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Painting your idea…
            </div>
          )}

          {img && (
            <div className="mt-6">
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <img src={img} alt={prompt} className="w-full" />
              </div>
              <div className="mt-3 flex justify-end">
                <a href={img} download="voya-design.png">
                  <Button variant="outline">
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </a>
              </div>
            </div>
          )}
        </PageContainer>
      </div>
    </div>
  );
}
