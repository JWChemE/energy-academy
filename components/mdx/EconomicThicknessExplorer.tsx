"use client";

import { useMemo, useState } from "react";

/**
 * Interactive economic-thickness demo for the insulation course: drag the
 * insulation thickness on a hot pipe and watch the falling energy cost, the
 * rising insulation cost, and the total-cost curve with its minimum.
 *
 * Model: DN100 steel pipe (OD 114 mm) at 150 °C in 20 °C air, rock wool
 * λ = 0.045 W/mK, combined surface coefficient 12 W/m²K (bare loss ≈ 559 W/m,
 * matching the course's PIPE_LOSS table). Heat priced via an 85%-efficient
 * gas boiler at £0.06/kWh over 6,000 h/yr; installed insulation at
 * £(25 + 1.10/mm) per metre, annualised over 10 years. Optimum lands at
 * ≈90 mm — inside BS 5422's 80–120 mm band for hot mains.
 */

const R_PIPE = 0.057; // m, outside radius of DN100
const LAMBDA = 0.045;
const DT = 130;
const H_SURF = 12;
const HOURS = 6000;
const BOILER_EFF = 0.85;
const GAS = 0.06;
const CAP_BASE = 25; // £/m installed, at zero thickness
const CAP_PER_MM = 1.1;
const LIFE_YEARS = 10;

const COL_ENERGY = "#d97706"; // amber-600 — energy cost
const COL_TOTAL = "#059669"; // brand-600 — total cost
const COL_CAPITAL = "#64748b"; // slate-500 — annualised insulation cost
// Palette validated (CVD ΔE 39.3 protan, contrast ≥3:1 on white); all three
// curves carry direct labels, so identity never rests on colour alone.

function heatLossWperM(tMm: number): number {
  const t = tMm / 1000;
  if (t <= 0) return H_SURF * 2 * Math.PI * R_PIPE * DT;
  const rIns = Math.log((R_PIPE + t) / R_PIPE) / (2 * Math.PI * LAMBDA);
  const rSurf = 1 / (H_SURF * 2 * Math.PI * (R_PIPE + t));
  return DT / (rIns + rSurf);
}

function energyCost(tMm: number): number {
  return ((heatLossWperM(tMm) / 1000) * HOURS * GAS) / BOILER_EFF;
}
function capitalCost(tMm: number): number {
  return (CAP_BASE + CAP_PER_MM * tMm) / LIFE_YEARS;
}

// Find the optimum once (5 mm grid, same as the course verification).
const OPTIMUM = (() => {
  let best = 10;
  for (let t = 10; t <= 150; t += 5) {
    if (energyCost(t) + capitalCost(t) < energyCost(best) + capitalCost(best)) best = t;
  }
  return best;
})();

// Plot geometry: x = thickness 10–150 mm, y = £/m/yr 0–60.
const X0 = 46, X1 = 548, Y0 = 16, Y1 = 250;
const T_MIN = 10, T_MAX = 150, C_MAX = 60;
const xScale = (t: number) => X0 + ((t - T_MIN) / (T_MAX - T_MIN)) * (X1 - X0);
const yScale = (c: number) => Y1 - (Math.min(c, C_MAX) / C_MAX) * (Y1 - Y0);

function curve(fn: (t: number) => number): string {
  const pts: string[] = [];
  for (let t = T_MIN; t <= T_MAX + 0.01; t += 2) {
    pts.push(`${pts.length ? "L" : "M"} ${xScale(t).toFixed(1)} ${yScale(fn(t)).toFixed(1)}`);
  }
  return pts.join(" ");
}

export default function EconomicThicknessExplorer() {
  const [t, setT] = useState(40);

  const loss = heatLossWperM(t);
  const energy = energyCost(t);
  const capital = capitalCost(t);
  const total = energy + capital;
  const optTotal = energyCost(OPTIMUM) + capitalCost(OPTIMUM);

  const paths = useMemo(
    () => ({
      energy: curve(energyCost),
      capital: curve(capitalCost),
      total: curve((x) => energyCost(x) + capitalCost(x)),
    }),
    [],
  );

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-2.5">
        <span className="text-sm font-bold text-slate-800">
          Economic thickness, live: a hot pipe's total cost curve
        </span>
      </div>

      <div className="px-4 pt-3">
        <svg
          viewBox="0 0 560 292"
          className="h-auto w-full select-none"
          role="img"
          aria-label={`At ${t} millimetres of insulation: heat loss ${loss.toFixed(0)} watts per metre, total cost £${total.toFixed(0)} per metre per year; the optimum is about ${OPTIMUM} millimetres`}
        >
          {[0, 20, 40, 60].map((c) => (
            <g key={c}>
              <line x1={X0} y1={yScale(c)} x2={X1} y2={yScale(c)} stroke="#e2e8f0" strokeWidth="1" />
              <text x={X0 - 6} y={yScale(c) + 3.5} textAnchor="end" fontSize="10.5" fill="#64748b">
                £{c}
              </text>
            </g>
          ))}
          {[10, 50, 100, 150].map((x) => (
            <text key={x} x={xScale(x)} y={Y1 + 16} textAnchor="middle" fontSize="10.5" fill="#64748b">
              {x}
            </text>
          ))}
          <text x={(X0 + X1) / 2} y={284} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
            Insulation thickness (mm)
          </text>
          <text
            x={13} y={(Y0 + Y1) / 2} fontSize="11" fill="#475569" fontWeight="600"
            textAnchor="middle" transform={`rotate(-90 13 ${(Y0 + Y1) / 2})`}
          >
            Cost (£ per metre per year)
          </text>

          {/* curves */}
          <path d={paths.energy} fill="none" stroke={COL_ENERGY} strokeWidth="2" />
          <path d={paths.capital} fill="none" stroke={COL_CAPITAL} strokeWidth="2" strokeDasharray="5 4" />
          <path d={paths.total} fill="none" stroke={COL_TOTAL} strokeWidth="2.5" />

          {/* direct labels */}
          <text x={xScale(26)} y={yScale(energyCost(26)) - 8} fontSize="11" fontWeight="700" fill="#b45309">
            Energy
          </text>
          <text x={xScale(120)} y={yScale(capitalCost(120)) + 16} fontSize="11" fontWeight="700" fill="#475569">
            Insulation (annualised)
          </text>
          <text x={xScale(112)} y={yScale(energyCost(112) + capitalCost(112)) - 9} fontSize="11" fontWeight="700" fill="#047857">
            Total
          </text>

          {/* optimum marker */}
          <line x1={xScale(OPTIMUM)} y1={Y0} x2={xScale(OPTIMUM)} y2={Y1} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={xScale(OPTIMUM)} cy={yScale(optTotal)} r="4.5" fill="#fff" stroke={COL_TOTAL} strokeWidth="2" />
          <text x={xScale(OPTIMUM) + 6} y={Y0 + 12} fontSize="10" fill="#64748b">
            optimum ≈ {OPTIMUM} mm
          </text>

          {/* current marker */}
          <circle cx={xScale(t)} cy={yScale(total)} r="6" fill={COL_TOTAL} stroke="#fff" strokeWidth="2" />
        </svg>
      </div>

      <div className="px-5 pb-4">
        <label className="mt-1 flex items-center gap-3 text-sm text-slate-600">
          <span className="shrink-0 font-medium">Thickness</span>
          <input
            type="range"
            min={T_MIN}
            max={T_MAX}
            step={5}
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-brand-600"
            aria-label="Insulation thickness, millimetres"
          />
          <span className="w-16 text-right font-bold tabular-nums text-slate-900">{t} mm</span>
        </label>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <Stat label="Heat loss" value={`${loss.toFixed(0)} W/m`} />
          <Stat chip={COL_ENERGY} label="Energy cost" value={`£${energy.toFixed(1)}/m/yr`} />
          <Stat chip={COL_TOTAL} label="Total cost" value={`£${total.toFixed(1)}/m/yr`} emphasis />
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          DN100 pipe at 150 °C (bare loss ≈ 559 W/m ≈ £237/m/yr), rock wool, heat from an
          85%-efficient gas boiler at £{GAS.toFixed(2)}/kWh, {HOURS.toLocaleString()} h/yr,
          installed cost £{CAP_BASE} + £{CAP_PER_MM.toFixed(2)}/mm per metre over {LIFE_YEARS}{" "}
          years. Illustrative model; BS 5422 tabulates the real values by pipe size and temperature.
        </p>
      </div>
    </div>
  );
}

function Stat({
  chip,
  label,
  value,
  emphasis,
}: {
  chip?: string;
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${emphasis ? "border-brand-200 bg-brand-50" : "border-slate-200 bg-white"}`}>
      <div className="flex items-center gap-1.5">
        {chip && <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chip }} />}
        <span className="text-xs font-medium leading-tight text-slate-500">{label}</span>
      </div>
      <div className={`mt-0.5 text-lg font-bold tabular-nums tracking-tight ${emphasis ? "text-brand-700" : "text-slate-900"}`}>
        {value}
      </div>
    </div>
  );
}
