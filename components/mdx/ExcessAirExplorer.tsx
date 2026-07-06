"use client";

import { useMemo, useState } from "react";

/**
 * Interactive combustion-tuning demo for the boilers course: drag the flue-gas
 * oxygen reading and watch boiler efficiency respond. Too much air carries
 * heat up the flue; too little tips into incomplete combustion (CO, soot).
 *
 * Model (natural gas, gross CV basis, flue 180 °C / air 20 °C):
 *   CO₂% = 11.7 × (21 − O₂) / 21
 *   flue loss % = 0.38 × (T_flue − T_air) / CO₂%           (Siegert formula)
 *   latent loss ≈ 10.5%, radiation/other ≈ 2%
 *   below ~2.5% O₂ an indicative incomplete-combustion penalty ramps in.
 * Gives ≈81% at the 3% O₂ sweet spot, ≈79% at 8%, ≈75% at 12%: consistent
 * with the course's "80–85% shell boiler" figures.
 */

const T_FLUE = 180;
const T_AIR = 20;
const OUTPUT_KW = 2000; // reference boiler duty
const HOURS = 4000;
const GAS = 0.06; // £/kWh

const COL_EFF = "#059669"; // brand-600
const COL_DANGER = "#e11d48"; // rose-600 (status colour: the CO risk zone, labelled)

function efficiency(o2: number): number {
  const co2 = (11.7 * (21 - o2)) / 21;
  const flue = (0.38 * (T_FLUE - T_AIR)) / co2;
  const incomplete = o2 < 2.5 ? 1.3 * (2.5 - o2) ** 2 : 0;
  return 100 - flue - 10.5 - 2 - incomplete;
}

function gasCostPerYear(o2: number): number {
  return (OUTPUT_KW / (efficiency(o2) / 100)) * HOURS * GAS;
}

// Plot geometry: x = O₂ 0–12%, y = efficiency 70–85%.
const X0 = 46, X1 = 548, Y0 = 16, Y1 = 250;
const O2_MAX = 12, E_MIN = 70, E_MAX = 85;
const xScale = (o: number) => X0 + (o / O2_MAX) * (X1 - X0);
const yScale = (e: number) => Y1 - ((e - E_MIN) / (E_MAX - E_MIN)) * (Y1 - Y0);

export default function ExcessAirExplorer() {
  const [o2, setO2] = useState(6);

  const eff = efficiency(o2);
  const excessAir = (o2 / (21 - o2)) * 100;
  const extraCost = gasCostPerYear(o2) - gasCostPerYear(3);

  const path = useMemo(() => {
    const pts: string[] = [];
    for (let o = 0; o <= O2_MAX + 0.001; o += 0.15) {
      pts.push(`${pts.length ? "L" : "M"} ${xScale(o).toFixed(1)} ${yScale(efficiency(o)).toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-2.5">
        <span className="text-sm font-bold text-slate-800">
          Combustion tuning, live: flue oxygen vs efficiency
        </span>
      </div>

      <div className="px-4 pt-3">
        <svg
          viewBox="0 0 560 292"
          className="h-auto w-full select-none"
          role="img"
          aria-label={`At ${o2.toFixed(1)}% flue oxygen: boiler efficiency ${eff.toFixed(1)}%, excess air ${excessAir.toFixed(0)}%`}
        >
          {/* grid */}
          {[70, 75, 80, 85].map((e) => (
            <g key={e}>
              <line x1={X0} y1={yScale(e)} x2={X1} y2={yScale(e)} stroke="#e2e8f0" strokeWidth="1" />
              <text x={X0 - 6} y={yScale(e) + 3.5} textAnchor="end" fontSize="10.5" fill="#64748b">
                {e}%
              </text>
            </g>
          ))}
          {[0, 3, 6, 9, 12].map((o) => (
            <text key={o} x={xScale(o)} y={Y1 + 16} textAnchor="middle" fontSize="10.5" fill="#64748b">
              {o}%
            </text>
          ))}
          <text x={(X0 + X1) / 2} y={284} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
            Flue-gas oxygen (%)
          </text>
          <text
            x={13} y={(Y0 + Y1) / 2} fontSize="11" fill="#475569" fontWeight="600"
            textAnchor="middle" transform={`rotate(-90 13 ${(Y0 + Y1) / 2})`}
          >
            Boiler efficiency (gross)
          </text>

          {/* CO danger zone */}
          <rect x={X0} y={Y0} width={xScale(2.5) - X0} height={Y1 - Y0} fill={COL_DANGER} opacity="0.06" />
          <text x={xScale(1.25)} y={Y0 + 16} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={COL_DANGER}>
            ⚠ CO risk
          </text>
          <text x={xScale(1.25)} y={Y0 + 29} textAnchor="middle" fontSize="9.5" fill={COL_DANGER}>
            incomplete combustion
          </text>

          {/* sweet spot marker */}
          <line x1={xScale(3)} y1={Y0} x2={xScale(3)} y2={Y1} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
          <text x={xScale(3) + 5} y={Y0 + 12} fontSize="10" fill="#64748b">
            tuned: 3–5% O₂
          </text>

          {/* efficiency curve */}
          <path d={path} fill="none" stroke={COL_EFF} strokeWidth="2.5" />

          {/* current marker */}
          <circle cx={xScale(o2)} cy={yScale(eff)} r="6" fill={COL_EFF} stroke="#fff" strokeWidth="2" />
          <text
            x={xScale(o2) + (o2 > 9 ? -10 : 10)}
            y={yScale(eff) - 10}
            textAnchor={o2 > 9 ? "end" : "start"}
            fontSize="11.5" fontWeight="700" fill="#334155"
            stroke="#ffffff" strokeWidth="3.5" paintOrder="stroke"
          >
            {eff.toFixed(1)}%
          </text>
        </svg>
      </div>

      <div className="px-5 pb-4">
        <label className="mt-1 flex items-center gap-3 text-sm text-slate-600">
          <span className="shrink-0 font-medium">Flue O₂</span>
          <input
            type="range"
            min={0}
            max={12}
            step={0.1}
            value={o2}
            onChange={(e) => setO2(Number(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-brand-600"
            aria-label="Flue gas oxygen, percent"
          />
          <span className="w-14 text-right font-bold tabular-nums text-slate-900">{o2.toFixed(1)}%</span>
        </label>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <Stat chip={COL_EFF} label="Efficiency (gross)" value={`${eff.toFixed(1)}%`} />
          <Stat label="Excess air" value={`${excessAir.toFixed(0)}%`} />
          <Stat
            label="Extra gas vs tuned (3%)"
            value={extraCost > 500 ? `£${Math.round(extraCost / 100) * 100 >= 1000 ? (extraCost / 1000).toFixed(1) + "k" : Math.round(extraCost)}/yr` : "≈ tuned"}
            emphasis
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          Reference boiler: {OUTPUT_KW.toLocaleString()} kW of heat, {HOURS.toLocaleString()} h/yr,
          gas £{GAS.toFixed(2)}/kWh, flue at {T_FLUE} °C. Siegert flue-loss model on a gross-CV
          basis; the shape of the CO-risk penalty below ~2.5% O₂ is indicative. Real tuning uses a
          flue-gas analyser reading O₂ and CO together.
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
