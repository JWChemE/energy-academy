import type { ReactNode } from "react";

type Variant = "note" | "tip" | "warning" | "key";

function Icon({ variant }: { variant: Variant }) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-4 w-4",
    "aria-hidden": true,
  };
  switch (variant) {
    case "note":
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8h.01M11 12h1v4h1" />
        </svg>
      );
    case "tip":
      return (
        <svg {...shared}>
          <path d="M9 18h6M10 21h4" />
          <path d="M12 3a6 6 0 0 0-4 10.5c.7.6 1 1.5 1 2.5h6c0-1 .3-1.9 1-2.5A6 6 0 0 0 12 3Z" />
        </svg>
      );
    case "warning":
      return (
        <svg {...shared}>
          <path d="M12 3 2.5 20h19L12 3Z" />
          <path d="M12 10v4M12 17h.01" />
        </svg>
      );
    case "key":
      return (
        <svg {...shared}>
          <circle cx="8" cy="15" r="4" />
          <path d="m11 12 9-9M17 6l3 3M14 9l2 2" />
        </svg>
      );
  }
}

const styles: Record<Variant, { wrap: string; label: string; defaultTitle: string }> = {
  note: {
    wrap: "border-slate-200 bg-slate-50",
    label: "text-slate-600",
    defaultTitle: "Note",
  },
  tip: {
    wrap: "border-denim-200 bg-denim-50",
    label: "text-denim-700",
    defaultTitle: "Tip",
  },
  warning: {
    wrap: "border-honey-200 bg-honey-50",
    label: "text-honey-700",
    defaultTitle: "Watch out",
  },
  key: {
    wrap: "border-brand-200 bg-brand-50",
    label: "text-brand-700",
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
        <Icon variant={variant} />
        <span>{title ?? s.defaultTitle}</span>
      </div>
      <div className="text-sm leading-relaxed text-slate-700 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
