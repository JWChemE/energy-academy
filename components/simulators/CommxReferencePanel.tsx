"use client";

import { useState } from "react";
import { ACCEPTANCE, CP_WATER, PCT_PER_DEGREE, PRICES } from "@/lib/commxTables";
import { CommxRefTable } from "@/lib/commxCases";

/**
 * Commissioning reference data — acceptance criteria, performance testing, sensor
 * verification, drift and prices. Always on hand in the Calculate step; the
 * method stays behind the hint.
 */
export default function CommxReferencePanel({ tables }: { tables: CommxRefTable[] }) {
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
          {tables.includes("acceptance") && (
            <Block title="Commissioning & acceptance">
              <p className="text-slate-600">
                Commissioning bridges design intent and actual performance — 15–30% of new buildings have
                a significant gap.
              </p>
              <p className="text-slate-500">
                Acceptance: flow {ACCEPTANCE.flow}; capacity {ACCEPTANCE.capacity}; temperature{" "}
                {ACCEPTANCE.temp}. Fixing a defect now costs ~10× less than after handover.
              </p>
            </Block>
          )}
          {tables.includes("performance") && (
            <Block title="Performance testing">
              <p className="text-slate-600">
                Capacity ={" "}
                <span className="font-mono font-semibold">flow (kg/s) × {CP_WATER} × ΔT</span>. Accept
                within ±10% of design (boilers within 2–5% of nameplate).
              </p>
              <p className="text-slate-500">Verify duct static against the {ACCEPTANCE.ductStatic} target.</p>
            </Block>
          )}
          {tables.includes("sensors") && (
            <Block title="Sensor verification">
              <p className="text-slate-600">
                Check every sensor against a calibrated reference. A sensor error offsets the control by
                the same amount.
              </p>
              <p className="text-slate-500">Over-/under-conditioning costs ≈ {PCT_PER_DEGREE}% per °C.</p>
            </Block>
          )}
          {tables.includes("drift") && (
            <Block title="Drift & re-commissioning">
              <p className="text-slate-600">
                Performance drifts after handover (sensors, setpoints, fouling). Re-commissioning recovers
                5–10%.
              </p>
              <p className="text-slate-500">Cost to prevent ~£500–1,500/yr; cost of not preventing 5–15% of energy.</p>
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
