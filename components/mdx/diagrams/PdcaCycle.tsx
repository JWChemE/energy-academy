"use client";

import StepDiagramShell, { DiagramStep } from "../StepDiagramShell";

/**
 * Step-through Plan-Do-Check-Act cycle for the intro course. Four donut
 * quadrants with clockwise arrows; each step lights one stage and the
 * caption says what that stage means in practice (content mirrors the
 * energy-management-cycle lesson).
 */

const STEPS: DiagramStep[] = [
  {
    title: "The improvement loop",
    caption:
      "Energy management is a cycle, not a project. Plan what to improve, do it, check whether it worked, then act on what you learned and go round again. Each lap raises the baseline a little higher. Step through the four stages.",
  },
  {
    title: "1 · Plan",
    caption:
      "Secure management commitment and set a policy. Measure current consumption to establish a baseline, identify and prioritise opportunities (this is where audits come in), and set targets and an action plan.",
  },
  {
    title: "2 · Do",
    caption:
      "Implement the chosen measures, from no-cost operational changes to capital projects, and train and engage the people who operate and influence the systems.",
  },
  {
    title: "3 · Check",
    caption:
      "Monitor consumption against the baseline and targets, verify that savings are real, and investigate exceptions: consumption that is higher than it should be.",
  },
  {
    title: "4 · Act",
    caption:
      "Review performance with management. Standardise what worked, fix what did not, and feed the lessons back into the next Plan stage: the loop closes and starts again.",
  },
];

const CX = 280, CY = 152, R_OUT = 118, R_IN = 72;
const STAGES = ["Plan", "Do", "Check", "Act"];

/** Point on a circle, angle measured clockwise from 12 o'clock. */
function pt(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.sin(a), CY - r * Math.cos(a)];
}

/** Donut segment between two clockwise angles. */
function segment(a0: number, a1: number): string {
  const [ox0, oy0] = pt(R_OUT, a0);
  const [ox1, oy1] = pt(R_OUT, a1);
  const [ix0, iy0] = pt(R_IN, a0);
  const [ix1, iy1] = pt(R_IN, a1);
  return [
    `M ${ox0.toFixed(1)} ${oy0.toFixed(1)}`,
    `A ${R_OUT} ${R_OUT} 0 0 1 ${ox1.toFixed(1)} ${oy1.toFixed(1)}`,
    `L ${ix1.toFixed(1)} ${iy1.toFixed(1)}`,
    `A ${R_IN} ${R_IN} 0 0 0 ${ix0.toFixed(1)} ${iy0.toFixed(1)}`,
    "Z",
  ].join(" ");
}

/** Small clockwise arrowhead at the leading edge of a segment. */
function arrowhead(a1: number): string {
  const rMid = (R_OUT + R_IN) / 2;
  const [tx, ty] = pt(rMid, a1 + 7); // tip, just past the segment end
  const [bx0, by0] = pt(rMid + 13, a1);
  const [bx1, by1] = pt(rMid - 13, a1);
  return `M ${tx.toFixed(1)} ${ty.toFixed(1)} L ${bx0.toFixed(1)} ${by0.toFixed(1)} L ${bx1.toFixed(1)} ${by1.toFixed(1)} Z`;
}

export default function PdcaCycle() {
  return (
    <StepDiagramShell
      title="Plan, Do, Check, Act"
      steps={STEPS}
      renderDiagram={(step) => (
        <svg
          viewBox="0 0 560 304"
          className="h-auto w-full select-none"
          role="img"
          aria-label="The Plan Do Check Act cycle drawn as four quadrants of a clockwise loop"
        >
          {STAGES.map((name, i) => {
            const a0 = i * 90 + 6;
            const a1 = (i + 1) * 90 - 12;
            const active = step === 0 || step === i + 1;
            const fill = step === i + 1 ? "#059669" : active ? "#d1fae5" : "#f1f5f9";
            const ink = step === i + 1 ? "#ffffff" : active ? "#047857" : "#94a3b8";
            const [lx, ly] = pt((R_OUT + R_IN) / 2, (a0 + a1) / 2);
            return (
              <g key={name}>
                <path d={segment(a0, a1)} fill={fill} stroke="#ffffff" strokeWidth="2" />
                <path d={arrowhead(a1)} fill={step === i + 1 ? "#059669" : active ? "#a7f3d0" : "#e2e8f0"} />
                <text
                  x={lx} y={ly + 4.5} textAnchor="middle"
                  fontSize="14" fontWeight="700" fill={ink}
                >
                  {name}
                </text>
              </g>
            );
          })}

          <text x={CX} y={CY - 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">
            each lap raises
          </text>
          <text x={CX} y={CY + 13} textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155">
            the baseline
          </text>
        </svg>
      )}
    />
  );
}
