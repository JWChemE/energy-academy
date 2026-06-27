"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  CalcStatus,
  CauseDef,
  ActionDef,
  DiagnosticCase,
  TIER_LABEL,
  scoreCase,
} from "@/lib/diagnostics";
import CalcStep from "./CalcStep";
import WorkPlanBuilder from "./WorkPlanBuilder";

/**
 * Generic five-step diagnostic capstone shared by the steam and HVAC tools:
 * Investigate → Calculate → Diagnose → Prescribe → Verify. Each domain supplies
 * its cases, cause/action pools, an accent colour and a reference panel.
 */

export interface Accent {
  /** chip background+text, e.g. "bg-teal-100 text-teal-700" */
  tag: string;
  /** selected checklist row, e.g. "border-teal-400 bg-teal-50" */
  rowOn: string;
  /** selected checkbox, e.g. "border-teal-500 bg-teal-500" */
  box: string;
}

type Step = "investigate" | "calculate" | "diagnose" | "prescribe" | "verify";
const STEPS: { id: Step; label: string }[] = [
  { id: "investigate", label: "1. Investigate" },
  { id: "calculate", label: "2. Calculate" },
  { id: "diagnose", label: "3. Diagnose" },
  { id: "prescribe", label: "4. Prescribe" },
  { id: "verify", label: "5. Verify" },
];

export default function CaseDiagnostics<T extends DiagnosticCase>({
  cases,
  causes,
  actions,
  accent,
  intro,
  renderReference,
}: {
  cases: T[];
  causes: CauseDef[];
  actions: ActionDef[];
  accent: Accent;
  intro: ReactNode;
  renderReference: (c: T) => ReactNode;
}) {
  const [caseId, setCaseId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("investigate");
  const [calcStatuses, setCalcStatuses] = useState<CalcStatus[]>([]);
  const [causeSel, setCauseSel] = useState<Set<string>>(new Set());
  const [plan, setPlan] = useState<string[]>([]);

  const theCase = caseId ? cases.find((c) => c.id === caseId) ?? null : null;
  const tierOf = (id: string) => actions.find((a) => a.id === id)?.tier ?? 1;

  const score = useMemo(
    () => (theCase ? scoreCase(theCase, calcStatuses, [...causeSel], plan, actions) : null),
    [theCase, calcStatuses, causeSel, plan, actions]
  );

  function openCase(id: string) {
    setCaseId(id);
    setStep("investigate");
    setCalcStatuses([]);
    setCauseSel(new Set());
    setPlan([]);
  }
  function restart() {
    setStep("investigate");
    setCalcStatuses([]);
    setCauseSel(new Set());
    setPlan([]);
  }
  function toggleCause(id: string) {
    setCauseSel((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const calcResolved =
    !!theCase &&
    (theCase.calcParts.length === 0 ||
      (calcStatuses.length === theCase.calcParts.length &&
        calcStatuses.every((s) => s !== "unsolved")));

  // ---- case picker ----
  if (!theCase) {
    return (
      <div>
        <div className="mb-4 text-sm text-slate-600">{intro}</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => openCase(c.id)}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-900 hover:shadow-sm"
            >
              <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${accent.tag}`}>
                {c.tag}
              </span>
              <h3 className="mt-2 text-sm font-bold text-slate-900">{c.title}</h3>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const causeItems = theCase.candidateCauseIds.map((id) => causes.find((x) => x.id === id)!);
  const actionItems = theCase.candidateActionIds.map((id) => actions.find((x) => x.id === id)!);
  const labelOfAction = (id: string) => actions.find((a) => a.id === id)?.label;

  return (
    <div>
      {/* header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${accent.tag}`}>
            {theCase.tag}
          </span>
          <h2 className="mt-1 text-lg font-bold text-slate-900">{theCase.title}</h2>
        </div>
        <button
          onClick={() => setCaseId(null)}
          className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-300"
        >
          ← All cases
        </button>
      </div>

      {/* stepper */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {STEPS.map((s) => {
          const idx = STEPS.findIndex((x) => x.id === s.id);
          const cur = STEPS.findIndex((x) => x.id === step);
          const state = idx < cur ? "done" : idx === cur ? "current" : "todo";
          return (
            <div
              key={s.id}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                state === "current"
                  ? "bg-slate-900 text-white"
                  : state === "done"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {state === "done" ? "✓ " : ""}
              {s.label}
            </div>
          );
        })}
      </div>

      {/* STEP 1: INVESTIGATE */}
      {step === "investigate" && (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-2 text-sm font-bold text-slate-900">📋 The call-out</h3>
            <p className="text-sm leading-relaxed text-slate-700">{theCase.brief}</p>
            <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3">
              {theCase.knownFacts.map((f, i) => (
                <li key={i} className="text-xs text-slate-500">• {f}</li>
              ))}
            </ul>
          </div>
          <Readings c={theCase} />
          <div className="flex justify-end">
            <button
              onClick={() => setStep("calculate")}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              {theCase.calcParts.length > 0 ? "Work out the numbers →" : "Proceed →"}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CALCULATE */}
      {step === "calculate" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-5">
            <Readings c={theCase} />
            <KnownFacts c={theCase} />
          </div>
          <div className="space-y-4">
            {theCase.calcParts.length > 0 ? (
              <CalcStep
                parts={theCase.calcParts}
                reference={renderReference(theCase)}
                onStatuses={setCalcStatuses}
              />
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                No calculation needed for this one — straight to diagnosis.
              </div>
            )}
            <div className="flex justify-between">
              <button
                onClick={() => setStep("investigate")}
                className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep("diagnose")}
                disabled={!calcResolved}
                className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-40"
              >
                Proceed to diagnosis →
              </button>
            </div>
            {!calcResolved && (
              <p className="text-right text-xs text-slate-400">Solve or skip each calculation to continue.</p>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: DIAGNOSE */}
      {step === "diagnose" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Readings c={theCase} />
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-bold text-slate-900">What is wrong?</h3>
              <p className="mb-3 text-xs text-slate-500">
                Use your figures and the evidence. Select every root cause that applies — and only those.
              </p>
              <Checklist items={causeItems} selected={causeSel} onToggle={toggleCause} accent={accent} />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep("calculate")}
                className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep("prescribe")}
                disabled={causeSel.size === 0}
                className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-40"
              >
                Submit diagnosis →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: PRESCRIBE */}
      {step === "prescribe" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Readings c={theCase} />
          <div className="space-y-4">
            <WorkPlanBuilder candidates={actionItems} plan={plan} onChange={setPlan} />
            <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500">
              Order matters: safety first, then no-cost / operational, then remedial, then capital.
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep("diagnose")}
                className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep("verify")}
                disabled={plan.length === 0}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
              >
                Submit &amp; verify →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: VERIFY */}
      {step === "verify" && score && (
        <div className="space-y-5">
          <div
            className={`rounded-xl border-2 p-5 ${
              score.passed ? "border-emerald-300 bg-emerald-50" : "border-amber-300 bg-amber-50"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-slate-900">
                {score.passed ? "✅ Case solved" : "⚠️ Not a clean pass"} — score {score.total}/100
              </h3>
              {score.usedCalcHelp && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Hint/skip used — retry the maths unaided to pass
                </span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center text-sm sm:grid-cols-5">
              <ScorePill label="Calculation" value={score.calcScore} />
              <ScorePill label="Diagnosis" value={score.causeScore} />
              <ScorePill label="Prescription" value={score.actionScore} />
              <ScorePill label="Sequence" value={score.orderScore} />
              <ScorePill label="Capture" value={score.captured ? 100 : 0} />
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h4 className="mb-2 text-sm font-bold text-slate-900">Your diagnosis</h4>
              <AnswerReview items={causeItems} selected={causeSel} correct={new Set(theCase.correctCauseIds)} />

              <h4 className="mb-2 mt-4 text-sm font-bold text-slate-900">Your prescription</h4>
              <AnswerReview
                items={actionItems.filter((it) => !theCase.improvementActionIds.includes(it.id))}
                selected={new Set(plan)}
                correct={new Set(theCase.correctActionIds)}
              />

              {score.improvementsSpotted.length > 0 && (
                <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                  <div className="mb-1.5 text-xs font-bold text-indigo-800">
                    🏗️ Future capital projects you spotted
                  </div>
                  <ul className="space-y-1">
                    {score.improvementsSpotted.map((id) => (
                      <li key={id} className="text-xs text-indigo-900">
                        ✓ {labelOfAction(id)}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-[11px] leading-snug text-indigo-700">
                    Good wider-opportunity spotting — no marks lost; these belong in a future capital plan.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="mb-2 text-sm font-bold text-slate-900">Your sequence</h4>
                <ol className="space-y-1.5">
                  {plan.map((id, i) => (
                    <li key={id} className="flex items-center gap-2 text-xs">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-slate-700">{labelOfAction(id)}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                        {TIER_LABEL[tierOf(id)]}
                      </span>
                    </li>
                  ))}
                </ol>
                {score.hasOrderInversion && (
                  <p className="mt-2 rounded bg-amber-50 px-2 py-1.5 text-[11px] text-amber-700">
                    ⚠️ A capital item was scheduled before a lower-cost fix. Good practice: safety → no-cost → remedial → capital.
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-2 text-sm font-bold text-slate-900">🩺 Debrief — the real fault chain</h4>
                <ol className="mb-3 space-y-1">
                  {theCase.faultChain.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                      <span className="font-mono text-slate-400">{i + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ol>
                <p className="text-sm leading-relaxed text-slate-600">{theCase.debrief}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-3">
            <button
              onClick={restart}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-300"
            >
              ↺ Try this case again
            </button>
            <button
              onClick={() => setCaseId(null)}
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Choose another case →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- helpers ----

function KnownFacts({ c }: { c: DiagnosticCase }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        What you know (from the brief)
      </div>
      <ul className="space-y-1">
        {c.knownFacts.map((f, i) => (
          <li key={i} className="text-xs text-slate-600">• {f}</li>
        ))}
      </ul>
    </div>
  );
}

function Readings({ c }: { c: DiagnosticCase }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        Site readings (raw)
      </div>
      <div className="space-y-2">
        {c.readings.map((r, i) => (
          <div key={i} className="flex items-baseline justify-between gap-3 border-b border-slate-800 pb-1.5 last:border-0">
            <span className="text-xs text-slate-400">{r.label}</span>
            <span className="text-right">
              <span className="font-mono text-sm font-bold text-slate-100">{r.value}</span>
              {r.unit && <span className="ml-1 text-[10px] text-slate-500">{r.unit}</span>}
              {r.note && <span className="block text-[10px] italic text-amber-300">{r.note}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Checklist({
  items,
  selected,
  onToggle,
  accent,
}: {
  items: { id: string; label: string }[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  accent: Accent;
}) {
  return (
    <div className="space-y-2">
      {items.map((it) => {
        const on = selected.has(it.id);
        return (
          <button
            key={it.id}
            onClick={() => onToggle(it.id)}
            className={`flex w-full items-start gap-2.5 rounded-lg border p-2.5 text-left text-sm transition ${
              on ? accent.rowOn : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <span
              className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border text-white ${
                on ? accent.box : "border-slate-300"
              }`}
            >
              {on && "✓"}
            </span>
            <span className="text-slate-800">{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function AnswerReview({
  items,
  selected,
  correct,
}: {
  items: { id: string; label: string }[];
  selected: Set<string>;
  correct: Set<string>;
}) {
  return (
    <ul className="space-y-1.5">
      {items.map((it) => {
        const picked = selected.has(it.id);
        const should = correct.has(it.id);
        if (!picked && !should) return null;
        let mark = "";
        let cls = "text-slate-400";
        if (picked && should) {
          mark = "✓";
          cls = "text-emerald-600 font-medium";
        } else if (picked && !should) {
          mark = "✗";
          cls = "text-red-600";
        } else {
          mark = "○";
          cls = "text-amber-600";
        }
        return (
          <li key={it.id} className={`flex gap-2 text-xs ${cls}`}>
            <span className="font-bold">{mark}</span>
            {it.label}
            {!picked && should && <span className="italic"> (missed)</span>}
            {picked && !should && <span className="italic"> (not needed)</span>}
          </li>
        );
      })}
    </ul>
  );
}

function ScorePill({ label, value }: { label: string; value: number }) {
  const tone = value >= 70 ? "text-emerald-700" : value >= 40 ? "text-amber-700" : "text-red-700";
  return (
    <div className="rounded-lg bg-white/70 px-2 py-1.5">
      <div className={`text-lg font-bold ${tone}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}
