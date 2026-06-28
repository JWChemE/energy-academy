"use client";

import { useState } from "react";
import { STRATEGY_SAVINGS, PCT_PER_DEGREE, PRICES, COOLING_COP } from "@/lib/ctrlTables";
import { CtrlRefTable } from "@/lib/ctrlCases";

/**
 * Control-systems & BMS reference data — control modes, energy strategies, loop
 * coordination, sensors and valve authority. Always on hand in the Calculate
 * step; the method stays behind the hint.
 */
export default function CtrlReferencePanel({ tables }: { tables: CtrlRefTable[] }) {
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
          {tables.includes("modes") && (
            <Block title="Control modes">
              <p className="text-slate-600">
                On-off oscillates and overshoots; P has offset; <strong>PID</strong> holds tight with no
                offset or overshoot.
              </p>
              <p className="text-slate-500">PID vs on-off saves ≈ {STRATEGY_SAVINGS.pidVsOnOff} — tight control wastes less.</p>
            </Block>
          )}
          {tables.includes("strategies") && (
            <Block title="Energy strategies">
              <p className="text-slate-600">
                Setpoint reset (weather comp) {STRATEGY_SAVINGS.setpointReset} · occupancy{" "}
                {STRATEGY_SAVINGS.occupancy} · sequencing {STRATEGY_SAVINGS.sequencing}.
              </p>
              <p className="text-slate-500">Condition only when occupied; reset to the weather; run only the units needed.</p>
            </Block>
          )}
          {tables.includes("coordination") && (
            <Block title="Loop coordination">
              <p className="text-slate-600">
                Use a deadband so heating and cooling never run together (e.g. heat &lt; 19 °C, cool &gt; 24
                °C). Coordination saves ≈ {STRATEGY_SAVINGS.coordination}.
              </p>
              <p className="text-slate-500">Cooling electricity = cooling output ÷ COP (≈ {COOLING_COP}).</p>
            </Block>
          )}
          {tables.includes("sensors") && (
            <Block title="Sensors">
              <p className="text-slate-600">
                Sensors drift ~1–2%/yr and must sit in a representative spot (wall height, away from sun,
                radiators, draughts).
              </p>
              <p className="text-slate-500">
                Over-/under-conditioning costs ≈ {PCT_PER_DEGREE}% per °C of error.
              </p>
            </Block>
          )}
          {tables.includes("authority") && (
            <Block title="Valve authority">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">Authority = valve drop ÷ total loop drop</span>;
                target 0.3–0.5.
              </p>
              <p className="text-slate-500">Too low → small effective range → sluggish, hunting control.</p>
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
