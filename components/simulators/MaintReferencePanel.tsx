"use client";

import { useState } from "react";
import { STRATEGIES, DEGRADATION, FLUE_PCT_PER_20C, PRICES } from "@/lib/maintTables";
import { MaintRefTable } from "@/lib/maintCases";

/**
 * Maintenance reference data — strategy, degradation mechanisms, condition
 * monitoring and prices. Always on hand in the Calculate step; the method stays
 * behind the hint.
 */
export default function MaintReferencePanel({ tables }: { tables: MaintRefTable[] }) {
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
          {tables.includes("strategy") && (
            <Block title="Maintenance strategy">
              <p className="text-slate-600">
                <strong>Reactive:</strong> {STRATEGIES.reactive}. <strong>Preventive:</strong>{" "}
                {STRATEGIES.preventive}. <strong>Predictive:</strong> {STRATEGIES.predictive}.
              </p>
              <p className="text-slate-500">Match the strategy to each asset&apos;s criticality and energy significance.</p>
            </Block>
          )}
          {tables.includes("degradation") && (
            <Block title="How equipment loses efficiency">
              <p className="text-slate-600">
                Boiler flue temp: every ~20 °C rise ≈ {FLUE_PCT_PER_20C}% loss. Boiler scale:{" "}
                {DEGRADATION.scalePerMm} per mm. Belt slip: {DEGRADATION.beltSlip}.
              </p>
              <p className="text-slate-500">
                Neglect compounds — a poorly maintained building drifts {DEGRADATION.buildingDrift} above
                optimal. Deferral&apos;s energy cost usually dwarfs the saving.
              </p>
            </Block>
          )}
          {tables.includes("monitoring") && (
            <Block title="Condition monitoring">
              <p className="text-slate-600">
                Vibration (bearing wear, imbalance), thermography (hot spots, fouling), oil analysis,
                efficiency trending — catch faults weeks early.
              </p>
              <p className="text-slate-500">The same degradation that ends in failure wastes energy all the way down.</p>
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
