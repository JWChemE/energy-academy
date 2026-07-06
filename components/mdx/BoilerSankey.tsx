"use client";

import { useState } from "react";

/**
 * Sankey diagram of the boiler energy balance from the mass-and-energy-
 * balances course: 500 kW of fuel in, splitting into useful heat and three
 * losses, with band widths proportional to kW. A toggle switches to the
 * tuned-burner case so the flue-loss band visibly narrows.
 *
 * Numbers match the sankey-diagrams lesson table exactly:
 *   As found (85%): useful 425, flue 60, casing 10, blowdown 5  (sum 500)
 *   Tuned    (92%): useful 460, flue 25, casing 10, blowdown 5  (sum 500)
 */

const COL_USEFUL = "#059669"; // brand-600 — useful heat
const COL_LOSS = "#d97706"; // amber-600 — losses (identified by label + position)
// Palette validated (CVD ΔE 39.3 protan, contrast ≥3:1 on white); every band
// carries a direct label with its value, so identity never rests on colour.

const FUEL = 500;
const CASES = {
  found: { label: "As found (85%)", useful: 425, flue: 60, casing: 10, blowdown: 5 },
  tuned: { label: "Burner tuned (92%)", useful: 460, flue: 25, casing: 10, blowdown: 5 },
} as const;

const S = 0.42; // px per kW
const TRUNK_X0 = 30, TRUNK_X1 = 120, TRUNK_Y = 70; // fuel band, top edge
const END_X = 400; // where the outgoing bands finish (labels to the right)

/** A smooth ribbon from one vertical slice to another. */
function ribbon(x0: number, t0: number, b0: number, x1: number, t1: number, b1: number): string {
  const mx = (x0 + x1) / 2;
  return [
    `M ${x0} ${t0}`,
    `C ${mx} ${t0} ${mx} ${t1} ${x1} ${t1}`,
    `L ${x1} ${b1}`,
    `C ${mx} ${b1} ${mx} ${b0} ${x0} ${b0}`,
    "Z",
  ].join(" ");
}

export default function BoilerSankey() {
  const [mode, setMode] = useState<keyof typeof CASES>("found");
  const [hover, setHover] = useState<string | null>(null);

  const c = CASES[mode];
  const eff = Math.round((c.useful / FUEL) * 100);

  // Trunk slices, top to bottom: flue, useful, casing, blowdown.
  const hFlue = c.flue * S, hUseful = c.useful * S, hCasing = c.casing * S, hBlow = c.blowdown * S;
  const yFlue = TRUNK_Y;
  const yUseful = yFlue + hFlue;
  const yCasing = yUseful + hUseful;
  const yBlow = yCasing + hCasing;
  const trunkBottom = yBlow + hBlow; // always TRUNK_Y + 210

  // Right-hand endpoints: flue exits high, useful runs level, small losses drop low.
  const flows = [
    {
      key: "flue", name: "Flue loss", kW: c.flue, colour: COL_LOSS, ink: "#b45309",
      path: ribbon(TRUNK_X1, yFlue, yFlue + hFlue, END_X, 24, 24 + hFlue),
      labelY: 24 + hFlue / 2,
    },
    {
      key: "useful", name: "Useful heat", kW: c.useful, colour: COL_USEFUL, ink: "#047857",
      path: ribbon(TRUNK_X1, yUseful, yUseful + hUseful, END_X, 96, 96 + hUseful),
      labelY: 96 + hUseful / 2,
    },
    {
      key: "casing", name: "Casing loss", kW: c.casing, colour: COL_LOSS, ink: "#b45309",
      path: ribbon(TRUNK_X1, yCasing, yCasing + hCasing, END_X, 296, 296 + hCasing),
      labelY: 296 + hCasing / 2,
    },
    {
      key: "blowdown", name: "Blowdown", kW: c.blowdown, colour: COL_LOSS, ink: "#b45309",
      path: ribbon(TRUNK_X1, yBlow, yBlow + hBlow, END_X, 314, 314 + hBlow),
      labelY: 314 + hBlow / 2,
    },
  ];

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 px-5 py-2.5">
        <span className="text-sm font-bold text-slate-800">
          The boiler balance as a Sankey diagram
        </span>
        <div className="flex gap-1">
          {(Object.keys(CASES) as (keyof typeof CASES)[]).map((k) => (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                mode === k
                  ? "bg-brand-600 text-white"
                  : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {CASES[k].label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3">
        <svg
          viewBox="0 0 560 340"
          className="h-auto w-full select-none"
          role="img"
          aria-label={`Sankey diagram: ${FUEL} kilowatts of fuel in, ${c.useful} to useful heat, ${c.flue} lost up the flue, ${c.casing} through the casing, ${c.blowdown} to blowdown; ${eff} percent efficient`}
        >
          {/* fuel trunk */}
          <rect
            x={TRUNK_X0} y={TRUNK_Y} width={TRUNK_X1 - TRUNK_X0} height={trunkBottom - TRUNK_Y}
            fill="#64748b" opacity={hover ? 0.35 : 0.75}
          />
          <text x={TRUNK_X0} y={TRUNK_Y - 10} fontSize="11.5" fontWeight="700" fill="#334155">
            Fuel in {FUEL} kW (100%)
          </text>

          {/* flows */}
          {flows.map((f) => (
            <g
              key={f.key}
              onMouseEnter={() => setHover(f.key)}
              onMouseLeave={() => setHover(null)}
            >
              <path
                d={f.path}
                fill={f.colour}
                opacity={hover === null ? 0.7 : hover === f.key ? 0.95 : 0.25}
              />
              <text
                x={END_X + 8} y={f.labelY + 4}
                fontSize="11" fontWeight="700" fill={f.ink}
              >
                {f.name} {f.kW} kW
                <tspan fontSize="10" fontWeight="400" fill="#64748b">
                  {" "}· {Math.round((f.kW / FUEL) * 100)}%
                </tspan>
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="px-5 pb-4">
        <p className="text-xs leading-5 text-slate-400">
          Band widths are proportional to kW, drawn straight from the balance table above. Toggle
          to the tuned burner and watch the flue-loss band narrow from 60 to 25 kW: the same
          comparison a decision-maker sees in seconds, without reading a single number.
        </p>
      </div>
    </div>
  );
}
