/**
 * Control-systems & BMS diagnostic cases — out-of-hours running, simultaneous
 * heating and cooling, setpoint reset, sensor drift, sensor placement, on-off vs
 * PID, valve authority, and load sequencing. A mix of quantify, reason and
 * judgement. Numbers consistent with lib/ctrlTables.ts. Built on the shared
 * diagnostics core.
 *
 * The discipline: good control keeps the building on setpoint without overshoot,
 * conditions it only when occupied, coordinates its loops so they don't fight,
 * and trusts only sensors that are well placed and calibrated. Most waste is a
 * schedule, a deadband, a reset curve or a sensor — not the plant.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const CTRL_CAUSES: CauseDef[] = [
  { id: "no-scheduling", label: "Plant conditioning an empty building (no schedule)" },
  { id: "simultaneous-heat-cool", label: "Heating and cooling fighting (no deadband)" },
  { id: "no-setpoint-reset", label: "Fixed setpoint — no weather compensation / reset" },
  { id: "sensor-drift", label: "Drifted / uncalibrated sensor mis-controlling the plant" },
  { id: "sensor-placement", label: "Sensor badly placed (sun / radiator / draught)" },
  { id: "on-off-control", label: "Crude on-off control oscillating and overshooting" },
  { id: "low-valve-authority", label: "Control valve undersized — low authority, hunting" },
  { id: "no-sequencing", label: "Multiple units all part-loaded (no sequencing)" },
  { id: "equipment-fault", label: "Plant mechanical fault" },
  { id: "controls-adequate", label: "Controls appropriate — no fault" },
];

export const CTRL_ACTIONS: ActionDef[] = [
  { id: "recalibrate-sensor", label: "Recalibrate the sensor", tier: 1 },
  { id: "relocate-sensor", label: "Relocate the sensor to a representative spot", tier: 1 },
  { id: "occupancy-schedule", label: "Add an occupancy / time schedule (BMS)", tier: 1 },
  { id: "add-deadband", label: "Add a heating/cooling deadband; coordinate the loops", tier: 1 },
  { id: "fit-setpoint-reset", label: "Fit setpoint reset / weather compensation", tier: 2 },
  { id: "fit-sequencing", label: "Fit load sequencing (BMS)", tier: 2 },
  { id: "fit-pid", label: "Replace on-off with PID control", tier: 2 },
  { id: "resize-valve", label: "Resize the control valve for proper authority", tier: 2 },
  { id: "replace-plant", label: "Replace the plant", tier: 3 },
  { id: "raise-output", label: "Run the plant harder to compensate", tier: 1 },
  { id: "add-portable-heaters", label: "Provide portable heaters / coolers", tier: 1 },
  { id: "ignore", label: "Leave it / occupants will adjust", tier: 1 },
];

export type CtrlRefTable = "modes" | "strategies" | "coordination" | "sensors" | "authority" | "prices";

export interface CtrlCase extends DiagnosticCase {
  refTables: CtrlRefTable[];
}

export const CTRL_CASES: CtrlCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "out-of-hours",
    title: "Case 1 — The trend that never sleeps",
    tag: "Scheduling",
    brief:
      "A BMS trend of the air-handling plant over four weeks shows it running flat-out around the clock — including overnight and at weekends, when the building is empty. There's no occupancy schedule; the plant just runs. Quantify the conditioning of an empty building.",
    knownFacts: [
      "HVAC plant draws ~60 kW when running",
      "It runs ~120 h/week; the building is occupied only ~50 h/week",
      "There is no time/occupancy schedule on the BMS",
      "Electricity £0.20/kWh",
    ],
    readings: [
      { label: "Plant power", value: "60", unit: "kW" },
      { label: "Hours running", value: "120", unit: "h/wk", note: "24/7" },
      { label: "Hours occupied", value: "50", unit: "h/wk" },
      { label: "Schedule", value: "none", note: "BMS trend shows continuous running" },
    ],
    refTables: ["strategies", "prices"],
    calcParts: [
      {
        id: "avoidable-hours",
        prompt: "How many avoidable running hours per week is that?",
        unit: "h/wk",
        answer: 70,
        tol: 3,
        tolType: "abs",
        hints: ["Hours running − hours occupied.", "120 − 50."],
        worked: "120 − 50 = 70 avoidable hours every week, conditioning an empty building.",
      },
      {
        id: "energy",
        prompt: "How much energy is that per year?",
        unit: "kWh/yr",
        answer: 218400,
        tol: 0.04,
        tolType: "rel",
        hints: ["Power × avoidable hours/week × 52.", "60 × 70 × 52."],
        worked: "60 kW × 70 h/wk × 52 = 218,400 kWh/yr.",
      },
      {
        id: "cost",
        prompt: "What is it costing per year?",
        unit: "£/yr",
        answer: 43680,
        tol: 0.05,
        tolType: "rel",
        hints: ["Energy × price.", "218,400 × 0.20."],
        worked: "218,400 × £0.20 ≈ £43,680/yr — pure waste, visible the moment you look at the trend.",
      },
    ],
    candidateCauseIds: ["equipment-fault", "no-scheduling", "no-setpoint-reset", "controls-adequate"],
    correctCauseIds: ["no-scheduling"],
    candidateActionIds: ["replace-plant", "fit-sequencing", "occupancy-schedule", "ignore"],
    correctActionIds: ["occupancy-schedule"],
    improvementActionIds: [],
    debrief:
      "BMS trending exists precisely to catch this: plant running 24/7 on a building used 50 hours a week, ~£43,680/yr conditioning empty space. An occupancy schedule — separate weekday, weekend and holiday patterns, with optimum start and an override-with-timeout for late workers — is the single highest-return thing most BMS can do. The data was there all along; someone just had to plot it.",
    faultChain: [
      "BMS trend: plant runs 120 h/wk, building used 50 h/wk",
      "70 avoidable h/wk × 60 kW × 52 = 218,400 kWh",
      "≈ £43,680/yr conditioning an empty building",
      "Fix: add an occupancy/time schedule",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "simultaneous-heat-cool",
    title: "Case 2 — Heating and cooling at once",
    tag: "Coordination",
    brief:
      "A zone's heating valve is open while its cooling is also running — the two loops are fighting, each undoing the other, with no deadband between them. The room sits at setpoint, but you're paying to heat and to cool the same air. Quantify the waste.",
    knownFacts: [
      "Heating delivering ~40 kW while cooling removes ~40 kW, simultaneously",
      "They overlap for ~2,000 h/yr",
      "Cooling is provided at COP 3; gas heat £0.06/kWh, electricity £0.20/kWh",
      "A deadband (heat below 19 °C, cool above 24 °C) would stop the fight",
    ],
    readings: [
      { label: "Heating output", value: "40", unit: "kW" },
      { label: "Cooling output", value: "40", unit: "kW", note: "cancelling the heating" },
      { label: "Overlap hours", value: "2,000", unit: "h/yr" },
      { label: "Deadband", value: "none", note: "loops fighting" },
    ],
    refTables: ["coordination", "prices"],
    calcParts: [
      {
        id: "cooling-elec",
        prompt: "What electrical power does the 40 kW of cooling draw (COP 3)?",
        unit: "kW",
        answer: 13.3,
        tol: 0.05,
        tolType: "rel",
        hints: ["Cooling output ÷ COP.", "40 ÷ 3."],
        worked: "40 ÷ 3 ≈ 13.3 kW of compressor power.",
      },
      {
        id: "heat-waste",
        prompt: "What is the wasted heating costing per year?",
        unit: "£/yr",
        answer: 4800,
        tol: 0.05,
        tolType: "rel",
        hints: ["Heat × hours × gas price.", "40 × 2,000 × 0.06."],
        worked: "40 kW × 2,000 h × £0.06 = £4,800/yr of gas heating that the cooling just removes.",
      },
      {
        id: "cool-waste",
        prompt: "What is the wasted cooling electricity costing per year?",
        unit: "£/yr",
        answer: 5333,
        tol: 0.06,
        tolType: "rel",
        hints: ["Cooling kW × hours × electricity price.", "13.3 × 2,000 × 0.20."],
        worked: "13.3 kW × 2,000 h × £0.20 ≈ £5,333/yr — so ~£10,000/yr total to stand still.",
      },
    ],
    candidateCauseIds: ["no-setpoint-reset", "equipment-fault", "simultaneous-heat-cool", "controls-adequate"],
    correctCauseIds: ["simultaneous-heat-cool"],
    candidateActionIds: ["ignore", "replace-plant", "raise-output", "add-deadband"],
    correctActionIds: ["add-deadband"],
    improvementActionIds: [],
    debrief:
      "Uncoordinated loops are a classic, invisible waste: the room is perfectly comfortable, so nobody complains, while you pay to heat and to cool the same air — ~£10,000/yr here. The fix is coordination: a deadband where neither acts (heat below 19 °C, cool above 24 °C), and logic that disables heating whenever cooling is active. Well-coordinated multi-loop control routinely saves 10–20%. Running anything harder only burns more.",
    faultChain: [
      "Heating 40 kW and cooling 40 kW running together, no deadband",
      "Wasted heat £4,800 + wasted cooling elec £5,333",
      "≈ £10,000/yr to keep the room exactly where it already was",
      "Fix: add a deadband and coordinate the loops",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "setpoint-reset",
    title: "Case 3 — One flow temperature, all year",
    tag: "Setpoint reset",
    brief:
      "A heating system pushes a fixed 75 °C flow whether it's −2 °C or +12 °C outside. On mild days that's far hotter than needed, wasting energy and overshooting. Weather-compensated setpoint reset would lower the flow temperature as the weather warms. Quantify the prize.",
    knownFacts: [
      "Annual heating energy ~400,000 kWh, on a fixed 75 °C flow",
      "Setpoint reset (weather compensation) typically saves 10–20%",
      "Take a conservative 15% here",
      "BMS tuning to implement it ≈ £800; gas £0.06/kWh",
    ],
    readings: [
      { label: "Annual heating", value: "400,000", unit: "kWh" },
      { label: "Flow temperature", value: "75", unit: "°C", note: "fixed year-round" },
      { label: "Reset saving", value: "15", unit: "%" },
      { label: "Implementation", value: "800", unit: "£" },
    ],
    refTables: ["strategies", "prices"],
    calcParts: [
      {
        id: "current-cost",
        prompt: "What does the heating cost per year now?",
        unit: "£/yr",
        answer: 24000,
        tol: 0.04,
        tolType: "rel",
        hints: ["Energy × gas price.", "400,000 × 0.06."],
        worked: "400,000 × £0.06 = £24,000/yr.",
      },
      {
        id: "saving",
        prompt: "What would setpoint reset save at 15%?",
        unit: "£/yr",
        answer: 3600,
        tol: 0.05,
        tolType: "rel",
        hints: ["Saving % × current cost.", "0.15 × 24,000."],
        worked: "0.15 × £24,000 = £3,600/yr.",
      },
      {
        id: "payback",
        prompt: "What is the payback on the £800 of BMS tuning?",
        unit: "years",
        answer: 0.22,
        tol: 0.15,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "800 ÷ 3,600."],
        worked: "£800 ÷ £3,600 ≈ 0.22 years — about ten weeks.",
      },
    ],
    candidateCauseIds: ["no-setpoint-reset", "controls-adequate", "on-off-control", "no-scheduling"],
    correctCauseIds: ["no-setpoint-reset"],
    candidateActionIds: ["ignore", "raise-output", "replace-plant", "fit-setpoint-reset"],
    correctActionIds: ["fit-setpoint-reset"],
    improvementActionIds: [],
    debrief:
      "A fixed flow temperature is a blunt instrument: on a mild day it overheats the building and overshoots, on a cold day it's about right. Weather-compensated reset (e.g. flow setpoint falling as outdoor temperature rises) matches the supply to the genuine demand, saving 10–20% — ~£3,600/yr here for a ~ten-week payback. It's almost pure software: the most cost-effective heating measure most sites have.",
    faultChain: [
      "Fixed 75 °C flow regardless of weather",
      "Reset saves ~15% of £24,000 = £3,600/yr",
      "BMS tuning ~£800 → ~0.2-yr payback",
      "Fix: fit weather-compensated setpoint reset",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "sensor-drift",
    title: "Case 4 — The thermostat that lies",
    tag: "Sensor drift",
    brief:
      "Occupants say the office is too warm, but the BMS insists it's holding 21 °C. You check the room sensor against a calibrated reference: it has drifted and reads 2 °C low — so the BMS heats the room to a real 23 °C while believing it's at 21 °C. Quantify the cost of the drift.",
    knownFacts: [
      "Room sensor reads 2 °C below the true temperature (drifted)",
      "So the space is heated 2 °C warmer than intended",
      "Heating ~3% more energy per °C of over-heating",
      "Annual heating ~400,000 kWh; gas £0.06/kWh",
    ],
    readings: [
      { label: "Sensor error", value: "−2", unit: "°C", note: "reads 2 °C low" },
      { label: "Over-heating", value: "2", unit: "°C", note: "real room runs 2 °C warm" },
      { label: "Energy per °C", value: "3", unit: "%" },
      { label: "Annual heating", value: "400,000", unit: "kWh" },
    ],
    refTables: ["sensors", "prices"],
    calcParts: [
      {
        id: "over-heat",
        prompt: "By how much is the space being over-heated?",
        unit: "°C",
        answer: 2,
        tol: 0.5,
        tolType: "abs",
        hints: ["The drift directly offsets the controlled temperature.", "It reads 2 °C low → 2 °C warm."],
        worked: "A 2 °C low reading makes the BMS hold the room 2 °C warmer than intended.",
      },
      {
        id: "extra-pct",
        prompt: "What extra heating does that 2 °C cause (at ~3% per °C)?",
        unit: "%",
        answer: 6,
        tol: 1,
        tolType: "abs",
        hints: ["°C over × 3% per °C.", "2 × 3%."],
        worked: "2 × 3% = 6% extra heating energy.",
      },
      {
        id: "cost",
        prompt: "What is that costing per year?",
        unit: "£/yr",
        answer: 1440,
        tol: 0.06,
        tolType: "rel",
        hints: ["Extra % × annual energy × gas price.", "0.06 × 400,000 × 0.06."],
        worked: "0.06 × 400,000 × £0.06 = £1,440/yr — from a sensor that costs nothing to recalibrate.",
      },
    ],
    candidateCauseIds: ["equipment-fault", "sensor-drift", "no-setpoint-reset", "controls-adequate"],
    correctCauseIds: ["sensor-drift"],
    candidateActionIds: ["raise-output", "recalibrate-sensor", "replace-plant", "ignore"],
    correctActionIds: ["recalibrate-sensor"],
    improvementActionIds: [],
    debrief:
      "A control loop is only as good as its sensor. Sensors drift ~1–2% a year, and a 2 °C error here quietly over-heats the building by 2 °C — ~£1,440/yr, plus uncomfortable occupants — while the BMS reports everything is fine. The fix is a recalibration, not new plant. Budget for annual sensor calibration; it's one of the cheapest reliability measures there is, and miscalibrated sensors are behind a surprising share of 'mystery' energy waste.",
    faultChain: [
      "Room sensor drifted, reads 2 °C low",
      "Space over-heated 2 °C → ~6% extra heating",
      "≈ £1,440/yr, occupants too warm",
      "Fix: recalibrate the sensor",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "sensor-placement",
    title: "Case 5 — Mounted above the radiator",
    tag: "Sensor placement",
    brief:
      "A zone runs cold and staff have brought in portable heaters — yet the BMS holds '21 °C'. The room thermostat is mounted on the wall directly above a radiator, so it sits in a warm plume and reads ~3 °C high. The BMS satisfies a sensor that's warmer than the room. The plant is fine; the placement isn't.",
    knownFacts: [
      "Thermostat mounted above a radiator — reads ~3 °C above true room temperature",
      "So the real room runs ~3 °C below setpoint and feels cold",
      "Staff run ten 2 kW portable heaters ~1,000 h/yr to compensate",
      "Electricity £0.20/kWh; relocating the sensor is essentially free",
    ],
    readings: [
      { label: "Sensor error", value: "+3", unit: "°C", note: "above a radiator" },
      { label: "Room shortfall", value: "3", unit: "°C", note: "real room runs cold" },
      { label: "Portable heaters", value: "10 × 2", unit: "kW", note: "the workaround" },
      { label: "Heater hours", value: "1,000", unit: "h/yr" },
    ],
    refTables: ["sensors", "prices"],
    calcParts: [
      {
        id: "heater-load",
        prompt: "What is the total portable-heater load staff have added?",
        unit: "kW",
        answer: 20,
        tol: 1,
        tolType: "abs",
        hints: ["Number × rating each.", "10 × 2."],
        worked: "10 × 2 kW = 20 kW of plug-in heaters fighting a controls error.",
      },
      {
        id: "cost",
        prompt: "What does that workaround cost per year?",
        unit: "£/yr",
        answer: 4000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Load × hours × price.", "20 × 1,000 × 0.20."],
        worked: "20 kW × 1,000 h × £0.20 = £4,000/yr in portable heaters.",
      },
      {
        id: "fix-cost",
        prompt: "Roughly what does relocating the sensor cost?",
        unit: "£",
        answer: 0,
        tol: 50,
        tolType: "abs",
        hints: ["It's a labour-only move to a representative spot.", "Essentially nothing."],
        worked: "Essentially nothing — move it to wall height (1.2–1.5 m), away from the radiator, sun and draughts.",
      },
    ],
    candidateCauseIds: ["sensor-placement", "equipment-fault", "sensor-drift", "controls-adequate"],
    correctCauseIds: ["sensor-placement"],
    candidateActionIds: ["replace-plant", "add-portable-heaters", "relocate-sensor", "raise-output"],
    correctActionIds: ["relocate-sensor"],
    improvementActionIds: [],
    debrief:
      "Placement matters as much as calibration. A sensor in a radiator plume (or direct sun, or a draught) reads nothing like the room it's meant to control, so the BMS 'succeeds' while the space is cold and staff plug in £4,000/yr of portable heaters — the most expensive heat in the building. Move the sensor to a representative spot (wall height, central, away from heat sources and draughts). Adding more portable heaters treats the symptom and pays for the error forever.",
    faultChain: [
      "Thermostat above a radiator reads 3 °C high",
      "Room runs cold; staff add 20 kW of portable heaters",
      "~£4,000/yr workaround for a free fix",
      "Fix: relocate the sensor to a representative position",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "on-off-pid",
    title: "Case 6 — Banging on and off",
    tag: "Control mode",
    brief:
      "A zone on a crude on-off thermostat swings between 19 and 23 °C — heat full-on, overshoot, off, undershoot, repeat. Every overshoot is energy spent heating past the setpoint. A PID loop would hold it steady. Quantify the saving.",
    knownFacts: [
      "On-off control; temperature swings ±2 °C and overshoots the setpoint",
      "PID control would hold ±0.2 °C with no overshoot",
      "PID typically saves 5–10% over on-off; take 8% here",
      "Annual heating ~300,000 kWh; gas £0.06/kWh; controller upgrade ≈ £1,000",
    ],
    readings: [
      { label: "Control mode", value: "on-off", note: "±2 °C swing, overshoots" },
      { label: "PID band", value: "±0.2", unit: "°C" },
      { label: "PID saving", value: "8", unit: "%" },
      { label: "Annual heating", value: "300,000", unit: "kWh" },
    ],
    refTables: ["modes", "prices"],
    calcParts: [
      {
        id: "current-cost",
        prompt: "What does the heating cost per year now?",
        unit: "£/yr",
        answer: 18000,
        tol: 0.04,
        tolType: "rel",
        hints: ["Energy × gas price.", "300,000 × 0.06."],
        worked: "300,000 × £0.06 = £18,000/yr.",
      },
      {
        id: "saving",
        prompt: "What would PID save at 8%?",
        unit: "£/yr",
        answer: 1440,
        tol: 0.05,
        tolType: "rel",
        hints: ["Saving % × cost.", "0.08 × 18,000."],
        worked: "0.08 × £18,000 = £1,440/yr.",
      },
      {
        id: "payback",
        prompt: "What is the payback on the £1,000 controller?",
        unit: "years",
        answer: 0.69,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "1,000 ÷ 1,440."],
        worked: "£1,000 ÷ £1,440 ≈ 0.69 years.",
      },
    ],
    candidateCauseIds: ["no-setpoint-reset", "on-off-control", "equipment-fault", "controls-adequate"],
    correctCauseIds: ["on-off-control"],
    candidateActionIds: ["fit-pid", "raise-output", "ignore", "replace-plant"],
    correctActionIds: ["fit-pid"],
    improvementActionIds: [],
    debrief:
      "On-off (bang-bang) control oscillates by design: it overshoots the setpoint every cycle, and every overshoot is wasted energy (plus noise and wear). PID control — proportional to the error, integral to remove offset, derivative to damp overshoot — holds the space tight (±0.2 °C) and saves 5–10%, here ~£1,440/yr at a sub-year payback. Tight control isn't just comfort; it's efficiency, because the system stops overshooting.",
    faultChain: [
      "On-off thermostat swinging ±2 °C, overshooting",
      "PID would hold ±0.2 °C and save ~8% of £18,000",
      "≈ £1,440/yr; ~0.7-yr payback",
      "Fix: replace on-off with PID control",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "valve-authority",
    title: "Case 7 — The valve that does nothing",
    tag: "Valve authority",
    brief:
      "A heating control valve hunts — the loop never settles, swinging the room temperature. The cause is hydraulic: the valve drops only 5 kPa in a 60 kPa loop, so it has almost no authority. Across most of its travel it barely changes the flow, so control is sluggish and unstable. Work out the authority and what it should be.",
    knownFacts: [
      "Valve pressure drop 5 kPa; total loop drop 60 kPa",
      "Authority = valve drop ÷ total loop drop; target 0.3–0.5",
      "Hunting overshoots and wastes ~5% on this loop",
      "Loop heating ~200,000 kWh/yr; gas £0.06/kWh",
    ],
    readings: [
      { label: "Valve pressure drop", value: "5", unit: "kPa" },
      { label: "Total loop drop", value: "60", unit: "kPa" },
      { label: "Target authority", value: "0.3–0.5", unit: "" },
      { label: "Behaviour", value: "hunting", note: "loop never settles" },
    ],
    refTables: ["authority", "prices"],
    calcParts: [
      {
        id: "authority",
        prompt: "What is the valve's authority now?",
        unit: "",
        answer: 0.083,
        tol: 0.02,
        tolType: "abs",
        hints: ["Valve drop ÷ total loop drop.", "5 ÷ 60."],
        worked: "5 ÷ 60 = 0.083 — far below the 0.3–0.5 target, so the valve has almost no control authority.",
      },
      {
        id: "target-drop",
        prompt: "What valve pressure drop would give an authority of 0.4 in this 60 kPa loop?",
        unit: "kPa",
        answer: 24,
        tol: 1,
        tolType: "abs",
        hints: ["Authority × total loop drop.", "0.4 × 60."],
        worked: "0.4 × 60 = 24 kPa — the valve must be re-sized to take a much bigger share of the drop.",
      },
      {
        id: "waste",
        prompt: "What does the hunting waste per year (~5% of the loop)?",
        unit: "£/yr",
        answer: 600,
        tol: 0.08,
        tolType: "rel",
        hints: ["5% × loop energy × gas price.", "0.05 × 200,000 × 0.06."],
        worked: "0.05 × 200,000 × £0.06 = £600/yr — plus poor comfort and valve wear.",
      },
    ],
    candidateCauseIds: ["controls-adequate", "low-valve-authority", "sensor-drift", "on-off-control"],
    correctCauseIds: ["low-valve-authority"],
    candidateActionIds: ["raise-output", "ignore", "replace-plant", "resize-valve"],
    correctActionIds: ["resize-valve"],
    improvementActionIds: [],
    debrief:
      "Authority is what gives a valve real control: with only 0.08 here, most of its travel does almost nothing and the small effective range makes the loop hunt and oscillate. Re-size the valve so it takes 0.3–0.5 of the loop's pressure drop (≈ 24 kPa for 0.4), and the loop becomes stable and efficient. No amount of PID tuning fixes a valve with no authority — the hydraulics have to be right first.",
    faultChain: [
      "Valve drops only 5 kPa of a 60 kPa loop → authority 0.08",
      "Almost no effective control range → hunting",
      "~£600/yr wasted, poor comfort and wear",
      "Fix: re-size the valve for authority 0.3–0.5 (~24 kPa)",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "sequencing",
    title: "Case 8 — All three boilers, all part-loaded",
    tag: "Sequencing",
    brief:
      "A plant room has three boilers, and on a mild day all three are firing — each ticking over at ~30% load, where they're least efficient. There's no sequencing, so they all run together regardless of demand. Proper load sequencing would run fewer boilers at higher, more efficient loads. Quantify the prize.",
    knownFacts: [
      "Three boilers all running at low part-load (no sequencing)",
      "Sequencing (run only what's needed, rotate duty) typically saves 5–15%",
      "Take 10% here on annual fuel of ~1,000,000 kWh",
      "BMS sequencing controls ≈ £3,000; gas £0.06/kWh",
    ],
    readings: [
      { label: "Boilers running", value: "3", unit: "", note: "all at ~30% load" },
      { label: "Annual fuel", value: "1,000,000", unit: "kWh" },
      { label: "Sequencing saving", value: "10", unit: "%" },
      { label: "Controls cost", value: "3,000", unit: "£" },
    ],
    refTables: ["strategies", "prices"],
    calcParts: [
      {
        id: "current-cost",
        prompt: "What does the boiler fuel cost per year?",
        unit: "£/yr",
        answer: 60000,
        tol: 0.04,
        tolType: "rel",
        hints: ["Fuel × gas price.", "1,000,000 × 0.06."],
        worked: "1,000,000 × £0.06 = £60,000/yr.",
      },
      {
        id: "saving",
        prompt: "What would sequencing save at 10%?",
        unit: "£/yr",
        answer: 6000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Saving % × cost.", "0.10 × 60,000."],
        worked: "0.10 × £60,000 = £6,000/yr.",
      },
      {
        id: "payback",
        prompt: "What is the payback on the £3,000 of sequencing controls?",
        unit: "years",
        answer: 0.5,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "3,000 ÷ 6,000."],
        worked: "£3,000 ÷ £6,000 = 0.5 years.",
      },
    ],
    candidateCauseIds: ["no-sequencing", "controls-adequate", "equipment-fault", "no-setpoint-reset"],
    correctCauseIds: ["no-sequencing"],
    candidateActionIds: ["fit-sequencing", "ignore", "replace-plant", "raise-output"],
    correctActionIds: ["fit-sequencing"],
    improvementActionIds: [],
    debrief:
      "Oversized multi-unit plant running all units at low part-load is needlessly inefficient — boilers and chillers are at their worst lightly loaded. Sequencing runs only the units genuinely needed, at higher, more efficient loads, and rotates the duty for even wear: ~£6,000/yr here at a six-month payback. It's a BMS strategy, not new plant — and it also extends equipment life by cutting needless running hours.",
    faultChain: [
      "Three boilers all firing at ~30% load, no sequencing",
      "Sequencing saves ~10% of £60,000 = £6,000/yr",
      "Controls ~£3,000 → 0.5-yr payback",
      "Fix: fit load sequencing on the BMS",
    ],
  },
];

export function getCtrlCase(id: string): CtrlCase | undefined {
  return CTRL_CASES.find((c) => c.id === id);
}
