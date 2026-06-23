import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableGateway } from "@/lib/ai-gateway.server";

function systemFor(mode: string | undefined, persona: string | undefined): string {
  switch (mode) {
    case "designer":
      return "You are Voya's AI Designer. Help users brainstorm visual concepts, color palettes, typography, and design directions. Be concrete and inspiring. Use markdown.";
    case "story":
      return "You are Voya's Story Builder. Help users craft compelling narratives with vivid scenes, characters, and emotional arcs. Write with literary flair. Use markdown.";
    case "meme":
      return "You are Voya's Meme Maker. Suggest punchy, funny captions and meme ideas. Keep it witty, never mean. Use markdown.";
    case "journal":
      return "You are Voya's Emotional Journal companion. Listen with empathy, reflect feelings back, and gently ask questions that help the user understand themselves. Never diagnose. Be warm and human.";
    case "team":
      return `You are part of Voya's AI Team, currently acting as: ${persona ?? "a helpful expert"}. Stay in character, bring that persona's expertise and voice to the conversation. Use markdown.`;
    default:
      return "You are Voya AI, a warm, intelligent, and creative companion. Respond with markdown formatting. Be helpful, concise, and friendly. Use emojis sparingly to add warmth.";
  }
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            messages: UIMessage[];
            mode?: string;
            persona?: string;
          };
          const gateway = createLovableGateway();
          const modelMessages = await convertToModelMessages(body.messages ?? []);

          const result = streamText({
            model: gateway("google/gemini-3-flash-preview"),
            system: systemFor(body.mode, body.persona),
            messages: modelMessages,
          });
          return result.toUIMessageStreamResponse();
        } catch (err) {
          console.error("chat error", err);
          return new Response(
            JSON.stringify({ error: (err as Error).message }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
