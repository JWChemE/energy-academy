"use client";

import { useState } from "react";

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

/**
 * Simple payback calculator: capital cost / annual saving = payback in years.
 * A worked, interactive example of the metric taught in the lesson.
 */
export function PaybackCalculator({
  defaultCost = 8000,
  defaultSaving = 2500,
}: {
  defaultCost?: number;
  defaultSaving?: number;
}) {
  const [cost, setCost] = useState(defaultCost);
  const [saving, setSaving] = useState(defaultSaving);

  const years = saving > 0 ? cost / saving : null;

  let verdict: { label: string; cls: string } | null = null;
  if (years !== null) {
    if (years <= 2)
      verdict = {
        label: "Fast payback — usually an easy yes.",
        cls: "text-brand-700 bg-brand-50 border-brand-200",
      };
    else if (years <= 5)
      verdict = {
        label: "Moderate payback — typically attractive.",
        cls: "text-denim-700 bg-denim-50 border-denim-200",
      };
    else
      verdict = {
        label: "Long payback — may need a stronger strategic case.",
        cls: "text-honey-700 bg-honey-50 border-honey-200",
      };
  }

  return (
    <section className="my-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="m-0 mb-1 text-lg font-semibold text-slate-900">
        Simple payback calculator
      </h3>
      <p className="m-0 mb-5 text-sm text-slate-500">
        Adjust the figures to see how the payback period responds.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Project cost"
          value={cost}
          min={0}
          max={50000}
          step={500}
          onChange={setCost}
        />
        <Field
          label="Annual saving"
          value={saving}
          min={0}
          max={20000}
          step={250}
          onChange={setSaving}
        />
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 p-5 text-center">
        <div className="text-sm font-medium text-slate-500">Simple payback</div>
        <div className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
          {years === null ? "—" : `${years.toFixed(1)} yrs`}
        </div>
        {years !== null && (
          <div className="mt-1 text-sm text-slate-500">
            about {Math.round(years * 12)} months
          </div>
        )}
      </div>

      {verdict && (
        <p className={`mt-4 rounded-lg border p-3 text-sm ${verdict.cls}`}>
          {verdict.label}
        </p>
      )}
    </section>
  );
}

function Field({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm font-semibold text-slate-900">
          {gbp.format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-600"
      />
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
    </div>
  );
}
