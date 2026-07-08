"use client";

import { useState } from "react";
import { PRICES, WATER } from "@/lib/foodTables";
import { FoodRefTable } from "@/lib/foodCases";

/**
 * Food diagnostics reference data — water-heating arithmetic and the
 * defrost double-payment principle. Always on hand in the Calculate step;
 * the method stays behind the hint.
 */
export default function FoodReferencePanel({ tables }: { tables: FoodRefTable[] }) {
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
          {tables.includes("water") && (
            <Block title="Heating water">
              <p className="text-slate-600">
                Heat = mass (kg) × specific heat × ΔT, ÷ 3,600 for kWh. Water: {WATER.cp} kJ/kg·K,{" "}
                {WATER.kgPerM3.toLocaleString()} kg per m³. Gas input = heat ÷ boiler efficiency.
              </p>
            </Block>
          )}
          {tables.includes("defrost") && (
            <Block title="Defrost pays twice">
              <p className="text-slate-600">
                Heat released inside a freezer must be removed again by the refrigeration plant:
                extra compressor electricity = heat added ÷ COP.
              </p>
              <p className="text-slate-500">
                At COP 1.5, each kWh of defrost heat costs a further ~0.67 kWh at the compressor.
              </p>
            </Block>
          )}
          {tables.includes("prices") && (
            <Block title="Energy prices">
              <p className="text-slate-500">
                Gas £{PRICES.gas.toFixed(2)}/kWh; electricity £{PRICES.elec.toFixed(2)}/kWh.
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
