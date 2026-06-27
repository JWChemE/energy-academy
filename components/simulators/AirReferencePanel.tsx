"use client";

import { useState } from "react";
import {
  SPECIFIC_POWER,
  UNLOADED_FRACTION,
  PRESSURE_PCT_PER_BAR,
  HEAT_RECOVERABLE_FRACTION,
  PRICES,
} from "@/lib/airTables";
import { AirRefTable } from "@/lib/airCases";

/**
 * Compressed-air reference data — specific power, unloaded running, the pressure
 * rule, heat recovery and prices. Always on hand in the Calculate step; the
 * method is behind the hint.
 */
export default function AirReferencePanel({ tables }: { tables: AirRefTable[] }) {
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
          {tables.includes("specificpower") && (
            <Block title="Specific power (cost of air)">
              <p className="text-slate-600">
                ≈ <span className="font-mono font-semibold">{SPECIFIC_POWER} kW per m³/min</span> of free
                air at ~7 bar (about 0.10 kWh per m³).
              </p>
              <p className="text-slate-500">Power for a flow = flow (m³/min) × {SPECIFIC_POWER}.</p>
            </Block>
          )}
          {tables.includes("unloaded") && (
            <Block title="Loaded vs unloaded">
              <p className="text-slate-500">
                A fixed-speed screw on load/unload still draws ~
                {Math.round(UNLOADED_FRACTION * 100)}% of full power when unloaded — making no air.
                A VSD compressor ramps power down with demand.
              </p>
            </Block>
          )}
          {tables.includes("pressure") && (
            <Block title="Pressure rule of thumb">
              <p className="text-slate-600">
                Energy changes by roughly{" "}
                <span className="font-mono font-semibold">{PRESSURE_PCT_PER_BAR}% per 1 bar</span> of
                system pressure. Saving % = bar change × {PRESSURE_PCT_PER_BAR}.
              </p>
            </Block>
          )}
          {tables.includes("heat") && (
            <Block title="Heat recovery">
              <p className="text-slate-600">
                ≈ <span className="font-mono font-semibold">{Math.round(HEAT_RECOVERABLE_FRACTION * 100)}%</span>{" "}
                of the compressor's electrical input is recoverable as useful heat.
              </p>
              <p className="text-slate-500">
                Displacing gas heat: kWh ÷ {PRICES.boilerEff} × £{PRICES.gas}.
              </p>
            </Block>
          )}
          {tables.includes("costs") && (
            <Block title="Energy price">
              <p className="text-slate-500">
                Electricity £{PRICES.elec.toFixed(2)}/kWh. Annual cost ={" "}
                <span className="font-mono">kW × hours × £{PRICES.elec.toFixed(2)}</span>.
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
