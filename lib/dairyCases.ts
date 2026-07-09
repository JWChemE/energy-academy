/**
 * Dairy diagnostic mini-cases — two quick, hands-on call-outs for the
 * Dairies course inside the Food & Drink sector: a pasteuriser whose
 * regeneration has quietly degraded, and an ice bank charging at the wrong
 * time of day. Built on the shared diagnostics core (lib/diagnostics.ts)
 * and rendered by the same CaseDiagnostics component as every Level 2
 * capstone — two cases, embedded partway through a lesson rather than as
 * the course's own capstone (that's the dairy audit, in the next module).
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const DAIRY_CAUSES: CauseDef[] = [
  { id: "regen-degraded", label: "Regeneration effectiveness degraded — fouled or leaking plate pack shifting duty onto the hot section" },
  { id: "charge-window-drift", label: "Ice bank charging outside its cheap-rate window after a controls change" },
  { id: "undersized-plant", label: "Heating/refrigeration plant undersized for the throughput" },
  { id: "correct-operation", label: "System operating as designed — no fault" },
];

export const DAIRY_ACTIONS: ActionDef[] = [
  { id: "refurbish-plates", label: "Refurbish the plate pack (clean, re-gasket) and monitor regeneration effectiveness monthly", tier: 2 },
  { id: "restore-window", label: "Restore the ice-bank charge window to the cheap-rate hours", tier: 1 },
  { id: "accept-as-is", label: "Leave the system as it is", tier: 1 },
  { id: "bigger-boiler", label: "Install a larger hot-water/steam boiler", tier: 3 },
  { id: "bigger-iceplant", label: "Install additional refrigeration capacity for the ice bank", tier: 3 },
];

export type DairyRefTable = "regen" | "tariff" | "prices";

export interface DairyCase extends DiagnosticCase {
  refTables: DairyRefTable[];
}

export const DAIRY_CASES: DairyCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "regen-degradation",
    title: "Case 1 — The Pasteuriser That Got Thirsty",
    tag: "Regeneration",
    brief:
      "A liquid-milk dairy's HTST pasteuriser runs 20,000 L/h, heating milk from 4 °C to 72 °C. Its regeneration section was designed to supply 92% of that lift from the outgoing hot milk; commissioning records prove it once did. Temperature loggers now show the regeneration section delivering only 84%, with the hot-water section quietly making up the difference. Nothing has alarmed, because nothing is 'wrong': the milk still hits 72 °C. Price the drift.",
    knownFacts: [
      "Throughput 20,000 L/h (≈20,000 kg/h); milk cp ≈ 3.9 kJ/kg·K; lift 4 → 72 °C",
      "Regeneration effectiveness: 92% design, 84% measured",
      "Pasteuriser runs 4,000 h/yr; hot section fed by an 85%-efficient gas system",
      "Gas £0.06/kWh",
    ],
    readings: [
      { label: "Throughput", value: "20,000", unit: "L/h" },
      { label: "Temperature lift", value: "4 → 72", unit: "°C" },
      { label: "Design regeneration", value: "92", unit: "%" },
      { label: "Measured regeneration", value: "84", unit: "%", note: "The hot section now supplies double its design share" },
    ],
    refTables: ["regen", "prices"],
    calcParts: [
      {
        id: "total-duty",
        prompt: "What is the pasteuriser's total heating duty?",
        unit: "kW",
        answer: 1473,
        tol: 0.03,
        tolType: "rel",
        hints: ["Mass flow × specific heat × ΔT, ÷ 3,600 for kW.", "20,000 × 3.9 × 68 ÷ 3,600."],
        worked: "20,000 × 3.9 × 68 ÷ 3,600 ≈ 1,473 kW of heating duty whenever the plant runs.",
      },
      {
        id: "extra-topup",
        prompt: "How much extra top-up heat is the hot section supplying now, versus design?",
        unit: "kW",
        answer: 117.9,
        tol: 0.03,
        tolType: "rel",
        hints: [
          "Top-up = (1 − regeneration) × total duty; compare 84% with 92%.",
          "(0.16 − 0.08) × 1,473.",
        ],
        worked: "Design top-up: 8% × 1,473 ≈ 117.9 kW. Actual: 16% × 1,473 ≈ 235.7 kW. The drift costs 117.9 kW, a doubling of the hot section's work.",
      },
      {
        id: "annual-cost",
        prompt: "Across 4,000 running hours, through the 85%-efficient gas system, what does the degradation cost per year?",
        unit: "£/yr",
        answer: 33280,
        tol: 0.03,
        tolType: "rel",
        hints: [
          "Extra kW × hours ÷ boiler efficiency × gas price.",
          "117.9 × 4,000 ÷ 0.85 × 0.06.",
        ],
        worked: "117.9 × 4,000 ≈ 471,500 kWh of extra heat; ÷ 0.85 ≈ 554,700 kWh of gas; × £0.06 ≈ £33,280 a year, for a plant that still 'works perfectly'.",
      },
    ],
    candidateCauseIds: ["undersized-plant", "regen-degraded", "correct-operation", "charge-window-drift"],
    correctCauseIds: ["regen-degraded"],
    candidateActionIds: ["bigger-boiler", "accept-as-is", "refurbish-plates", "restore-window"],
    correctActionIds: ["refurbish-plates"],
    improvementActionIds: [],
    debrief:
      "Regeneration effectiveness is the single most valuable maintenance number in a dairy, and it degrades silently: milk fouling and tired gaskets shave a point here, a point there, and the hot section absorbs the difference without an alarm ever sounding, because the product still reaches its validated temperature. Eight lost points on this plant cost £33,280 a year; a £15,000 plate-pack refurbishment pays back in under six months. The lasting fix is the monitoring habit: log the regeneration section's terminal temperatures and trend effectiveness monthly, so the next drift is caught at one point, not eight.",
    faultChain: [
      "Milk fouling and gasket wear degrade the plate pack over time",
      "Regeneration 92% → 84%; hot section silently doubles its share",
      "117.9 kW of extra top-up × 4,000 h ≈ £33,280/yr in gas",
      "Fix: refurbish the plates; trend effectiveness monthly",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "ice-bank-window",
    title: "Case 2 — The Ice Bank on Day Rates",
    tag: "Load shifting",
    brief:
      "A dairy's ice bank stores 3,000 kWh of cooling, built each night so the day shift can draw ice water without running the refrigeration plant flat out on peak-rate electricity. The site buys electricity on a two-rate tariff: 14p/kWh off-peak (00:00–07:00), 24p/kWh otherwise. After a controls upgrade last year, the half-hourly data shows the compressors now build the ice through the morning and afternoon. Nobody noticed: the ice is always ready. Price the habit.",
    knownFacts: [
      "Ice bank thermal capacity: 3,000 kWh of cooling per daily charge",
      "Refrigeration COP during charging: ≈3.0",
      "Tariff: 14p/kWh off-peak (00:00–07:00), 24p/kWh day rate",
      "350 charge cycles per year",
    ],
    readings: [
      { label: "Thermal charge", value: "3,000", unit: "kWh/day" },
      { label: "Charging COP", value: "3.0" },
      { label: "Off-peak rate", value: "14", unit: "p/kWh" },
      { label: "Charging window observed", value: "09:00–17:00", note: "The dearest hours on the tariff" },
    ],
    refTables: ["tariff", "prices"],
    calcParts: [
      {
        id: "elec-per-charge",
        prompt: "How much electricity does one full charge take?",
        unit: "kWh",
        answer: 1000,
        tol: 0.02,
        tolType: "rel",
        hints: ["Thermal energy stored ÷ COP.", "3,000 ÷ 3.0."],
        worked: "3,000 ÷ 3.0 = 1,000 kWh of compressor electricity per charge.",
      },
      {
        id: "cost-delta",
        prompt: "What is the cost difference per charge between day-rate and off-peak charging?",
        unit: "£",
        answer: 100,
        tol: 0.03,
        tolType: "rel",
        hints: ["Charge kWh × (day rate − off-peak rate).", "1,000 × (0.24 − 0.14)."],
        worked: "1,000 × £0.10 = £100 per charge — the same ice, at a £100 premium for making it in daylight.",
      },
      {
        id: "annual-cost",
        prompt: "Across 350 charges a year, what does the drifted window cost?",
        unit: "£/yr",
        answer: 35000,
        tol: 0.02,
        tolType: "rel",
        hints: ["Cost delta × charges per year.", "100 × 350."],
        worked: "£100 × 350 ≈ £35,000 a year, for ice that is identical in every respect except when the meter was spinning.",
      },
    ],
    candidateCauseIds: ["correct-operation", "charge-window-drift", "undersized-plant", "regen-degraded"],
    correctCauseIds: ["charge-window-drift"],
    candidateActionIds: ["bigger-iceplant", "restore-window", "accept-as-is", "refurbish-plates"],
    correctActionIds: ["restore-window"],
    improvementActionIds: [],
    debrief:
      "An ice bank's entire purpose is to separate when cold is made from when cold is used, and a controls upgrade quietly deleted that separation: the schedule defaulted to 'charge when depleted', which means daytime. The £35,000 is pure tariff arithmetic, and the fix is a time schedule, not a machine. There is a physics bonus too: night air is cooler, so condensing pressure falls and the charging COP improves, making off-peak ice slightly cheaper again. Load-shifting assets only pay while someone owns their schedule, which is why the charge window belongs on the monthly exception report next to the meters.",
    faultChain: [
      "Controls upgrade reset the ice-bank schedule to charge-on-depletion",
      "Charging drifted into the 24p day rate; ice always ready, so no alarm",
      "1,000 kWh/charge × £0.10 premium × 350 charges ≈ £35,000/yr",
      "Fix: restore the 00:00–07:00 charge window — a schedule, not a machine",
    ],
  },
];

export function getDairyCase(id: string): DairyCase | undefined {
  return DAIRY_CASES.find((c) => c.id === id);
}
