/**
 * Commercial real estate diagnostic mini-cases — two quick, hands-on office
 * call-outs for the CRE sector course: an out-of-hours base load that nobody
 * has looked at, and an air-handling unit heating and cooling the same air.
 * Built on the shared diagnostics core (lib/diagnostics.ts) and rendered by
 * the same CaseDiagnostics component as every Level 2 capstone — two cases,
 * embedded partway through a lesson rather than as the course's own capstone
 * (that's the office audit, in the next module).
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const CRE_CAUSES: CauseDef[] = [
  { id: "bms-override", label: "BMS schedules overridden to run plant 24/7 and never restored" },
  { id: "setpoint-overlap", label: "Heating and cooling setpoints overlap — no dead band between them" },
  { id: "undersized-plant", label: "Plant undersized for the building's load" },
  { id: "correct-operation", label: "System operating as designed — no fault" },
];

export const CRE_ACTIONS: ActionDef[] = [
  { id: "restore-schedules", label: "Restore the BMS time schedules to match actual occupancy", tier: 1 },
  { id: "set-dead-band", label: "Re-establish a proper dead band (heat to 21 °C, cool from 24 °C)", tier: 1 },
  { id: "accept-as-is", label: "Leave the system as it is", tier: 1 },
  { id: "install-bigger-chiller", label: "Install additional chiller capacity", tier: 3 },
  { id: "replace-ahu", label: "Replace the air-handling unit", tier: 3 },
];

export type CreRefTable = "hours" | "coil" | "prices";

export interface CreCase extends DiagnosticCase {
  refTables: CreRefTable[];
}

export const CRE_CASES: CreCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "out-of-hours-load",
    title: "Case 1 — The Building That Never Sleeps",
    tag: "Out of hours",
    brief:
      "A managing agent sends you a multi-let office's half-hourly electricity data. The building is occupied 65 hours a week (07:00 to 20:00, weekdays), yet the overnight and weekend demand never falls below 78 kW. Buildings like this, properly shut down, typically idle at around 30 kW (lifts, security, servers, emergency systems). Quantify what running flat-out around the clock is costing.",
    knownFacts: [
      "Occupied 65 h/week; unoccupied 103 h/week (5,356 h/year)",
      "Overnight/weekend demand: steady 78 kW",
      "A comparable, properly scheduled building idles at ~30 kW",
      "Electricity at £0.20/kWh",
    ],
    readings: [
      { label: "Overnight demand", value: "78", unit: "kW" },
      { label: "Achievable idle", value: "~30", unit: "kW" },
      { label: "Unoccupied hours", value: "5,356", unit: "h/yr" },
      { label: "Occupied peak", value: "210", unit: "kW" },
    ],
    refTables: ["hours", "prices"],
    calcParts: [
      {
        id: "excess-kw",
        prompt: "How much demand is running out of hours that shouldn't be?",
        unit: "kW",
        answer: 48,
        tol: 0.5,
        tolType: "abs",
        hints: ["Actual overnight demand minus the achievable idle load.", "78 − 30."],
        worked: "78 − 30 = 48 kW of plant running for nobody.",
      },
      {
        id: "excess-kwh",
        prompt: "Across the year's unoccupied hours, how much electricity is that?",
        unit: "kWh",
        answer: 257088,
        tol: 0.02,
        tolType: "rel",
        hints: ["Excess kW × unoccupied hours per year.", "48 × 5,356."],
        worked: "48 × 5,356 = 257,088 kWh a year, consumed while the building is empty.",
      },
      {
        id: "annual-cost",
        prompt: "What is that worth at £0.20/kWh?",
        unit: "£/yr",
        answer: 51418,
        tol: 0.03,
        tolType: "rel",
        hints: ["Excess kWh × electricity price.", "257,088 × 0.20."],
        worked: "257,088 × £0.20 ≈ £51,418/yr — roughly a quarter of a building like this one's entire electricity bill.",
      },
    ],
    candidateCauseIds: ["undersized-plant", "bms-override", "correct-operation", "setpoint-overlap"],
    correctCauseIds: ["bms-override"],
    candidateActionIds: ["install-bigger-chiller", "accept-as-is", "restore-schedules", "set-dead-band"],
    correctActionIds: ["restore-schedules"],
    improvementActionIds: [],
    debrief:
      "The site team confirms it: the BMS schedules were switched to constant running for a tenant's weekend event two years ago and never switched back. Nothing is broken, which is exactly why nobody noticed — the building ran perfectly, all night, every night. Restoring the time schedules costs nothing and saves around £51,000 a year. The overnight base load is the single most valuable number in an office's half-hourly data: it should be a fraction of the daytime peak, and every kW above the true idle load is plant serving an empty building.",
    faultChain: [
      "Overnight demand 78 kW against an achievable ~30 kW idle",
      "48 kW excess × 5,356 unoccupied h/yr = 257,088 kWh",
      "≈ £51,418/yr spent while the building is empty",
      "Fix: restore the BMS schedules to actual occupancy",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "simultaneous-heat-cool",
    title: "Case 2 — Heating and Cooling the Same Air",
    tag: "Controls",
    brief:
      "Tenants on level 3 report the space feels 'stuffy but fine'. In the plant room, the air-handling unit serving that floor shows its heating coil drawing 60 kW from the gas boilers while the chilled-water coil removes heat downstream in the same unit. Someone has nudged setpoints over the years: the AHU now heats towards 22.5 °C while cooling starts at 21.5 °C. Work out what this tug-of-war costs across occupied hours.",
    knownFacts: [
      "Heating coil duty: 60 kW, supplied by gas boilers at 85% seasonal efficiency",
      "The cooling coil removes the same 60 kW; the chiller's COP is 3.0",
      "Setpoints: heat to 22.5 °C, cool from 21.5 °C — they overlap by 1 °C",
      "Occupied hours 3,380 h/yr; gas £0.06/kWh, electricity £0.20/kWh",
    ],
    readings: [
      { label: "Heating coil duty", value: "60", unit: "kW" },
      { label: "Heating setpoint", value: "22.5", unit: "°C" },
      { label: "Cooling setpoint", value: "21.5", unit: "°C", note: "Cooling starts below the heating target" },
      { label: "Chiller COP", value: "3.0" },
    ],
    refTables: ["coil", "prices"],
    calcParts: [
      {
        id: "gas-cost",
        prompt: "What does feeding the heating coil cost per year in gas?",
        unit: "£/yr",
        answer: 14315,
        tol: 0.03,
        tolType: "rel",
        hints: [
          "Gas input = coil duty ÷ boiler efficiency; then × occupied hours × gas price.",
          "(60 ÷ 0.85) × 3,380 × 0.06.",
        ],
        worked: "60 ÷ 0.85 = 70.6 kW of gas input; 70.6 × 3,380 × £0.06 ≈ £14,315/yr.",
      },
      {
        id: "elec-cost",
        prompt: "What does removing that same heat again cost per year in chiller electricity?",
        unit: "£/yr",
        answer: 13520,
        tol: 0.03,
        tolType: "rel",
        hints: [
          "Chiller electrical demand = heat removed ÷ COP; then × occupied hours × electricity price.",
          "(60 ÷ 3) × 3,380 × 0.20.",
        ],
        worked: "60 ÷ 3 = 20 kW of chiller electricity; 20 × 3,380 × £0.20 = £13,520/yr.",
      },
      {
        id: "total-cost",
        prompt: "What is the total annual cost of heating and cooling the same air?",
        unit: "£/yr",
        answer: 27835,
        tol: 0.03,
        tolType: "rel",
        hints: ["Gas cost + electricity cost.", "14,315 + 13,520."],
        worked:
          "£14,315 + £13,520 ≈ £27,835/yr — and the tenants aren't even comfortable, because the two coils are fighting rather than conditioning.",
      },
    ],
    candidateCauseIds: ["correct-operation", "setpoint-overlap", "undersized-plant", "bms-override"],
    correctCauseIds: ["setpoint-overlap"],
    candidateActionIds: ["replace-ahu", "set-dead-band", "install-bigger-chiller", "accept-as-is"],
    correctActionIds: ["set-dead-band"],
    improvementActionIds: [],
    debrief:
      "The heating setpoint sits above the cooling setpoint, so both coils run at once and the building pays twice for the same air: once in gas to warm it, again in electricity to cool it. This is the classic dead-band failure from the controls course, and years of small, well-meaning setpoint nudges are how it usually happens. Re-establishing a proper dead band (heat to 21 °C, cool from 24 °C) costs a BMS engineer an afternoon and removes the entire £27,835. No new plant is needed: the AHU and chiller are both fine.",
    faultChain: [
      "Heating targets 22.5 °C; cooling starts at 21.5 °C — a 1 °C overlap",
      "60 kW heated by gas, then removed again by the chiller",
      "£14,315 gas + £13,520 electricity ≈ £27,835/yr",
      "Fix: re-establish the dead band (heat 21 °C / cool 24 °C)",
    ],
  },
];

export function getCreCase(id: string): CreCase | undefined {
  return CRE_CASES.find((c) => c.id === id);
}
