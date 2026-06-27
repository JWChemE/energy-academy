"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CalcPart, CalcStatus, checkAnswer } from "@/lib/diagnostics";

/**
 * The Calculate step. The learner computes each derived figure from the raw
 * readings, types an answer, and checks it. "I'm stuck" reveals the method then
 * a numeric nudge — but using help marks the part as hinted, which blocks a
 * pass until they retry unaided. "Show answer" reveals the working and skips.
 */

interface PartState {
  value: string;
  hintsShown: number;
  resolved: CalcStatus | null; // unaided | hinted | skipped | null (open)
  lastWrong: boolean;
}

function parseNum(s: string): number | null {
  const cleaned = s.replace(/[£%,\s]/g, "");
  if (cleaned === "" || cleaned === "-") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export default function CalcStep({
  parts,
  reference,
  onStatuses,
}: {
  parts: CalcPart[];
  reference?: ReactNode;
  onStatuses: (s: CalcStatus[]) => void;
}) {
  const [state, setState] = useState<PartState[]>(
    parts.map(() => ({ value: "", hintsShown: 0, resolved: null, lastWrong: false }))
  );

  useEffect(() => {
    onStatuses(state.map((s) => s.resolved ?? "unsolved"));
  }, [state, onStatuses]);

  function update(i: number, patch: Partial<PartState>) {
    setState((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  }

  function check(i: number) {
    const num = parseNum(state[i].value);
    if (num === null) return;
    if (checkAnswer(parts[i], num)) {
      update(i, { resolved: state[i].hintsShown > 0 ? "hinted" : "unaided", lastWrong: false });
    } else {
      update(i, { lastWrong: true });
    }
  }

  return (
    <div className="space-y-4">
      {reference}

      <div className="space-y-3">
        {parts.map((part, i) => {
          const s = state[i];
          const done = s.resolved === "unaided" || s.resolved === "hinted";
          const skipped = s.resolved === "skipped";
          return (
            <div
              key={part.id}
              className={`rounded-xl border p-4 ${
                done
                  ? "border-emerald-200 bg-emerald-50"
                  : skipped
                  ? "border-slate-200 bg-slate-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-2 flex items-start gap-2">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-sm font-medium text-slate-800">{part.prompt}</p>
              </div>

              {!done && !skipped && (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center overflow-hidden rounded-lg border border-slate-300 bg-white">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={s.value}
                        onChange={(e) => update(i, { value: e.target.value, lastWrong: false })}
                        onKeyDown={(e) => e.key === "Enter" && check(i)}
                        placeholder="your answer"
                        className="w-32 px-3 py-1.5 text-sm outline-none"
                      />
                      <span className="border-l border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-500">
                        {part.unit}
                      </span>
                    </div>
                    <button
                      onClick={() => check(i)}
                      className="rounded-lg bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
                    >
                      Check
                    </button>
                    <button
                      onClick={() => update(i, { hintsShown: Math.min(s.hintsShown + 1, part.hints.length) })}
                      disabled={s.hintsShown >= part.hints.length}
                      className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-40"
                    >
                      I&apos;m stuck
                    </button>
                    <button
                      onClick={() => update(i, { resolved: "skipped" })}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-slate-600"
                    >
                      Show answer
                    </button>
                  </div>

                  {s.lastWrong && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      Not quite — check your working and try again.
                    </p>
                  )}

                  {s.hintsShown > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {part.hints.slice(0, s.hintsShown).map((h, hi) => (
                        <p
                          key={hi}
                          className="rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800"
                        >
                          <span className="font-semibold">{hi === 0 ? "Method: " : "Nudge: "}</span>
                          {h}
                        </p>
                      ))}
                      <p className="text-[11px] italic text-amber-600">
                        Using a hint means this won&apos;t count as a clean pass — retry unaided to score full marks.
                      </p>
                    </div>
                  )}
                </>
              )}

              {done && (
                <div className="text-sm">
                  <span className="font-bold text-emerald-700">
                    ✓ {s.value.replace(/[£%,\s]/g, "")} {part.unit}
                  </span>
                  <span className="ml-2 text-xs text-emerald-600">
                    {s.resolved === "hinted" ? "(correct, with a hint)" : "(correct, unaided)"}
                  </span>
                  <p className="mt-1 text-xs text-slate-500">{part.worked}</p>
                </div>
              )}

              {skipped && (
                <div className="text-sm">
                  <span className="font-semibold text-slate-600">Answer: {part.answer} {part.unit}</span>
                  <p className="mt-1 text-xs text-slate-500">{part.worked}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
