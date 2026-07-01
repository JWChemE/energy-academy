/**
 * Pinch analysis diagnostic cases — an untargeted process, a cross-pinch
 * utility violation, an infeasible CP match, a stream that needs splitting, a
 * misdiagnosed threshold problem, a ΔTmin economic comparison, an
 * over-complicated network, and a retrofit audit that finds the same
 * violation signature as case 2. A mix of quantify, reason and judgement.
 * Numbers consistent with lib/pinchTables.ts. Built on the shared diagnostics
 * core.
 *
 * The discipline: find the true minimum utility target before designing
 * anything, never let heat cross the pinch, only match streams that satisfy
 * the CP feasibility rule, split when (and only when) that rule blocks every
 * pairing, and size the ΔTmin economically rather than by habit.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const PINCH_CAUSES: CauseDef[] = [
  { id: "no-target-set", label: "No pinch target calculated before designing" },
  { id: "cross-pinch-utility", label: "Utility placed on the wrong side of the pinch (cross-pinch violation)" },
  { id: "infeasible-cp-match", label: "Proposed match violates the CP feasibility rule" },
  { id: "needs-stream-split", label: "A feasible network requires splitting a stream" },
  { id: "threshold-misdiagnosed", label: "Process needs only one utility, but two were installed" },
  { id: "wrong-delta-t-min", label: "ΔTmin chosen without an economic comparison" },
  { id: "excess-units", label: "Network has more units than the minimum-units target (a loop)" },
  { id: "network-appropriate", label: "Design/network already correct — no fault" },
];

export const PINCH_ACTIONS: ActionDef[] = [
  { id: "calculate-and-set-targets", label: "Calculate the pinch and set minimum utility targets before designing", tier: 1 },
  { id: "reroute-utility", label: "Reroute the misplaced utility connection", tier: 2 },
  { id: "reject-infeasible-match", label: "Reject the match; choose a feasible pairing or split instead", tier: 1 },
  { id: "split-the-stream", label: "Split the stream into parallel branches at a feasible CP ratio", tier: 2 },
  { id: "remove-redundant-utility", label: "Remove the unneeded utility equipment", tier: 2 },
  { id: "rerun-economic-comparison", label: "Re-run the ΔTmin economic comparison at several values", tier: 1 },
  { id: "break-the-loop", label: "Break the loop: remove the smallest-duty exchanger and rebalance", tier: 2 },
  { id: "recommend-new-exchanger", label: "Recommend a new process-to-process heat exchanger", tier: 3 },
  { id: "accept-as-is", label: "Accept the design as already correct", tier: 1 },
  { id: "add-more-utility", label: "Add more utility capacity", tier: 3 },
  { id: "install-both-utilities", label: "Install both a heater and a cooler regardless", tier: 3 },
  { id: "redesign-from-scratch", label: "Redesign the whole network from scratch", tier: 3 },
];

export type PinchRefTable = "targeting" | "goldenrules" | "feasibility" | "units" | "economics" | "prices";

export interface PinchCase extends DiagnosticCase {
  refTables: PinchRefTable[];
}

export const PINCH_CASES: PinchCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "untargeted-process",
    title: "Case 1 — The Untargeted Process",
    tag: "Targeting",
    brief:
      "A new process is on the drawing board: one hot stream, one cold stream. The design team has sized a heater and a cooler by guesswork, without ever running a pinch analysis. Find the true minimum utility this process needs.",
    knownFacts: [
      "Hot stream H1: 165 °C → 50 °C, CP = 1.8 kW/°C",
      "Cold stream C1: 45 °C → 155 °C, CP = 1.6 kW/°C",
      "ΔTmin = 20 °C",
      "The problem-table cascade (after shifting) bottoms out at −16 kW",
    ],
    readings: [
      { label: "H1", value: "165 → 50 °C", unit: "CP 1.8" },
      { label: "C1", value: "45 → 155 °C", unit: "CP 1.6" },
      { label: "ΔTmin", value: "20", unit: "°C" },
      { label: "Cascade minimum", value: "−16", unit: "kW", note: "before topping up with hot utility" },
    ],
    refTables: ["targeting"],
    calcParts: [
      {
        id: "h1-load",
        prompt: "What is H1's total heat load?",
        unit: "kW",
        answer: 207,
        tol: 0.03,
        tolType: "rel",
        hints: ["Heat load = CP × |supply − target|.", "1.8 × (165 − 50)."],
        worked: "1.8 × 115 = 207 kW available from H1.",
      },
      {
        id: "c1-load",
        prompt: "What is C1's total heat load?",
        unit: "kW",
        answer: 176,
        tol: 0.03,
        tolType: "rel",
        hints: ["Heat load = CP × |supply − target|.", "1.6 × (155 − 45)."],
        worked: "1.6 × 110 = 176 kW required by C1.",
      },
      {
        id: "hot-utility",
        prompt: "The cascade's most negative point is −16 kW. What minimum hot utility does this process need?",
        unit: "kW",
        answer: 16,
        tol: 1,
        tolType: "abs",
        hints: ["Topping up the cascade to zero at its lowest point sets the minimum hot utility.", "The magnitude of the most negative cascade value."],
        worked: "Minimum hot utility = 16 kW — exactly enough to bring the lowest cascade point to zero.",
      },
      {
        id: "cold-utility",
        prompt: "Using the overall balance (hot utility + H1's load = C1's load + cold utility), what is the minimum cold utility?",
        unit: "kW",
        answer: 47,
        tol: 0.05,
        tolType: "rel",
        hints: ["Cold utility = hot utility + hot load − cold load.", "16 + 207 − 176."],
        worked: "16 + 207 − 176 = 47 kW minimum cold utility.",
      },
    ],
    candidateCauseIds: ["no-target-set", "wrong-delta-t-min", "excess-units", "network-appropriate"],
    correctCauseIds: ["no-target-set"],
    candidateActionIds: ["calculate-and-set-targets", "add-more-utility", "install-both-utilities", "accept-as-is"],
    correctActionIds: ["calculate-and-set-targets"],
    improvementActionIds: [],
    debrief:
      "Guesswork sizing has no way of knowing whether it's wasteful or under-specified — only the problem table gives a defensible number. Here the true minimum is 16 kW of hot utility and 47 kW of cold utility; any design using more than that is leaving heat-recovery value on the table before it's even built. Calculate the targets first, then design the network to hit them.",
    faultChain: [
      "New process designed by guesswork, no pinch target run",
      "H1 load 207 kW, C1 load 176 kW",
      "Cascade gives minimum hot utility 16 kW, cold utility 47 kW",
      "Fix: calculate and set the targets before finalising the design",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "cross-pinch-cooler",
    title: "Case 2 — The Cooler Above the Pinch",
    tag: "Golden rules",
    brief:
      "A plant's pinch analysis gives clean targets: 60 kW minimum hot utility, 45 kW minimum cold utility. But a site walk-round finds a 20 kW cooler quietly running on a hot stream above the pinch — cooling water removing heat that should have gone to a cold process stream instead. Quantify what that's costing.",
    knownFacts: [
      "Calculated minimum hot utility = 60 kW; minimum cold utility = 45 kW",
      "A 20 kW cooler is found operating above the pinch",
      "Above the pinch, all cooling should come from process-to-process matches, never cold utility",
      "Every kW crossing the pinch costs 1 kW of extra hot utility AND 1 kW of extra cold utility",
    ],
    readings: [
      { label: "Target hot utility", value: "60", unit: "kW" },
      { label: "Target cold utility", value: "45", unit: "kW" },
      { label: "Cooler found above pinch", value: "20", unit: "kW", note: "should not exist here" },
      { label: "Golden rule", value: "no cold utility above pinch", note: "violated" },
    ],
    refTables: ["goldenrules"],
    calcParts: [
      {
        id: "extra-hot",
        prompt: "By how much does hot utility increase because of this misplaced cooler?",
        unit: "kW",
        answer: 20,
        tol: 1,
        tolType: "abs",
        hints: ["The cold stream that should have received this heat is now short by exactly the cooler's duty.", "It equals the misplaced duty itself."],
        worked: "The 20 kW the cooler removed is 20 kW the process cold stream didn't receive, so hot utility must rise by 20 kW to compensate.",
      },
      {
        id: "actual-hot",
        prompt: "What is the actual hot utility now in use?",
        unit: "kW",
        answer: 80,
        tol: 0.03,
        tolType: "rel",
        hints: ["Target + the increase just calculated.", "60 + 20."],
        worked: "60 + 20 = 80 kW actual hot utility.",
      },
      {
        id: "actual-cold",
        prompt: "What is the actual cold utility now in use?",
        unit: "kW",
        answer: 65,
        tol: 0.03,
        tolType: "rel",
        hints: ["Target + the misplaced cooler's own duty.", "45 + 20."],
        worked: "45 + 20 = 65 kW actual cold utility — the misplaced cooler itself is extra cold utility on top of the legitimate 45 kW.",
      },
      {
        id: "total-penalty",
        prompt: "What is the total utility penalty (extra hot + extra cold) versus the targets?",
        unit: "kW",
        answer: 40,
        tol: 2,
        tolType: "abs",
        hints: ["Extra hot + extra cold.", "20 + 20."],
        worked: "20 + 20 = 40 kW — double the misplaced duty, exactly the golden-rule penalty.",
      },
    ],
    candidateCauseIds: ["cross-pinch-utility", "no-target-set", "wrong-delta-t-min", "network-appropriate"],
    correctCauseIds: ["cross-pinch-utility"],
    candidateActionIds: ["reroute-utility", "add-more-utility", "redesign-from-scratch", "accept-as-is"],
    correctActionIds: ["reroute-utility"],
    improvementActionIds: [],
    debrief:
      "This is the golden rules in action: a 20 kW cooler above the pinch costs 40 kW of total utility, not 20 — one extra hot-utility kW to replace what the cold stream missed, one extra cold-utility kW for the misplaced cooling itself. The fix is almost free: reroute this cooler's duty into a process-to-process match with the cold stream it should have been feeding, and both utilities fall straight back to their targets. No new equipment is needed, just correct piping.",
    faultChain: [
      "Targets: 60 kW hot utility, 45 kW cold utility",
      "20 kW cooler found operating above the pinch — a golden-rule violation",
      "Actual: 80 kW hot utility, 65 kW cold utility — 40 kW total penalty",
      "Fix: reroute the misplaced connection into a process-to-process match",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "infeasible-match",
    title: "Case 3 — The Match That Can't Work",
    tag: "Feasibility",
    brief:
      "A design proposes matching a hot stream (CP 2.4 kW/°C) directly against a cold stream (CP 1.0 kW/°C) right at the pinch, above it. Before any equipment is bought, check whether this match is even thermodynamically possible.",
    knownFacts: [
      "Proposed match, right at the pinch, above it",
      "Hot stream CP = 2.4 kW/°C",
      "Cold stream CP = 1.0 kW/°C",
      "Feasibility rule above the pinch: CP(hot) ≤ CP(cold) for any match touching the pinch",
    ],
    readings: [
      { label: "Hot stream CP", value: "2.4", unit: "kW/°C" },
      { label: "Cold stream CP", value: "1.0", unit: "kW/°C" },
      { label: "Region", value: "above pinch", note: "at the pinch itself" },
      { label: "Rule", value: "CP(hot) ≤ CP(cold)", note: "above pinch" },
    ],
    refTables: ["feasibility"],
    calcParts: [
      {
        id: "feasible-check",
        prompt: "Does this match satisfy the feasibility rule? Enter 1 for yes, 0 for no.",
        unit: "",
        answer: 0,
        tol: 0.1,
        tolType: "abs",
        hints: ["Compare CP(hot) to CP(cold) directly.", "2.4 vs 1.0 — is the hot CP the smaller of the two?"],
        worked: "2.4 ≤ 1.0 is false — the match is infeasible as proposed.",
      },
      {
        id: "cp-excess",
        prompt: "By how much does the hot stream's CP exceed the cold stream's CP?",
        unit: "kW/°C",
        answer: 1.4,
        tol: 0.05,
        tolType: "abs",
        hints: ["CP(hot) − CP(cold).", "2.4 − 1.0."],
        worked: "2.4 − 1.0 = 1.4 kW/°C — the hot stream cools too slowly per degree relative to how fast the cold stream would need to heat, so the streams would cross before either is exhausted.",
      },
      {
        id: "max-feasible-cp",
        prompt: "What is the maximum CP the hot stream could have for this specific match to be feasible?",
        unit: "kW/°C",
        answer: 1.0,
        tol: 0.05,
        tolType: "abs",
        hints: ["The rule's boundary is where CP(hot) = CP(cold).", "Equal to the cold stream's CP."],
        worked: "CP(hot) ≤ 1.0 kW/°C would satisfy the rule — the proposed 2.4 is well beyond that.",
      },
    ],
    candidateCauseIds: ["infeasible-cp-match", "needs-stream-split", "cross-pinch-utility", "network-appropriate"],
    correctCauseIds: ["infeasible-cp-match"],
    candidateActionIds: ["reject-infeasible-match", "accept-as-is", "add-more-utility", "redesign-from-scratch"],
    correctActionIds: ["reject-infeasible-match"],
    improvementActionIds: [],
    debrief:
      "Not every pairing of a hot stream and a cold stream can actually be built — the CP feasibility rule isn't a guideline, it's a consequence of the temperatures having to move apart (not together) as you move away from the pinch. At 2.4 vs 1.0 kW/°C, this match would force a temperature cross, violating ΔTmin somewhere along its length. Reject it as proposed — a different pairing, or (as the next case shows) splitting the hot stream, are the ways forward.",
    faultChain: [
      "Proposed match: hot CP 2.4 vs cold CP 1.0, above the pinch",
      "Feasibility rule requires CP(hot) ≤ CP(cold) — fails by 1.4 kW/°C",
      "As drawn, the match would force a temperature cross",
      "Fix: reject this pairing; look for a feasible match or split",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "stream-splitting",
    title: "Case 4 — One Hot Stream, Two Cold Homes",
    tag: "Network design",
    brief:
      "A hot stream (CP 2.4 kW/°C) needs to give up heat above the pinch, and there are two cold streams available there: one at CP 1.0 kW/°C, one at CP 1.6 kW/°C. Neither matches the hot stream directly (2.4 exceeds both). Find a feasible way to use this hot stream anyway.",
    knownFacts: [
      "Hot stream: CP = 2.4 kW/°C, above the pinch",
      "Cold stream A: CP = 1.0 kW/°C",
      "Cold stream B: CP = 1.6 kW/°C",
      "Splitting a stream divides its CP in direct proportion to the flow split",
    ],
    readings: [
      { label: "Hot stream CP", value: "2.4", unit: "kW/°C" },
      { label: "Cold stream A CP", value: "1.0", unit: "kW/°C" },
      { label: "Cold stream B CP", value: "1.6", unit: "kW/°C" },
      { label: "Direct matches", value: "both infeasible", note: "2.4 exceeds both" },
    ],
    refTables: ["feasibility"],
    calcParts: [
      {
        id: "branch-a-max",
        prompt: "What is the maximum feasible CP for the branch matched to cold stream A (CP 1.0)?",
        unit: "kW/°C",
        answer: 1.0,
        tol: 0.05,
        tolType: "abs",
        hints: ["The feasibility rule's boundary for this branch.", "Equal to cold stream A's own CP."],
        worked: "Branch A's CP must be ≤ 1.0 kW/°C to satisfy CP(hot) ≤ CP(cold) against stream A.",
      },
      {
        id: "branch-b-cp",
        prompt: "If branch A is set to exactly 1.0 kW/°C, what CP is left for branch B (total hot CP = 2.4)?",
        unit: "kW/°C",
        answer: 1.4,
        tol: 0.05,
        tolType: "abs",
        hints: ["Total CP minus branch A's CP.", "2.4 − 1.0."],
        worked: "2.4 − 1.0 = 1.4 kW/°C remaining for branch B.",
      },
      {
        id: "branch-b-check",
        prompt: "Is branch B (1.4 kW/°C) feasible against cold stream B (CP 1.6)? Enter 1 for yes, 0 for no.",
        unit: "",
        answer: 1,
        tol: 0.1,
        tolType: "abs",
        hints: ["Compare 1.4 to 1.6 using the same rule.", "Is 1.4 ≤ 1.6?"],
        worked: "1.4 ≤ 1.6 — yes, feasible. Splitting the hot stream into a 1.0 and a 1.4 kW/°C branch makes both matches work, where the unsplit 2.4 kW/°C stream satisfied neither.",
      },
    ],
    candidateCauseIds: ["needs-stream-split", "infeasible-cp-match", "excess-units", "network-appropriate"],
    correctCauseIds: ["needs-stream-split"],
    candidateActionIds: ["split-the-stream", "reject-infeasible-match", "add-more-utility", "redesign-from-scratch"],
    correctActionIds: ["split-the-stream"],
    improvementActionIds: [],
    debrief:
      "Neither cold stream alone can take this hot stream's full flow feasibly — its CP (2.4) is too large relative to either one (1.0 and 1.6). Splitting the hot stream's flow into a 1.0 kW/°C branch (matched to cold stream A) and a 1.4 kW/°C branch (matched to cold stream B) satisfies the feasibility rule on both sides at once — literally diverting part of the flow down a parallel pipe with a control valve. This is exactly when splitting earns its place in a network: not as a default, but as the fix when every unsplit pairing fails the rule.",
    faultChain: [
      "Hot stream CP 2.4 vs cold streams CP 1.0 and CP 1.6 — both direct matches infeasible",
      "Split into branches of 1.0 and 1.4 kW/°C",
      "Branch A (1.0) feasible vs cold A (1.0); branch B (1.4) feasible vs cold B (1.6)",
      "Fix: split the hot stream at this ratio",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "threshold-misdiagnosis",
    title: "Case 5 — The Heater Nobody Needed",
    tag: "Threshold problem",
    brief:
      "A process was designed with both a heater and a cooler, on the assumption every process needs two utilities. Run the numbers on its actual streams and check whether that assumption was justified here.",
    knownFacts: [
      "Hot stream H1: 190 °C → 90 °C, CP = 1.3 kW/°C",
      "Cold stream C1: 60 °C → 150 °C, CP = 0.9 kW/°C",
      "ΔTmin = 20 °C",
      "A heater and a cooler were both installed by default",
    ],
    readings: [
      { label: "H1", value: "190 → 90 °C", unit: "CP 1.3" },
      { label: "C1", value: "60 → 150 °C", unit: "CP 0.9" },
      { label: "ΔTmin", value: "20", unit: "°C" },
      { label: "Installed", value: "heater + cooler", note: "both, by default" },
    ],
    refTables: ["targeting"],
    calcParts: [
      {
        id: "h1-load",
        prompt: "What is H1's total heat load?",
        unit: "kW",
        answer: 130,
        tol: 0.03,
        tolType: "rel",
        hints: ["CP × |supply − target|.", "1.3 × (190 − 90)."],
        worked: "1.3 × 100 = 130 kW available from H1.",
      },
      {
        id: "c1-load",
        prompt: "What is C1's total heat load?",
        unit: "kW",
        answer: 81,
        tol: 0.03,
        tolType: "rel",
        hints: ["CP × |supply − target|.", "0.9 × (150 − 60)."],
        worked: "0.9 × 90 = 81 kW required by C1.",
      },
      {
        id: "hot-utility-needed",
        prompt: "H1 has more heat available (130 kW) than C1 needs (81 kW), and their temperature ranges overlap generously. What minimum hot utility does this process need?",
        unit: "kW",
        answer: 0,
        tol: 0.5,
        tolType: "abs",
        hints: ["When one stream's surplus can cover the other's whole demand across the overlap, no external heating is needed at all.", "Zero — this is a threshold problem."],
        worked: "Minimum hot utility = 0 kW. H1 alone can supply everything C1 needs.",
      },
      {
        id: "cold-utility-needed",
        prompt: "What minimum cold utility follows (H1's surplus that C1 can't use)?",
        unit: "kW",
        answer: 49,
        tol: 0.05,
        tolType: "rel",
        hints: ["H1's load minus C1's load, since no hot utility is needed.", "130 − 81."],
        worked: "130 − 81 = 49 kW — H1's leftover heat, rejected to cold utility.",
      },
    ],
    candidateCauseIds: ["threshold-misdiagnosed", "no-target-set", "cross-pinch-utility", "network-appropriate"],
    correctCauseIds: ["threshold-misdiagnosed"],
    candidateActionIds: ["remove-redundant-utility", "add-more-utility", "install-both-utilities", "accept-as-is"],
    correctActionIds: ["remove-redundant-utility"],
    improvementActionIds: [],
    debrief:
      "This is a threshold problem: H1's 130 kW comfortably covers C1's 81 kW requirement across their overlapping temperature ranges, so the minimum hot utility is genuinely zero — no amount of clever design will ever make a heater necessary here. The heater installed 'by default' is wasted capital sitting idle, and worse, a standing invitation for someone to switch it on later and create exactly the kind of golden-rule violation seen in Case 2. Remove it; the cooler (sized to 49 kW) is the only utility this process will ever need.",
    faultChain: [
      "Heater and cooler both installed 'to be safe'",
      "H1 load 130 kW exceeds C1 load 81 kW, ranges overlap well",
      "Minimum hot utility = 0 kW; minimum cold utility = 49 kW",
      "Fix: remove the unneeded heater",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "delta-t-min-choice",
    title: "Case 6 — Which ΔTmin Actually Costs Less?",
    tag: "Economics",
    brief:
      "A process (hot stream 160→50 °C, CP 2.2; cold stream 45→150 °C, CP 1.9) is being designed at ΔTmin = 20 °C by habit — the same value used on the last project. Check whether 30 °C might actually be cheaper here, given this site's utility prices and equipment costs.",
    knownFacts: [
      "At ΔTmin = 20 °C: minimum hot utility 19 kW, minimum cold utility 61.5 kW",
      "At ΔTmin = 30 °C: minimum hot utility 38 kW, minimum cold utility 80.5 kW",
      "Hot utility (gas) £0.06/kWh; cold utility £0.01/kWh; 6,000 operating hours/year",
      "Annualised capital cost: £30,000/yr at ΔTmin 20 °C; £18,000/yr at ΔTmin 30 °C",
    ],
    readings: [
      { label: "Utilities at ΔTmin 20°C", value: "19 hot / 61.5 cold", unit: "kW" },
      { label: "Utilities at ΔTmin 30°C", value: "38 hot / 80.5 cold", unit: "kW" },
      { label: "Prices", value: "£0.06 hot / £0.01 cold", unit: "per kWh" },
      { label: "Annualised capital", value: "£30,000 (20°C) / £18,000 (30°C)", unit: "£/yr" },
    ],
    refTables: ["economics", "prices"],
    calcParts: [
      {
        id: "utility-cost-20",
        prompt: "What is the total annual utility cost at ΔTmin = 20 °C?",
        unit: "£/yr",
        answer: 10530,
        tol: 0.05,
        tolType: "rel",
        hints: ["(hot kW × hours × hot price) + (cold kW × hours × cold price).", "(19×6,000×0.06) + (61.5×6,000×0.01)."],
        worked: "(19×6,000×£0.06=£6,840) + (61.5×6,000×£0.01=£3,690) = £10,530/yr.",
      },
      {
        id: "utility-cost-30",
        prompt: "What is the total annual utility cost at ΔTmin = 30 °C?",
        unit: "£/yr",
        answer: 18510,
        tol: 0.05,
        tolType: "rel",
        hints: ["Same method, at the 30 °C utility figures.", "(38×6,000×0.06) + (80.5×6,000×0.01)."],
        worked: "(38×6,000×£0.06=£13,680) + (80.5×6,000×£0.01=£4,830) = £18,510/yr.",
      },
      {
        id: "total-cost-20",
        prompt: "Including the given annualised capital cost, what is the total annual cost at ΔTmin = 20 °C?",
        unit: "£/yr",
        answer: 40530,
        tol: 0.05,
        tolType: "rel",
        hints: ["Utility cost + annualised capital.", "10,530 + 30,000."],
        worked: "£10,530 + £30,000 = £40,530/yr.",
      },
      {
        id: "total-cost-30",
        prompt: "What is the total annual cost at ΔTmin = 30 °C?",
        unit: "£/yr",
        answer: 36510,
        tol: 0.05,
        tolType: "rel",
        hints: ["Utility cost + annualised capital.", "18,510 + 18,000."],
        worked: "£18,510 + £18,000 = £36,510/yr — lower than the 20 °C total, despite using more utility.",
      },
    ],
    candidateCauseIds: ["wrong-delta-t-min", "no-target-set", "cross-pinch-utility", "network-appropriate"],
    correctCauseIds: ["wrong-delta-t-min"],
    candidateActionIds: ["rerun-economic-comparison", "accept-as-is", "add-more-utility", "redesign-from-scratch"],
    correctActionIds: ["rerun-economic-comparison"],
    improvementActionIds: [],
    debrief:
      "Copying the last project's ΔTmin is a habit, not a decision. Here, despite using more utility (£18,510/yr vs £10,530/yr), ΔTmin = 30 °C's much lower capital cost (£18,000 vs £30,000/yr) makes it the cheaper overall choice — £36,510/yr against £40,530/yr at 20 °C. There's no universal 'right' ΔTmin; it depends entirely on this site's specific utility prices and exchanger costs, which is exactly why the comparison has to be re-run for every project, not assumed from the last one.",
    faultChain: [
      "ΔTmin = 20 °C chosen by habit, matching a previous project",
      "Utility cost £10,530 (20°C) vs £18,510 (30°C) — 20°C looks cheaper on energy alone",
      "But total cost (+ capital): £40,530 (20°C) vs £36,510 (30°C) — 30°C actually wins",
      "Fix: re-run the economic comparison for this site's own numbers",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "excess-units-loop",
    title: "Case 7 — More Exchangers Than the Job Needs",
    tag: "Network design",
    brief:
      "The above-pinch region of a network involves two hot streams, one cold stream, and hot utility — four items in total. The as-built network in this region has five heat-transfer units. Work out how many units this region actually needs, and what the extra one signals.",
    knownFacts: [
      "Above-pinch region streams and utilities: H1, H2, C1, and hot utility",
      "As-built network in this region: 5 units",
      "Minimum units formula: N = S + L − 1 (L = independent loops, usually 0)",
    ],
    readings: [
      { label: "Streams + utilities (S)", value: "4", note: "H1, H2, C1, hot utility" },
      { label: "As-built units", value: "5" },
      { label: "Formula", value: "N = S − 1 (L=0)", note: "minimum units target" },
    ],
    refTables: ["units"],
    calcParts: [
      {
        id: "s-count",
        prompt: "How many streams and utilities (S) are involved in this region?",
        unit: "",
        answer: 4,
        tol: 0.1,
        tolType: "abs",
        hints: ["Count every stream plus every utility present.", "H1, H2, C1, hot utility."],
        worked: "S = 4 (two hot streams, one cold stream, one utility).",
      },
      {
        id: "n-min",
        prompt: "What is the minimum number of units this region needs (assuming no loops)?",
        unit: "units",
        answer: 3,
        tol: 0.1,
        tolType: "abs",
        hints: ["N = S − 1.", "4 − 1."],
        worked: "N = 4 − 1 = 3 units minimum.",
      },
      {
        id: "excess",
        prompt: "How many units beyond this minimum target does the as-built network have?",
        unit: "units",
        answer: 2,
        tol: 0.1,
        tolType: "abs",
        hints: ["As-built minus the minimum target.", "5 − 3."],
        worked: "5 − 3 = 2 units more than the target — a strong signal of at least one redundant loop.",
      },
    ],
    candidateCauseIds: ["excess-units", "needs-stream-split", "wrong-delta-t-min", "network-appropriate"],
    correctCauseIds: ["excess-units"],
    candidateActionIds: ["break-the-loop", "add-more-utility", "redesign-from-scratch", "accept-as-is"],
    correctActionIds: ["break-the-loop"],
    improvementActionIds: [],
    debrief:
      "Two units beyond the minimum target is a strong sign this region has redundant connections — heat that could reach a given point by more than one route, exactly what a loop means in this method. Rather than redesigning from scratch, look for the loop, remove the smallest-duty exchanger in it, and re-balance the remaining duties (usually with a small, acceptable change in approach temperature somewhere). That typically removes an entire piece of capital equipment for a negligible energy cost — a much better trade than starting over.",
    faultChain: [
      "Above-pinch region: S = 4 (H1, H2, C1, hot utility)",
      "Minimum units target = S − 1 = 3",
      "As-built network has 5 units — 2 more than the target",
      "Fix: find and break the loop, rebalancing the remaining exchangers",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "retrofit-audit-gap",
    title: "Case 8 — An Old Plant, Audited",
    tag: "Retrofit",
    brief:
      "A four-stream process has never had a pinch study run. Utility bills show it currently uses 45 kW of hot utility and 67 kW of cold utility. Run the targeting calculation and see how far the existing plant is from its true minimum — and what the gap's shape tells you.",
    knownFacts: [
      "Calculated minimum (from the full stream data, ΔTmin = 20 °C): hot utility 15 kW, cold utility 37 kW",
      "Actual utility bills: hot utility 45 kW, cold utility 67 kW",
      "A single misplaced connection of size Q raises both hot and cold utility by Q each (the golden-rule signature from Case 2)",
    ],
    readings: [
      { label: "Target hot utility", value: "15", unit: "kW" },
      { label: "Target cold utility", value: "37", unit: "kW" },
      { label: "Actual hot utility", value: "45", unit: "kW", note: "from site bills" },
      { label: "Actual cold utility", value: "67", unit: "kW", note: "from site bills" },
    ],
    refTables: ["targeting", "goldenrules"],
    calcParts: [
      {
        id: "hot-gap",
        prompt: "What is the gap between actual and target hot utility?",
        unit: "kW",
        answer: 30,
        tol: 0.05,
        tolType: "rel",
        hints: ["Actual − target.", "45 − 15."],
        worked: "45 − 15 = 30 kW more hot utility than the process genuinely needs.",
      },
      {
        id: "cold-gap",
        prompt: "What is the gap between actual and target cold utility?",
        unit: "kW",
        answer: 30,
        tol: 0.05,
        tolType: "rel",
        hints: ["Actual − target.", "67 − 37."],
        worked: "67 − 37 = 30 kW more cold utility than the process genuinely needs.",
      },
      {
        id: "signature-size",
        prompt: "Both gaps are exactly equal — the signature of a single misplaced-heat connection. What size violation would produce this exact pattern?",
        unit: "kW",
        answer: 30,
        tol: 0.05,
        tolType: "rel",
        hints: ["Each gap on its own equals the size of the misplaced duty (from the golden-rule penalty pattern).", "The gap itself: 30 kW."],
        worked: "A single 30 kW connection crossing the pinch (or utility misplaced on the wrong side) raises both utilities by 30 kW each — exactly matching both gaps here.",
      },
    ],
    candidateCauseIds: ["cross-pinch-utility", "no-target-set", "excess-units", "network-appropriate"],
    correctCauseIds: ["cross-pinch-utility"],
    candidateActionIds: ["reroute-utility", "recommend-new-exchanger", "add-more-utility", "redesign-from-scratch"],
    correctActionIds: ["reroute-utility"],
    improvementActionIds: ["recommend-new-exchanger"],
    debrief:
      "The equal 30 kW gap on both hot and cold utility isn't a coincidence — it's the exact signature of a golden-rule violation, the same pattern quantified in Case 2. Somewhere in this plant, a single ~30 kW connection is crossing the pinch or a utility is sitting on the wrong side of it, costing 60 kW of combined utility for the want of correct piping. The retrofit priority is to find that specific connection and reroute it — likely a near-free fix — before considering any new heat-recovery exchangers for what genuinely remains.",
    faultChain: [
      "Never pinch-analysed; bills show 45 kW hot, 67 kW cold",
      "Target (from stream data): 15 kW hot, 37 kW cold",
      "Both gaps equal 30 kW — the golden-rule violation signature",
      "Fix: find and reroute the ~30 kW misplaced connection",
    ],
  },
];

export function getPinchCase(id: string): PinchCase | undefined {
  return PINCH_CASES.find((c) => c.id === id);
}
