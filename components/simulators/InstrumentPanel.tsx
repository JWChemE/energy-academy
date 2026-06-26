"use client";

import { BoilerOutput } from "@/lib/steamBoilerPhysics";

/**
 * A flue-gas analyser readout — the instrument a real combustion technician
 * clips to the stack — plus the live operating metrics. Teaches learners to
 * read symptoms (O₂, CO₂, CO, stack temp) the way an auditor does.
 */
export default function InstrumentPanel({ output }: { output: BoilerOutput }) {
  const coAlarm = output.flueGasCO > 200;

  return (
    <div className="space-y-3">
      {/* Flue-gas analyser — dark instrument styling */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-100">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Flue-gas analyser
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            live
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Reading label="CO₂" value={output.flueGasCO2.toFixed(1)} unit="%" tone="cyan" />
          <Reading
            label="CO"
            value={output.flueGasCO.toLocaleString()}
            unit="ppm"
            tone={coAlarm ? "red" : output.flueGasCO > 100 ? "amber" : "green"}
            alarm={coAlarm}
          />
          <Reading label="Stack" value={`${output.stackTemp}`} unit="°C" tone="amber" />
          <Reading label="Efficiency" value={output.efficiency.toFixed(1)} unit="%" tone="green" big />
        </div>
      </div>

      {/* Operating metrics */}
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Steam output" value={`${output.steamOutput.toLocaleString()}`} unit="kg/h" />
        <Metric label="Fuel input" value={`${output.fuelInput.toLocaleString()}`} unit="kW" />
        <Metric label="Operating cost" value={`£${output.totalCostPerHour.toFixed(0)}`} unit="/hour" />
        <Metric label="CO₂" value={`${output.co2PerHour.toFixed(0)}`} unit="kg/h" />
      </div>

      {/* Annualised — makes the stakes real */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-600">
        <span className="font-semibold text-slate-800">Annualised (6,000 h/yr):</span>{" "}
        £{Math.round(output.totalCostPerHour * 6000).toLocaleString()} fuel &amp; water ·{" "}
        {Math.round((output.co2PerHour * 6000) / 1000).toLocaleString()} t CO₂
      </div>
    </div>
  );
}

function Reading({
  label,
  value,
  unit,
  tone,
  alarm,
  big,
}: {
  label: string;
  value: string;
  unit: string;
  tone: "cyan" | "green" | "amber" | "red";
  alarm?: boolean;
  big?: boolean;
}) {
  const toneMap = {
    cyan: "text-cyan-300",
    green: "text-emerald-300",
    amber: "text-amber-300",
    red: "text-red-400",
  } as const;
  return (
    <div className={`rounded-lg bg-slate-800/70 px-3 py-2 ${alarm ? "ring-1 ring-red-500" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wide text-slate-400">{label}</span>
        {alarm && <span className="text-[9px] font-bold text-red-400">ALARM</span>}
      </div>
      <div className={`font-mono ${big ? "text-2xl" : "text-xl"} font-bold ${toneMap[tone]}`}>
        {value}
        <span className="ml-0.5 text-xs text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="font-mono text-lg font-bold text-slate-900">
        {value}
        <span className="ml-0.5 text-xs font-normal text-slate-400">{unit}</span>
      </div>
    </div>
  );
}
