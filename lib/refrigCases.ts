/**
 * Refrigeration & heat-pump diagnostic cases — fouled condenser, refrigerant
 * undercharge, chilled-water setpoint, part-load control, resistance-vs-heat-pump,
 * heat-pump flow temperature, free cooling, and a backup-control fault. A mix of
 * quantify-the-saving, read-the-numbers and judgement. Numbers consistent with
 * lib/refrigTables.ts. Built on the shared diagnostics core.
 *
 * The unifying metric is COP: electrical input = useful output ÷ COP. Most faults
 * are a COP that has collapsed (fouling, undercharge, big temperature lift, bad
 * part-load control) or heat made the expensive way (resistance, over-used backup).
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const REFRIG_CAUSES: CauseDef[] = [
  { id: "fouled-condenser", label: "Fouled / dirty condenser — high head pressure, low COP" },
  { id: "low-charge", label: "Low refrigerant charge / leak — high superheat, low subcooling" },
  { id: "low-chw-setpoint", label: "Chilled-water setpoint colder than the load needs" },
  { id: "poor-partload", label: "Poor part-load control (hot-gas bypass / on-off cycling)" },
  { id: "resistance-heating", label: "Direct electric resistance heating where a heat pump would do" },
  { id: "high-flow-temp", label: "Heat-pump flow temperature higher than needed — large lift" },
  { id: "no-free-cooling", label: "Free cooling (economiser) available but not used" },
  { id: "backup-control-fault", label: "Electric backup / controls set wrong (aux heat over-used)" },
  { id: "overcharge", label: "Overcharged — low superheat, liquid-slugging risk" },
  { id: "undersized", label: "Plant genuinely undersized for the load" },
  { id: "system-fine", label: "Operating correctly — no fault" },
];

export const REFRIG_ACTIONS: ActionDef[] = [
  { id: "raise-chw-setpoint", label: "Raise the chilled-water setpoint to suit the load", tier: 1 },
  { id: "adjust-superheat", label: "Adjust the expansion valve / charge to target superheat & subcooling", tier: 1 },
  { id: "recalibrate-controls", label: "Recalibrate sensors / correct the control logic", tier: 1 },
  { id: "clean-condenser", label: "Clean / descale the condenser", tier: 2 },
  { id: "find-leak-recharge", label: "Find and repair the leak, then recharge to spec", tier: 2 },
  { id: "lower-flow-temp", label: "Lower the flow temperature (bigger emitters / weather comp)", tier: 2 },
  { id: "fit-weather-comp", label: "Add weather compensation / setpoint reset", tier: 2 },
  { id: "fit-economiser", label: "Fit a waterside (free-cooling) economiser", tier: 3 },
  { id: "fit-vfd", label: "Fit a variable-speed (VFD) compressor drive", tier: 3 },
  { id: "install-heat-pump", label: "Replace resistance heating with a heat pump", tier: 3 },
  { id: "top-up-refrigerant", label: "Just top up the refrigerant", tier: 1 },
  { id: "replace-chiller", label: "Replace the chiller", tier: 3 },
  { id: "bigger-heat-pump", label: "Install a larger heat pump", tier: 3 },
  { id: "add-immersion", label: "Add more electric backup heating", tier: 1 },
];

export type RefrigRefTable = "cop" | "tuning" | "setpoint" | "partload" | "prices";

export interface RefrigCase extends DiagnosticCase {
  refTables: RefrigRefTable[];
}

export const REFRIG_CASES: RefrigCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "fouled-condenser",
    title: "Case 1 — The chiller that can't shed its heat",
    tag: "Condenser fouling",
    brief:
      "A water-cooled chiller's energy use has crept up and its discharge (head) pressure runs high. The condenser tubes are scaled and the coils are caked in dust — it can't reject heat properly, so the compressor works harder for the same cooling. Quantify what the lost COP is costing.",
    knownFacts: [
      "Cooling duty 200 kW; design COP 3.5",
      "Fouled condenser has dragged the COP down to 2.9",
      "Runs ~4,000 h/yr; electricity £0.20/kWh",
      "Superheat and charge check out normal — it's the condenser",
    ],
    readings: [
      { label: "Cooling duty", value: "200", unit: "kW" },
      { label: "Design COP", value: "3.5", unit: "" },
      { label: "COP now", value: "2.9", unit: "", note: "high head pressure, scaled tubes" },
      { label: "Run hours", value: "4,000", unit: "h/yr" },
    ],
    refTables: ["cop", "prices"],
    calcParts: [
      {
        id: "work-now",
        prompt: "What compressor power is it drawing now?",
        unit: "kW",
        answer: 69,
        tol: 0.05,
        tolType: "rel",
        hints: ["Input = cooling output ÷ COP.", "200 ÷ 2.9."],
        worked: "200 ÷ 2.9 ≈ 69 kW.",
      },
      {
        id: "work-design",
        prompt: "What should it draw at the design COP?",
        unit: "kW",
        answer: 57.1,
        tol: 0.05,
        tolType: "rel",
        hints: ["Input = cooling output ÷ COP.", "200 ÷ 3.5."],
        worked: "200 ÷ 3.5 ≈ 57.1 kW.",
      },
      {
        id: "extra-cost",
        prompt: "What is the lost efficiency costing per year?",
        unit: "£/yr",
        answer: 9460,
        tol: 0.07,
        tolType: "rel",
        hints: ["(extra kW) × hours × price.", "(69 − 57.1) × 4,000 × 0.20."],
        worked: "(69 − 57.1) ≈ 11.9 kW; × 4,000 h × £0.20 ≈ £9,460/yr wasted to a dirty condenser.",
      },
    ],
    candidateCauseIds: ["low-charge", "undersized", "system-fine", "fouled-condenser"],
    correctCauseIds: ["fouled-condenser"],
    candidateActionIds: ["raise-chw-setpoint", "replace-chiller", "find-leak-recharge", "clean-condenser"],
    correctActionIds: ["clean-condenser"],
    improvementActionIds: [],
    debrief:
      "High head pressure with normal superheat and charge points straight at the condenser: scale and dust raise the condensing temperature, the lift grows, and the COP falls from 3.5 to 2.9 — ~£9,460/yr. Clean the coils and descale the tubes (with water treatment to stop it recurring) and the COP recovers. Replacing the chiller would be spending tens of thousands to fix a cleaning job.",
    faultChain: [
      "High head pressure, scaled tubes, dusty coils",
      "COP dragged from 3.5 to 2.9 → 69 kW vs 57 kW",
      "≈ £9,460/yr of extra compressor work",
      "Fix: clean / descale the condenser (and treat the water)",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "low-charge",
    title: "Case 2 — Reading the gauges",
    tag: "Refrigerant charge",
    brief:
      "Cooling capacity is down and the sight glass is bubbling. You take the commissioning readings: at the evaporator, saturation is −5 °C but the suction line is at +15 °C; at the condenser, saturation is 40 °C but the liquid line is at 38 °C. Work out the superheat and subcooling and say what they tell you.",
    knownFacts: [
      "Evaporator: saturation −5 °C, suction-line temperature +15 °C",
      "Condenser: saturation 40 °C, liquid-line temperature 38 °C",
      "Target superheat 5–8 °C; target subcooling 5–10 °C",
      "Cooling capacity has fallen from 100 kW to 75 kW",
    ],
    readings: [
      { label: "Evap saturation temp", value: "−5", unit: "°C" },
      { label: "Suction-line temp", value: "+15", unit: "°C" },
      { label: "Cond saturation temp", value: "40", unit: "°C" },
      { label: "Liquid-line temp", value: "38", unit: "°C", note: "sight glass bubbling" },
    ],
    refTables: ["tuning", "cop"],
    calcParts: [
      {
        id: "superheat",
        prompt: "What is the superheat at the evaporator outlet?",
        unit: "°C",
        answer: 20,
        tol: 1,
        tolType: "abs",
        hints: ["Superheat = measured − saturation temperature.", "15 − (−5)."],
        worked: "15 − (−5) = 20 °C — far above the 5–8 °C target.",
      },
      {
        id: "subcooling",
        prompt: "What is the subcooling at the condenser exit?",
        unit: "°C",
        answer: 2,
        tol: 1,
        tolType: "abs",
        hints: ["Subcooling = saturation − measured temperature.", "40 − 38."],
        worked: "40 − 38 = 2 °C — below the 5–10 °C target.",
      },
      {
        id: "capacity-loss",
        prompt: "How much cooling capacity has been lost?",
        unit: "kW",
        answer: 25,
        tol: 2,
        tolType: "abs",
        hints: ["Design capacity − current capacity.", "100 − 75."],
        worked: "100 − 75 = 25 kW (25%) of capacity lost.",
      },
    ],
    candidateCauseIds: ["fouled-condenser", "overcharge", "low-charge", "system-fine"],
    correctCauseIds: ["low-charge"],
    candidateActionIds: ["find-leak-recharge", "top-up-refrigerant", "replace-chiller", "adjust-superheat"],
    correctActionIds: ["find-leak-recharge"],
    improvementActionIds: ["adjust-superheat"],
    debrief:
      "High superheat (20 °C) and low subcooling (2 °C) together, with a bubbling sight glass, are the classic signature of an undercharged system — there isn't enough refrigerant to flood the evaporator or fill the condenser, so capacity collapses. The fix is not to 'just top up': a low charge means a leak, and topping up only delays the next failure (and vents refrigerant to atmosphere). Find and repair the leak, then recharge to spec and reset the expansion valve. Overcharge would show the opposite — low superheat and slugging risk.",
    faultChain: [
      "Capacity down, sight glass bubbling",
      "Superheat 20 °C (high) + subcooling 2 °C (low) → undercharge",
      "25 kW (25%) of cooling lost",
      "Fix: find and repair the leak, then recharge (don't just top up)",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "chw-setpoint",
    title: "Case 3 — Colder than it needs to be",
    tag: "Setpoint",
    brief:
      "A chiller has produced 5 °C chilled water for years 'because that's how it was set'. But the cooling coils it serves are comfortable with 9 °C water. Every degree warmer the chilled water can run means a smaller temperature lift and a better COP — for free. Quantify the prize.",
    knownFacts: [
      "Chilled-water setpoint 5 °C; the loads are happy at 9 °C",
      "Chiller COP improves ~3% per °C of higher chilled-water temperature",
      "Average compressor power ~60 kW; ~3,000 h/yr; £0.20/kWh",
      "Check the loads still dehumidify adequately first",
    ],
    readings: [
      { label: "Chilled-water setpoint", value: "5", unit: "°C", note: "legacy setting" },
      { label: "Temperature the loads need", value: "9", unit: "°C" },
      { label: "Average compressor power", value: "60", unit: "kW" },
      { label: "Run hours", value: "3,000", unit: "h/yr" },
    ],
    refTables: ["setpoint", "cop"],
    calcParts: [
      {
        id: "rise",
        prompt: "How much can the chilled-water temperature be raised?",
        unit: "°C",
        answer: 4,
        tol: 0.5,
        tolType: "abs",
        hints: ["Required temp − current setpoint.", "9 − 5."],
        worked: "9 − 5 = 4 °C of available rise.",
      },
      {
        id: "cop-gain",
        prompt: "What COP improvement does that give (at ~3% per °C)?",
        unit: "%",
        answer: 12,
        tol: 1,
        tolType: "abs",
        hints: ["Rise × 3% per °C.", "4 × 3%."],
        worked: "4 × 3% = 12% better COP — i.e. ~12% less energy for the same cooling.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 4320,
        tol: 0.06,
        tolType: "rel",
        hints: ["Saving % × power × hours × price.", "0.12 × 60 × 3,000 × 0.20."],
        worked: "0.12 × 60 × 3,000 × £0.20 ≈ £4,320/yr — at no capital cost.",
      },
    ],
    candidateCauseIds: ["poor-partload", "system-fine", "low-chw-setpoint", "fouled-condenser"],
    correctCauseIds: ["low-chw-setpoint"],
    candidateActionIds: ["raise-chw-setpoint", "fit-weather-comp", "fit-vfd", "replace-chiller"],
    correctActionIds: ["raise-chw-setpoint"],
    improvementActionIds: ["fit-weather-comp"],
    debrief:
      "Producing water colder than the loads need is pure wasted lift. Raising the chilled-water setpoint from 5 to 9 °C lifts the COP ~12% and saves ~£4,320/yr for the price of a setpoint change — one of the best free wins in any plant room. The one check: the coils must still dehumidify adequately at the warmer temperature. A reset schedule (chilled-water temperature varying with load) banks even more across the year.",
    faultChain: [
      "Chilled water made at 5 °C; loads happy at 9 °C",
      "4 °C warmer × ~3%/°C ≈ 12% better COP",
      "≈ £4,320/yr at no capital cost",
      "Fix: raise the setpoint (then add a reset schedule)",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "part-load",
    title: "Case 4 — Full power, half the cooling",
    tag: "Part-load",
    brief:
      "A chiller is sized for a peak it rarely sees: most of the year it runs at part load. But its only capacity control is hot-gas bypass, so the compressor keeps drawing near-full power while delivering a fraction of the cooling. A variable-speed drive would track the load instead. Quantify the waste.",
    knownFacts: [
      "Full load: 150 kW cooling for 45 kW power (COP 3.33)",
      "Typical load is only ~60 kW of cooling",
      "On hot-gas bypass it still draws ~42 kW at that load",
      "Runs ~3,000 h/yr at this part load; £0.20/kWh; a VFD costs ~£15,000",
    ],
    readings: [
      { label: "Full-load power", value: "45", unit: "kW", note: "for 150 kW cooling" },
      { label: "Typical cooling load", value: "60", unit: "kW", note: "40% of capacity" },
      { label: "Power now (hot-gas bypass)", value: "42", unit: "kW", note: "near full, for 60 kW cooling" },
      { label: "Run hours at part load", value: "3,000", unit: "h/yr" },
    ],
    refTables: ["partload", "cop"],
    calcParts: [
      {
        id: "cop-now",
        prompt: "What is the effective COP at this part load now?",
        unit: "",
        answer: 1.43,
        tol: 0.1,
        tolType: "abs",
        hints: ["Cooling delivered ÷ power drawn.", "60 ÷ 42."],
        worked: "60 ÷ 42 ≈ 1.4 — the bypass has wrecked the COP (it was 3.33).",
      },
      {
        id: "vfd-power",
        prompt: "What power would a VFD draw for 60 kW cooling at the design COP (3.33)?",
        unit: "kW",
        answer: 18,
        tol: 0.06,
        tolType: "rel",
        hints: ["Cooling ÷ design COP.", "60 ÷ 3.33."],
        worked: "60 ÷ 3.33 ≈ 18 kW — the compressor simply slows to match the load.",
      },
      {
        id: "saving",
        prompt: "What would the VFD save per year?",
        unit: "£/yr",
        answer: 14400,
        tol: 0.06,
        tolType: "rel",
        hints: ["(power now − VFD power) × hours × price.", "(42 − 18) × 3,000 × 0.20."],
        worked: "(42 − 18) = 24 kW; × 3,000 h × £0.20 = £14,400/yr (≈1-year payback on the VFD).",
      },
    ],
    candidateCauseIds: ["undersized", "poor-partload", "fouled-condenser", "system-fine"],
    correctCauseIds: ["poor-partload"],
    candidateActionIds: ["raise-chw-setpoint", "fit-vfd", "replace-chiller", "clean-condenser"],
    correctActionIds: ["fit-vfd"],
    improvementActionIds: [],
    debrief:
      "Hot-gas bypass (and crude on-off cycling) keep the compressor near full power while delivering part-load cooling, collapsing the effective COP — here from 3.33 to ~1.4. A variable-speed drive slows the compressor to track demand, restoring near-design COP at part load and saving ~£14,400/yr for roughly a one-year payback. The plant isn't undersized — quite the opposite; it's oversized for the load it usually sees, which is exactly where VFD control pays.",
    faultChain: [
      "Oversized chiller mostly at ~40% load on hot-gas bypass",
      "42 kW for 60 kW cooling → effective COP ~1.4",
      "VFD would need ~18 kW → ~£14,400/yr saved",
      "Fix: fit a variable-speed compressor drive",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "resistance-heating",
    title: "Case 5 — Paying COP 1",
    tag: "Heat pump case",
    brief:
      "A building heats its space and hot water with direct electric resistance heaters — every kilowatt of electricity makes exactly one kilowatt of heat (COP 1). A heat pump moves heat instead of making it, delivering three times as much per kilowatt. Work out the case for switching.",
    knownFacts: [
      "Annual heat demand 100,000 kWh, met by resistance heating (COP 1)",
      "An air-source heat pump would deliver it at COP 3",
      "Electricity £0.20/kWh",
      "Heat-pump installation ≈ £40,000",
    ],
    readings: [
      { label: "Annual heat demand", value: "100,000", unit: "kWh" },
      { label: "Resistance COP", value: "1", unit: "", note: "1 kWh elec → 1 kWh heat" },
      { label: "Heat-pump COP", value: "3", unit: "" },
      { label: "Install cost", value: "40,000", unit: "£" },
    ],
    refTables: ["cop", "prices"],
    calcParts: [
      {
        id: "hp-elec",
        prompt: "How much electricity would the heat pump use for the same heat?",
        unit: "kWh/yr",
        answer: 33333,
        tol: 0.04,
        tolType: "rel",
        hints: ["Electricity = heat ÷ COP.", "100,000 ÷ 3."],
        worked: "100,000 ÷ 3 ≈ 33,333 kWh — a third of the resistance figure.",
      },
      {
        id: "saving",
        prompt: "What is the annual saving?",
        unit: "£/yr",
        answer: 13333,
        tol: 0.05,
        tolType: "rel",
        hints: ["(resistance kWh − heat-pump kWh) × price.", "(100,000 − 33,333) × 0.20."],
        worked: "(100,000 − 33,333) × £0.20 ≈ £13,333/yr.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback?",
        unit: "years",
        answer: 3.0,
        tol: 0.1,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "40,000 ÷ 13,333."],
        worked: "£40,000 ÷ £13,333 ≈ 3 years.",
      },
    ],
    candidateCauseIds: ["high-flow-temp", "resistance-heating", "undersized", "system-fine"],
    correctCauseIds: ["resistance-heating"],
    candidateActionIds: ["install-heat-pump", "recalibrate-controls", "add-immersion", "replace-chiller"],
    correctActionIds: ["install-heat-pump"],
    improvementActionIds: [],
    debrief:
      "Resistance heating is the one form of heating that can't beat COP 1 — moving heat with a pump is fundamentally several times more efficient than making it. Switching this load to a COP-3 heat pump cuts the electricity to a third, saving ~£13,333/yr at a ~3-year payback. Adding more resistance backup would be doubling down on the expensive option. Size the heat pump to the load and keep flow temperatures low to protect the COP (next case).",
    faultChain: [
      "100,000 kWh/yr of heat made by resistance (COP 1)",
      "A COP-3 heat pump needs only 33,333 kWh",
      "≈ £13,333/yr saved; ~3-year payback",
      "Fix: install a heat pump",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "high-flow-temp",
    title: "Case 6 — Asking too much lift",
    tag: "Flow temperature",
    brief:
      "An air-source heat pump was set to push 55 °C flow to suit the building's small old radiators. That big temperature lift hurts its COP. Upgrading the emitters so the system runs at 45 °C flow would let the heat pump work less hard for the same heat. Quantify the gain.",
    knownFacts: [
      "Annual heat delivered 120,000 kWh",
      "At 55 °C flow the seasonal COP is 2.8",
      "At 45 °C flow (bigger emitters) the COP would be 3.5",
      "Electricity £0.20/kWh",
    ],
    readings: [
      { label: "Annual heat delivered", value: "120,000", unit: "kWh" },
      { label: "Flow temp now", value: "55", unit: "°C", note: "small old radiators" },
      { label: "COP at 55 °C", value: "2.8", unit: "" },
      { label: "COP at 45 °C", value: "3.5", unit: "", note: "after emitter upgrade" },
    ],
    refTables: ["cop", "prices"],
    calcParts: [
      {
        id: "elec-now",
        prompt: "How much electricity does it use now (COP 2.8)?",
        unit: "kWh/yr",
        answer: 42857,
        tol: 0.04,
        tolType: "rel",
        hints: ["Electricity = heat ÷ COP.", "120,000 ÷ 2.8."],
        worked: "120,000 ÷ 2.8 ≈ 42,857 kWh/yr.",
      },
      {
        id: "elec-after",
        prompt: "How much would it use at 45 °C flow (COP 3.5)?",
        unit: "kWh/yr",
        answer: 34286,
        tol: 0.04,
        tolType: "rel",
        hints: ["Electricity = heat ÷ COP.", "120,000 ÷ 3.5."],
        worked: "120,000 ÷ 3.5 ≈ 34,286 kWh/yr.",
      },
      {
        id: "saving",
        prompt: "What is the annual saving?",
        unit: "£/yr",
        answer: 1714,
        tol: 0.06,
        tolType: "rel",
        hints: ["(kWh now − kWh after) × price.", "(42,857 − 34,286) × 0.20."],
        worked: "(42,857 − 34,286) × £0.20 ≈ £1,714/yr — for the same warmth, just a smaller lift.",
      },
    ],
    candidateCauseIds: ["high-flow-temp", "fouled-condenser", "resistance-heating", "system-fine"],
    correctCauseIds: ["high-flow-temp"],
    candidateActionIds: ["lower-flow-temp", "bigger-heat-pump", "fit-weather-comp", "add-immersion"],
    correctActionIds: ["lower-flow-temp"],
    improvementActionIds: ["fit-weather-comp"],
    debrief:
      "A heat pump's COP is governed by the temperature lift, so a high flow temperature is expensive. Dropping from 55 to 45 °C — by enlarging the emitters so they give the same heat at a lower water temperature — lifts the seasonal COP from 2.8 to 3.5 and saves ~£1,714/yr. Weather compensation, which lowers the flow temperature further in milder weather, adds more. Fitting a bigger heat pump would not help — the lift, not the size, is the problem.",
    faultChain: [
      "55 °C flow for small radiators → big lift, COP 2.8",
      "45 °C flow (bigger emitters) → COP 3.5",
      "42,857 vs 34,286 kWh ≈ £1,714/yr",
      "Fix: lower the flow temperature; add weather compensation",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "free-cooling",
    title: "Case 7 — Running the chiller in winter",
    tag: "Free cooling",
    brief:
      "A process needs 100 kW of cooling all year round, and the chiller runs every day to provide it — even in midwinter, when the outdoor air is far colder than the chilled-water loop. On cold days the cooling tower alone could do the job and the chiller's compressor could be switched off entirely. Quantify the free-cooling prize.",
    knownFacts: [
      "Cooling load 100 kW year-round; chiller compressor ~30 kW",
      "For ~2,500 h/yr it's cold enough for the cooling tower to meet the load directly",
      "During free cooling only pumps/fans run (~5 kW)",
      "Economiser retrofit ≈ £20,000; £0.20/kWh",
    ],
    readings: [
      { label: "Cooling load", value: "100", unit: "kW", note: "year-round" },
      { label: "Chiller compressor power", value: "30", unit: "kW" },
      { label: "Free-cooling hours", value: "2,500", unit: "h/yr", note: "cold enough" },
      { label: "Pumps/fans only", value: "5", unit: "kW", note: "compressor off" },
    ],
    refTables: ["setpoint", "prices"],
    calcParts: [
      {
        id: "displaced",
        prompt: "How much power is avoided per hour of free cooling?",
        unit: "kW",
        answer: 25,
        tol: 1,
        tolType: "abs",
        hints: ["Compressor power − pumps/fans power.", "30 − 5."],
        worked: "30 − 5 = 25 kW saved every free-cooling hour.",
      },
      {
        id: "saving",
        prompt: "What is the annual saving?",
        unit: "£/yr",
        answer: 12500,
        tol: 0.05,
        tolType: "rel",
        hints: ["Power avoided × free-cooling hours × price.", "25 × 2,500 × 0.20."],
        worked: "25 × 2,500 × £0.20 = £12,500/yr.",
      },
      {
        id: "payback",
        prompt: "What is the payback on the economiser?",
        unit: "years",
        answer: 1.6,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "20,000 ÷ 12,500."],
        worked: "£20,000 ÷ £12,500 = 1.6 years.",
      },
    ],
    candidateCauseIds: ["poor-partload", "system-fine", "no-free-cooling", "low-chw-setpoint"],
    correctCauseIds: ["no-free-cooling"],
    candidateActionIds: ["replace-chiller", "fit-vfd", "fit-economiser", "raise-chw-setpoint"],
    correctActionIds: ["fit-economiser"],
    improvementActionIds: [],
    debrief:
      "Running mechanical refrigeration when it's freezing outside is paying to make cold you could get for nothing. A waterside economiser lets the cooling tower meet the load directly on cold days, switching the compressor off and leaving just the pumps and fans — ~£12,500/yr at a ~1.6-year payback. It's especially valuable for year-round loads like process and data-centre cooling. Replacing the chiller would be unnecessary capital for a problem that's about controls and a heat exchanger.",
    faultChain: [
      "100 kW load met by the chiller even in midwinter",
      "Cooling tower could do it free for ~2,500 h/yr",
      "25 kW avoided × 2,500 h ≈ £12,500/yr",
      "Fix: fit a waterside (free-cooling) economiser",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "backup-control",
    title: "Case 8 — The backup that won't switch off",
    tag: "Controls",
    brief:
      "A heat-pump system has an electric immersion backup for the coldest days. But the bills are high and the logs show the immersion running constantly, even in mild weather. The heat pump is healthy — a drifted sensor and a badly set balance point are bringing the expensive resistance backup on when the heat pump could easily cope. Quantify the needless cost.",
    knownFacts: [
      "Backup immersion is supplying 25,000 kWh/yr of heat at COP 1",
      "The heat pump (COP 2.5) could have supplied that heat",
      "The heat pump itself is healthy and not undersized",
      "Electricity £0.20/kWh; recommissioning is essentially no-cost",
    ],
    readings: [
      { label: "Heat from backup", value: "25,000", unit: "kWh/yr", note: "running even in mild weather" },
      { label: "Backup COP", value: "1", unit: "", note: "resistance" },
      { label: "Heat-pump COP", value: "2.5", unit: "" },
      { label: "Heat pump", value: "healthy", note: "not undersized — it's the control" },
    ],
    refTables: ["cop", "prices"],
    calcParts: [
      {
        id: "backup-elec",
        prompt: "How much electricity is the backup using for that heat?",
        unit: "kWh/yr",
        answer: 25000,
        tol: 0.03,
        tolType: "rel",
        hints: ["At COP 1, electricity equals the heat delivered.", "25,000 ÷ 1."],
        worked: "25,000 ÷ 1 = 25,000 kWh — resistance heat is one-for-one.",
      },
      {
        id: "hp-elec",
        prompt: "How much would the heat pump use for the same heat (COP 2.5)?",
        unit: "kWh/yr",
        answer: 10000,
        tol: 0.04,
        tolType: "rel",
        hints: ["Electricity = heat ÷ COP.", "25,000 ÷ 2.5."],
        worked: "25,000 ÷ 2.5 = 10,000 kWh.",
      },
      {
        id: "saving",
        prompt: "What is recoverable per year by fixing the controls?",
        unit: "£/yr",
        answer: 3000,
        tol: 0.05,
        tolType: "rel",
        hints: ["(backup kWh − heat-pump kWh) × price.", "(25,000 − 10,000) × 0.20."],
        worked: "(25,000 − 10,000) × £0.20 = £3,000/yr — recovered at essentially no capital cost.",
      },
    ],
    candidateCauseIds: ["undersized", "high-flow-temp", "system-fine", "backup-control-fault"],
    correctCauseIds: ["backup-control-fault"],
    candidateActionIds: ["recalibrate-controls", "fit-weather-comp", "bigger-heat-pump", "add-immersion"],
    correctActionIds: ["recalibrate-controls"],
    improvementActionIds: ["fit-weather-comp"],
    debrief:
      "Electric backup is meant for the few coldest days; here a drifted sensor and a wrongly set balance point have it running in mild weather, so COP-1 resistance heat replaces COP-2.5 heat-pump heat — ~£3,000/yr thrown away. Because the heat pump is healthy, the fix is a screwdriver, not new kit: recalibrate the sensor and reset the balance point so the backup only engages when the heat pump genuinely can't keep up. Fitting a bigger heat pump or more immersion would spend money to make the problem worse.",
    faultChain: [
      "Immersion backup running even in mild weather",
      "25,000 kWh of COP-1 heat that a COP-2.5 heat pump could make for 10,000 kWh",
      "≈ £3,000/yr — recoverable at ~no cost",
      "Fix: recalibrate the sensor and reset the balance point",
    ],
  },
];

export function getRefrigCase(id: string): RefrigCase | undefined {
  return REFRIG_CASES.find((c) => c.id === id);
}
