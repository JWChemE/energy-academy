"use client";

import { useState } from "react";
import { COP, PRICES, SETPOINT_COP_PER_C, SUPERHEAT_TARGET, SUBCOOLING_TARGET } from "@/lib/refrigTables";
import { RefrigRefTable } from "@/lib/refrigCases";

/**
 * Refrigeration & heat-pump reference data — COP, the setpoint and tuning rules,
 * superheat/subcooling targets and prices. Always on hand in the Calculate step;
 * the method stays behind the hint.
 */
export default function RefrigReferencePanel({ tables }: { tables: RefrigRefTable[] }) {
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
          {tables.includes("cop") && (
            <Block title="COP — the efficiency metric">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">COP = useful output ÷ compressor work</span>;
                so electrical input = output ÷ COP.
              </p>
              <p className="text-slate-500">
                Energy balance: heat rejected = cooling + work. Resistance heat = COP {COP.resistance};
                chiller ≈ {COP.chiller}; heat pump ≈ {COP.ashp}–{COP.gshp}.
              </p>
            </Block>
          )}
          {tables.includes("tuning") && (
            <Block title="Superheat & subcooling">
              <p className="text-slate-600">
                Superheat = measured − saturation (evaporator outlet); target{" "}
                <span className="font-mono">{SUPERHEAT_TARGET}</span>. Subcooling = saturation − measured
                (condenser exit); target <span className="font-mono">{SUBCOOLING_TARGET}</span>.
              </p>
              <p className="text-slate-500">
                High superheat + low subcooling → undercharge/leak. Low superheat → overcharge / slugging.
              </p>
            </Block>
          )}
          {tables.includes("setpoint") && (
            <Block title="Setpoints & free cooling">
              <p className="text-slate-600">
                Chiller COP improves ≈{" "}
                <span className="font-mono font-semibold">{Math.round(SETPOINT_COP_PER_C * 100)}% per °C</span>{" "}
                of higher chilled-water (or cooler condenser) temperature.
              </p>
              <p className="text-slate-500">
                Free cooling / waterside economiser: on cold days the cooling tower meets the load
                directly and the compressor switches off.
              </p>
            </Block>
          )}
          {tables.includes("partload") && (
            <Block title="Part-load control">
              <p className="text-slate-600">
                Hot-gas bypass and on-off cycling keep the compressor near full power for part-load
                cooling — wasteful.
              </p>
              <p className="text-slate-500">
                A VFD slows the compressor to track the load, restoring near-design COP at part load.
              </p>
            </Block>
          )}
          {tables.includes("prices") && (
            <Block title="Energy price">
              <p className="text-slate-500">
                Electricity £{PRICES.elec.toFixed(2)}/kWh. Running cost = (output ÷ COP) × hours × £
                {PRICES.elec.toFixed(2)}.
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
