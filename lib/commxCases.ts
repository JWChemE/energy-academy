/**
 * Commissioning diagnostic cases — flow balancing, a chiller performance
 * shortfall, a control sequence defect, an uncalibrated sensor, default
 * setpoints, unverified duct pressure, post-handover drift, and missing handover
 * documentation. A mix of quantify, reason and judgement. Numbers consistent with
 * lib/commxTables.ts. Built on the shared diagnostics core.
 *
 * The discipline: commissioning is the bridge between design intent and actual
 * performance. The acceptance test catches the defect before handover — and the
 * cardinal sin is signing off a system that doesn't meet design, because fixing
 * it later costs ten times as much.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const COMMX_CAUSES: CauseDef[] = [
  { id: "unbalanced-flow", label: "System not flow-balanced — zones starved / over-served" },
  { id: "chiller-underperforms", label: "Equipment below design capacity (fouled / charge / weak)" },
  { id: "sequence-defect", label: "Control sequence defect (e.g. heating active in cooling)" },
  { id: "uncalibrated-sensor", label: "Sensor not calibrated at handover" },
  { id: "default-setpoints", label: "Setpoints left at default, not set to design" },
  { id: "excess-duct-pressure", label: "Duct static pressure not verified — fan over-running" },
  { id: "commissioning-drift", label: "Performance drifted post-handover (needs re-commissioning)" },
  { id: "poor-handover", label: "No handover documentation / operator training" },
  { id: "design-flaw", label: "Genuine design error (not a commissioning fault)" },
  { id: "commissioning-passed", label: "System meets design — accept" },
];

export const COMMX_ACTIONS: ActionDef[] = [
  { id: "calibrate-sensor", label: "Calibrate the sensor against a reference", tier: 1 },
  { id: "set-to-design", label: "Set the setpoints to design and document as-built", tier: 1 },
  { id: "reset-static-pressure", label: "Reset the duct static-pressure setpoint to design", tier: 1 },
  { id: "document-and-train", label: "Produce handover documentation and train the operator", tier: 1 },
  { id: "fix-sequence-retest", label: "Correct the control sequence and retest", tier: 2 },
  { id: "balance-system", label: "Balance the flows to design", tier: 2 },
  { id: "remedy-and-retest", label: "Remedy the defect (clean / charge / repair) and retest", tier: 2 },
  { id: "recommission", label: "Re-commission to restore performance", tier: 2 },
  { id: "accept-handover", label: "Accept and sign off the handover", tier: 1 },
  { id: "raise-output", label: "Run it harder to compensate", tier: 1 },
  { id: "replace-equipment", label: "Replace the equipment", tier: 3 },
  { id: "defer", label: "Snag it later / fix after handover", tier: 1 },
];

export type CommxRefTable = "acceptance" | "performance" | "sensors" | "drift" | "prices";

export interface CommxCase extends DiagnosticCase {
  refTables: CommxRefTable[];
}

export const COMMX_CASES: CommxCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "flow-balancing",
    title: "Case 1 — The zone at the end of the run",
    tag: "Flow balancing",
    brief:
      "At commissioning of a new heating system, the far zone never warms up while the plant-room zones cook. You measure the flows: the far zone gets only 1.2 L/s against a 2.0 L/s design, while a near zone hogs 3.0 L/s. The system was never balanced — low-resistance zones are stealing the flow.",
    knownFacts: [
      "Far zone: design flow 2.0 L/s, measured 1.2 L/s",
      "Near zone: design flow 2.0 L/s, measured 3.0 L/s",
      "Acceptance criterion: each zone within ±10% of design flow",
      "Pump draws 10 kW; balancing + a slower pump would save ~20%; ~6,000 h/yr",
    ],
    readings: [
      { label: "Far zone flow", value: "1.2", unit: "L/s", note: "design 2.0 — starved" },
      { label: "Near zone flow", value: "3.0", unit: "L/s", note: "design 2.0 — over-served" },
      { label: "Pump power", value: "10", unit: "kW" },
      { label: "Balancing", value: "none", note: "never done" },
    ],
    refTables: ["acceptance", "prices"],
    calcParts: [
      {
        id: "starved-pct",
        prompt: "What percentage of design flow does the far zone get?",
        unit: "%",
        answer: 60,
        tol: 3,
        tolType: "abs",
        hints: ["Measured ÷ design × 100.", "1.2 ÷ 2.0 × 100."],
        worked: "1.2 ÷ 2.0 = 60% — far outside the ±10% acceptance band.",
      },
      {
        id: "over-pct",
        prompt: "What percentage of design flow does the near zone get?",
        unit: "%",
        answer: 150,
        tol: 5,
        tolType: "abs",
        hints: ["Measured ÷ design × 100.", "3.0 ÷ 2.0 × 100."],
        worked: "3.0 ÷ 2.0 = 150% — hogging the flow the far zone needs.",
      },
      {
        id: "pump-saving",
        prompt: "What would balancing (and a slower pump) save per year (~20% of pump energy)?",
        unit: "£/yr",
        answer: 2400,
        tol: 0.06,
        tolType: "rel",
        hints: ["0.20 × pump kW × hours × price.", "0.20 × 10 × 6,000 × 0.20."],
        worked: "0.20 × 10 kW × 6,000 h × £0.20 = £2,400/yr — plus the comfort the far zone finally gets.",
      },
    ],
    candidateCauseIds: ["commissioning-passed", "unbalanced-flow", "design-flaw", "chiller-underperforms"],
    correctCauseIds: ["unbalanced-flow"],
    candidateActionIds: ["accept-handover", "balance-system", "replace-equipment", "raise-output"],
    correctActionIds: ["balance-system"],
    improvementActionIds: [],
    debrief:
      "Without balancing, low-resistance zones starve the rest — here the far zone gets 60% of design while a near one takes 150%. The fix is flow balancing: adjust the regulating valves so every terminal gets its design flow, then the pump can run slower (saving ~£2,400/yr) and every zone is comfortable. This is core commissioning — never accept handover with zones this far out of balance.",
    faultChain: [
      "Far zone 1.2 L/s (60%), near zone 3.0 L/s (150%) of design",
      "Low-resistance zones stealing the flow",
      "Balancing fixes comfort and lets the pump slow (~£2,400/yr)",
      "Fix: balance the flows to design",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "chiller-performance",
    title: "Case 2 — Short of capacity",
    tag: "Performance test",
    brief:
      "A new chiller is rated at 100 kW cooling. At the commissioning performance test you run it at full load and measure the chilled-water flow and temperatures. Work out the capacity it actually delivers, and whether it passes.",
    knownFacts: [
      "Design cooling capacity 100 kW",
      "Measured: chilled-water flow 4 kg/s, supply 6 °C, return 11 °C",
      "Capacity = flow × 4.18 × ΔT",
      "Acceptance: within ±10% of design",
    ],
    readings: [
      { label: "Design capacity", value: "100", unit: "kW" },
      { label: "Flow", value: "4", unit: "kg/s" },
      { label: "Supply / return", value: "6 / 11", unit: "°C" },
      { label: "Acceptance band", value: "±10", unit: "%" },
    ],
    refTables: ["performance", "prices"],
    calcParts: [
      {
        id: "capacity",
        prompt: "What cooling capacity is the chiller actually delivering?",
        unit: "kW",
        answer: 83.6,
        tol: 0.03,
        tolType: "rel",
        hints: ["flow × 4.18 × ΔT. ΔT = 11 − 6.", "4 × 4.18 × 5."],
        worked: "4 × 4.18 × 5 = 83.6 kW.",
      },
      {
        id: "shortfall",
        prompt: "How far below design is that?",
        unit: "kW",
        answer: 16.4,
        tol: 0.1,
        tolType: "abs",
        hints: ["Design − measured.", "100 − 83.6."],
        worked: "100 − 83.6 = 16.4 kW short.",
      },
      {
        id: "deviation",
        prompt: "What is the deviation from design as a percentage?",
        unit: "%",
        answer: 16.4,
        tol: 1,
        tolType: "abs",
        hints: ["Shortfall ÷ design × 100.", "16.4 ÷ 100 × 100."],
        worked: "16.4% low — outside the ±10% band, so it fails. Likely fouled, under-charged, or a weak compressor.",
      },
    ],
    candidateCauseIds: ["design-flaw", "chiller-underperforms", "commissioning-passed", "unbalanced-flow"],
    correctCauseIds: ["chiller-underperforms"],
    candidateActionIds: ["remedy-and-retest", "replace-equipment", "accept-handover", "raise-output"],
    correctActionIds: ["remedy-and-retest"],
    improvementActionIds: [],
    debrief:
      "The performance test is what turns 'it runs' into 'it delivers'. At 83.6 kW the chiller is 16.4% below design — outside the ±10% acceptance band — so it fails, and the cause needs finding before sign-off: fouling, low refrigerant charge, or a weak compressor. Remedy it and re-test; don't accept a chiller short of its rating, and don't replace it before you know why it's underperforming. A 16% shortfall on day one only gets worse.",
    faultChain: [
      "Test: 4 kg/s × 4.18 × 5 °C = 83.6 kW vs 100 design",
      "16.4 kW (16.4%) short — outside ±10% acceptance",
      "Fouled / under-charged / weak compressor",
      "Fix: remedy the cause and re-test (don't sign off)",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "sequence-defect",
    title: "Case 3 — Cooling calls, heating opens",
    tag: "Sequence test",
    brief:
      "Walking the control sequences at commissioning, you force a zone warm to call for cooling. Cooling starts correctly — but the BMS graphic shows the heating valve also driving open. A logic/wiring defect means heating isn't disabled in cooling mode. Caught now, it's a quick fix; missed, it bleeds money for years.",
    knownFacts: [
      "Sequence test: in cooling mode, the heating valve also opens (defect)",
      "If it went live: heating ~30 kW fighting ~30 kW of cooling, ~1,500 h/yr",
      "Cooling provided at COP 3; gas £0.06/kWh, electricity £0.20/kWh",
      "Fixing a defect at commissioning costs ~10× less than after handover",
    ],
    readings: [
      { label: "Mode tested", value: "cooling", note: "zone forced warm" },
      { label: "Heating valve", value: "open", note: "should be closed — sequence defect" },
      { label: "If live", value: "30 kW heat vs 30 kW cool", note: "~1,500 h/yr" },
      { label: "Cooling COP", value: "3", unit: "" },
    ],
    refTables: ["acceptance", "prices"],
    calcParts: [
      {
        id: "cooling-elec",
        prompt: "What electrical power would the 30 kW of cooling draw (COP 3)?",
        unit: "kW",
        answer: 10,
        tol: 0.5,
        tolType: "abs",
        hints: ["Cooling ÷ COP.", "30 ÷ 3."],
        worked: "30 ÷ 3 = 10 kW of compressor power.",
      },
      {
        id: "heat-waste",
        prompt: "What would the wasted heating cost per year if undetected?",
        unit: "£/yr",
        answer: 2700,
        tol: 0.05,
        tolType: "rel",
        hints: ["Heat × hours × gas price.", "30 × 1,500 × 0.06."],
        worked: "30 kW × 1,500 h × £0.06 = £2,700/yr of heating cancelled by the cooling.",
      },
      {
        id: "cool-waste",
        prompt: "And the wasted cooling electricity?",
        unit: "£/yr",
        answer: 3000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Cooling kW × hours × electricity price.", "10 × 1,500 × 0.20."],
        worked: "10 kW × 1,500 h × £0.20 = £3,000/yr — ~£5,700/yr avoided by catching it now.",
      },
    ],
    candidateCauseIds: ["design-flaw", "default-setpoints", "commissioning-passed", "sequence-defect"],
    correctCauseIds: ["sequence-defect"],
    candidateActionIds: ["fix-sequence-retest", "defer", "raise-output", "accept-handover"],
    correctActionIds: ["fix-sequence-retest"],
    improvementActionIds: [],
    debrief:
      "Stepping through every control mode is exactly what commissioning is for: 'it runs' isn't 'it runs correctly'. This sequence defect — heating not disabled in cooling — would quietly cost ~£5,700/yr forever, and nobody would complain because the room stays comfortable. Correct the logic and re-test now, while it's a software change; snagging it after handover costs ten times as much and runs up the bills in between.",
    faultChain: [
      "Sequence test: heating valve opens in cooling mode",
      "If live: £2,700 wasted heat + £3,000 wasted cooling ≈ £5,700/yr",
      "Invisible (room stays comfortable), so it would persist",
      "Fix: correct the control sequence and re-test",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "uncalibrated-sensor",
    title: "Case 4 — Two degrees out on day one",
    tag: "Sensor verification",
    brief:
      "Part of commissioning is checking every sensor against a reference. The main heating supply sensor reads 2 °C high compared with a calibrated thermometer. Accept it, and the control runs 2 °C off from day one. Quantify what signing off an uncalibrated sensor would cost.",
    knownFacts: [
      "Supply sensor reads 2 °C high vs the reference",
      "So the control would run the system 2 °C off",
      "~3% extra heating per °C of error",
      "Annual heating ~350,000 kWh; gas £0.06/kWh",
    ],
    readings: [
      { label: "Sensor error", value: "+2", unit: "°C", note: "vs calibrated reference" },
      { label: "Control offset", value: "2", unit: "°C" },
      { label: "Energy per °C", value: "3", unit: "%" },
      { label: "Annual heating", value: "350,000", unit: "kWh" },
    ],
    refTables: ["sensors", "prices"],
    calcParts: [
      {
        id: "offset",
        prompt: "By how many degrees would the control be off?",
        unit: "°C",
        answer: 2,
        tol: 0.5,
        tolType: "abs",
        hints: ["The sensor error directly offsets the control.", "2 °C."],
        worked: "A 2 °C sensor error makes the control run 2 °C off target.",
      },
      {
        id: "extra-pct",
        prompt: "What extra heating energy does that cause (~3% per °C)?",
        unit: "%",
        answer: 6,
        tol: 1,
        tolType: "abs",
        hints: ["°C × 3% per °C.", "2 × 3%."],
        worked: "2 × 3% = 6% extra heating.",
      },
      {
        id: "cost",
        prompt: "What would that cost per year if signed off uncalibrated?",
        unit: "£/yr",
        answer: 1260,
        tol: 0.06,
        tolType: "rel",
        hints: ["Extra % × annual energy × gas price.", "0.06 × 350,000 × 0.06."],
        worked: "0.06 × 350,000 × £0.06 = £1,260/yr — for the want of a calibration at handover.",
      },
    ],
    candidateCauseIds: ["uncalibrated-sensor", "default-setpoints", "design-flaw", "commissioning-passed"],
    correctCauseIds: ["uncalibrated-sensor"],
    candidateActionIds: ["calibrate-sensor", "accept-handover", "raise-output", "replace-equipment"],
    correctActionIds: ["calibrate-sensor"],
    improvementActionIds: [],
    debrief:
      "'Installed' is not 'calibrated'. A 2 °C sensor error baked in at handover quietly costs ~£1,260/yr and is exactly the kind of thing commissioning exists to catch — sensors installed but never checked against a reference. Calibrate (or replace) it before sign-off; it costs minutes now and recurs forever if missed. Verify every sensor against a known reference as part of the acceptance test.",
    faultChain: [
      "Supply sensor reads 2 °C high vs reference",
      "Control would run 2 °C off → ~6% extra heating",
      "≈ £1,260/yr if signed off uncalibrated",
      "Fix: calibrate the sensor before handover",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "default-setpoints",
    title: "Case 5 — Still on the factory defaults",
    tag: "Setpoints",
    brief:
      "Checking the setpoints at handover, you find the cooling controllers still on their factory default of 21 °C, where the design called for 24 °C. The building would be cooled 3 °C harder than intended, year after year, unless it's set correctly now and recorded as-built.",
    knownFacts: [
      "Cooling setpoint left at the 21 °C default; design is 24 °C",
      "So the space would be over-cooled by 3 °C",
      "~3% extra cooling per °C of over-cooling",
      "Annual cooling ~200,000 kWh (electrical); electricity £0.20/kWh",
    ],
    readings: [
      { label: "Setpoint now", value: "21", unit: "°C", note: "factory default" },
      { label: "Design setpoint", value: "24", unit: "°C" },
      { label: "Over-cooling", value: "3", unit: "°C" },
      { label: "Annual cooling", value: "200,000", unit: "kWh" },
    ],
    refTables: ["sensors", "prices"],
    calcParts: [
      {
        id: "over-cool",
        prompt: "By how much is the space being over-cooled?",
        unit: "°C",
        answer: 3,
        tol: 0.5,
        tolType: "abs",
        hints: ["Design − default setpoint.", "24 − 21."],
        worked: "24 − 21 = 3 °C cooler than intended.",
      },
      {
        id: "extra-pct",
        prompt: "What extra cooling energy does that cause (~3% per °C)?",
        unit: "%",
        answer: 9,
        tol: 1,
        tolType: "abs",
        hints: ["°C × 3% per °C.", "3 × 3%."],
        worked: "3 × 3% = 9% extra cooling.",
      },
      {
        id: "cost",
        prompt: "What would that cost per year?",
        unit: "£/yr",
        answer: 3600,
        tol: 0.06,
        tolType: "rel",
        hints: ["Extra % × cooling energy × price.", "0.09 × 200,000 × 0.20."],
        worked: "0.09 × 200,000 × £0.20 = £3,600/yr — purely from a setpoint nobody changed.",
      },
    ],
    candidateCauseIds: ["default-setpoints", "uncalibrated-sensor", "design-flaw", "commissioning-passed"],
    correctCauseIds: ["default-setpoints"],
    candidateActionIds: ["set-to-design", "replace-equipment", "accept-handover", "raise-output"],
    correctActionIds: ["set-to-design"],
    improvementActionIds: [],
    debrief:
      "Setpoints left at the factory default — or cranked by an installer — are one of the commonest commissioning misses, and at 3 °C of over-cooling here it's ~£3,600/yr. Walk every zone, set each controller to the design value, and record them as-built so the next person knows what 'correct' looks like. It's the cheapest fix on the list and it's pure money saved.",
    faultChain: [
      "Cooling setpoint on the 21 °C default vs 24 °C design",
      "3 °C over-cooling → ~9% extra cooling",
      "≈ £3,600/yr from an unset setpoint",
      "Fix: set to design and document as-built",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "duct-pressure",
    title: "Case 6 — The fan running too hard",
    tag: "Pressure verification",
    brief:
      "An air-handling unit's duct static-pressure setpoint was never verified against design. It's holding 80 Pa where the design target is 30 Pa, so the variable-speed fan runs far faster than it needs to. From the fan curve, dropping to the design static lets it ease right off. Quantify the saving.",
    knownFacts: [
      "Duct static held at 80 Pa; design target ~30 Pa (range 25–40 Pa)",
      "Fan power at 80 Pa ≈ 12 kW; at 30 Pa ≈ 5 kW (from the fan curve)",
      "Runs ~6,000 h/yr; electricity £0.20/kWh",
      "Resetting the static setpoint is a controls change",
    ],
    readings: [
      { label: "Static now", value: "80", unit: "Pa", note: "target ~30" },
      { label: "Fan power at 80 Pa", value: "12", unit: "kW" },
      { label: "Fan power at 30 Pa", value: "5", unit: "kW" },
      { label: "Run hours", value: "6,000", unit: "h/yr" },
    ],
    refTables: ["performance", "prices"],
    calcParts: [
      {
        id: "static-over",
        prompt: "How far above the design target is the static pressure?",
        unit: "Pa",
        answer: 50,
        tol: 3,
        tolType: "abs",
        hints: ["Held − target.", "80 − 30."],
        worked: "80 − 30 = 50 Pa above target — the fan is fighting pressure it doesn't need.",
      },
      {
        id: "power-saved",
        prompt: "How much fan power does resetting the static recover?",
        unit: "kW",
        answer: 7,
        tol: 0.3,
        tolType: "abs",
        hints: ["Power at 80 Pa − power at 30 Pa.", "12 − 5."],
        worked: "12 − 5 = 7 kW (fan power falls steeply with static — the affinity laws).",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 8400,
        tol: 0.05,
        tolType: "rel",
        hints: ["Power saved × hours × price.", "7 × 6,000 × 0.20."],
        worked: "7 kW × 6,000 h × £0.20 = £8,400/yr — for resetting one setpoint.",
      },
    ],
    candidateCauseIds: ["commissioning-passed", "unbalanced-flow", "design-flaw", "excess-duct-pressure"],
    correctCauseIds: ["excess-duct-pressure"],
    candidateActionIds: ["accept-handover", "replace-equipment", "raise-output", "reset-static-pressure"],
    correctActionIds: ["reset-static-pressure"],
    improvementActionIds: [],
    debrief:
      "Verifying pressures against design is core HVAC commissioning, and it's where the fan-energy wins hide: a static setpoint left 50 Pa too high makes the VFD fan run far harder than needed. Because fan power falls steeply with pressure (the affinity laws), trimming to the 25–40 Pa target recovers ~7 kW, ~£8,400/yr, for a controls change. Don't accept handover until duct static is set and verified at design.",
    faultChain: [
      "Duct static held at 80 Pa vs ~30 Pa design",
      "Fan power 12 kW vs 5 kW at design static",
      "7 kW recovered ≈ £8,400/yr for a setpoint change",
      "Fix: reset the static-pressure setpoint to design",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "drift-recommission",
    title: "Case 7 — Two years on, creeping up",
    tag: "Re-commissioning",
    brief:
      "A building commissioned well two years ago is now using noticeably more energy, with no change in weather or occupancy to explain it. Sensors have drifted, setpoints have crept, filters and coils have fouled — the classic post-handover drift. A re-commission would claw it back. Quantify the case.",
    knownFacts: [
      "Annual heating ~800,000 kWh; consumption has crept up ~12% since handover",
      "The rise is drift (sensors, setpoints, fouling), not weather or occupancy",
      "Re-commissioning typically recovers most of it",
      "A quick re-commission costs ~£4,000; gas £0.06/kWh",
    ],
    readings: [
      { label: "Annual heating", value: "800,000", unit: "kWh" },
      { label: "Consumption rise", value: "12", unit: "%", note: "unexplained — drift" },
      { label: "Since handover", value: "2", unit: "years" },
      { label: "Re-commission cost", value: "4,000", unit: "£" },
    ],
    refTables: ["drift", "prices"],
    calcParts: [
      {
        id: "drift-kwh",
        prompt: "How much extra energy is the 12% drift?",
        unit: "kWh/yr",
        answer: 96000,
        tol: 0.04,
        tolType: "rel",
        hints: ["Drift % × annual energy.", "0.12 × 800,000."],
        worked: "0.12 × 800,000 = 96,000 kWh/yr of drift.",
      },
      {
        id: "cost",
        prompt: "What is that costing per year?",
        unit: "£/yr",
        answer: 5760,
        tol: 0.05,
        tolType: "rel",
        hints: ["Drift kWh × gas price.", "96,000 × 0.06."],
        worked: "96,000 × £0.06 = £5,760/yr.",
      },
      {
        id: "payback",
        prompt: "What is the payback on a £4,000 re-commission?",
        unit: "years",
        answer: 0.69,
        tol: 0.15,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "4,000 ÷ 5,760."],
        worked: "£4,000 ÷ £5,760 ≈ 0.69 years — usually paid back in the first year.",
      },
    ],
    candidateCauseIds: ["commissioning-passed", "design-flaw", "chiller-underperforms", "commissioning-drift"],
    correctCauseIds: ["commissioning-drift"],
    candidateActionIds: ["replace-equipment", "recommission", "raise-output", "accept-handover"],
    correctActionIds: ["recommission"],
    improvementActionIds: [],
    debrief:
      "Commissioning isn't a one-off — performance drifts. Sensors lose calibration, operators nudge setpoints, coils and filters foul, and consumption creeps up (12% here, ~£5,760/yr) with no change in weather or use. A quick re-commission — recalibrate sensors, verify setpoints, walk the sequences, check efficiencies — typically claws back 5–10% and pays for itself within the year. Better still, monitor continuously so drift is caught in weeks, not years.",
    faultChain: [
      "Energy up 12% in two years, unexplained → drift",
      "0.12 × 800,000 = 96,000 kWh ≈ £5,760/yr",
      "Re-commission (~£4,000) → ~0.7-yr payback",
      "Fix: re-commission (and monitor to prevent recurrence)",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "poor-handover",
    title: "Case 8 — Handed the keys, not the manual",
    tag: "Handover",
    brief:
      "A building was handed over with no operation manuals, no control documentation, and no operator training. The facilities team runs the BMS on guesswork — leaving plant on, never using the reset and schedules the system can do — and the energy shows it. The plant is fine; the handover wasn't.",
    knownFacts: [
      "No documentation or operator training was provided at handover",
      "Untrained operation is wasting ~8% of the building's energy",
      "Annual energy ~600,000 kWh; gas £0.06/kWh",
      "Documentation + a training session costs ~£5,000",
    ],
    readings: [
      { label: "Documentation", value: "none", note: "no manuals or control docs" },
      { label: "Operator training", value: "none" },
      { label: "Estimated waste", value: "8", unit: "%", note: "guesswork operation" },
      { label: "Annual energy", value: "600,000", unit: "kWh" },
    ],
    refTables: ["acceptance", "prices"],
    calcParts: [
      {
        id: "wasted-kwh",
        prompt: "How much energy is the poor handover wasting?",
        unit: "kWh/yr",
        answer: 48000,
        tol: 0.04,
        tolType: "rel",
        hints: ["Waste % × annual energy.", "0.08 × 600,000."],
        worked: "0.08 × 600,000 = 48,000 kWh/yr.",
      },
      {
        id: "cost",
        prompt: "What is that costing per year?",
        unit: "£/yr",
        answer: 2880,
        tol: 0.05,
        tolType: "rel",
        hints: ["Wasted kWh × gas price.", "48,000 × 0.06."],
        worked: "48,000 × £0.06 = £2,880/yr.",
      },
      {
        id: "payback",
        prompt: "What is the payback on £5,000 of documentation and training?",
        unit: "years",
        answer: 1.7,
        tol: 0.15,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "5,000 ÷ 2,880."],
        worked: "£5,000 ÷ £2,880 ≈ 1.7 years — and it keeps paying over the building's whole life.",
      },
    ],
    candidateCauseIds: ["design-flaw", "commissioning-passed", "poor-handover", "commissioning-drift"],
    correctCauseIds: ["poor-handover"],
    candidateActionIds: ["document-and-train", "replace-equipment", "defer", "accept-handover"],
    correctActionIds: ["document-and-train"],
    improvementActionIds: [],
    debrief:
      "Commissioning a building and then handing over no manuals, control documentation or training guarantees the performance won't last: operators run systems on guesswork, leaving plant on and never using the reset and schedules built into the BMS — ~£2,880/yr here. Produce concise operation manuals, control-sequence documentation and an alarm guide, and train the operator with a sign-off. It pays back in under two years and keeps paying over the building's 20–30 year life. A great commissioning job dies without it.",
    faultChain: [
      "No documentation or training at handover",
      "Guesswork operation wastes ~8% = 48,000 kWh ≈ £2,880/yr",
      "Docs + training (~£5,000) → ~1.7-yr payback",
      "Fix: produce documentation and train the operator",
    ],
  },
];

export function getCommxCase(id: string): CommxCase | undefined {
  return COMMX_CASES.find((c) => c.id === id);
}
