import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send, Bot, User, Loader2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type ChatPanelProps = {
  threadId: string;
  initialMessages?: UIMessage[];
  onMessagesChange?: (msgs: UIMessage[]) => void;
  mode?: string;
  persona?: string;
  placeholder?: string;
  welcome?: React.ReactNode;
  suggestions?: string[];
};

export function ChatPanel({
  threadId,
  initialMessages = [],
  onMessagesChange,
  mode,
  persona,
  placeholder = "Message Voya AI…",
  welcome,
  suggestions,
}: ChatPanelProps) {
  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { mode, persona },
    }),
  });

  const [input, setInput] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Persist messages (stable callback ref so we don't loop)
  const onChangeRef = useRef(onMessagesChange);
  useEffect(() => {
    onChangeRef.current = onMessagesChange;
  }, [onMessagesChange]);
  useEffect(() => {
    onChangeRef.current?.(messages);
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  // Keep textarea focused
  useEffect(() => {
    taRef.current?.focus();
  }, [threadId, status]);

  const submit = (text: string) => {
    const v = text.trim();
    if (!v || status === "submitted" || status === "streaming") return;
    sendMessage({ text: v });
    setInput("");
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="scrollbar-thin flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 && welcome}
          <div className="flex flex-col gap-6">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {status === "submitted" && (
              <div className="flex items-start gap-3">
                <Avatar role="assistant" />
                <div className="flex h-8 items-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              </div>
            )}
          </div>

          {messages.length === 0 && suggestions && suggestions.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded-xl border border-border bg-card p-3 text-left text-sm text-card-foreground transition-colors hover:border-primary/50 hover:bg-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="relative flex items-end gap-2 rounded-2xl border border-input bg-card p-2 shadow-sm focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15"
          >
            <Textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              placeholder={placeholder}
              rows={1}
              className="max-h-48 min-h-[40px] resize-none border-0 bg-transparent px-2 py-2 shadow-none focus-visible:ring-0"
            />
            {status === "streaming" ? (
              <Button type="button" onClick={() => stop()} size="icon" variant="secondary">
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || status === "submitted"}
                className="brand-gradient text-white hover:opacity-90"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </form>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Voya AI can make mistakes. Verify important info.
          </p>
        </div>
      </div>
    </div>
  );
}

function Avatar({ role }: { role: "user" | "assistant" }) {
  if (role === "assistant") {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg brand-gradient text-white">
        <Bot className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <User className="h-4 w-4" />
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar role={isUser ? "user" : "assistant"} />
      <div
        className={
          isUser
            ? "max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
            : "max-w-[85%] text-sm text-foreground"
        }
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-pre:bg-muted prose-pre:text-foreground prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
