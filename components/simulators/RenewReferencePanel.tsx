"use client";

import { useState } from "react";
import { PRICES, SPECIFIC_YIELD, BATTERY_RTE, COST_PER_KWP } from "@/lib/renewTables";
import { RenewRefTable } from "@/lib/renewCases";

/**
 * Renewable-energy reference data — PV yield, self-consumption value, shading,
 * battery, the wind cube law and prices. Always on hand in the Calculate step;
 * the method stays behind the hint.
 */
export default function RenewReferencePanel({ tables }: { tables: RenewRefTable[] }) {
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
          {tables.includes("pvyield") && (
            <Block title="PV yield">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">Annual energy = kWp × specific yield</span>. UK
                specific yield ≈ {SPECIFIC_YIELD} kWh/kWp/yr (800–1,000 for a well-oriented system).
              </p>
              <p className="text-slate-500">
                Installed cost ≈ £{COST_PER_KWP}/kWp (commercial). North ≈ 70% of south; east-west ≈ 85%.
              </p>
            </Block>
          )}
          {tables.includes("selfconsume") && (
            <Block title="Self-consumption value">
              <p className="text-slate-600">
                Value = self-consumed × retail + exported × export rate. Self-consumption is worth{" "}
                <span className="font-semibold">2–4× export</span>.
              </p>
              <p className="text-slate-500">Size to the daytime demand; shift loads / store to lift self-consumption.</p>
            </Block>
          )}
          {tables.includes("shading") && (
            <Block title="Shading">
              <p className="text-slate-600">
                Cells are wired in series, so shading one panel throttles the whole string — like a kink in
                a hosepipe.
              </p>
              <p className="text-slate-500">Optimisers / microinverters manage panels individually.</p>
            </Block>
          )}
          {tables.includes("battery") && (
            <Block title="Battery">
              <p className="text-slate-600">
                Round-trip efficiency ≈ {Math.round(BATTERY_RTE * 100)}% (lithium-ion). Delivered = stored ×
                efficiency.
              </p>
              <p className="text-slate-500">Banks midday surplus for the evening — turns export into self-use.</p>
            </Block>
          )}
          {tables.includes("wind") && (
            <Block title="Wind — the cube law">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">Power ∝ (wind speed)³</span>. Double the speed →
                8× the power.
              </p>
              <p className="text-slate-500">
                Average speed matters more than gusts; want ~5–6 m/s+. Roof sites are turbulent and usually
                disappoint.
              </p>
            </Block>
          )}
          {tables.includes("prices") && (
            <Block title="Electricity prices">
              <p className="text-slate-500">
                Retail (self-consumed) £{PRICES.retail.toFixed(2)}/kWh; export £{PRICES.export.toFixed(2)}/kWh.
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
