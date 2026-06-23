import { createFileRoute } from "@tanstack/react-router";
import { Smile, Loader2, Sparkles, Download } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateImage } from "@/lib/image-gen.functions";
import { PageHeader, PageContainer } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/meme")({
  head: () => ({ meta: [{ title: "Meme Maker — Voya AI" }] }),
  component: MemePage,
});

function MemePage() {
  const gen = useServerFn(generateImage);
  const [idea, setIdea] = useState("");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const v = idea.trim();
    if (!v) return;
    setLoading(true);
    setError(null);
    setImg(null);
    try {
      const prompt = `A meme image, photographic or illustrated, depicting: ${v}. Top caption "${topText}". Bottom caption "${bottomText}". Bold impact white text with black outline, classic meme style.`;
      const res = await gen({ data: { prompt } });
      setImg(res.imageUrl);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <PageHeader icon={Smile} title="Meme Maker" description="Witty captions, instant memes." />
      <div className="flex-1 overflow-y-auto">
        <PageContainer>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            className="space-y-3 rounded-2xl border border-border bg-card p-4"
          >
            <Input
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="What's the scene? e.g. 'a cat staring at an empty bowl'"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="Top caption"
              />
              <Input
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="Bottom caption"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading || !idea.trim()}
                className="brand-gradient text-white"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Cooking…</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Make meme</>
                )}
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {img && (
            <div className="mt-6">
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <img src={img} alt="meme" className="w-full" />
              </div>
              <div className="mt-3 flex justify-end">
                <a href={img} download="voya-meme.png">
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
