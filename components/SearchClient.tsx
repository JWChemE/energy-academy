"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SearchDoc } from "@/lib/searchIndex";

/**
 * Client-side search over the build-time index.
 *
 * Hand-rolled tokenised scorer — at ~300 documents a library would be
 * overkill. Each query token must match somewhere (AND semantics); fields
 * are weighted title(3) > headings(2) > snippet/context(1), with a bonus
 * for prefix matches at word starts.
 */

type Scored = { doc: SearchDoc; score: number };

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/[^a-z0-9°£%]+/)
    .filter((t) => t.length >= 2);
}

function fieldScore(field: string, token: string, weight: number): number {
  const lower = field.toLowerCase();
  const at = lower.indexOf(token);
  if (at === -1) return 0;
  // Word-start (prefix) matches beat mid-word ones.
  const wordStart = at === 0 || /[^a-z0-9]/.test(lower[at - 1]);
  return weight * (wordStart ? 2 : 1);
}

function scoreDoc(doc: SearchDoc, tokens: string[]): number {
  let total = 0;
  for (const token of tokens) {
    const s =
      fieldScore(doc.title, token, 3) +
      fieldScore(doc.headings, token, 2) +
      fieldScore(doc.snippet, token, 1) +
      fieldScore(doc.context, token, 1);
    if (s === 0) return 0; // every token must match somewhere
    total += s;
  }
  return total;
}

const BADGE_STYLES: Record<string, string> = {
  "Level 1": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Level 2": "bg-sky-50 text-sky-700 ring-sky-200",
  "Level 3": "bg-violet-50 text-violet-700 ring-violet-200",
  Sector: "bg-amber-50 text-amber-700 ring-amber-200",
  Course: "bg-slate-100 text-slate-700 ring-slate-200",
  Reference: "bg-teal-50 text-teal-700 ring-teal-200",
  Tool: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Glossary: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function SearchClient({ docs }: { docs: SearchDoc[] }) {
  const [query, setQuery] = useState("");

  const results: Scored[] = useMemo(() => {
    const tokens = tokenize(query);
    if (tokens.length === 0) return [];
    return docs
      .map((doc) => ({ doc, score: scoreDoc(doc, tokens) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);
  }, [docs, query]);

  const showEmpty = query.trim().length >= 2 && results.length === 0;

  return (
    <div className="mt-6">
      <label htmlFor="site-search" className="sr-only">
        Search the site
      </label>
      <input
        id="site-search"
        type="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Try “power factor”, “steam trap”, “payback”…"
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
      />

      {results.length > 0 && (
        <>
          <p className="mt-4 text-sm text-slate-500">
            {results.length === 40 ? "Top 40" : results.length} result
            {results.length === 1 ? "" : "s"}
          </p>
          <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {results.map(({ doc }) => (
              <li key={doc.href}>
                <Link
                  href={doc.href}
                  className="block px-4 py-3.5 transition-colors hover:bg-slate-50"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-slate-900">
                      {doc.title}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        BADGE_STYLES[doc.badge] ?? BADGE_STYLES.Course
                      }`}
                    >
                      {doc.badge}
                    </span>
                    {doc.minutes > 0 && (
                      <span className="text-xs text-slate-400">
                        {doc.minutes} min
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    {doc.context}
                  </div>
                  {doc.snippet && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                      {doc.snippet}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {showEmpty && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-sm font-medium text-slate-700">
            No results for “{query.trim()}”
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try a different term, or browse the{" "}
            <Link href="/glossary" className="text-brand-700 underline">
              glossary
            </Link>{" "}
            and{" "}
            <Link href="/reference" className="text-brand-700 underline">
              quick reference
            </Link>
            .
          </p>
        </div>
      )}

      {query.trim().length < 2 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Link
            href="/glossary"
            className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <div className="text-sm font-semibold text-slate-900">Glossary</div>
            <p className="mt-1 text-xs text-slate-500">
              Every term defined, linked to the lesson that teaches it.
            </p>
          </Link>
          <Link
            href="/reference"
            className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <div className="text-sm font-semibold text-slate-900">
              Quick reference
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Steam tables, motor classes, unit conversions, prices.
            </p>
          </Link>
          <Link
            href="/tools"
            className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <div className="text-sm font-semibold text-slate-900">Tools</div>
            <p className="mt-1 text-xs text-slate-500">
              Calculators and interactive simulators.
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
