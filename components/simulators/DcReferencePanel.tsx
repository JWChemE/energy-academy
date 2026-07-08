"use client";

import { useState } from "react";
import { PRICES, UPS_EFFICIENCY } from "@/lib/dcTables";
import { DcRefTable } from "@/lib/dcCases";

/**
 * Data centre diagnostics reference data — the fan cube law and the UPS
 * part-load efficiency curve. Always on hand in the Calculate step; the
 * method stays behind the hint.
 */
export default function DcReferencePanel({ tables }: { tables: DcRefTable[] }) {
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
          {tables.includes("fans") && (
            <Block title="Fan affinity (cube law)">
              <p className="text-slate-600">
                Fan power scales with the cube of speed: P₂ = P₁ × (N₂/N₁)³. A data centre runs
                8,760 hours a year, so every steady fan kilowatt is 8,760 kWh.
              </p>
            </Block>
          )}
          {tables.includes("ups") && (
            <Block title="UPS efficiency vs load (typical older double-conversion)">
              <p className="text-slate-600">
                {UPS_EFFICIENCY.map((r) => `${r.loadPct}% load → ${(r.eff * 100).toFixed(1).replace(".0", "")}%`).join(" · ")}
              </p>
              <p className="text-slate-500">Input = IT load ÷ efficiency; loss = input − IT load.</p>
            </Block>
          )}
          {tables.includes("prices") && (
            <Block title="Energy price">
              <p className="text-slate-500">Electricity £{PRICES.elec.toFixed(2)}/kWh.</p>
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
