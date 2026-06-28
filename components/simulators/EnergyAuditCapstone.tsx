"use client";

import { useCallback, useMemo, useState } from "react";
import CalcStep from "./CalcStep";
import {
  STAGES,
  DATASET,
  REFERENCE,
  type Stage,
  type MultiQ,
  type SingleQ,
  type OrderQ,
  type Question,
  scoreMulti,
  scoreOrder,
  scoreCalcStatus,
  verdict,
} from "@/lib/auditCapstone";

interface QResult {
  checked: boolean;
  score: number;
}

export default function EnergyAuditCapstone() {
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<Record<string, QResult>>({});
  const [calc, setCalc] = useState<Record<string, string[]>>({});

  const setQ = useCallback((id: string, score: number) => {
    setResults((prev) => ({ ...prev, [id]: { checked: true, score } }));
  }, []);

  const setStageCalc = useCallback((stageId: string, statuses: string[]) => {
    setCalc((prev) => ({ ...prev, [stageId]: statuses }));
  }, []);

  const stagePct = useCallback(
    (stage: Stage): number => {
      const items: number[] = [];
      (stage.questions ?? []).forEach((q) => {
        const r = results[q.id];
        if (r?.checked) items.push(r.score);
      });
      (calc[stage.id] ?? []).forEach((s) => items.push(scoreCalcStatus(s)));
      if (items.length === 0) return 0;
      return items.reduce((a, b) => a + b, 0) / items.length;
    },
    [results, calc]
  );

  const stage = STAGES[current];

  const canContinue = useMemo(() => {
    const allQchecked = (stage.questions ?? []).every((q) => results[q.id]?.checked);
    const statuses = calc[stage.id] ?? [];
    const allCalcResolved =
      !stage.calcParts || (statuses.length === stage.calcParts.length && statuses.every((s) => s !== "unsolved"));
    return allQchecked && allCalcResolved;
  }, [stage, results, calc]);

  if (finished) {
    return <Scorecard stagePct={stagePct} onRestart={() => { setCurrent(0); setFinished(false); setResults({}); setCalc({}); }} />;
  }

  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-white">
      <Stepper current={current} />

      <div className="border-t border-slate-100 p-5 sm:p-6">
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-600">
          <span>{stage.icon}</span>
          <span>{stage.competency}</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Stage {current + 1}: {stage.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{stage.intro}</p>

        {stage.showData && <DataPanel />}

        {stage.calcIntro && <p className="mt-5 text-sm font-medium text-slate-700">{stage.calcIntro}</p>}

        {stage.calcParts && (
          <div className="mt-3">
            <CalcStep parts={stage.calcParts} onStatuses={(s) => setStageCalc(stage.id, s)} />
          </div>
        )}

        {stage.questions && (
          <div className="mt-5 space-y-5">
            {stage.questions.map((q) => (
              <QuestionBlock key={q.id} q={q} onResult={setQ} />
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-40"
          >
            ← Back
          </button>
          {!canContinue && (
            <span className="text-xs text-slate-400">
              {stage.calcParts ? "Resolve every figure and " : ""}check every question to continue.
            </span>
          )}
          {current < STAGES.length - 1 ? (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              disabled={!canContinue}
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={() => setFinished(true)}
              disabled={!canContinue}
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-40"
            >
              See your scorecard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Stepper ----------

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex flex-wrap gap-1 p-3">
      {STAGES.map((s, i) => (
        <div
          key={s.id}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            i === current
              ? "bg-brand-600 text-white"
              : i < current
              ? "bg-brand-50 text-brand-700"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          <span>{s.icon}</span>
          <span className="hidden sm:inline">{s.title}</span>
        </div>
      ))}
    </div>
  );
}

// ---------- Data + reference panel ----------

function DataPanel() {
  return (
    <div className="mt-4 space-y-3">
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-2 py-2 text-left font-semibold">Month</th>
              <th className="px-2 py-2 font-semibold">Avg °C</th>
              <th className="px-2 py-2 font-semibold">HDD</th>
              <th className="px-2 py-2 font-semibold">Gas kWh</th>
              <th className="px-2 py-2 font-semibold">Elec kWh</th>
              <th className="px-2 py-2 font-semibold">Tonnes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DATASET.map((r) => (
              <tr key={r.month} className="text-slate-700">
                <td className="px-2 py-1.5 text-left font-medium">{r.month}</td>
                <td className="px-2 py-1.5">{r.avgTempC.toFixed(1)}</td>
                <td className="px-2 py-1.5">{r.month === "Mar" ? "?" : r.hdd}</td>
                <td className="px-2 py-1.5">{r.gasKwh.toLocaleString()}</td>
                <td className="px-2 py-1.5">{r.elecKwh.toLocaleString()}</td>
                <td className="px-2 py-1.5">{r.tonnes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <span><strong>Reference</strong> —</span>
        <span>HDD base {REFERENCE.hddBase} °C</span>
        <span>Elec £{REFERENCE.elecPrice}/kWh</span>
        <span>Gas £{REFERENCE.gasPrice}/kWh</span>
        <span>Grid {REFERENCE.co2Factor} kg CO₂e/kWh</span>
        <span>Floor area {REFERENCE.floorArea.toLocaleString()} m²</span>
      </div>
    </div>
  );
}

// ---------- Question primitives ----------

function QuestionBlock({ q, onResult }: { q: Question; onResult: (id: string, score: number) => void }) {
  if (q.kind === "multi") return <MultiQuestion q={q} onResult={onResult} />;
  if (q.kind === "single") return <SingleQuestion q={q} onResult={onResult} />;
  return <OrderQuestion q={q} onResult={onResult} />;
}

function QShell({
  prompt,
  help,
  children,
}: {
  prompt: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-sm font-semibold text-slate-800">{prompt}</p>
      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Explanation({ correct, text }: { correct: boolean; text: string }) {
  return (
    <div
      className={`mt-3 rounded-lg px-3 py-2 text-xs leading-relaxed ${
        correct ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
      }`}
    >
      <span className="font-semibold">{correct ? "✓ " : "Not quite. "}</span>
      {text}
    </div>
  );
}

function MultiQuestion({ q, onResult }: { q: MultiQ; onResult: (id: string, score: number) => void }) {
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);

  function toggle(id: string) {
    if (checked) return;
    setSel((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function check() {
    const score = scoreMulti([...sel], q.correctIds);
    setChecked(true);
    onResult(q.id, score);
  }

  const correctSet = new Set(q.correctIds);
  const fullyRight = checked && sel.size === q.correctIds.length && [...sel].every((id) => correctSet.has(id));

  return (
    <QShell prompt={q.prompt} help={q.help}>
      <div className="space-y-1.5">
        {q.options.map((o) => {
          const picked = sel.has(o.id);
          const isCorrect = correctSet.has(o.id);
          let cls = "border-slate-200 bg-white hover:border-slate-300";
          if (checked) {
            if (isCorrect) cls = "border-emerald-300 bg-emerald-50";
            else if (picked) cls = "border-red-300 bg-red-50";
            else cls = "border-slate-200 bg-white opacity-60";
          } else if (picked) {
            cls = "border-brand-400 bg-brand-50";
          }
          return (
            <button
              key={o.id}
              onClick={() => toggle(o.id)}
              disabled={checked}
              className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${cls}`}
            >
              <span className="mt-0.5 text-xs">
                {checked ? (isCorrect ? "✓" : picked ? "✗" : "·") : picked ? "☑" : "☐"}
              </span>
              <span className="text-slate-700">{o.label}</span>
            </button>
          );
        })}
      </div>
      {!checked ? (
        <button
          onClick={check}
          disabled={sel.size === 0}
          className="mt-3 rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-40"
        >
          Check
        </button>
      ) : (
        <Explanation correct={fullyRight} text={q.explain} />
      )}
    </QShell>
  );
}

function SingleQuestion({ q, onResult }: { q: SingleQ; onResult: (id: string, score: number) => void }) {
  const [sel, setSel] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  function check() {
    if (!sel) return;
    setChecked(true);
    onResult(q.id, sel === q.correctId ? 1 : 0);
  }

  return (
    <QShell prompt={q.prompt} help={q.help}>
      <div className="space-y-1.5">
        {q.options.map((o) => {
          const picked = sel === o.id;
          const isCorrect = o.id === q.correctId;
          let cls = "border-slate-200 bg-white hover:border-slate-300";
          if (checked) {
            if (isCorrect) cls = "border-emerald-300 bg-emerald-50";
            else if (picked) cls = "border-red-300 bg-red-50";
            else cls = "border-slate-200 bg-white opacity-60";
          } else if (picked) {
            cls = "border-brand-400 bg-brand-50";
          }
          return (
            <button
              key={o.id}
              onClick={() => !checked && setSel(o.id)}
              disabled={checked}
              className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${cls}`}
            >
              <span className="mt-0.5 text-xs">
                {checked ? (isCorrect ? "✓" : picked ? "✗" : "·") : picked ? "◉" : "○"}
              </span>
              <span className="text-slate-700">{o.label}</span>
            </button>
          );
        })}
      </div>
      {!checked ? (
        <button
          onClick={check}
          disabled={!sel}
          className="mt-3 rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-40"
        >
          Check
        </button>
      ) : (
        <Explanation correct={sel === q.correctId} text={q.explain} />
      )}
    </QShell>
  );
}

function OrderQuestion({ q, onResult }: { q: OrderQ; onResult: (id: string, score: number) => void }) {
  const shuffled = useMemo(() => [...q.items].sort(() => Math.random() - 0.5), [q.items]);
  const [arranged, setArranged] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const labelOf = (id: string) => q.items.find((i) => i.id === id)?.label ?? id;
  const remaining = shuffled.filter((i) => !arranged.includes(i.id));

  function check() {
    setChecked(true);
    onResult(q.id, scoreOrder(arranged, q.correctOrder));
  }

  return (
    <QShell prompt={q.prompt} help={q.help}>
      <div className="space-y-2">
        {arranged.map((id, idx) => {
          const right = checked && q.correctOrder[idx] === id;
          const wrong = checked && q.correctOrder[idx] !== id;
          return (
            <div
              key={id}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                right ? "border-emerald-300 bg-emerald-50" : wrong ? "border-red-300 bg-red-50" : "border-slate-300 bg-slate-50"
              }`}
            >
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
                {idx + 1}
              </span>
              <span className="text-slate-700">{labelOf(id)}</span>
              {checked && wrong && (
                <span className="ml-auto text-[11px] text-red-600">should be #{q.correctOrder.indexOf(id) + 1}</span>
              )}
            </div>
          );
        })}
      </div>

      {!checked && remaining.length > 0 && (
        <div className="mt-3 space-y-1.5">
          <p className="text-xs text-slate-400">Click in order:</p>
          {remaining.map((i) => (
            <button
              key={i.id}
              onClick={() => setArranged((a) => [...a, i.id])}
              className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:border-brand-400 hover:bg-brand-50"
            >
              <span className="text-xs text-slate-400">+</span>
              {i.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        {!checked && arranged.length > 0 && (
          <button
            onClick={() => setArranged([])}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-slate-600"
          >
            Reset
          </button>
        )}
        {!checked && remaining.length === 0 && (
          <button
            onClick={check}
            className="rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Check order
          </button>
        )}
      </div>

      {checked && <Explanation correct={scoreOrder(arranged, q.correctOrder) === 1} text={q.explain} />}
    </QShell>
  );
}

// ---------- Scorecard ----------

function Scorecard({ stagePct, onRestart }: { stagePct: (s: Stage) => number; onRestart: () => void }) {
  const rows = STAGES.map((s) => ({ stage: s, pct: stagePct(s) }));
  const overall = rows.reduce((a, r) => a + r.pct, 0) / rows.length;
  const v = verdict(overall);
  const tone =
    v.tone === "good" ? "text-emerald-700" : v.tone === "ok" ? "text-amber-700" : "text-red-700";

  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-bold text-slate-900">Audit scorecard</h3>
      <p className={`mt-1 text-sm font-semibold ${tone}`}>
        {Math.round(overall * 100)}% overall — {v.label}
      </p>

      <div className="mt-5 space-y-3">
        {rows.map(({ stage, pct }) => (
          <div key={stage.id}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">
                {stage.icon} {stage.competency}
              </span>
              <span className="text-slate-500">{Math.round(pct * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${pct >= 0.8 ? "bg-emerald-500" : pct >= 0.6 ? "bg-amber-500" : "bg-red-400"}`}
                style={{ width: `${Math.max(4, Math.round(pct * 100))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
        <p className="font-semibold text-slate-800">What this means</p>
        <p className="mt-1">
          A real audit is judged on the whole chain — not just the maths. Your weakest competency above is
          where a client would lose confidence first. Re-run any stage to tighten it: aim to pass the
          calculations <em>unaided</em>, and to defend every opportunity with a normalised baseline.
        </p>
      </div>

      <button
        onClick={onRestart}
        className="mt-5 rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Run it again
      </button>
    </div>
  );
}
