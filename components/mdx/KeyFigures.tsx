/**
 * A stat strip that lifts a lesson's headline numbers out of the prose.
 *
 * Child-based API (no array props — keeps MDX → component data flow simple
 * and serialisable, same reasoning as the quiz-id pattern):
 *
 *   <KeyFigures>
 *     <KeyFigure value="489 kWh" label="process heat per batch" />
 *     <KeyFigure value="85%" label="boiler efficiency" />
 *     <KeyFigure value="£5,960/yr" label="recoverable from vapour" />
 *   </KeyFigures>
 */

export function KeyFigures({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {children}
    </div>
  );
}

export function KeyFigure({
  value,
  label,
  sublabel,
}: {
  value: string;
  label: string;
  sublabel?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3.5">
      <div className="text-2xl font-bold tracking-tight text-brand-700">{value}</div>
      <div className="mt-0.5 text-sm font-medium leading-snug text-slate-600">{label}</div>
      {sublabel && <div className="mt-0.5 text-xs text-slate-400">{sublabel}</div>}
    </div>
  );
}
