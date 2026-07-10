"use client";

import { useState } from "react";

/**
 * The classic Ohm's law triangle for the electrical science course: V on top,
 * I and R below. Tap the quantity you want to find; it dims ("cover it with
 * your thumb") and the remaining two show the rearranged formula, worked
 * through with the lesson's kettle numbers (230 V, 13 A, 17.7 Ω).
 */

type Q = "V" | "I" | "R";

const DETAIL: Record<Q, { formula: string; worked: string; meaning: string }> = {
  V: {
    formula: "V = I × R",
    worked: "13 A × 17.7 Ω ≈ 230 V",
    meaning: "The two side by side multiply: current times resistance gives the voltage across the load.",
  },
  I: {
    formula: "I = V ÷ R",
    worked: "230 V ÷ 17.7 Ω ≈ 13 A",
    meaning: "Top over bottom: voltage divided by resistance gives the current that flows.",
  },
  R: {
    formula: "R = V ÷ I",
    worked: "230 V ÷ 13 A ≈ 17.7 Ω",
    meaning: "Top over bottom: voltage divided by current gives the resistance of the load.",
  },
};

const LABEL: Record<Q, string> = { V: "Voltage (V)", I: "Current (A)", R: "Resistance (Ω)" };

export default function OhmsLawTriangle() {
  const [q, setQ] = useState<Q>("I");
  const d = DETAIL[q];

  // Triangle geometry: apex (140,22), base corners (30,182) and (250,182),
  // horizontal divider halfway down, vertical divider splitting the lower half.
  const midY = 102;

  const cell = (key: Q) =>
    q === key
      ? { fill: "#f1f5f9", ink: "#cbd5e1" } // the covered one
      : { fill: "#d1fae5", ink: "#047857" };

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-2.5">
        <span className="text-sm font-bold text-slate-800">
          The Ohm&apos;s law triangle: cover the one you want
        </span>
      </div>

      <div className="grid gap-2 px-5 pt-4 sm:grid-cols-[280px_1fr] sm:items-center">
        <svg
          viewBox="0 0 280 200"
          className="mx-auto h-auto w-full max-w-[280px] select-none"
          role="img"
          aria-label={`Ohm's law triangle with ${LABEL[q]} covered: ${d.formula}`}
        >
          {/* top cell: V */}
          <path
            d={`M 140 22 L ${30 + (110 * (midY - 22)) / 160} ${midY} L ${250 - (110 * (midY - 22)) / 160} ${midY} Z`}
            fill={cell("V").fill} stroke="#ffffff" strokeWidth="3"
            className="cursor-pointer" onClick={() => setQ("V")}
          />
          {/* bottom-left cell: I */}
          <path
            d={`M ${30 + (110 * (midY - 22)) / 160} ${midY} L 30 182 L 140 182 L 140 ${midY} Z`}
            fill={cell("I").fill} stroke="#ffffff" strokeWidth="3"
            className="cursor-pointer" onClick={() => setQ("I")}
          />
          {/* bottom-right cell: R */}
          <path
            d={`M 140 ${midY} L 140 182 L 250 182 L ${250 - (110 * (midY - 22)) / 160} ${midY} Z`}
            fill={cell("R").fill} stroke="#ffffff" strokeWidth="3"
            className="cursor-pointer" onClick={() => setQ("R")}
          />
          {/* outline */}
          <path d="M 140 22 L 30 182 L 250 182 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" />

          <text x={140} y={82} textAnchor="middle" fontSize="26" fontWeight="800" fill={cell("V").ink}
            className="pointer-events-none">V</text>
          <text x={102} y={152} textAnchor="middle" fontSize="26" fontWeight="800" fill={cell("I").ink}
            className="pointer-events-none">I</text>
          <text x={178} y={152} textAnchor="middle" fontSize="26" fontWeight="800" fill={cell("R").ink}
            className="pointer-events-none">R</text>
        </svg>

        <div>
          <div className="flex gap-1.5" role="tablist" aria-label="Quantity to find">
            {(["V", "I", "R"] as Q[]).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={q === k}
                onClick={() => setQ(k)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  q === k
                    ? "bg-brand-600 text-white"
                    : "bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                Find {k}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
            <div className="text-lg font-bold tabular-nums text-brand-700">{d.formula}</div>
            <div className="mt-0.5 text-sm font-medium tabular-nums text-slate-700">
              The kettle: {d.worked}
            </div>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{d.meaning}</p>
        </div>
      </div>

      <p className="px-5 pb-4 pt-3 text-xs leading-5 text-slate-400">
        Cover the quantity you want with a thumb and the triangle shows how to get it from the
        other two. The worked numbers are the lesson&apos;s kettle: a 17.7 Ω element on a 230 V supply.
      </p>
    </div>
  );
}
