"use client";

import { useState } from "react";
import {
  IE_EFFICIENCY,
  EFF_VS_LOAD,
  BELT_EFF,
  AFFINITY,
  PF_TABLE,
  PRICES,
  CURRENT_IMBALANCE_FACTOR,
} from "@/lib/motorTables";
import { MotorRefTable } from "@/lib/motorCases";

/**
 * Motors & drives reference data — efficiency by class and load, the affinity
 * laws, power-factor trig, belt-drive losses and voltage imbalance. Always on
 * hand in the Calculate step; the method is behind the hint.
 */
export default function MotorReferencePanel({ tables }: { tables: MotorRefTable[] }) {
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
            <Block title="Motor efficiency">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">input = output ÷ efficiency</span> ·{" "}
                shaft = input × efficiency
              </p>
              <Table head={["IE class", "Full-load η"]} rows={IE_EFFICIENCY.map((r) => [r.class, r.eff])} />
              <Table head={["Load %", "η (typical)"]} rows={EFF_VS_LOAD.map((r) => [r.loadPct, r.eff])} />
            </Block>
          )}
          {tables.includes("affinity") && (
            <Block title="Fan / pump affinity laws">
              <p className="text-slate-600">
                Flow ∝ speed · <span className="font-mono font-semibold">Power ∝ speed³</span>
              </p>
              <Table head={["Speed %", "Power %"]} rows={AFFINITY.map((a) => [a.speedPct, a.powerPct])} />
            </Block>
          )}
          {tables.includes("powerfactor") && (
            <Block title="Power factor">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">kVA = kW ÷ PF</span> · capacitor kVAr = kW × (tan φ₁ − tan φ₂)
              </p>
              <Table head={["PF (cos φ)", "tan φ"]} rows={PF_TABLE.map((r) => [r.pf, r.tan])} />
            </Block>
          )}
          {tables.includes("belts") && (
            <Block title="Belt-drive efficiency">
              <p className="text-slate-600">loss = input × (1 − η) · saving = input × (η_new − η_old)</p>
              <Table head={["Drive type", "η"]} rows={BELT_EFF.map((b) => [b.type, b.eff])} />
            </Block>
          )}
          {tables.includes("imbalance") && (
            <Block title="Voltage imbalance">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">imbalance % = max deviation from average ÷ average × 100</span>
              </p>
              <p className="text-slate-500">
                Rule of thumb: current imbalance ≈ {CURRENT_IMBALANCE_FACTOR} × voltage imbalance %.
                A few % of voltage imbalance causes serious overheating.
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
