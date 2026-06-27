"use client";

import { useRef, useState } from "react";

/**
 * Build an *ordered* work plan. Click an available action to add it, then put
 * the plan in the sequence you'd carry it out — safety first, then no-cost
 * fixes, then capital. Reorder by dragging the handle (desktop) or with the
 * up/down arrows (works everywhere, incl. touch & keyboard).
 *
 * Deliberately shows no fix/improvement/wrong hints while building — that's the
 * point of the exercise; the verdict comes at the verify step.
 */
export default function WorkPlanBuilder({
  candidates,
  plan,
  onChange,
}: {
  candidates: { id: string; label: string }[];
  plan: string[];
  onChange: (plan: string[]) => void;
}) {
  const dragIndex = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const available = candidates.filter((c) => !plan.includes(c.id));
  const labelOf = (id: string) => candidates.find((c) => c.id === id)?.label ?? id;

  function add(id: string) {
    onChange([...plan, id]);
  }
  function remove(id: string) {
    onChange(plan.filter((x) => x !== id));
  }
  function move(from: number, to: number) {
    if (to < 0 || to >= plan.length) return;
    const next = [...plan];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }
  function onDrop(to: number) {
    const from = dragIndex.current;
    dragIndex.current = null;
    setOverIndex(null);
    if (from === null || from === to) return;
    move(from, to);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-bold text-slate-900">Build your work plan</h3>
      <p className="mb-3 text-xs text-slate-500">
        Add the actions you'd take, then order them as you'd carry them out (top first).
      </p>

      {/* Available pool */}
      <div className="mb-4">
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Available actions
        </div>
        {available.length === 0 ? (
          <p className="text-xs italic text-slate-400">All actions added to the plan.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {available.map((c) => (
              <button
                key={c.id}
                onClick={() => add(c.id)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-xs font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50"
              >
                + {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ordered plan */}
      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Your work plan (carry out top → bottom)
        </div>
        {plan.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
            Click an action above to start your plan.
          </div>
        ) : (
          <ol className="space-y-2">
            {plan.map((id, i) => (
              <li
                key={id}
                draggable
                onDragStart={() => (dragIndex.current = i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverIndex(i);
                }}
                onDrop={() => onDrop(i)}
                onDragEnd={() => {
                  dragIndex.current = null;
                  setOverIndex(null);
                }}
                className={`flex items-center gap-2 rounded-lg border bg-white p-2.5 transition ${
                  overIndex === i ? "border-sky-400 ring-1 ring-sky-200" : "border-slate-200"
                }`}
              >
                <span className="cursor-grab select-none text-slate-300" title="Drag to reorder" aria-hidden>
                  ⠿
                </span>
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="flex-1 text-xs font-medium text-slate-800">{labelOf(id)}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => move(i, i - 1)}
                    disabled={i === 0}
                    aria-label="Move up"
                    className="rounded border border-slate-200 px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => move(i, i + 1)}
                    disabled={i === plan.length - 1}
                    aria-label="Move down"
                    className="rounded border border-slate-200 px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => remove(id)}
                    aria-label="Remove"
                    className="rounded border border-slate-200 px-1.5 py-0.5 text-xs text-red-500 hover:bg-red-50"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
