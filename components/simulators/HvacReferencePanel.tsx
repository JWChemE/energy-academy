"use client";

import { useState } from "react";
import { AIR, PRICES, AFFINITY, TYPICAL_COP, VENTILATION } from "@/lib/hvacTables";
import { HvacRefTable } from "@/lib/hvacCases";

/**
 * HVAC reference data — air-side heat, affinity laws, COP, ventilation rates and
 * prices. Always on hand in the Calculate step; the *method* is behind the hint.
 */
export default function HvacReferencePanel({ tables }: { tables: HvacRefTable[] }) {
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
          {tables.includes("air") && (
            <Block title="Air-side heat">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">Q (kW) = 1.2 × flow (m³/s) × ΔT (K)</span>
              </p>
              <p className="text-slate-500">
                Air ρ ≈ {AIR.density} kg/m³, cp ≈ {AIR.cp} kJ/kg·K → ρ·cp ≈ {AIR.volHeat} kJ/m³·K.
                Note 1,000 L/s = 1 m³/s.
              </p>
            </Block>
          )}
          {tables.includes("affinity") && (
            <Block title="Fan / pump affinity laws">
              <p className="text-slate-600">
                Flow ∝ speed · Pressure ∝ speed² ·{" "}
                <span className="font-mono font-semibold">Power ∝ speed³</span>
              </p>
              <Table head={["Speed %", "Power %"]} rows={AFFINITY.map((a) => [a.speedPct, a.powerPct])} />
            </Block>
          )}
          {tables.includes("cop") && (
            <Block title="Chiller COP">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">COP = cooling output ÷ electrical input</span>{" "}
                → electrical = cooling ÷ COP.
              </p>
              <Table head={["Type", "Typical COP"]} rows={TYPICAL_COP.map((t) => [t.type, t.cop])} />
            </Block>
          )}
          {tables.includes("ventilation") && (
            <Block title="Ventilation">
              <p className="text-slate-500">
                Fresh air ≈ {VENTILATION.perPerson_Ls} L/s per person. CO₂: outdoor ~
                {VENTILATION.co2Outdoor} ppm; above ~{VENTILATION.co2Target} ppm suggests
                under-ventilation. Well below it suggests over-ventilation.
              </p>
            </Block>
          )}
          {tables.includes("costs") && (
            <Block title="Energy prices">
              <p className="text-slate-500">
                Electricity £{PRICES.elec.toFixed(2)}/kWh. Heating: gas £{PRICES.gas.toFixed(3)}/kWh,
                boiler {Math.round(PRICES.boilerEff * 100)}% efficient (so delivered heat ={" "}
                <span className="font-mono">kW × h ÷ {PRICES.boilerEff} × £{PRICES.gas}</span>).
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

function Table({ head, rows }: { head: string[]; rows: (number | string)[][] }) {
  return (
    <div className="mt-1 overflow-x-auto">
      <table className="text-xs">
        <thead>
          <tr className="text-slate-400">
            {head.map((h) => (
              <th key={h} className="px-2 py-1 text-left font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono text-slate-700">
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100">
              {r.map((c, j) => (
                <td key={j} className="px-2 py-1">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
