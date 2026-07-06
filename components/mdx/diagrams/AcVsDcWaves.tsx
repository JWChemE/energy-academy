"use client";

import StepDiagramShell, { DiagramStep } from "../StepDiagramShell";

/**
 * Step-through waveform chart for the AC vs DC lesson: a steady DC line, the
 * UK 50 Hz mains sine wave, and the peak-vs-RMS relationship (230 V RMS is a
 * wave swinging ±325 V, since 230 × √2 ≈ 325).
 */

const STEPS: DiagramStep[] = [
  {
    title: "Two kinds of flow",
    caption:
      "A battery delivers a steady voltage in one direction: direct current. The grid delivers a voltage that swings smoothly positive and negative: alternating current. Both lines here deliver energy continuously; they just do it differently. Step through each.",
  },
  {
    title: "1 · DC: the river",
    caption:
      "Direct current flows steadily in one direction at a constant push, like water in a river. Batteries, solar panels and the inside of almost all electronics live here. On the chart it is simply a flat line.",
  },
  {
    title: "2 · AC: the tide, 50 times a second",
    caption:
      "UK mains voltage completes 50 full cycles every second (50 Hz), so one cycle takes 20 milliseconds and the current changes direction 100 times a second. Nothing moves overall, yet energy is delivered continuously.",
  },
  {
    title: "3 · Peak vs the 230 V on the label",
    caption:
      "A \"230 V\" AC supply actually swings between +325 V and −325 V. The 230 V figure is the RMS value: the steady DC voltage that would deliver the same power. Peak = 230 × √2 ≈ 325 V, which is why insulation and electronics must be rated well above the number on the label.",
  },
];

const COL_AC = "#059669"; // brand-600 — AC wave
const COL_DC = "#2563eb"; // blue-600 — DC line
// Palette validated (CVD-safe with amber/emerald set); both series carry
// direct labels, so identity never rests on colour alone.

// Plot geometry: x = time 0–40 ms, y = voltage −350…+350 V.
const X0 = 52, X1 = 536, YT = 16, YB = 264;
const T_MAX = 40, V_MAX = 350;
const xs = (t: number) => X0 + (t / T_MAX) * (X1 - X0);
const ys = (v: number) => (YT + YB) / 2 - (v / V_MAX) * ((YB - YT) / 2);

const PEAK = 325, RMS = 230;

const AC_PATH = (() => {
  const pts: string[] = [];
  for (let t = 0; t <= T_MAX + 0.01; t += 0.4) {
    const v = PEAK * Math.sin((2 * Math.PI * t) / 20);
    pts.push(`${pts.length ? "L" : "M"} ${xs(t).toFixed(1)} ${ys(v).toFixed(1)}`);
  }
  return pts.join(" ");
})();

export default function AcVsDcWaves() {
  return (
    <StepDiagramShell
      title="DC and AC on one chart"
      steps={STEPS}
      renderDiagram={(step) => {
        const showDC = step === 0 || step === 1;
        const showAC = step === 0 || step >= 2;
        return (
          <svg
            viewBox="0 0 560 300"
            className="h-auto w-full select-none"
            role="img"
            aria-label="Voltage against time: a flat DC line at 230 volts and a 50 hertz AC sine wave swinging between plus and minus 325 volts"
          >
            {/* grid + axes */}
            {[-325, -230, 0, 230, 325].map((v) => (
              <g key={v}>
                <line
                  x1={X0} y1={ys(v)} x2={X1} y2={ys(v)}
                  stroke={v === 0 ? "#cbd5e1" : "#eef2f7"} strokeWidth="1"
                />
                <text x={X0 - 6} y={ys(v) + 3.5} textAnchor="end" fontSize="10" fill="#64748b">
                  {v}
                </text>
              </g>
            ))}
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
              Voltage (V)
            </text>

            {/* one-cycle bracket on the AC steps */}
            {step >= 2 && (
              <g>
                <line x1={xs(0)} y1={YT + 8} x2={xs(20)} y2={YT + 8} stroke="#94a3b8" strokeWidth="1" />
                <line x1={xs(0)} y1={YT + 4} x2={xs(0)} y2={YT + 12} stroke="#94a3b8" strokeWidth="1" />
                <line x1={xs(20)} y1={YT + 4} x2={xs(20)} y2={YT + 12} stroke="#94a3b8" strokeWidth="1" />
                <text x={xs(10)} y={YT + 3} textAnchor="middle" fontSize="9.5" fill="#64748b">
                  one cycle = 20 ms (50 Hz)
                </text>
              </g>
            )}

            {/* RMS line on the final step */}
            {step === 3 && (
              <g>
                <line
                  x1={X0} y1={ys(RMS)} x2={X1} y2={ys(RMS)}
                  stroke={COL_DC} strokeWidth="1.5" strokeDasharray="5 4"
                />
                <text x={X1 - 4} y={ys(RMS) - 6} textAnchor="end" fontSize="10.5" fontWeight="700" fill="#1d4ed8">
                  230 V RMS: the DC-equivalent value
                </text>
                <text x={xs(5.6)} y={ys(PEAK) - 6} fontSize="10.5" fontWeight="700" fill="#047857">
                  peak +325 V
                </text>
              </g>
            )}

            {/* DC line */}
            {showDC && (
              <g>
                <line x1={X0} y1={ys(230)} x2={X1} y2={ys(230)} stroke={COL_DC} strokeWidth="2.5" />
                <text
                  x={step === 1 ? xs(20) : xs(33)} y={ys(230) - 8}
                  textAnchor="middle" fontSize="11" fontWeight="700" fill="#1d4ed8"
                >
                  DC: steady, one direction
                </text>
              </g>
            )}

            {/* AC wave */}
            {showAC && (
              <g>
                <path d={AC_PATH} fill="none" stroke={COL_AC} strokeWidth="2.5" />
                <text x={xs(24.2)} y={ys(-290)} fontSize="11" fontWeight="700" fill="#047857">
                  AC: swings positive and negative
                </text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
