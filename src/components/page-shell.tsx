import type { ReactNode } from "react";

export function PageHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-border bg-card/40 px-6 py-5">
      <div className="mx-auto flex max-w-5xl items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient text-white shadow">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-6">{children}</div>
  );
}
