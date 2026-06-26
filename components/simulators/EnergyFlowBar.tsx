"use client";

import { LossBreakdown } from "@/lib/steamBoilerPhysics";

/**
 * The teaching centrepiece: 100% of fuel energy in, split into useful heat and
 * each loss. Watching a segment grow or shrink as you move a lever is what
 * turns the abstract word "efficiency" into something you can see.
 */

interface Segment {
  key: keyof LossBreakdown;
  label: string;
  color: string;
  hint: string;
}

const SEGMENTS: Segment[] = [
  { key: "usefulHeat", label: "Useful heat to steam", color: "#16a34a", hint: "The energy that actually does work — this is your efficiency." },
  { key: "dryGasLoss", label: "Dry flue-gas loss", color: "#f97316", hint: "Sensible heat carried up the stack. Driven by excess air and stack temperature — your main controllable loss." },
  { key: "moistureLoss", label: "Moisture (latent) loss", color: "#fbbf24", hint: "Latent heat in the water vapour from burning natural gas. Largely fixed — only a condensing economiser recovers some of it." },
  { key: "incompleteCombustionLoss", label: "Incomplete combustion", color: "#dc2626", hint: "Unburnt fuel (CO/soot) when the flame is starved of air. Should be near zero — if it isn't, add air." },
  { key: "blowdownLoss", label: "Blowdown loss", color: "#0ea5e9", hint: "Heat dumped with the hot boiler water you blow down to control dissolved solids." },
  { key: "radiationLoss", label: "Radiation & convection", color: "#64748b", hint: "Heat lost through the casing. A fixed amount of kW, so it bites harder as a share at low load." },
  { key: "foulingLoss", label: "Fouling penalty", color: "#7c3aed", hint: "Degraded heat transfer on a worn/scaled boiler. Tuning can't fix it — only cleaning or overhaul." },
];

export default function EnergyFlowBar({ losses }: { losses: LossBreakdown }) {
  const visible = SEGMENTS.filter((s) => losses[s.key] > 0.05);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Where the fuel energy goes</h3>
        <span className="text-xs text-slate-500">100% fuel energy in</span>
      </div>

      {/* The stacked bar */}
      <div className="flex h-9 w-full overflow-hidden rounded-lg ring-1 ring-slate-200">
        {visible.map((s) => (
          <div
            key={s.key}
            className="group relative h-full"
            style={{
              width: `${losses[s.key]}%`,
              backgroundColor: s.color,
              transition: "width 0.4s ease",
            }}
            title={`${s.label}: ${losses[s.key].toFixed(1)}%`}
          >
            {losses[s.key] >= 8 && (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {losses[s.key].toFixed(0)}%
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Legend with live values + teaching hints */}
      <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {visible.map((s) => (
          <div key={s.key} className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 h-3 w-3 flex-shrink-0 rounded-sm" style={{ backgroundColor: s.color }} />
            <div>
              <span className="font-medium text-slate-800">{s.label}</span>{" "}
              <span className="font-mono text-slate-500">{losses[s.key].toFixed(1)}%</span>
              <p className="text-[11px] leading-snug text-slate-500">{s.hint}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
