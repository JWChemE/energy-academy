/**
 * HVAC diagnostic cases — a mix true to real life: some you quantify with the
 * fan/pump affinity laws and chiller COP, some you reason out from symptoms,
 * all framed as improvements and optimisations. Answers are consistent with
 * lib/hvacTables.ts. Built on the shared diagnostics core.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const HVAC_CAUSES: CauseDef[] = [
  { id: "economiser-disabled", label: "Air-side economiser disabled / damper stuck — free cooling not used" },
  { id: "oa-unsuitable", label: "Outdoor air too warm or humid for free cooling" },
  { id: "no-dcv", label: "No demand-controlled ventilation — over-supplying fresh air" },
  { id: "min-oa-correct", label: "Minimum fresh air correctly matched to occupancy" },
  { id: "sat-too-low", label: "Supply air temperature set too low (no reset) — forces reheat" },
  { id: "reheat-valve-failed", label: "Reheat valve stuck open" },
  { id: "deadband-tight", label: "Control deadband too tight" },
  { id: "no-static-reset", label: "No duct static-pressure reset — fan working harder than needed" },
  { id: "fan-oversized", label: "Fan oversized for the duty" },
  { id: "dirty-filters", label: "Dirty filters raising fan pressure" },
  { id: "pump-throttled", label: "Constant-speed pump throttled at a balancing valve — wasted head" },
  { id: "fouled-condenser", label: "Fouled / scaled condenser — high condensing temperature" },
  { id: "low-refrigerant", label: "Low refrigerant charge" },
  { id: "no-chw-reset", label: "No chilled-water temperature reset" },
  { id: "no-schedule", label: "No time schedule / night setback — running when unoccupied" },
  { id: "override-on", label: "Manual override left on" },
  { id: "sensor-drift", label: "Temperature sensor drifted / out of calibration" },
  { id: "undersized-heating", label: "Heating capacity undersized" },
];

export const HVAC_ACTIONS: ActionDef[] = [
  { id: "enable-economiser", label: "Repair / enable the air-side economiser", tier: 1 },
  { id: "enthalpy-control", label: "Add enthalpy-based economiser changeover", tier: 3 },
  { id: "reset-min-oa", label: "Reset minimum fresh-air damper to match occupancy", tier: 1 },
  { id: "fit-dcv", label: "Fit demand-controlled ventilation (CO₂ sensors)", tier: 3 },
  { id: "raise-sat", label: "Raise / reset the supply air temperature", tier: 1 },
  { id: "widen-deadband", label: "Widen the control deadband", tier: 1 },
  { id: "repair-reheat-valve", label: "Replace the stuck reheat valve", tier: 1 },
  { id: "static-reset", label: "Implement duct static-pressure reset", tier: 1 },
  { id: "clean-filters", label: "Replace / clean the filters", tier: 1 },
  { id: "trim-fan", label: "Trim the fan / fit a correctly sized impeller", tier: 3 },
  { id: "fit-vsd", label: "Fit a variable-speed drive", tier: 3 },
  { id: "open-balancing", label: "Open the throttled balancing valve", tier: 1 },
  { id: "clean-condenser", label: "Clean the condenser to restore the approach", tier: 2 },
  { id: "recharge-refrigerant", label: "Recharge the refrigerant", tier: 2 },
  { id: "chw-reset", label: "Add chilled-water temperature reset", tier: 1 },
  { id: "set-schedule", label: "Set a time schedule + night setback", tier: 1 },
  { id: "optimum-start", label: "Add optimum start/stop control", tier: 3 },
  { id: "recalibrate-sensor", label: "Recalibrate / replace the sensor", tier: 1 },
  { id: "replace-chiller", label: "Replace the chiller", tier: 3 },
  { id: "add-cooling", label: "Add cooling capacity", tier: 3 },
  { id: "add-heating", label: "Add heating capacity", tier: 3 },
];

export type HvacRefTable = "air" | "affinity" | "cop" | "ventilation" | "costs";

export interface HvacCase extends DiagnosticCase {
  refTables: HvacRefTable[];
}

export const HVAC_CASES: HvacCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "stuck-economiser",
    title: "Case 1 — Cooling on a cold day",
    tag: "Free cooling",
    brief:
      "A building's chiller is running hard on a mild spring day. The AHU has an air-side economiser that should be giving free cooling, but the mechanical cooling never seems to switch off. Work out what the missed free cooling is worth.",
    knownFacts: [
      "Outdoor air is 12 °C — comfortably below the 16 °C economiser changeover",
      "Economiser dampers are sitting at their 20% minimum position",
      "Chiller COP ≈ 3.5; electricity ≈ £0.20/kWh",
      "~1,500 h/yr have outdoor air cool enough for free cooling",
    ],
    readings: [
      { label: "Outdoor air temp", value: "12", unit: "°C", note: "below changeover — free cooling available" },
      { label: "Cooling load", value: "80", unit: "kW" },
      { label: "Chiller COP", value: "3.5", unit: "" },
      { label: "Economiser damper", value: "20", unit: "%", note: "stuck at minimum" },
      { label: "Free-cooling hours", value: "1,500", unit: "h/yr" },
    ],
    refTables: ["cop", "costs"],
    calcParts: [
      {
        id: "chiller-kw",
        prompt: "What is the chiller drawing electrically to meet this load?",
        unit: "kW",
        answer: 22.9,
        tol: 0.05,
        tolType: "rel",
        hints: [
          "Electrical input = cooling load ÷ COP.",
          "80 kW ÷ 3.5.",
        ],
        worked: "80 ÷ 3.5 ≈ 22.9 kW of electricity.",
      },
      {
        id: "kwh-avoidable",
        prompt: "How much chiller energy per year could free cooling avoid?",
        unit: "kWh/yr",
        answer: 34300,
        tol: 0.06,
        tolType: "rel",
        hints: [
          "If free cooling met the load during the cool hours, the chiller would be off. Energy = electrical input × free-cooling hours.",
          "22.9 kW × 1,500 h.",
        ],
        worked: "22.9 kW × 1,500 h ≈ 34,300 kWh/yr.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 6860,
        tol: 0.08,
        tolType: "rel",
        hints: ["Energy × electricity price.", "34,300 kWh × £0.20."],
        worked: "34,300 × £0.20 ≈ £6,860/yr (for only the fan power instead).",
      },
    ],
    candidateCauseIds: ["economiser-disabled", "oa-unsuitable", "fouled-condenser", "no-static-reset"],
    correctCauseIds: ["economiser-disabled"],
    candidateActionIds: ["enable-economiser", "enthalpy-control", "add-cooling", "clean-filters"],
    correctActionIds: ["enable-economiser"],
    improvementActionIds: ["enthalpy-control"],
    debrief:
      "Outdoor air at 12 °C is well below the changeover, so free cooling is available — yet the dampers are stuck at the 20% minimum and the chiller is doing work the weather would do for nothing. That's ~£6,900/yr on this AHU alone. Repair/enable the economiser. Enthalpy-based changeover is a sensible upgrade so humid-but-cool days are handled correctly too.",
    faultChain: [
      "Outdoor air 12 °C — free cooling available",
      "Economiser dampers stuck at 20% minimum → no free cooling",
      "Chiller runs unnecessarily (~22.9 kW) for ~1,500 h/yr",
      "Fix: repair / enable the economiser",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "over-ventilation",
    title: "Case 2 — Breathing too hard",
    tag: "Ventilation",
    brief:
      "An office AHU brings in fresh air for its full design occupancy around the clock, but the floor is typically a third full. All that extra outside air has to be heated in winter. Quantify the waste.",
    knownFacts: [
      "Design occupancy 100; typical occupancy 30",
      "Fresh-air rate 10 L/s per person; CO₂ sits well below 1,000 ppm",
      "Winter: outside air heated from 0 °C to 20 °C; ~2,500 heating hours",
      "Gas heating at £0.045/kWh, boiler 80% efficient",
    ],
    readings: [
      { label: "Design occupancy", value: "100", unit: "people" },
      { label: "Typical occupancy", value: "30", unit: "people" },
      { label: "Fresh-air rate", value: "10", unit: "L/s·person" },
      { label: "Heating ΔT", value: "20", unit: "K", note: "0 → 20 °C" },
      { label: "CO₂ level", value: "650", unit: "ppm", note: "well below 1,000 — not under-ventilated" },
      { label: "Heating hours", value: "2,500", unit: "h/yr" },
    ],
    refTables: ["air", "ventilation", "costs"],
    calcParts: [
      {
        id: "excess-oa",
        prompt: "How much excess fresh air is being supplied?",
        unit: "m³/s",
        answer: 0.7,
        tol: 0.05,
        tolType: "abs",
        hints: [
          "Excess people × rate. Convert L/s to m³/s (÷1,000).",
          "(100 − 30) people × 10 L/s = 700 L/s.",
        ],
        worked: "(100 − 30) × 10 = 700 L/s = 0.70 m³/s of excess outside air.",
      },
      {
        id: "extra-load",
        prompt: "What extra heating load does that excess air impose?",
        unit: "kW",
        answer: 16.8,
        tol: 0.05,
        tolType: "rel",
        hints: [
          "Air-side heat: Q = 1.2 × flow (m³/s) × ΔT (K).",
          "1.2 × 0.70 × 20.",
        ],
        worked: "1.2 × 0.70 × 20 = 16.8 kW.",
      },
      {
        id: "cost",
        prompt: "What does heating that excess air cost per year?",
        unit: "£/yr",
        answer: 2360,
        tol: 0.08,
        tolType: "rel",
        hints: ["kW × hours ÷ boiler efficiency × gas price.", "16.8 × 2,500 ÷ 0.8 × £0.045."],
        worked: "16.8 × 2,500 ÷ 0.8 × £0.045 ≈ £2,360/yr (plus a summer cooling penalty).",
      },
    ],
    candidateCauseIds: ["no-dcv", "min-oa-correct", "sat-too-low", "sensor-drift"],
    correctCauseIds: ["no-dcv"],
    candidateActionIds: ["reset-min-oa", "fit-dcv", "add-heating", "clean-filters"],
    correctActionIds: ["reset-min-oa"],
    improvementActionIds: ["fit-dcv"],
    debrief:
      "CO₂ at 650 ppm proves the space isn't under-ventilated — it's massively over-ventilated, conditioning fresh air for 100 people when 30 are in. Reset the minimum fresh-air damper to match real occupancy as the immediate no-cost fix. Demand-controlled ventilation (CO₂-based) is the proper upgrade so fresh air tracks occupancy automatically.",
    faultChain: [
      "Fresh air set for 100 people; only 30 present (CO₂ 650 ppm)",
      "0.70 m³/s of excess outside air conditioned needlessly",
      "~16.8 kW extra heating → ~£2,360/yr (plus cooling season)",
      "Fix: reset minimum OA; fit demand-controlled ventilation",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "simultaneous-hc",
    title: "Case 3 — Heating and cooling at once",
    tag: "Controls",
    brief:
      "A zone's reheat coil is running with its valve well open — while the central AHU is actively cooling the supply air. The zone is comfortable, but you're paying to cool air and then re-heat it. Why?",
    knownFacts: [
      "Supply air leaves the AHU at 13 °C; the zone only needs ~18 °C",
      "Zone reheat valve is modulating normally at ~60% (not stuck)",
      "Zone airflow ≈ 0.5 m³/s; reheat raises it 13 → 20 °C",
      "Reheat is gas-fired (£0.045/kWh, 80% efficient); ~2,500 h/yr",
    ],
    readings: [
      { label: "Supply air temp", value: "13", unit: "°C", note: "fixed low — no reset" },
      { label: "Zone requirement", value: "~18", unit: "°C" },
      { label: "Reheat valve", value: "60", unit: "%", note: "modulating, not stuck" },
      { label: "Zone airflow", value: "0.5", unit: "m³/s" },
      { label: "Reheat ΔT", value: "7", unit: "K", note: "13 → 20 °C" },
    ],
    refTables: ["air", "costs"],
    calcParts: [
      {
        id: "reheat-kw",
        prompt: "How much reheat is this zone adding back?",
        unit: "kW",
        answer: 4.2,
        tol: 0.05,
        tolType: "rel",
        hints: ["Air-side heat: Q = 1.2 × flow × ΔT.", "1.2 × 0.5 × 7."],
        worked: "1.2 × 0.5 × 7 = 4.2 kW of reheat — fighting the central cooling.",
      },
      {
        id: "reheat-cost",
        prompt: "What does that reheat cost per year (heating side only)?",
        unit: "£/yr",
        answer: 590,
        tol: 0.1,
        tolType: "rel",
        hints: ["kW × hours ÷ boiler efficiency × gas price.", "4.2 × 2,500 ÷ 0.8 × £0.045."],
        worked: "4.2 × 2,500 ÷ 0.8 × £0.045 ≈ £590/yr — and the cooling to over-cool the air roughly doubles the true waste.",
      },
    ],
    candidateCauseIds: ["sat-too-low", "reheat-valve-failed", "deadband-tight", "fouled-condenser"],
    correctCauseIds: ["sat-too-low"],
    candidateActionIds: ["raise-sat", "widen-deadband", "repair-reheat-valve", "add-cooling"],
    correctActionIds: ["raise-sat"],
    improvementActionIds: [],
    debrief:
      "The reheat valve is doing its job — the fault is upstream. The supply air is held at a fixed 13 °C, far colder than this zone needs, so the terminal has to reheat it. That's classic simultaneous heating and cooling. Resetting the supply air temperature up (toward the warmest the zones can tolerate) removes the reheat and the over-cooling together. Replacing the valve would fix nothing — it isn't failed.",
    faultChain: [
      "Supply air fixed at 13 °C, colder than zones need",
      "Terminal reheats 13 → 20 °C (4.2 kW) — fighting the cooling",
      "Paying to cool then reheat the same air",
      "Fix: reset (raise) the supply air temperature",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "fan-static",
    title: "Case 4 — The fan that never eases off",
    tag: "Fan power",
    brief:
      "A VAV air-handling unit runs its supply fan flat out all day, yet most of the VAV boxes are throttled well down. The duct static-pressure setpoint has never been reset. Use the affinity laws to size the prize.",
    knownFacts: [
      "Supply fan has a VSD but holds 100% speed on a fixed static setpoint",
      "VAV boxes average ~40% open — lots of throttling, so flow could drop",
      "Filters were changed last week (clean)",
      "Estimated the fan could meet demand at ~80% speed; ~4,000 h/yr; £0.20/kWh",
    ],
    readings: [
      { label: "Fan power now", value: "30", unit: "kW", note: "100% speed, fixed static" },
      { label: "Avg VAV box position", value: "40", unit: "%", note: "throttling — flow could reduce" },
      { label: "Achievable speed", value: "80", unit: "%" },
      { label: "Run hours", value: "4,000", unit: "h/yr" },
    ],
    refTables: ["affinity", "costs"],
    calcParts: [
      {
        id: "power-80",
        prompt: "What would the fan draw at 80% speed?",
        unit: "kW",
        answer: 15.4,
        tol: 0.05,
        tolType: "rel",
        hints: [
          "Fan power scales with the cube of speed: power = power_now × (speed fraction)³.",
          "30 × 0.80³ = 30 × 0.512.",
        ],
        worked: "30 × 0.8³ = 30 × 0.512 ≈ 15.4 kW.",
      },
      {
        id: "power-saved",
        prompt: "How much power would that save?",
        unit: "kW",
        answer: 14.6,
        tol: 0.06,
        tolType: "rel",
        hints: ["Power now − power at 80%.", "30 − 15.4."],
        worked: "30 − 15.4 ≈ 14.6 kW saved.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 11700,
        tol: 0.06,
        tolType: "rel",
        hints: ["kW × hours × price.", "14.6 × 4,000 × £0.20."],
        worked: "14.6 × 4,000 × £0.20 ≈ £11,700/yr — from a controls change, no new plant.",
      },
    ],
    candidateCauseIds: ["no-static-reset", "fan-oversized", "dirty-filters", "fouled-condenser"],
    correctCauseIds: ["no-static-reset"],
    candidateActionIds: ["static-reset", "trim-fan", "clean-filters", "replace-chiller"],
    correctActionIds: ["static-reset"],
    improvementActionIds: ["trim-fan"],
    debrief:
      "The boxes are throttled and the filters are clean, so the fan is simply holding more static pressure than the system needs. Duct static-pressure reset (letting the most-open box set the static) lets the fan slow down — and because power follows the cube of speed, an 80% speed is barely half the power: ~£11,700/yr for a controls change. Trimming the fan is a worthwhile permanent improvement on top.",
    faultChain: [
      "Fan holds a fixed high static; VAV boxes throttle to ~40%",
      "No static reset → fan never slows",
      "At 80% speed, cube law → ~half the power (~14.6 kW saved)",
      "Fix: implement duct static-pressure reset",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "pump-throttled",
    title: "Case 5 — Pumping against a valve",
    tag: "Pump power",
    brief:
      "A constant-speed chilled-water pump runs at full power while a balancing valve is throttled down to hold the flow the system actually needs. You're burning electricity to push water through a half-shut valve. Size the VSD opportunity.",
    knownFacts: [
      "Pump is fixed-speed at 15 kW; a balancing valve is throttled to suit",
      "The system needs about 70% flow for most of the year",
      "A VSD would let the pump run at ~70% speed instead of throttling",
      "~5,000 h/yr; electricity £0.20/kWh",
    ],
    readings: [
      { label: "Pump power now", value: "15", unit: "kW", note: "constant speed, throttled" },
      { label: "Flow needed", value: "70", unit: "%" },
      { label: "Achievable speed (VSD)", value: "70", unit: "%" },
      { label: "Run hours", value: "5,000", unit: "h/yr" },
    ],
    refTables: ["affinity", "costs"],
    calcParts: [
      {
        id: "power-70",
        prompt: "What would the pump draw at 70% speed with a VSD?",
        unit: "kW",
        answer: 5.1,
        tol: 0.06,
        tolType: "rel",
        hints: ["Pump power scales with the cube of speed.", "15 × 0.70³ = 15 × 0.343."],
        worked: "15 × 0.7³ = 15 × 0.343 ≈ 5.1 kW.",
      },
      {
        id: "saving",
        prompt: "What annual saving would the VSD give?",
        unit: "£/yr",
        answer: 9900,
        tol: 0.07,
        tolType: "rel",
        hints: ["(power now − power at 70%) × hours × price.", "(15 − 5.1) × 5,000 × £0.20."],
        worked: "(15 − 5.1) × 5,000 × £0.20 ≈ £9,900/yr.",
      },
    ],
    candidateCauseIds: ["pump-throttled", "no-static-reset", "fouled-condenser", "oa-unsuitable"],
    correctCauseIds: ["pump-throttled"],
    candidateActionIds: ["fit-vsd", "open-balancing", "add-cooling", "clean-filters"],
    correctActionIds: ["fit-vsd"],
    improvementActionIds: [],
    debrief:
      "Throttling a balancing valve on a constant-speed pump dumps the surplus head as wasted energy. Fitting a VSD and letting the pump slow to ~70% speed cuts power to about a third (cube law) — ~£9,900/yr. Simply opening the balancing valve without a VSD just raises the flow and the power; it isn't the fix.",
    faultChain: [
      "Constant-speed pump + throttled balancing valve = wasted head",
      "System only needs ~70% flow",
      "VSD at 70% speed → ~1/3 the power (cube law)",
      "Fix: fit a variable-speed drive",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "chiller-cop",
    title: "Case 6 — The thirsty chiller",
    tag: "Chiller",
    brief:
      "A chiller is using far more electricity than its nameplate suggests it should. The condenser approach temperature is high and the chilled-water setpoint has been left at its lowest value. Work out how far the COP has slipped and what restoring it is worth.",
    knownFacts: [
      "Cooling duty 300 kW; measured electrical input 100 kW",
      "Design COP is 5.0; condenser approach is running well above design",
      "Chilled-water setpoint fixed at 6 °C even at part load",
      "~3,000 cooling h/yr; electricity £0.20/kWh",
    ],
    readings: [
      { label: "Cooling duty", value: "300", unit: "kW" },
      { label: "Electrical input", value: "100", unit: "kW" },
      { label: "Design COP", value: "5.0", unit: "" },
      { label: "Condenser approach", value: "high", note: "fouling signature" },
      { label: "CHW setpoint", value: "6", unit: "°C", note: "fixed, no reset" },
      { label: "Cooling hours", value: "3,000", unit: "h/yr" },
    ],
    refTables: ["cop", "costs"],
    calcParts: [
      {
        id: "cop-now",
        prompt: "What is the chiller's current COP?",
        unit: "(ratio)",
        answer: 3.0,
        tol: 0.2,
        tolType: "abs",
        hints: ["COP = cooling output ÷ electrical input.", "300 ÷ 100."],
        worked: "300 ÷ 100 = 3.0 — well down on the design 5.0.",
      },
      {
        id: "elec-design",
        prompt: "What would it draw at the design COP of 5.0?",
        unit: "kW",
        answer: 60,
        tol: 3,
        tolType: "abs",
        hints: ["Electrical input = cooling ÷ COP.", "300 ÷ 5.0."],
        worked: "300 ÷ 5.0 = 60 kW (vs 100 kW now).",
      },
      {
        id: "saving",
        prompt: "What is restoring the COP worth per year?",
        unit: "£/yr",
        answer: 24000,
        tol: 0.06,
        tolType: "rel",
        hints: ["(electrical now − electrical at design) × hours × price.", "(100 − 60) × 3,000 × £0.20."],
        worked: "(100 − 60) × 3,000 × £0.20 = £24,000/yr.",
      },
    ],
    candidateCauseIds: ["fouled-condenser", "low-refrigerant", "no-chw-reset", "no-static-reset"],
    correctCauseIds: ["fouled-condenser"],
    candidateActionIds: ["clean-condenser", "chw-reset", "recharge-refrigerant", "replace-chiller"],
    correctActionIds: ["clean-condenser"],
    improvementActionIds: ["chw-reset"],
    debrief:
      "A COP of 3.0 against a design 5.0 is a third more electricity for the same cooling. The high condenser approach is the tell — a fouled/scaled condenser forces a higher condensing temperature and wrecks efficiency. Clean it to restore the approach (~£24k/yr here). Chilled-water reset — letting the setpoint rise at part load — is a strong complementary improvement. The charge is fine, so recharging would achieve nothing.",
    faultChain: [
      "COP measured 3.0 vs design 5.0 — a third more power",
      "High condenser approach → fouled condenser, high lift",
      "100 kW drawn vs 60 kW at design",
      "Fix: clean the condenser; add chilled-water reset",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "no-setback",
    title: "Case 7 — Running round the clock",
    tag: "Scheduling",
    brief:
      "An office air-handling system runs 24/7, but the building is only occupied during the working week. There's no time schedule or night setback. Quantify the cost of conditioning an empty building.",
    knownFacts: [
      "HVAC plant (fans, pumps, conditioning) averages ~25 kW",
      "Runs 168 h/week; building occupied ~60 h/week",
      "No process or out-of-hours need for conditioning",
      "~50 operating weeks/yr; electricity £0.20/kWh",
    ],
    readings: [
      { label: "Average HVAC power", value: "25", unit: "kW" },
      { label: "Hours run per week", value: "168", unit: "h", note: "24/7" },
      { label: "Hours occupied per week", value: "60", unit: "h" },
      { label: "Operating weeks", value: "50", unit: "wk/yr" },
    ],
    refTables: ["costs"],
    calcParts: [
      {
        id: "unoccupied",
        prompt: "How many hours each week is the plant running while unoccupied?",
        unit: "h/wk",
        answer: 108,
        tol: 2,
        tolType: "abs",
        hints: ["Hours run − hours occupied.", "168 − 60."],
        worked: "168 − 60 = 108 unoccupied hours per week.",
      },
      {
        id: "wasted-kwh",
        prompt: "How much energy is wasted running unoccupied each year?",
        unit: "kWh/yr",
        answer: 135000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Power × unoccupied hours/week × weeks.", "25 × 108 × 50."],
        worked: "25 kW × 108 h × 50 wk = 135,000 kWh/yr.",
      },
      {
        id: "cost",
        prompt: "What does that cost per year?",
        unit: "£/yr",
        answer: 27000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Energy × price.", "135,000 × £0.20."],
        worked: "135,000 × £0.20 = £27,000/yr (before any heating fuel).",
      },
    ],
    candidateCauseIds: ["no-schedule", "override-on", "fouled-condenser", "no-dcv"],
    correctCauseIds: ["no-schedule"],
    candidateActionIds: ["set-schedule", "optimum-start", "add-heating", "replace-chiller"],
    correctActionIds: ["set-schedule"],
    improvementActionIds: ["optimum-start"],
    debrief:
      "Conditioning an empty building for 108 hours a week is ~£27k/yr of pure waste. A time schedule with night setback is the classic no-cost win — the plant only runs when the building is occupied. Optimum start/stop is a smart upgrade that learns how early to start so comfort is met exactly at occupancy, not before.",
    faultChain: [
      "Plant runs 168 h/wk; building occupied only 60 h/wk",
      "108 unoccupied hours/week conditioned needlessly",
      "135,000 kWh/yr → ~£27,000/yr",
      "Fix: set a schedule + night setback; add optimum start",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "sensor-drift",
    title: "Case 8 — The lying thermostat",
    tag: "Sensors / controls",
    brief:
      "A heated space feels too warm and is using more gas than its neighbours. The space sensor reads 19 °C and calls for more heat, but a calibrated meter on the wall reads 21 °C. Work out what the drift is costing.",
    knownFacts: [
      "Space sensor reads 19 °C; calibrated reference reads 21 °C",
      "Heating setpoint 21 °C — so the space is actually driven to ~23 °C",
      "Space heat loss ≈ 2 kW per °C of indoor temperature",
      "~2,500 heating h/yr; gas £0.045/kWh, boiler 80% efficient",
    ],
    readings: [
      { label: "Sensor reading", value: "19", unit: "°C", note: "drifted low" },
      { label: "Calibrated reference", value: "21", unit: "°C" },
      { label: "Heating setpoint", value: "21", unit: "°C" },
      { label: "Heat loss coefficient", value: "2", unit: "kW/°C" },
      { label: "Heating hours", value: "2,500", unit: "h/yr" },
    ],
    refTables: ["costs"],
    calcParts: [
      {
        id: "overshoot",
        prompt: "By how much is the space being overheated?",
        unit: "°C",
        answer: 2,
        tol: 0.5,
        tolType: "abs",
        hints: [
          "The sensor reads low, so the system overshoots by the calibration error. Overshoot = reference − sensor.",
          "21 − 19.",
        ],
        worked: "The sensor reads 2 °C low, so it heats 2 °C past target (to ~23 °C).",
      },
      {
        id: "extra-kw",
        prompt: "What extra heating load does that 2 °C overshoot impose?",
        unit: "kW",
        answer: 4,
        tol: 0.5,
        tolType: "abs",
        hints: ["Extra load = heat-loss coefficient × extra °C.", "2 kW/°C × 2 °C."],
        worked: "2 kW/°C × 2 °C = 4 kW of extra heating.",
      },
      {
        id: "cost",
        prompt: "What does that cost per year?",
        unit: "£/yr",
        answer: 560,
        tol: 0.1,
        tolType: "rel",
        hints: ["kW × hours ÷ boiler efficiency × gas price.", "4 × 2,500 ÷ 0.8 × £0.045."],
        worked: "4 × 2,500 ÷ 0.8 × £0.045 ≈ £560/yr — from a 2 °C sensor error.",
      },
    ],
    candidateCauseIds: ["sensor-drift", "undersized-heating", "no-schedule", "fouled-condenser"],
    correctCauseIds: ["sensor-drift"],
    candidateActionIds: ["recalibrate-sensor", "raise-sat", "add-heating", "replace-chiller"],
    correctActionIds: ["recalibrate-sensor"],
    improvementActionIds: [],
    debrief:
      "The calibrated reference is the decisive clue: the control sensor reads 2 °C low, so the system drives the room to ~23 °C to satisfy a 21 °C setpoint. A trivial-looking 2 °C drift costs ~£560/yr here and makes the space uncomfortable. Recalibrate or replace the sensor — don't 'fix' it by dropping the setpoint, which just hides a fault that will drift again.",
    faultChain: [
      "Sensor reads 19 °C vs calibrated 21 °C — 2 °C low",
      "System overheats the space to ~23 °C to satisfy setpoint",
      "Extra ~4 kW heating → ~£560/yr, plus discomfort",
      "Fix: recalibrate / replace the sensor",
    ],
  },
];

export function getHvacCase(id: string): HvacCase | undefined {
  return HVAC_CASES.find((c) => c.id === id);
}
