/**
 * Steam & condensate diagnostic cases.
 *
 * Unlike the boiler cases, the panel shows only *raw* readings — the learner
 * must compute the derived figure (condensate return %, flash %, trap loss, …)
 * in the Calculate step before diagnosing. Reference data is on hand; the
 * method is the first hint, and leaning on hints blocks a pass until you retry
 * unaided. Answers below are consistent with lib/steamTables.ts.
 */

import {
  CalcPart,
  CauseDef,
  ActionDef,
  DiagnosticCase,
  Reading,
} from "./diagnostics";

// ---- master cause & action pools ----

export const STEAM_CAUSES: CauseDef[] = [
  { id: "condensate-to-drain", label: "Condensate run to drain instead of recovered" },
  { id: "process-leak", label: "Process-side leak contaminating the condensate" },
  { id: "over-cautious-dump", label: "Clean condensate being dumped unnecessarily" },
  { id: "trap-failed-open", label: "Steam trap(s) failed open — blowing live steam" },
  { id: "trap-failed-closed", label: "Steam trap(s) failed closed — waterlogging risk" },
  { id: "flash-vented", label: "Flash steam vented to atmosphere (recoverable)" },
  { id: "insulation-missing", label: "Missing / damaged pipe & valve insulation" },
  { id: "distribution-pressure-high", label: "Steam distributed at higher pressure than needed" },
  { id: "stall", label: "Coil stalling — condensate backing up under modulation" },
  { id: "carryover-boiler", label: "Boiler carryover / priming (high TDS) — wet steam" },
  { id: "poor-separation", label: "No separator / inadequate main trapping — wet steam" },
];

export const STEAM_ACTIONS: ActionDef[] = [
  { id: "fix-condensate-route", label: "Re-route the condensate back to the feed tank", tier: 2 },
  { id: "pumped-condensate-return", label: "Install a pumped condensate return", tier: 3 },
  { id: "stop-dumping", label: "Stop dumping the (clean) condensate — return it", tier: 1 },
  { id: "fit-conductivity-control", label: "Fit automatic conductivity diversion on the return", tier: 3 },
  { id: "fix-process-leak", label: "Repair the leaking process heat exchanger", tier: 2 },
  { id: "repair-trap", label: "Replace the failed steam trap(s)", tier: 1 },
  { id: "fit-trap-monitoring", label: "Fit a steam-trap monitoring system", tier: 3 },
  { id: "fit-flash-recovery", label: "Install a flash-steam recovery vessel", tier: 3 },
  { id: "relag-pipework", label: "Re-lag the bare pipework", tier: 2 },
  { id: "insulate-valves", label: "Fit insulation jackets to bare valves / flanges", tier: 1 },
  { id: "reduce-distribution-pressure", label: "Reduce the steam distribution pressure", tier: 1 },
  { id: "fit-pump-trap", label: "Fit a pump-trap to the coil", tier: 2 },
  { id: "fit-vacuum-breaker", label: "Fit a vacuum breaker to aid drainage", tier: 1 },
  { id: "fit-separator", label: "Fit a steam separator on the main", tier: 2 },
  { id: "control-boiler-tds", label: "Control boiler TDS (auto blowdown) to stop carryover", tier: 1 },
];

// ---- reference tables to surface per case ----
export type RefTable = "steam" | "trapLoss" | "pipeLoss";

/** A steam case is a generic diagnostic case plus which reference tables to show. */
export interface SteamCase extends DiagnosticCase {
  refTables: RefTable[];
}

// re-export for the calc parts declared inline below
export type { CalcPart, Reading };

export const STEAM_CASES: SteamCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "condensate-return",
    title: "Case 1 — The leaking loop",
    tag: "Condensate return",
    brief:
      "A site's gas bill has crept up since a pipework alteration last quarter. The boiler-house feed-tank looks fine, but the make-up water meter is spinning faster than it used to. Nobody's quoted a condensate-return figure — you'll have to work it out.",
    knownFacts: [
      "Feedwater and make-up are both metered",
      "Condensate returns to the tank at about 90 °C; cold make-up is ~10 °C",
      "Condensate conductivity tests clean (no contamination)",
      "Plant runs ~6,000 h/yr",
    ],
    readings: [
      { label: "Feedwater meter", value: "5,000", unit: "kg/h" },
      { label: "Make-up meter", value: "2,000", unit: "kg/h", note: "higher than the commissioning figure" },
      { label: "Condensate temp", value: "90", unit: "°C" },
      { label: "Make-up temp", value: "10", unit: "°C" },
    ],
    refTables: [],
    calcParts: [
      {
        id: "return-pct",
        prompt: "What is the condensate return rate?",
        unit: "%",
        answer: 60,
        tol: 2,
        tolType: "abs",
        hints: [
          "Return % = (feedwater − make-up) ÷ feedwater × 100. Everything you raise as steam comes back either as condensate or has to be replaced by make-up.",
          "Returned condensate = 5,000 − 2,000 = 3,000 kg/h.",
        ],
        worked: "Returned = FW − MU = 5,000 − 2,000 = 3,000 kg/h. Return % = 3,000 ÷ 5,000 × 100 = 60%.",
      },
      {
        id: "heat-lost",
        prompt: "What heat are you losing by replacing hot condensate with cold make-up?",
        unit: "kW",
        answer: 186,
        tol: 0.08,
        tolType: "rel",
        hints: [
          "The 2,000 kg/h of make-up has to be heated from 10 °C to condensate temperature. Q = ṁ × cp × ΔT, with cp ≈ 4.19 kJ/kg·K. Convert kg/h to kg/s.",
          "ṁ = 2,000 ÷ 3,600 = 0.556 kg/s; ΔT = 90 − 10 = 80 K.",
        ],
        worked: "ṁ = 2,000 ÷ 3,600 = 0.556 kg/s. Q = 0.556 × 4.19 × 80 ≈ 186 kW.",
      },
      {
        id: "annual-cost",
        prompt: "What does that lost heat cost per year?",
        unit: "£/yr",
        answer: 62800,
        tol: 0.1,
        tolType: "rel",
        hints: [
          "That heat is supplied by burning gas in an 80%-efficient boiler. Cost = kW × hours ÷ efficiency × gas price (£0.045/kWh, 6,000 h/yr).",
          "186 kW × 6,000 h = 1,116,000 kWh of heat; ÷ 0.8 = 1,395,000 kWh of gas.",
        ],
        worked: "186 kW × 6,000 h ÷ 0.8 × £0.045 ≈ £62,800/yr (before water and treatment).",
      },
    ],
    candidateCauseIds: ["process-leak", "insulation-missing", "trap-failed-open", "condensate-to-drain"],
    correctCauseIds: ["condensate-to-drain"],
    candidateActionIds: ["repair-trap", "fix-condensate-route", "relag-pipework", "pumped-condensate-return"],
    correctActionIds: ["fix-condensate-route"],
    improvementActionIds: ["pumped-condensate-return"],
    debrief:
      "At 60% return on a clean, mostly-closed system you should be near 85%+, so a third of the condensate is going missing. The conductivity is clean, ruling out a contamination dump — the pipework alteration has routed one area's condensate to drain. Re-route it back to the tank to recover the heat, water and treatment. A pumped return is a sensible future project if that run needs lifting.",
    faultChain: [
      "Pipework alteration sent an area's condensate to drain",
      "Make-up rose to replace it → return fell to 60%",
      "Cold make-up replaces 90 °C condensate → ~186 kW of heat lost",
      "Fix: re-route the condensate back to the feed tank",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "contaminated-condensate",
    title: "Case 2 — To dump or not to dump",
    tag: "Condensate quality",
    brief:
      "After a scare with a leaking heat exchanger years ago, an operator set a condensate stream to run permanently to drain 'to be safe'. Is that still justified, and what's it costing? Check the evidence before you decide.",
    knownFacts: [
      "Boiler water TDS limit equivalent ~3,000 µS/cm; condensate should be well under this",
      "Condensate ~90 °C; make-up ~10 °C; treated water ~£2.0/m³",
      "Plant runs ~6,000 h/yr",
    ],
    readings: [
      { label: "Total condensate available", value: "4,000", unit: "kg/h" },
      { label: "Condensate run to drain", value: "1,500", unit: "kg/h" },
      { label: "Condensate conductivity", value: "80", unit: "µS/cm", note: "measured at the diversion point" },
      { label: "Limit / threshold", value: "3,000", unit: "µS/cm" },
    ],
    refTables: [],
    calcParts: [
      {
        id: "pct-dumped",
        prompt: "What fraction of the available condensate is being dumped?",
        unit: "%",
        answer: 37.5,
        tol: 2,
        tolType: "abs",
        hints: [
          "Fraction dumped = dumped ÷ total available × 100.",
          "1,500 ÷ 4,000 × 100.",
        ],
        worked: "1,500 ÷ 4,000 × 100 = 37.5%.",
      },
      {
        id: "dump-cost",
        prompt: "What is the dumping costing per year (lost heat + water)?",
        unit: "£/yr",
        answer: 65000,
        tol: 0.12,
        tolType: "rel",
        hints: [
          "Two losses: the heat in the hot condensate (ṁ × cp × ΔT, then × hours ÷ boiler-eff × gas price) and the treated water itself (m³/h × hours × £/m³).",
          "Heat: 1,500/3,600 × 4.19 × 80 ≈ 140 kW. Water: 1.5 m³/h.",
        ],
        worked:
          "Heat: 0.417 kg/s × 4.19 × 80 ≈ 140 kW → 140 × 6,000 ÷ 0.8 × £0.045 ≈ £47,000. Water: 1.5 m³/h × 6,000 × £2.0 = £18,000. Total ≈ £65,000/yr.",
      },
    ],
    candidateCauseIds: ["over-cautious-dump", "condensate-to-drain", "trap-failed-open", "process-leak"],
    correctCauseIds: ["over-cautious-dump"],
    candidateActionIds: ["stop-dumping", "fix-process-leak", "fit-conductivity-control", "repair-trap"],
    correctActionIds: ["stop-dumping"],
    improvementActionIds: ["fit-conductivity-control"],
    debrief:
      "The decisive reading is the conductivity: 80 µS/cm is a tiny fraction of the 3,000 limit, so this condensate is clean — the historic precaution is now just burning £65k/yr. Return it. The wider-opportunity move is automatic conductivity diversion, which dumps only when contamination is actually detected, so you're protected without dumping good condensate.",
    faultChain: [
      "Old contamination scare → a stream set permanently to drain",
      "Conductivity now reads 80 µS/cm vs a 3,000 limit → condensate is clean",
      "37.5% of condensate dumped needlessly → ~£65k/yr",
      "Fix: stop dumping; consider automatic conductivity diversion",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "trap-survey",
    title: "Case 3 — The trap survey",
    tag: "Steam traps",
    brief:
      "A routine trap survey on a 7-bar main turns up mixed results. Work out which traps are wasting steam and what they're costing, and don't ignore the cold one.",
    knownFacts: [
      "Steam main at 7 bar g (some legs at 5 bar g)",
      "Value the lost steam at about £43 per tonne",
      "Plant runs ~6,000 h/yr",
      "Use the trap-loss table for failed-open discharge",
    ],
    readings: [
      { label: "Trap A", value: "3.2 mm orifice · 7 bar · downstream 168 °C · continuous blow", note: "ultrasonic: continuous flow" },
      { label: "Trap B", value: "4.5 mm · 7 bar · 165 °C · intermittent discharge", note: "cycling normally" },
      { label: "Trap C", value: "cold (~40 °C) · no discharge", note: "no flow at all" },
      { label: "Trap D", value: "4.5 mm orifice · 5 bar · continuous blow", note: "ultrasonic: continuous flow" },
    ],
    refTables: ["trapLoss"],
    calcParts: [
      {
        id: "loss-kgh",
        prompt: "Total steam loss from the failed-open traps?",
        unit: "kg/h",
        answer: 36,
        tol: 3,
        tolType: "abs",
        hints: [
          "Only the continuously-blowing traps (A and D) are failed open. Look each up in the trap-loss table by orifice size and pressure, then add them.",
          "Trap A: 3.2 mm at 7 bar. Trap D: 4.5 mm at 5 bar.",
        ],
        worked: "A (3.2 mm @ 7 bar) = 14 kg/h; D (4.5 mm @ 5 bar) = 22 kg/h. Total = 36 kg/h.",
      },
      {
        id: "loss-cost",
        prompt: "What is that loss costing per year?",
        unit: "£/yr",
        answer: 9300,
        tol: 0.12,
        tolType: "rel",
        hints: [
          "Annual mass = kg/h × hours. Then value it at £43/tonne (1 tonne = 1,000 kg).",
          "36 kg/h × 6,000 h = 216,000 kg = 216 tonnes.",
        ],
        worked: "36 × 6,000 = 216,000 kg = 216 t. 216 × £43 ≈ £9,300/yr.",
      },
    ],
    candidateCauseIds: ["flash-vented", "trap-failed-closed", "insulation-missing", "trap-failed-open"],
    correctCauseIds: ["trap-failed-open", "trap-failed-closed"],
    candidateActionIds: ["repair-trap", "relag-pipework", "fit-flash-recovery", "fit-trap-monitoring"],
    correctActionIds: ["repair-trap"],
    improvementActionIds: ["fit-trap-monitoring"],
    debrief:
      "Traps A and D blow continuously — failed open, wasting ~36 kg/h (~£9.3k/yr). But don't dismiss cold Trap C: a dead-cold trap with no discharge has almost certainly failed closed, which waterlogs the line and risks water hammer even though it wastes no steam. Replace the failed traps; trap monitoring is the wider-opportunity move so the next failure is caught quickly rather than at the annual survey.",
    faultChain: [
      "Traps A & D blow continuously → failed open (~36 kg/h, ~£9.3k/yr)",
      "Trap C dead-cold, no flow → failed closed → waterlogging / water-hammer risk",
      "Trap B cycling → healthy",
      "Fix: replace failed traps; consider monitoring",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "flash-plume",
    title: "Case 4 — The vent plume",
    tag: "Flash recovery",
    brief:
      "A condensate receiver vents a steady white plume to atmosphere. The condensate arrives at 7 bar g and flashes off as it drops to the atmospheric receiver. Quantify what's going up the vent.",
    knownFacts: [
      "Condensate enters at 7 bar g; the receiver is at 0 bar g (atmospheric)",
      "Use the saturated-steam table for enthalpies",
      "Value recovered heat as you would any boiler heat",
    ],
    readings: [
      { label: "Condensate pressure", value: "7", unit: "bar g" },
      { label: "Receiver pressure", value: "0", unit: "bar g" },
      { label: "Condensate flow", value: "2,000", unit: "kg/h" },
      { label: "Vent", value: "steady visible plume", note: "flash steam, not just hot air" },
    ],
    refTables: ["steam"],
    calcParts: [
      {
        id: "flash-pct",
        prompt: "What percentage of the condensate flashes to steam?",
        unit: "%",
        answer: 13.4,
        tol: 1,
        tolType: "abs",
        hints: [
          "Flash % = (hf at the higher pressure − hf at the lower pressure) ÷ hfg at the lower pressure × 100. Use hf values from the steam table.",
          "hf at 7 bar g = 721; hf at 0 bar g = 419; hfg at 0 bar g = 2,257 kJ/kg.",
        ],
        worked: "(721 − 419) ÷ 2,257 × 100 = 302 ÷ 2,257 × 100 ≈ 13.4%.",
      },
      {
        id: "flash-kgh",
        prompt: "How much flash steam is that?",
        unit: "kg/h",
        answer: 268,
        tol: 20,
        tolType: "abs",
        hints: ["Flash steam = flash % × condensate flow.", "0.134 × 2,000 kg/h."],
        worked: "0.134 × 2,000 ≈ 268 kg/h of flash steam.",
      },
      {
        id: "flash-kw",
        prompt: "What recoverable heat is in that flash steam?",
        unit: "kW",
        answer: 168,
        tol: 15,
        tolType: "abs",
        hints: [
          "The useful heat is the latent heat of the flash: Q = flash kg/h × hfg(0 bar g) ÷ 3,600.",
          "268 kg/h × 2,257 kJ/kg ÷ 3,600.",
        ],
        worked: "268 × 2,257 ÷ 3,600 ≈ 168 kW (≈ £57k/yr) — currently vented.",
      },
    ],
    candidateCauseIds: ["trap-failed-open", "distribution-pressure-high", "flash-vented", "insulation-missing"],
    correctCauseIds: ["flash-vented"],
    candidateActionIds: ["fit-flash-recovery", "reduce-distribution-pressure", "relag-pipework", "repair-trap"],
    correctActionIds: ["fit-flash-recovery"],
    improvementActionIds: [],
    debrief:
      "That plume isn't waste heat you have to accept — it's ~13% of the condensate flashing to ~268 kg/h of clean low-pressure steam, about 168 kW. A flash-recovery vessel captures it to feed a low-pressure load or pre-heat the deaerator. Don't confuse it with a blowing trap (the plume is at the receiver vent, downstream of the traps, and is expected physics — the fault is simply not recovering it).",
    faultChain: [
      "7 bar g condensate drops to atmospheric → ~13.4% flashes off",
      "≈ 268 kg/h of clean flash steam (~168 kW) vented",
      "Fix: install a flash-recovery vessel to a low-pressure load",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "bare-main",
    title: "Case 5 — The bare main",
    tag: "Distribution losses",
    brief:
      "A run of steam main and several valves were never re-lagged after maintenance. They're hot to stand near. Put a number on the loss and the saving from re-insulating.",
    knownFacts: [
      "Bare run: 80 m of DN100 steam main at ~170 °C",
      "Use the pipe heat-loss table (bare vs insulated, W/m)",
      "Plant runs ~6,000 h/yr",
    ],
    readings: [
      { label: "Bare main length", value: "80", unit: "m" },
      { label: "Pipe size", value: "DN100", unit: "" },
      { label: "Surface", value: "bare, ~170 °C", note: "no lagging since maintenance" },
    ],
    refTables: ["pipeLoss"],
    calcParts: [
      {
        id: "bare-kw",
        prompt: "What is the heat loss from the bare main?",
        unit: "kW",
        answer: 44.8,
        tol: 0.06,
        tolType: "rel",
        hints: [
          "Loss = length × (bare W/m from the table). Convert W to kW.",
          "DN100 bare ≈ 560 W/m; 80 m × 560 W/m.",
        ],
        worked: "80 m × 560 W/m = 44,800 W = 44.8 kW.",
      },
      {
        id: "bare-cost",
        prompt: "What does the bare main cost per year?",
        unit: "£/yr",
        answer: 15120,
        tol: 0.08,
        tolType: "rel",
        hints: ["kW × hours ÷ boiler-eff × gas price.", "44.8 kW × 6,000 h ÷ 0.8 × £0.045."],
        worked: "44.8 × 6,000 ÷ 0.8 × £0.045 ≈ £15,120/yr.",
      },
      {
        id: "lag-saving",
        prompt: "What would re-lagging save per year?",
        unit: "£/yr",
        answer: 13600,
        tol: 0.1,
        tolType: "rel",
        hints: [
          "Insulation cuts the loss to the insulated W/m. Saving = (bare − insulated) loss, costed as before.",
          "Insulated DN100 ≈ 56 W/m → 80 × 56 = 4.48 kW. Saving = 44.8 − 4.48 = 40.3 kW.",
        ],
        worked: "Insulated loss = 80 × 56 = 4.48 kW. Saving = 40.3 kW × 6,000 ÷ 0.8 × £0.045 ≈ £13,600/yr.",
      },
    ],
    candidateCauseIds: ["distribution-pressure-high", "trap-failed-open", "insulation-missing", "flash-vented"],
    correctCauseIds: ["insulation-missing"],
    candidateActionIds: ["relag-pipework", "insulate-valves", "reduce-distribution-pressure", "repair-trap"],
    correctActionIds: ["relag-pipework", "insulate-valves"],
    improvementActionIds: [],
    debrief:
      "A bare DN100 main loses ~560 W per metre — 44.8 kW over the run, ~£15k/yr — and insulation recovers about 90% of it. Re-lag the pipe and jacket the valves and flanges (a single bare DN100 valve can lose as much as a metre or two of bare pipe, so removable jackets pay back fast).",
    faultChain: [
      "80 m of DN100 main left bare → ~560 W/m → 44.8 kW lost",
      "≈ £15k/yr; insulation recovers ~90%",
      "Fix: re-lag pipework and jacket the valves",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "over-pressure",
    title: "Case 6 — Distributing too high",
    tag: "Pressure optimisation",
    brief:
      "Steam is generated and distributed at 10 bar g but every process uses it at 3 bar g through local PRVs. Distributing lower would cut flash and standing losses. Quantify the flash difference.",
    knownFacts: [
      "Generated/distributed at 10 bar g; process needs 3 bar g",
      "Condensate from the trap stations totals ~1,500 kg/h",
      "Value steam at about £43 per tonne; 6,000 h/yr",
      "Use the steam table for enthalpies",
    ],
    readings: [
      { label: "Distribution pressure", value: "10", unit: "bar g" },
      { label: "Process requirement", value: "3", unit: "bar g" },
      { label: "Trap-station condensate", value: "1,500", unit: "kg/h" },
    ],
    refTables: ["steam"],
    calcParts: [
      {
        id: "flash-10",
        prompt: "Flash fraction from 10 bar g condensate to atmosphere?",
        unit: "%",
        answer: 16.0,
        tol: 1,
        tolType: "abs",
        hints: [
          "Flash % = (hf at distribution pressure − hf at 0 bar g) ÷ hfg at 0 bar g × 100.",
          "hf at 10 bar g = 781; hf at 0 = 419; hfg at 0 = 2,257.",
        ],
        worked: "(781 − 419) ÷ 2,257 × 100 ≈ 16.0%.",
      },
      {
        id: "flash-3",
        prompt: "Flash fraction if distributed at 3 bar g instead?",
        unit: "%",
        answer: 8.2,
        tol: 1,
        tolType: "abs",
        hints: ["Same formula, using hf at 3 bar g = 605.", "(605 − 419) ÷ 2,257 × 100."],
        worked: "(605 − 419) ÷ 2,257 × 100 ≈ 8.2%.",
      },
      {
        id: "flash-saving",
        prompt: "Annual saving from the reduced flash on the 1,500 kg/h?",
        unit: "£/yr",
        answer: 30000,
        tol: 0.15,
        tolType: "rel",
        hints: [
          "Reduced flash fraction × condensate flow = steam saved per hour. Then × hours × £43/tonne.",
          "(16.0 − 8.2)% = 7.8% of 1,500 = ~117 kg/h saved.",
        ],
        worked: "0.078 × 1,500 ≈ 117 kg/h. 117 × 6,000 = 702,000 kg = 702 t × £43 ≈ £30,000/yr.",
      },
    ],
    candidateCauseIds: ["flash-vented", "trap-failed-open", "distribution-pressure-high", "insulation-missing"],
    correctCauseIds: ["distribution-pressure-high"],
    candidateActionIds: ["reduce-distribution-pressure", "repair-trap", "relag-pipework", "fit-flash-recovery"],
    correctActionIds: ["reduce-distribution-pressure"],
    improvementActionIds: ["fit-flash-recovery"],
    debrief:
      "Lowering the distribution pressure from 10 to 3 bar g roughly halves the flash loss at every trap station (16% → 8%), worth ~£30k/yr here, and also cuts standing losses because the mains run cooler. Check pipe sizing and steam dryness first — lower pressure means larger specific volume — but where the headroom exists it's nearly free. Flash recovery is a complementary capital project for what flash remains.",
    faultChain: [
      "Distributing at 10 bar g but using at 3 bar g",
      "Flash at trap stations ~16% vs ~8% if distributed lower",
      "~117 kg/h of avoidable flash → ~£30k/yr",
      "Fix: reduce distribution pressure (mind sizing & dryness)",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "stalled-coil",
    title: "Case 7 — The coil that won't heat",
    tag: "Stall / waterlogging",
    brief:
      "An air-heater coil with a modulating control valve can't hold temperature at low load, and there's occasional water hammer. The trap was replaced last month and tested fine. Use the steam table to see what's happening.",
    knownFacts: [
      "Process target 80 °C; inlet air 15 °C; only reaching 68 °C at low load",
      "At low load the modulating valve drops the coil to ~1.0 bar g",
      "The condensate line has ~1.5 bar g back-pressure (lift + shared return)",
      "Use the steam table for saturation temperatures",
    ],
    readings: [
      { label: "Coil pressure (low load)", value: "1.0", unit: "bar g" },
      { label: "Condensate back-pressure", value: "1.5", unit: "bar g", note: "shared return + static lift" },
      { label: "Process temp", value: "68 / 80", unit: "°C (actual/target)" },
      { label: "Trap", value: "new, tested OK", note: "not a failed trap" },
    ],
    refTables: ["steam"],
    calcParts: [
      {
        id: "tsat-coil",
        prompt: "Saturation temperature at the coil pressure (1.0 bar g)?",
        unit: "°C",
        answer: 120,
        tol: 2,
        tolType: "abs",
        hints: ["Read the saturation temperature straight off the steam table for 1 bar g.", "The table lists 1 bar g directly."],
        worked: "From the table, Tsat at 1 bar g ≈ 120 °C.",
      },
      {
        id: "tsat-back",
        prompt: "Saturation temperature at the condensate back-pressure (1.5 bar g)?",
        unit: "°C",
        answer: 127,
        tol: 3,
        tolType: "abs",
        hints: [
          "1.5 bar g sits between the 1 and 2 bar g rows — interpolate the saturation temperatures.",
          "Between 120.2 °C (1 bar g) and 133.5 °C (2 bar g).",
        ],
        worked: "Interpolating between 120.2 and 133.5 °C → ≈ 127 °C at 1.5 bar g.",
      },
      {
        id: "output-pct",
        prompt: "What fraction of the required temperature rise is the coil currently achieving?",
        unit: "%",
        answer: 81.5,
        tol: 3,
        tolType: "abs",
        hints: [
          "Achieved rise ÷ required rise × 100, both measured from the 15 °C inlet.",
          "Achieved = 68 − 15 = 53; required = 80 − 15 = 65.",
        ],
        worked: "(68 − 15) ÷ (80 − 15) × 100 = 53 ÷ 65 × 100 ≈ 81.5%.",
      },
    ],
    candidateCauseIds: ["stall", "trap-failed-closed", "trap-failed-open", "insulation-missing"],
    correctCauseIds: ["stall"],
    candidateActionIds: ["fit-vacuum-breaker", "reduce-distribution-pressure", "repair-trap", "fit-pump-trap"],
    correctActionIds: ["fit-pump-trap"],
    improvementActionIds: [],
    debrief:
      "The trap is fine — this is stall. At low load the modulating valve drops the coil to ~120 °C saturation, but the condensate has to push out against a 1.5 bar g (~127 °C) back-pressure. Coil pressure below back-pressure means condensate can't drain, so it waterlogs the coil, kills heat transfer and causes water hammer. Replacing the trap won't help; the fix is a pump-trap (and a vacuum breaker) to actively drain the coil regardless of load.",
    faultChain: [
      "Modulating valve drops coil to ~1.0 bar g (120 °C) at low load",
      "Condensate must drain against 1.5 bar g (~127 °C) back-pressure",
      "Coil pressure < back-pressure → condensate stalls → waterlogging, hammer",
      "Fix: fit a pump-trap (and vacuum breaker), not another trap",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "wet-steam",
    title: "Case 8 — Wet steam at the plant",
    tag: "Steam quality",
    brief:
      "A process is underperforming and there's water hammer on start-up. A separator catch-pot on the main is collecting water. Conductivity in the condensate is high and the boiler is steaming hard with high TDS. Work out the steam quality and where the water is coming from.",
    knownFacts: [
      "A test separator catches the water in a measured flow",
      "Steam main at 7 bar g",
      "Boiler TDS is high and load swings rapidly",
      "Use the steam table for the latent heat at 7 bar g (hfg = 2,048 kJ/kg)",
    ],
    readings: [
      { label: "Steam + water flow", value: "2,000", unit: "kg/h" },
      { label: "Water caught by separator", value: "100", unit: "kg/h" },
      { label: "Condensate conductivity", value: "high", note: "carryover signature" },
      { label: "Boiler TDS", value: "high; rapid load swings", note: "priming conditions" },
    ],
    refTables: ["steam"],
    calcParts: [
      {
        id: "dryness",
        prompt: "What is the dryness fraction of the steam?",
        unit: "(fraction)",
        answer: 0.95,
        tol: 0.01,
        tolType: "abs",
        hints: [
          "Dryness fraction x = dry steam ÷ total flow = (total − water) ÷ total.",
          "(2,000 − 100) ÷ 2,000.",
        ],
        worked: "x = (2,000 − 100) ÷ 2,000 = 1,900 ÷ 2,000 = 0.95.",
      },
      {
        id: "penalty",
        prompt: "By what percentage is the delivered latent heat reduced?",
        unit: "%",
        answer: 5,
        tol: 1,
        tolType: "abs",
        hints: [
          "Only the dry fraction carries latent heat. The shortfall is (1 − x) × 100.",
          "x = 0.95, so (1 − 0.95) × 100.",
        ],
        worked: "Latent delivered = x × hfg = 0.95 × 2,048 ≈ 1,946 vs 2,048 kJ/kg dry → 5% less.",
      },
    ],
    candidateCauseIds: ["poor-separation", "stall", "carryover-boiler", "trap-failed-open"],
    correctCauseIds: ["carryover-boiler", "poor-separation"],
    candidateActionIds: ["fit-separator", "repair-trap", "control-boiler-tds", "fit-flash-recovery"],
    correctActionIds: ["control-boiler-tds", "fit-separator"],
    improvementActionIds: [],
    debrief:
      "A dryness fraction of 0.95 means 5% of your 'steam' is water — poorer heat transfer, erosion and water hammer. The high condensate conductivity and high boiler TDS with swinging load point upstream: the boiler is priming and carrying water over (a direct link to your boiler water-treatment work). Fix the root cause by controlling boiler TDS, and fit a separator on the main as mechanical protection for the plant.",
    faultChain: [
      "Separator catches 100 kg/h water in 2,000 kg/h → dryness 0.95",
      "5% less latent heat, plus erosion and water hammer",
      "High boiler TDS + swinging load → carryover/priming is the source",
      "Fix: control boiler TDS; fit a separator on the main",
    ],
  },
];

export function getSteamCase(id: string): SteamCase | undefined {
  return STEAM_CASES.find((c) => c.id === id);
}
