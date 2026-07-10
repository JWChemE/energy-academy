"use client";

import { useMemo, useState } from "react";
import { PRICES } from "@/lib/pinchTables";

/**
 * Interactive composite curves for the pinch analysis course: slide the cold
 * composite curve along the heat axis and watch ΔTmin, the pinch location and
 * both minimum utilities change together.
 *
 * Stream data is the course's canonical four-stream example
 * (building-composite-curves lesson):
 *   Hot composite:  (0 kW, 40 °C) → (60, 60) → (465, 150) → (555, 180)
 *   Cold composite: (x₀, 30) → (x₀+80, 50) → (x₀+800, 170) → (x₀+840, 190)
 * Overall balance: QH − QC = 840 − 555 = 285 kW, so QH = 285 + x₀, QC = x₀.
 * Verified against the lesson's table: x₀ = 0/30/70 → ΔTmin 10/20/30 °C and
 * QH 285/315/355 kW.
 */

const COL_HOT = "#d97706"; // amber-600 — hot composite
const COL_COLD = "#059669"; // brand-600 — cold composite
// Palette validated (CVD ΔE 39.3 protan, contrast ≥3:1 on white); both curves
// also carry direct labels, so identity never rests on colour alone.

const HOURS = 8000;

// Hot composite kinks as (heat kW, temp °C), heat measured from the cold end.
const HOT: [number, number][] = [
  [0, 40],
  [60, 60],
  [465, 150],
  [555, 180],
];
// Cold composite kinks relative to its own start.
const COLD_REL: [number, number][] = [
  [0, 30],
  [80, 50],
  [800, 170],
  [840, 190],
];

function tempOnCurve(pts: [number, number][], H: number): number {
  for (let i = 1; i < pts.length; i++) {
    if (H <= pts[i][0]) {
      const [h0, t0] = pts[i - 1];
      const [h1, t1] = pts[i];
      return t0 + ((H - h0) / (h1 - h0)) * (t1 - t0);
    }
  }
  return pts[pts.length - 1][1];
}

/** Minimum vertical gap and the heat coordinate where it occurs. */
function pinch(x0: number): { dtmin: number; at: number } {
  const kinks = [
    ...HOT.map(([h]) => h),
    ...COLD_REL.map(([h]) => h + x0),
  ].filter((h) => h >= x0 && h <= 555);
  let dtmin = Infinity;
  let at = x0;
  for (const H of kinks) {
    const gap = tempOnCurve(HOT, H) - tempOnCurve(COLD_REL.map(([h, t]) => [h + x0, t] as [number, number]), H);
    if (gap < dtmin) {
      dtmin = gap;
      at = H;
    }
  }
  return { dtmin, at };
}

// Plot geometry: x = heat 0–1000 kW (the cold curve ends at x0 + 840, up to
// 990 at full slider travel), y = temp 20–200 °C.
const X0 = 46, X1 = 548, Y0 = 14, Y1 = 262;
const H_MAX = 1000, T_MIN = 20, T_MAX = 200;
const xScale = (h: number) => X0 + (h / H_MAX) * (X1 - X0);
const yScale = (t: number) => Y1 - ((t - T_MIN) / (T_MAX - T_MIN)) * (Y1 - Y0);

function polyline(pts: [number, number][]): string {
  return pts.map(([h, t], i) => `${i ? "L" : "M"} ${xScale(h).toFixed(1)} ${yScale(t).toFixed(1)}`).join(" ");
}

export default function CompositeCurvesExplorer() {
  const [x0, setX0] = useState(30);

  const { dtmin, at } = useMemo(() => pinch(x0), [x0]);
  const qh = 285 + x0;
  const qc = x0;
  const cost = (qh * PRICES.hotUtility + qc * PRICES.coldUtility) * HOURS;

  const coldPts: [number, number][] = COLD_REL.map(([h, t]) => [h + x0, t]);
  const hotPath = useMemo(() => polyline(HOT), []);
  const coldPath = polyline(coldPts);

  const pinchTop = yScale(tempOnCurve(HOT, at));
  const pinchBot = yScale(tempOnCurve(coldPts, at));

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-2.5">
        <span className="text-sm font-bold text-slate-800">
          Composite curves, live: slide the cold curve
        </span>
      </div>

      <div className="px-4 pt-3">
        <svg
          viewBox="0 0 560 306"
          className="h-auto w-full select-none"
          role="img"
          aria-label={`Cold curve shifted ${x0} kW: minimum approach temperature ${dtmin.toFixed(0)} degrees, hot utility ${qh} kW, cold utility ${qc} kW`}
        >
          {/* grid + axes */}
          {[50, 100, 150, 200].map((t) => (
            <g key={t}>
              <line x1={X0} y1={yScale(t)} x2={X1} y2={yScale(t)} stroke="#e2e8f0" strokeWidth="1" />
              <text x={X0 - 6} y={yScale(t) + 3.5} textAnchor="end" fontSize="10.5" fill="#64748b">
                {t}°
              </text>
            </g>
          ))}
          {[0, 200, 400, 600, 800, 1000].map((h) => (
            <text key={h} x={xScale(h)} y={Y1 + 16} textAnchor="middle" fontSize="10.5" fill="#64748b">
              {h}
            </text>
          ))}
          <text x={(X0 + X1) / 2} y={296} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
            Heat (kW)
          </text>
          <text
            x={13} y={(Y0 + Y1) / 2} fontSize="11" fill="#475569" fontWeight="600"
            textAnchor="middle" transform={`rotate(-90 13 ${(Y0 + Y1) / 2})`}
          >
            Temperature (°C)
          </text>

          {/* utility brackets */}
          {qc > 2 && (
            <g>
              <line x1={xScale(0)} y1={yScale(34)} x2={xScale(qc)} y2={yScale(34)} stroke={COL_COLD} strokeWidth="5" opacity="0.35" />
              <text x={xScale(qc / 2)} y={yScale(34) + 16} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#047857">
                QC {qc} kW
              </text>
            </g>
          )}
          <line x1={xScale(555)} y1={yScale(186)} x2={xScale(x0 + 840 > H_MAX ? H_MAX : x0 + 840)} y2={yScale(186)} stroke={COL_HOT} strokeWidth="5" opacity="0.35" />
          <text x={xScale(Math.min((555 + x0 + 840) / 2, H_MAX - 40))} y={yScale(186) - 8} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#b45309">
            QH {qh} kW
          </text>

          {/* curves */}
          <path d={hotPath} fill="none" stroke={COL_HOT} strokeWidth="2.5" />
          <path d={coldPath} fill="none" stroke={COL_COLD} strokeWidth="2.5" />

          {/* direct labels */}
          <text x={xScale(430)} y={yScale(tempOnCurve(HOT, 430)) - 9} fontSize="11" fontWeight="700" fill="#b45309">
            Hot composite
          </text>
          <text x={xScale(x0 + 320)} y={yScale(tempOnCurve(coldPts, x0 + 320)) + 18} fontSize="11" fontWeight="700" fill="#047857">
            Cold composite
          </text>

          {/* pinch marker */}
          <line x1={xScale(at)} y1={pinchTop} x2={xScale(at)} y2={pinchBot} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx={xScale(at)} cy={pinchTop} r="4.5" fill={COL_HOT} stroke="#fff" strokeWidth="1.5" />
          <circle cx={xScale(at)} cy={pinchBot} r="4.5" fill={COL_COLD} stroke="#fff" strokeWidth="1.5" />
          <text
            x={xScale(at) + 9} y={(pinchTop + pinchBot) / 2 + 4}
            fontSize="11.5" fontWeight="700" fill="#334155"
            stroke="#ffffff" strokeWidth="3.5" paintOrder="stroke"
          >
            pinch · ΔTmin {dtmin.toFixed(0)} °C
          </text>
        </svg>
      </div>

      <div className="px-5 pb-4">
        <label className="mt-1 flex items-center gap-3 text-sm text-slate-600">
          <span className="shrink-0 font-medium">Slide cold curve</span>
          <input
            type="range"
            min={0}
            max={150}
            value={x0}
            onChange={(e) => setX0(Number(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-brand-600"
            aria-label="Cold composite curve offset, kilowatts"
          />
          <span className="w-16 text-right font-bold tabular-nums text-slate-900">+{x0} kW</span>
        </label>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="ΔTmin at pinch" value={`${dtmin.toFixed(0)} °C`} emphasis />
          <Stat chip={COL_HOT} label="Min hot utility" value={`${qh} kW`} />
          <Stat chip={COL_COLD} label="Min cold utility" value={`${qc} kW`} />
          <Stat label="Utility cost" value={`£${Math.round(cost).toLocaleString()}/yr`} />
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          The course&apos;s four-stream example (H1, H2, C1, C2). Sliding the cold curve right loosens
          ΔTmin and adds utility at <em>both</em> ends; sliding left recovers more heat between the
          streams until the curves touch. Costs at {HOURS.toLocaleString()} h/yr, hot utility
          £{PRICES.hotUtility.toFixed(2)}/kWh, cold £{PRICES.coldUtility.toFixed(2)}/kWh.
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
