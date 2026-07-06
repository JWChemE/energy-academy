"use client";

import { useState } from "react";

/**
 * Interactive power triangle for the electrical science course: drag the power
 * factor and watch reactive power (kVAr) and apparent power (kVA) change while
 * real power (kW) stays fixed.
 *
 * Reference example matches the power-factor lesson: a 400 kW site at pf 0.80
 * draws 500 kVA; corrected to 0.95 it draws 421 kVA, freeing ~79 kVA.
 */

const KW = 400;

const COL_REAL = "#059669"; // brand-600 — real power
const COL_REACTIVE = "#d97706"; // amber-600 — reactive power
// Palette validated (CVD ΔE 39.3 protan, contrast ≥3:1 on white); every side
// of the triangle is directly labelled, so identity never rests on colour.

// Plot geometry: triangle base along the bottom.
const BX0 = 70, BX1 = 470, BY = 250; // base from (BX0,BY) to (BX1,BY)
const PX_PER_KW = (BX1 - BX0) / KW; // horizontal scale
// tan φ at pf 0.6 is 1.333 → max height 533 kVAr → 533*PX_PER_KW = 533px… too
// tall, so use a smaller vertical scale and label values instead.
const PX_PER_KVAR = 0.36;

export default function PowerFactorTriangle() {
  const [pf, setPf] = useState(0.8);

  const phi = Math.acos(pf);
  const kvar = KW * Math.tan(phi);
  const kva = KW / pf;
  const freedVs95 = pf < 0.95 ? KW / pf - KW / 0.95 : 0;

  const topY = BY - kvar * PX_PER_KVAR;

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-2.5">
        <span className="text-sm font-bold text-slate-800">
          The power triangle, live: drag the power factor
        </span>
      </div>

      <div className="px-4 pt-3">
        <svg
          viewBox="0 0 560 290"
          className="h-auto w-full select-none"
          role="img"
          aria-label={`At power factor ${pf.toFixed(2)}: ${KW} kilowatts real, ${kvar.toFixed(0)} kVAr reactive, ${kva.toFixed(0)} kVA apparent`}
        >
          {/* right-angle marker */}
          <path
            d={`M ${BX1 - 14} ${BY} L ${BX1 - 14} ${BY - 14} L ${BX1} ${BY - 14}`}
            fill="none" stroke="#cbd5e1" strokeWidth="1.5"
          />

          {/* apparent power (hypotenuse) */}
          <line x1={BX0} y1={BY} x2={BX1} y2={topY} stroke="#334155" strokeWidth="3" />
          <text
            x={(BX0 + BX1) / 2 - 14}
            y={(BY + topY) / 2 - 12}
            fontSize="12.5" fontWeight="700" fill="#334155"
            transform={`rotate(${(-Math.atan2(BY - topY, BX1 - BX0) * 180) / Math.PI} ${(BX0 + BX1) / 2 - 14} ${(BY + topY) / 2 - 12})`}
          >
            Apparent {kva.toFixed(0)} kVA: what the supply must carry
          </text>

          {/* real power (base) */}
          <line x1={BX0} y1={BY} x2={BX1} y2={BY} stroke={COL_REAL} strokeWidth="3.5" />
          <text x={(BX0 + BX1) / 2} y={BY + 20} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#047857">
            Real {KW} kW: the useful work (fixed)
          </text>

          {/* reactive power (vertical) */}
          <line x1={BX1} y1={BY} x2={BX1} y2={topY} stroke={COL_REACTIVE} strokeWidth="3.5" />
          <text
            x={BX1 + 10} y={(BY + topY) / 2 + 4}
            fontSize="12.5" fontWeight="700" fill="#b45309"
          >
            Reactive
          </text>
          <text
            x={BX1 + 10} y={(BY + topY) / 2 + 20}
            fontSize="12.5" fontWeight="700" fill="#b45309"
          >
            {kvar.toFixed(0)} kVAr
          </text>

          {/* angle arc + phi */}
          <path
            d={`M ${BX0 + 52} ${BY} A 52 52 0 0 0 ${BX0 + 52 * Math.cos(Math.atan2(BY - topY, BX1 - BX0))} ${BY - 52 * Math.sin(Math.atan2(BY - topY, BX1 - BX0))}`}
            fill="none" stroke="#94a3b8" strokeWidth="1.5"
          />
          <text x={BX0 + 62} y={BY - 10} fontSize="11" fill="#64748b">
            φ · pf = cos φ = {pf.toFixed(2)}
          </text>
        </svg>
      </div>

      <div className="px-5 pb-4">
        <label className="mt-1 flex items-center gap-3 text-sm text-slate-600">
          <span className="shrink-0 font-medium">Power factor</span>
          <input
            type="range"
            min={0.6}
            max={1}
            step={0.01}
            value={pf}
            onChange={(e) => setPf(Number(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-brand-600"
            aria-label="Power factor"
          />
          <span className="w-12 text-right font-bold tabular-nums text-slate-900">{pf.toFixed(2)}</span>
        </label>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <Stat chip="#334155" label="Apparent power" value={`${kva.toFixed(0)} kVA`} />
          <Stat chip={COL_REACTIVE} label="Reactive power" value={`${kvar.toFixed(0)} kVAr`} />
          <Stat
            label="Freed by correcting to 0.95"
            value={pf < 0.95 ? `${freedVs95.toFixed(0)} kVA` : "at target"}
            emphasis
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          A site doing {KW} kW of useful work. The supply, cables and transformer must all carry the
          kVA, and larger tariffs charge for it, which is why correcting a poor power factor (the
          lesson's 0.80 → 0.95 example frees ~79 kVA) buys back capacity without saving a single kWh.
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
