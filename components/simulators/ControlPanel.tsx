"use client";

import { BoilerState } from "@/lib/steamBoilerPhysics";
import { Scenario } from "@/lib/boilerScenarios";

/**
 * The operator's controls. Each slider shows a coloured "good band" on its
 * track so learners can see where the sweet spot is once they've found it, and
 * a live status word. Capital options (economiser, overhaul) are toggles,
 * because they represent investment decisions, not dials.
 */

interface SliderSpec {
  key: "excessO2" | "blowdownRate" | "loadLevel";
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  /** [start, end] of the "good" band as a fraction of the track, for the overlay. */
  goodBand?: [number, number];
  caption: string;
  status: (v: number) => { word: string; tone: "good" | "warn" | "bad" };
}

const SLIDERS: SliderSpec[] = [
  {
    key: "excessO2",
    label: "Combustion air (excess O₂)",
    min: 1,
    max: 9,
    step: 0.1,
    unit: "%",
    goodBand: [(3 - 1) / 8, (4.5 - 1) / 8],
    caption: "The primary efficiency lever. Aim for the 3–4% band.",
    status: (v) =>
      v < 2
        ? { word: "Starved", tone: "bad" }
        : v < 2.8
        ? { word: "Rich", tone: "warn" }
        : v <= 4.5
        ? { word: "Optimal", tone: "good" }
        : v <= 6.5
        ? { word: "Too much air", tone: "warn" }
        : { word: "Wasteful", tone: "bad" },
  },
  {
    key: "blowdownRate",
    label: "Blowdown rate",
    min: 0.5,
    max: 6,
    step: 0.1,
    unit: "%",
    goodBand: [(1.5 - 0.5) / 5.5, (3.5 - 0.5) / 5.5],
    caption: "Controls dissolved solids. Below ~1.5% risks scale; above ~4% wastes heat.",
    status: (v) =>
      v < 1.5
        ? { word: "Scale risk", tone: "bad" }
        : v > 4
        ? { word: "Heat loss", tone: "warn" }
        : { word: "Balanced", tone: "good" },
  },
  {
    key: "loadLevel",
    label: "Firing rate (demand)",
    min: 20,
    max: 100,
    step: 5,
    unit: "%",
    caption: "Simulate demand. Efficiency falls at part load — test your tune across the range.",
    status: () => ({ word: "", tone: "good" }),
  },
];

const toneText = {
  good: "text-emerald-600",
  warn: "text-amber-600",
  bad: "text-red-600",
} as const;

export default function ControlPanel({
  state,
  scenario,
  onChange,
}: {
  state: BoilerState;
  scenario: Scenario;
  onChange: (next: Partial<BoilerState>) => void;
}) {
  // In the baseline scenario, demand is fixed — hide the load slider.
  const sliders = SLIDERS.filter(
    (s) => !(s.key === "loadLevel" && scenario.id === "easy")
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">Boiler controls</h3>

      <div className="space-y-5">
        {sliders.map((s) => {
          const value = state[s.key] as number;
          const status = s.status(value);
          return (
            <div key={s.key}>
              <div className="mb-1 flex items-baseline justify-between">
                <label className="text-sm font-medium text-slate-800">{s.label}</label>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {value.toFixed(s.step < 1 ? 1 : 0)}
                    {s.unit}
                  </span>
                  {status.word && (
                    <span className={`text-xs font-semibold ${toneText[status.tone]}`}>
                      {status.word}
                    </span>
                  )}
                </div>
              </div>

              {/* slider with good-band overlay */}
              <div className="relative">
                {s.goodBand && (
                  <div
                    className="pointer-events-none absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-emerald-200"
                    style={{
                      left: `${s.goodBand[0] * 100}%`,
                      width: `${(s.goodBand[1] - s.goodBand[0]) * 100}%`,
                    }}
                  />
                )}
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={value}
                  onChange={(e) => onChange({ [s.key]: parseFloat(e.target.value) })}
                  className="boiler-range relative w-full"
                />
              </div>
              <p className="mt-1 text-[11px] leading-snug text-slate-500">{s.caption}</p>
            </div>
          );
        })}
      </div>

      {/* Capital options */}
      {(scenario.allowEconomiser || scenario.allowTubeOverhaul) && (
        <div className="mt-5 border-t border-slate-200 pt-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Capital options
          </h4>
          <div className="space-y-2">
            {scenario.allowEconomiser && (
              <CapitalToggle
                label="Condensing economiser"
                cost="~£25k"
                desc="Recovers stack heat — cuts the dry flue-gas loss and reclaims some latent heat."
                checked={state.economiser}
                onChange={(v) => onChange({ economiser: v })}
              />
            )}
            {scenario.allowTubeOverhaul && (
              <CapitalToggle
                label="Tube clean / overhaul"
                cost="~£40k"
                desc="Restores heat transfer on a fouled boiler — removes the fouling penalty."
                checked={state.tubeOverhaul}
                onChange={(v) => onChange({ tubeOverhaul: v })}
              />
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .boiler-range {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 9999px;
          background: #e2e8f0;
          outline: none;
        }
        .boiler-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 9999px;
          background: #0f172a;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }
        .boiler-range::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 9999px;
          background: #0f172a;
          border: 2px solid white;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function CapitalToggle({
  label,
  cost,
  desc,
  checked,
  onChange,
}: {
  label: string;
  cost: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${
        checked
          ? "border-emerald-300 bg-emerald-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-9 flex-shrink-0 items-center rounded-full p-0.5 transition ${
          checked ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-4" : ""}`}
        />
      </span>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-800">{label}</span>
          <span className="text-xs font-semibold text-slate-500">{cost}</span>
        </div>
        <p className="text-[11px] leading-snug text-slate-500">{desc}</p>
      </div>
    </button>
  );
}
