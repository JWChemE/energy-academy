"use client";

import { useState } from "react";
import { PRICES, WEEK, UNOCCUPIED_HOURS_YEAR } from "@/lib/creTables";
import { CreRefTable } from "@/lib/creCases";

/**
 * CRE diagnostics reference data — occupancy-hours arithmetic and the
 * coil/COP relationships. Always on hand in the Calculate step; the method
 * stays behind the hint.
 */
export default function CreReferencePanel({ tables }: { tables: CreRefTable[] }) {
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
          {tables.includes("hours") && (
            <Block title="Occupancy hours">
              <p className="text-slate-600">
                A week has {WEEK.totalHours} hours. At {WEEK.occupiedHours} occupied hours a week,
                the building sits empty for {WEEK.unoccupiedHours} h/week, which is{" "}
                {UNOCCUPIED_HOURS_YEAR.toLocaleString()} h/year.
              </p>
            </Block>
          )}
          {tables.includes("coil") && (
            <Block title="Boilers and chillers">
              <p className="text-slate-600">
                Gas input = coil duty ÷ boiler efficiency. Chiller electricity = heat removed ÷ COP.
              </p>
              <p className="text-slate-500">
                A coil delivering 60 kW from an 85%-efficient boiler burns 70.6 kW of gas; a COP-3
                chiller removes 60 kW for 20 kW of electricity.
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
