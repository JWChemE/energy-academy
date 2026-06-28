/**
 * Lighting diagnostic cases — over-lighting, LED retrofit, out-of-hours
 * scheduling, occupancy sensing, daylight harvesting, magnetic-ballast losses,
 * controls that aren't commissioned, and cheap-LED quality failure. A mix of
 * quantify-the-saving, reason-from-symptoms and judgement. Numbers consistent
 * with lib/lightingTables.ts. Built on the shared diagnostics core.
 *
 * The lighting hierarchy runs through every case: light to the right LEVEL,
 * with the most efficient SOURCE, on only WHEN and WHERE needed — schedule,
 * then occupancy, then daylight. Most waste is one of those links missing.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const LIGHTING_CAUSES: CauseDef[] = [
  { id: "over-lit", label: "Space lit well above its task target (over-lighting)" },
  { id: "inefficient-lamps", label: "Old, inefficient lamp technology in use" },
  { id: "no-scheduling", label: "Lights left on out of hours — no time/BMS scheduling" },
  { id: "no-occupancy-control", label: "Intermittently used space lit continuously — no presence control" },
  { id: "no-daylight-control", label: "Daylit area fully lit regardless of daylight — no dimming" },
  { id: "magnetic-ballast", label: "Magnetic control gear wasting power (and flickering)" },
  { id: "controls-not-commissioned", label: "Controls fitted but poorly commissioned — not delivering" },
  { id: "poor-quality-led", label: "Cheap LED — failing early, flicker/glare, overstated output" },
  { id: "under-lit", label: "Light level below the task target (comfort/safety issue)" },
  { id: "correct-as-is", label: "Lighting appropriate for the task — no fault" },
];

export const LIGHTING_ACTIONS: ActionDef[] = [
  { id: "reduce-to-target", label: "Dim or de-lamp down to the task target", tier: 1 },
  { id: "recommission-controls", label: "Recommission / reset the existing controls", tier: 1 },
  { id: "clean-lighting-strategy", label: "Schedule cleaning in hours / use reduced 'clean lighting'", tier: 1 },
  { id: "fit-scheduling", label: "Fit time scheduling / BMS control", tier: 2 },
  { id: "fit-occupancy-sensors", label: "Fit occupancy / vacancy sensors", tier: 2 },
  { id: "fit-daylight-dimming", label: "Fit photosensor daylight dimming on daylit zones", tier: 2 },
  { id: "fit-electronic-ballasts", label: "Replace magnetic ballasts with electronic", tier: 2 },
  { id: "led-retrofit", label: "Retrofit the lamps/luminaires to LED", tier: 3 },
  { id: "replace-quality-led", label: "Replace with quality LED (CRI>80, good driver, 5-yr warranty)", tier: 3 },
  { id: "add-controls", label: "Add occupancy + daylight controls at the same time", tier: 3 },
  { id: "relamp-like-for-like", label: "Relamp like-for-like with the same product", tier: 2 },
  { id: "add-luminaires", label: "Add more luminaires", tier: 3 },
];

export type LightingRefTable = "efficacy" | "lux" | "prices" | "controls" | "ballast";

export interface LightingCase extends DiagnosticCase {
  refTables: LightingRefTable[];
}

export const LIGHTING_CASES: LightingCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "over-lit",
    title: "Case 1 — Brighter than the brief",
    tag: "Over-lighting",
    brief:
      "An open-plan office feels glary. Your lux meter on the working plane reads 750 lux across the desks — but the design target for general office work is 500 lux. Every lumen above the target is electricity spent on light no one needs. Quantify the over-lighting and the saving from correcting it.",
    knownFacts: [
      "Measured illuminance 750 lux; task target 500 lux",
      "Installed lighting load for the area: 10 kW",
      "Lit ~3,000 h/yr; electricity £0.20/kWh",
      "Luminaires are dimmable",
    ],
    readings: [
      { label: "Measured illuminance", value: "750", unit: "lux", note: "on the working plane" },
      { label: "Task target", value: "500", unit: "lux", note: "EN 12464-1 general office" },
      { label: "Installed lighting load", value: "10", unit: "kW" },
      { label: "Hours lit", value: "3,000", unit: "h/yr" },
    ],
    refTables: ["lux", "prices"],
    calcParts: [
      {
        id: "over-pct",
        prompt: "How far above target is the space lit?",
        unit: "%",
        answer: 50,
        tol: 3,
        tolType: "abs",
        hints: ["(measured − target) ÷ target × 100.", "(750 − 500) ÷ 500 × 100."],
        worked: "(750 − 500) ÷ 500 = 50% over the task target.",
      },
      {
        id: "reduction",
        prompt: "What fraction of the CURRENT lighting load can come off to reach 500 lux?",
        unit: "%",
        answer: 33,
        tol: 2,
        tolType: "abs",
        hints: [
          "Illuminance is proportional to power. Cut = (measured − target) ÷ measured.",
          "(750 − 500) ÷ 750 × 100.",
        ],
        worked:
          "(750 − 500) ÷ 750 = 33%. (Note the asymmetry: 50% over target, but only a 33% cut of the present load gets you back to it.)",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 2000,
        tol: 0.06,
        tolType: "rel",
        hints: ["Cut fraction × load × hours × price.", "0.333 × 10 × 3,000 × 0.20."],
        worked: "0.333 × 10 kW × 3,000 h × £0.20 ≈ £2,000/yr, just for lighting to the right level.",
      },
    ],
    candidateCauseIds: ["over-lit", "inefficient-lamps", "under-lit", "correct-as-is"],
    correctCauseIds: ["over-lit"],
    candidateActionIds: ["reduce-to-target", "add-luminaires", "led-retrofit", "relamp-like-for-like"],
    correctActionIds: ["reduce-to-target"],
    improvementActionIds: ["led-retrofit"],
    debrief:
      "Lighting to the right level is itself an efficiency measure. At 750 lux against a 500 lux target the space is 50% over-lit, and dimming (or removing a third of the lamps) cuts ~£2,000/yr while fixing the glare. Watch the asymmetry: being 50% over target only needs a 33% cut of the present load. Adding luminaires is the opposite of the fix; an LED retrofit saves more again but the free win is simply turning the level down.",
    faultChain: [
      "Measured 750 lux vs 500 lux target → 50% over-lit",
      "Illuminance ∝ power, so a 33% load cut reaches target",
      "≈ £2,000/yr, plus less glare",
      "Fix: dim or de-lamp to the task target",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "high-bay-retrofit",
    title: "Case 2 — The 400-watt dinosaurs",
    tag: "LED retrofit",
    brief:
      "A warehouse is lit by 40 metal-halide high-bay fittings, each drawing 400 W including gear, running two shifts. Metal halide is yesterday's technology — an LED high-bay delivers the same light for far less. Work out the retrofit savings and payback.",
    knownFacts: [
      "40 high-bay fittings, 400 W each (metal halide, incl. gear)",
      "LED replacements draw 150 W for the same light",
      "Run ~6,000 h/yr; electricity £0.20/kWh",
      "Retrofit cost ≈ £16,000 installed",
    ],
    readings: [
      { label: "Fittings", value: "40", unit: "", note: "metal-halide high-bay" },
      { label: "Power each (now)", value: "400", unit: "W" },
      { label: "Power each (LED)", value: "150", unit: "W" },
      { label: "Run hours", value: "6,000", unit: "h/yr" },
      { label: "Retrofit cost", value: "16,000", unit: "£" },
    ],
    refTables: ["efficacy", "prices"],
    calcParts: [
      {
        id: "saving-each",
        prompt: "What power is saved per fitting?",
        unit: "kW",
        answer: 0.25,
        tol: 0.02,
        tolType: "abs",
        hints: ["(old − new) watts, then ÷ 1,000.", "(400 − 150) ÷ 1,000."],
        worked: "(400 − 150) = 250 W = 0.25 kW saved per fitting.",
      },
      {
        id: "annual",
        prompt: "What is the annual saving across all 40 fittings?",
        unit: "£/yr",
        answer: 12000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Saving each × number × hours × price.", "0.25 × 40 × 6,000 × 0.20."],
        worked: "0.25 × 40 = 10 kW; × 6,000 h × £0.20 = £12,000/yr.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback?",
        unit: "years",
        answer: 1.33,
        tol: 0.1,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "16,000 ÷ 12,000."],
        worked: "£16,000 ÷ £12,000 ≈ 1.3 years — before counting the maintenance and relamping LED saves on top.",
      },
    ],
    candidateCauseIds: ["inefficient-lamps", "over-lit", "magnetic-ballast", "correct-as-is"],
    correctCauseIds: ["inefficient-lamps"],
    candidateActionIds: ["led-retrofit", "relamp-like-for-like", "add-luminaires", "reduce-to-target"],
    correctActionIds: ["led-retrofit"],
    improvementActionIds: ["add-controls"],
    debrief:
      "High-wattage, long-hours lighting like metal-halide high-bay is the textbook LED retrofit: ~£12,000/yr saved at a ~1.3-year payback, with LED's long life cutting costly high-access relamping on top. Treat it as a mini-redesign — LED's directionality often means fewer fittings, and adding occupancy/daylight controls at the same time compounds the saving. Relamping like-for-like with more metal halide would lock in the waste.",
    faultChain: [
      "40 × 400 W metal-halide high-bay, 6,000 h/yr",
      "LED does the same for 150 W → 0.25 kW saved each",
      "≈ £12,000/yr; ~1.3-yr payback",
      "Fix: LED retrofit (and add controls while you're there)",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "out-of-hours",
    title: "Case 3 — Lit for the cleaners",
    tag: "Scheduling",
    brief:
      "An office floor is fully lit far beyond working hours: the cleaners switch everything on at 5am and it stays on until the last person leaves late evening, plus a wing left lit all weekend. Nobody schedules it. Work out the cost of the burning hours.",
    knownFacts: [
      "Floor lighting load 15 kW",
      "Genuinely needs lighting ~55 h/week",
      "Actually lit ~110 h/week (early starts, late offs, weekends)",
      "Electricity £0.20/kWh",
    ],
    readings: [
      { label: "Lighting load", value: "15", unit: "kW" },
      { label: "Hours genuinely needed", value: "55", unit: "h/wk" },
      { label: "Hours actually lit", value: "110", unit: "h/wk", note: "no scheduling" },
      { label: "Control", value: "manual switches", note: "follows memory, not a timetable" },
    ],
    refTables: ["prices", "controls"],
    calcParts: [
      {
        id: "avoidable-hours",
        prompt: "How many avoidable lit hours per week is that?",
        unit: "h/wk",
        answer: 55,
        tol: 3,
        tolType: "abs",
        hints: ["Hours lit − hours needed.", "110 − 55."],
        worked: "110 − 55 = 55 avoidable hours every week.",
      },
      {
        id: "avoidable-kwh",
        prompt: "How much energy is that per year?",
        unit: "kWh/yr",
        answer: 42900,
        tol: 0.04,
        tolType: "rel",
        hints: ["Load × avoidable hours/week × 52.", "15 × 55 × 52."],
        worked: "15 kW × 55 h/wk × 52 = 42,900 kWh/yr.",
      },
      {
        id: "cost",
        prompt: "What is it costing per year?",
        unit: "£/yr",
        answer: 8580,
        tol: 0.05,
        tolType: "rel",
        hints: ["Energy × price.", "42,900 × 0.20."],
        worked: "42,900 × £0.20 ≈ £8,580/yr burning when the floor is empty.",
      },
    ],
    candidateCauseIds: ["no-scheduling", "no-occupancy-control", "over-lit", "correct-as-is"],
    correctCauseIds: ["no-scheduling"],
    candidateActionIds: ["fit-scheduling", "clean-lighting-strategy", "add-luminaires", "led-retrofit"],
    correctActionIds: ["fit-scheduling"],
    improvementActionIds: ["clean-lighting-strategy"],
    debrief:
      "Lights following human memory rather than a timetable is one of the most common and cheapest-to-fix wastes — here ~£8,580/yr. Time scheduling via the BMS, with separate weekday/weekend/holiday patterns and an override-with-timeout for late workers, sets when lighting is permitted at all. Lighting whole floors for a single cleaner is the classic culprit: schedule cleaning in hours, or give them reduced 'clean lighting' and occupancy sensing so only their area lights.",
    faultChain: [
      "Lit ~110 h/wk but needed only ~55 h/wk",
      "55 avoidable h/wk × 15 kW × 52 ≈ 42,900 kWh/yr",
      "≈ £8,580/yr",
      "Fix: time/BMS scheduling (+ a clean-lighting strategy)",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "occupancy",
    title: "Case 4 — Empty but bright",
    tag: "Occupancy",
    brief:
      "The toilets, changing rooms and storerooms are lit all day, every day the building is open — but people are only in them a fraction of the time. These intermittently occupied spaces are where presence detection pays best. Quantify the saving.",
    knownFacts: [
      "Lighting in these spaces totals 3 kW",
      "Lit ~4,000 h/yr (building open hours)",
      "Occupancy/vacancy sensing typically saves ~50% here",
      "Sensors cost ≈ £600; electricity £0.20/kWh",
    ],
    readings: [
      { label: "Lighting load", value: "3", unit: "kW", note: "toilets, changing, stores" },
      { label: "Hours lit", value: "4,000", unit: "h/yr", note: "but used intermittently" },
      { label: "Typical sensor saving", value: "50", unit: "%" },
      { label: "Sensor cost", value: "600", unit: "£" },
    ],
    refTables: ["controls", "prices"],
    calcParts: [
      {
        id: "current",
        prompt: "What do these spaces cost to light per year now?",
        unit: "£/yr",
        answer: 2400,
        tol: 0.04,
        tolType: "rel",
        hints: ["Load × hours × price.", "3 × 4,000 × 0.20."],
        worked: "3 kW × 4,000 h × £0.20 = £2,400/yr.",
      },
      {
        id: "saving",
        prompt: "What would occupancy sensing save per year at ~50%?",
        unit: "£/yr",
        answer: 1200,
        tol: 0.05,
        tolType: "rel",
        hints: ["Current cost × saving fraction.", "2,400 × 0.50."],
        worked: "£2,400 × 0.50 = £1,200/yr.",
      },
      {
        id: "payback",
        prompt: "What is the payback on the sensors?",
        unit: "years",
        answer: 0.5,
        tol: 0.1,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "600 ÷ 1,200."],
        worked: "£600 ÷ £1,200 = 0.5 years — six months.",
      },
    ],
    candidateCauseIds: ["no-occupancy-control", "no-scheduling", "over-lit", "correct-as-is"],
    correctCauseIds: ["no-occupancy-control"],
    candidateActionIds: ["fit-occupancy-sensors", "fit-daylight-dimming", "add-luminaires", "led-retrofit"],
    correctActionIds: ["fit-occupancy-sensors"],
    improvementActionIds: [],
    debrief:
      "Intermittently occupied but often-lit spaces — toilets, changing rooms, stores, corridors — are where presence detection earns most (40–65%), here ~£1,200/yr at a six-month payback. Vacancy sensing (manual-on, auto-off) saves even more where daylight often suffices. Note the discipline of matching control to space: the same sensors in a constantly occupied open-plan office would save little, because there's almost no empty time to exploit.",
    faultChain: [
      "3 kW lit 4,000 h/yr in intermittently used spaces",
      "Occupancy sensing saves ~50% → ~£1,200/yr",
      "Sensors ~£600 → ~0.5-yr payback",
      "Fix: fit occupancy / vacancy sensors",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "daylight",
    title: "Case 5 — Sunlit and switched on",
    tag: "Daylight",
    brief:
      "The window-side rows of an office are at full output all day, even in bright sun streaming through the glazing. There's no photosensor dimming. The daylight is free; the electric light beside the windows is largely wasted. Quantify the harvesting opportunity — for the perimeter only.",
    knownFacts: [
      "Perimeter (window-row) lighting load 6 kW",
      "Lit ~3,000 h/yr at full output, no daylight control",
      "Daylight dimming saves ~45% in a window perimeter zone",
      "Photosensor dimming controls ≈ £3,000; £0.20/kWh",
    ],
    readings: [
      { label: "Perimeter lighting load", value: "6", unit: "kW", note: "window rows" },
      { label: "Hours lit", value: "3,000", unit: "h/yr", note: "full output regardless of sun" },
      { label: "Perimeter daylight saving", value: "45", unit: "%" },
      { label: "Controls cost", value: "3,000", unit: "£" },
    ],
    refTables: ["controls", "prices"],
    calcParts: [
      {
        id: "current",
        prompt: "What does the perimeter lighting cost per year now?",
        unit: "£/yr",
        answer: 3600,
        tol: 0.04,
        tolType: "rel",
        hints: ["Load × hours × price.", "6 × 3,000 × 0.20."],
        worked: "6 kW × 3,000 h × £0.20 = £3,600/yr.",
      },
      {
        id: "saving",
        prompt: "What would daylight dimming save per year at ~45%?",
        unit: "£/yr",
        answer: 1620,
        tol: 0.05,
        tolType: "rel",
        hints: ["Current cost × saving fraction.", "3,600 × 0.45."],
        worked: "£3,600 × 0.45 = £1,620/yr.",
      },
      {
        id: "payback",
        prompt: "What is the payback on the controls?",
        unit: "years",
        answer: 1.85,
        tol: 0.1,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "3,000 ÷ 1,620."],
        worked: "£3,000 ÷ £1,620 ≈ 1.9 years.",
      },
    ],
    candidateCauseIds: ["no-daylight-control", "no-occupancy-control", "over-lit", "correct-as-is"],
    correctCauseIds: ["no-daylight-control"],
    candidateActionIds: ["fit-daylight-dimming", "add-luminaires", "fit-occupancy-sensors", "led-retrofit"],
    correctActionIds: ["fit-daylight-dimming"],
    improvementActionIds: ["fit-occupancy-sensors"],
    debrief:
      "Where daylight actually reaches — within ~4–6 m of glazing, or under rooflights — continuous photosensor dimming keeps illuminance constant while cutting 30–60% of perimeter lighting energy, here ~£1,620/yr. Crucially it's zoned: only the window rows are daylight-controlled. Extending dimming to the deep interior would cost money for almost no return, because little daylight gets there. Commission it on site — poor commissioning is why daylight schemes disappoint.",
    faultChain: [
      "Window rows at full output all day; no photosensor",
      "Perimeter daylight dimming saves ~45% → ~£1,620/yr",
      "Controls ~£3,000 → ~1.9-yr payback",
      "Fix: zoned daylight dimming on the perimeter (commission well)",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "magnetic-ballast",
    title: "Case 6 — The hum in the ceiling",
    tag: "Control gear",
    brief:
      "A bank of older fluorescent fittings hums faintly and flickers at the edge of vision. You clamp one fitting: it draws 68 W for a 58 W tube. The extra 10 W is the magnetic ballast wasting power as heat. Across the installation it adds up — quantify the gear loss.",
    knownFacts: [
      "200 fittings, each a 58 W T8 tube on a magnetic ballast",
      "Measured fitting power 68 W (tube is rated 58 W)",
      "Lit ~3,000 h/yr; electricity £0.20/kWh",
      "Flicker and hum reported (magnetic ballast signatures)",
    ],
    readings: [
      { label: "Fittings", value: "200", unit: "", note: "T8 fluorescent, magnetic ballast" },
      { label: "Measured fitting power", value: "68", unit: "W" },
      { label: "Tube rating", value: "58", unit: "W", note: "difference is ballast loss" },
      { label: "Hours lit", value: "3,000", unit: "h/yr" },
    ],
    refTables: ["ballast", "prices"],
    calcParts: [
      {
        id: "loss-each",
        prompt: "What is the ballast loss per fitting?",
        unit: "W",
        answer: 10,
        tol: 1,
        tolType: "abs",
        hints: ["Measured fitting power − tube rating.", "68 − 58."],
        worked: "68 − 58 = 10 W lost in each ballast as heat.",
      },
      {
        id: "total-loss",
        prompt: "What total power is wasted across the 200 fittings?",
        unit: "kW",
        answer: 2,
        tol: 0.1,
        tolType: "abs",
        hints: ["Loss each × number, ÷ 1,000.", "200 × 10 ÷ 1,000."],
        worked: "200 × 10 W = 2,000 W = 2 kW of pure ballast loss.",
      },
      {
        id: "cost",
        prompt: "What is that ballast loss costing per year?",
        unit: "£/yr",
        answer: 1200,
        tol: 0.05,
        tolType: "rel",
        hints: ["Power × hours × price.", "2 × 3,000 × 0.20."],
        worked: "2 kW × 3,000 h × £0.20 = £1,200/yr wasted in the gear alone.",
      },
    ],
    candidateCauseIds: ["magnetic-ballast", "over-lit", "poor-quality-led", "correct-as-is"],
    correctCauseIds: ["magnetic-ballast"],
    candidateActionIds: ["fit-electronic-ballasts", "led-retrofit", "relamp-like-for-like", "add-luminaires"],
    correctActionIds: ["fit-electronic-ballasts"],
    improvementActionIds: ["led-retrofit"],
    debrief:
      "A magnetic ballast wastes 10–20% of a tube's power as heat and causes the flicker and hum — here ~£1,200/yr in the gear before you even count the tubes. Electronic ballasts remove most of that loss and the flicker, and enable dimming. Better still, an LED retrofit deletes the ballast and the tube together for a far bigger saving — the stronger long-term move. Relamping like-for-like keeps the magnetic ballast and pays for its losses forever.",
    faultChain: [
      "68 W measured for a 58 W tube → 10 W ballast loss each",
      "200 fittings → 2 kW of gear loss",
      "≈ £1,200/yr in the ballasts alone",
      "Fix: electronic ballasts (or, better, LED retrofit)",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "controls-not-commissioned",
    title: "Case 7 — Smart controls, dumb settings",
    tag: "Commissioning",
    brief:
      "A space was fitted with occupancy controls last year and signed off — but the lighting bill barely moved. You log the circuit for a fortnight: the lights are off only 5% of the hours, when the design promised around 40%. The sensors are fitted but the settings defeat them (huge time delay, over-sensitive). The fix is a screwdriver, not a capital project.",
    knownFacts: [
      "Lighting load 8 kW, lit ~4,000 h/yr",
      "Design occupancy saving was ~40%",
      "Logged data shows only ~5% actually achieved",
      "Recommissioning is essentially no-cost; £0.20/kWh",
    ],
    readings: [
      { label: "Lighting load", value: "8", unit: "kW" },
      { label: "Hours", value: "4,000", unit: "h/yr" },
      { label: "Design saving", value: "40", unit: "%", note: "what occupancy control should give" },
      { label: "Achieved saving", value: "5", unit: "%", note: "logged — controls not delivering" },
    ],
    refTables: ["controls", "prices"],
    calcParts: [
      {
        id: "expected",
        prompt: "What saving SHOULD the controls deliver per year (at 40%)?",
        unit: "£/yr",
        answer: 2560,
        tol: 0.04,
        tolType: "rel",
        hints: ["Saving fraction × load × hours × price.", "0.40 × 8 × 4,000 × 0.20."],
        worked: "0.40 × 8 kW × 4,000 h × £0.20 = £2,560/yr.",
      },
      {
        id: "actual",
        prompt: "What are they actually delivering (at 5%)?",
        unit: "£/yr",
        answer: 320,
        tol: 0.05,
        tolType: "rel",
        hints: ["Same calculation at 5%.", "0.05 × 8 × 4,000 × 0.20."],
        worked: "0.05 × 8 × 4,000 × £0.20 = £320/yr.",
      },
      {
        id: "recoverable",
        prompt: "What is recoverable just by recommissioning?",
        unit: "£/yr",
        answer: 2240,
        tol: 0.05,
        tolType: "rel",
        hints: ["Expected − actual.", "2,560 − 320."],
        worked: "£2,560 − £320 = £2,240/yr recoverable at essentially no capital cost.",
      },
    ],
    candidateCauseIds: ["controls-not-commissioned", "no-occupancy-control", "poor-quality-led", "correct-as-is"],
    correctCauseIds: ["controls-not-commissioned"],
    candidateActionIds: ["recommission-controls", "fit-occupancy-sensors", "add-luminaires", "relamp-like-for-like"],
    correctActionIds: ["recommission-controls"],
    improvementActionIds: [],
    debrief:
      "Controls savings are the easiest to overstate and the most often undelivered — which is why you log the circuit to see what they actually do. Here the sensors are fine; the commissioning isn't (time delay far too long, sensitivity wrong), so they almost never switch off. Recommissioning recovers ~£2,240/yr for the price of a site visit. Ripping out and re-buying sensors would be paying again for kit that already works — verify and tune before you spend.",
    faultChain: [
      "Occupancy controls fitted but bill barely moved",
      "Logged 5% saving vs 40% designed",
      "≈ £2,240/yr lost to bad settings — recoverable at ~no cost",
      "Fix: recommission / retune the existing controls",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "poor-quality-led",
    title: "Case 8 — The bargain that wasn't",
    tag: "Quality",
    brief:
      "Two years ago 100 budget LED panels went in, sold as lasting 50,000 hours (over a decade at these hours). They're already dropping like flies — 25 have failed this year from cooked drivers — and staff complain of flicker and a sickly colour. Cheap LED fails on the driver and thermal design, not the diode. Put a number on it.",
    knownFacts: [
      "100 budget LED panels installed 2 years ago",
      "Rated 50,000 h, but 25 have failed already this year",
      "Replacement + access cost ≈ £48 per fitting",
      "Flicker and poor colour rendering reported",
    ],
    readings: [
      { label: "Fittings installed", value: "100", unit: "", note: "budget LED, 2 yrs ago" },
      { label: "Failed this year", value: "25", unit: "", note: "cooked drivers" },
      { label: "Replace + access cost", value: "48", unit: "£/fitting" },
      { label: "Light quality", value: "flicker, low CRI", note: "complaints" },
    ],
    refTables: ["efficacy", "prices"],
    calcParts: [
      {
        id: "fail-pct",
        prompt: "What percentage of the fittings have already failed?",
        unit: "%",
        answer: 25,
        tol: 2,
        tolType: "abs",
        hints: ["Failed ÷ installed × 100.", "25 ÷ 100 × 100."],
        worked: "25 ÷ 100 = 25% in two years — for a product rated to last over a decade.",
      },
      {
        id: "year-cost",
        prompt: "What did this year's failures cost to replace?",
        unit: "£",
        answer: 1200,
        tol: 0.05,
        tolType: "rel",
        hints: ["Failures × cost each.", "25 × 48."],
        worked: "25 × £48 = £1,200 this year alone.",
      },
      {
        id: "five-year",
        prompt: "If failures continue at this rate, what's the 5-year replacement bill?",
        unit: "£",
        answer: 6000,
        tol: 0.05,
        tolType: "rel",
        hints: ["This year's cost × 5.", "1,200 × 5."],
        worked: "£1,200 × 5 = £6,000 of avoidable replacements — plus the disruption and the bad light quality throughout.",
      },
    ],
    candidateCauseIds: ["poor-quality-led", "magnetic-ballast", "inefficient-lamps", "correct-as-is"],
    correctCauseIds: ["poor-quality-led"],
    candidateActionIds: ["replace-quality-led", "relamp-like-for-like", "add-luminaires", "reduce-to-target"],
    correctActionIds: ["replace-quality-led"],
    improvementActionIds: [],
    debrief:
      "Efficacy isn't the whole story: a cheap LED's driver and thermal design decide its real life, and these are failing at 25% in two years with flicker and poor colour to boot. The 'saving' from buying the cheapest evaporates in repeated relamping (~£6,000 over five years) and a grim space. Replace with reputable products — verified lumen output, CRI above 80, low flicker, high power-factor drivers and a 5-year-plus warranty. Buying the same bargain again just repeats the cycle.",
    faultChain: [
      "Budget LED panels failing at 25% in two years",
      "Cooked drivers + flicker + poor CRI",
      "~£1,200/yr now → ~£6,000 over five years, plus bad light",
      "Fix: replace with quality LED (good driver, CRI>80, warranty)",
    ],
  },
];

export function getLightingCase(id: string): LightingCase | undefined {
  return LIGHTING_CASES.find((c) => c.id === id);
}
