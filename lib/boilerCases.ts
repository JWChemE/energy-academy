/**
 * Diagnostic case library.
 *
 * Each case is a faulty plant configuration plus the candidate causes and
 * corrective actions the learner chooses between. Cases are deliberately
 * *differential*: the same symptom (e.g. a hot stack) appears across several
 * cases with different true root causes, so the learner must cross-reference
 * the instruments and the plant inspection to tell them apart.
 *
 * Every action carries a transform on the plant config, so the "verify" step
 * re-simulates the boiler with the learner's chosen fixes applied.
 */

import { PlantConfig } from "./boilerPlant";

// ---- master cause list (cases pick a correct subset; the rest are distractors) ----
export interface CauseDef {
  id: string;
  label: string;
}

export const ALL_CAUSES: CauseDef[] = [
  { id: "excess-air-high", label: "Burner out of tune — too much excess air" },
  { id: "air-starved", label: "Combustion air-starved — insufficient air" },
  { id: "economiser-fouled", label: "Economiser fitted but fouled / bypassed (not recovering heat)" },
  { id: "no-heat-recovery", label: "No economiser fitted — stack heat thrown away" },
  { id: "tubes-scaled", label: "Heat-transfer surfaces scaled / fouled" },
  { id: "water-treatment-inadequate", label: "Inadequate feedwater treatment (hardness reaching boiler)" },
  { id: "blowdown-too-low", label: "Blowdown too low — boiler TDS too high" },
  { id: "blowdown-too-high", label: "Blowdown too high — dumping heat needlessly" },
  { id: "no-deaerator", label: "No deaeration — cold, oxygen-bearing feedwater" },
  { id: "oversized-low-load", label: "Boiler oversized for the load — running at low fire" },
  { id: "insulation-poor", label: "Poor insulation — high radiation losses" },
  { id: "low-condensate", label: "Low condensate return — excess cold make-up" },
];

// ---- master action list with config transforms ----
export interface ActionDef {
  id: string;
  label: string;
  apply: (c: PlantConfig) => PlantConfig;
}

export const ALL_ACTIONS: ActionDef[] = [
  { id: "tune-burner", label: "Re-commission the burner (set excess O₂ to ~3.5%)", apply: (c) => ({ ...c, excessO2: 3.5 }) },
  { id: "increase-air", label: "Increase combustion air", apply: (c) => ({ ...c, excessO2: Math.min(c.excessO2 + 2.5, 9) }) },
  { id: "clean-economiser", label: "Clean / re-commission the economiser", apply: (c) => ({ ...c, economiser: c.economiser === "none" ? "none" : "ok" }) },
  { id: "fit-economiser", label: "Fit a condensing economiser (capital)", apply: (c) => ({ ...c, economiser: c.economiser === "none" ? "ok" : c.economiser }) },
  { id: "auto-blowdown", label: "Fit automatic TDS blowdown control", apply: (c) => ({ ...c, blowdownControl: "auto" }) },
  { id: "reduce-blowdown", label: "Reduce the manual blowdown rate", apply: (c) => ({ ...c, blowdownControl: "manual", blowdownManualRate: Math.max(c.blowdownManualRate - 3, 0.5) }) },
  { id: "increase-blowdown", label: "Increase the manual blowdown rate", apply: (c) => ({ ...c, blowdownControl: "manual", blowdownManualRate: c.blowdownManualRate + 3 }) },
  { id: "upgrade-ro", label: "Upgrade feedwater treatment to RO", apply: (c) => ({ ...c, waterTreatment: "ro", softenerExhausted: false }) },
  { id: "regenerate-softener", label: "Regenerate / service the softener", apply: (c) => ({ ...c, softenerExhausted: false }) },
  { id: "descale", label: "Chemically descale / clean the tubes", apply: (c) => ({ ...c, tubeScale: 0 }) },
  { id: "install-deaerator", label: "Install a deaerator", apply: (c) => ({ ...c, deaerator: true }) },
  { id: "increase-condensate", label: "Recover more condensate", apply: (c) => ({ ...c, condensateReturn: Math.min(c.condensateReturn + 35, 85) }) },
  { id: "repair-insulation", label: "Repair casing / pipe insulation", apply: (c) => ({ ...c, insulation: "good" }) },
  { id: "right-size-load", label: "Sequence onto a correctly sized boiler / raise firing rate", apply: (c) => ({ ...c, firingRate: 90 }) },
  { id: "replace-burner", label: "Replace the burner entirely (capital)", apply: (c) => ({ ...c, excessO2: 3.5 }) },
];

/**
 * Logical priority tier for sequencing the work — the energy hierarchy:
 * safety first, then no-cost/operational fixes, then remedial maintenance,
 * then capital improvements. Used to mark the *order* of the work plan loosely
 * (a sensible sequence is rewarded without nitpicking order within a tier).
 */
export const ACTION_TIER: Record<string, number> = {
  "increase-air": 0,
  "tune-burner": 1,
  "auto-blowdown": 1,
  "reduce-blowdown": 1,
  "increase-blowdown": 1,
  "regenerate-softener": 1,
  "repair-insulation": 1,
  "clean-economiser": 2,
  "descale": 2,
  "increase-condensate": 2,
  "fit-economiser": 3,
  "upgrade-ro": 3,
  "install-deaerator": 3,
  "right-size-load": 3,
  "replace-burner": 3,
};

export const TIER_LABEL: Record<number, string> = {
  0: "Safety-critical",
  1: "No-cost / operational",
  2: "Remedial maintenance",
  3: "Capital improvement",
};

export function actionTier(id: string): number {
  return ACTION_TIER[id] ?? 1;
}

export interface InspectionFact {
  component: string;
  /** An observation, stated neutrally — the learner draws the conclusion. */
  observation: string;
}

export interface DiagnosticCase {
  id: string;
  title: string;
  tag: string;
  brief: string;
  /** Facts the operator is told up front (nameplate / handover). */
  knownFacts: string[];
  config: PlantConfig;
  candidateCauseIds: string[];
  correctCauseIds: string[];
  candidateActionIds: string[];
  /** Actions required to actually solve the fault. */
  correctActionIds: string[];
  /**
   * Beneficial but not required — genuine wider opportunities (e.g. fitting an
   * economiser on a boiler that has none). Accepted with no penalty and flagged
   * as a "future capital project", never marked wrong.
   */
  improvementActionIds: string[];
  /** Efficiency the boiler should reach once correctly fixed. */
  recoveryEfficiency: number;
  debrief: string;
  faultChain: string[];
}

// Healthy reference for intuition: O₂ 3.5, econ ok, RO + auto blowdown ≈ 87%.

export const CASES: DiagnosticCase[] = [
  {
    id: "over-fired",
    title: "Case 1 — The thirsty burner",
    tag: "Combustion",
    brief:
      "A packaging plant's boiler is using noticeably more gas than last year for the same output. The plant engineer suspects the tubes are scaling up. Maintenance records show the burner hasn't been touched since installation.",
    knownFacts: [
      "5 t/h fire-tube boiler, 10 bar, installed 2015",
      "Economiser fitted (on the nameplate)",
      "Feedwater: RO with automatic TDS blowdown",
    ],
    config: {
      excessO2: 8.2,
      firingRate: 95,
      capacity: 5000,
      steamPressure: 10,
      waterTreatment: "ro",
      softenerExhausted: false,
      deaerator: true,
      blowdownControl: "auto",
      blowdownManualRate: 3,
      condensateReturn: 60,
      economiser: "ok",
      tubeScale: 0,
      insulation: "good",
    },
    candidateCauseIds: ["excess-air-high", "tubes-scaled", "economiser-fouled", "blowdown-too-low", "air-starved"],
    correctCauseIds: ["excess-air-high"],
    candidateActionIds: ["tune-burner", "descale", "clean-economiser", "increase-blowdown"],
    correctActionIds: ["tune-burner"],
    improvementActionIds: [],
    recoveryEfficiency: 85,
    debrief:
      "The high stack temperature tempts you toward 'scaling', but the water side is impeccable (RO + auto blowdown, low TDS, no hardness) and the economiser is recovering heat normally (big gas in→out drop). The giveaway is the flue gas: O₂ at 8%+ with low CO₂ means the burner is pulling in far too much air. That excess air is heated and thrown up the stack — which is also why the stack reads hot. A simple burner re-commission to ~3.5% O₂ restores efficiency. Cost of the wrong diagnosis: an unnecessary, expensive descale that fixes nothing.",
    faultChain: [
      "Burner never re-commissioned → excess air drifted to 8%+",
      "Excess air → low CO₂, high dry-flue-gas loss, hot stack",
      "Symptom mimics fouling, but water side and economiser are healthy",
      "Fix: trim excess air to ~3.5% O₂",
    ],
  },

  {
    id: "scaling",
    title: "Case 2 — The furred kettle",
    tag: "Water treatment",
    brief:
      "An ageing dairy boiler has slowly lost efficiency over 18 months and now needs more frequent tube cleaning. The site has a base-exchange softener, but the service log is patchy. Blowdown is done manually 'when someone remembers'.",
    knownFacts: [
      "5 t/h fire-tube boiler, 10 bar",
      "Feedwater: base-exchange softener (service overdue)",
      "Manual blowdown, set low to 'save water'",
      "No economiser fitted",
    ],
    config: {
      excessO2: 3.8,
      firingRate: 90,
      capacity: 5000,
      steamPressure: 10,
      waterTreatment: "softener",
      softenerExhausted: true,
      deaerator: true,
      blowdownControl: "manual",
      blowdownManualRate: 1.0,
      condensateReturn: 55,
      economiser: "none",
      tubeScale: 0.85,
      insulation: "good",
    },
    candidateCauseIds: ["water-treatment-inadequate", "blowdown-too-low", "tubes-scaled", "excess-air-high", "no-heat-recovery"],
    correctCauseIds: ["water-treatment-inadequate", "blowdown-too-low", "tubes-scaled"],
    candidateActionIds: ["regenerate-softener", "auto-blowdown", "descale", "tune-burner", "fit-economiser", "upgrade-ro"],
    correctActionIds: ["regenerate-softener", "auto-blowdown", "descale"],
    improvementActionIds: ["fit-economiser", "upgrade-ro"],
    recoveryEfficiency: 80,
    debrief:
      "Combustion is fine (O₂ 3.8%, CO₂ healthy) — this is a water-side story. The exhausted softener let hardness through, and the low manual blowdown let boiler TDS climb, so scale built up on the tubes. Scale insulates the heat-transfer surfaces: the stack runs hot and efficiency falls even though the burner is well tuned. The full fix has three parts: restore the softener (stop hardness), put blowdown on automatic TDS control (hold the water quality), and descale the tubes to recover the heat transfer you've already lost. Tuning the burner here would achieve nothing — it isn't the problem.",
    faultChain: [
      "Softener overdue → hardness passes to the boiler",
      "Manual blowdown too low → boiler TDS climbs over the limit",
      "Hardness + high TDS → scale on the tubes (insulating layer)",
      "Scale → hot stack, capped efficiency, more cleaning",
      "Fix: regenerate softener + auto TDS blowdown + descale",
    ],
  },

  {
    id: "lazy-economiser",
    title: "Case 3 — The idle economiser",
    tag: "Heat recovery",
    brief:
      "A laundry's boiler passed its combustion check last week — the burner is spot on — yet the stack is running hot and gas use is up. The economiser was fitted three years ago and 'has never given trouble'.",
    knownFacts: [
      "5 t/h fire-tube boiler, 10 bar",
      "Burner serviced last week — combustion confirmed good",
      "Economiser fitted 2022",
      "Feedwater: RO, automatic TDS blowdown",
    ],
    config: {
      excessO2: 3.6,
      firingRate: 95,
      capacity: 5000,
      steamPressure: 10,
      waterTreatment: "ro",
      softenerExhausted: false,
      deaerator: true,
      blowdownControl: "auto",
      blowdownManualRate: 3,
      condensateReturn: 60,
      economiser: "fouled",
      tubeScale: 0,
      insulation: "good",
    },
    candidateCauseIds: ["economiser-fouled", "excess-air-high", "tubes-scaled", "no-heat-recovery", "water-treatment-inadequate"],
    correctCauseIds: ["economiser-fouled"],
    candidateActionIds: ["clean-economiser", "tune-burner", "descale", "fit-economiser", "auto-blowdown"],
    correctActionIds: ["clean-economiser"],
    improvementActionIds: [],
    recoveryEfficiency: 85,
    debrief:
      "Everything points away from the usual suspects: combustion is good (O₂ 3.6%, CO₂ high), the water side is clean (RO + auto blowdown), so the tubes aren't scaling. The decisive clue is on the economiser itself — inspect it and the gas-in and gas-out temperatures are almost identical. A working economiser drops the flue gas by ~80°C; this one barely touches it, so it's fouled (or bypassed) and the stack heat is going straight up the chimney. Clean / re-commission the economiser and the stack cools, recovering the lost efficiency. Note you don't need to *fit* an economiser — there's already one there, it's just not working.",
    faultChain: [
      "Burner already good — combustion ruled out",
      "RO + auto blowdown — scaling ruled out",
      "Economiser gas in ≈ gas out → not recovering heat",
      "Hot stack → high dry-flue-gas loss",
      "Fix: clean / re-commission the economiser",
    ],
  },

  {
    id: "air-starved",
    title: "Case 4 — The smoking chimney",
    tag: "Safety / combustion",
    brief:
      "Operators report a smell and occasional dark haze from the boiler-house chimney. The boiler 'sounds rough'. A linkage was recently adjusted during an unrelated repair. Treat this as urgent.",
    knownFacts: [
      "5 t/h fire-tube boiler, 10 bar",
      "Air damper linkage disturbed during a recent repair",
      "Feedwater: softener + auto TDS blowdown (in good order)",
      "Economiser fitted and serviced",
    ],
    config: {
      excessO2: 1.3,
      firingRate: 90,
      capacity: 5000,
      steamPressure: 10,
      waterTreatment: "softener",
      softenerExhausted: false,
      deaerator: true,
      blowdownControl: "auto",
      blowdownManualRate: 3,
      condensateReturn: 60,
      economiser: "ok",
      tubeScale: 0,
      insulation: "good",
    },
    candidateCauseIds: ["air-starved", "excess-air-high", "economiser-fouled", "tubes-scaled", "blowdown-too-high"],
    correctCauseIds: ["air-starved"],
    candidateActionIds: ["increase-air", "clean-economiser", "descale", "repair-insulation", "upgrade-ro"],
    correctActionIds: ["increase-air"],
    improvementActionIds: ["upgrade-ro"],
    recoveryEfficiency: 85,
    debrief:
      "This is the dangerous one and it's the mirror image of Case 1. The flue gas tells all: O₂ down at ~1.3% and CO in the hundreds-to-thousands of ppm, with visible soot. The disturbed linkage has starved the flame of air, so the fuel is burning incompletely — wasting unburnt gas and producing carbon monoxide. Counter-intuitively the stack isn't especially hot, because combustion is poor. The fix is to restore combustion air (then properly re-commission to ~3.5% O₂). Never chase efficiency by cutting air below the point where CO climbs — safety first.",
    faultChain: [
      "Linkage knocked → air damper restricted",
      "O₂ falls below ~2% → incomplete combustion",
      "CO and soot rise → unburnt fuel wasted, safety risk",
      "Fix: restore combustion air, re-commission to ~3.5% O₂",
    ],
  },

  {
    id: "oversized",
    title: "Case 5 — The oversized boiler",
    tag: "Sizing / load",
    brief:
      "A boiler serves a site whose steam demand has fallen since a production line closed. The boiler is well maintained and the burner checks out, but efficiency is stubbornly poor and it short-cycles. Someone suggests 'just tune the burner harder'.",
    knownFacts: [
      "10 t/h boiler now serving ~25% of its capacity",
      "Burner recently commissioned — combustion good",
      "Feedwater: RO + auto blowdown, economiser fitted and working",
      "Casing and pipe insulation noted as poor in the last survey",
    ],
    config: {
      excessO2: 3.6,
      firingRate: 25,
      capacity: 10000,
      steamPressure: 10,
      waterTreatment: "ro",
      softenerExhausted: false,
      deaerator: true,
      blowdownControl: "auto",
      blowdownManualRate: 3,
      condensateReturn: 60,
      economiser: "ok",
      tubeScale: 0,
      insulation: "poor",
    },
    candidateCauseIds: ["oversized-low-load", "insulation-poor", "excess-air-high", "tubes-scaled", "economiser-fouled"],
    correctCauseIds: ["oversized-low-load", "insulation-poor"],
    candidateActionIds: ["right-size-load", "repair-insulation", "tune-burner", "descale", "clean-economiser"],
    correctActionIds: ["right-size-load", "repair-insulation"],
    improvementActionIds: [],
    recoveryEfficiency: 84,
    debrief:
      "The trap here is reaching for the burner — but combustion is already good and the water and heat-recovery sides are healthy. The problem is load, not tune. Radiation and casing losses are a roughly fixed number of kilowatts; at 25% firing they become a huge *share* of the much smaller output, so efficiency collapses and the oversized boiler short-cycles. The answer isn't a slider — it's matching plant to demand: sequence the load onto a correctly sized (smaller) boiler so it runs near capacity, and repair the insulation to cut those fixed losses. A reminder that sometimes the right finding is 'this boiler is the wrong size for the job'.",
    faultChain: [
      "Demand fell → boiler runs at ~25% fire",
      "Fixed radiation/casing losses become a large share at low load",
      "Short-cycling, poor efficiency — not a combustion fault",
      "Fix: right-size / sequence the load + repair insulation",
    ],
  },

  {
    id: "over-blowing",
    title: "Case 6 — Drowning in blowdown",
    tag: "Water treatment",
    brief:
      "A newly RO-equipped boiler isn't saving as much as expected. The water treatment was upgraded last year, but the blowdown routine wasn't changed — it's still run manually 'to be safe', the way it was on the old softened supply.",
    knownFacts: [
      "5 t/h boiler, 10 bar, economiser fitted and working",
      "Feedwater upgraded to RO last year (very low TDS)",
      "Blowdown still manual, set high from the softener days",
      "Combustion recently confirmed good",
    ],
    config: {
      excessO2: 3.6,
      firingRate: 90,
      capacity: 5000,
      steamPressure: 10,
      waterTreatment: "ro",
      softenerExhausted: false,
      deaerator: true,
      blowdownControl: "manual",
      blowdownManualRate: 8.5,
      condensateReturn: 60,
      economiser: "ok",
      tubeScale: 0,
      insulation: "good",
    },
    candidateCauseIds: ["blowdown-too-high", "water-treatment-inadequate", "excess-air-high", "tubes-scaled", "blowdown-too-low"],
    correctCauseIds: ["blowdown-too-high"],
    candidateActionIds: ["auto-blowdown", "increase-blowdown", "tune-burner", "descale"],
    correctActionIds: ["auto-blowdown"],
    improvementActionIds: [],
    recoveryEfficiency: 86,
    debrief:
      "A subtle one — more blowdown feels 'safer', so it's easy to miss. With RO feedwater the dissolved-solids load is tiny, so very little blowdown is needed to hold boiler TDS. But the manual routine never changed after the upgrade: at 6.5% it's continuously dumping hot, treated water (and the heat in it) for no reason — the boiler water TDS is way below target. Inspect the conductivity and you'll see it's far under the limit. Switching to automatic TDS control (or simply cutting the manual rate right back) holds the right water quality with a fraction of the blowdown, recovering the heat. The lesson: blowdown should match the water, and after a treatment upgrade you must re-set it.",
    faultChain: [
      "Treatment upgraded to RO → feedwater TDS now very low",
      "Blowdown routine left at the old high softener-era rate",
      "Boiler TDS far below limit → blowing down needlessly",
      "Hot treated water (and its heat) dumped continuously",
      "Fix: automatic TDS blowdown control (or cut the manual rate)",
    ],
  },
];

export function getCase(id: string): DiagnosticCase | undefined {
  return CASES.find((c) => c.id === id);
}

// ---- scoring ----
export interface CaseScore {
  causeScore: number; // 0..100 — diagnosis accuracy
  actionScore: number; // 0..100 — required fixes chosen, wrong ones avoided (improvements neutral)
  orderScore: number; // 0..100 — sensible sequencing (loose, by tier)
  recovered: boolean;
  finalEfficiency: number;
  hadDanger: boolean;
  improvementsSpotted: string[]; // beneficial extras the learner added — future capital projects
  wrongPicks: string[]; // unnecessary/harmful actions chosen
  hasOrderInversion: boolean; // a capital item placed before a lower-tier fix
  total: number; // 0..100
  passed: boolean;
}

export function applyActions(config: PlantConfig, actionIds: string[]): PlantConfig {
  return actionIds.reduce((cfg, id) => {
    const a = ALL_ACTIONS.find((x) => x.id === id);
    return a ? a.apply(cfg) : cfg;
  }, config);
}

/** Agreement between selected and correct sets across a universe, 0..100. */
function setScore(selected: string[], correct: string[], universe: string[]): number {
  const sel = new Set(selected);
  const cor = new Set(correct);
  let right = 0;
  let wrong = 0;
  for (const id of universe) {
    const picked = sel.has(id);
    const should = cor.has(id);
    if (picked && should) right++;
    else if (picked && !should) wrong++;
    else if (!picked && should) wrong++; // missed
  }
  const denom = right + wrong;
  return denom === 0 ? 100 : Math.round((right / denom) * 100);
}

export function scoreCase(
  c: DiagnosticCase,
  selectedCauseIds: string[],
  orderedActionIds: string[], // ordered: the learner's work plan, top → bottom
  finalEfficiency: number,
  hadDanger: boolean
): CaseScore {
  const causeScore = setScore(selectedCauseIds, c.correctCauseIds, c.candidateCauseIds);

  // Prescription: improvements are neutral — excluded from the scored universe.
  const improvements = new Set(c.improvementActionIds);
  const prescriptionUniverse = c.candidateActionIds.filter((id) => !improvements.has(id));
  const scoredSelection = orderedActionIds.filter((id) => !improvements.has(id));
  const actionScore = setScore(scoredSelection, c.correctActionIds, prescriptionUniverse);

  // Order: loose, by tier. Reward each adjacent pair that doesn't go "downhill"
  // (a higher-tier/capital item placed before a lower-tier fix is an inversion).
  const tiers = orderedActionIds.map(actionTier);
  let goodPairs = 0;
  let totalPairs = 0;
  let hasOrderInversion = false;
  for (let i = 0; i < tiers.length - 1; i++) {
    totalPairs++;
    if (tiers[i] <= tiers[i + 1]) goodPairs++;
    else hasOrderInversion = true;
  }
  const orderScore = totalPairs === 0 ? 100 : Math.round((goodPairs / totalPairs) * 100);

  const recovered = finalEfficiency >= c.recoveryEfficiency && !hadDanger;
  const improvementsSpotted = orderedActionIds.filter((id) => improvements.has(id));
  const wrongPicks = orderedActionIds.filter(
    (id) => !c.correctActionIds.includes(id) && !improvements.has(id)
  );

  const total = Math.round(
    causeScore * 0.35 + actionScore * 0.35 + orderScore * 0.15 + (recovered ? 100 : 0) * 0.15
  );
  return {
    causeScore,
    actionScore,
    orderScore,
    recovered,
    finalEfficiency,
    hadDanger,
    improvementsSpotted,
    wrongPicks,
    hasOrderInversion,
    total,
    passed: total >= 70 && recovered,
  };
}
