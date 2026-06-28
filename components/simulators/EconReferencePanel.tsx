"use client";

import { useState } from "react";
import { ANNUITY } from "@/lib/econTables";
import { EconRefTable } from "@/lib/econCases";

/**
 * Economic-analysis reference data — payback, time value, NPV/IRR, annuity
 * factors, TCO, financing and portfolio. Always on hand in the Calculate step;
 * the method stays behind the hint.
 */
export default function EconReferencePanel({ tables }: { tables: EconRefTable[] }) {
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
          {tables.includes("payback") && (
            <Block title="Simple payback">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">Payback = cost ÷ annual saving</span>. Screen
                only: &lt; 3 yr almost certainly do; &gt; 7 yr verify with NPV.
              </p>
              <p className="text-slate-500">Ignores time value, project life and residual value.</p>
            </Block>
          )}
          {tables.includes("tvm") && (
            <Block title="Time value of money">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">PV = future ÷ (1 + r)^years</span>. A pound today
                is worth more than a pound tomorrow.
              </p>
              <p className="text-slate-500">A typical energy-project discount (hurdle) rate is 6–10%.</p>
            </Block>
          )}
          {tables.includes("npvirr") && (
            <Block title="NPV, IRR & annuity factors">
              <p className="text-slate-600">
                NPV = (annual saving × annuity factor) − cost; accept if &gt; 0. IRR = the rate where NPV =
                0; accept if &gt; hurdle. For mutually exclusive projects, pick the highest NPV.
              </p>
              <p className="text-slate-500 font-mono">
                Annuity factors: 8%,5={ANNUITY["8,5"]} · 8%,15={ANNUITY["8,15"]} · 5%,20={ANNUITY["5,20"]} ·
                5%,25={ANNUITY["5,25"]} · 6%,10={ANNUITY["6,10"]} · 12%,10={ANNUITY["12,10"]}
              </p>
            </Block>
          )}
          {tables.includes("tco") && (
            <Block title="Total cost of ownership">
              <p className="text-slate-600">
                TCO = capital + operating + maintenance − residual, over the life. When operating cost
                dominates, high-efficiency usually wins despite higher capital.
              </p>
            </Block>
          )}
          {tables.includes("financing") && (
            <Block title="Financing">
              <p className="text-slate-600">
                Cash (no interest, needs capital); loan (use when IRR &gt; loan rate); ESCO (no capital,
                guaranteed savings, but keeps 50–70%).
              </p>
            </Block>
          )}
          {tables.includes("portfolio") && (
            <Block title="Portfolio & risk">
              <p className="text-slate-600">
                Same NPV ≠ same risk. Apply a higher hurdle rate to uncertain projects, and sequence
                high-certainty quick wins first.
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
