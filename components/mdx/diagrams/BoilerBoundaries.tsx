"use client";

import StepDiagramShell, { DiagramStep } from "../StepDiagramShell";

/**
 * Step-through diagram for the system-boundaries lesson: the same boiler
 * plant with three legitimate boundaries drawn around it (combustion chamber,
 * whole boiler, whole boiler house), each answering a different question.
 * Arrows crossing the active boundary light up; everything else dims.
 */

const STEPS: DiagramStep[] = [
  {
    title: "One plant, three possible boundaries",
    caption:
      "Nothing about the equipment tells you where to draw the boundary: it is your choice, made from the question you are asking. Step through three legitimate boundaries around the same boiler and watch which streams each one counts.",
  },
  {
    title: "1 · Around the combustion chamber",
    caption:
      "Fuel and air in, flue gas out. This balance answers one question only: combustion efficiency. The water side does not exist inside this boundary.",
  },
  {
    title: "2 · Around the whole boiler",
    caption:
      "Now feedwater, steam and blowdown cross the line too, so the balance captures the heat exchanger and answers a bigger question: overall thermal efficiency, useful heat out per unit of fuel in.",
  },
  {
    title: "3 · Around the whole boiler house",
    caption:
      "Widest of all: the pumps and auxiliaries are now inside, so their electricity crosses the boundary and counts. This is the boundary a full energy audit of the plant room needs. Quoting the combustion-chamber number as if it answered this question is one of the commonest errors in energy work.",
  },
];

/** Which boundary (1, 2, 3) each stream first crosses. */
const STREAMS = [
  { name: "Fuel", from: 1, d: "M 18 120 L 154 120", head: [160, 120, 0] as const, lx: 52, ly: 112 },
  { name: "Air", from: 1, d: "M 18 158 L 154 158", head: [160, 158, 0] as const, lx: 52, ly: 172 },
  { name: "Flue gas", from: 1, d: "M 222 93 L 222 20", head: [222, 14, 270] as const, lx: 248, ly: 30 },
  { name: "Steam", from: 2, d: "M 382 112 L 536 112", head: [542, 112, 0] as const, lx: 470, ly: 104 },
  { name: "Feedwater", from: 2, d: "M 542 172 L 388 172", head: [382, 172, 180] as const, lx: 470, ly: 186 },
  { name: "Blowdown", from: 2, d: "M 340 232 L 340 286", head: [340, 292, 90] as const, lx: 372, ly: 284 },
  { name: "Electricity", from: 3, d: "M 18 224 L 52 224", head: [58, 224, 0] as const, lx: 30, ly: 214 },
];

const BOUNDARIES = [
  { id: 1, x: 150, y: 84, w: 146, h: 122 }, // combustion chamber
  { id: 2, x: 122, y: 52, w: 288, h: 188 }, // boiler
  { id: 3, x: 42, y: 24, w: 478, h: 252 }, // boiler house
];

function head([x, y, rot]: readonly [number, number, number], fill: string) {
  return <polygon points="0,-5 9,0 0,5" transform={`translate(${x} ${y}) rotate(${rot})`} fill={fill} />;
}

export default function BoilerBoundaries() {
  return (
    <StepDiagramShell
      title="Where do you draw the line?"
      steps={STEPS}
      renderDiagram={(step) => (
        <svg
          viewBox="0 0 560 300"
          className="h-auto w-full select-none"
          role="img"
          aria-label="A boiler house with three possible system boundaries: the combustion chamber, the whole boiler, and the whole boiler house, each with different streams crossing it"
        >
          {/* equipment */}
          <rect x={160} y={95} width={126} height={100} rx={6} fill="#fef3c7" stroke="#e2c884" strokeWidth="1" />
          <text x={223} y={140} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#92400e">
            Combustion
          </text>
          <text x={223} y={154} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#92400e">
            chamber
          </text>

          <rect x={306} y={95} width={76} height={100} rx={6} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
          <path
            d="M 316 115 L 372 115 M 316 135 L 372 135 M 316 155 L 372 155 M 316 175 L 372 175"
            stroke="#94a3b8" strokeWidth="2" fill="none"
          />
          <text x={344} y={108} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#475569">
            Heat exch.
          </text>

          <rect x={58} y={206} width={62} height={36} rx={6} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
          <text x={89} y={222} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#475569">
            Pumps
          </text>
          <text x={89} y={234} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#475569">
            &amp; aux
          </text>

          <text x={266} y={68} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#64748b">
            Boiler
          </text>
          <text x={92} y={42} fontSize="10.5" fontWeight="700" fill="#64748b">
            Boiler house
          </text>

          {/* boundaries */}
          {BOUNDARIES.map((b) => {
            const active = step === b.id;
            return (
              <rect
                key={b.id}
                x={b.x} y={b.y} width={b.w} height={b.h} rx={10}
                fill="none"
                stroke={active ? "#059669" : "#cbd5e1"}
                strokeWidth={active ? 2.5 : 1.25}
                strokeDasharray="7 5"
                opacity={active ? 1 : step === 0 ? 0.9 : 0.45}
              />
            );
          })}

          {/* streams */}
          {STREAMS.map((s) => {
            const counted = step > 0 && s.from <= step;
            const colour = counted ? "#334155" : "#94a3b8";
            return (
              <g key={s.name} opacity={step === 0 ? 0.8 : counted ? 1 : 0.3}>
                <path d={s.d} stroke={colour} strokeWidth={counted ? 2.5 : 1.75} fill="none" />
                {head(s.head, colour)}
                <text x={s.lx} y={s.ly} textAnchor="middle" fontSize="10" fontWeight="600" fill={colour}>
                  {s.name}
                </text>
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
