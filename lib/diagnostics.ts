/**
 * Generic diagnostics core — shared by the steam and HVAC capstones (and any
 * future system). Holds the domain-agnostic types, the answer checker and the
 * five-part scoring (Calculation · Diagnosis · Prescription · Sequence ·
 * Capture). Each domain supplies its own cases, cause/action pools and
 * reference panel; everything else is shared.
 */

export type CalcStatus = "unaided" | "hinted" | "skipped" | "wrong" | "unsolved";

export interface CalcPart {
  id: string;
  prompt: string;
  unit: string;
  answer: number;
  tol: number;
  tolType: "abs" | "rel";
  /** hints[0] is the method/formula; later entries are numeric nudges. */
  hints: string[];
  worked: string;
}

export function checkAnswer(part: CalcPart, value: number): boolean {
  const margin = part.tolType === "rel" ? Math.abs(part.answer) * part.tol : part.tol;
  return Math.abs(value - part.answer) <= margin;
}

export interface Reading {
  label: string;
  value: string;
  unit?: string;
  /** A reading that is itself a clue worth weighing (highlighted). */
  note?: string;
}

export interface CauseDef {
  id: string;
  label: string;
}

export interface ActionDef {
  id: string;
  label: string;
  /** 0 safety · 1 no-cost/operational · 2 remedial · 3 capital improvement. */
  tier: number;
}

export interface DiagnosticCase {
  id: string;
  title: string;
  tag: string;
  brief: string;
  knownFacts: string[];
  readings: Reading[];
  calcParts: CalcPart[];
  candidateCauseIds: string[];
  correctCauseIds: string[];
  candidateActionIds: string[];
  correctActionIds: string[];
  improvementActionIds: string[];
  debrief: string;
  faultChain: string[];
}

export const TIER_LABEL: Record<number, string> = {
  0: "Safety-critical",
  1: "No-cost / operational",
  2: "Remedial maintenance",
  3: "Capital improvement",
};

export interface CaseScore {
  calcScore: number;
  causeScore: number;
  actionScore: number;
  orderScore: number;
  captured: boolean;
  usedCalcHelp: boolean;
  improvementsSpotted: string[];
  wrongPicks: string[];
  hasOrderInversion: boolean;
  total: number;
  passed: boolean;
}

function setScore(selected: string[], correct: string[], universe: string[]): number {
  const sel = new Set(selected);
  const cor = new Set(correct);
  let right = 0;
  let wrong = 0;
  for (const id of universe) {
    const picked = sel.has(id);
    const should = cor.has(id);
    if (picked && should) right++;
    else if (picked !== should) wrong++;
  }
  const denom = right + wrong;
  return denom === 0 ? 100 : Math.round((right / denom) * 100);
}

export function scoreCase(
  c: DiagnosticCase,
  calcStatuses: CalcStatus[],
  selectedCauseIds: string[],
  orderedActionIds: string[],
  actions: ActionDef[]
): CaseScore {
  const hasCalc = c.calcParts.length > 0;

  const perPart: number[] = calcStatuses.map((s) =>
    s === "unaided" ? 100 : s === "hinted" ? 40 : 0
  );
  const calcScore = hasCalc
    ? perPart.length
      ? Math.round(perPart.reduce((a, b) => a + b, 0) / perPart.length)
      : 0
    : 100;
  const usedCalcHelp = hasCalc && calcStatuses.some((s) => s !== "unaided");

  const causeScore = setScore(selectedCauseIds, c.correctCauseIds, c.candidateCauseIds);

  const improvements = new Set(c.improvementActionIds);
  const universe = c.candidateActionIds.filter((id) => !improvements.has(id));
  const scoredSel = orderedActionIds.filter((id) => !improvements.has(id));
  const actionScore = setScore(scoredSel, c.correctActionIds, universe);

  const tierOf = (id: string) => actions.find((a) => a.id === id)?.tier ?? 1;
  const tiers = orderedActionIds.map(tierOf);
  let good = 0;
  let pairs = 0;
  let hasOrderInversion = false;
  for (let i = 0; i < tiers.length - 1; i++) {
    pairs++;
    if (tiers[i] <= tiers[i + 1]) good++;
    else hasOrderInversion = true;
  }
  const orderScore = pairs === 0 ? 100 : Math.round((good / pairs) * 100);

  const captured = c.correctActionIds.every((id) => orderedActionIds.includes(id));
  const improvementsSpotted = orderedActionIds.filter((id) => improvements.has(id));
  const wrongPicks = orderedActionIds.filter(
    (id) => !c.correctActionIds.includes(id) && !improvements.has(id)
  );

  const total = hasCalc
    ? Math.round(
        calcScore * 0.3 + causeScore * 0.25 + actionScore * 0.25 + orderScore * 0.1 + (captured ? 100 : 0) * 0.1
      )
    : Math.round(
        causeScore * 0.35 + actionScore * 0.35 + orderScore * 0.15 + (captured ? 100 : 0) * 0.15
      );

  // A pass needs the maths done unaided — any hint/skip blocks it until retried.
  const passed = total >= 70 && captured && !usedCalcHelp;

  return {
    calcScore,
    causeScore,
    actionScore,
    orderScore,
    captured,
    usedCalcHelp,
    improvementsSpotted,
    wrongPicks,
    hasOrderInversion,
    total,
    passed,
  };
}
