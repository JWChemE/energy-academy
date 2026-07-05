"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { quizzes, type QuizQuestion } from "@/content/quizzes";
import { useAuth } from "@/app/auth-context";
import { saveQuizResult } from "@/lib/supabase";

export type { QuizQuestion };

export function Quiz({
  id,
  questions: questionsProp,
  title = "Knowledge check",
}: {
  /** Look up a quiz from the registry in content/quizzes.ts. */
  id?: string;
  /** Or pass questions directly (used when rendering outside MDX). */
  questions?: QuizQuestion[];
  title?: string;
}) {
  const questions: QuizQuestion[] =
    questionsProp ?? (id ? quizzes[id] : undefined) ?? [];

  const { user } = useAuth();
  const pathname = usePathname();

  const [selected, setSelected] = useState<(number | null)[]>(
    () => questions.map(() => null),
  );
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = selected.filter((s) => s !== null).length;
  const allAnswered = answeredCount === questions.length;
  const score = questions.reduce(
    (acc, q, i) => acc + (selected[i] === q.answer ? 1 : 0),
    0,
  );

  function choose(qIndex: number, optIndex: number) {
    if (submitted) return;
    setSelected((prev) => {
      const next = [...prev];
      next[qIndex] = optIndex;
      return next;
    });
  }

  function reset() {
    setSelected(questions.map(() => null));
    setSubmitted(false);
  }

  /**
   * Persist the result for signed-in users (silent no-op otherwise).
   * Course and lesson come from the URL (/courses/<course>/<lesson>) rather
   * than props, since quiz data never travels through MDX props.
   */
  function submit() {
    setSubmitted(true);
    if (!user || !id) return;
    const parts = pathname?.split("/").filter(Boolean) ?? [];
    if (parts[0] !== "courses" || parts.length < 3) return;
    const answers: Record<string, number> = {};
    selected.forEach((choice, i) => {
      if (choice !== null) answers[String(i)] = choice;
    });
    const finalScore = questions.reduce(
      (acc, q, i) => acc + (selected[i] === q.answer ? 1 : 0),
      0,
    );
    void saveQuizResult(
      user.id,
      parts[1],
      parts[2],
      id,
      finalScore,
      questions.length,
      answers,
    ).catch(() => {
      // Persistence is best-effort; the quiz itself still works offline.
    });
  }

  if (questions.length === 0) {
    return (
      <p className="my-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
        Quiz{id ? ` "${id}"` : ""} not found. Add it to{" "}
        <code>content/quizzes.ts</code>.
      </p>
    );
  }

  return (
    <section className="my-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="m-0 text-lg font-semibold text-slate-900">{title}</h3>
        {submitted && (
          <span className="shrink-0 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
            {score} / {questions.length}
          </span>
        )}
      </div>

      <ol className="m-0 list-none space-y-6 p-0">
        {questions.map((q, qi) => {
          const chosen = selected[qi];
          return (
            <li key={qi} className="m-0">
              <p className="mb-3 font-medium text-slate-900">
                {qi + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrect = q.answer === oi;
                  const showRight = submitted && isCorrect;
                  const showWrong = submitted && isChosen && !isCorrect;

                  let cls =
                    "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/50";
                  if (showRight) cls = "border-emerald-400 bg-emerald-50";
                  else if (showWrong) cls = "border-rose-400 bg-rose-50";
                  else if (isChosen) cls = "border-brand-400 bg-brand-50";

                  return (
                    <label
                      key={oi}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${cls} ${
                        submitted ? "cursor-default" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${qi}`}
                        checked={isChosen}
                        onChange={() => choose(qi, oi)}
                        disabled={submitted}
                        className="mt-0.5 h-4 w-4 accent-brand-600"
                      />
                      <span className="text-slate-700">{opt}</span>
                      {showRight && (
                        <span className="ml-auto font-semibold text-emerald-600">
                          ✓
                        </span>
                      )}
                      {showWrong && (
                        <span className="ml-auto font-semibold text-rose-600">
                          ✕
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
              {submitted && q.explanation && (
                <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                  {q.explanation}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex items-center gap-3">
        {!submitted ? (
          <button
            type="button"
            onClick={submit}
            disabled={!allAnswered}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Check answers
          </button>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Try again
          </button>
        )}
        {!submitted && !allAnswered && (
          <span className="text-sm text-slate-400">
            {answeredCount} of {questions.length} answered
          </span>
        )}
      </div>
    </section>
  );
}
