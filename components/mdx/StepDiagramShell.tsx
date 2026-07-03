"use client";

import { useState } from "react";

/**
 * Generic chrome for step-through diagrams: prev/next controls, step dots,
 * a caption panel, and a render-prop for the SVG so each diagram owns its
 * own drawing. Specific diagrams (VapourCompressionCycle, future SteamLoop,
 * BrewingProcess, …) define their steps in TS and render through this —
 * lessons then use them as no-prop MDX tags, keeping MDX → component data
 * flow trivial.
 */

export interface DiagramStep {
  /** Short name shown above the caption, e.g. "2 · Compressor". */
  title: string;
  /** One- or two-sentence explanation of what happens at this step. */
  caption: string;
}

export default function StepDiagramShell({
  title,
  steps,
  renderDiagram,
}: {
  title: string;
  steps: DiagramStep[];
  /** Draw the SVG for the given step index (0 = overview by convention). */
  renderDiagram: (step: number) => React.ReactNode;
}) {
  const [step, setStep] = useState(0);
  const last = steps.length - 1;

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-2.5">
        <span className="text-sm font-bold text-slate-800">{title}</span>
        <span className="text-xs text-slate-400">
          {step + 1} / {steps.length}
        </span>
      </div>

      <div className="px-4 pt-4">{renderDiagram(step)}</div>

      <div className="px-5 pb-4 pt-3">
        <div className="min-h-[3.5rem]">
          <div className="text-sm font-semibold text-slate-800">{steps[step].title}</div>
          <p className="mt-0.5 text-sm leading-6 text-slate-600">{steps[step].caption}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 disabled:opacity-40"
          >
            ← Back
          </button>

          <div className="flex items-center gap-1.5" role="tablist" aria-label="Diagram steps">
            {steps.map((s, i) => (
              <button
                key={s.title}
                role="tab"
                aria-selected={i === step}
                aria-label={s.title}
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all ${
                  i === step ? "w-5 bg-brand-600" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setStep((s) => Math.min(last, s + 1))}
            disabled={step === last}
            className="rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
