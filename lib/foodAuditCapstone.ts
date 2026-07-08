/**
 * Food manufacturing sector capstone — content & scoring, reusing the same
 * staged-audit engine (components/simulators/AuditCapstone.tsx) and generic
 * types/scoring from lib/auditCapstone.ts.
 *
 * One realistic client (Ashdown Foods, a 12,000 tonne/year chilled
 * ready-meals factory) is taken through the whole audit lifecycle. The
 * dataset is internally consistent so every calculation is deterministic:
 *   gas  = 40,000 + 60 × tonnes            (washdown/CIP base + cooking)
 *   elec = 120,000 + 80 × tonnes + 400 × CDD  (base + process/chill + condensers)
 * Degree-day base 15.5 °C. Annual: 1,200,000 kWh gas, 2,462,000 kWh elec,
 * 12,000 t → SEC 100 + 205 = 305 kWh/tonne.
 */

import type { CalcPart } from "./diagnostics";
import type { Stage, MultiQ, SingleQ, OrderQ, Question, ChoiceOption } from "./auditCapstone";

// ----- Reference values learners need (shown in the data panels) -------------

export const REFERENCE = {
  cddBase: 15.5, // °C — cooling degree-day base temperature
  elecPrice: 0.2, // £/kWh
  gasPrice: 0.06, // £/kWh
  co2Factor: 0.207, // kg CO₂e per kWh (grid electricity)
  annualTonnes: 12000, // tonnes/year — Ashdown's scale
};

export interface FoodMonthRow {
  month: string;
  avgTempC: number;
  cdd: number;
  tonnes: number;
  gasKwh: number;
  elecKwh: number;
}

/** 12 months of production and utility data (most recent year). Internally consistent. */
export const DATASET: FoodMonthRow[] = [
  { month: "Jan", avgTempC: 4.5, cdd: 0, tonnes: 1050, gasKwh: 103000, elecKwh: 204000 },
  { month: "Feb", avgTempC: 6.5, cdd: 0, tonnes: 1000, gasKwh: 100000, elecKwh: 200000 },
  { month: "Mar", avgTempC: 7.5, cdd: 0, tonnes: 1040, gasKwh: 102400, elecKwh: 203200 },
  { month: "Apr", avgTempC: 10.5, cdd: 0, tonnes: 1000, gasKwh: 100000, elecKwh: 200000 },
  { month: "May", avgTempC: 12.5, cdd: 0, tonnes: 980, gasKwh: 98800, elecKwh: 198400 },
  { month: "Jun", avgTempC: 15.5, cdd: 0, tonnes: 950, gasKwh: 97000, elecKwh: 196000 },
  { month: "Jul", avgTempC: 18.5, cdd: 0 /* learner computes: 93 */, tonnes: 900, gasKwh: 94000, elecKwh: 229200 },
  { month: "Aug", avgTempC: 17.5, cdd: 62, tonnes: 920, gasKwh: 95200, elecKwh: 218400 },
  { month: "Sep", avgTempC: 14.5, cdd: 0, tonnes: 1000, gasKwh: 100000, elecKwh: 200000 },
  { month: "Oct", avgTempC: 11.5, cdd: 0, tonnes: 1040, gasKwh: 102400, elecKwh: 203200 },
  { month: "Nov", avgTempC: 7.5, cdd: 0, tonnes: 1060, gasKwh: 103600, elecKwh: 204800 },
  { month: "Dec", avgTempC: 5.5, cdd: 0, tonnes: 1060, gasKwh: 103600, elecKwh: 204800 },
];

/** Headline annual figures (Jul CDD shown as 93 once computed). */
export const ANNUAL = {
  gasKwh: 1200000,
  elecKwh: 2462000,
  tonnes: 12000,
  cdd: 155,
};

// ----- Stage 1 — Plan & scope --------------------------------------------------

const stage1: Stage = {
  id: "plan",
  title: "Plan & Scope",
  competency: "Planning & scoping",
  icon: "🗺️",
  intro:
    "Ashdown Foods makes chilled ready meals: 12,000 tonnes a year across two production lines, with cooking kettles and ovens, a blast-chilling hall, a large ammonia refrigeration plant, nightly hygiene washdown and CIP, a packaging hall, and a chilled despatch warehouse, all on one site. Energy costs are up sharply, a retailer customer is asking for a carbon-reduction plan, and nobody has audited the site holistically. Before you set foot on site, get the plan right.",
  questions: [
    {
      kind: "single",
      id: "audit-level",
      prompt: "Which level of audit best fits this brief?",
      help: "Match the depth (and cost) of the audit to what the client actually needs to decide.",
      options: [
        { id: "walk", label: "Walk-through (ASHRAE Level 1) only — a quick site tour and bill review" },
        { id: "detailed", label: "Detailed audit (ASHRAE Level 2) — survey, sub-metering and normalised analysis, with an investment-grade workup on the 1–2 largest measures" },
        { id: "invgrade", label: "Full investment-grade (Level 3) on every system across the whole site" },
      ],
      correctId: "detailed",
      explain:
        "A detailed (Level 2) audit fits: enough measurement and analysis to find and rank genuine opportunities, with investment-grade rigour saved for whichever project turns out biggest. A walk-through won't support a carbon-reduction plan a retail customer will scrutinise; Level 3 on everything is more than the brief needs.",
    },
    {
      kind: "single",
      id: "boundary",
      prompt:
        "Ashdown's meals are distributed by a third-party chilled haulier from the despatch warehouse. Should the hauliers' vehicle fuel be inside this audit's boundary?",
      help: "The boundary question — what can this audit measure and what can the client act on?",
      options: [
        { id: "outside", label: "No — draw the boundary at the site gate; distribution is another company's fleet, fuel bill and operation, and belongs in a scope 3 exercise, not this site audit" },
        { id: "inside", label: "Yes — estimate the hauliers' diesel and include it in the site's energy totals" },
        { id: "unsure", label: "Include it only in winter, when refrigerated trailers work hardest" },
      ],
      correctId: "outside",
      explain:
        "Draw the boundary at what the client can measure and act on: the site's own meters and plant. Distribution emissions matter to the retailer's carbon questions, but they are a supply-chain (scope 3) exercise with different data and different owners — folding an estimate into a site audit would muddy both.",
    },
    {
      kind: "multi",
      id: "site-hazards",
      prompt: "Which of these should be arranged or flagged before walking the factory?",
      help: "Food factories have hygiene rules and hazards an energy auditor must plan around.",
      options: [
        { id: "hygiene", label: "Hygiene induction and kit: high-care areas need coats, boot changes and controlled entry, planned with the site's technical team" },
        { id: "ammonia", label: "The ammonia plant room: entry rules, alarm response and an escort — ammonia is toxic and plant rooms are controlled spaces" },
        { id: "washdown", label: "Timing: walking lines during production and again during the nightly washdown shows both halves of the energy story" },
        { id: "none", label: "Nothing special — a food factory is like any other light-industrial site" },
      ],
      correctIds: ["hygiene", "ammonia", "washdown"],
      explain:
        "All three are real. High-care hygiene rules decide where you can walk and in what order (low-risk to high-care, never back); the ammonia plant room has its own safety regime; and seeing the washdown shift is essential because a third of the site's gas is spent after production stops. Treating a food factory as generic light industry is how auditors get escorted off site.",
    },
    {
      kind: "order",
      id: "sequence",
      prompt: "Put these planning steps in the order you'd actually do them.",
      items: [
        { id: "a", label: "Agree the audit's scope, boundary and level with the client" },
        { id: "b", label: "Request 12+ months of gas and electricity bills, plus monthly production (tonnes) records" },
        { id: "c", label: "Analyse the data for patterns (base loads, production and weather response) before visiting" },
        { id: "d", label: "Schedule the visit across a production day and a washdown shift, with hygiene and ammonia inductions arranged" },
      ],
      correctOrder: ["a", "b", "c", "d"],
      explain:
        "Scope first (it defines the data you need), then get the data, then analyse it before the visit so you walk in already knowing the site's patterns — the flat summer gas floor in the bills tells you exactly what to look for during washdown. The visit comes last, planned around production and hygiene rules.",
    },
  ],
};

// ----- Stage 2 — On-site & build the model ------------------------------------

const stage2: Stage = {
  id: "onsite",
  title: "On-Site",
  competency: "Site investigation & model building",
  icon: "🔍",
  intro:
    "On site: the cooking kettles run on steam from a gas boiler, washdown fills a gas-fired calorifier every night, the ammonia plant's condensers hum on the roof with no heat recovery, and the spiral freezer defrosts on a fixed timer. Now turn the monthly data into a model of how Ashdown actually behaves.",
  showData: true,
  calcIntro:
    "Use the 12-month dataset and the reference values. Both models are linear: a base load plus production and (for electricity) weather terms.",
  calcParts: [
    {
      id: "gas-coeff",
      prompt: "Compare January (1,050 t) with July (900 t). What is the gas model's production coefficient (kWh per tonne)?",
      unit: "kWh/t",
      answer: 60,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "(January gas − July gas) ÷ (January tonnes − July tonnes).",
        "(103,000 − 94,000) ÷ (1,050 − 900).",
      ],
      worked: "(103,000 − 94,000) ÷ 150 = 60 kWh of gas per tonne — the cooking load.",
    },
    {
      id: "gas-base",
      prompt: "Using January again, what is the gas base load (kWh/month) — washdown, CIP and space heating that happen regardless of tonnage?",
      unit: "kWh/mo",
      answer: 40000,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "January gas − (coefficient × January tonnes).",
        "103,000 − 60 × 1,050.",
      ],
      worked: "103,000 − 63,000 = 40,000 kWh/month of production-independent gas. Check December: 40,000 + 60 × 1,060 = 103,600 — matches the meter.",
    },
    {
      id: "jul-cdd",
      prompt: "July's CDD is missing. With an average temperature of 18.5 °C over 31 days (base 15.5 °C), what is it?",
      unit: "CDD",
      answer: 93,
      tol: 0.05,
      tolType: "rel",
      hints: [
        "CDD = (average temperature − base) × days, when the average is above the base.",
        "(18.5 − 15.5) × 31.",
      ],
      worked: "(18.5 − 15.5) × 31 = 93 cooling degree-days.",
    },
    {
      id: "cdd-coeff",
      prompt: "Using August (920 t, 62 CDD) and the electricity model's production coefficient of 80 kWh/t with a 120,000 kWh base, what is the CDD coefficient?",
      unit: "kWh/CDD",
      answer: 400,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "(August elec − base − 80 × tonnes) ÷ August CDD.",
        "(218,400 − 120,000 − 73,600) ÷ 62.",
      ],
      worked: "(218,400 − 120,000 − 73,600) ÷ 62 = 400 kWh per cooling degree-day — the condensers working harder in warm weather. July confirms it: 120,000 + 80 × 900 + 400 × 93 = 229,200, exactly what the meter recorded.",
    },
  ],
};

// ----- Stage 3 — Analyse & normalise -------------------------------------------

const stage3: Stage = {
  id: "analyse",
  title: "Analyse & Normalise",
  competency: "Data analysis (normalisation & benchmarking)",
  icon: "📊",
  intro:
    "With the model complete, turn the year into the per-tonne figures that make Ashdown comparable — to its own history, and to any target its retail customer sets.",
  calcIntro: "Using the completed 12-month dataset (July's CDD now filled in at 93):",
  calcParts: [
    {
      id: "total-gas",
      prompt: "What was total gas consumption for the year?",
      unit: "kWh",
      answer: 1200000,
      tol: 0.02,
      tolType: "rel",
      hints: [
        "Sum all 12 months' gas kWh.",
        "103,000+100,000+102,400+100,000+98,800+97,000+94,000+95,200+100,000+102,400+103,600+103,600.",
      ],
      worked: "Summing all 12 months gives 1,200,000 kWh of gas.",
    },
    {
      id: "total-elec",
      prompt: "What was total electricity consumption for the year?",
      unit: "kWh",
      answer: 2462000,
      tol: 0.02,
      tolType: "rel",
      hints: [
        "Sum all 12 months' electricity.",
        "204,000+200,000+203,200+200,000+198,400+196,000+229,200+218,400+200,000+203,200+204,800+204,800.",
      ],
      worked: "Summing all 12 months gives 2,462,000 kWh of electricity.",
    },
    {
      id: "sec-total",
      prompt: "What is the site's total specific energy consumption, per tonne of product (12,000 t for the year)?",
      unit: "kWh/t",
      answer: 305,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "(Total gas + total electricity) ÷ total tonnes.",
        "(1,200,000 + 2,462,000) ÷ 12,000.",
      ],
      worked: "3,662,000 ÷ 12,000 ≈ 305 kWh per tonne: 100 kWh/t of gas and 205 kWh/t of electricity — the electrical dominance is the chilled sector's signature.",
    },
    {
      id: "base-share",
      prompt: "What share of annual gas is the production-independent base load (40,000 kWh/month)?",
      unit: "%",
      answer: 40,
      tol: 0.05,
      tolType: "rel",
      hints: [
        "(12 × 40,000) ÷ total gas, × 100.",
        "480,000 ÷ 1,200,000.",
      ],
      worked: "480,000 ÷ 1,200,000 = 40% of the gas is burned regardless of production — washdown, CIP and space heating. That is where the heat-recovery opportunity lives.",
    },
  ],
};

// ----- Stage 4 — Opportunities --------------------------------------------------

const stage4: Stage = {
  id: "opportunities",
  title: "Opportunities",
  competency: "Quantifying & ranking measures",
  icon: "💡",
  intro:
    "Three findings from the visit are worth working up: washdown water heated by gas while the ammonia plant rejects heat unrecovered (15 m³/night, 10 → 60 °C, 310 nights), the spiral freezer's fixed-timer defrost (36 kW, 4 h/day against 1 h needed, COP 1.5, 350 days), and condenser setpoints that have never been revisited. Put numbers on the first two, then rank them.",
  calcIntro: "Gas £0.06/kWh, electricity £0.20/kWh. The calorifier is 85% efficient.",
  calcParts: [
    {
      id: "washdown-gas",
      prompt: "The washdown water needs 871 kWh of heat a night. What does that cost per year in gas through the 85%-efficient calorifier?",
      unit: "£/yr",
      answer: 19056,
      tol: 0.03,
      tolType: "rel",
      hints: ["(Heat ÷ efficiency) × nights × gas price.", "(871 ÷ 0.85) × 310 × 0.06."],
      worked: "871 ÷ 0.85 ≈ 1,025 kWh of gas a night; × 310 × £0.06 ≈ £19,056/yr.",
    },
    {
      id: "desuperheater-saving",
      prompt: "A desuperheater on the ammonia plant would preheat the water from 10 °C to 35 °C — half the lift. What is it worth per year?",
      unit: "£/yr",
      answer: 9528,
      tol: 0.03,
      tolType: "rel",
      hints: ["Half the lift, half the gas.", "19,056 × 0.5."],
      worked: "£19,056 × 0.5 ≈ £9,528/yr, from heat currently rejected to the roof.",
    },
    {
      id: "desuperheater-payback",
      prompt: "The desuperheater installation is quoted at £25,000. What is its simple payback?",
      unit: "years",
      answer: 2.6,
      tol: 0.1,
      tolType: "abs",
      hints: ["Cost ÷ annual saving.", "25,000 ÷ 9,528."],
      worked: "25,000 ÷ 9,528 ≈ 2.6 years — solid, and the saving runs every washdown night the factory operates.",
    },
    {
      id: "defrost-saving",
      prompt: "The fixed-timer defrost wastes 108 kWh/day of heater energy plus the compressor energy to remove it (COP 1.5), 350 days a year. What does converting to on-demand defrost save per year?",
      unit: "£/yr",
      answer: 12600,
      tol: 0.03,
      tolType: "rel",
      hints: ["(108 + 108 ÷ 1.5) × 350 × electricity price.", "180 × 350 × 0.20."],
      worked: "(108 + 72) × 350 × £0.20 = £12,600/yr — defrost heat is paid for twice, at the heater and at the compressor.",
    },
  ],
  questions: [
    {
      kind: "multi",
      id: "worth-recommending",
      prompt: "Which of these belong in the recommendations?",
      options: [
        { id: "desuper", label: "Fit the desuperheater for washdown preheat (~£25,000, ~2.6-year payback)" },
        { id: "defrost", label: "Convert the spiral freezer to on-demand defrost (~£12,600/yr, controls-level cost)" },
        { id: "condenser", label: "Review condenser and suction setpoints with the refrigeration contractor (near-zero cost)" },
        { id: "chill-relax", label: "Raise the chilled despatch warehouse above the temperature the food safety plan specifies, to cut refrigeration load" },
      ],
      correctIds: ["desuper", "defrost", "condenser"],
      explain:
        "The first three all clear the bar: a sub-3-year heat-recovery payback, a five-figure saving from a controls change, and a free setpoint review on the site's largest electrical plant. Warming despatch above the HACCP-specified temperature is not an energy measure — food safety sets the floor, and no audit recommendation crosses it.",
    },
    {
      kind: "order",
      id: "priority-order",
      prompt: "Sequence the recommendations by priority for the report.",
      items: [
        { id: "a", label: "Condenser and suction setpoint review — near-zero cost, immediate" },
        { id: "b", label: "On-demand defrost conversion — controls-level cost, large saving" },
        { id: "c", label: "Desuperheater installation — capital project, needs design and an installation window" },
      ],
      correctOrder: ["a", "b", "c"],
      explain:
        "Lead with the free setpoint review, follow with the low-cost controls change, and present the capital project last — not because it matters least, but because it needs a business case, design work and a shutdown window the other two don't.",
    },
  ],
};

// ----- Stage 5 — Report & M&V ---------------------------------------------------

const stage5: Stage = {
  id: "report",
  title: "Report & M&V",
  competency: "Reporting & verification",
  icon: "📝",
  intro:
    "Ashdown's report has an audience beyond the site: a retail customer will read the carbon-reduction plan built on it. The numbers need to survive scrutiny, and the savings need verifying rather than assuming.",
  questions: [
    {
      kind: "multi",
      id: "report-content",
      prompt: "What must this audit report include to be credible and actionable?",
      options: [
        { id: "baseline", label: "The normalised baseline model (base loads and the production and CDD coefficients) — not just raw annual totals" },
        { id: "benchmark", label: "The site's specific energy (305 kWh/t, split 100 gas / 205 electricity) as the trackable headline metric" },
        { id: "ranked", label: "Each measure's saving, cost and payback, ranked, with the food-safety limits made explicit" },
        { id: "generic", label: "A generic list of 'top 10 energy tips' with no site-specific numbers" },
      ],
      correctIds: ["baseline", "benchmark", "ranked"],
      explain:
        "A credible report shows its working: the baseline model that makes savings verifiable, the per-tonne metric a retailer can track year on year, and every measure costed and ranked with the HACCP floors stated. Generic tips lists convince nobody, least of all a retail technical team.",
    },
    {
      kind: "single",
      id: "mv-followup",
      prompt: "Twelve months after the desuperheater is installed, how should its saving be verified?",
      help: "The measurement & verification method from earlier in the curriculum, applied to a production site.",
      options: [
        { id: "compare-raw", label: "Compare this year's gas bill directly to last year's" },
        { id: "adjusted", label: "Re-run the baseline model on this year's actual tonnage to get the adjusted baseline, then compare that to actual gas used" },
        { id: "assume", label: "Assume the predicted saving occurred, since the unit was commissioned correctly" },
      ],
      correctId: "adjusted",
      explain:
        "Production changes what the site would have used, so a raw bill comparison mixes tonnage luck with genuine savings. The adjusted baseline — this year's tonnes through the pre-project model — isolates what the desuperheater actually delivered. A heat meter on the recovered-heat circuit gives a second, direct check.",
    },
    {
      kind: "single",
      id: "pitfall",
      prompt: "A colleague drafts the retailer summary as: 'site energy fell 4%, driven by our efficiency programme'. Production was also 5% lower this year. What's the flaw?",
      options: [
        { id: "flaw-normalise", label: "Lower production explains some or all of the fall — only the per-tonne, model-adjusted figures can say what the programme delivered" },
        { id: "flaw-none", label: "No flaw — energy fell, and the programme was running, so the claim stands" },
        { id: "flaw-price", label: "The only issue is that energy prices changed between the years" },
      ],
      correctId: "flaw-normalise",
      explain:
        "With a 60 kWh/t gas slope and an 80 kWh/t electricity slope, a 5% production drop reduces energy with no efficiency improvement at all. Claiming it as programme savings is exactly the overstatement the retailer's technical team will catch — and the normalised model built in stage 2 is what prevents it.",
    },
  ],
};

export const STAGES: Stage[] = [stage1, stage2, stage3, stage4, stage5];

export type { CalcPart, Stage, MultiQ, SingleQ, OrderQ, Question, ChoiceOption };
