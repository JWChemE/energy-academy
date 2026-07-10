"use client";

import { useState } from "react";

/**
 * Interactive energy signature for the M&T course: twelve months of gas
 * consumption plotted against heating degree days, with a least-squares fit
 * computed live. Buttons inject the two classic faults from the lesson so
 * the reader sees how each moves the line: a base-load fault lifts the
 * intercept, a slope fault steepens the line, and the healthy fit stays
 * behind as a dashed reference.
 *
 * Underlying model matches the baseline lesson: 8,000 kWh/month base load
 * + 100 kWh per degree day, with realistic month-to-month variation
 * (healthy fit lands at ≈7,900 + 100.7/HDD, R² 0.97 — verified by script).
 */

const HDD = [330, 300, 270, 190, 110, 50, 25, 30, 80, 160, 250, 320];
const NOISE = [3200, -2700, 2000, -1800, 1300, -1000, 800, -600, 1700, -2900, 2400, -2000];

type Mode = "healthy" | "intercept" | "slope";

const MODES: Record<Mode, { label: string; base: number; perHdd: number; note: string }> = {
  healthy: {
    label: "Healthy year", base: 8000, perHdd: 100,
    note: "The points hug the line: the building responds to weather consistently. The intercept is the weather-independent load; the slope is the cost of each degree day.",
  },
  intercept: {
    label: "Base-load fault", base: 11000, perHdd: 100,
    note: "The whole cloud shifts up but the slope is unchanged: something weather-independent is now running, adding 3,000 kWh to every month. Look at summer weeks first, where the base load stands alone.",
  },
  slope: {
    label: "Slope fault", base: 8000, perHdd: 130,
    note: "The line steepens but the intercept holds: each degree day now costs 30 kWh more. Suspect fabric, boiler efficiency, or heating control drift, not the base load.",
  },
};

function points(mode: Mode): [number, number][] {
  const m = MODES[mode];
  return HDD.map((h, i) => [h, m.base + m.perHdd * h + NOISE[i]]);
}

function fit(pts: [number, number][]): { slope: number; intercept: number; r2: number } {
  const n = pts.length;
  const sx = pts.reduce((a, p) => a + p[0], 0);
  const sy = pts.reduce((a, p) => a + p[1], 0);
  const sxx = pts.reduce((a, p) => a + p[0] * p[0], 0);
  const sxy = pts.reduce((a, p) => a + p[0] * p[1], 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  const ybar = sy / n;
  const ssRes = pts.reduce((a, p) => a + (p[1] - (slope * p[0] + intercept)) ** 2, 0);
  const ssTot = pts.reduce((a, p) => a + (p[1] - ybar) ** 2, 0);
  return { slope, intercept, r2: 1 - ssRes / ssTot };
}

const HEALTHY_FIT = fit(points("healthy"));

const COL_PTS = "#059669"; // brand-600 — this year's months
// Fit lines are ink (slate), not a series colour; both carry direct labels.

// Plot geometry: x = HDD 0–350, y = kWh 0–56,000.
const X0 = 56, X1 = 536, YT = 18, YB = 248;
const H_MAX = 350, Y_MAX = 56000;
const xs = (h: number) => X0 + (h / H_MAX) * (X1 - X0);
const ys = (y: number) => YB - (y / Y_MAX) * (YB - YT);

export default function EnergySignatureExplorer() {
  const [mode, setMode] = useState<Mode>("healthy");

  const pts = points(mode);
  const f = fit(pts);

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-5 py-2.5">
        <span className="text-sm font-bold text-slate-800">
          The energy signature, live: read the line
        </span>
        <div className="flex gap-1">
          {(Object.keys(MODES) as Mode[]).map((k) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                mode === k
                  ? "bg-brand-600 text-white"
                  : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {MODES[k].label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3">
        <svg
          viewBox="0 0 560 290"
          className="h-auto w-full select-none"
          role="img"
          aria-label={`Monthly gas consumption against heating degree days with a fitted line: intercept ${Math.round(f.intercept).toLocaleString()} kilowatt hours, slope ${f.slope.toFixed(0)} kilowatt hours per degree day, R squared ${f.r2.toFixed(2)}`}
        >
          {/* grid */}
          {[0, 10000, 20000, 30000, 40000, 50000].map((y) => (
            <g key={y}>
              <line x1={X0} y1={ys(y)} x2={X1} y2={ys(y)} stroke="#eef2f7" strokeWidth="1" />
              <text x={X0 - 6} y={ys(y) + 3.5} textAnchor="end" fontSize="10" fill="#64748b">
                {y === 0 ? "0" : `${y / 1000}k`}
              </text>
            </g>
          ))}
          {[0, 100, 200, 300].map((h) => (
            <text key={h} x={xs(h)} y={YB + 16} textAnchor="middle" fontSize="10" fill="#64748b">
              {h}
            </text>
          ))}
          <text x={(X0 + X1) / 2} y={282} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
            Heating degree days in the month
          </text>
          <text
            x={13} y={(YT + YB) / 2} fontSize="11" fill="#475569" fontWeight="600"
            textAnchor="middle" transform={`rotate(-90 13 ${(YT + YB) / 2})`}
          >
            Gas (kWh/month)
          </text>

          {/* healthy reference when a fault is active */}
          {mode !== "healthy" && (
            <g>
              <line
                x1={xs(0)} y1={ys(HEALTHY_FIT.intercept)}
                x2={xs(H_MAX)} y2={ys(HEALTHY_FIT.intercept + HEALTHY_FIT.slope * H_MAX)}
                stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 4"
              />
              <text
                x={xs(310)} y={ys(HEALTHY_FIT.intercept + HEALTHY_FIT.slope * 310) + 16}
                textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#64748b"
              >
                last year (healthy)
              </text>
            </g>
          )}

          {/* fitted line, extended back to the intercept */}
          <line
            x1={xs(0)} y1={ys(f.intercept)}
            x2={xs(H_MAX)} y2={ys(f.intercept + f.slope * H_MAX)}
            stroke="#334155" strokeWidth="2.5"
          />
          <text
            x={xs(230)} y={ys(f.intercept + f.slope * 230) - 12}
            textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#334155"
          >
            this year&apos;s fit
          </text>

          {/* intercept marker */}
          <circle cx={xs(0)} cy={ys(f.intercept)} r="4.5" fill="#ffffff" stroke="#334155" strokeWidth="2" />
          <text x={xs(6)} y={ys(f.intercept) - 9} fontSize="10" fill="#475569">
            intercept = base load
          </text>

          {/* the twelve months */}
          {pts.map(([h, y], i) => (
            <circle
              key={i}
              cx={xs(h)} cy={ys(y)} r="5"
              fill={COL_PTS} stroke="#ffffff" strokeWidth="1.5"
            >
              <title>{`${Math.round(y).toLocaleString()} kWh at ${h} degree days`}</title>
            </circle>
          ))}
        </svg>
      </div>

      <div className="px-5 pb-4">
        <div className="mt-1 grid grid-cols-3 gap-3">
          <Stat label="Base load (intercept)" value={`${(Math.round(f.intercept / 100) * 100).toLocaleString()} kWh/mo`} />
          <Stat label="Slope" value={`${f.slope.toFixed(0)} kWh/HDD`} emphasis />
          <Stat label="R² (scatter)" value={f.r2.toFixed(2)} />
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-600">{MODES[mode].note}</p>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          Twelve months against degree days (15.5 °C base). The underlying building is the baseline
          lesson&apos;s model, 8,000 kWh a month plus 100 kWh per degree day, with realistic
          month-to-month variation; the line is refitted by least squares every time you switch.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, emphasis }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${emphasis ? "border-brand-200 bg-brand-50" : "border-slate-200 bg-white"}`}>
      <span className="text-xs font-medium leading-tight text-slate-500">{label}</span>
      <div className={`mt-0.5 text-lg font-bold tabular-nums tracking-tight ${emphasis ? "text-brand-700" : "text-slate-900"}`}>
        {value}
      </div>
    </div>
  );
}
