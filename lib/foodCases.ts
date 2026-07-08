/**
 * Food manufacturing diagnostic mini-cases — two quick, hands-on factory
 * call-outs for the Food Manufacturing sector course: washdown water heated
 * by gas while the refrigeration plant rejects heat to the roof, and a
 * spiral freezer defrosting on a timer nobody has questioned. Built on the
 * shared diagnostics core (lib/diagnostics.ts) and rendered by the same
 * CaseDiagnostics component as every Level 2 capstone — two cases, embedded
 * partway through a lesson rather than as the course's own capstone (that's
 * the factory audit, in the next module).
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const FOOD_CAUSES: CauseDef[] = [
  { id: "no-heat-recovery", label: "Refrigeration heat rejected to atmosphere while gas heats washdown water — no recovery" },
  { id: "fixed-defrost", label: "Defrost running on a fixed timer, far longer than frost build-up needs" },
  { id: "undersized-boiler", label: "Hot-water plant undersized for the washdown demand" },
  { id: "correct-operation", label: "System operating as designed — no fault" },
];

export const FOOD_ACTIONS: ActionDef[] = [
  { id: "install-desuperheater", label: "Fit a desuperheater to preheat washdown water from refrigeration heat rejection", tier: 3 },
  { id: "demand-defrost", label: "Convert defrost to on-demand initiation (frost/pressure sensing)", tier: 2 },
  { id: "accept-as-is", label: "Leave the system as it is", tier: 1 },
  { id: "bigger-boiler", label: "Install a larger hot-water boiler", tier: 3 },
  { id: "longer-defrost", label: "Extend the defrost period to be safe", tier: 1 },
];

export type FoodRefTable = "water" | "defrost" | "prices";

export interface FoodCase extends DiagnosticCase {
  refTables: FoodRefTable[];
}

export const FOOD_CASES: FoodCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "washdown-heat-recovery",
    title: "Case 1 — Hot Water by Gas, Heat to the Roof",
    tag: "Heat recovery",
    brief:
      "A ready-meals factory washes down every production night: 15 m³ of water heated from 10 °C to 60 °C by a gas-fired calorifier at 85% efficiency, 310 nights a year. Twenty metres away, the ammonia refrigeration plant rejects heat to roof-top condensers all day, every day. Quantify what heating that water with gas costs, and what a desuperheater could claw back.",
    knownFacts: [
      "Washdown: 15 m³/night heated 10 → 60 °C; 310 nights/year",
      "Gas calorifier at 85% seasonal efficiency; gas £0.06/kWh",
      "The refrigeration plant rejects heat continuously at 25–35 °C (higher at the discharge desuperheat)",
      "A desuperheater could reliably preheat the water from 10 °C to about 35 °C",
    ],
    readings: [
      { label: "Washdown volume", value: "15", unit: "m³/night" },
      { label: "Water temperature lift", value: "10 → 60", unit: "°C" },
      { label: "Nights per year", value: "310" },
      { label: "Achievable preheat", value: "10 → 35", unit: "°C", note: "Half the total lift, from heat currently thrown away" },
    ],
    refTables: ["water", "prices"],
    calcParts: [
      {
        id: "heat-per-night",
        prompt: "How much heat does the water need each night?",
        unit: "kWh",
        answer: 871,
        tol: 0.03,
        tolType: "rel",
        hints: ["Mass (kg) × specific heat × ΔT, ÷ 3,600 for kWh. 15 m³ = 15,000 kg.", "15,000 × 4.18 × 50 ÷ 3,600."],
        worked: "15,000 × 4.18 × 50 ÷ 3,600 ≈ 871 kWh of heat per night.",
      },
      {
        id: "gas-cost",
        prompt: "Through an 85%-efficient calorifier, what does that cost per year in gas?",
        unit: "£/yr",
        answer: 19056,
        tol: 0.03,
        tolType: "rel",
        hints: ["Gas input = heat ÷ efficiency; then × nights × gas price.", "(871 ÷ 0.85) × 310 × 0.06."],
        worked: "871 ÷ 0.85 ≈ 1,025 kWh of gas a night; × 310 nights × £0.06 ≈ £19,056/yr.",
      },
      {
        id: "recovery-value",
        prompt: "Preheating from 10 °C to 35 °C covers half the temperature lift. What is the desuperheater worth per year?",
        unit: "£/yr",
        answer: 9528,
        tol: 0.03,
        tolType: "rel",
        hints: ["Half the lift means half the gas.", "19,056 × 0.5."],
        worked: "Half of £19,056 ≈ £9,528/yr — heat the plant was already rejecting, captured before the condenser.",
      },
    ],
    candidateCauseIds: ["undersized-boiler", "correct-operation", "no-heat-recovery", "fixed-defrost"],
    correctCauseIds: ["no-heat-recovery"],
    candidateActionIds: ["bigger-boiler", "install-desuperheater", "accept-as-is", "demand-defrost"],
    correctActionIds: ["install-desuperheater"],
    improvementActionIds: [],
    debrief:
      "Nothing here is broken, which is why it has run this way for years: the calorifier heats the water perfectly, and the condensers reject heat perfectly. The waste is in the gap between them. A food factory is one of the few sites where a large, year-round heat rejection (refrigeration) coexists with a large, year-round low-grade heat demand (washdown and CIP water), and a desuperheater bridging the two typically pays back in two to three years — here, a £25,000 installation against £9,528/yr. This pairing is the single most reliable heat-recovery project in the sector.",
    faultChain: [
      "15 m³/night heated 10→60 °C by gas: ~£19,056/yr",
      "Refrigeration rejects heat to roof continuously, unrecovered",
      "Desuperheater preheats 10→35 °C: half the lift, half the gas",
      "Fix: fit the desuperheater — ~£9,528/yr recovered",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "fixed-timer-defrost",
    title: "Case 2 — The Freezer That Defrosts by Clock",
    tag: "Refrigeration",
    brief:
      "A spiral freezer's evaporators defrost on a fixed timer: 36 kW of electric defrost heaters, four hours in every 24, set years ago 'to be safe'. Frost surveys show one hour a day is actually needed at current production and humidity. Every excess defrost hour dumps heat into a freezer that the low-temperature plant (COP 1.5) must then remove again. Put a number on the habit.",
    knownFacts: [
      "Defrost heaters: 36 kW, electric, inside the freezer envelope",
      "Timer: 4 h/day fixed; frost surveys support 1 h/day",
      "Low-temperature plant COP: 1.5 — every kWh of heat added costs ~0.67 kWh of compressor electricity to remove",
      "350 operating days/year; electricity £0.20/kWh",
    ],
    readings: [
      { label: "Defrost heater rating", value: "36", unit: "kW" },
      { label: "Timer setting", value: "4", unit: "h/day" },
      { label: "Actually needed", value: "1", unit: "h/day" },
      { label: "LT plant COP", value: "1.5" },
    ],
    refTables: ["defrost", "prices"],
    calcParts: [
      {
        id: "excess-heat",
        prompt: "How much excess defrost energy goes into the freezer each day?",
        unit: "kWh",
        answer: 108,
        tol: 0.03,
        tolType: "rel",
        hints: ["Excess hours × heater rating.", "(4 − 1) × 36."],
        worked: "3 excess hours × 36 kW = 108 kWh of unnecessary heat, delivered into a −25 °C space, every day.",
      },
      {
        id: "removal-elec",
        prompt: "At COP 1.5, how much extra compressor electricity does removing that heat take each day?",
        unit: "kWh",
        answer: 72,
        tol: 0.03,
        tolType: "rel",
        hints: ["Heat to remove ÷ COP.", "108 ÷ 1.5."],
        worked: "108 ÷ 1.5 = 72 kWh of compressor electricity, on top of the 108 kWh the heaters themselves drew.",
      },
      {
        id: "annual-cost",
        prompt: "Counting both the heaters and the extra refrigeration, what does the excess defrost cost per year?",
        unit: "£/yr",
        answer: 12600,
        tol: 0.03,
        tolType: "rel",
        hints: ["(Excess heater kWh + removal kWh) × days × price.", "(108 + 72) × 350 × 0.20."],
        worked: "180 kWh/day × 350 days × £0.20 = £12,600/yr — paid twice: once to make the heat, once to remove it.",
      },
    ],
    candidateCauseIds: ["correct-operation", "fixed-defrost", "no-heat-recovery", "undersized-boiler"],
    correctCauseIds: ["fixed-defrost"],
    candidateActionIds: ["longer-defrost", "accept-as-is", "demand-defrost", "bigger-boiler"],
    correctActionIds: ["demand-defrost"],
    improvementActionIds: [],
    debrief:
      "Defrost is necessary: frosted evaporators lose capacity and waste energy in their own way. But defrost heat is the most expensive heat in the factory, because the plant pays for it twice — once at the heater, then again at the compressor removing it from a −25 °C space at COP 1.5. Fixed timers set 'to be safe' are how three unnecessary hours a day survive for years. On-demand defrost (frost sensing, or pressure-drop initiation) keeps the safety and deletes the excess: £12,600/yr here, for a controls change on plant that already exists.",
    faultChain: [
      "Timer: 4 h/day of 36 kW defrost; surveys support 1 h/day",
      "108 kWh/day of excess heat into the freezer",
      "Plus 72 kWh/day of compressor energy to remove it (COP 1.5)",
      "Fix: on-demand defrost — ~£12,600/yr",
    ],
  },
];

export function getFoodCase(id: string): FoodCase | undefined {
  return FOOD_CASES.find((c) => c.id === id);
}
