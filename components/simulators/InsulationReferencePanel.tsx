"use client";

import { useState } from "react";
import { LAMBDA, LAGGING_REDUCTION, SAFE_TOUCH, PRICES } from "@/lib/insulationTables";
import { InsulationRefTable } from "@/lib/insulationCases";

/**
 * Insulation reference data — heat-loss relationships, bare-pipe losses, material
 * conductivities, the economic-thickness idea, surface-temperature safety and
 * prices. Always on hand in the Calculate step; the method stays behind the hint.
 */
export default function InsulationReferencePanel({ tables }: { tables: InsulationRefTable[] }) {
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
          {tables.includes("heatloss") && (
            <Block title="Surface heat loss">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">Q = U × A × ΔT</span> (W). Bare hot surface U ≈
                6–10 W/m²K (the steel adds almost no resistance).
              </p>
              <p className="text-slate-500">
                Resistance R = thickness ÷ λ; U = 1 ÷ ΣR. Annual energy = kW × hours.
              </p>
            </Block>
          )}
          {tables.includes("pipeloss") && (
            <Block title="Bare pipe & fitting loss">
              <p className="text-slate-600">
                A bare 100 mm pipe at 150 °C loses ~400–600 W/m to a 20 °C room. A bare valve loses as much
                as several metres of pipe.
              </p>
              <p className="text-slate-500">
                Lagging cuts the loss ≈ {Math.round(LAGGING_REDUCTION * 100)}%. Total loss = W/m × length.
              </p>
            </Block>
          )}
          {tables.includes("lambda") && (
            <Block title="Material conductivity λ (W/m·K)">
              <p className="text-slate-600">
                Aerogel {LAMBDA.aerogel} · PIR/phenolic {LAMBDA.pir} · EPS {LAMBDA.eps} · mineral wool{" "}
                {LAMBDA.mineralWool} · calcium silicate {LAMBDA.calciumSilicate} (high-temp).
              </p>
              <p className="text-slate-500">
                Thickness for a resistance = λ × R. Cold pipes need closed-cell insulation + a continuous
                vapour barrier.
              </p>
            </Block>
          )}
          {tables.includes("economic") && (
            <Block title="Economic thickness">
              <p className="text-slate-600">
                Each added millimetre saves less than the last (diminishing returns) while costing the
                same. The optimum is where marginal saving = marginal cost.
              </p>
              <p className="text-slate-500">
                Below it you waste heat; far above it you waste money. BS 5422 tabulates it by size and
                temperature.
              </p>
            </Block>
          )}
          {tables.includes("safety") && (
            <Block title="Surface-temperature safety">
              <p className="text-slate-600">
                Safe-touch limit ≈ <span className="font-mono font-semibold">{SAFE_TOUCH} °C</span>. Above
                ~70 °C a touch burns in ~1 second.
              </p>
              <p className="text-slate-500">
                Insulate accessible hot surfaces to safe touch, or guard them — safety can demand more
                insulation than energy alone.
              </p>
            </Block>
          )}
          {tables.includes("prices") && (
            <Block title="Energy price">
              <p className="text-slate-500">
                Displaced heat £{PRICES.heat.toFixed(2)}/kWh; electricity £{PRICES.elec.toFixed(2)}/kWh;
                cooling COP ≈ {PRICES.coolingCop}. Annual = kW × hours × price.
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
