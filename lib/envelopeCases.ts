/**
 * Building-envelope diagnostic cases — loft and cavity insulation, air leakage,
 * thermal bridging, solid-wall insulation, glazing sequencing, summer solar
 * gain, and the build-tight-ventilate-right trap. A mix of quantify-the-saving,
 * reason-from-symptoms and judgement. Numbers consistent with
 * lib/envelopeTables.ts. Built on the shared diagnostics core.
 *
 * One discipline runs through every case: FABRIC FIRST, IN SEQUENCE — cheapest,
 * highest-impact measures before expensive ones, and never a measure that
 * causes moisture or overheating problems it doesn't pay for.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const ENVELOPE_CAUSES: CauseDef[] = [
  { id: "uninsulated-roof", label: "Roof / loft uninsulated or under-insulated" },
  { id: "uninsulated-cavity", label: "Unfilled cavity wall" },
  { id: "solid-wall-uninsulated", label: "Uninsulated solid (no-cavity) wall" },
  { id: "air-leakage", label: "Excessive uncontrolled air leakage (draughts)" },
  { id: "thermal-bridging", label: "Thermal bridging at junctions — cold surfaces, mould" },
  { id: "single-glazing", label: "Single / poor glazing (high U-value)" },
  { id: "excess-solar-gain", label: "Excessive solar gain — summer overheating" },
  { id: "airtight-no-ventilation", label: "Sealed airtight without controlled ventilation" },
  { id: "penetrating-damp", label: "Penetrating / rising damp (not a thermal fault)" },
  { id: "fabric-adequate", label: "Fabric appropriate for the building — no fault" },
];

export const ENVELOPE_ACTIONS: ActionDef[] = [
  { id: "insulate-loft", label: "Insulate the loft / roof to current standard", tier: 1 },
  { id: "draught-proof", label: "Draught-proof and seal the air-leakage paths", tier: 1 },
  { id: "prioritise-cheaper-fabric", label: "Do the low-cost fabric measures first (fabric-first sequence)", tier: 1 },
  { id: "survey-suitability", label: "Survey suitability before filling (cavity/damp check)", tier: 1 },
  { id: "cavity-fill", label: "Fill the cavity with blown insulation", tier: 2 },
  { id: "add-controlled-ventilation", label: "Add controlled trickle / extract ventilation", tier: 2 },
  { id: "external-shading", label: "Fit external shading (overhang / louvres / fins)", tier: 2 },
  { id: "treat-thermal-bridges", label: "Treat junctions with continuous / insulated details", tier: 3 },
  { id: "ext-wall-insulation", label: "External wall insulation (EWI)", tier: 3 },
  { id: "int-wall-insulation", label: "Internal wall insulation with vapour control", tier: 3 },
  { id: "replace-glazing", label: "Replace with whole-window low-U glazing", tier: 3 },
  { id: "solar-control-glazing", label: "Fit solar-control glazing", tier: 3 },
  { id: "add-mvhr", label: "Add mechanical ventilation with heat recovery (MVHR)", tier: 3 },
  { id: "internal-blinds", label: "Fit internal blinds", tier: 1 },
  { id: "low-e-coating", label: "Fit a low-E (heat-loss) coating", tier: 3 },
  { id: "oversize-boiler", label: "Install a bigger boiler to compensate", tier: 3 },
];

export type EnvelopeRefTable = "uvalues" | "annual" | "airtight" | "glazing" | "prices";

export interface EnvelopeCase extends DiagnosticCase {
  refTables: EnvelopeRefTable[];
}

export const ENVELOPE_CASES: EnvelopeCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "uninsulated-loft",
    title: "Case 1 — The open lid",
    tag: "Roof",
    brief:
      "You climb into the loft of a 1960s community centre and find bare joists — no insulation at all. A quarter of a building's heat escapes through the roof, and loft insulation is the cheapest fabric measure there is. Quantify the saving from insulating it.",
    knownFacts: [
      "Roof area 200 m²; currently uninsulated at U ≈ 2.3 W/m²K",
      "270 mm of insulation reaches U ≈ 0.15 W/m²K",
      "Loft insulation costs ≈ £15/m² (≈ £3,000)",
      "2,200 HDD/yr; gas £0.06/kWh; boiler 85%",
    ],
    readings: [
      { label: "Roof area", value: "200", unit: "m²" },
      { label: "U-value now", value: "2.3", unit: "W/m²K", note: "uninsulated" },
      { label: "U-value insulated", value: "0.15", unit: "W/m²K" },
      { label: "Insulation cost", value: "3,000", unit: "£" },
    ],
    refTables: ["uvalues", "annual"],
    calcParts: [
      {
        id: "loss-reduction",
        prompt: "By how much does the heat-loss rate fall (ΔU × area)?",
        unit: "W/K",
        answer: 430,
        tol: 10,
        tolType: "abs",
        hints: ["(U before − U after) × area.", "(2.3 − 0.15) × 200."],
        worked: "(2.3 − 0.15) × 200 = 2.15 × 200 = 430 W/K less heat loss.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year? (use the 52.8 kWh/W/K factor, gas ÷ 85%)",
        unit: "£/yr",
        answer: 1603,
        tol: 0.07,
        tolType: "rel",
        hints: [
          "Annual kWh = W/K × 52.8. Then £ = kWh ÷ 0.85 × 0.06.",
          "430 × 52.8 = 22,704 kWh; ÷ 0.85 × 0.06.",
        ],
        worked: "430 × 52.8 = 22,704 kWh; ÷ 0.85 × £0.06 ≈ £1,603/yr.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback?",
        unit: "years",
        answer: 1.87,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "3,000 ÷ 1,603."],
        worked: "£3,000 ÷ £1,603 ≈ 1.9 years — the fastest-paying fabric measure.",
      },
    ],
    candidateCauseIds: ["uninsulated-roof", "uninsulated-cavity", "single-glazing", "fabric-adequate"],
    correctCauseIds: ["uninsulated-roof"],
    candidateActionIds: ["insulate-loft", "cavity-fill", "replace-glazing", "oversize-boiler"],
    correctActionIds: ["insulate-loft"],
    improvementActionIds: [],
    debrief:
      "Roughly 25% of heat leaves through the roof, and loft insulation is the cheapest, fastest-paying measure in the whole fabric-first sequence — here ~£1,600/yr at under a two-year payback. Always do this before reaching for a bigger boiler or new windows. Lay it to the full current depth and don't block the eaves ventilation.",
    faultChain: [
      "Bare loft joists — U ≈ 2.3 on 200 m²",
      "Insulating to 0.15 cuts loss by 430 W/K",
      "≈ £1,600/yr at ~1.9-yr payback",
      "Fix: insulate the loft first",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "cavity-wall",
    title: "Case 2 — The empty cavity",
    tag: "Cavity wall",
    brief:
      "The centre's external walls are 1960s cavity construction, but a borescope through a drilled hole shows the cavity is empty. Filling a suitable cavity is cheap and pays back fast. Work out the prize — after a survey confirms it's suitable.",
    knownFacts: [
      "Wall area 300 m²; unfilled cavity at U ≈ 1.5 W/m²K",
      "Blown fill brings it to U ≈ 0.5 W/m²K",
      "Cavity fill costs ≈ £15/m² (≈ £4,500)",
      "2,200 HDD/yr; gas £0.06/kWh; boiler 85%",
    ],
    readings: [
      { label: "Wall area", value: "300", unit: "m²" },
      { label: "U-value now", value: "1.5", unit: "W/m²K", note: "empty cavity" },
      { label: "U-value filled", value: "0.5", unit: "W/m²K" },
      { label: "Fill cost", value: "4,500", unit: "£" },
    ],
    refTables: ["uvalues", "annual"],
    calcParts: [
      {
        id: "loss-reduction",
        prompt: "By how much does the heat-loss rate fall?",
        unit: "W/K",
        answer: 300,
        tol: 8,
        tolType: "abs",
        hints: ["(U before − U after) × area.", "(1.5 − 0.5) × 300."],
        worked: "(1.5 − 0.5) × 300 = 1.0 × 300 = 300 W/K.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 1118,
        tol: 0.07,
        tolType: "rel",
        hints: ["W/K × 52.8 = kWh; ÷ 0.85 × 0.06.", "300 × 52.8 = 15,840 kWh; ÷ 0.85 × 0.06."],
        worked: "300 × 52.8 = 15,840 kWh; ÷ 0.85 × £0.06 ≈ £1,118/yr.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback?",
        unit: "years",
        answer: 4.0,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "4,500 ÷ 1,118."],
        worked: "£4,500 ÷ £1,118 ≈ 4.0 years — a strong fabric measure where the cavity suits.",
      },
    ],
    candidateCauseIds: ["uninsulated-cavity", "solid-wall-uninsulated", "air-leakage", "fabric-adequate"],
    correctCauseIds: ["uninsulated-cavity"],
    candidateActionIds: ["cavity-fill", "survey-suitability", "ext-wall-insulation", "oversize-boiler"],
    correctActionIds: ["cavity-fill"],
    improvementActionIds: ["survey-suitability"],
    debrief:
      "A clear, suitable cavity fills for ~£15/m² with a payback under five years — far cheaper than solid-wall insulation, and it's why cavity fill sits second in the fabric-first sequence. The one rule: survey first. Exposed, damp or already-partly-filled cavities are unsuitable, so confirm before drilling. External wall insulation would work but is wholly disproportionate where a simple fill does the job.",
    faultChain: [
      "Borescope shows empty cavity — U ≈ 1.5 on 300 m²",
      "Filling to 0.5 cuts loss by 300 W/K",
      "≈ £1,118/yr at ~4-yr payback",
      "Fix: survey, then fill the cavity",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "air-leakage",
    title: "Case 3 — Heated, then thrown outside",
    tag: "Airtightness",
    brief:
      "Occupants complain of cold draughts at ankle level and the heating never quite copes. A blower-door test reads 12 ACH at 50 Pa — a leaky building. Every gap lets warm air out and pulls cold air in to be heated from scratch. Quantify the infiltration loss.",
    knownFacts: [
      "Heated volume 1,500 m³",
      "Blower-door result 12 ACH50; in-use rate ≈ ACH50 ÷ 20",
      "Heat to warm one air change ≈ 0.33 Wh/m³K",
      "2,200 HDD/yr; gas £0.06/kWh; boiler 85%",
    ],
    readings: [
      { label: "Heated volume", value: "1,500", unit: "m³" },
      { label: "Blower-door result", value: "12", unit: "ACH50", note: "leaky" },
      { label: "Draught complaints", value: "yes", note: "cold air at ankle level" },
    ],
    refTables: ["airtight", "annual"],
    calcParts: [
      {
        id: "ach-natural",
        prompt: "What is the in-use (natural) air-change rate?",
        unit: "ACH",
        answer: 0.6,
        tol: 0.05,
        tolType: "abs",
        hints: ["Divide the blower-door result by 20.", "12 ÷ 20."],
        worked: "12 ÷ 20 = 0.6 air changes per hour in normal use.",
      },
      {
        id: "loss-coeff",
        prompt: "What is the infiltration heat-loss coefficient?",
        unit: "W/K",
        answer: 297,
        tol: 0.05,
        tolType: "rel",
        hints: ["0.33 × ACH × volume.", "0.33 × 0.6 × 1,500."],
        worked: "0.33 × 0.6 × 1,500 = 297 W/K just from air leakage.",
      },
      {
        id: "cost",
        prompt: "What is that costing to heat per year?",
        unit: "£/yr",
        answer: 1107,
        tol: 0.07,
        tolType: "rel",
        hints: ["W/K × 52.8 = kWh; ÷ 0.85 × 0.06.", "297 × 52.8 = 15,682 kWh; ÷ 0.85 × 0.06."],
        worked: "297 × 52.8 = 15,682 kWh; ÷ 0.85 × £0.06 ≈ £1,107/yr leaking away.",
      },
    ],
    candidateCauseIds: ["air-leakage", "single-glazing", "uninsulated-roof", "fabric-adequate"],
    correctCauseIds: ["air-leakage"],
    candidateActionIds: ["draught-proof", "add-mvhr", "replace-glazing", "oversize-boiler"],
    correctActionIds: ["draught-proof"],
    improvementActionIds: ["add-mvhr"],
    debrief:
      "Infiltration can be 15–25% of heat loss — here ~£1,107/yr, and the source of the ankle-level draughts that make people crank the thermostat up. Smoke pencils and thermal imaging during the blower-door test pinpoint the paths (service penetrations, frame gaps, loft hatches, downlights). Seal them — but remember 'build tight, ventilate right': in a high-performance building, add MVHR so you keep fresh air without the draught penalty. A bigger boiler just heats more outside air.",
    faultChain: [
      "12 ACH50 → ~0.6 ACH in use on 1,500 m³",
      "0.33 × 0.6 × 1,500 = 297 W/K of infiltration",
      "≈ £1,107/yr, plus the draughts",
      "Fix: draught-proof the leakage paths (then ventilate right)",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "thermal-bridging",
    title: "Case 4 — Mould in the corner",
    tag: "Thermal bridging",
    brief:
      "A recently insulated room has black mould blooming in the cold corners and behind a cupboard on an external wall. The walls are insulated, so it isn't a lack of insulation — heat is bypassing it at the junctions. A thermal-imaging survey shows cold lines at the floor and parapet junctions, and the surface temperature factor there is below the safe limit.",
    knownFacts: [
      "Linear thermal bridges at junctions: psi (ψ) ≈ 0.9 W/mK",
      "Total junction length ≈ 120 m",
      "Inner-surface temperature factor fRsi ≈ 0.68 (mould risk above 0.75 is required)",
      "2,200 HDD/yr; gas £0.06/kWh; boiler 85%",
    ],
    readings: [
      { label: "Junction psi-value", value: "0.9", unit: "W/mK", note: "poorly detailed" },
      { label: "Junction length", value: "120", unit: "m" },
      { label: "Temperature factor fRsi", value: "0.68", unit: "", note: "below the 0.75 limit → mould" },
      { label: "Mould", value: "cold corners", note: "localised at junctions" },
    ],
    refTables: ["uvalues", "annual"],
    calcParts: [
      {
        id: "bridge-loss",
        prompt: "What is the heat loss through the linear bridges (ψ × length)?",
        unit: "W/K",
        answer: 108,
        tol: 4,
        tolType: "abs",
        hints: ["psi-value × total length.", "0.9 × 120."],
        worked: "0.9 × 120 = 108 W/K through the junctions alone.",
      },
      {
        id: "bridge-kwh",
        prompt: "What is that per year in heat?",
        unit: "kWh/yr",
        answer: 5702,
        tol: 0.05,
        tolType: "rel",
        hints: ["W/K × 52.8.", "108 × 52.8."],
        worked: "108 × 52.8 = 5,702 kWh/yr.",
      },
      {
        id: "bridge-cost",
        prompt: "What is that costing per year?",
        unit: "£/yr",
        answer: 403,
        tol: 0.08,
        tolType: "rel",
        hints: ["kWh ÷ 0.85 × 0.06.", "5,702 ÷ 0.85 × 0.06."],
        worked: "5,702 ÷ 0.85 × £0.06 ≈ £403/yr — plus the mould the cold surfaces cause.",
      },
    ],
    candidateCauseIds: ["thermal-bridging", "penetrating-damp", "air-leakage", "fabric-adequate"],
    correctCauseIds: ["thermal-bridging"],
    candidateActionIds: ["treat-thermal-bridges", "ext-wall-insulation", "add-controlled-ventilation", "oversize-boiler"],
    correctActionIds: ["treat-thermal-bridges"],
    improvementActionIds: ["add-controlled-ventilation"],
    debrief:
      "The clue is the pattern: mould in cold corners and at junctions, with fRsi (0.68) below the 0.75 limit, on walls that are already insulated — that's a thermal bridge, not missing insulation or rising damp. Heat bypasses the insulation at the junctions (~£403/yr), and the chilled inner surface drops below the dew point and grows mould. Treat the junctions with continuous/insulated details (a wrapping external layer is ideal); improving ventilation helps clear the moisture meanwhile. Bridges are cheap to design out and almost impossible to fix later.",
    faultChain: [
      "Mould in cold corners on insulated walls; fRsi 0.68 < 0.75",
      "ψ 0.9 × 120 m = 108 W/K bypassing the insulation",
      "≈ £403/yr plus condensation and mould",
      "Fix: treat the junctions with continuous insulated details",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "solid-wall",
    title: "Case 5 — No cavity to fill",
    tag: "Solid wall",
    brief:
      "A neighbouring Victorian wing has solid brick walls — no cavity at all. A contractor has quoted to 'pump the walls' like the cavity block next door. That's the wrong diagnosis: a solid wall has nowhere to pump. Work out the real measure and its economics.",
    knownFacts: [
      "Solid brick wall, 200 m², U ≈ 2.0 W/m²K (no cavity)",
      "External wall insulation (EWI) reaches U ≈ 0.30 W/m²K",
      "EWI costs ≈ £150/m² (≈ £30,000)",
      "2,200 HDD/yr; gas £0.06/kWh; boiler 85%",
    ],
    readings: [
      { label: "Wall area", value: "200", unit: "m²" },
      { label: "U-value now", value: "2.0", unit: "W/m²K", note: "solid — no cavity" },
      { label: "U-value with EWI", value: "0.30", unit: "W/m²K" },
      { label: "EWI cost", value: "30,000", unit: "£" },
    ],
    refTables: ["uvalues", "annual"],
    calcParts: [
      {
        id: "loss-reduction",
        prompt: "By how much does the heat-loss rate fall?",
        unit: "W/K",
        answer: 340,
        tol: 8,
        tolType: "abs",
        hints: ["(U before − U after) × area.", "(2.0 − 0.30) × 200."],
        worked: "(2.0 − 0.30) × 200 = 1.7 × 200 = 340 W/K.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 1268,
        tol: 0.07,
        tolType: "rel",
        hints: ["W/K × 52.8 = kWh; ÷ 0.85 × 0.06.", "340 × 52.8 = 17,952 kWh; ÷ 0.85 × 0.06."],
        worked: "340 × 52.8 = 17,952 kWh; ÷ 0.85 × £0.06 ≈ £1,268/yr.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback (energy only)?",
        unit: "years",
        answer: 23.7,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "30,000 ÷ 1,268."],
        worked: "£30,000 ÷ £1,268 ≈ 24 years on energy alone — transformative, but best bundled with other works.",
      },
    ],
    candidateCauseIds: ["solid-wall-uninsulated", "uninsulated-cavity", "thermal-bridging", "fabric-adequate"],
    correctCauseIds: ["solid-wall-uninsulated"],
    candidateActionIds: ["ext-wall-insulation", "cavity-fill", "int-wall-insulation", "oversize-boiler"],
    correctActionIds: ["ext-wall-insulation"],
    improvementActionIds: ["int-wall-insulation"],
    debrief:
      "The trap is treating a solid wall like a cavity — there's nothing to pump, so cavity fill is simply the wrong diagnosis. Solid walls need external (EWI) or internal (IWI) insulation. EWI is usually the better technical choice where appearance and planning allow: it adds no internal area, treats bridges continuously, and keeps the wall warm. IWI is the alternative for protected frontages, but watch interstitial condensation — a vapour-control layer and a risk assessment first. The ~24-year energy payback says: bundle it with re-rendering or refurbishment, where the economics transform.",
    faultChain: [
      "Solid brick wall, no cavity — U ≈ 2.0 on 200 m²",
      "Cavity fill is impossible; EWI brings it to 0.30 → 340 W/K",
      "≈ £1,268/yr; ~24-yr energy payback → bundle with works",
      "Fix: external wall insulation (IWI only with vapour control)",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "glazing-sequence",
    title: "Case 6 — Windows first?",
    tag: "Glazing",
    brief:
      "The single-glazed windows look tired, and the client wants to spend the whole budget replacing every window before anything else. New glazing is the most visible upgrade — but on pure energy grounds it usually has the longest payback of all. Run the numbers and advise on sequence.",
    knownFacts: [
      "Single glazing, 80 m², U ≈ 5.0 W/m²K",
      "Modern double glazing reaches U ≈ 1.4 W/m²K",
      "Whole-window replacement ≈ £400/m² (≈ £32,000)",
      "2,200 HDD/yr; gas £0.06/kWh; boiler 85%",
    ],
    readings: [
      { label: "Glazing area", value: "80", unit: "m²" },
      { label: "U-value now", value: "5.0", unit: "W/m²K", note: "single glazing" },
      { label: "U-value new", value: "1.4", unit: "W/m²K", note: "double" },
      { label: "Replacement cost", value: "32,000", unit: "£" },
    ],
    refTables: ["glazing", "annual"],
    calcParts: [
      {
        id: "loss-reduction",
        prompt: "By how much does the heat-loss rate fall?",
        unit: "W/K",
        answer: 288,
        tol: 6,
        tolType: "abs",
        hints: ["(U before − U after) × area.", "(5.0 − 1.4) × 80."],
        worked: "(5.0 − 1.4) × 80 = 3.6 × 80 = 288 W/K.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 1073,
        tol: 0.07,
        tolType: "rel",
        hints: ["W/K × 52.8 = kWh; ÷ 0.85 × 0.06.", "288 × 52.8 = 15,206 kWh; ÷ 0.85 × 0.06."],
        worked: "288 × 52.8 = 15,206 kWh; ÷ 0.85 × £0.06 ≈ £1,073/yr.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback (energy only)?",
        unit: "years",
        answer: 29.8,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "32,000 ÷ 1,073."],
        worked: "£32,000 ÷ £1,073 ≈ 30 years on energy alone — which is why glazing comes late in the sequence.",
      },
    ],
    candidateCauseIds: ["single-glazing", "uninsulated-roof", "air-leakage", "fabric-adequate"],
    correctCauseIds: ["single-glazing"],
    candidateActionIds: ["prioritise-cheaper-fabric", "replace-glazing", "low-e-coating", "oversize-boiler"],
    correctActionIds: ["prioritise-cheaper-fabric"],
    improvementActionIds: ["replace-glazing"],
    debrief:
      "Windows are a small fraction of fabric area, so even a 70% cut in their loss is a modest whole-building saving — here a ~30-year energy payback. That's why fabric-first puts glazing last: do the loft, draughts and cavity first, where the same money saves far more. Glazing still earns its place for comfort, condensation and noise, or when windows need replacing anyway or can be bundled into wider works — but leading the whole budget with it is the wrong sequence. Spend on the cheap wins first.",
    faultChain: [
      "Single glazing, U 5.0 on 80 m² — client wants it done first",
      "Double glazing saves 288 W/K ≈ £1,073/yr",
      "~30-yr energy payback — the longest of all fabric measures",
      "Fix: do cheaper fabric first; bundle/justify glazing on comfort",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "solar-gain",
    title: "Case 7 — Baked every afternoon",
    tag: "Solar gain",
    brief:
      "A west-facing glazed meeting room overheats every sunny afternoon, and the air-conditioning runs flat out to cope. The low afternoon sun strikes the clear glazing almost head-on. This is a summer solar-gain problem — and the instinct to fit a low-E (heat-loss) coating would do nothing for it. Quantify the gain and the fix.",
    knownFacts: [
      "West glazing 100 m²; clear double glazing g-value ≈ 0.7",
      "Peak afternoon solar irradiance on the glass ≈ 500 W/m²",
      "Solar-control glazing would cut the g-value to ≈ 0.35",
      "Cooling COP ≈ 3; ~600 overheating hours/yr; electricity £0.20/kWh",
    ],
    readings: [
      { label: "West glazing area", value: "100", unit: "m²" },
      { label: "g-value (clear)", value: "0.7", unit: "", note: "admits 70% of solar heat" },
      { label: "Solar irradiance", value: "500", unit: "W/m²", note: "low sun, head-on" },
      { label: "g-value (solar-control)", value: "0.35", unit: "" },
    ],
    refTables: ["glazing", "prices"],
    calcParts: [
      {
        id: "gain-now",
        prompt: "What is the solar heat gain through the glazing now (g × area × irradiance)?",
        unit: "kW",
        answer: 35,
        tol: 1,
        tolType: "abs",
        hints: ["g × area × irradiance, then ÷ 1,000 for kW.", "0.7 × 100 × 500 ÷ 1,000."],
        worked: "0.7 × 100 × 500 = 35,000 W = 35 kW of solar heat pouring in.",
      },
      {
        id: "reduction",
        prompt: "How much would solar-control glazing (g 0.35) cut that gain?",
        unit: "kW",
        answer: 17.5,
        tol: 0.8,
        tolType: "abs",
        hints: ["Change in g × area × irradiance.", "(0.7 − 0.35) × 100 × 500 ÷ 1,000."],
        worked: "(0.7 − 0.35) × 100 × 500 = 17,500 W = 17.5 kW less heat to remove.",
      },
      {
        id: "cooling-saving",
        prompt: "What cooling electricity would that save per year (COP 3, 600 h)?",
        unit: "£/yr",
        answer: 700,
        tol: 0.08,
        tolType: "rel",
        hints: ["Electrical kW = heat ÷ COP; × hours × price.", "17.5 ÷ 3 × 600 × 0.20."],
        worked: "17.5 ÷ 3 = 5.83 kW; × 600 h × £0.20 ≈ £700/yr — plus a comfortable room.",
      },
    ],
    candidateCauseIds: ["excess-solar-gain", "single-glazing", "fabric-adequate", "air-leakage"],
    correctCauseIds: ["excess-solar-gain"],
    candidateActionIds: ["external-shading", "solar-control-glazing", "internal-blinds", "low-e-coating"],
    correctActionIds: ["external-shading"],
    improvementActionIds: ["solar-control-glazing"],
    debrief:
      "This is a summer gain problem, not a winter loss one — so a low-E coating (which reduces heat loss) is the wrong reflex. With low west sun striking the glass head-on, overhangs barely help; you need to stop the energy before it passes the glass. External shading (louvres/fins) is the most effective, because internal blinds only intercept heat that's already inside. Solar-control glazing (g 0.35) is a strong all-year option, cutting ~17.5 kW and ~£700/yr of cooling. Match the spec to the orientation — different elevations want different glass.",
    faultChain: [
      "West glazing, g 0.7, 500 W/m² head-on → 35 kW of solar gain",
      "Solar-control (g 0.35) halves it; ~£700/yr of cooling",
      "Low-E would do nothing — wrong season",
      "Fix: external shading (or solar-control glazing), not internal blinds",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "over-sealed",
    title: "Case 8 — Sealed too well",
    tag: "Ventilation",
    brief:
      "After an enthusiastic draught-proofing job, a building that used to be draughty is now stuffy, with streaming condensation on cold mornings and rising humidity complaints. They sealed it tight but added no ventilation — breaking the 'build tight, ventilate right' rule. The answer is controlled ventilation that doesn't throw the heat away.",
    knownFacts: [
      "Heated volume 1,500 m³; now very airtight",
      "Required fresh-air ventilation ≈ 0.5 ACH",
      "MVHR recovers ≈ 88% of the ventilation heat",
      "Heat per air change ≈ 0.33 Wh/m³K; 2,200 HDD/yr; gas £0.06/kWh; boiler 85%",
    ],
    readings: [
      { label: "Heated volume", value: "1,500", unit: "m³" },
      { label: "Required ventilation", value: "0.5", unit: "ACH", note: "for fresh air" },
      { label: "MVHR recovery", value: "88", unit: "%" },
      { label: "Symptoms", value: "stuffy, condensation", note: "no controlled ventilation" },
    ],
    refTables: ["airtight", "annual"],
    calcParts: [
      {
        id: "vent-loss",
        prompt: "What heat-loss coefficient does the required ventilation represent?",
        unit: "W/K",
        answer: 247.5,
        tol: 8,
        tolType: "abs",
        hints: ["0.33 × ACH × volume.", "0.33 × 0.5 × 1,500."],
        worked: "0.33 × 0.5 × 1,500 = 247.5 W/K of ventilation heat loss.",
      },
      {
        id: "recovered",
        prompt: "How much of that would MVHR recover (at 88%)?",
        unit: "W/K",
        answer: 217.8,
        tol: 8,
        tolType: "abs",
        hints: ["Ventilation loss × recovery fraction.", "247.5 × 0.88."],
        worked: "247.5 × 0.88 = 217.8 W/K recovered instead of lost.",
      },
      {
        id: "saving",
        prompt: "What is that recovered heat worth per year?",
        unit: "£/yr",
        answer: 812,
        tol: 0.08,
        tolType: "rel",
        hints: ["W/K × 52.8 = kWh; ÷ 0.85 × 0.06.", "217.8 × 52.8 = 11,500 kWh; ÷ 0.85 × 0.06."],
        worked: "217.8 × 52.8 = 11,500 kWh; ÷ 0.85 × £0.06 ≈ £812/yr — fresh air with the heat kept.",
      },
    ],
    candidateCauseIds: ["airtight-no-ventilation", "air-leakage", "penetrating-damp", "fabric-adequate"],
    correctCauseIds: ["airtight-no-ventilation"],
    candidateActionIds: ["add-mvhr", "draught-proof", "add-controlled-ventilation", "oversize-boiler"],
    correctActionIds: ["add-mvhr"],
    improvementActionIds: ["add-controlled-ventilation"],
    debrief:
      "This is the mirror image of the leaky-building case, and the classic unintended consequence of retrofit: seal a building airtight without ventilation and you trap moisture, causing condensation, stuffiness and mould. The fix is not to un-seal it (draught-proofing here would be undoing good work) but to add controlled ventilation — MVHR supplies fresh air while recovering ~88% of the heat, worth ~£812/yr versus simple extract. 'Build tight, ventilate right': the two halves go together.",
    faultChain: [
      "Sealed airtight but no ventilation → stuffy, condensation",
      "Required 0.5 ACH = 247.5 W/K of ventilation heat",
      "MVHR recovers ~88% → 217.8 W/K ≈ £812/yr kept",
      "Fix: add MVHR (don't un-seal the building)",
    ],
  },
];

export function getEnvelopeCase(id: string): EnvelopeCase | undefined {
  return ENVELOPE_CASES.find((c) => c.id === id);
}
