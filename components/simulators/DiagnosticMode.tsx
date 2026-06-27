"use client";

import { useMemo, useState } from "react";
import { simulatePlant } from "@/lib/boilerPlant";
import {
  CASES,
  getCase,
  applyActions,
  scoreCase,
  ALL_CAUSES,
  ALL_ACTIONS,
  TIER_LABEL,
  actionTier,
} from "@/lib/boilerCases";
import PlantInstruments from "./PlantInstruments";
import InspectionCards from "./InspectionCards";
import EnergyFlowBar from "./EnergyFlowBar";
import WorkPlanBuilder from "./WorkPlanBuilder";

type Step = "investigate" | "diagnose" | "prescribe" | "verify";
const STEPS: { id: Step; label: string }[] = [
  { id: "investigate", label: "1. Investigate" },
  { id: "diagnose", label: "2. Diagnose" },
  { id: "prescribe", label: "3. Prescribe" },
  { id: "verify", label: "4. Verify" },
];

export default function DiagnosticMode() {
  const [caseId, setCaseId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("investigate");
  const [causes, setCauses] = useState<Set<string>>(new Set());
  const [plan, setPlan] = useState<string[]>([]);

  const theCase = caseId ? getCase(caseId) : null;

  const before = useMemo(
    () => (theCase ? simulatePlant(theCase.config) : null),
    [theCase]
  );
  const after = useMemo(
    () => (theCase ? simulatePlant(applyActions(theCase.config, plan)) : null),
    [theCase, plan]
  );
  const score = useMemo(() => {
    if (!theCase || !after) return null;
    const danger = after.warnings.some((w) => w.level === "danger");
    return scoreCase(theCase, [...causes], plan, after.efficiency, danger);
  }, [theCase, after, causes, plan]);

  function openCase(id: string) {
    setCaseId(id);
    setStep("investigate");
    setCauses(new Set());
    setPlan([]);
  }
  function restart() {
    setStep("investigate");
    setCauses(new Set());
    setPlan([]);
  }
  const toggle = (set: Set<string>, setter: (s: Set<string>) => void) => (id: string) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setter(next);
  };

  // ---- case picker ----
  if (!theCase || !before || !after) {
    return (
      <div>
        <p className="mb-4 text-sm text-slate-600">
          Six boiler-house call-outs, each with a different underlying fault. Read the panel,
          walk the plant, work out what's really wrong, prescribe the fix, and prove it works.
          The same symptom can have several causes — diagnose, don't guess.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => openCase(c.id)}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-900 hover:shadow-sm"
            >
              <span className="inline-block rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                {c.tag}
              </span>
              <h3 className="mt-2 font-bold text-slate-900">{c.title}</h3>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const causeItems = theCase.candidateCauseIds.map(
    (id) => ALL_CAUSES.find((x) => x.id === id)!
  );
  const actionItems = theCase.candidateActionIds.map(
    (id) => ALL_ACTIONS.find((x) => x.id === id)!
  );

  return (
    <div>
      {/* header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-block rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
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
          const curIdx = STEPS.findIndex((x) => x.id === step);
          const state = idx < curIdx ? "done" : idx === curIdx ? "current" : "todo";
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
                <li key={i} className="text-xs text-slate-500">
                  • {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <PlantInstruments r={before} />
            <div className="space-y-5">
              <EnergyFlowBar losses={before.losses} />
              <InspectionCards config={theCase.config} readings={before} />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setStep("diagnose")}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Proceed to diagnosis →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DIAGNOSE */}
      {step === "diagnose" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <PlantInstruments r={before} />
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-bold text-slate-900">What is wrong?</h3>
              <p className="mb-3 text-xs text-slate-500">
                Select every root cause you believe applies — and only those. Picking the wrong one costs you.
              </p>
              <Checklist
                items={causeItems}
                selected={causes}
                onToggle={toggle(causes, setCauses)}
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setStep("investigate")}
                className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep("prescribe")}
                disabled={causes.size === 0}
                className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-40"
              >
                Submit diagnosis →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PRESCRIBE */}
      {step === "prescribe" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <PlantInstruments r={before} />
          <div className="space-y-4">
            <WorkPlanBuilder candidates={actionItems} plan={plan} onChange={setPlan} />
            <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500">
              Tip: order matters. Good practice is safety first, then no-cost / operational fixes,
              then remedial maintenance, then any capital improvements.
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
                Apply fixes &amp; verify →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: VERIFY + DEBRIEF */}
      {step === "verify" && score && (
        <div className="space-y-5">
          {/* result banner */}
          <div
            className={`rounded-xl border-2 p-5 ${
              score.passed ? "border-emerald-300 bg-emerald-50" : "border-amber-300 bg-amber-50"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-slate-900">
                {score.passed ? "✅ Case solved" : "⚠️ Not quite"} — score {score.total}/100
              </h3>
              <div className="text-sm font-semibold text-slate-700">
                Efficiency {before.efficiency}% → {after.efficiency}%{" "}
                {score.recovered ? "(recovered ✓)" : `(target ${theCase.recoveryEfficiency}%)`}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center text-sm sm:grid-cols-4">
              <ScorePill label="Diagnosis" value={score.causeScore} />
              <ScorePill label="Prescription" value={score.actionScore} />
              <ScorePill label="Sequence" value={score.orderScore} />
              <ScorePill label="Recovery" value={score.recovered ? 100 : 0} />
            </div>
          </div>

          {/* before/after + flow */}
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                After your fixes
              </div>
              <PlantInstruments r={after} />
            </div>
            <div className="space-y-5">
              <EnergyFlowBar losses={after.losses} />

              {/* answer review */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="mb-2 text-sm font-bold text-slate-900">Your diagnosis</h4>
                <AnswerReview
                  items={causeItems}
                  selected={causes}
                  correct={new Set(theCase.correctCauseIds)}
                />

                <h4 className="mb-2 mt-4 text-sm font-bold text-slate-900">Your prescription</h4>
                <AnswerReview
                  items={actionItems.filter((it) => !theCase.improvementActionIds.includes(it.id))}
                  selected={new Set(plan)}
                  correct={new Set(theCase.correctActionIds)}
                />

                {/* spotted wider opportunities — accepted, no penalty */}
                {score.improvementsSpotted.length > 0 && (
                  <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                    <div className="mb-1.5 text-xs font-bold text-indigo-800">
                      🏗️ Future capital projects you spotted
                    </div>
                    <ul className="space-y-1">
                      {score.improvementsSpotted.map((id) => (
                        <li key={id} className="text-xs text-indigo-900">
                          ✓ {ALL_ACTIONS.find((a) => a.id === id)?.label}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-1.5 text-[11px] leading-snug text-indigo-700">
                      Not needed to fix this fault, but genuine efficiency improvements — good wider-opportunity
                      spotting. No marks lost; these belong in a future capital plan.
                    </p>
                  </div>
                )}
              </div>

              {/* the sequence the learner chose, with tiers */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="mb-2 text-sm font-bold text-slate-900">Your sequence</h4>
                <ol className="space-y-1.5">
                  {plan.map((id, i) => {
                    const tier = actionTier(id);
                    return (
                      <li key={id} className="flex items-center gap-2 text-xs">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        <span className="flex-1 text-slate-700">
                          {ALL_ACTIONS.find((a) => a.id === id)?.label}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                          {TIER_LABEL[tier]}
                        </span>
                      </li>
                    );
                  })}
                </ol>
                {score.hasOrderInversion && (
                  <p className="mt-2 rounded bg-amber-50 px-2 py-1.5 text-[11px] text-amber-700">
                    ⚠️ A capital improvement was scheduled before a lower-cost fix. Good practice is
                    safety → no-cost → remedial → capital.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* debrief */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
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

function Checklist({
  items,
  selected,
  onToggle,
}: {
  items: { id: string; label: string }[];
  selected: Set<string>;
  onToggle: (id: string) => void;
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
              on ? "border-sky-400 bg-sky-50" : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <span
              className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${
                on ? "border-sky-500 bg-sky-500 text-white" : "border-slate-300"
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
        let mark = "";
        let cls = "text-slate-400";
        if (picked && should) {
          mark = "✓";
          cls = "text-emerald-600 font-medium";
        } else if (picked && !should) {
          mark = "✗";
          cls = "text-red-600";
        } else if (!picked && should) {
          mark = "○";
          cls = "text-amber-600";
        }
        if (!picked && !should) return null;
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
