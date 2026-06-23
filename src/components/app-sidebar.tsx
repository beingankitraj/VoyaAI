import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  Plus,
  ListChecks,
  FolderKanban,
  ShieldCheck,
  Palette,
  Video,
  BookOpen,
  Smile,
  Users,
  Heart,
  Award,
  MessageSquare,
  Moon,
  Sun,
  Trash2,
  Settings,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useThreads } from "@/lib/use-threads";
import { Button } from "@/components/ui/button";

const featureNav = [
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/workspace", label: "Workspace", icon: FolderKanban },
  { to: "/privacy", label: "Privacy", icon: ShieldCheck },
];

const creative = [
  { to: "/designer", label: "AI Designer", icon: Palette },
  { to: "/video", label: "Video Companion", icon: Video },
  { to: "/story", label: "Story Builder", icon: BookOpen },
  { to: "/meme", label: "Meme Maker", icon: Smile },
];

const advanced = [
  { to: "/team", label: "AI Team", icon: Users },
  { to: "/journal", label: "Emotional Journal", icon: Heart },
  { to: "/achievements", label: "Achievements", icon: Award },
];

function NavItem({
  to,
  label,
  icon: Icon,
  exact,
}: {
  to: string;
  label: string;
  icon: typeof MessageSquare;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
      {children}
    </div>
  );
}

export function AppSidebar({ onClose }: { onClose?: () => void }) {
  const { theme, toggle } = useTheme();
  const { threads, createThread, deleteThread } = useThreads();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const handleNew = () => {
    const t = createThread();
    onClose?.();
    // navigate via Link below — but easier: window.location for SSR safety
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/chat/${t.id}`);
      // trigger router by dispatching popstate
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  };

  return (
    <aside className="flex h-dvh w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient text-white shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold brand-gradient-text">Voya AI</span>
        </Link>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* New chat */}
      <div className="px-3">
        <Button
          onClick={handleNew}
          variant="outline"
          className="w-full justify-start gap-2 border-sidebar-border bg-transparent hover:bg-sidebar-accent"
        >
          <Plus className="h-4 w-4" /> New Chat
        </Button>
      </div>

      {/* Scroll area */}
      <div className="scrollbar-thin mt-3 flex-1 overflow-y-auto px-2 pb-4">
        <nav className="flex flex-col gap-0.5">
          {featureNav.map((i) => (
            <NavItem key={i.to} {...i} />
          ))}
        </nav>

        <SectionLabel>Creative Tools</SectionLabel>
        <nav className="flex flex-col gap-0.5">
          {creative.map((i) => (
            <NavItem key={i.to} {...i} />
          ))}
        </nav>

        <SectionLabel>Advanced Features</SectionLabel>
        <nav className="flex flex-col gap-0.5">
          {advanced.map((i) => (
            <NavItem key={i.to} {...i} />
          ))}
        </nav>

        <SectionLabel>Recent Chats</SectionLabel>
        <div className="flex flex-col gap-0.5">
          {threads.length === 0 && (
            <div className="px-3 py-2 text-xs text-sidebar-foreground/50">
              No chats yet. Start a new one.
            </div>
          )}
          {threads.map((t) => {
            const active = path === `/chat/${t.id}`;
            return (
              <div
                key={t.id}
                className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
                }`}
              >
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  className="flex min-w-0 flex-1 items-center gap-2"
                  onClick={onClose}
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{t.title || "New Chat"}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => deleteThread(t.id)}
                  className="opacity-0 transition group-hover:opacity-100"
                  aria-label="Delete chat"
                >
                  <Trash2 className="h-3.5 w-3.5 text-sidebar-foreground/60 hover:text-destructive" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-sidebar-border p-3 text-xs text-sidebar-foreground/50">
        Local-only • Your chats live in this browser
      </div>
    </aside>
  );
}
