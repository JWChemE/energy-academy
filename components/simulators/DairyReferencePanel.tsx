"use client";

import { useState } from "react";
import { DairyRefTable } from "@/lib/dairyCases";

/**
 * Dairy diagnostics reference data — regeneration arithmetic and the
 * two-rate tariff. Always on hand in the Calculate step; the method stays
 * behind the hint.
 */
export default function DairyReferencePanel({ tables }: { tables: DairyRefTable[] }) {
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
          {tables.includes("regen") && (
            <Block title="Pasteuriser regeneration">
              <p className="text-slate-600">
                Total duty = mass flow × specific heat × ΔT (milk cp ≈ 3.9 kJ/kg·K, ÷ 3,600 for
                kW). The hot section only supplies the share regeneration doesn&apos;t:
                top-up = (1 − effectiveness) × total duty.
              </p>
            </Block>
          )}
          {tables.includes("tariff") && (
            <Block title="Two-rate tariff">
              <p className="text-slate-600">
                Stored cold costs electricity ÷ COP, priced at whichever rate applies when the
                compressors run. The ice is identical; the price of making it is not.
              </p>
            </Block>
          )}
          {tables.includes("prices") && (
            <Block title="Energy prices">
              <p className="text-slate-500">
                Gas £0.06/kWh. Electricity in case 2: 14p/kWh off-peak (00:00–07:00), 24p/kWh day.
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
