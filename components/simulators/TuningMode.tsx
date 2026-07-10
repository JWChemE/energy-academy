"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BoilerState, calculateBoilerPerformance } from "@/lib/steamBoilerPhysics";
import {
  ScenarioId,
  getScenario,
  scenarioOrder,
  evaluate,
} from "@/lib/boilerScenarios";
import BoilerVisualization from "./BoilerVisualization";
import EnergyFlowBar from "./EnergyFlowBar";
import InstrumentPanel from "./InstrumentPanel";
import LiveCoaching from "./LiveCoaching";
import ControlPanel from "./ControlPanel";

export default function TuningMode() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("sandbox");
  const scenario = getScenario(scenarioId);

  const [state, setState] = useState<BoilerState>(scenario.initialState);
  const [hintIndex, setHintIndex] = useState(0);
  const [everMet, setEverMet] = useState(false);

  // Session cost ticker — visceral "money burning" feedback.
  const [sessionSpend, setSessionSpend] = useState(0);

  const output = useMemo(
    () => calculateBoilerPerformance(state, scenario.baseFoulingLoss),
    [state, scenario.baseFoulingLoss]
  );

  const hasDanger = output.warnings.some((w) => w.level === "danger");
  const result = evaluate(scenario, output.efficiency, hasDanger);

  // Track first time the target is met (for the celebratory note). This is a
  // genuine accumulator over render results, so the effect is the right home.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (result.met) setEverMet(true);
  }, [result.met]);

  // Accumulate spend at the live rate (£/h → £/sec scaled for visibility).
  const rateRef = useRef(output.totalCostPerHour);
  useEffect(() => {
    rateRef.current = output.totalCostPerHour;
  }, [output.totalCostPerHour]);
  useEffect(() => {
    const t = setInterval(() => {
      // Advance one "simulated minute" per tick so the number moves meaningfully.
      setSessionSpend((s) => s + rateRef.current / 60);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  function loadScenario(id: ScenarioId) {
    const s = getScenario(id);
    setScenarioId(id);
    setState(s.initialState);
    setHintIndex(0);
    setEverMet(false);
    setSessionSpend(0);
  }

  function update(next: Partial<BoilerState>) {
    setState((prev) => ({ ...prev, ...next }));
  }

  function reset() {
    setState(scenario.initialState);
    setSessionSpend(0);
  }

  return (
    <div>
      {/* Scenario tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {scenarioOrder.map((id) => {
          const s = getScenario(id);
          const active = id === scenarioId;
          return (
            <button
              key={id}
              onClick={() => loadScenario(id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {s.title}
            </button>
          );
        })}
      </div>

      {/* Brief */}
      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-1 flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900">{scenario.title}</h2>
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
            {scenario.tag}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{scenario.brief}</p>

        {scenario.targetEfficiency !== null && (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
            <span className="text-sm font-semibold text-slate-700">
              🎯 Target: {scenario.targetEfficiency}% efficiency
              {scenario.requireNoDangerWarnings && ", no unsafe conditions"}
            </span>
            <span
              className={`ml-auto rounded-full px-3 py-1 text-sm font-bold ${
                result.met
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {result.met ? "✓ Target met" : `${output.efficiency.toFixed(1)}% — keep going`}
            </span>
          </div>
        )}
      </div>

      {/* Main dashboard */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Left: live boiler + energy flow */}
        <div className="space-y-5">
          <BoilerVisualization state={state} output={output} />
          <EnergyFlowBar losses={output.losses} />
        </div>

        {/* Right: instruments + coaching + controls */}
        <div className="space-y-5">
          <InstrumentPanel output={output} />
          <LiveCoaching state={state} output={output} />
        </div>
      </div>

      {/* Controls span full width below */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <ControlPanel state={state} scenario={scenario} onChange={update} />

        {/* Coaching hints + session meta */}
        <div className="space-y-5">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">💡 Coaching</h3>
              <span className="text-xs text-slate-500">
                {hintIndex + 1} / {scenario.hints.length}
              </span>
            </div>
            <p className="min-h-[3.5rem] text-sm leading-relaxed text-slate-700">
              {scenario.hints[hintIndex]}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setHintIndex((i) => Math.max(0, i - 1))}
                disabled={hintIndex === 0}
                className="rounded-md bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                onClick={() =>
                  setHintIndex((i) => Math.min(scenario.hints.length - 1, i + 1))
                }
                disabled={hintIndex === scenario.hints.length - 1}
                className="rounded-md bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Session spend ticker + reset */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Fuel &amp; water spent this session
              </div>
              <div className="font-mono text-xl font-bold text-slate-900">
                £{sessionSpend.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-400">
                at £{output.totalCostPerHour.toFixed(0)}/h current settings
              </div>
            </div>
            <button
              onClick={reset}
              className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-300"
            >
              Reset
            </button>
          </div>

          {/* Success note */}
          {everMet && scenario.successNote && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="mb-1 text-sm font-bold text-emerald-800">✓ Well done</h3>
              <p className="text-sm leading-relaxed text-emerald-900">
                {scenario.successNote}
              </p>
              {scenarioId !== "hard" && (
                <button
                  onClick={() => {
                    const next =
                      scenarioOrder[scenarioOrder.indexOf(scenarioId) + 1];
                    if (next) loadScenario(next);
                  }}
                  className="mt-3 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Next scenario →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
