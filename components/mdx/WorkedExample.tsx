"use client";

import { useState } from "react";

/**
 * A structured worked example: Given → Find → Solution, with the solution
 * collapsed behind a "try it first" reveal so the reader has a genuine chance
 * to attempt it. Slot-based API (children are ordinary MDX markdown inside
 * the slots, so maths, links and lists all work):
 *
 *   <WorkedExample title="Heating the brewing liquor">
 *     <Given>
 *       - 3,500 kg of water, 12 °C → 68 °C
 *       - Specific heat 4.18 kJ/kg·K
 *     </Given>
 *     <Find>The heat required, in kWh.</Find>
 *     <Solution>
 *       Heat = 3,500 × 4.18 × 56 ÷ 3,600 ≈ **227.6 kWh**
 *     </Solution>
 *   </WorkedExample>
 *
 * Each slot is independent (no children inspection), so the components work
 * identically in the RSC path (Level 1) and the client path (gated lessons).
 */

export function WorkedExample({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-5 py-2.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-slate-500"
          aria-hidden
        >
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M9 7h6M9 12h.01M13 12h2M9 16h.01M13 16h2" />
        </svg>
        <span className="text-sm font-bold text-slate-800">
          Worked example{title ? ` — ${title}` : ""}
        </span>
      </div>
      <div className="space-y-4 px-5 py-4">{children}</div>
    </div>
  );
}

export function Given({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SlotLabel>Given</SlotLabel>
      <div className="text-sm text-slate-700 [&_li]:my-0.5 [&_p]:my-1 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}

export function Find({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SlotLabel>Find</SlotLabel>
      <div className="text-sm text-slate-700 [&_p]:my-1">{children}</div>
    </div>
  );
}

/** The answer, gated behind a "try it first" reveal. */
export function Solution({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <div className="-mx-5 -mb-4 border-t border-slate-100 px-5 py-3.5">
        <button
          onClick={() => setRevealed(true)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Try it yourself, then show the solution
        </button>
      </div>
    );
  }

  return (
    <div className="-mx-5 -mb-4 border-t border-slate-100 bg-brand-50/60 px-5 py-3.5">
      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-brand-600">
        Solution
      </div>
      <div className="text-sm text-slate-700 [&_p]:my-1.5">{children}</div>
    </div>
  );
}

function SlotLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
      {children}
    </div>
  );
}
