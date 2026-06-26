/**
 * Steam Boiler Optimizer — scenarios
 *
 * A sandbox to explore freely, then three industrial challenges that teach a
 * deliberate progression:
 *   1. Combustion trim (free) gets a healthy boiler to ~82%.
 *   2. Heat recovery (an economiser — capital) is needed to break ~85%.
 *   3. On a worn, fouled boiler even trim + economiser fall short — you must
 *      judge whether to overhaul or recommend replacement. There is no
 *      "win by sliders" path; the lesson is engineering judgment.
 */

import { BoilerState } from "./steamBoilerPhysics";

export type ScenarioId = "sandbox" | "easy" | "medium" | "hard";

export interface Scenario {
  id: ScenarioId;
  title: string;
  tag: string;
  oneLiner: string;
  brief: string;
  /** Starting boiler settings. */
  initialState: BoilerState;
  /** Worn-boiler heat-transfer penalty (% of fuel). 0 for healthy plant. */
  baseFoulingLoss: number;
  /** Pass mark for efficiency. null = sandbox (no target). */
  targetEfficiency: number | null;
  /** No danger-level warnings allowed when true. */
  requireNoDangerWarnings: boolean;
  /** Which capital options the operator is allowed to use here. */
  allowEconomiser: boolean;
  allowTubeOverhaul: boolean;
  /** Progressive coaching prompts. */
  hints: string[];
  /** Shown once the target is met (or, for hard, when the limit is found). */
  successNote: string;
}

const FRESH: BoilerState = {
  excessO2: 4.5,
  blowdownRate: 2.5,
  loadLevel: 100,
  economiser: false,
  tubeOverhaul: false,
};

export const scenarios: Record<ScenarioId, Scenario> = {
  sandbox: {
    id: "sandbox",
    title: "Sandbox",
    tag: "Free play",
    oneLiner: "Explore freely — no target. See how every lever moves the losses.",
    brief:
      "Get a feel for the boiler before you're tested. Drag each lever and watch the energy-flow bar, the flue-gas analyser and the live coaching respond. Try starving it of air, then flooding it with air. Switch the economiser on and off. There's no pass mark here — just build your intuition.",
    initialState: { ...FRESH },
    baseFoulingLoss: 0,
    targetEfficiency: null,
    requireNoDangerWarnings: false,
    allowEconomiser: true,
    allowTubeOverhaul: false,
    hints: [
      "Watch the flue-gas analyser: as you cut excess air, CO₂% rises and the stack cools — both good, up to a point.",
      "Drop O₂ below 2% and CO spikes — you've starved the flame. More air isn't always worse, but too little is dangerous.",
      "Flip the economiser on and watch the stack temperature — and the dry flue-gas loss — fall.",
    ],
    successNote: "",
  },

  easy: {
    id: "easy",
    title: "Scenario 1 — Baseline Tune",
    tag: "Combustion trim",
    oneLiner: "A textile mill boiler left untuned for years. Trim it to 81%.",
    brief:
      "You're auditing a healthy 5 t/h boiler at a textile mill. It's mechanically sound but hasn't been tuned in years — the burner is running with far too much excess air, and blowdown has crept up. No capital is available: get it to 81% efficiency through combustion trim and water management alone, with no dangerous conditions. (On a non-condensing natural-gas boiler, ~10% of the fuel energy leaves as latent heat in the flue gas, so the low 80s% is the realistic ceiling here.)",
    initialState: {
      excessO2: 6.8,
      blowdownRate: 4.2,
      loadLevel: 100,
      economiser: false,
      tubeOverhaul: false,
    },
    baseFoulingLoss: 0,
    targetEfficiency: 81,
    requireNoDangerWarnings: true,
    allowEconomiser: false,
    allowTubeOverhaul: false,
    hints: [
      "Start with excess air — it's the biggest lever. Aim for the 3–4% O₂ band where combustion is near-complete but you're not heating spare air.",
      "Don't overshoot: below ~2.8% O₂ you risk incomplete combustion. Find the edge, then back off slightly.",
      "Blowdown is too high — every extra % dumps hot water. Bring it down, but not below ~1.5% or you'll get scale.",
      "Watch the dry flue-gas loss segment shrink as the stack cools. That recovered energy is your efficiency gain.",
    ],
    successNote:
      "That's combustion trim done right — and it cost nothing but attention. On a healthy boiler, good excess-air control plus sensible blowdown is the cheapest efficiency you'll ever buy.",
  },

  medium: {
    id: "medium",
    title: "Scenario 2 — Variable Load",
    tag: "Part-load + heat recovery",
    oneLiner: "A food plant with swinging demand. Hold 84% across the load range.",
    brief:
      "A food-processing boiler runs 24/7 with demand that swings from 30% at night to 100% at peak. The previous operator tuned it for full load, so it runs poorly at night. Trim the combustion, then test your settings across the load range using the Load slider. You'll find trim alone won't reach 84% — you'll need to invest in an economiser to recover stack heat. Check it still holds up at low load.",
    initialState: {
      excessO2: 7.0,
      blowdownRate: 2.0,
      loadLevel: 60,
      economiser: false,
      tubeOverhaul: false,
    },
    baseFoulingLoss: 0,
    targetEfficiency: 84,
    requireNoDangerWarnings: true,
    allowEconomiser: true,
    allowTubeOverhaul: false,
    hints: [
      "Trim the excess air first, exactly as before — get into the 3–4% O₂ band.",
      "Now drag the Load slider down to 30%. Notice the radiation loss grow as a share — fixed casing losses bite harder at part load.",
      "Trim alone tops out around 82% on this boiler. To clear 84% you need to recover stack heat — switch on the economiser.",
      "Re-check at low load with the economiser on. Heat recovery helps most when the stack is hottest — at high firing rates.",
    ],
    successNote:
      "Notice the order that worked: trim first (free), then heat recovery (capital) for the points trim couldn't reach. That sequence — cheapest measures first — is exactly how a real abatement plan is built.",
  },

  hard: {
    id: "hard",
    title: "Scenario 3 — Tune or Replace?",
    tag: "Engineering judgment",
    oneLiner: "A worn 20-year-old boiler. Can you reach 85% — or is it time to replace?",
    brief:
      "A chemical plant's 20-year-old boiler has drifted to ~74% efficiency. The burner is badly out of tune, water treatment has been neglected, and the tubes are fouled. You have two capital options: an economiser (~£25k) and a full tube overhaul (~£40k). Find out how far operation and capital can take this boiler. The real deliverable is a recommendation: is it worth keeping, or should the plant budget for replacement?",
    initialState: {
      excessO2: 8.4,
      blowdownRate: 2.0,
      loadLevel: 75,
      economiser: false,
      tubeOverhaul: false,
    },
    baseFoulingLoss: 2.5,
    targetEfficiency: 85,
    requireNoDangerWarnings: true,
    allowEconomiser: true,
    allowTubeOverhaul: true,
    hints: [
      "Start where you always start: trim the badly over-aired burner down into the 3–4% O₂ band.",
      "Trimmed, it still won't clear the mid-70s — the fouling penalty is capping heat transfer. Tuning can't remove fouling.",
      "Try the economiser. Better — but on a fouled boiler you'll still fall short of 85%.",
      "Only with BOTH the tube overhaul AND the economiser, well-trimmed, can this boiler approach 85%. That's ~£65k of capital on a 20-year-old asset.",
      "The lesson: when capital this large is needed just to make an old boiler adequate, replacement with a modern unit is usually the better decision. Finding that limit IS the answer.",
    ],
    successNote:
      "You've found the ceiling. Reaching 85% took ~£65k of capital on a worn-out asset — at which point a new, more reliable boiler is the sounder investment. Sometimes the most valuable audit finding is that optimisation has run out of road.",
  },
};

export const scenarioOrder: ScenarioId[] = ["sandbox", "easy", "medium", "hard"];

export function getScenario(id: ScenarioId): Scenario {
  return scenarios[id];
}

export interface EvaluationResult {
  met: boolean;
  efficiency: number;
  target: number | null;
  hasDangerWarning: boolean;
  message: string;
}

export function evaluate(
  scenario: Scenario,
  efficiency: number,
  hasDangerWarning: boolean
): EvaluationResult {
  if (scenario.targetEfficiency === null) {
    return {
      met: false,
      efficiency,
      target: null,
      hasDangerWarning,
      message: "Sandbox mode — experiment freely.",
    };
  }

  const hitTarget = efficiency >= scenario.targetEfficiency;
  const safe = !scenario.requireNoDangerWarnings || !hasDangerWarning;
  const met = hitTarget && safe;

  let message: string;
  if (met) {
    message = `Target met — ${efficiency.toFixed(1)}% (goal ${scenario.targetEfficiency}%).`;
  } else if (!hitTarget && hasDangerWarning && scenario.requireNoDangerWarnings) {
    message = `Below target (${efficiency.toFixed(1)}% vs ${scenario.targetEfficiency}%) and an unsafe condition is active.`;
  } else if (!hitTarget) {
    message = `Not there yet — ${efficiency.toFixed(1)}% vs ${scenario.targetEfficiency}% target.`;
  } else {
    message = `Efficiency is there, but resolve the unsafe condition first.`;
  }

  return {
    met,
    efficiency,
    target: scenario.targetEfficiency,
    hasDangerWarning,
    message,
  };
}
