/**
 * Economic-analysis diagnostic cases — payback screening, time value of money,
 * NPV, IRR vs hurdle, NPV-vs-IRR on mutually exclusive projects, payback
 * misleading on a long-life measure, financing choice, and portfolio/risk. A mix
 * of quantify, reason and judgement. Numbers consistent with lib/econTables.ts.
 * Built on the shared diagnostics core.
 *
 * The discipline: a pound today is worth more than a pound tomorrow. Screen with
 * payback, but decide with NPV, IRR and whole-life cost — and price in risk.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const ECON_CAUSES: CauseDef[] = [
  { id: "short-payback", label: "Short payback — passes the screen, proceed" },
  { id: "ignored-time-value", label: "Future savings not discounted (time value ignored)" },
  { id: "positive-npv", label: "Positive NPV — earns above the discount rate" },
  { id: "irr-above-hurdle", label: "IRR exceeds the hurdle rate" },
  { id: "irr-misleads-size", label: "IRR favours the small project; NPV favours the larger" },
  { id: "payback-misleads-long-life", label: "Long payback but long life — payback wrongly rejects it" },
  { id: "no-capital", label: "No upfront capital — financing needed" },
  { id: "risk-not-priced", label: "Same headline NPV, different risk — needs risk-adjusting" },
  { id: "always-cheapest-capital", label: "Always choosing the lowest capital cost" },
  { id: "analysis-sound", label: "Analysis correct — no issue" },
];

export const ECON_ACTIONS: ActionDef[] = [
  { id: "proceed-screen-pass", label: "Proceed — it passes the payback screen", tier: 1 },
  { id: "discount-cashflows", label: "Discount the future cash flows (use present value)", tier: 1 },
  { id: "accept-positive-npv", label: "Accept — NPV is positive", tier: 1 },
  { id: "accept-irr-above-hurdle", label: "Accept — IRR exceeds the hurdle", tier: 1 },
  { id: "pick-highest-npv", label: "For mutually exclusive projects, pick the highest NPV", tier: 1 },
  { id: "use-npv-not-payback", label: "Judge by NPV over the life, not simple payback", tier: 1 },
  { id: "risk-adjust-sequence", label: "Risk-adjust the hurdle and sequence quick wins first", tier: 1 },
  { id: "use-loan", label: "Fund with a loan (IRR exceeds the loan rate)", tier: 2 },
  { id: "use-esco", label: "Use a performance contract (ESCO) to avoid capital / de-risk", tier: 3 },
  { id: "pick-highest-irr", label: "Pick the highest-IRR project", tier: 1 },
  { id: "reject-on-payback", label: "Reject it on the long simple payback", tier: 1 },
  { id: "pick-lowest-capital", label: "Pick the lowest capital cost", tier: 1 },
  { id: "reject-project", label: "Reject the project", tier: 1 },
];

export type EconRefTable = "payback" | "tvm" | "npvirr" | "tco" | "financing" | "portfolio";

export interface EconCase extends DiagnosticCase {
  refTables: EconRefTable[];
}

export const ECON_CASES: EconCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "payback-screen",
    title: "Case 1 — A quick screen",
    tag: "Payback",
    brief:
      "A motor upgrade costs £24,000 and saves £8,000/yr, on equipment with a 10-year life. You want a fast yes/no before doing detailed analysis. Use simple payback to screen it.",
    knownFacts: [
      "Capital cost £24,000; annual saving £8,000",
      "Equipment life ~10 years",
      "Rule of thumb: payback < 3 years is almost certainly worth doing",
      "Payback = cost ÷ annual saving",
    ],
    readings: [
      { label: "Capital cost", value: "24,000", unit: "£" },
      { label: "Annual saving", value: "8,000", unit: "£/yr" },
      { label: "Equipment life", value: "10", unit: "years" },
      { label: "Screen threshold", value: "< 3", unit: "years" },
    ],
    refTables: ["payback"],
    calcParts: [
      {
        id: "payback",
        prompt: "What is the simple payback?",
        unit: "years",
        answer: 3,
        tol: 0.1,
        tolType: "abs",
        hints: ["Cost ÷ annual saving.", "24,000 ÷ 8,000."],
        worked: "£24,000 ÷ £8,000 = 3 years — at or under the screening threshold.",
      },
      {
        id: "nominal",
        prompt: "What is the total (undiscounted) saving over the 10-year life?",
        unit: "£",
        answer: 80000,
        tol: 0.02,
        tolType: "rel",
        hints: ["Annual saving × life.", "8,000 × 10."],
        worked: "£8,000 × 10 = £80,000 of nominal savings.",
      },
      {
        id: "net",
        prompt: "What is the net nominal gain over the life?",
        unit: "£",
        answer: 56000,
        tol: 0.03,
        tolType: "rel",
        hints: ["Total saving − cost.", "80,000 − 24,000."],
        worked: "£80,000 − £24,000 = £56,000 net (before discounting) — a clear quick win.",
      },
    ],
    candidateCauseIds: ["analysis-sound", "short-payback", "payback-misleads-long-life", "ignored-time-value"],
    correctCauseIds: ["short-payback"],
    candidateActionIds: ["proceed-screen-pass", "discount-cashflows", "reject-project", "reject-on-payback"],
    correctActionIds: ["proceed-screen-pass"],
    improvementActionIds: [],
    debrief:
      "Simple payback is the right tool for a fast screen: cost ÷ annual saving = 3 years here, comfortably inside the under-3-year 'almost certainly worth it' band, on a 10-year asset. Proceed. Payback is fine for screening and for comparing similar projects — its limits (ignoring time value, life and residual value) only bite on longer-payback, longer-life decisions, where you'd reach for NPV.",
    faultChain: [
      "£24,000 cost, £8,000/yr saving, 10-year life",
      "Payback 3 years — passes the screen",
      "£56,000 net nominal over the life",
      "Fix: proceed (payback screen passed)",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "time-value",
    title: "Case 2 — Worth £100,000?",
    tag: "Time value",
    brief:
      "A proposer says a 20-year boiler retrofit saving £5,000/yr is 'worth £100,000' — just 20 × £5,000. But money in year 20 is worth far less than money today. At a 5% discount rate, what is that stream of savings really worth now?",
    knownFacts: [
      "20-year stream of £5,000/yr savings",
      "Discount rate 5%",
      "Annuity factor for 5%, 20 years = 12.46",
      "Present value = annual saving × annuity factor",
    ],
    readings: [
      { label: "Annual saving", value: "5,000", unit: "£/yr" },
      { label: "Years", value: "20", unit: "" },
      { label: "Discount rate", value: "5", unit: "%" },
      { label: "Annuity factor (5%, 20)", value: "12.46", unit: "" },
    ],
    refTables: ["tvm", "npvirr"],
    calcParts: [
      {
        id: "naive",
        prompt: "What is the naive (undiscounted) total?",
        unit: "£",
        answer: 100000,
        tol: 0.02,
        tolType: "rel",
        hints: ["Annual × years.", "5,000 × 20."],
        worked: "£5,000 × 20 = £100,000 — but this ignores the time value of money.",
      },
      {
        id: "pv",
        prompt: "What is the present value of the savings (at 5%)?",
        unit: "£",
        answer: 62300,
        tol: 0.02,
        tolType: "rel",
        hints: ["Annual × annuity factor.", "5,000 × 12.46."],
        worked: "£5,000 × 12.46 = £62,300 — what the stream is actually worth today.",
      },
      {
        id: "overvaluation",
        prompt: "By how much did the naive figure overvalue the savings?",
        unit: "£",
        answer: 37700,
        tol: 0.05,
        tolType: "rel",
        hints: ["Naive − present value.", "100,000 − 62,300."],
        worked: "£100,000 − £62,300 = £37,700 of overvaluation from ignoring the time value of money.",
      },
    ],
    candidateCauseIds: ["positive-npv", "short-payback", "analysis-sound", "ignored-time-value"],
    correctCauseIds: ["ignored-time-value"],
    candidateActionIds: ["reject-project", "pick-highest-irr", "discount-cashflows", "accept-positive-npv"],
    correctActionIds: ["discount-cashflows"],
    improvementActionIds: [],
    debrief:
      "A pound today is worth more than a pound tomorrow, because today's pound can be invested. Adding up twenty years of £5,000 ignores that, overstating the value by £37,700. Discounting at 5% — multiplying by the annuity factor — gives the honest present value of £62,300. Over 10+ years, discounting matters enormously, which is why long-lived energy projects must be judged with discounted methods, not nominal sums.",
    faultChain: [
      "Claim: 20 × £5,000 = £100,000",
      "Discounted at 5%: £5,000 × 12.46 = £62,300",
      "Naive figure overvalues by £37,700",
      "Fix: discount the future cash flows",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "npv",
    title: "Case 3 — Does it clear the bar?",
    tag: "NPV",
    brief:
      "A £50,000 retrofit saves £6,000/yr for 15 years. Your discount rate is 8%. Work out the net present value and decide whether to do it.",
    knownFacts: [
      "Capital £50,000; saving £6,000/yr for 15 years",
      "Discount rate 8%",
      "Annuity factor for 8%, 15 years = 8.56",
      "NPV = (annual saving × annuity factor) − cost; accept if NPV > 0",
    ],
    readings: [
      { label: "Capital cost", value: "50,000", unit: "£" },
      { label: "Annual saving", value: "6,000", unit: "£/yr" },
      { label: "Years / rate", value: "15 / 8%", unit: "" },
      { label: "Annuity factor (8%, 15)", value: "8.56", unit: "" },
    ],
    refTables: ["npvirr"],
    calcParts: [
      {
        id: "pv",
        prompt: "What is the present value of the savings?",
        unit: "£",
        answer: 51354,
        tol: 0.02,
        tolType: "rel",
        hints: ["Annual saving × annuity factor.", "6,000 × 8.56."],
        worked: "£6,000 × 8.56 = £51,354.",
      },
      {
        id: "npv",
        prompt: "What is the NPV?",
        unit: "£",
        answer: 1354,
        tol: 0.2,
        tolType: "rel",
        hints: ["PV of savings − cost.", "51,354 − 50,000."],
        worked: "£51,354 − £50,000 = +£1,354.",
      },
      {
        id: "decision",
        prompt: "Is the NPV positive (1 = yes, 0 = no)?",
        unit: "(1/0)",
        answer: 1,
        tol: 0.1,
        tolType: "abs",
        hints: ["Positive NPV means accept.", "+£1,354 > 0 → 1."],
        worked: "NPV is positive (+£1,354), so the project earns more than your 8% discount rate — accept it (if only just).",
      },
    ],
    candidateCauseIds: ["ignored-time-value", "payback-misleads-long-life", "positive-npv", "analysis-sound"],
    correctCauseIds: ["positive-npv"],
    candidateActionIds: ["reject-project", "accept-positive-npv", "pick-highest-irr", "reject-on-payback"],
    correctActionIds: ["accept-positive-npv"],
    improvementActionIds: [],
    debrief:
      "NPV is the rigorous test: discount every future saving to today and subtract the cost. Here the savings are worth £51,354 today against a £50,000 cost, so NPV is +£1,354 — positive, meaning the project earns more than your 8% hurdle and should be accepted. A positive NPV is the decision rule; the margin (only £1,354 here) also tells you how much headroom you have if the assumptions slip.",
    faultChain: [
      "£50,000 cost; £6,000/yr × 15 yr; 8% rate",
      "PV of savings £6,000 × 8.56 = £51,354",
      "NPV = +£1,354 (> 0)",
      "Fix: accept — NPV is positive",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "irr",
    title: "Case 4 — Beating the hurdle",
    tag: "IRR",
    brief:
      "A £10,000 VFD retrofit saves £3,000/yr over an 8-year life, and its internal rate of return works out at 24%. Your company's hurdle rate is 8%. Decide whether it clears the bar.",
    knownFacts: [
      "Capital £10,000; saving £3,000/yr for 8 years",
      "Project IRR = 24%",
      "Company hurdle (required) rate = 8%",
      "Decision rule: accept if IRR > hurdle rate",
    ],
    readings: [
      { label: "Capital cost", value: "10,000", unit: "£" },
      { label: "Annual saving", value: "3,000", unit: "£/yr" },
      { label: "Project IRR", value: "24", unit: "%" },
      { label: "Hurdle rate", value: "8", unit: "%" },
    ],
    refTables: ["npvirr"],
    calcParts: [
      {
        id: "payback",
        prompt: "What is the simple payback?",
        unit: "years",
        answer: 3.33,
        tol: 0.1,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "10,000 ÷ 3,000."],
        worked: "£10,000 ÷ £3,000 ≈ 3.3 years.",
      },
      {
        id: "margin",
        prompt: "By how much does the IRR exceed the hurdle rate?",
        unit: "%",
        answer: 16,
        tol: 1,
        tolType: "abs",
        hints: ["IRR − hurdle.", "24 − 8."],
        worked: "24% − 8% = 16 percentage points of margin — comfortably above the bar.",
      },
      {
        id: "net",
        prompt: "What is the net nominal gain over the 8-year life?",
        unit: "£",
        answer: 14000,
        tol: 0.05,
        tolType: "rel",
        hints: ["(annual × years) − cost.", "3,000 × 8 − 10,000."],
        worked: "£3,000 × 8 − £10,000 = £14,000 net (nominal).",
      },
    ],
    candidateCauseIds: ["irr-above-hurdle", "irr-misleads-size", "ignored-time-value", "analysis-sound"],
    correctCauseIds: ["irr-above-hurdle"],
    candidateActionIds: ["pick-lowest-capital", "accept-irr-above-hurdle", "reject-on-payback", "reject-project"],
    correctActionIds: ["accept-irr-above-hurdle"],
    improvementActionIds: [],
    debrief:
      "IRR is the project's own rate of return — the discount rate at which its NPV would be zero. The rule is simple: accept if the IRR beats your hurdle rate. At 24% against an 8% hurdle, this VFD clears the bar by 16 points. IRR is handy because it's a single number that finance recognises, and it's independent of the exact discount rate — though for comparing projects of different sizes you switch to NPV (next case).",
    faultChain: [
      "£10,000 VFD; £3,000/yr × 8 yr; IRR 24%",
      "Hurdle 8% → IRR beats it by 16 points",
      "£14,000 net nominal over the life",
      "Fix: accept — IRR exceeds the hurdle",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "npv-vs-irr",
    title: "Case 5 — Big or beautiful?",
    tag: "NPV vs IRR",
    brief:
      "You can do only one of two mutually exclusive projects, both 5-year, discounted at 8% (annuity factor 3.99). Project A costs £10,000 and saves £5,000/yr (a stellar IRR). Project B costs £100,000 and saves £30,000/yr (a lower IRR). The small one has the higher percentage return — but which creates more value?",
    knownFacts: [
      "Mutually exclusive — pick one. Both 5 years, 8% discount (annuity factor 3.99)",
      "Project A: cost £10,000, saving £5,000/yr",
      "Project B: cost £100,000, saving £30,000/yr",
      "For mutually exclusive projects, choose the higher NPV (not the higher IRR)",
    ],
    readings: [
      { label: "Project A", value: "£10k → £5k/yr", unit: "" },
      { label: "Project B", value: "£100k → £30k/yr", unit: "" },
      { label: "Annuity factor (8%, 5)", value: "3.99", unit: "" },
      { label: "Constraint", value: "one only", note: "mutually exclusive" },
    ],
    refTables: ["npvirr"],
    calcParts: [
      {
        id: "npv-a",
        prompt: "What is Project A's NPV?",
        unit: "£",
        answer: 9965,
        tol: 0.05,
        tolType: "rel",
        hints: ["(saving × factor) − cost.", "5,000 × 3.99 − 10,000."],
        worked: "£5,000 × 3.99 − £10,000 = £19,950 − £10,000 = £9,950 (≈ £9,965).",
      },
      {
        id: "npv-b",
        prompt: "What is Project B's NPV?",
        unit: "£",
        answer: 19790,
        tol: 0.05,
        tolType: "rel",
        hints: ["(saving × factor) − cost.", "30,000 × 3.99 − 100,000."],
        worked: "£30,000 × 3.99 − £100,000 = £119,700 − £100,000 = £19,700 (≈ £19,790).",
      },
      {
        id: "extra",
        prompt: "How much more value does the better choice create?",
        unit: "£",
        answer: 9825,
        tol: 0.1,
        tolType: "rel",
        hints: ["Higher NPV − lower NPV.", "19,790 − 9,965."],
        worked: "£19,790 − £9,965 ≈ £9,825 — B creates nearly twice the value, despite A's higher IRR.",
      },
    ],
    candidateCauseIds: ["irr-misleads-size", "irr-above-hurdle", "analysis-sound", "always-cheapest-capital"],
    correctCauseIds: ["irr-misleads-size"],
    candidateActionIds: ["pick-highest-irr", "pick-lowest-capital", "pick-highest-npv", "reject-project"],
    correctActionIds: ["pick-highest-npv"],
    improvementActionIds: [],
    debrief:
      "IRR is a percentage, so it loves small projects — Project A's £5k on £10k looks spectacular. But you can't bank a percentage; you bank pounds. For mutually exclusive projects you pick the highest NPV, and B adds ~£19,790 of value against A's ~£9,965 — nearly double. A higher IRR on a small base loses to a solid return on a large one. Use NPV to choose between competing projects; use IRR to check each clears the hurdle.",
    faultChain: [
      "Two mutually exclusive projects; A has the higher IRR",
      "NPV_A ≈ £9,965 vs NPV_B ≈ £19,790",
      "B creates ~£9,825 more value",
      "Fix: pick the highest NPV (not the highest IRR)",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "payback-misleads",
    title: "Case 6 — The 10-year payback that pays",
    tag: "TCO",
    brief:
      "An insulation project costs £40,000 and saves £4,000/yr — a 10-year simple payback, which fails the usual 'under 7 years' screen. But the insulation lasts 25 years, and your discount rate is only 5%. Should the long payback really kill it?",
    knownFacts: [
      "Capital £40,000; saving £4,000/yr; insulation life ~25 years",
      "Simple payback fails the common under-7-year screen",
      "Discount rate 5%; annuity factor for 5%, 25 years = 14.09",
      "Judge a long-life measure by NPV, not simple payback",
    ],
    readings: [
      { label: "Capital cost", value: "40,000", unit: "£" },
      { label: "Annual saving", value: "4,000", unit: "£/yr" },
      { label: "Life", value: "25", unit: "years" },
      { label: "Annuity factor (5%, 25)", value: "14.09", unit: "" },
    ],
    refTables: ["payback", "npvirr"],
    calcParts: [
      {
        id: "payback",
        prompt: "What is the simple payback?",
        unit: "years",
        answer: 10,
        tol: 0.2,
        tolType: "abs",
        hints: ["Cost ÷ annual saving.", "40,000 ÷ 4,000."],
        worked: "£40,000 ÷ £4,000 = 10 years — beyond the usual 7-year screen, so payback alone says reject.",
      },
      {
        id: "pv",
        prompt: "What is the present value of 25 years of savings?",
        unit: "£",
        answer: 56376,
        tol: 0.02,
        tolType: "rel",
        hints: ["Annual × annuity factor.", "4,000 × 14.09."],
        worked: "£4,000 × 14.09 = £56,376.",
      },
      {
        id: "npv",
        prompt: "What is the NPV?",
        unit: "£",
        answer: 16376,
        tol: 0.06,
        tolType: "rel",
        hints: ["PV of savings − cost.", "56,376 − 40,000."],
        worked: "£56,376 − £40,000 = +£16,376 — clearly worth doing, despite the 10-year payback.",
      },
    ],
    candidateCauseIds: ["analysis-sound", "payback-misleads-long-life", "short-payback", "ignored-time-value"],
    correctCauseIds: ["payback-misleads-long-life"],
    candidateActionIds: ["reject-project", "pick-lowest-capital", "reject-on-payback", "use-npv-not-payback"],
    correctActionIds: ["use-npv-not-payback"],
    improvementActionIds: [],
    debrief:
      "Simple payback ignores everything after the payback point — fatal for a long-life measure. This insulation 'fails' on a 10-year payback, but it keeps saving for 25 years, and at a 5% discount rate those savings are worth £56,376 against a £40,000 cost: NPV +£16,376. Reject it on payback and you'd throw away £16k of value. For anything with a long life or a payback in the grey zone, NPV (and whole-life cost) tells the truth.",
    faultChain: [
      "£40,000 insulation, £4,000/yr → 10-year payback (fails screen)",
      "But 25-year life; PV of savings £56,376 at 5%",
      "NPV = +£16,376 — clearly worthwhile",
      "Fix: judge by NPV over the life, not simple payback",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "financing",
    title: "Case 7 — Worth doing, no cash to do it",
    tag: "Financing",
    brief:
      "A £50,000 project saving £10,000/yr over a 15-year life is clearly worthwhile (IRR ~20%), but there's no capital budget this year. Compare funding it with a bank loan against a performance contract (ESCO that keeps 60% of the savings).",
    knownFacts: [
      "Project £50,000; saving £10,000/yr for 15 years; IRR ~20%",
      "No upfront capital available",
      "Loan: total repaid ~£57,960 over 5 years (then savings are all yours)",
      "ESCO: no capital, but keeps 60% of savings (you keep 40%)",
    ],
    readings: [
      { label: "Annual saving", value: "10,000", unit: "£/yr" },
      { label: "Life", value: "15", unit: "years" },
      { label: "Loan total repaid", value: "57,960", unit: "£" },
      { label: "Your ESCO share", value: "40", unit: "%" },
    ],
    refTables: ["financing"],
    calcParts: [
      {
        id: "loan-net",
        prompt: "What is the 15-year net benefit if funded by the loan?",
        unit: "£",
        answer: 92040,
        tol: 0.03,
        tolType: "rel",
        hints: ["Total savings − loan repaid.", "10,000 × 15 − 57,960."],
        worked: "£10,000 × 15 − £57,960 = £150,000 − £57,960 = £92,040.",
      },
      {
        id: "esco-net",
        prompt: "What is the 15-year net benefit under the ESCO (you keep 40%)?",
        unit: "£",
        answer: 60000,
        tol: 0.04,
        tolType: "rel",
        hints: ["Your share × total savings.", "0.40 × 10,000 × 15."],
        worked: "0.40 × £10,000 × 15 = £60,000 (no capital, but the ESCO keeps the rest).",
      },
      {
        id: "advantage",
        prompt: "How much more does the loan net over the ESCO?",
        unit: "£",
        answer: 32040,
        tol: 0.05,
        tolType: "rel",
        hints: ["Loan net − ESCO net.", "92,040 − 60,000."],
        worked: "£92,040 − £60,000 = £32,040 — a loan keeps far more, since the project's 20% IRR easily beats the loan rate.",
      },
    ],
    candidateCauseIds: ["always-cheapest-capital", "positive-npv", "analysis-sound", "no-capital"],
    correctCauseIds: ["no-capital"],
    candidateActionIds: ["pick-lowest-capital", "use-loan", "reject-project", "use-esco"],
    correctActionIds: ["use-loan"],
    improvementActionIds: ["use-esco"],
    debrief:
      "A lack of capital is no reason to drop a good project — it's a financing question. Because the project's ~20% IRR easily beats a ~6% loan, a loan funds it profitably and you keep the most (£92,040 net over 15 years). An ESCO needs no capital and guarantees the savings, but it takes the lion's share, leaving you £60,000 — £32,040 less. Choose a loan when the return beats the borrowing cost and you can service it; choose an ESCO to avoid capital entirely or to transfer the performance risk.",
    faultChain: [
      "Worthwhile project (IRR ~20%), no capital this year",
      "Loan net £92,040 vs ESCO net £60,000 over 15 years",
      "Loan keeps £32,040 more — IRR beats the loan rate",
      "Fix: fund with a loan (or an ESCO to de-risk / avoid capital)",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "portfolio",
    title: "Case 8 — Same NPV, different risk",
    tag: "Portfolio",
    brief:
      "Two £50,000 projects each show about £20,000 NPV at an 8% hurdle. Project A is an LED retrofit — proven, savings guaranteed. Project B is advanced controls — savings depend on commissioning and operator behaviour. Risk-adjust the hurdle (6% for the certain one, 12% for the uncertain) and see which really comes out ahead.",
    knownFacts: [
      "Project A (LED, high certainty): £50,000, saves £8,500/yr, hurdle 6% (factor 7.36)",
      "Project B (controls, low certainty): £50,000, saves £9,000/yr, hurdle 12% (factor 5.65)",
      "Both 10-year life; same ~£20k NPV at a flat 8%",
      "Portfolio thinking prices risk and sequences quick wins first",
    ],
    readings: [
      { label: "Project A", value: "£50k → £8.5k/yr", note: "proven, certain" },
      { label: "Project B", value: "£50k → £9k/yr", note: "uncertain savings" },
      { label: "Hurdle A / B", value: "6% / 12%", unit: "" },
      { label: "Factors (6%,10 / 12%,10)", value: "7.36 / 5.65", unit: "" },
    ],
    refTables: ["portfolio", "npvirr"],
    calcParts: [
      {
        id: "npv-a",
        prompt: "What is Project A's risk-adjusted NPV (at 6%)?",
        unit: "£",
        answer: 12560,
        tol: 0.05,
        tolType: "rel",
        hints: ["(saving × factor) − cost.", "8,500 × 7.36 − 50,000."],
        worked: "£8,500 × 7.36 − £50,000 = £62,560 − £50,000 = £12,560.",
      },
      {
        id: "npv-b",
        prompt: "What is Project B's risk-adjusted NPV (at 12%)?",
        unit: "£",
        answer: 850,
        tol: 0.3,
        tolType: "rel",
        hints: ["(saving × factor) − cost.", "9,000 × 5.65 − 50,000."],
        worked: "£9,000 × 5.65 − £50,000 = £50,850 − £50,000 = £850 — barely positive once risk is priced.",
      },
      {
        id: "gap",
        prompt: "How much higher is the certain project's risk-adjusted NPV?",
        unit: "£",
        answer: 11710,
        tol: 0.06,
        tolType: "rel",
        hints: ["NPV_A − NPV_B.", "12,560 − 850."],
        worked: "£12,560 − £850 = £11,710 — the proven project pulls far ahead once risk is accounted for.",
      },
    ],
    candidateCauseIds: ["risk-not-priced", "analysis-sound", "irr-misleads-size", "always-cheapest-capital"],
    correctCauseIds: ["risk-not-priced"],
    candidateActionIds: ["pick-lowest-capital", "risk-adjust-sequence", "pick-highest-irr", "reject-project"],
    correctActionIds: ["risk-adjust-sequence"],
    improvementActionIds: [],
    debrief:
      "Two projects with the same headline NPV are not equally attractive if one is far riskier. Pricing the risk — a low hurdle for the proven LED, a high one for the behaviour-dependent controls — pulls them apart: £12,560 versus £850. Portfolio thinking does the LED first (a high-certainty quick win that builds confidence and funds the next phase), and treats the controls project as a riskier, later bet whose savings must be verified. Same NPV on paper, very different decisions.",
    faultChain: [
      "Two £50k projects, ~£20k NPV each at a flat 8%",
      "Risk-adjusted: A (6%) £12,560 vs B (12%) £850",
      "The proven project leads by £11,710 once risk is priced",
      "Fix: risk-adjust the hurdle and sequence quick wins first",
    ],
  },
];

export function getEconCase(id: string): EconCase | undefined {
  return ECON_CASES.find((c) => c.id === id);
}
