/**
 * Brewery diagnostic mini-cases — two quick, hands-on call-outs for the
 * Breweries sector course: a missed wort heat-recovery opportunity, and a
 * glycol cooling shortfall from a fouled condenser. Built on the shared
 * diagnostics core (lib/diagnostics.ts) and rendered by the same
 * CaseDiagnostics component as every Level 2 capstone — just with two cases
 * instead of eight, embedded partway through a lesson rather than as the
 * course's own capstone (that's the whole-site audit, in the next module).
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const BREWERY_CAUSES: CauseDef[] = [
  { id: "no-heat-recovery", label: "Wort-cooling heat sent straight to drain — no recovery" },
  { id: "fouled-condenser", label: "Glycol chiller condenser fouled, raising glycol supply temperature" },
  { id: "correct-operation", label: "System operating as designed — no fault" },
];

export const BREWERY_ACTIONS: ActionDef[] = [
  { id: "install-heat-recovery", label: "Recover wort-cooling heat into the hot-liquor tank", tier: 3 },
  { id: "clean-condenser", label: "Clean the glycol chiller condenser and restore design supply temperature", tier: 2 },
  { id: "accept-as-is", label: "Leave the system as it is", tier: 1 },
  { id: "add-more-glycol-capacity", label: "Install a second glycol chiller for more capacity", tier: 3 },
];

export type BreweryRefTable = "heat" | "glycol" | "prices";

export interface BreweryCase extends DiagnosticCase {
  refTables: BreweryRefTable[];
}

export const BREWERY_CASES: BreweryCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "wort-heat-recovery",
    title: "Case 1 — Hot Water Down the Drain",
    tag: "Heat recovery",
    brief:
      "A brewhouse cools each 30 hL batch of wort from 98 °C down to 18 °C pitching temperature through a plate heat exchanger, using mains cold water on the other side. That water leaves the exchanger warm — and currently runs straight to drain. Quantify what's being thrown away.",
    knownFacts: [
      "Batch size 30 hL; wort cools 98 °C → 18 °C each batch",
      "1,200 batches per year",
      "A secondary heat-recovery loop could capture ~70% of this heat into the hot-liquor (brewing water) tank",
      "Recovered heat displaces gas-fired heating at £0.06/kWh",
    ],
    readings: [
      { label: "Batch size", value: "30", unit: "hL" },
      { label: "Wort temperature drop", value: "98 → 18", unit: "°C" },
      { label: "Batches/year", value: "1,200" },
      { label: "Recoverable fraction", value: "70", unit: "%" },
    ],
    refTables: ["heat", "prices"],
    calcParts: [
      {
        id: "heat-per-batch",
        prompt: "How much heat does each batch of wort give up while cooling?",
        unit: "kWh",
        answer: 278.7,
        tol: 0.03,
        tolType: "rel",
        hints: ["Mass (kg) × specific heat × ΔT, ÷ 3,600 for kWh. 30 hL ≈ 3,000 kg.", "3,000 × 4.18 × (98 − 18) ÷ 3,600."],
        worked: "3,000 × 4.18 × 80 ÷ 3,600 ≈ 278.7 kWh per batch.",
      },
      {
        id: "recoverable-per-batch",
        prompt: "At 70% recoverable, how much of that is captured per batch?",
        unit: "kWh",
        answer: 195.1,
        tol: 0.03,
        tolType: "rel",
        hints: ["70% of the heat per batch.", "278.7 × 0.70."],
        worked: "278.7 × 0.70 ≈ 195.1 kWh recoverable per batch.",
      },
      {
        id: "annual-value",
        prompt: "Across 1,200 batches a year, what is that worth at £0.06/kWh?",
        unit: "£/yr",
        answer: 14045,
        tol: 0.05,
        tolType: "rel",
        hints: ["Recoverable kWh/batch × batches/year × gas price.", "195.1 × 1,200 × 0.06."],
        worked: "195.1 × 1,200 × £0.06 ≈ £14,045/yr — currently running down the drain, batch after batch.",
      },
    ],
    candidateCauseIds: ["no-heat-recovery", "correct-operation", "fouled-condenser"],
    correctCauseIds: ["no-heat-recovery"],
    candidateActionIds: ["install-heat-recovery", "accept-as-is", "clean-condenser"],
    correctActionIds: ["install-heat-recovery"],
    improvementActionIds: [],
    debrief:
      "Every brew releases a large, predictable, high-grade parcel of heat as the wort cools — and sending the warmed water straight to drain wastes it batch after batch, roughly £14,000/yr worth here. A secondary heat-recovery loop into the hot-liquor tank preheats the next batch's brewing water for free, cutting the boiler's workload directly. This is one of the highest-value, most reliably-worthwhile retrofits in brewing, precisely because every single batch produces it.",
    faultChain: [
      "Wort cools 98→18°C each batch, water sent to drain",
      "278.7 kWh/batch available, 70% recoverable = 195.1 kWh",
      "1,200 batches/yr → ~£14,045/yr wasted",
      "Fix: recover the heat into the hot-liquor tank",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "glycol-shortfall",
    title: "Case 2 — The Fermenter That Won't Cool Down",
    tag: "Refrigeration",
    brief:
      "A fermentation vessel is running warmer than its target during peak fermentation. The glycol jacket was designed to remove 15 kW at a glycol supply temperature of −4 °C against a 20 °C fermenting wort. The chiller is currently only delivering glycol at +2 °C. Work out why the vessel can't hold temperature.",
    knownFacts: [
      "Design: glycol supply −4 °C, wort at 20 °C, jacket cooling capacity 15 kW",
      "Actual: glycol supply now +2 °C (6 °C warmer than design)",
      "Heat-exchanger capacity scales roughly with the temperature difference (approach) available",
      "A fouled condenser on the glycol chiller raises its supply temperature",
    ],
    readings: [
      { label: "Design glycol supply", value: "−4", unit: "°C" },
      { label: "Actual glycol supply", value: "+2", unit: "°C" },
      { label: "Wort temperature", value: "20", unit: "°C" },
      { label: "Design jacket capacity", value: "15", unit: "kW" },
    ],
    refTables: ["glycol"],
    calcParts: [
      {
        id: "designed-dt",
        prompt: "What is the designed temperature difference driving heat transfer (wort − design glycol)?",
        unit: "°C",
        answer: 24,
        tol: 0.5,
        tolType: "abs",
        hints: ["Wort temperature minus the design glycol supply temperature.", "20 − (−4)."],
        worked: "20 − (−4) = 24 °C designed approach.",
      },
      {
        id: "actual-dt",
        prompt: "What is the actual temperature difference now?",
        unit: "°C",
        answer: 18,
        tol: 0.5,
        tolType: "abs",
        hints: ["Wort temperature minus the actual glycol supply temperature.", "20 − 2."],
        worked: "20 − 2 = 18 °C actual approach — 6 °C less than designed.",
      },
      {
        id: "actual-capacity",
        prompt: "Assuming capacity scales with the approach temperature, what is the jacket's actual cooling capacity now?",
        unit: "kW",
        answer: 11.25,
        tol: 0.05,
        tolType: "rel",
        hints: ["Design capacity × (actual ΔT ÷ design ΔT).", "15 × (18 ÷ 24)."],
        worked: "15 × (18 ÷ 24) = 15 × 0.75 = 11.25 kW.",
      },
      {
        id: "shortfall",
        prompt: "What is the shortfall against the 15 kW the vessel needs at peak fermentation?",
        unit: "kW",
        answer: 3.75,
        tol: 0.1,
        tolType: "abs",
        hints: ["Design capacity − actual capacity.", "15 − 11.25."],
        worked: "15 − 11.25 = 3.75 kW short — enough to let the vessel run warm during peak fermentation, risking off-flavours as well as wasting compressor energy that's no longer being used effectively.",
      },
    ],
    candidateCauseIds: ["fouled-condenser", "correct-operation", "no-heat-recovery"],
    correctCauseIds: ["fouled-condenser"],
    candidateActionIds: ["clean-condenser", "accept-as-is", "add-more-glycol-capacity"],
    correctActionIds: ["clean-condenser"],
    improvementActionIds: [],
    debrief:
      "A glycol chiller rejects heat to ambient air through a condenser — foul that condenser (dust, debris, poor airflow) and it can no longer reject heat as effectively, so it can only deliver glycol at a warmer supply temperature. That single 6 °C shift cuts the fermentation jacket's cooling capacity by a quarter (15 kW to 11.25 kW), a 3.75 kW shortfall that shows up as a fermenter running too warm — a food-quality risk, not just an energy one. The fix is maintenance, not more refrigeration capacity: clean the condenser and the design capacity returns.",
    faultChain: [
      "Fermenter running warm during peak fermentation",
      "Glycol supply +2°C instead of design −4°C — condenser fouled",
      "Approach temperature 24°C → 18°C, capacity 15kW → 11.25kW",
      "Fix: clean the glycol chiller condenser",
    ],
  },
];

export function getBreweryCase(id: string): BreweryCase | undefined {
  return BREWERY_CASES.find((c) => c.id === id);
}
