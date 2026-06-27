"use client";

import { PlantReadings } from "@/lib/boilerPlant";

/**
 * Read-only control-panel readout for the diagnostic mode. Shows the full set
 * of symptoms — combustion gases, stack & economiser temps, and the water-side
 * chemistry (feedwater/boiler TDS, blowdown) — that the learner reasons from.
 * Alarms (red) fire on clearly out-of-range values, but the panel never names
 * the root cause.
 */
export default function PlantInstruments({ r }: { r: PlantReadings }) {
  const coTone = r.flueCO > 200 ? "red" : r.flueCO > 100 ? "amber" : "green";
  const tdsTone = r.boilerTDS > 3500 ? "red" : r.boilerTDS < 1800 ? "amber" : "green";

  return (
    <div className="space-y-3">
      {/* Combustion */}
      <Group title="Combustion (flue gas)">
        <Cell label="O₂" value={r.excessO2.toFixed(1)} unit="%" />
        <Cell label="CO₂" value={r.flueCO2.toFixed(1)} unit="%" />
        <Cell label="CO" value={r.flueCO.toLocaleString()} unit="ppm" tone={coTone} alarm={coTone === "red"} />
      </Group>

      {/* Stack / heat recovery */}
      <Group title="Stack & heat recovery">
        <Cell label="Stack temp" value={`${r.stackTemp}`} unit="°C" tone={r.stackTemp > 220 ? "amber" : "green"} />
        {r.economiserGasIn !== null ? (
          <>
            <Cell label="Econ. gas in" value={`${r.economiserGasIn}`} unit="°C" />
            <Cell label="Econ. gas out" value={`${r.economiserGasOut}`} unit="°C" />
          </>
        ) : (
          <Cell label="Economiser" value="none" unit="" tone="amber" span2 />
        )}
      </Group>

      {/* Water side */}
      <Group title="Water side">
        <Cell label="Feedwater TDS" value={r.feedwaterTDS.toLocaleString()} unit="ppm" />
        <Cell label="Boiler TDS" value={r.boilerTDS.toLocaleString()} unit="ppm" tone={tdsTone} alarm={tdsTone === "red"} />
        <Cell label="Blowdown" value={r.blowdownRatePct.toFixed(1)} unit="%" />
        <Cell label="Feedwater" value={`${r.feedwaterTemp}`} unit="°C" />
        <Cell label="Make-up" value={`${r.makeupPercent}`} unit="%" />
      </Group>

      {/* Performance */}
      <Group title="Performance">
        <Cell label="Efficiency" value={r.efficiency.toFixed(1)} unit="%" tone={r.efficiency >= 84 ? "green" : r.efficiency >= 78 ? "amber" : "red"} big />
        <Cell label="Steam" value={r.steamFlow.toLocaleString()} unit="kg/h" />
        <Cell label="Fuel" value={r.fuelInput.toLocaleString()} unit="kW" />
        <Cell label="Cost" value={`£${r.costPerHour.toFixed(0)}`} unit="/h" />
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </div>
      <div className="grid grid-cols-3 gap-2">{children}</div>
    </div>
  );
}

function Cell({
  label,
  value,
  unit,
  tone = "slate",
  alarm,
  big,
  span2,
}: {
  label: string;
  value: string;
  unit: string;
  tone?: "slate" | "green" | "amber" | "red";
  alarm?: boolean;
  big?: boolean;
  span2?: boolean;
}) {
  const toneMap = {
    slate: "text-slate-100",
    green: "text-emerald-300",
    amber: "text-amber-300",
    red: "text-red-400",
  } as const;
  return (
    <div className={`rounded-lg bg-slate-800/70 px-2.5 py-1.5 ${span2 ? "col-span-2" : ""} ${alarm ? "ring-1 ring-red-500" : ""}`}>
      <div className="flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-wide text-slate-400">{label}</span>
        {alarm && <span className="text-[8px] font-bold text-red-400">ALARM</span>}
      </div>
      <div className={`font-mono font-bold ${big ? "text-lg" : "text-base"} ${toneMap[tone]}`}>
        {value}
        <span className="ml-0.5 text-[10px] font-normal text-slate-500">{unit}</span>
      </div>
    </div>
  );
}
