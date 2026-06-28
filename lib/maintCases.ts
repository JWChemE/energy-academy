/**
 * Maintenance diagnostic cases — the cost of deferral, boiler flue-temp creep,
 * reactive vs preventive strategy, condition monitoring, belt slip, interval
 * optimisation, accumulated drift, and asset prioritisation. A mix of quantify,
 * reason and judgement. Numbers consistent with lib/maintTables.ts. Built on the
 * shared diagnostics core.
 *
 * The discipline: maintenance is an energy measure. Equipment at design condition
 * uses the least energy; every fouled surface, worn part, leak and drifted
 * control quietly burns more — so match the strategy to each asset's criticality
 * and energy, and never defer maintenance whose energy cost dwarfs its price.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const MAINT_CAUSES: CauseDef[] = [
  { id: "deferred-maintenance", label: "Maintenance deferred to 'save money' (false economy)" },
  { id: "fireside-fouling", label: "Boiler fireside fouling (soot) — flue temperature rising" },
  { id: "reactive-on-critical", label: "Critical, energy-intensive asset run to failure (reactive)" },
  { id: "developing-fault", label: "A developing fault flagged by condition monitoring" },
  { id: "belt-slip", label: "Slipping / worn drive belt — transmission loss" },
  { id: "interval-too-long", label: "Maintenance interval too long for a fast-fouling asset" },
  { id: "accumulated-drift", label: "Accumulated neglect — building drifted above optimal" },
  { id: "misallocated-maintenance", label: "Maintenance effort not matched to criticality / energy" },
  { id: "maintenance-adequate", label: "Maintenance appropriate — no action" },
];

export const MAINT_ACTIONS: ActionDef[] = [
  { id: "do-the-maintenance", label: "Do the deferred maintenance now", tier: 1 },
  { id: "retension-belts", label: "Re-tension / replace the drive belts", tier: 1 },
  { id: "shorten-interval", label: "Shorten the maintenance interval to suit the environment", tier: 1 },
  { id: "prioritise-significant-users", label: "Prioritise maintenance by criticality and energy", tier: 1 },
  { id: "clean-fireside", label: "Clean the boiler fireside (sweep the tubes)", tier: 2 },
  { id: "switch-to-preventive", label: "Move the asset to preventive / predictive maintenance", tier: 2 },
  { id: "predictive-intervene", label: "Intervene now on the condition-monitoring evidence", tier: 2 },
  { id: "maintenance-catchup", label: "Run a maintenance catch-up (clean, tune, recalibrate, fix leaks)", tier: 2 },
  { id: "run-to-failure", label: "Keep running it to failure", tier: 1 },
  { id: "defer-again", label: "Defer it again to save budget", tier: 1 },
  { id: "spread-evenly", label: "Keep servicing everything equally", tier: 1 },
  { id: "replace-equipment", label: "Replace the equipment", tier: 3 },
];

export type MaintRefTable = "strategy" | "degradation" | "monitoring" | "prices";

export interface MaintCase extends DiagnosticCase {
  refTables: MaintRefTable[];
}

export const MAINT_CASES: MaintCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "deferral",
    title: "Case 1 — The clean that 'saved' money",
    tag: "Deferral",
    brief:
      "A condenser clean was put off to save its £1,500 service cost — 'no budget this quarter'. But the fouled condenser makes the chiller work ~5% harder every hour until it's done. Work out whether deferring actually saves anything.",
    knownFacts: [
      "Condenser clean deferred to save its £1,500 cost",
      "The fouled condenser adds ~5% to the chiller's electricity",
      "Chiller electricity ~300,000 kWh/yr; electricity £0.20/kWh",
      "Maintenance and energy efficiency are inseparable",
    ],
    readings: [
      { label: "Service cost 'saved'", value: "1,500", unit: "£" },
      { label: "Efficiency penalty", value: "5", unit: "%", note: "fouled condenser" },
      { label: "Chiller electricity", value: "300,000", unit: "kWh/yr" },
      { label: "Decision", value: "deferred", note: "to save budget" },
    ],
    refTables: ["degradation", "prices"],
    calcParts: [
      {
        id: "extra-kwh",
        prompt: "How much extra electricity does the fouled condenser cause?",
        unit: "kWh/yr",
        answer: 15000,
        tol: 0.04,
        tolType: "rel",
        hints: ["Penalty % × annual electricity.", "0.05 × 300,000."],
        worked: "0.05 × 300,000 = 15,000 kWh/yr of extra compressor work.",
      },
      {
        id: "cost",
        prompt: "What is that costing per year?",
        unit: "£/yr",
        answer: 3000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Extra kWh × price.", "15,000 × 0.20."],
        worked: "15,000 × £0.20 = £3,000/yr.",
      },
      {
        id: "months",
        prompt: "After how many months does the wasted energy exceed the £1,500 'saved'?",
        unit: "months",
        answer: 6,
        tol: 1,
        tolType: "abs",
        hints: ["Cost saved ÷ annual waste × 12.", "1,500 ÷ 3,000 × 12."],
        worked: "£1,500 ÷ £3,000 × 12 = 6 months — after that you're losing money, and it keeps growing.",
      },
    ],
    candidateCauseIds: ["deferred-maintenance", "fireside-fouling", "maintenance-adequate", "reactive-on-critical"],
    correctCauseIds: ["deferred-maintenance"],
    candidateActionIds: ["do-the-maintenance", "defer-again", "replace-equipment", "run-to-failure"],
    correctActionIds: ["do-the-maintenance"],
    improvementActionIds: [],
    debrief:
      "Deferring maintenance to 'save money' is usually a false economy: the equipment keeps running, just less efficiently, quietly burning extra energy every hour. Here the £1,500 'saving' is wiped out in six months and loses money thereafter — ~£3,000/yr — while the chiller fouls further. The energy cost of deferral routinely dwarfs the maintenance saved, which is exactly why energy managers should champion maintenance budgets. Do the clean.",
    faultChain: [
      "Condenser clean deferred to 'save' £1,500",
      "5% penalty on 300,000 kWh = 15,000 kWh ≈ £3,000/yr",
      "Energy waste exceeds the saving in 6 months",
      "Fix: do the deferred maintenance now",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "flue-creep",
    title: "Case 2 — Flue temperature creeping up",
    tag: "Performance tracking",
    brief:
      "Boiler logs show the flue-gas temperature has crept from 180 °C at the last service to 240 °C now, with no change in load. Soot on the fireside is insulating the tubes, so heat goes up the stack instead of into the water. Every 20 °C of flue rise is about 1% of efficiency. Quantify it.",
    knownFacts: [
      "Flue-gas temperature risen from 180 °C to 240 °C",
      "Every ~20 °C of flue rise ≈ 1% efficiency loss",
      "Annual boiler fuel ~1,000,000 kWh; gas £0.06/kWh",
      "Cause is fireside soot — a sweep restores heat transfer",
    ],
    readings: [
      { label: "Flue temp at service", value: "180", unit: "°C" },
      { label: "Flue temp now", value: "240", unit: "°C", note: "soot on the tubes" },
      { label: "Loss per 20 °C", value: "1", unit: "%" },
      { label: "Annual fuel", value: "1,000,000", unit: "kWh" },
    ],
    refTables: ["degradation", "prices"],
    calcParts: [
      {
        id: "rise",
        prompt: "How much has the flue-gas temperature risen?",
        unit: "°C",
        answer: 60,
        tol: 3,
        tolType: "abs",
        hints: ["Now − at service.", "240 − 180."],
        worked: "240 − 180 = 60 °C of flue-gas rise.",
      },
      {
        id: "loss-pct",
        prompt: "What efficiency loss does that represent?",
        unit: "%",
        answer: 3,
        tol: 0.5,
        tolType: "abs",
        hints: ["Rise ÷ 20 °C per 1%.", "60 ÷ 20."],
        worked: "60 ÷ 20 = 3% efficiency lost to fireside fouling.",
      },
      {
        id: "cost",
        prompt: "What is that costing per year?",
        unit: "£/yr",
        answer: 1800,
        tol: 0.06,
        tolType: "rel",
        hints: ["Loss % × annual fuel × gas price.", "0.03 × 1,000,000 × 0.06."],
        worked: "0.03 × 1,000,000 × £0.06 = £1,800/yr — recovered by a fireside clean.",
      },
    ],
    candidateCauseIds: ["fireside-fouling", "deferred-maintenance", "maintenance-adequate", "belt-slip"],
    correctCauseIds: ["fireside-fouling"],
    candidateActionIds: ["clean-fireside", "defer-again", "replace-equipment", "run-to-failure"],
    correctActionIds: ["clean-fireside"],
    improvementActionIds: [],
    debrief:
      "Flue-gas temperature is the single best maintenance KPI for a boiler: it creeps up as soot insulates the tubes, and at +60 °C here it's costing ~3% efficiency, ~£1,800/yr. The trend made the invisible visible — a snapshot wouldn't. Sweep the fireside to restore heat transfer, and record the flue temperature at every service so you can see it drift again. (Waterside scale does the same from the inside; control it with water treatment.)",
    faultChain: [
      "Flue temp crept 180 → 240 °C at constant load",
      "60 °C ÷ 20 = 3% efficiency lost to soot",
      "≈ £1,800/yr up the stack",
      "Fix: clean the fireside (and trend the flue temperature)",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "reactive-critical",
    title: "Case 3 — Run it till it dies",
    tag: "Strategy",
    brief:
      "A facility runs its critical 400 kW chiller reactively — fix it only when it breaks. Between failures it drifts ~8% inefficient, and when it fails it wrecks the compressor and shuts the building for days. Compare that to a planned-maintenance contract.",
    knownFacts: [
      "Critical chiller, run-to-failure; drifts ~8% inefficient between failures",
      "Chiller electricity ~150,000 kWh/yr; electricity £0.20/kWh",
      "A failure rebuild costs ~£15,000, roughly every 5 years",
      "A preventive-maintenance contract costs ~£3,000/yr",
    ],
    readings: [
      { label: "Chiller electricity", value: "150,000", unit: "kWh/yr" },
      { label: "Efficiency drift", value: "8", unit: "%", note: "reactive running" },
      { label: "Failure rebuild", value: "15,000", unit: "£ / ~5 yr" },
      { label: "PPM contract", value: "3,000", unit: "£/yr" },
    ],
    refTables: ["strategy", "prices"],
    calcParts: [
      {
        id: "drift-cost",
        prompt: "What does the 8% efficiency drift cost per year?",
        unit: "£/yr",
        answer: 2400,
        tol: 0.05,
        tolType: "rel",
        hints: ["Drift % × electricity × price.", "0.08 × 150,000 × 0.20."],
        worked: "0.08 × 150,000 × £0.20 = £2,400/yr of wasted energy.",
      },
      {
        id: "failure-cost",
        prompt: "What is the annualised cost of the failure rebuilds?",
        unit: "£/yr",
        answer: 3000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Rebuild cost ÷ years between failures.", "15,000 ÷ 5."],
        worked: "£15,000 ÷ 5 = £3,000/yr (before counting the downtime).",
      },
      {
        id: "total-reactive",
        prompt: "What is the total cost of running it reactively (energy + failures)?",
        unit: "£/yr",
        answer: 5400,
        tol: 0.05,
        tolType: "rel",
        hints: ["Drift cost + annualised failure cost.", "2,400 + 3,000."],
        worked: "£2,400 + £3,000 = £5,400/yr — versus £3,000/yr for the PPM contract that would prevent both.",
      },
    ],
    candidateCauseIds: ["reactive-on-critical", "deferred-maintenance", "maintenance-adequate", "fireside-fouling"],
    correctCauseIds: ["reactive-on-critical"],
    candidateActionIds: ["switch-to-preventive", "run-to-failure", "replace-equipment", "defer-again"],
    correctActionIds: ["switch-to-preventive"],
    improvementActionIds: [],
    debrief:
      "Reactive maintenance only looks cheap because the costs are hidden: the equipment drifts inefficient for months (£2,400/yr here), then fails at the worst time with consequential damage (£3,000/yr annualised, plus downtime) — £5,400/yr against £3,000 for a PPM contract that prevents both. The skill is matching strategy to the asset: reactive for cheap, non-critical items, but preventive (or predictive) for critical, energy-intensive plant like this chiller.",
    faultChain: [
      "Critical chiller run to failure",
      "8% drift £2,400 + failures £3,000 = £5,400/yr",
      "PPM contract would cost £3,000/yr and prevent both",
      "Fix: move the asset to preventive/predictive maintenance",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "condition-monitoring",
    title: "Case 4 — The vibration that's climbing",
    tag: "Condition monitoring",
    brief:
      "Vibration monitoring on a critical pump shows the signature trending upward over a few weeks — a bearing is starting to wear. Predictive maintenance lets you replace it now, at a convenient time, before it seizes and wrecks the shaft. Weigh acting on the evidence against running on.",
    knownFacts: [
      "Vibration trend rising — early bearing wear on a critical pump",
      "Replace the bearing now: ~£500 at a planned shutdown",
      "Run to failure: ~£8,000 (bearing + wrecked shaft + emergency + downtime)",
      "While it degrades, the drag adds ~3% to the pump's ~100,000 kWh/yr",
    ],
    readings: [
      { label: "Vibration", value: "rising", note: "early bearing wear" },
      { label: "Planned bearing swap", value: "500", unit: "£" },
      { label: "Run-to-failure cost", value: "8,000", unit: "£" },
      { label: "Pump energy", value: "100,000", unit: "kWh/yr" },
    ],
    refTables: ["monitoring", "prices"],
    calcParts: [
      {
        id: "avoided",
        prompt: "What consequential cost does intervening now avoid?",
        unit: "£",
        answer: 7500,
        tol: 0.05,
        tolType: "rel",
        hints: ["Run-to-failure cost − planned cost.", "8,000 − 500."],
        worked: "£8,000 − £500 = £7,500 of consequential damage and emergency cost avoided.",
      },
      {
        id: "drag",
        prompt: "What does the 3% bearing drag cost per year while it degrades?",
        unit: "£/yr",
        answer: 600,
        tol: 0.06,
        tolType: "rel",
        hints: ["3% × pump energy × price.", "0.03 × 100,000 × 0.20."],
        worked: "0.03 × 100,000 × £0.20 = £600/yr of extra energy from the dragging bearing.",
      },
      {
        id: "case",
        prompt: "Total benefit of intervening now (avoided damage + a year's drag)?",
        unit: "£",
        answer: 8100,
        tol: 0.05,
        tolType: "rel",
        hints: ["Avoided consequential + a year of drag.", "7,500 + 600."],
        worked: "£7,500 + £600 = £8,100 — and that's before the downtime a seizure would cause.",
      },
    ],
    candidateCauseIds: ["developing-fault", "reactive-on-critical", "maintenance-adequate", "belt-slip"],
    correctCauseIds: ["developing-fault"],
    candidateActionIds: ["predictive-intervene", "run-to-failure", "replace-equipment", "defer-again"],
    correctActionIds: ["predictive-intervene"],
    improvementActionIds: [],
    debrief:
      "Vibration analysis is the richest early warning for rotating plant — it reveals bearing wear weeks or months before failure. Acting on the evidence here turns an £8,000 seizure into a £500 planned swap, and stops £600/yr of energy-wasting drag in the meantime. That's the dual payoff of condition monitoring: the same degradation that ends in a breakdown also wastes energy all the way down, and catching it early prevents both. Target this monitoring at critical, energy-intensive assets where it pays.",
    faultChain: [
      "Vibration trend rising — early bearing wear",
      "Act now (£500) vs failure (£8,000) → £7,500 avoided",
      "Plus ~£600/yr of drag while it degrades",
      "Fix: intervene now on the monitoring evidence",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "belt-slip",
    title: "Case 5 — The belt that slips",
    tag: "Drive losses",
    brief:
      "A fan's V-belt drive is worn and slightly loose, and it's slipping — so a chunk of the motor's energy is lost as heat in the belt instead of turning the fan. A re-tension (or a switch to cogged/synchronous belts) recovers it. Quantify the loss.",
    knownFacts: [
      "Worn, loose V-belt slipping — losing ~5% transmission efficiency",
      "Fan motor draws ~30 kW, ~6,000 h/yr",
      "Electricity £0.20/kWh",
      "Re-tension / belt service ≈ £200",
    ],
    readings: [
      { label: "Motor power", value: "30", unit: "kW" },
      { label: "Slip loss", value: "5", unit: "%" },
      { label: "Run hours", value: "6,000", unit: "h/yr" },
      { label: "Belt service", value: "200", unit: "£" },
    ],
    refTables: ["degradation", "prices"],
    calcParts: [
      {
        id: "loss-kw",
        prompt: "How much power is lost to belt slip?",
        unit: "kW",
        answer: 1.5,
        tol: 0.05,
        tolType: "rel",
        hints: ["Slip % × motor power.", "0.05 × 30."],
        worked: "0.05 × 30 = 1.5 kW lost as heat in the slipping belt.",
      },
      {
        id: "cost",
        prompt: "What is that costing per year?",
        unit: "£/yr",
        answer: 1800,
        tol: 0.05,
        tolType: "rel",
        hints: ["Loss × hours × price.", "1.5 × 6,000 × 0.20."],
        worked: "1.5 kW × 6,000 h × £0.20 = £1,800/yr.",
      },
      {
        id: "payback",
        prompt: "What is the payback on the £200 belt service?",
        unit: "years",
        answer: 0.11,
        tol: 0.2,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "200 ÷ 1,800."],
        worked: "£200 ÷ £1,800 ≈ 0.11 years — a few weeks.",
      },
    ],
    candidateCauseIds: ["belt-slip", "developing-fault", "maintenance-adequate", "interval-too-long"],
    correctCauseIds: ["belt-slip"],
    candidateActionIds: ["retension-belts", "run-to-failure", "replace-equipment", "defer-again"],
    correctActionIds: ["retension-belts"],
    improvementActionIds: [],
    debrief:
      "Slipping belts are one of the most overlooked drive losses — energy turns into heat and squeal instead of useful work, ~£1,800/yr here for a 30 kW fan. A simple re-tension recovers it for a few weeks' payback; replacing worn V-belts with cogged or synchronous belts holds the efficiency longer. It's the kind of cheap, fast-payback task that a preventive plan catches and reactive maintenance leaves bleeding energy until something squeals loudly enough to notice.",
    faultChain: [
      "Worn, loose V-belt slipping on a 30 kW fan",
      "5% × 30 kW = 1.5 kW lost, 6,000 h/yr",
      "≈ £1,800/yr; ~few weeks' payback",
      "Fix: re-tension / replace the drive belts",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "interval",
    title: "Case 6 — Annual clean in a dusty workshop",
    tag: "Intervals",
    brief:
      "An air-handling coil sits in a dusty workshop and clogs fast, but it's on the standard annual clean. By a few months in it's already badly fouled, dragging up fan energy and choking airflow. The interval doesn't match how quickly this asset degrades. Work out whether more frequent cleaning pays.",
    knownFacts: [
      "Dusty environment; on an annual clean, the coil averages ~10% efficiency loss over the year",
      "Quarterly cleaning would hold the average loss to ~2%",
      "AHU energy ~100,000 kWh/yr; electricity £0.20/kWh",
      "Three extra cleans a year cost ~£900",
    ],
    readings: [
      { label: "Avg loss (annual clean)", value: "10", unit: "%", note: "fouls fast" },
      { label: "Avg loss (quarterly)", value: "2", unit: "%" },
      { label: "AHU energy", value: "100,000", unit: "kWh/yr" },
      { label: "Extra cleans cost", value: "900", unit: "£/yr" },
    ],
    refTables: ["strategy", "prices"],
    calcParts: [
      {
        id: "saving",
        prompt: "What energy cost would more frequent cleaning save (10% → 2%)?",
        unit: "£/yr",
        answer: 1600,
        tol: 0.05,
        tolType: "rel",
        hints: ["(loss now − loss after) × energy × price.", "(0.10 − 0.02) × 100,000 × 0.20."],
        worked: "0.08 × 100,000 × £0.20 = £1,600/yr of energy saved by keeping the coil clean.",
      },
      {
        id: "extra-cost",
        prompt: "What do the three extra cleans cost?",
        unit: "£/yr",
        answer: 900,
        tol: 0.05,
        tolType: "rel",
        hints: ["Given directly.", "≈ £900/yr."],
        worked: "≈ £900/yr for the three additional cleans.",
      },
      {
        id: "net",
        prompt: "What is the net annual benefit of shortening the interval?",
        unit: "£/yr",
        answer: 700,
        tol: 0.1,
        tolType: "rel",
        hints: ["Energy saved − extra cleaning cost.", "1,600 − 900."],
        worked: "£1,600 − £900 = £700/yr net — the right interval matches the asset's rate of fouling.",
      },
    ],
    candidateCauseIds: ["interval-too-long", "deferred-maintenance", "maintenance-adequate", "belt-slip"],
    correctCauseIds: ["interval-too-long"],
    candidateActionIds: ["shorten-interval", "spread-evenly", "replace-equipment", "run-to-failure"],
    correctActionIds: ["shorten-interval"],
    improvementActionIds: [],
    debrief:
      "The right maintenance interval balances the cost of the work against the rate of efficiency loss — and a fast-fouling coil in a dusty space degrades far quicker than the standard annual schedule assumes. Shortening to quarterly here nets ~£700/yr after the extra cleaning, and keeps the coil near design all year. Let the performance trend set the interval: service often enough to hold efficiency, but no more often than that requires. Slow-degrading assets, conversely, may be over-serviced.",
    faultChain: [
      "Fast-fouling coil on a standard annual clean",
      "Avg loss 10% (annual) vs 2% (quarterly) = £1,600 saved",
      "Less £900 extra cleaning → £700/yr net",
      "Fix: shorten the interval to suit the environment",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "accumulated-drift",
    title: "Case 7 — Fifteen per cent above where it should be",
    tag: "Cumulative drift",
    brief:
      "A building neglected for years has no single dramatic fault — but fouled surfaces, worn belts, small leaks and drifted controls have accumulated, and a benchmark shows it running ~15% above its optimal energy. A maintenance catch-up campaign would claw most of it back. Quantify the prize.",
    knownFacts: [
      "Benchmarking shows ~15% above optimal energy use, from accumulated neglect",
      "No single failure — fouling, wear, leaks and control drift compounding",
      "Annual energy ~1,200,000 kWh; gas £0.06/kWh",
      "A catch-up campaign (clean, tune, recalibrate, fix leaks) costs ~£8,000",
    ],
    readings: [
      { label: "Above optimal", value: "15", unit: "%", note: "accumulated drift" },
      { label: "Annual energy", value: "1,200,000", unit: "kWh" },
      { label: "Single failure?", value: "none", note: "many small losses" },
      { label: "Catch-up cost", value: "8,000", unit: "£" },
    ],
    refTables: ["degradation", "prices"],
    calcParts: [
      {
        id: "drift-kwh",
        prompt: "How much energy is the 15% drift?",
        unit: "kWh/yr",
        answer: 180000,
        tol: 0.04,
        tolType: "rel",
        hints: ["Drift % × annual energy.", "0.15 × 1,200,000."],
        worked: "0.15 × 1,200,000 = 180,000 kWh/yr of accumulated waste.",
      },
      {
        id: "cost",
        prompt: "What is that costing per year?",
        unit: "£/yr",
        answer: 10800,
        tol: 0.05,
        tolType: "rel",
        hints: ["Drift kWh × gas price.", "180,000 × 0.06."],
        worked: "180,000 × £0.06 = £10,800/yr.",
      },
      {
        id: "payback",
        prompt: "What is the payback on the £8,000 catch-up campaign?",
        unit: "years",
        answer: 0.74,
        tol: 0.15,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "8,000 ÷ 10,800."],
        worked: "£8,000 ÷ £10,800 ≈ 0.74 years.",
      },
    ],
    candidateCauseIds: ["accumulated-drift", "fireside-fouling", "maintenance-adequate", "reactive-on-critical"],
    correctCauseIds: ["accumulated-drift"],
    candidateActionIds: ["maintenance-catchup", "defer-again", "replace-equipment", "run-to-failure"],
    correctActionIds: ["maintenance-catchup"],
    improvementActionIds: [],
    debrief:
      "Individually small, these losses compound: fouled surfaces, worn belts, small leaks and drifted controls together push a neglected building 10–30% above optimal — here 15%, ~£10,800/yr — usually with no dramatic failure to draw attention. A maintenance catch-up (cleaning, tuning, lubrication, leak repair, recalibration) reverses the mechanisms and pays back in under a year. Then keep it there with a plan and performance tracking, or it simply drifts again.",
    faultChain: [
      "No single fault, but 15% above optimal from accumulated neglect",
      "0.15 × 1,200,000 = 180,000 kWh ≈ £10,800/yr",
      "Catch-up campaign (~£8,000) → ~0.7-yr payback",
      "Fix: run a maintenance catch-up (then maintain to plan)",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "prioritisation",
    title: "Case 8 — Servicing everything the same",
    tag: "Prioritisation",
    brief:
      "A stretched maintenance team services every asset on the same schedule — giving a trivial extract fan the same attention as the chiller that uses 40% of the site's energy. With limited resources, that's the wrong allocation. Work out where a percentage point of efficiency is actually worth chasing.",
    knownFacts: [
      "Site energy ~2,000,000 kWh/yr; the chiller is ~40% of it",
      "A small extract fan uses ~2,000 kWh/yr",
      "Effort is currently spread evenly across all assets",
      "Electricity £0.20/kWh",
    ],
    readings: [
      { label: "Site energy", value: "2,000,000", unit: "kWh/yr" },
      { label: "Chiller share", value: "40", unit: "%" },
      { label: "Small fan", value: "2,000", unit: "kWh/yr" },
      { label: "Current approach", value: "even", note: "everything serviced the same" },
    ],
    refTables: ["strategy", "prices"],
    calcParts: [
      {
        id: "chiller-energy",
        prompt: "How much energy does the chiller use?",
        unit: "kWh/yr",
        answer: 800000,
        tol: 0.03,
        tolType: "rel",
        hints: ["Share × site energy.", "0.40 × 2,000,000."],
        worked: "0.40 × 2,000,000 = 800,000 kWh/yr.",
      },
      {
        id: "chiller-1pct",
        prompt: "What is a 1% efficiency gain on the chiller worth per year?",
        unit: "£/yr",
        answer: 1600,
        tol: 0.05,
        tolType: "rel",
        hints: ["1% × chiller energy × price.", "0.01 × 800,000 × 0.20."],
        worked: "0.01 × 800,000 × £0.20 = £1,600/yr per percentage point.",
      },
      {
        id: "fan-1pct",
        prompt: "What is a 1% efficiency gain on the small fan worth per year?",
        unit: "£/yr",
        answer: 4,
        tol: 0.5,
        tolType: "abs",
        hints: ["1% × fan energy × price.", "0.01 × 2,000 × 0.20."],
        worked: "0.01 × 2,000 × £0.20 = £4/yr — 400× less than the chiller. The effort belongs on the chiller.",
      },
    ],
    candidateCauseIds: ["misallocated-maintenance", "deferred-maintenance", "maintenance-adequate", "reactive-on-critical"],
    correctCauseIds: ["misallocated-maintenance"],
    candidateActionIds: ["prioritise-significant-users", "spread-evenly", "replace-equipment", "run-to-failure"],
    correctActionIds: ["prioritise-significant-users"],
    improvementActionIds: [],
    debrief:
      "Not all assets deserve equal attention. A percentage point on the chiller is worth £1,600/yr; the same point on the trivial fan is worth £4 — a 400× difference. Rank the estate by criticality and energy significance, and direct preventive and predictive effort at the significant energy users (and critical plant), while cheap, non-critical items can run reactively. The art of maintenance is putting the effort where it protects the most energy, reliability and cost — not spreading it thin.",
    faultChain: [
      "Effort spread evenly; chiller is 40% of site energy",
      "1% on the chiller = £1,600/yr vs £4/yr on the fan",
      "Resources misallocated away from the big users",
      "Fix: prioritise maintenance by criticality and energy",
    ],
  },
];

export function getMaintCase(id: string): MaintCase | undefined {
  return MAINT_CASES.find((c) => c.id === id);
}
