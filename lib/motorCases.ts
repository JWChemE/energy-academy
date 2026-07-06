/**
 * Motors & drives diagnostic cases — a mix of quantify-the-saving, reason-from-
 * symptoms and financial-judgment (rewind vs replace, upgrade now vs on failure).
 * Answers are consistent with lib/motorTables.ts. Built on the shared core.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const MOTOR_CAUSES: CauseDef[] = [
  { id: "oversized-motor", label: "Motor oversized — running at a low load factor" },
  { id: "correctly-loaded", label: "Motor correctly loaded" },
  { id: "damper-throttled", label: "Fixed-speed fan/pump throttled by a damper/valve — no VSD" },
  { id: "full-flow-needed", label: "The load genuinely needs full flow" },
  { id: "rewound-degraded", label: "Rewound motor — efficiency degraded by repeated repairs" },
  { id: "upgrade-opportunity", label: "Standard-efficiency motor on long-life duty — upgrade opportunity" },
  { id: "poor-pf", label: "Poor power factor — uncorrected reactive demand" },
  { id: "idle-no-control", label: "Motor running unloaded — no interlock / auto-stop" },
  { id: "belt-losses", label: "Worn V-belt drive — high transmission losses" },
  { id: "voltage-imbalance", label: "Supply voltage imbalance — overheating & current imbalance" },
  { id: "bearing-fault", label: "Mechanical fault (bearing / misalignment)" },
  { id: "overloaded", label: "Motor mechanically overloaded" },
];

export const MOTOR_ACTIONS: ActionDef[] = [
  { id: "right-size-motor", label: "Replace with a correctly sized motor", tier: 3 },
  { id: "fit-vsd", label: "Fit a variable-speed drive", tier: 3 },
  { id: "open-damper", label: "Open the throttling damper / valve", tier: 1 },
  { id: "replace-with-ie3", label: "Replace with a new IE3 motor", tier: 3 },
  { id: "rewind-again", label: "Rewind the existing motor again", tier: 2 },
  { id: "fit-pfc", label: "Install power-factor-correction capacitors", tier: 2 },
  { id: "right-size-fleet", label: "Right-size the lightly-loaded motors", tier: 3 },
  { id: "fit-interlock", label: "Fit an interlock / auto-stop when unloaded", tier: 1 },
  { id: "upgrade-belts", label: "Upgrade to a synchronous (toothed) belt drive", tier: 2 },
  { id: "replace-now-ie4", label: "Scrap the working motor now and fit IE4", tier: 3 },
  { id: "replace-on-failure-ie4", label: "Adopt IE4 as the replace-on-failure standard", tier: 1 },
  { id: "correct-voltage-imbalance", label: "Investigate & correct the supply voltage imbalance", tier: 1 },
  { id: "replace-motor", label: "Replace the motor", tier: 3 },
];

export type MotorRefTable = "efficiency" | "affinity" | "powerfactor" | "belts" | "imbalance" | "costs";

export interface MotorCase extends DiagnosticCase {
  refTables: MotorRefTable[];
}

export const MOTOR_CASES: MotorCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "oversized-motor",
    title: "Case 1 — The big motor on a small job",
    tag: "Sizing",
    brief:
      "A 30 kW motor drives a duty that never seems to load it. It runs warm but not hot, draws modest current, and the power factor on its circuit is poor. Work out how lightly it's really loaded and what right-sizing would save.",
    knownFacts: [
      "Rated 30 kW; measured electrical input 11.0 kW",
      "At this load the motor runs at ~84% efficiency (see efficiency-vs-load)",
      "A correctly sized 11 kW IE3 motor would run near full load at ~91%",
      "Runs ~8,000 h/yr; electricity £0.20/kWh",
    ],
    readings: [
      { label: "Rated power", value: "30", unit: "kW" },
      { label: "Measured input", value: "11.0", unit: "kW", note: "well below rating" },
      { label: "Operating efficiency", value: "0.84", unit: "", note: "low — part-load penalty" },
      { label: "Right-sized motor eff.", value: "0.91", unit: "" },
      { label: "Run hours", value: "8,000", unit: "h/yr" },
    ],
    refTables: ["efficiency", "costs"],
    calcParts: [
      {
        id: "shaft",
        prompt: "What shaft power is the motor actually delivering?",
        unit: "kW",
        answer: 9.24,
        tol: 0.05,
        tolType: "rel",
        hints: ["Shaft (output) power = electrical input × efficiency.", "11.0 × 0.84."],
        worked: "11.0 × 0.84 ≈ 9.24 kW of useful shaft power.",
      },
      {
        id: "load-factor",
        prompt: "What is the motor's load factor?",
        unit: "%",
        answer: 30.8,
        tol: 2,
        tolType: "abs",
        hints: ["Load factor = shaft power ÷ rated power × 100.", "9.24 ÷ 30 × 100."],
        worked: "9.24 ÷ 30 × 100 ≈ 31% — barely a third loaded.",
      },
      {
        id: "saving",
        prompt: "What would a correctly sized motor save per year?",
        unit: "£/yr",
        answer: 1350,
        tol: 0.1,
        tolType: "rel",
        hints: [
          "A right-sized motor delivers the same 9.24 kW shaft at higher efficiency: input = 9.24 ÷ 0.91. Saving = (11.0 − that) × hours × price.",
          "9.24 ÷ 0.91 ≈ 10.15 kW; saving ≈ 0.85 kW.",
        ],
        worked: "Right-sized input = 9.24 ÷ 0.91 ≈ 10.15 kW. (11.0 − 10.15) × 8,000 × £0.20 ≈ £1,350/yr — plus a much better power factor.",
      },
    ],
    candidateCauseIds: ["belt-losses", "voltage-imbalance", "oversized-motor", "correctly-loaded"],
    correctCauseIds: ["oversized-motor"],
    candidateActionIds: ["fit-vsd", "fit-pfc", "right-size-motor", "rewind-again"],
    correctActionIds: ["right-size-motor"],
    improvementActionIds: ["fit-pfc"],
    debrief:
      "At ~31% load the motor sits in the part-load region where efficiency and power factor both fall away. Right-sizing it to ~11 kW restores efficiency (~£1,350/yr) and lifts the circuit power factor for free. Capacitors would patch the power factor but not the efficiency, and a rewind just keeps the wrong motor in place — so they're not the fix here.",
    faultChain: [
      "30 kW motor delivering only ~9.2 kW shaft → ~31% load",
      "Part-load region → low efficiency (0.84) and poor power factor",
      "Right-sized 11 kW IE3 saves ~£1,350/yr plus PF benefit",
      "Fix: replace with a correctly sized motor",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "damper-fan",
    title: "Case 2 — Throttling a fan with a flap",
    tag: "Variable-speed drives",
    brief:
      "A large extract fan runs flat-out with an inlet damper part-closed to hold the flow the process needs. The motor is fixed-speed. You're paying full power to push air through a half-shut damper. Size the VSD prize with the affinity laws.",
    knownFacts: [
      "Fan motor draws 22 kW at full speed; inlet damper throttles the flow",
      "The process only needs about 70% of full flow",
      "A VSD would let the fan run at ~70% speed instead of throttling",
      "Runs ~6,000 h/yr; electricity £0.20/kWh",
    ],
    readings: [
      { label: "Fan motor power", value: "22", unit: "kW", note: "full speed, damper throttling" },
      { label: "Flow needed", value: "70", unit: "%" },
      { label: "Achievable speed (VSD)", value: "70", unit: "%" },
      { label: "Run hours", value: "6,000", unit: "h/yr" },
    ],
    refTables: ["affinity", "costs"],
    calcParts: [
      {
        id: "power-70",
        prompt: "What would the fan draw at 70% speed with a VSD?",
        unit: "kW",
        answer: 7.5,
        tol: 0.06,
        tolType: "rel",
        hints: ["Power scales with the cube of speed: power = power_now × (speed)³.", "22 × 0.70³ = 22 × 0.343."],
        worked: "22 × 0.7³ = 22 × 0.343 ≈ 7.5 kW.",
      },
      {
        id: "saving-kw",
        prompt: "How much power would the VSD save?",
        unit: "kW",
        answer: 14.5,
        tol: 0.06,
        tolType: "rel",
        hints: ["Power now − power at 70%.", "22 − 7.5."],
        worked: "22 − 7.5 ≈ 14.5 kW.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 17300,
        tol: 0.06,
        tolType: "rel",
        hints: ["kW × hours × price.", "14.5 × 6,000 × £0.20."],
        worked: "14.5 × 6,000 × £0.20 ≈ £17,300/yr.",
      },
    ],
    candidateCauseIds: ["full-flow-needed", "oversized-motor", "belt-losses", "damper-throttled"],
    correctCauseIds: ["damper-throttled"],
    candidateActionIds: ["open-damper", "fit-vsd", "right-size-motor", "upgrade-belts"],
    correctActionIds: ["fit-vsd"],
    improvementActionIds: [],
    debrief:
      "Throttling a fixed-speed fan with a damper wastes the surplus as pressure drop across the flap. Because fan power follows the cube of speed, slowing to 70% cuts the draw to about a third — ~£17,300/yr. Simply opening the damper just raises the flow (and the power); the load doesn't need it. A VSD is the right answer.",
    faultChain: [
      "Fixed-speed fan + throttling damper = wasted energy",
      "Process needs only ~70% flow",
      "VSD at 70% speed → ~1/3 the power (cube law), ~14.5 kW saved",
      "Fix: fit a variable-speed drive",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "rewind-replace",
    title: "Case 3 — Rewind it again?",
    tag: "Repair vs replace",
    brief:
      "A 37 kW motor on a critical 24/7 duty has just failed and is back at the rewind shop for the third time. Each rewind has nudged its efficiency down. The maintenance team want to rewind it once more. Run the numbers on a new motor instead.",
    knownFacts: [
      "37 kW, runs near full load ~7,000 h/yr",
      "After three rewinds its efficiency is down to ~0.89",
      "A new IE3 motor would run at ~0.94; it costs ~£2,800",
      "Electricity £0.20/kWh",
    ],
    readings: [
      { label: "Rated power", value: "37", unit: "kW", note: "near full load" },
      { label: "Current efficiency", value: "0.89", unit: "", note: "degraded by 3 rewinds" },
      { label: "New IE3 efficiency", value: "0.94", unit: "" },
      { label: "New motor cost", value: "2,800", unit: "£" },
      { label: "Run hours", value: "7,000", unit: "h/yr" },
    ],
    refTables: ["efficiency", "costs"],
    calcParts: [
      {
        id: "input-now",
        prompt: "What electrical input does the rewound motor draw at full load?",
        unit: "kW",
        answer: 41.6,
        tol: 0.04,
        tolType: "rel",
        hints: ["Input = output ÷ efficiency.", "37 ÷ 0.89."],
        worked: "37 ÷ 0.89 ≈ 41.6 kW.",
      },
      {
        id: "annual-saving",
        prompt: "What would a new IE3 motor save per year?",
        unit: "£/yr",
        answer: 3100,
        tol: 0.08,
        tolType: "rel",
        hints: [
          "New input = 37 ÷ 0.94. Saving = (input now − new input) × hours × price.",
          "37 ÷ 0.94 ≈ 39.36 kW; saving ≈ 2.2 kW.",
        ],
        worked: "(37 ÷ 0.89 − 37 ÷ 0.94) × 7,000 × £0.20 ≈ 2.2 kW × 1,400 ≈ £3,100/yr.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback on the new motor?",
        unit: "years",
        answer: 0.9,
        tol: 0.2,
        tolType: "abs",
        hints: ["Payback = cost ÷ annual saving.", "£2,800 ÷ £3,100/yr."],
        worked: "2,800 ÷ 3,100 ≈ 0.9 years — under a year.",
      },
    ],
    candidateCauseIds: ["correctly-loaded", "oversized-motor", "rewound-degraded", "belt-losses"],
    correctCauseIds: ["rewound-degraded"],
    candidateActionIds: ["fit-pfc", "replace-with-ie3", "rewind-again", "fit-vsd"],
    correctActionIds: ["replace-with-ie3"],
    improvementActionIds: [],
    debrief:
      "Three rewinds have cost ~5 efficiency points, and on a 7,000-hour duty that's ~£3,100/yr — so a new IE3 motor pays for itself in under a year and then keeps saving. With the motor already off the line, this is the moment to replace, not rewind again. (On a low-hours standby motor the sums would favour the rewind — hours decide.)",
    faultChain: [
      "Three rewinds → efficiency down to ~0.89",
      "On 7,000 h/yr that's ~£3,100/yr versus a new IE3",
      "New motor payback < 1 year",
      "Fix: replace with a new IE3 motor now",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "power-factor",
    title: "Case 4 — Paying for power you don't use",
    tag: "Power factor",
    brief:
      "The electricity bill carries a hefty availability (kVA) charge and the site power factor is poor. A lot of lightly-loaded motors are dragging it down. Work out the capacitors needed and what correcting it saves.",
    knownFacts: [
      "Site real power 400 kW; power factor 0.78; target 0.95",
      "Availability charge ~£2.0 per kVA per month",
      "Use the power-factor → tan φ table",
    ],
    readings: [
      { label: "Real power (kW)", value: "400", unit: "kW" },
      { label: "Power factor", value: "0.78", unit: "", note: "poor — high reactive demand" },
      { label: "Target power factor", value: "0.95", unit: "" },
      { label: "kVA charge", value: "2.0", unit: "£/kVA·month" },
    ],
    refTables: ["powerfactor", "costs"],
    calcParts: [
      {
        id: "kva-now",
        prompt: "What apparent power (kVA) is the site drawing now?",
        unit: "kVA",
        answer: 513,
        tol: 0.03,
        tolType: "rel",
        hints: ["kVA = kW ÷ power factor.", "400 ÷ 0.78."],
        worked: "400 ÷ 0.78 ≈ 513 kVA.",
      },
      {
        id: "kvar",
        prompt: "What capacitor rating is needed to reach 0.95?",
        unit: "kVAr",
        answer: 189,
        tol: 0.08,
        tolType: "rel",
        hints: [
          "Capacitor kVAr = kW × (tan φ at the old PF − tan φ at the new PF). Read tan φ from the table.",
          "400 × (0.802 − 0.329).",
        ],
        worked: "400 × (tan(acos 0.78) − tan(acos 0.95)) = 400 × (0.802 − 0.329) ≈ 189 kVAr.",
      },
      {
        id: "saving",
        prompt: "What does correcting the power factor save per year on the kVA charge?",
        unit: "£/yr",
        answer: 2200,
        tol: 0.08,
        tolType: "rel",
        hints: [
          "New kVA = 400 ÷ 0.95. Saving = (kVA now − new kVA) × charge × 12 months.",
          "400 ÷ 0.95 ≈ 421 kVA; reduction ≈ 92 kVA.",
        ],
        worked: "(513 − 421) × £2.0 × 12 ≈ 92 × 24 ≈ £2,200/yr.",
      },
    ],
    candidateCauseIds: ["idle-no-control", "voltage-imbalance", "poor-pf", "oversized-motor"],
    correctCauseIds: ["poor-pf"],
    candidateActionIds: ["fit-pfc", "replace-motor", "right-size-fleet", "fit-vsd"],
    correctActionIds: ["fit-pfc"],
    improvementActionIds: ["right-size-fleet"],
    debrief:
      "A 0.78 power factor means the site draws ~513 kVA to use 400 kW — and the kVA charge bills you for the difference. About 189 kVAr of correction lifts it to 0.95 and trims ~92 kVA off the billed demand, ~£2,200/yr. Correcting at the capacitor bank is the direct fix; right-sizing the lightly-loaded motors tackles the root cause and is a sound parallel improvement.",
    faultChain: [
      "Power factor 0.78 → 513 kVA drawn for 400 kW",
      "kVA availability charge bills the reactive demand",
      "~189 kVAr of capacitors → 0.95, ~92 kVA off the bill",
      "Fix: fit power-factor-correction capacitors",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "idle-running",
    title: "Case 5 — Running on empty",
    tag: "Idle running",
    brief:
      "A conveyor motor runs continuously, but the line only produces for part of the day — the rest of the time it turns with nothing on it. There's no interlock to stop it. Quantify the cost of running empty.",
    knownFacts: [
      "15 kW conveyor motor; left running 24/7 (8,760 h/yr)",
      "Production actually needs it ~4,000 h/yr",
      "Running empty it still draws ~4 kW (no-load losses)",
      "Electricity £0.20/kWh",
    ],
    readings: [
      { label: "Motor rating", value: "15", unit: "kW" },
      { label: "Hours run", value: "8,760", unit: "h/yr", note: "24/7" },
      { label: "Hours actually needed", value: "4,000", unit: "h/yr" },
      { label: "No-load power", value: "4", unit: "kW", note: "running empty" },
    ],
    refTables: ["costs"],
    calcParts: [
      {
        id: "idle-hours",
        prompt: "How many hours a year is it running empty?",
        unit: "h/yr",
        answer: 4760,
        tol: 50,
        tolType: "abs",
        hints: ["Hours run − hours needed.", "8,760 − 4,000."],
        worked: "8,760 − 4,000 = 4,760 idle hours/yr.",
      },
      {
        id: "wasted-kwh",
        prompt: "How much energy is wasted running empty?",
        unit: "kWh/yr",
        answer: 19040,
        tol: 0.05,
        tolType: "rel",
        hints: ["No-load power × idle hours.", "4 × 4,760."],
        worked: "4 kW × 4,760 h = 19,040 kWh/yr.",
      },
      {
        id: "cost",
        prompt: "What does that cost per year?",
        unit: "£/yr",
        answer: 3800,
        tol: 0.05,
        tolType: "rel",
        hints: ["Energy × price.", "19,040 × £0.20."],
        worked: "19,040 × £0.20 ≈ £3,800/yr for moving nothing.",
      },
    ],
    candidateCauseIds: ["oversized-motor", "damper-throttled", "idle-no-control", "belt-losses"],
    correctCauseIds: ["idle-no-control"],
    candidateActionIds: ["right-size-motor", "fit-interlock", "fit-vsd", "replace-motor"],
    correctActionIds: ["fit-interlock"],
    improvementActionIds: [],
    debrief:
      "Even unloaded, an induction motor draws its no-load losses — here ~4 kW for 4,760 hours, ~£3,800/yr to move nothing. A simple interlock or photocell that stops the conveyor when there's no material (or no downstream demand) captures it for a trivial cost. The motor itself is fine, so replacing or right-sizing it misses the point.",
    faultChain: [
      "Conveyor left running 24/7; needed only ~4,000 h/yr",
      "4,760 h/yr running empty at ~4 kW no-load loss",
      "≈ 19,040 kWh → ~£3,800/yr",
      "Fix: fit an interlock / auto-stop when unloaded",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "belt-losses",
    title: "Case 6 — Losing it in the belts",
    tag: "Belt drives",
    brief:
      "A 45 kW process fan is driven through worn V-belts. The belts are slipping and warm — a sign of transmission loss. Work out what upgrading the drive would recover.",
    knownFacts: [
      "Motor input ~45 kW; driven through worn V-belts (~93% efficient)",
      "A synchronous (toothed) belt drive runs at ~98%",
      "Runs ~6,000 h/yr; electricity £0.20/kWh",
    ],
    readings: [
      { label: "Motor input power", value: "45", unit: "kW" },
      { label: "V-belt efficiency", value: "0.93", unit: "", note: "worn, slipping" },
      { label: "Synchronous belt eff.", value: "0.98", unit: "" },
      { label: "Run hours", value: "6,000", unit: "h/yr" },
    ],
    refTables: ["belts", "costs"],
    calcParts: [
      {
        id: "belt-loss",
        prompt: "How much power is lost in the worn V-belts?",
        unit: "kW",
        answer: 3.15,
        tol: 0.06,
        tolType: "rel",
        hints: ["Loss = input × (1 − belt efficiency).", "45 × (1 − 0.93)."],
        worked: "45 × 0.07 = 3.15 kW lost in the belts.",
      },
      {
        id: "saving-kw",
        prompt: "How much would a synchronous belt save?",
        unit: "kW",
        answer: 2.25,
        tol: 0.06,
        tolType: "rel",
        hints: ["Saving = input × (new efficiency − old efficiency).", "45 × (0.98 − 0.93)."],
        worked: "45 × 0.05 = 2.25 kW recovered.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 2700,
        tol: 0.06,
        tolType: "rel",
        hints: ["kW × hours × price.", "2.25 × 6,000 × £0.20."],
        worked: "2.25 × 6,000 × £0.20 = £2,700/yr.",
      },
    ],
    candidateCauseIds: ["damper-throttled", "belt-losses", "oversized-motor", "voltage-imbalance"],
    correctCauseIds: ["belt-losses"],
    candidateActionIds: ["fit-vsd", "upgrade-belts", "replace-motor", "rewind-again"],
    correctActionIds: ["upgrade-belts"],
    improvementActionIds: [],
    debrief:
      "Worn, slipping V-belts can lose 5–7% of the motor's power as heat. Switching to a synchronous (toothed) belt lifts transmission efficiency to ~98% and recovers ~2.25 kW here — ~£2,700/yr, usually for a low capital cost. The motor and the load are fine; a VSD or new motor wouldn't address the belt loss.",
    faultChain: [
      "Worn V-belts at ~93% → ~3.15 kW lost in transmission",
      "Synchronous belt at ~98% recovers ~2.25 kW",
      "≈ £2,700/yr for a modest spend",
      "Fix: upgrade to a synchronous belt drive",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "ie-upgrade",
    title: "Case 7 — Upgrade now, or wait?",
    tag: "Efficiency class",
    brief:
      "An enthusiastic contractor wants to scrap a perfectly healthy IE2 motor and fit IE4 'to save energy'. The motor only runs part-time. Do the sums and decide whether that's money well spent — or whether there's a smarter policy.",
    knownFacts: [
      "Healthy 22 kW IE2 motor (η 0.91); a new IE4 would be η 0.95",
      "It runs ~3,000 h/yr",
      "A full IE4 replacement now costs ~£1,600; the IE4 *premium* over a like-for-like at end of life is ~£400",
      "Electricity £0.20/kWh",
    ],
    readings: [
      { label: "Rated power", value: "22", unit: "kW" },
      { label: "Current efficiency (IE2)", value: "0.91", unit: "", note: "healthy motor" },
      { label: "IE4 efficiency", value: "0.95", unit: "" },
      { label: "Run hours", value: "3,000", unit: "h/yr", note: "part-time" },
      { label: "Replace-now cost", value: "1,600", unit: "£" },
    ],
    refTables: ["efficiency", "costs"],
    calcParts: [
      {
        id: "saving-kw",
        prompt: "How much power would IE4 save over the IE2 motor?",
        unit: "kW",
        answer: 1.02,
        tol: 0.06,
        tolType: "rel",
        hints: ["Both deliver 22 kW shaft. Saving = 22 ÷ η(IE2) − 22 ÷ η(IE4).", "22 ÷ 0.91 − 22 ÷ 0.95."],
        worked: "22 ÷ 0.91 − 22 ÷ 0.95 = 24.18 − 23.16 ≈ 1.02 kW.",
      },
      {
        id: "annual-saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 610,
        tol: 0.08,
        tolType: "rel",
        hints: ["kW × hours × price.", "1.02 × 3,000 × £0.20."],
        worked: "1.02 × 3,000 × £0.20 ≈ £610/yr.",
      },
      {
        id: "payback",
        prompt: "What is the payback on scrapping the working motor now (£1,600)?",
        unit: "years",
        answer: 2.6,
        tol: 0.4,
        tolType: "abs",
        hints: ["Payback = replace-now cost ÷ annual saving.", "£1,600 ÷ £610/yr."],
        worked: "1,600 ÷ 610 ≈ 2.6 years to scrap a healthy motor — versus the £400 premium-only payback of ~0.7 years if you wait for it to fail.",
      },
    ],
    candidateCauseIds: ["upgrade-opportunity", "oversized-motor", "overloaded", "rewound-degraded"],
    correctCauseIds: ["upgrade-opportunity"],
    candidateActionIds: ["rewind-again", "replace-now-ie4", "replace-on-failure-ie4", "fit-vsd"],
    correctActionIds: ["replace-on-failure-ie4"],
    improvementActionIds: [],
    debrief:
      "The trap is the eager 'replace it now'. At 3,000 h/yr the IE4 saves ~£610/yr, so scrapping a healthy motor for £1,600 takes ~2.6 years — and you bin a working asset. But the IE4 *premium* over a like-for-like replacement is only ~£400, which pays back in under a year. So the smart policy is: keep running it, and specify IE4 when it next fails. Restraint is the right answer — replacing now would be the wasteful choice.",
    faultChain: [
      "Healthy IE2 motor, only 3,000 h/yr",
      "IE4 saves ~£610/yr — replace-now payback ~2.6 years",
      "IE4 premium-on-failure payback < 1 year",
      "Fix: run it on; adopt IE4 as the replace-on-failure standard",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "hot-motor",
    title: "Case 8 — The motor that runs hot",
    tag: "Fault diagnosis",
    brief:
      "A motor keeps tripping on overload and runs noticeably hot, even though the driven load hasn't changed. One phase current is higher than the others. The bearings sound fine. Measure the supply and work out what's cooking it.",
    knownFacts: [
      "Three-phase supply measured at 415 V, 405 V and 398 V",
      "Motor runs hot and trips; one phase draws more current",
      "Bearings and alignment recently checked — sound",
      "Voltage imbalance % = max deviation from average ÷ average × 100",
    ],
    readings: [
      { label: "Phase voltages", value: "415 / 405 / 398", unit: "V", note: "not balanced" },
      { label: "Symptom", value: "hot, tripping; one phase high current" },
      { label: "Bearings / alignment", value: "checked OK", note: "mechanical ruled out" },
    ],
    refTables: ["imbalance"],
    calcParts: [
      {
        id: "avg-v",
        prompt: "What is the average phase voltage?",
        unit: "V",
        answer: 406,
        tol: 1,
        tolType: "abs",
        hints: ["Average the three readings.", "(415 + 405 + 398) ÷ 3."],
        worked: "(415 + 405 + 398) ÷ 3 = 1,218 ÷ 3 = 406 V.",
      },
      {
        id: "imbalance",
        prompt: "What is the voltage imbalance?",
        unit: "%",
        answer: 2.2,
        tol: 0.3,
        tolType: "abs",
        hints: [
          "Imbalance % = the largest deviation from the average ÷ the average × 100.",
          "Biggest deviation is 415 − 406 = 9 V. 9 ÷ 406 × 100.",
        ],
        worked: "Max deviation = 415 − 406 = 9 V. 9 ÷ 406 × 100 ≈ 2.2%.",
      },
      {
        id: "current-imbalance",
        prompt: "Roughly what current imbalance does that cause?",
        unit: "%",
        answer: 13,
        tol: 2.5,
        tolType: "abs",
        hints: [
          "Rule of thumb: current imbalance ≈ 6 × the voltage imbalance %.",
          "6 × 2.2.",
        ],
        worked: "≈ 6 × 2.2 ≈ 13% current imbalance — which is what overheats the windings.",
      },
    ],
    candidateCauseIds: ["oversized-motor", "voltage-imbalance", "overloaded", "bearing-fault"],
    correctCauseIds: ["voltage-imbalance"],
    candidateActionIds: ["replace-motor", "rewind-again", "fit-vsd", "correct-voltage-imbalance"],
    correctActionIds: ["correct-voltage-imbalance"],
    improvementActionIds: [],
    debrief:
      "The bearings are fine and the load is unchanged, so this isn't mechanical. A 2.2% voltage imbalance is the culprit: it produces a current imbalance around six times larger (~13%), which overheats one phase and trips the overload. Replacing or rewinding the motor would just cook the next one — the fix is upstream: track down the cause of the imbalance (loose connection, unbalanced single-phase loads on the supply) and correct it.",
    faultChain: [
      "Phase voltages 415/405/398 → average 406 V",
      "Voltage imbalance ~2.2% → current imbalance ~13% (≈6×)",
      "One phase overheats → trips; not a motor fault",
      "Fix: investigate & correct the supply voltage imbalance",
    ],
  },
];

export function getMotorCase(id: string): MotorCase | undefined {
  return MOTOR_CASES.find((c) => c.id === id);
}
