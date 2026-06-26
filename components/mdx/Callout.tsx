import type { ReactNode } from "react";

type Variant = "note" | "tip" | "warning" | "key";

const styles: Record<
  Variant,
  { wrap: string; label: string; icon: string; defaultTitle: string }
> = {
  note: {
    wrap: "border-slate-200 bg-slate-50",
    label: "text-slate-600",
    icon: "ℹ️",
    defaultTitle: "Note",
  },
  tip: {
    wrap: "border-emerald-200 bg-emerald-50",
    label: "text-emerald-700",
    icon: "💡",
    defaultTitle: "Tip",
  },
  warning: {
    wrap: "border-amber-200 bg-amber-50",
    label: "text-amber-700",
    icon: "⚠️",
    defaultTitle: "Watch out",
  },
  key: {
    wrap: "border-brand-200 bg-brand-50",
    label: "text-brand-700",
    icon: "🔑",
    defaultTitle: "Key idea",
  },
};

export function Callout({
  variant = "note",
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: ReactNode;
}) {
  const s = styles[variant];
  return (
    <div className={`my-6 rounded-xl border p-4 ${s.wrap}`}>
      <div
        className={`mb-1 flex items-center gap-2 text-sm font-semibold ${s.label}`}
      >
        <span aria-hidden>{s.icon}</span>
        <span>{title ?? s.defaultTitle}</span>
      </div>
      <div className="text-sm leading-relaxed text-slate-700 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
