"use client";

import { useState } from "react";
import { CP_WATER, HL_TO_KG, PRICES } from "@/lib/breweryTables";
import { BreweryRefTable } from "@/lib/breweryCases";

/**
 * Brewery diagnostics reference data — wort/water properties and glycol
 * capacity-scaling. Always on hand in the Calculate step; the method stays
 * behind the hint.
 */
export default function BreweryReferencePanel({ tables }: { tables: BreweryRefTable[] }) {
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
          {tables.includes("heat") && (
            <Block title="Wort / water heat">
              <p className="text-slate-600">
                Heat = mass × specific heat × ΔT, ÷ 3,600 for kWh. Wort ≈ water: specific heat{" "}
                {CP_WATER} kJ/kg·K, {HL_TO_KG} kg per hectolitre.
              </p>
            </Block>
          )}
          {tables.includes("glycol") && (
            <Block title="Glycol jacket capacity">
              <p className="text-slate-600">
                Cooling capacity scales roughly with the approach temperature (wort − glycol supply). A
                fouled condenser raises glycol supply temperature and shrinks that approach.
              </p>
              <p className="text-slate-500">Actual capacity ≈ design capacity × (actual ΔT ÷ design ΔT).</p>
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
