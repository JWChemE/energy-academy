"use client";

import StepDiagramShell, { DiagramStep } from "../StepDiagramShell";

/**
 * Step-through progression for the three-phase basics lesson: one phase and
 * its pulsing power, then three waves staggered by 120°, then the combined
 * power coming out perfectly flat (sin² summed across three offsets is a
 * constant 1.5, verified by script).
 */

const STEPS: DiagramStep[] = [
  {
    title: "One wave: single phase",
    caption:
      "A single-phase supply is one voltage wave, rising and falling 50 times a second. Twice in every cycle it passes through zero: at those instants this wire is pushing nothing at all.",
  },
  {
    title: "1 · Single-phase power pulses",
    caption:
      "Plot the power that one wave delivers and the problem shows: it pulses, touching zero 100 times a second. For anything turning electricity into rotation, that is a series of jerks rather than a smooth pull.",
  },
  {
    title: "2 · Three waves, evenly spaced",
    caption:
      "A three-phase supply is three such waves on three conductors (L1, L2, L3), deliberately staggered by a third of a cycle. When one phase is at zero, the other two are mid-swing. Line to neutral each wave measures 230 V; between any two lines the geometry gives 400 V (the factor is √3).",
  },
  {
    title: "3 · Combined power never dips",
    caption:
      "Add up what the three phases deliver and the pulses cancel perfectly: the total is a flat line, half as much again as one phase's peak. Something is always pushing, which is why three-phase motors run smoothly and start themselves.",
  },
];

const COLS = ["#059669", "#d97706", "#2563eb"]; // L1 emerald, L2 amber, L3 blue
const INKS = ["#047857", "#b45309", "#1d4ed8"];
// Palette validated (worst adjacent pair ΔE 39.3 protan, contrast ≥3:1);
// every series carries a direct label and a legend, never colour alone.

// Plot geometry: x = time 0–40 ms (two cycles at 50 Hz).
const X0 = 52, X1 = 536, YT = 18, YB = 264;
const T_MAX = 40;
const xs = (t: number) => X0 + (t / T_MAX) * (X1 - X0);

// Voltage view: −350…+350 V. Power view: 0…1.6 × one phase's peak.
const ysV = (v: number) => (YT + YB) / 2 - (v / 350) * ((YB - YT) / 2);
const ysP = (p: number) => YB - (p / 1.6) * (YB - YT);

const PEAK = 325;
const phase = (t: number, k: number) => Math.sin((2 * Math.PI * (t - (k * 20) / 3)) / 20);

function path(fn: (t: number) => number, ys: (y: number) => number): string {
  const pts: string[] = [];
  for (let t = 0; t <= T_MAX + 0.01; t += 0.4) {
    pts.push(`${pts.length ? "L" : "M"} ${xs(t).toFixed(1)} ${ys(fn(t)).toFixed(1)}`);
  }
  return pts.join(" ");
}

const V_PATHS = [0, 1, 2].map((k) => path((t) => PEAK * phase(t, k), ysV));
const P_PATHS = [0, 1, 2].map((k) => path((t) => phase(t, k) ** 2, ysP));
const P_TOTAL = path((t) => phase(t, 0) ** 2 + phase(t, 1) ** 2 + phase(t, 2) ** 2, ysP);

export default function ThreePhaseWaves() {
  return (
    <StepDiagramShell
      title="From one wave to three"
      steps={STEPS}
      renderDiagram={(step) => {
        const powerView = step === 1 || step === 3;
        const nPhases = step >= 2 ? 3 : 1;
        return (
          <svg
            viewBox="0 0 560 300"
            className="h-auto w-full select-none"
            role="img"
            aria-label={
              powerView
                ? "Power delivered against time: single-phase power pulses to zero, three-phase total is a flat line"
                : "Voltage against time: sine waves at 50 hertz, three phases staggered by a third of a cycle"
            }
          >
            {/* grid */}
            {(powerView ? [0, 0.5, 1, 1.5] : [-325, 0, 325]).map((v) => {
              const y = powerView ? ysP(v) : ysV(v);
              return (
                <g key={v}>
                  <line
                    x1={X0} y1={y} x2={X1} y2={y}
                    stroke={v === 0 ? "#cbd5e1" : "#eef2f7"} strokeWidth="1"
                  />
                  <text x={X0 - 6} y={y + 3.5} textAnchor="end" fontSize="10" fill="#64748b">
                    {powerView ? `${v}×` : v}
                  </text>
                </g>
              );
            })}
            {[0, 10, 20, 30, 40].map((t) => (
              <text key={t} x={xs(t)} y={YB + 16} textAnchor="middle" fontSize="10" fill="#64748b">
                {t}
              </text>
            ))}
            <text x={(X0 + X1) / 2} y={292} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
              Time (milliseconds)
            </text>
            <text
              x={13} y={(YT + YB) / 2} fontSize="11" fill="#475569" fontWeight="600"
              textAnchor="middle" transform={`rotate(-90 13 ${(YT + YB) / 2})`}
            >
              {powerView ? "Power (× one phase's peak)" : "Voltage (V)"}
            </text>

            {/* legend, once more than one series is on screen */}
            {nPhases === 3 && (
              <g>
                {["L1", "L2", "L3"].map((name, k) => (
                  <g key={name}>
                    <rect x={X1 - 138 + k * 46} y={YT - 4} width={12} height={4} rx={2} fill={COLS[k]} />
                    <text x={X1 - 122 + k * 46} y={YT + 1} fontSize="10" fontWeight="600" fill="#475569">
                      {name}
                    </text>
                  </g>
                ))}
              </g>
            )}

            {/* voltage steps */}
            {!powerView &&
              [...Array(nPhases).keys()].map((k) => (
                <path key={k} d={V_PATHS[k]} fill="none" stroke={COLS[k]} strokeWidth="2.5"
                  opacity={nPhases === 1 || k === 0 ? 1 : 0.85} />
              ))}
            {!powerView && step === 0 && (
              <g>
                {[0, 10, 20, 30, 40].map((t) => (
                  <circle key={t} cx={xs(t)} cy={ysV(0)} r="4" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
                ))}
                <text x={xs(10)} y={ysV(0) + 20} textAnchor="middle" fontSize="10" fill="#64748b">
                  zero crossings: nothing pushing
                </text>
                <text x={xs(29)} y={ysV(PEAK) - 6} fontSize="11" fontWeight="700" fill={INKS[0]}>
                  L1
                </text>
              </g>
            )}
            {!powerView && step === 2 && (
              <text x={xs(4.2)} y={ysV(PEAK) - 6} fontSize="10.5" fontWeight="700" fill="#475569">
                each ⅓ of a cycle apart
              </text>
            )}

            {/* power steps */}
            {powerView && step === 1 && (
              <g>
                <path d={P_PATHS[0]} fill="none" stroke={COLS[0]} strokeWidth="2.5" />
                {[0, 10, 20, 30, 40].map((t) => (
                  <circle key={t} cx={xs(t)} cy={ysP(0)} r="4" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
                ))}
                <text x={xs(15)} y={ysP(0) - 10} textAnchor="middle" fontSize="10" fill="#64748b">
                  power hits zero 100 times a second
                </text>
                <text x={xs(5)} y={ysP(1) - 8} fontSize="11" fontWeight="700" fill={INKS[0]}>
                  one phase, pulsing
                </text>
              </g>
            )}
            {powerView && step === 3 && (
              <g>
                {P_PATHS.map((p, k) => (
                  <path key={k} d={p} fill="none" stroke={COLS[k]} strokeWidth="1.5" opacity="0.4" />
                ))}
                <path d={P_TOTAL} fill="none" stroke="#334155" strokeWidth="3" />
                <text x={xs(20)} y={ysP(1.5) - 10} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#334155">
                  total of all three: constant, never dips
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
