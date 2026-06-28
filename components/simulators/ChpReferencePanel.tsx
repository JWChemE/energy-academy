"use client";

import { useState } from "react";
import { EFF, PRICES, CARBON, SIZING } from "@/lib/chpTables";
import { ChpRefTable } from "@/lib/chpCases";

/**
 * CHP reference data — typical efficiencies, the spark-spread formula, energy
 * prices, carbon factors and the sizing rules. Always on hand in the Calculate
 * step; the method stays behind the hint.
 */
export default function ChpReferencePanel({ tables }: { tables: ChpRefTable[] }) {
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
          {tables.includes("efficiency") && (
            <Block title="Efficiencies (of fuel input)">
              <p className="text-slate-600">
                Electrical ≈ <span className="font-mono font-semibold">{Math.round(EFF.elec * 100)}%</span>{" "}
                · thermal ≈ <span className="font-mono font-semibold">{Math.round(EFF.thermal * 100)}%</span>{" "}
                · overall ≈ <span className="font-mono font-semibold">{Math.round(EFF.overall * 100)}%</span>.
              </p>
              <p className="text-slate-500">
                Overall = (electricity + <em>useful</em> heat) ÷ fuel. Heat that is dumped does not count.
              </p>
            </Block>
          )}
          {tables.includes("sparkspread") && (
            <Block title="Spark spread (net benefit per hour)">
              <p className="text-slate-600 font-mono">
                elec displaced + heat displaced − gas − maintenance
              </p>
              <p className="text-slate-500">
                Fuel input = electrical output ÷ electrical efficiency. Heat displaced = heat × (gas ÷
                boiler eff). Maintenance = £{PRICES.maint}/kWhe.
              </p>
            </Block>
          )}
          {tables.includes("prices") && (
            <Block title="Energy prices">
              <p className="text-slate-600">
                Electricity: import (self-use) £{PRICES.elecImport.toFixed(2)}/kWh, export £
                {PRICES.elecExport.toFixed(2)}/kWh. Gas £{PRICES.gas.toFixed(2)}/kWh; boiler{" "}
                {Math.round(PRICES.boilerEff * 100)}%.
              </p>
              <p className="text-slate-500">
                Heat value = kWh × (gas ÷ {PRICES.boilerEff}). Self-consumption is worth 2–4× export.
                <em> Some cases state different prices — use the brief.</em>
              </p>
            </Block>
          )}
          {tables.includes("carbon") && (
            <Block title="Carbon factors">
              <p className="text-slate-600">
                Gas <span className="font-mono font-semibold">{CARBON.gas} kg/kWh</span> · grid now ≈{" "}
                <span className="font-mono font-semibold">{CARBON.grid} kg/kWh</span> (was {CARBON.grid2012} in 2012).
              </p>
              <p className="text-slate-500">
                CHP electricity carbon = gas ÷ electrical efficiency. Compare all gas burned vs grid
                electricity + boiler heat.
              </p>
            </Block>
          )}
          {tables.includes("sizing") && (
            <Block title="Sizing & run hours">
              <p className="text-slate-600">
                Good schemes run{" "}
                <span className="font-mono font-semibold">
                  {SIZING.goodRunHoursLow.toLocaleString()}–{SIZING.goodRunHoursHigh.toLocaleString()} h/yr
                </span>
                . Capacity factor = run hours ÷ {SIZING.hoursPerYear.toLocaleString()}.
              </p>
              <p className="text-slate-500">
                Size to the heat base load (present ≥4,500 h), not the peak or the electrical demand.
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
