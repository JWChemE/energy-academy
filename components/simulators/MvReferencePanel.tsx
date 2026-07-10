"use client";

import { useState } from "react";
import { IPMVP, PRICES } from "@/lib/mvTables";
import { MvRefTable } from "@/lib/mvCases";

/**
 * M&V reference data — the savings equation, baselines, normalisation, IPMVP
 * options and the common pitfalls. Always on hand in the Calculate step; the
 * method stays behind the hint.
 */
export default function MvReferencePanel({ tables }: { tables: MvRefTable[] }) {
  const [open, setOpen] = useState(true);
  if (tables.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-bold text-slate-900"
      >
        📑 Reference data {open ? "▾" : "▸"}
      </button>
      {open && (
        <div className="space-y-4 border-t border-slate-100 px-4 py-3 text-xs">
          {tables.includes("savings") && (
            <Block title="The savings equation">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">Saving = adjusted baseline − actual</span>. The
                adjusted baseline is what it WOULD have used under the reporting period&apos;s conditions.
              </p>
              <p className="text-slate-500">It&apos;s avoided energy use — not just a lower bill.</p>
            </Block>
          )}
          {tables.includes("baseline") && (
            <Block title="Baseline model">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">Energy = base load + Σ(coeff × driver)</span> —
                fitted by regression. R² &gt; 0.75 is a good fit for monthly data.
              </p>
              <p className="text-slate-500">Include every genuine driver (weather, production, occupancy); resist spurious ones (over-fitting).</p>
            </Block>
          )}
          {tables.includes("normalisation") && (
            <Block title="Weather normalisation">
              <p className="text-slate-600">
                Use degree-days. Compare actual against what the baseline would have used under the SAME
                weather.
              </p>
              <p className="text-slate-500">Never compare raw bills year-on-year — don&apos;t credit a mild winter.</p>
            </Block>
          )}
          {tables.includes("ipmvp") && (
            <Block title="IPMVP options">
              <p className="text-slate-600">
                <strong>A</strong> {IPMVP.A.split(" (")[0]}. <strong>B</strong> all-parameter. <strong>C</strong>{" "}
                whole-facility (needs ≳10% to show). <strong>D</strong> calibrated simulation.
              </p>
              <p className="text-slate-500">Small isolated measure → A/B; whole-building package → C; no baseline → D.</p>
            </Block>
          )}
          {tables.includes("pitfalls") && (
            <Block title="Pitfalls — avoid overstatement">
              <p className="text-slate-600">
                Non-routine adjustments when static factors change; report savings with uncertainty;
                rebound is 5–20%; savings can decay (persistence).
              </p>
              <p className="text-slate-500">Set the rules in advance; report what actually happened.</p>
            </Block>
          )}
          {tables.includes("prices") && (
            <Block title="Energy prices">
              <p className="text-slate-500">
                Electricity £{PRICES.elec.toFixed(2)}/kWh; gas heat £{PRICES.heat.toFixed(2)}/kWh.
              </p>
            </Block>
          )}
        </div>
      )}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 font-semibold text-slate-700">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
