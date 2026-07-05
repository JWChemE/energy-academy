import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared chrome for the quick-reference data pages: title, lead, a shown
 * "last reviewed" date, and consistent table styling with horizontal scroll
 * on narrow screens.
 */

export function RefShell({
  title,
  lead,
  reviewed,
  children,
}: {
  title: string;
  lead: string;
  /** ISO date the data was last checked. */
  reviewed: string;
  children: ReactNode;
}) {
  const reviewedLabel = new Date(reviewed).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <nav className="text-sm text-slate-400">
        <Link href="/reference" className="hover:text-slate-600">
          Quick reference
        </Link>{" "}
        <span aria-hidden>/</span>
      </nav>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-3 text-slate-600">{lead}</p>
      <p className="mt-2 text-xs text-slate-400">
        Last reviewed {reviewedLabel}. Figures are indicative working values
        for first-pass estimates; confirm anything compliance- or
        design-critical against the cited source.
      </p>
      <div className="mt-8 space-y-10">{children}</div>
    </div>
  );
}

export function RefSection({
  heading,
  children,
  note,
}: {
  heading: string;
  children: ReactNode;
  note?: string;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-slate-900">{heading}</h2>
      {note && <p className="mt-1.5 text-sm text-slate-600">{note}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function RefTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-slate-600">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {rows.map((row, i) => (
            <tr key={i} className="bg-white">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RefLinks({
  taught,
  sources,
}: {
  taught: { href: string; label: string }[];
  sources: { href: string; label: string }[];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm">
      <div>
        <span className="font-semibold text-slate-900">
          Where this is taught:
        </span>{" "}
        {taught.map((t, i) => (
          <span key={t.href}>
            {i > 0 && " · "}
            <Link href={t.href} className="text-brand-700 underline">
              {t.label}
            </Link>
          </span>
        ))}
      </div>
      <div className="mt-2">
        <span className="font-semibold text-slate-900">Sources:</span>{" "}
        {sources.map((s, i) => (
          <span key={s.href}>
            {i > 0 && " · "}
            <a
              href={s.href}
              rel="noopener noreferrer"
              target="_blank"
              className="text-brand-700 underline"
            >
              {s.label}
            </a>
          </span>
        ))}
      </div>
    </section>
  );
}
