"use client";

import { useState } from "react";
import { CP_WATER, AIR_FACTOR, LATENT_STEAM, CONDENSING_RECOVERY, PRICES } from "@/lib/whrTables";
import { WhrRefTable } from "@/lib/whrCases";

/**
 * Waste-heat-recovery reference data — heat-rate constants, effectiveness, the
 * supply/demand matching rules, condensing recovery and prices. Always on hand in
 * the Calculate step; the method stays behind the hint.
 */
export default function WhrReferencePanel({ tables }: { tables: WhrRefTable[] }) {
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
          {tables.includes("heatrate") && (
            <Block title="Heat rate">
              <p className="text-slate-600">
                Water: <span className="font-mono font-semibold">Q(kW) = ṁ(kg/s) × {CP_WATER} × ΔT</span>.
                Air: <span className="font-mono font-semibold">Q(kW) = {AIR_FACTOR} × V(m³/s) × ΔT</span>.
              </p>
              <p className="text-slate-500">
                Chiller: heat rejected = cooling + work. Flash steam latent ≈ {LATENT_STEAM} kJ/kg (1 kW =
                3,600 kJ/h).
              </p>
            </Block>
          )}
          {tables.includes("effectiveness") && (
            <Block title="Heat-exchanger effectiveness">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">ε = actual rise ÷ maximum possible rise</span>{" "}
                (max rise = source − cold inlet).
              </p>
              <p className="text-slate-500">
                A clean HX manages 60–85%; fouling lowers ε and raises the approach temperature.
              </p>
            </Block>
          )}
          {tables.includes("matching") && (
            <Block title="Supply / demand matching">
              <p className="text-slate-600">
                A project needs all four: <strong>supply, demand, temperature match, timing overlap</strong>.
              </p>
              <p className="text-slate-500">
                Useful recovery = available heat × utilisation (overlap). Improve it with thermal storage or
                by rescheduling.
              </p>
            </Block>
          )}
          {tables.includes("condensing") && (
            <Block title="Flue-gas / condensing recovery">
              <p className="text-slate-600">
                A flue economiser / condensing retrofit recovers ≈{" "}
                <span className="font-mono font-semibold">{Math.round(CONDENSING_RECOVERY * 100)}% of fuel input</span>,
                cooling the flue from ~180 °C towards 50–60 °C.
              </p>
              <p className="text-slate-500">The feedwater is a guaranteed, always-on sink.</p>
            </Block>
          )}
          {tables.includes("prices") && (
            <Block title="Energy price">
              <p className="text-slate-500">
                Displaced heat (gas/steam) £{PRICES.heat.toFixed(2)}/kWh; electricity £
                {PRICES.elec.toFixed(2)}/kWh. Annual value = kW × hours × price.
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
