/**
 * Insulation diagnostic cases — bare pipework, bare valves/fittings, an unlagged
 * vessel, economic thickness, a cold-pipe vapour-barrier failure, a material
 * mismatch, surface-temperature safety, and lagging removed in maintenance. A
 * mix of quantify-the-loss, read-the-numbers and judgement. Numbers consistent
 * with lib/insulationTables.ts. Built on the shared diagnostics core.
 *
 * The discipline is mechanical/industrial insulation: hot surfaces bleed heat
 * continuously and cheaply fixed, but the thickness is set by economics AND by
 * safety, the material by temperature/moisture/fire, and the job is only done if
 * the fittings are covered and the lagging is reinstated after maintenance.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const INSULATION_CAUSES: CauseDef[] = [
  { id: "bare-hot-pipe", label: "Bare hot pipework losing heat continuously" },
  { id: "bare-valves-fittings", label: "Bare valves / flanges / fittings left uninsulated" },
  { id: "bare-vessel", label: "Unlagged hot vessel / tank" },
  { id: "under-economic-thickness", label: "Insulated below the economic thickness (too thin)" },
  { id: "vapour-barrier-breach", label: "Cold-pipe vapour barrier breached — insulation soaked" },
  { id: "material-mismatch", label: "Wrong insulation material (conductivity / temperature / fire)" },
  { id: "hot-surface-burn-risk", label: "Accessible hot surface above the safe-touch limit" },
  { id: "lagging-removed", label: "Lagging removed for maintenance and never reinstated" },
  { id: "over-insulated", label: "Insulated well beyond the economic thickness (wasteful)" },
  { id: "insulation-adequate", label: "Insulation appropriate — no fault" },
];

export const INSULATION_ACTIONS: ActionDef[] = [
  { id: "reinstate-lagging", label: "Reinstate the removed lagging", tier: 1 },
  { id: "lag-pipe", label: "Lag the bare pipework", tier: 2 },
  { id: "fit-removable-jackets", label: "Fit removable insulation jackets to valves / fittings / vessels", tier: 2 },
  { id: "lag-vessel", label: "Lag the vessel (jacket / mattress)", tier: 2 },
  { id: "upgrade-to-economic-thickness", label: "Add insulation up to the economic thickness", tier: 2 },
  { id: "replace-closed-cell-vapour-barrier", label: "Replace with closed-cell insulation + continuous vapour barrier", tier: 2 },
  { id: "specify-correct-material", label: "Specify the correct material (thin high-performance / high-temp non-combustible)", tier: 2 },
  { id: "lag-to-safe-touch", label: "Insulate to a safe-touch surface temperature", tier: 2 },
  { id: "fit-guarding", label: "Fit a guard / barrier where insulation can't achieve safe touch", tier: 2 },
  { id: "add-more-mineral-wool", label: "Just cram in more mineral wool", tier: 1 },
  { id: "over-insulate-max", label: "Insulate to maximum thickness regardless of cost", tier: 3 },
  { id: "warning-label-only", label: "Apply a warning label only", tier: 1 },
  { id: "do-nothing", label: "Leave it / it's only temporary", tier: 1 },
];

export type InsulationRefTable = "heatloss" | "pipeloss" | "lambda" | "economic" | "safety" | "prices";

export interface InsulationCase extends DiagnosticCase {
  refTables: InsulationRefTable[];
}

export const INSULATION_CASES: InsulationCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "bare-steam-main",
    title: "Case 1 — The bare steam main",
    tag: "Pipe lagging",
    brief:
      "A 100 m run of 100 mm steam main runs bare through a plant room at 150 °C, radiating heat into a space nobody's trying to heat. Bare hot pipe is one of the cheapest, fastest-payback fixes in any facility. Quantify the loss.",
    knownFacts: [
      "100 m of bare 100 mm steam pipe at 150 °C; room 20 °C",
      "A bare pipe this size loses ~500 W per metre",
      "Lagging cuts the loss by ~90%",
      "Runs ~8,000 h/yr; displaced heat £0.06/kWh; lagging ≈ £10,000",
    ],
    readings: [
      { label: "Pipe run", value: "100", unit: "m" },
      { label: "Operating temperature", value: "150", unit: "°C" },
      { label: "Bare loss per metre", value: "500", unit: "W/m" },
      { label: "Run hours", value: "8,000", unit: "h/yr" },
    ],
    refTables: ["pipeloss", "prices"],
    calcParts: [
      {
        id: "total-loss",
        prompt: "What is the total heat loss from the bare run?",
        unit: "kW",
        answer: 50,
        tol: 2,
        tolType: "abs",
        hints: ["Loss per metre × length, ÷ 1,000 for kW.", "500 × 100 ÷ 1,000."],
        worked: "500 W/m × 100 m = 50,000 W = 50 kW lost continuously.",
      },
      {
        id: "saving",
        prompt: "What would lagging it save per year (90% reduction)?",
        unit: "£/yr",
        answer: 21600,
        tol: 0.05,
        tolType: "rel",
        hints: ["0.90 × loss × hours × price.", "0.90 × 50 × 8,000 × 0.06."],
        worked: "0.90 × 50 kW × 8,000 h × £0.06 = £21,600/yr.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback?",
        unit: "years",
        answer: 0.46,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "10,000 ÷ 21,600."],
        worked: "£10,000 ÷ £21,600 ≈ 0.46 years — under six months.",
      },
    ],
    candidateCauseIds: ["bare-hot-pipe", "bare-valves-fittings", "insulation-adequate", "over-insulated"],
    correctCauseIds: ["bare-hot-pipe"],
    candidateActionIds: ["lag-pipe", "fit-removable-jackets", "do-nothing", "over-insulate-max"],
    correctActionIds: ["lag-pipe"],
    improvementActionIds: [],
    debrief:
      "Bare hot pipe is the classic quick win: 50 kW bled continuously into a plant room, ~£21,600/yr, paid back in under six months by simply lagging it. The heat isn't even useful — it's overheating the plant room. Rock wool or calcium silicate sections suit the temperature; the only reason these are ever left bare is that nobody walks the plant room with a thermal camera.",
    faultChain: [
      "100 m of bare 100 mm steam pipe at 150 °C",
      "500 W/m × 100 m = 50 kW lost",
      "Lagging saves ~£21,600/yr; ~0.5-yr payback",
      "Fix: lag the pipework",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "bare-valves",
    title: "Case 2 — The valves nobody lagged",
    tag: "Fittings",
    brief:
      "The pipe runs are lagged, but the valves and flanges are bare — they were 'too awkward'. A single bare valve can lose as much heat as several metres of pipe, and there are twenty of them on this steam header. Quantify what the fittings alone are costing.",
    knownFacts: [
      "20 bare valves/flanges on a steam header",
      "Each loses ≈ 1.2 kW (like several metres of bare pipe)",
      "Removable insulation jackets cut the loss ~90% and still allow access",
      "Runs ~8,000 h/yr; displaced heat £0.06/kWh; jackets ≈ £150 each (£3,000)",
    ],
    readings: [
      { label: "Bare valves/flanges", value: "20", unit: "", note: "left uninsulated" },
      { label: "Loss per valve", value: "1.2", unit: "kW" },
      { label: "Run hours", value: "8,000", unit: "h/yr" },
      { label: "Jacket cost", value: "150", unit: "£ each" },
    ],
    refTables: ["pipeloss", "prices"],
    calcParts: [
      {
        id: "total-loss",
        prompt: "What is the total heat loss from the bare valves?",
        unit: "kW",
        answer: 24,
        tol: 1,
        tolType: "abs",
        hints: ["Number × loss each.", "20 × 1.2."],
        worked: "20 × 1.2 kW = 24 kW from the fittings alone.",
      },
      {
        id: "saving",
        prompt: "What would removable jackets save per year (90%)?",
        unit: "£/yr",
        answer: 10368,
        tol: 0.05,
        tolType: "rel",
        hints: ["0.90 × loss × hours × price.", "0.90 × 24 × 8,000 × 0.06."],
        worked: "0.90 × 24 kW × 8,000 h × £0.06 = £10,368/yr.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback on the £3,000 of jackets?",
        unit: "years",
        answer: 0.29,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "3,000 ÷ 10,368."],
        worked: "£3,000 ÷ £10,368 ≈ 0.29 years — about 15 weeks.",
      },
    ],
    candidateCauseIds: ["bare-valves-fittings", "bare-hot-pipe", "insulation-adequate", "lagging-removed"],
    correctCauseIds: ["bare-valves-fittings"],
    candidateActionIds: ["fit-removable-jackets", "lag-pipe", "do-nothing", "over-insulate-max"],
    correctActionIds: ["fit-removable-jackets"],
    improvementActionIds: [],
    debrief:
      "Valves and flanges are left bare because they're fiddly to lag and need access for maintenance — but each one leaks like several metres of pipe, here 24 kW for the twenty of them. Removable insulation jackets solve both problems: they cover the fitting and unclip for maintenance, so the lagging actually stays on. ~£10,368/yr at a 15-week payback.",
    faultChain: [
      "Pipe runs lagged, but 20 valves left bare",
      "1.2 kW each → 24 kW total",
      "Removable jackets save ~£10,368/yr; ~0.3-yr payback",
      "Fix: fit removable insulation jackets to the fittings",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "bare-vessel",
    title: "Case 3 — The tank that heats the plant room",
    tag: "Vessels",
    brief:
      "A thermal-imaging survey lights up a 1,000-litre hot-water calorifier — bare steel, glowing on the camera at 70 °C. Large hot surfaces lose heat across their whole area. Quantify the loss and the easy recovery.",
    knownFacts: [
      "Bare calorifier: surface area ~5 m², surface 70 °C, room 20 °C",
      "Bare hot surface: U ≈ 6 W/m²K (the steel adds almost no resistance)",
      "An insulating jacket cuts the loss ~90%",
      "Runs continuously ~8,760 h/yr; displaced heat £0.06/kWh; jacket ≈ £600",
    ],
    readings: [
      { label: "Surface area", value: "5", unit: "m²" },
      { label: "Surface temperature", value: "70", unit: "°C" },
      { label: "Room temperature", value: "20", unit: "°C" },
      { label: "Bare-surface U", value: "6", unit: "W/m²K" },
    ],
    refTables: ["heatloss", "prices"],
    calcParts: [
      {
        id: "bare-loss",
        prompt: "What is the bare tank's heat loss (Q = U·A·ΔT)?",
        unit: "kW",
        answer: 1.5,
        tol: 0.05,
        tolType: "rel",
        hints: ["U × A × ΔT, ÷ 1,000 for kW. ΔT = 70 − 20.", "6 × 5 × 50 ÷ 1,000."],
        worked: "6 × 5 × 50 = 1,500 W = 1.5 kW lost continuously.",
      },
      {
        id: "saving",
        prompt: "What would a jacket save per year (90%)?",
        unit: "£/yr",
        answer: 710,
        tol: 0.06,
        tolType: "rel",
        hints: ["0.90 × loss × hours × price.", "0.90 × 1.5 × 8,760 × 0.06."],
        worked: "0.90 × 1.5 kW × 8,760 h × £0.06 ≈ £710/yr.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback on the £600 jacket?",
        unit: "years",
        answer: 0.85,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "600 ÷ 710."],
        worked: "£600 ÷ £710 ≈ 0.85 years.",
      },
    ],
    candidateCauseIds: ["bare-vessel", "bare-hot-pipe", "insulation-adequate", "material-mismatch"],
    correctCauseIds: ["bare-vessel"],
    candidateActionIds: ["lag-vessel", "fit-removable-jackets", "do-nothing", "lag-pipe"],
    correctActionIds: ["lag-vessel"],
    improvementActionIds: ["fit-removable-jackets"],
    debrief:
      "An unlagged hot tank loses heat across its whole surface — 1.5 kW here, ~£710/yr, warming the plant room instead of holding the water hot. A fitted jacket or strapped mineral-wool mattress cuts 85–95% of it for under a year's payback. Use removable jackets around manways, sightglasses and instruments so the lagging survives inspections. A thermal-imaging walk of any plant room usually finds several of these glowing.",
    faultChain: [
      "Bare 1,000 L calorifier at 70 °C, glowing on the camera",
      "U·A·ΔT = 6 × 5 × 50 = 1.5 kW",
      "A jacket saves ~£710/yr; ~0.85-yr payback",
      "Fix: lag the vessel (removable jackets at fittings)",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "economic-thickness",
    title: "Case 4 — Thin lagging, thick losses",
    tag: "Economic thickness",
    brief:
      "A 200 m hot main is lagged — but only with 25 mm of insulation, where the standard (BS 5422) calls for around 80 mm at this temperature. It's not bare, but it's well below the economic thickness, leaking heat that thicker lagging would cheaply stop. Quantify the upgrade — and know when to stop.",
    knownFacts: [
      "200 m of main; the thin 25 mm lagging loses ~200 W/m",
      "At the economic thickness (~80 mm) it would lose ~80 W/m",
      "Going thicker than ~80 mm saves only ~20 W/m more (diminishing returns)",
      "Runs ~8,000 h/yr; displaced heat £0.06/kWh; topping-up ≈ £16,000",
    ],
    readings: [
      { label: "Main length", value: "200", unit: "m" },
      { label: "Loss now (25 mm)", value: "200", unit: "W/m", note: "below economic thickness" },
      { label: "Loss at 80 mm", value: "80", unit: "W/m", note: "economic optimum" },
      { label: "Run hours", value: "8,000", unit: "h/yr" },
    ],
    refTables: ["economic", "prices"],
    calcParts: [
      {
        id: "saving-per-m",
        prompt: "How much less would each metre lose at the economic thickness?",
        unit: "W/m",
        answer: 120,
        tol: 5,
        tolType: "abs",
        hints: ["Loss now − loss at economic thickness.", "200 − 80."],
        worked: "200 − 80 = 120 W/m saved by going to the economic thickness.",
      },
      {
        id: "saving",
        prompt: "What is the total saving per year across the run?",
        unit: "£/yr",
        answer: 11520,
        tol: 0.05,
        tolType: "rel",
        hints: ["Saving/m × length × hours × price.", "120 × 200 ÷ 1,000 × 8,000 × 0.06."],
        worked: "120 × 200 = 24,000 W = 24 kW; × 8,000 h × £0.06 = £11,520/yr.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback on the £16,000 upgrade?",
        unit: "years",
        answer: 1.4,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "16,000 ÷ 11,520."],
        worked: "£16,000 ÷ £11,520 ≈ 1.4 years.",
      },
    ],
    candidateCauseIds: ["under-economic-thickness", "bare-hot-pipe", "over-insulated", "insulation-adequate"],
    correctCauseIds: ["under-economic-thickness"],
    candidateActionIds: ["upgrade-to-economic-thickness", "over-insulate-max", "do-nothing", "lag-pipe"],
    correctActionIds: ["upgrade-to-economic-thickness"],
    improvementActionIds: [],
    debrief:
      "Thin lagging is a hidden loss: 25 mm where 80 mm belongs leaks 120 W/m, ~£11,520/yr, recovered in ~1.4 years. But note the other half of the lesson — diminishing returns. Each added millimetre saves less than the last, so going beyond the ~80 mm economic thickness (which BS 5422 tabulates by size and temperature) spends more on insulation than you'll ever recover. Hit the optimum: not bare, not gold-plated.",
    faultChain: [
      "200 m lagged with only 25 mm → 200 W/m",
      "Economic thickness (~80 mm) → 80 W/m; save 120 W/m",
      "24 kW ≈ £11,520/yr; ~1.4-yr payback",
      "Fix: upgrade to the economic thickness (not beyond it)",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "cold-pipe-condensation",
    title: "Case 5 — The sweating chilled line",
    tag: "Cold pipes",
    brief:
      "A chilled-water line at 5 °C is insulated, but it's dripping, the lagging is dark and sagging, and there's ice at the fittings. The vapour barrier has failed, so moist room air is reaching the cold pipe, condensing inside the insulation, soaking it and wrecking its performance — and corroding the pipe. This isn't a 'needs more insulation' problem.",
    knownFacts: [
      "Chilled line at 5 °C; lagging soaked, dripping, ice on fittings",
      "Dry it should gain ~0.2 kW; soaked it now gains ~1.0 kW",
      "Cooling provided at COP 3; electricity £0.20/kWh",
      "Runs ~8,760 h/yr; plus corrosion and a slip hazard from the drips",
    ],
    readings: [
      { label: "Line temperature", value: "5", unit: "°C" },
      { label: "Heat gain (dry)", value: "0.2", unit: "kW" },
      { label: "Heat gain (soaked)", value: "1.0", unit: "kW", note: "vapour barrier breached" },
      { label: "Cooling COP", value: "3", unit: "" },
    ],
    refTables: ["lambda", "prices"],
    calcParts: [
      {
        id: "extra-gain",
        prompt: "How much extra heat is the soaked insulation letting in?",
        unit: "kW",
        answer: 0.8,
        tol: 0.05,
        tolType: "abs",
        hints: ["Soaked gain − dry gain.", "1.0 − 0.2."],
        worked: "1.0 − 0.2 = 0.8 kW of extra load on the chiller.",
      },
      {
        id: "extra-elec",
        prompt: "How much extra compressor power is that (COP 3)?",
        unit: "kW",
        answer: 0.27,
        tol: 0.05,
        tolType: "rel",
        hints: ["Cooling load ÷ COP.", "0.8 ÷ 3."],
        worked: "0.8 ÷ 3 ≈ 0.27 kW of extra electricity.",
      },
      {
        id: "cost",
        prompt: "What is that costing per year?",
        unit: "£/yr",
        answer: 473,
        tol: 0.08,
        tolType: "rel",
        hints: ["Extra power × hours × price.", "0.27 × 8,760 × 0.20."],
        worked: "0.27 × 8,760 × £0.20 ≈ £473/yr — before the corrosion and slip-hazard costs.",
      },
    ],
    candidateCauseIds: ["vapour-barrier-breach", "under-economic-thickness", "material-mismatch", "insulation-adequate"],
    correctCauseIds: ["vapour-barrier-breach"],
    candidateActionIds: ["replace-closed-cell-vapour-barrier", "add-more-mineral-wool", "do-nothing", "lag-pipe"],
    correctActionIds: ["replace-closed-cell-vapour-barrier"],
    improvementActionIds: [],
    debrief:
      "On a cold pipe the enemy isn't just heat gain — it's moisture. A breached vapour barrier lets room air reach the cold surface, where it condenses inside the insulation, soaking it (so it conducts like wet cloth), corroding the pipe and dripping onto the floor. The fix is the right system, not more of the wrong one: closed-cell elastomeric insulation with a continuous, sealed vapour barrier on the outside. Adding mineral wool — which is vapour-open — would just soak up more water.",
    faultChain: [
      "Chilled line dripping, lagging soaked, ice on fittings",
      "Heat gain up from 0.2 to 1.0 kW → ~£473/yr plus corrosion",
      "Vapour barrier breached — moisture in the insulation",
      "Fix: closed-cell insulation with a continuous vapour barrier",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "material-mismatch",
    title: "Case 6 — No room for mineral wool",
    tag: "Materials",
    brief:
      "A pipe runs through a tight service void with only 40 mm of clearance, and the spec calls for a thermal resistance of 1.5 m²K/W. Someone has tried to pack in mineral wool, but it can't reach the resistance in the space. The answer is a thinner, higher-performance material — match the material to the constraint.",
    knownFacts: [
      "Target thermal resistance R = 1.5 m²K/W; only 40 mm of space",
      "Mineral wool λ = 0.040 W/m·K",
      "PIR / phenolic λ = 0.020 W/m·K (aerogel lower still)",
      "Thickness for a resistance = λ × R; resistance achieved = thickness ÷ λ",
    ],
    readings: [
      { label: "Target resistance", value: "1.5", unit: "m²K/W" },
      { label: "Space available", value: "40", unit: "mm" },
      { label: "Mineral wool λ", value: "0.040", unit: "W/m·K" },
      { label: "PIR λ", value: "0.020", unit: "W/m·K" },
    ],
    refTables: ["lambda", "heatloss"],
    calcParts: [
      {
        id: "mw-thickness",
        prompt: "How thick must mineral wool be to reach R = 1.5?",
        unit: "mm",
        answer: 60,
        tol: 3,
        tolType: "abs",
        hints: ["Thickness = λ × R (in metres, then ×1,000 for mm).", "0.040 × 1.5 = 0.060 m."],
        worked: "0.040 × 1.5 = 0.060 m = 60 mm — but only 40 mm fits.",
      },
      {
        id: "mw-r-at-40",
        prompt: "What resistance does 40 mm of mineral wool actually give?",
        unit: "m²K/W",
        answer: 1.0,
        tol: 0.05,
        tolType: "abs",
        hints: ["Resistance = thickness ÷ λ.", "0.040 ÷ 0.040."],
        worked: "0.040 m ÷ 0.040 = 1.0 m²K/W — well short of the 1.5 target.",
      },
      {
        id: "pir-thickness",
        prompt: "How thick must PIR be to reach R = 1.5?",
        unit: "mm",
        answer: 30,
        tol: 2,
        tolType: "abs",
        hints: ["Thickness = λ × R.", "0.020 × 1.5 = 0.030 m."],
        worked: "0.020 × 1.5 = 0.030 m = 30 mm — fits the 40 mm void with room to spare.",
      },
    ],
    candidateCauseIds: ["material-mismatch", "under-economic-thickness", "bare-hot-pipe", "insulation-adequate"],
    correctCauseIds: ["material-mismatch"],
    candidateActionIds: ["specify-correct-material", "add-more-mineral-wool", "over-insulate-max", "do-nothing"],
    correctActionIds: ["specify-correct-material"],
    improvementActionIds: [],
    debrief:
      "There's no universally best insulant — you match the material to the constraint. Where space is tight, a low-conductivity material (PIR, phenolic, or aerogel) reaches the target resistance in far less thickness than mineral wool: 30 mm of PIR beats 60 mm of mineral wool, and only 40 mm was available. (The same logic runs the other way on a hot pipe, where you'd choose temperature-rated, non-combustible rock wool or calcium silicate over foam, regardless of λ.) Cramming in more of the wrong material just compresses it and still falls short.",
    faultChain: [
      "Target R = 1.5 in a 40 mm void",
      "Mineral wool needs 60 mm; 40 mm gives only R = 1.0",
      "PIR reaches R = 1.5 in 30 mm — it fits",
      "Fix: specify the correct (thin, high-performance) material",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "surface-safety",
    title: "Case 7 — Hot at head height",
    tag: "Safety",
    brief:
      "A bare hot pipe at 120 °C runs at head height along a maintenance walkway. Above ~70 °C a touch burns skin in about a second; the safe-touch limit is around 50 °C. This is an energy loss and a burn hazard — and on safety grounds the insulation isn't optional, even where the energy payback alone is modest.",
    knownFacts: [
      "30 m of bare pipe at 120 °C, at head height on a walkway",
      "Bare loss ≈ 350 W/m; lagging cuts it ~90%",
      "Safe-touch limit ≈ 50 °C; above ~70 °C burns in ~1 second",
      "Runs ~8,000 h/yr; displaced heat £0.06/kWh; lagging ≈ £3,600",
    ],
    readings: [
      { label: "Pipe run", value: "30", unit: "m", note: "head height, walkway" },
      { label: "Surface temperature", value: "120", unit: "°C", note: "burns in ~1 s" },
      { label: "Bare loss per metre", value: "350", unit: "W/m" },
      { label: "Safe-touch limit", value: "50", unit: "°C" },
    ],
    refTables: ["safety", "pipeloss", "prices"],
    calcParts: [
      {
        id: "bare-loss",
        prompt: "What is the bare run's heat loss?",
        unit: "kW",
        answer: 10.5,
        tol: 0.3,
        tolType: "abs",
        hints: ["Loss per metre × length ÷ 1,000.", "350 × 30 ÷ 1,000."],
        worked: "350 W/m × 30 m = 10,500 W = 10.5 kW.",
      },
      {
        id: "saving",
        prompt: "What would lagging save per year (90%)?",
        unit: "£/yr",
        answer: 4536,
        tol: 0.05,
        tolType: "rel",
        hints: ["0.90 × loss × hours × price.", "0.90 × 10.5 × 8,000 × 0.06."],
        worked: "0.90 × 10.5 kW × 8,000 h × £0.06 ≈ £4,536/yr.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback?",
        unit: "years",
        answer: 0.79,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "3,600 ÷ 4,536."],
        worked: "£3,600 ÷ £4,536 ≈ 0.79 years — and it removes a burn hazard regardless.",
      },
    ],
    candidateCauseIds: ["hot-surface-burn-risk", "bare-hot-pipe", "insulation-adequate", "over-insulated"],
    correctCauseIds: ["hot-surface-burn-risk"],
    candidateActionIds: ["lag-to-safe-touch", "warning-label-only", "do-nothing", "fit-guarding"],
    correctActionIds: ["lag-to-safe-touch"],
    improvementActionIds: ["fit-guarding"],
    debrief:
      "Surface-temperature safety is a hard requirement, not a nice-to-have. A 120 °C surface at head height will burn in about a second; insulation must bring accessible surfaces to the safe-touch limit (~50 °C). Here the energy payback is good anyway (~£4,536/yr, ~0.8 years), but even where it weren't, the safety case would still mandate lagging — or physical guarding where insulation can't get the surface cool enough (very hot flues). A warning label alone doesn't remove the hazard.",
    faultChain: [
      "120 °C bare pipe at head height — burns in ~1 s",
      "350 W/m × 30 m = 10.5 kW lost (~£4,536/yr)",
      "Safe-touch limit ~50 °C — safety mandates action",
      "Fix: insulate to safe touch (guard where impractical)",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "lagging-removed",
    title: "Case 8 — Hacked off and forgotten",
    tag: "Maintenance",
    brief:
      "A thermal-imaging survey after a heat-exchanger overhaul finds bare patches glowing: the contractor cut the lagging off to do the work and never put it back, leaving sections of pipe and several valves exposed. It's not a design gap — it's a maintenance failure. Quantify the loss and stop it recurring.",
    knownFacts: [
      "12 m of pipe left bare at ~400 W/m, plus 4 bare valves at ~1.0 kW each",
      "Reinstating proper lagging recovers ~90% of the loss",
      "Runs ~8,000 h/yr; displaced heat £0.06/kWh; reinstatement ≈ £2,000",
      "Removable jackets would let future maintenance happen without hacking lagging off",
    ],
    readings: [
      { label: "Bare pipe", value: "12", unit: "m", note: "at ~400 W/m" },
      { label: "Bare valves", value: "4", unit: "", note: "~1.0 kW each" },
      { label: "Run hours", value: "8,000", unit: "h/yr" },
      { label: "Cause", value: "maintenance", note: "lagging removed, never reinstated" },
    ],
    refTables: ["pipeloss", "prices"],
    calcParts: [
      {
        id: "pipe-loss",
        prompt: "What is the loss from the bare pipe sections?",
        unit: "kW",
        answer: 4.8,
        tol: 0.2,
        tolType: "abs",
        hints: ["Length × loss per metre ÷ 1,000.", "12 × 400 ÷ 1,000."],
        worked: "12 m × 400 W/m = 4,800 W = 4.8 kW.",
      },
      {
        id: "total-loss",
        prompt: "What is the total bare loss including the valves?",
        unit: "kW",
        answer: 8.8,
        tol: 0.3,
        tolType: "abs",
        hints: ["Pipe loss + valves (4 × 1.0 kW).", "4.8 + 4.0."],
        worked: "4.8 + (4 × 1.0) = 8.8 kW exposed since the overhaul.",
      },
      {
        id: "saving",
        prompt: "What would reinstating the lagging save per year (90%)?",
        unit: "£/yr",
        answer: 3802,
        tol: 0.06,
        tolType: "rel",
        hints: ["0.90 × loss × hours × price.", "0.90 × 8.8 × 8,000 × 0.06."],
        worked: "0.90 × 8.8 kW × 8,000 h × £0.06 ≈ £3,802/yr.",
      },
    ],
    candidateCauseIds: ["lagging-removed", "bare-hot-pipe", "under-economic-thickness", "insulation-adequate"],
    correctCauseIds: ["lagging-removed"],
    candidateActionIds: ["reinstate-lagging", "fit-removable-jackets", "do-nothing", "over-insulate-max"],
    correctActionIds: ["reinstate-lagging"],
    improvementActionIds: ["fit-removable-jackets"],
    debrief:
      "Lagging hacked off for maintenance and never replaced is one of the most common losses in any plant — 8.8 kW here, ~£3,802/yr, invisible until a thermal camera finds it. Reinstate it. Then prevent the recurrence: fitting removable insulation jackets to the heat exchanger and its valves means the next overhaul can happen without destroying the insulation, so it actually goes back on. Make 'reinstate the lagging' a line on the maintenance sign-off.",
    faultChain: [
      "Heat-exchanger overhaul left 12 m pipe + 4 valves bare",
      "12 × 400 W/m + 4 × 1.0 kW = 8.8 kW lost",
      "Reinstating saves ~£3,802/yr",
      "Fix: reinstate the lagging; fit removable jackets to prevent recurrence",
    ],
  },
];

export function getInsulationCase(id: string): InsulationCase | undefined {
  return INSULATION_CASES.find((c) => c.id === id);
}
