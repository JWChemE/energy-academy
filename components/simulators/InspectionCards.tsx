"use client";

import { useState } from "react";
import { PlantConfig, PlantReadings } from "@/lib/boilerPlant";

/**
 * The "walk the plant" mechanic. Each card is a component the learner can
 * inspect; clicking reveals a *neutral observation* (what you'd see/measure on
 * site), never the conclusion. Part of the skill is deciding what's worth
 * inspecting and interpreting what you find.
 */

interface Finding {
  key: string;
  component: string;
  icon: string;
  observation: string;
}

function buildFindings(cfg: PlantConfig, r: PlantReadings): Finding[] {
  const f: Finding[] = [];

  // Economiser
  if (cfg.economiser === "none") {
    f.push({
      key: "econ",
      component: "Economiser",
      icon: "🌡️",
      observation:
        "No economiser is fitted. Flue gas passes straight to the stack with no heat recovery.",
    });
  } else {
    const drop = (r.economiserGasIn ?? 0) - (r.economiserGasOut ?? 0);
    f.push({
      key: "econ",
      component: "Economiser",
      icon: "🌡️",
      observation: `Economiser fitted. Flue gas in ${r.economiserGasIn}°C, out ${r.economiserGasOut}°C — a ${drop}°C drop across it. (A healthy unit drops the gas by roughly 80°C.)`,
    });
  }

  // Water treatment
  if (cfg.waterTreatment === "none") {
    f.push({
      key: "treat",
      component: "Water treatment",
      icon: "💧",
      observation: "No feedwater treatment — raw town water (~350 ppm hardness/solids) feeds the boiler.",
    });
  } else if (cfg.waterTreatment === "softener") {
    f.push({
      key: "treat",
      component: "Water treatment",
      icon: "💧",
      observation: cfg.softenerExhausted
        ? "Base-exchange softener fitted, but the service log shows regeneration is well overdue. A hardness test on the outlet reads positive."
        : "Base-exchange softener fitted and in service. Hardness removed, but dissolved solids (TDS) pass through unchanged.",
    });
  } else {
    f.push({
      key: "treat",
      component: "Water treatment",
      icon: "💧",
      observation: `Reverse-osmosis plant fitted — feedwater conductivity is very low (${r.feedwaterTDS} ppm).`,
    });
  }

  // Blowdown control
  f.push({
    key: "bd",
    component: "Blowdown control",
    icon: "🔧",
    observation:
      cfg.blowdownControl === "auto"
        ? `Automatic TDS control fitted, holding boiler water at its set point (reading ${r.boilerTDS} ppm).`
        : `Manual blowdown, valve set to roughly ${r.blowdownRatePct}% of throughput. Boiler water TDS measures ${r.boilerTDS} ppm (limit ~3,500 ppm).`,
  });

  // Feedwater / condensate / deaeration
  f.push({
    key: "fw",
    component: "Feedwater & condensate",
    icon: "♨️",
    observation: `Condensate return about ${100 - r.makeupPercent}%, so make-up is ${r.makeupPercent}%. Feedwater temperature ${r.feedwaterTemp}°C. ${cfg.deaerator ? "A deaerator is fitted." : "No deaerator fitted."}`,
  });

  // Burner / firing
  f.push({
    key: "burner",
    component: "Burner & firing rate",
    icon: "🔥",
    observation: `Burner firing at about ${Math.round((r.steamFlow / cfg.capacity) * 100)}% of the boiler's ${cfg.capacity.toLocaleString()} kg/h capacity. Flue O₂ ${r.excessO2}%, CO ${r.flueCO} ppm.`,
  });

  // Insulation
  f.push({
    key: "ins",
    component: "Casing & pipe insulation",
    icon: "🧥",
    observation:
      cfg.insulation === "poor"
        ? "Several sections of casing and pipework are bare or have damaged lagging — warm to the touch."
        : "Casing and pipework insulation is intact and in good condition.",
  });

  return f;
}

export default function InspectionCards({
  config,
  readings,
  onInspect,
}: {
  config: PlantConfig;
  readings: PlantReadings;
  onInspect?: (key: string) => void;
}) {
  const findings = buildFindings(config, readings);
  const [open, setOpen] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else {
        next.add(key);
        onInspect?.(key);
      }
      return next;
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-1 text-sm font-bold text-slate-900">🔍 Inspect the installation</h3>
      <p className="mb-3 text-xs text-slate-500">
        Click each component to see what you find on site. The readings tell you the symptoms — the plant tells you why.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {findings.map((f) => {
          const isOpen = open.has(f.key);
          return (
            <button
              key={f.key}
              onClick={() => toggle(f.key)}
              className={`rounded-lg border p-3 text-left transition ${
                isOpen ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">
                  {f.icon} {f.component}
                </span>
                <span className="text-xs text-slate-400">{isOpen ? "−" : "🔍"}</span>
              </div>
              {isOpen && (
                <p className="mt-2 text-xs leading-relaxed text-slate-700">{f.observation}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
