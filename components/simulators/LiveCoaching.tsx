"use client";

import { BoilerState, BoilerOutput } from "@/lib/steamBoilerPhysics";

/**
 * Real-time diagnostic narration. This is what makes the tool *teach* rather
 * than just respond: it names the symptom, explains the cause, and points at
 * the biggest remaining opportunity — the way a mentor stood at your shoulder
 * would. The goal is that learners internalise the cause→effect chain.
 */

interface Coaching {
  tone: "good" | "warn" | "bad";
  headline: string;
  detail: string;
}

function diagnoseCombustion(o2: number): Coaching {
  if (o2 < 2) {
    return {
      tone: "bad",
      headline: "Air-starved — incomplete combustion",
      detail:
        "CO and soot are forming. You're wasting unburnt fuel and risking a dangerous condition. Add air until CO collapses and CO₂ peaks.",
    };
  }
  if (o2 < 2.8) {
    return {
      tone: "warn",
      headline: "Running rich",
      detail:
        "Just short of air. CO₂ is high, but you're on the edge of incomplete combustion. Nudge air up slightly for a safety margin.",
    };
  }
  if (o2 <= 4.5) {
    return {
      tone: "good",
      headline: "Combustion well trimmed",
      detail:
        "Near-complete burn with minimal excess air — CO₂ is near its peak and the stack is as cool as trim allows. This is the target band.",
    };
  }
  if (o2 <= 6.5) {
    return {
      tone: "warn",
      headline: "A little too much air",
      detail:
        "You're heating spare air and sending it up the stack. CO₂ has dropped and the dry flue-gas loss is rising. Trim the air back toward 3–4%.",
    };
  }
  return {
    tone: "bad",
    headline: "Far too much excess air",
    detail:
      "Major stack losses. Every unit of excess air is drawn in cold, heated, and vented hot. This is the most common — and most fixable — waste on industrial boilers.",
  };
}

export default function LiveCoaching({
  state,
  output,
}: {
  state: BoilerState;
  output: BoilerOutput;
}) {
  const combustion = diagnoseCombustion(state.excessO2);

  // Point at the biggest remaining controllable loss.
  let opportunity: string | null = null;
  if (output.biggestLoss) {
    const n = output.biggestLoss.name;
    if (n === "dry flue-gas loss")
      opportunity = "Biggest opportunity now: dry flue-gas loss — trim excess air, or fit an economiser to cool the stack.";
    else if (n === "incomplete combustion")
      opportunity = "Biggest opportunity now: stop the incomplete combustion — add air until CO clears.";
    else if (n === "blowdown loss")
      opportunity = "Biggest opportunity now: blowdown loss — lower the blowdown rate (but keep it ≥1.5% to control solids).";
    else if (n === "radiation loss")
      opportunity = "Biggest opportunity now: radiation loss is dominating — that's a part-load effect. The boiler is oversized for this demand.";
    else if (n === "fouling loss")
      opportunity = "Biggest opportunity now: fouling — tuning can't shift this. It needs a tube clean / overhaul.";
  }

  const toneStyles = {
    good: "border-emerald-200 bg-emerald-50",
    warn: "border-amber-200 bg-amber-50",
    bad: "border-red-200 bg-red-50",
  } as const;
  const dot = {
    good: "bg-emerald-500",
    warn: "bg-amber-500",
    bad: "bg-red-500",
  } as const;

  return (
    <div className={`rounded-xl border p-4 ${toneStyles[combustion.tone]}`}>
      <div className="mb-1.5 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dot[combustion.tone]}`} />
        <h3 className="text-sm font-bold text-slate-900">{combustion.headline}</h3>
      </div>
      <p className="text-xs leading-relaxed text-slate-700">{combustion.detail}</p>

      {opportunity && (
        <p className="mt-2 border-t border-slate-900/10 pt-2 text-xs font-medium text-slate-800">
          {opportunity}
        </p>
      )}

      {/* Operational warnings surfaced as a short list */}
      {output.warnings.length > 0 && (
        <ul className="mt-2 space-y-1 border-t border-slate-900/10 pt-2">
          {output.warnings.map((w, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
              <span className={w.level === "danger" ? "text-red-600" : "text-amber-600"}>
                {w.level === "danger" ? "■" : "▲"}
              </span>
              {w.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
