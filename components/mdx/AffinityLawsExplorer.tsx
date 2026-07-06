"use client";

import { useMemo, useRef, useState } from "react";

/**
 * Interactive cube-law demo for the motors & drives course: drag the flow
 * demand and watch what a VFD draws (power ∝ speed³) versus running the motor
 * flat-out against a damper/throttle (power barely falls). The gap between
 * the curves is the saving — made concrete as £/yr for a reference pump.
 *
 * Models (as fraction of rated power, flow fraction f):
 *   VFD:    P = f³                     (ideal affinity law)
 *   Damper: P ≈ 0.8 + 0.2·f            (motor at full speed; matches the
 *                                       course's "85% power at 20% flow")
 * Reference example: 100 kW pump, 4,000 h/yr at £0.20/kWh.
 */

const RATED_KW = 100;
const HOURS = 4000;
const PRICE = 0.2; // £/kWh — platform reference price

const COL_VFD = "#059669"; // brand-600
const COL_DAMPER = "#d97706"; // amber-600
// Palette validated (CVD ΔE 39.3 protan, contrast ≥3:1 on white) — both
// series also carry direct labels, so identity never rests on colour alone.

// Plot geometry
const X0 = 46, X1 = 548, Y0 = 16, Y1 = 278;
const F_MIN = 20, F_MAX = 100;

const xScale = (f: number) => X0 + ((f - F_MIN) / (F_MAX - F_MIN)) * (X1 - X0);
const yScale = (p: number) => Y1 - (p / 100) * (Y1 - Y0);

const vfdPct = (f: number) => Math.pow(f / 100, 3) * 100;
const damperPct = (f: number) => 80 + 0.2 * f;

function curvePath(fn: (f: number) => number): string {
  const pts: string[] = [];
  for (let f = F_MIN; f <= F_MAX; f += 2) {
    pts.push(`${pts.length ? "L" : "M"} ${xScale(f).toFixed(1)} ${yScale(fn(f)).toFixed(1)}`);
  }
  return pts.join(" ");
}

export default function AffinityLawsExplorer() {
  const [flow, setFlow] = useState(60);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const vfdKw = (vfdPct(flow) / 100) * RATED_KW;
  const damperKw = (damperPct(flow) / 100) * RATED_KW;
  const savingKw = damperKw - vfdKw;
  const savingPerYear = savingKw * HOURS * PRICE;

  const paths = useMemo(
    () => ({
      vfd: curvePath(vfdPct),
      damper: curvePath(damperPct),
      band:
        curvePath(damperPct) +
        " " +
        // back along the VFD curve to close the "saving" region
        [...Array(41)]
          .map((_, i) => {
            const f = F_MAX - i * 2;
            return `L ${xScale(f).toFixed(1)} ${yScale(vfdPct(f)).toFixed(1)}`;
          })
          .join(" ") +
        " Z",
    }),
    [],
  );

  function flowFromPointer(e: React.PointerEvent) {
    const svg = svgRef.current;
    if (!svg) return flow;
    const rect = svg.getBoundingClientRect();
    const xView = ((e.clientX - rect.left) / rect.width) * 560;
    const f = F_MIN + ((xView - X0) / (X1 - X0)) * (F_MAX - F_MIN);
    return Math.round(Math.min(F_MAX, Math.max(F_MIN, f)));
  }

  const fx = xScale(flow);

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-2.5">
        <span className="text-sm font-bold text-slate-800">
          The cube law, live: VFD vs damper
        </span>
      </div>

      <div className="px-4 pt-3">
        <svg
          ref={svgRef}
          viewBox="0 0 560 320"
          className="h-auto w-full cursor-ew-resize touch-none select-none"
          role="img"
          aria-label={`At ${flow}% flow: damper control draws ${damperKw.toFixed(0)} kW, a VFD draws ${vfdKw.toFixed(1)} kW`}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            setFlow(flowFromPointer(e));
          }}
          onPointerMove={(e) => {
            if (dragging.current) setFlow(flowFromPointer(e));
          }}
          onPointerUp={() => (dragging.current = false)}
        >
          {/* grid + axes (recessive) */}
          {[0, 25, 50, 75, 100].map((p) => (
            <g key={p}>
              <line x1={X0} y1={yScale(p)} x2={X1} y2={yScale(p)} stroke="#e2e8f0" strokeWidth="1" />
              <text x={X0 - 6} y={yScale(p) + 3.5} textAnchor="end" fontSize="10.5" fill="#64748b">
                {p}%
              </text>
            </g>
          ))}
          {[20, 40, 60, 80, 100].map((f) => (
            <text key={f} x={xScale(f)} y={Y1 + 16} textAnchor="middle" fontSize="10.5" fill="#64748b">
              {f}%
            </text>
          ))}
          <text x={(X0 + X1) / 2} y={312} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
            Flow demand (% of design): drag anywhere on the chart
          </text>
          <text
            x={13} y={(Y0 + Y1) / 2} fontSize="11" fill="#475569" fontWeight="600"
            textAnchor="middle" transform={`rotate(-90 13 ${(Y0 + Y1) / 2})`}
          >
            Power (% of rated)
          </text>

          {/* the saving region between the curves */}
          <path d={paths.band} fill={COL_VFD} opacity="0.07" />

          {/* series */}
          <path d={paths.damper} fill="none" stroke={COL_DAMPER} strokeWidth="2" />
          <path d={paths.vfd} fill="none" stroke={COL_VFD} strokeWidth="2" />

          {/* direct labels (left side — the curves converge at the right) */}
          <text x={xScale(24)} y={yScale(damperPct(24)) - 8} fontSize="11" fontWeight="700" fill="#b45309">
            Damper control
          </text>
          <text x={xScale(47)} y={yScale(vfdPct(47)) - 9} fontSize="11" fontWeight="700" fill="#047857">
            VFD
          </text>

          {/* current-position connector + markers */}
          <line
            x1={fx} y1={yScale(damperPct(flow))} x2={fx} y2={yScale(vfdPct(flow))}
            stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3"
          />
          <circle cx={fx} cy={yScale(damperPct(flow))} r="6" fill={COL_DAMPER} stroke="#ffffff" strokeWidth="2" />
          <circle cx={fx} cy={yScale(vfdPct(flow))} r="6" fill={COL_VFD} stroke="#ffffff" strokeWidth="2" />
          <text
            x={fx + (flow > 78 ? -10 : 10)}
            y={(yScale(damperPct(flow)) + yScale(vfdPct(flow))) / 2 + 4}
            textAnchor={flow > 78 ? "end" : "start"}
            fontSize="11.5" fontWeight="700" fill="#334155"
            stroke="#ffffff" strokeWidth="3.5" paintOrder="stroke"
          >
            {savingKw.toFixed(0)} kW saved
          </text>
        </svg>
      </div>

      <div className="px-5 pb-4">
        <label className="mt-1 flex items-center gap-3 text-sm text-slate-600">
          <span className="shrink-0 font-medium">Flow demand</span>
          <input
            type="range"
            min={F_MIN}
            max={F_MAX}
            value={flow}
            onChange={(e) => setFlow(Number(e.target.value))}
            className="h-2 flex-1 cursor-pointer accent-brand-600"
            aria-label="Flow demand, percent of design"
          />
          <span className="w-12 text-right font-bold tabular-nums text-slate-900">{flow}%</span>
        </label>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <Stat chip={COL_DAMPER} label="Damper (full speed)" value={`${damperKw.toFixed(0)} kW`} />
          <Stat chip={COL_VFD} label="VFD (matched speed)" value={`${vfdKw.toFixed(1)} kW`} />
          <Stat label="Saving at this flow" value={`£${Math.round(savingPerYear).toLocaleString()}/yr`} emphasis />
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          Reference example: {RATED_KW} kW pump or fan running {HOURS.toLocaleString()} h/yr at this
          flow, electricity £{PRICE.toFixed(2)}/kWh. Ideal cube law; real drives add roughly 2–5%
          losses, which barely dents the saving.
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
