/**
 * Dairy sector capstone — content & scoring, reusing the same staged-audit
 * engine (components/simulators/AuditCapstone.tsx) and generic types/scoring
 * from lib/auditCapstone.ts.
 *
 * One realistic client (Alderbrook Dairy, a 150 million litre/year
 * liquid-milk site) is taken through the whole audit lifecycle. The dataset
 * is internally consistent so every calculation is deterministic:
 *   gas  = 100,000 + 30 × kL      (CIP/washdown base + pasteurisation/UHT)
 *   elec = 200,000 + 25 × kL + 400 × CDD  (base + processing/cooling + condensers)
 * kL = thousand litres of milk intake per month; degree-day base 15.5 °C.
 * Intake follows the spring flush (Feb trough 11,600 kL, May peak 14,000 kL).
 * Annual: 150,000 kL, gas 5,700,000 kWh, elec 6,212,000 kWh → 79.4 kWh per
 * 1,000 L (0.079 kWh/L), an efficient liquid-milk site.
 */

import type { CalcPart } from "./diagnostics";
import type { Stage, MultiQ, SingleQ, OrderQ, Question, ChoiceOption } from "./auditCapstone";

// ----- Reference values learners need (shown in the data panels) -------------

export const REFERENCE = {
  cddBase: 15.5, // °C — cooling degree-day base temperature
  elecPrice: 0.2, // £/kWh
  gasPrice: 0.06, // £/kWh
  co2Factor: 0.207, // kg CO₂e per kWh (grid electricity)
  annualKL: 150000, // thousand litres/year — Alderbrook's intake
};

export interface DairyMonthRow {
  month: string;
  avgTempC: number;
  cdd: number;
  kL: number;
  gasKwh: number;
  elecKwh: number;
}

/** 12 months of intake and utility data (most recent year). Internally consistent. */
export const DATASET: DairyMonthRow[] = [
  { month: "Jan", avgTempC: 4.5, cdd: 0, kL: 12000, gasKwh: 460000, elecKwh: 500000 },
  { month: "Feb", avgTempC: 6.5, cdd: 0, kL: 11600, gasKwh: 448000, elecKwh: 490000 },
  { month: "Mar", avgTempC: 7.5, cdd: 0, kL: 12800, gasKwh: 484000, elecKwh: 520000 },
  { month: "Apr", avgTempC: 10.5, cdd: 0, kL: 13600, gasKwh: 508000, elecKwh: 540000 },
  { month: "May", avgTempC: 12.5, cdd: 0, kL: 14000, gasKwh: 520000, elecKwh: 550000 },
  { month: "Jun", avgTempC: 15.5, cdd: 0, kL: 13200, gasKwh: 496000, elecKwh: 530000 },
  { month: "Jul", avgTempC: 18.5, cdd: 0 /* learner computes: 93 */, kL: 12400, gasKwh: 472000, elecKwh: 547200 },
  { month: "Aug", avgTempC: 17.5, cdd: 62, kL: 12000, gasKwh: 460000, elecKwh: 524800 },
  { month: "Sep", avgTempC: 14.5, cdd: 0, kL: 11600, gasKwh: 448000, elecKwh: 490000 },
  { month: "Oct", avgTempC: 11.5, cdd: 0, kL: 12000, gasKwh: 460000, elecKwh: 500000 },
  { month: "Nov", avgTempC: 7.5, cdd: 0, kL: 12400, gasKwh: 472000, elecKwh: 510000 },
  { month: "Dec", avgTempC: 5.5, cdd: 0, kL: 12400, gasKwh: 472000, elecKwh: 510000 },
];

/** Headline annual figures (Jul CDD shown as 93 once computed). */
export const ANNUAL = {
  gasKwh: 5700000,
  elecKwh: 6212000,
  kL: 150000,
  cdd: 155,
};

// ----- Stage 1 — Plan & scope --------------------------------------------------

const stage1: Stage = {
  id: "plan",
  title: "Plan & Scope",
  competency: "Planning & scoping",
  icon: "🗺️",
  intro:
    "Alderbrook Dairy processes 150 million litres of milk a year on one liquid-milk site: tanker reception, separators and standardisation, two HTST pasteurisers, a small UHT line, homogenisers, fillers, an ammonia refrigeration plant with an ice bank, nightly CIP, and a chilled despatch warehouse. Energy costs are up, the dairy's retail customers want a carbon plan, and the site holds a sector CCA whose target period is live. Before you set foot on site, get the plan right.",
  questions: [
    {
      kind: "single",
      id: "audit-level",
      prompt: "Which level of audit best fits this brief?",
      help: "Match the depth (and cost) of the audit to what the client actually needs to decide.",
      options: [
        { id: "walk", label: "Walk-through (ASHRAE Level 1) only — a quick site tour and bill review" },
        { id: "detailed", label: "Detailed audit (ASHRAE Level 2) — survey, metering analysis and a normalised model, with investment-grade rigour on the 1–2 largest measures" },
        { id: "invgrade", label: "Full investment-grade (Level 3) on every system across the whole site" },
      ],
      correctId: "detailed",
      explain:
        "A detailed (Level 2) audit fits: enough measurement and analysis to find and rank genuine opportunities, with investment-grade depth saved for the biggest one or two. A walk-through won't support CCA reporting or a retailer-facing carbon plan; Level 3 on everything exceeds the brief.",
    },
    {
      kind: "single",
      id: "boundary",
      prompt:
        "Most of the milk's lifecycle emissions arise on the farms that supply Alderbrook. Should on-farm energy be inside this audit's boundary?",
      help: "The boundary question, in the sector where upstream agriculture dwarfs the factory.",
      options: [
        { id: "outside", label: "No — draw the boundary at the site gate; farm energy belongs to the supplying farms and a scope 3 exercise, not this site audit" },
        { id: "inside", label: "Yes — estimate the supplying farms' energy and include it in the site totals" },
        { id: "partial", label: "Include only the collection tankers, since the dairy schedules them" },
      ],
      correctId: "outside",
      explain:
        "The audit boundary is what the client can measure and act on: the site's own meters and plant. Farm emissions dominate milk's footprint and matter enormously to the retailer's questionnaire, but they are a supply-chain (scope 3) programme with different data and owners. Folding estimates into a site audit would muddy both exercises.",
    },
    {
      kind: "multi",
      id: "site-hazards",
      prompt: "Which of these should be arranged or flagged before walking the dairy?",
      help: "Dairies combine hygiene rules with serious plant hazards.",
      options: [
        { id: "hygiene", label: "Hygiene induction and kit: high-care areas, boot changes and controlled entry, planned with the technical team" },
        { id: "ammonia", label: "The ammonia plant room: entry rules, alarm response and an escort" },
        { id: "cip", label: "CIP chemical hazards: hot caustic and acid circuits run overnight, exactly when an auditor might want meter readings" },
        { id: "none", label: "Nothing special — a dairy is a light-industrial site like any other" },
      ],
      correctIds: ["hygiene", "ammonia", "cip"],
      explain:
        "All three are real: hygiene rules decide where you may walk and in what order, ammonia plant rooms have their own safety regime, and the overnight CIP shift moves hot caustic around the site precisely when energy surveys like to happen. Treating a dairy as generic light industry is how auditors get escorted off site.",
    },
    {
      kind: "order",
      id: "sequence",
      prompt: "Put these planning steps in the order you'd actually do them.",
      items: [
        { id: "a", label: "Agree the audit's scope, boundary and level with the client" },
        { id: "b", label: "Request 12+ months of gas and electricity data, plus monthly milk intake (litres) records" },
        { id: "c", label: "Analyse the data for patterns (base loads, intake and weather response) before visiting" },
        { id: "d", label: "Schedule the visit across a processing day and a CIP shift, with hygiene and ammonia inductions arranged" },
      ],
      correctOrder: ["a", "b", "c", "d"],
      explain:
        "Scope first, then data, then analysis before the visit — the spring-flush pattern in the intake numbers tells you the model needs a production term before you ever walk the plant. The visit comes last, planned around hygiene rules and the overnight clean.",
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
    "On site: the pasteurisers' regeneration sections have no effectiveness monitoring, the ice bank's compressors were heard running mid-morning, the ammonia condensers sit on a fixed head-pressure setpoint, and CIP runs every night on recipes nobody has revisited. The intake data shows the spring flush plainly: May processes 21% more milk than February. Now turn the monthly data into a model of how Alderbrook actually behaves.",
  showData: true,
  calcIntro:
    "Use the 12-month dataset and the reference values. Both models are linear: a base load plus intake and (for electricity) weather terms. Intake is in kL (thousand litres).",
  calcParts: [
    {
      id: "gas-coeff",
      prompt: "Compare May (14,000 kL) with February (11,600 kL), both zero-CDD months. What is the gas model's intake coefficient (kWh per kL)?",
      unit: "kWh/kL",
      answer: 30,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "(May gas − February gas) ÷ (May kL − February kL).",
        "(520,000 − 448,000) ÷ 2,400.",
      ],
      worked: "72,000 ÷ 2,400 = 30 kWh of gas per thousand litres — the pasteurisation and UHT top-up that scales with milk.",
    },
    {
      id: "gas-base",
      prompt: "Using January, what is the gas base load (kWh/month) — CIP, washdown and space heating that happen regardless of intake?",
      unit: "kWh/mo",
      answer: 100000,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "January gas − (coefficient × January kL).",
        "460,000 − 30 × 12,000.",
      ],
      worked: "460,000 − 360,000 = 100,000 kWh/month of intake-independent gas: the nightly clean, mostly. Check December: 100,000 + 30 × 12,400 = 472,000 — matches the meter.",
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
      prompt: "Using August (12,000 kL, 62 CDD) and the electricity model's intake coefficient of 25 kWh/kL with a 200,000 kWh base, what is the weather coefficient (kWh per CDD)?",
      unit: "kWh/CDD",
      answer: 400,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "(August elec − base − 25 × kL) ÷ August CDD.",
        "(524,800 − 200,000 − 300,000) ÷ 62.",
      ],
      worked: "24,800 ÷ 62 = 400 kWh per cooling degree-day — the ammonia condensers working harder in warm weather. July confirms it: 200,000 + 25 × 12,400 + 400 × 93 = 547,200, exactly what the meter recorded.",
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
    "With the model complete, turn the year into the per-litre figures the CCA reporting and the retailers' questionnaires both need — and read them the way the spring flush demands.",
  calcIntro: "Using the completed 12-month dataset (July's CDD now filled in at 93):",
  calcParts: [
    {
      id: "total-gas",
      prompt: "What was total gas consumption for the year?",
      unit: "kWh",
      answer: 5700000,
      tol: 0.02,
      tolType: "rel",
      hints: [
        "Sum all 12 months' gas.",
        "460+448+484+508+520+496+472+460+448+460+472+472 (thousands).",
      ],
      worked: "Summing all 12 months gives 5,700,000 kWh of gas.",
    },
    {
      id: "total-elec",
      prompt: "What was total electricity consumption for the year?",
      unit: "kWh",
      answer: 6212000,
      tol: 0.02,
      tolType: "rel",
      hints: [
        "Sum all 12 months' electricity (July 547,200; August 524,800).",
        "500+490+520+540+550+530+547.2+524.8+490+500+510+510 (thousands).",
      ],
      worked: "Summing all 12 months gives 6,212,000 kWh of electricity.",
    },
    {
      id: "sec-total",
      prompt: "What is the site's total specific energy, per 1,000 litres of milk (150,000 kL for the year)?",
      unit: "kWh/kL",
      answer: 79.4,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "(Total gas + total electricity) ÷ total kL.",
        "(5,700,000 + 6,212,000) ÷ 150,000.",
      ],
      worked: "11,912,000 ÷ 150,000 ≈ 79.4 kWh per thousand litres (0.079 kWh/L): efficient for a liquid-milk site, and a number a powder site would multiply several-fold, which is why per-litre comparisons must never cross site types.",
    },
    {
      id: "flush-check",
      prompt: "May processed 14,000 kL against February's 11,600. Using the gas model, how much of May's extra gas over February is explained purely by the extra milk?",
      unit: "kWh",
      answer: 72000,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "Intake coefficient × the intake difference.",
        "30 × (14,000 − 11,600).",
      ],
      worked: "30 × 2,400 = 72,000 kWh — which is the entire May-February gas difference. The spring flush explains it all: nothing ran better or worse, the cows simply produced more. Judge months without the model and the flush reads as a 16% 'deterioration' every spring.",
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
    "Three findings from the visit are worth working up: the pasteurisers' unmonitored regeneration (temperature logging shows 84% against a 92% design on the main HTST line), the ice bank charging in the day-rate window, and the fixed condenser setpoint. The first two are exactly this course's diagnostic cases, met on a real site.",
  calcIntro:
    "Gas £0.06/kWh through an 85%-efficient hot section. Electricity: 14p off-peak, 24p day rate. The main pasteuriser runs 4,000 h/yr at 1,473 kW total duty.",
  calcParts: [
    {
      id: "regen-saving",
      prompt: "Restoring regeneration from 84% to 92% cuts the hot section's top-up by 117.9 kW. What is that worth per year?",
      unit: "£/yr",
      answer: 33280,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "Extra kW × 4,000 h ÷ 0.85 × gas price.",
        "117.9 × 4,000 ÷ 0.85 × 0.06.",
      ],
      worked: "117.9 × 4,000 ≈ 471,500 kWh of heat; ÷ 0.85 ≈ 554,700 kWh of gas; × £0.06 ≈ £33,280 a year.",
    },
    {
      id: "regen-payback",
      prompt: "The plate-pack refurbishment is quoted at £15,000. What is its simple payback?",
      unit: "years",
      answer: 0.45,
      tol: 0.1,
      tolType: "abs",
      hints: ["Cost ÷ annual saving.", "15,000 ÷ 33,280."],
      worked: "15,000 ÷ 33,280 ≈ 0.45 years — under six months, on the sector's most valuable maintenance number.",
    },
    {
      id: "ice-saving",
      prompt: "The ice bank takes 1,000 kWh of electricity per charge, 350 charges a year, currently on the 24p day rate. What does restoring the off-peak (14p) window save?",
      unit: "£/yr",
      answer: 35000,
      tol: 0.02,
      tolType: "rel",
      hints: [
        "Charge kWh × rate difference × charges.",
        "1,000 × 0.10 × 350.",
      ],
      worked: "1,000 × £0.10 × 350 = £35,000 a year, for a time schedule. The night's cooler condensing improves the charging COP as a bonus.",
    },
    {
      id: "combined",
      prompt: "Together, what do the two quantified measures save per year?",
      unit: "£/yr",
      answer: 68280,
      tol: 0.02,
      tolType: "rel",
      hints: ["Add them.", "33,280 + 35,000."],
      worked: "£33,280 + £35,000 ≈ £68,280 a year: one maintenance job and one schedule, no new plant anywhere.",
    },
  ],
  questions: [
    {
      kind: "multi",
      id: "worth-recommending",
      prompt: "Which of these belong in the recommendations?",
      options: [
        { id: "regen", label: "Refurbish the plate pack and trend regeneration effectiveness monthly (~£15,000, ~0.45-year payback)" },
        { id: "ice", label: "Restore the ice bank's off-peak charge window (~£35,000/yr, schedule-level cost)" },
        { id: "condenser", label: "Move the ammonia condensers to floating head pressure with the refrigeration contractor (near-zero cost)" },
        { id: "cool-less", label: "Raise the raw-milk silo temperature above its specified limit to cut reception cooling load" },
      ],
      correctIds: ["regen", "ice", "condenser"],
      explain:
        "The first three clear the bar: a six-month-payback maintenance job, a five-figure schedule fix, and the free head-pressure measure from the foundations course. Warming raw milk beyond its specified storage temperature is not an energy measure — food safety sets the floor, and no audit recommendation crosses it.",
    },
    {
      kind: "order",
      id: "priority-order",
      prompt: "Sequence the recommendations by priority for the report.",
      items: [
        { id: "a", label: "Restore the ice-bank charge window — no cost, immediate" },
        { id: "b", label: "Plate-pack refurbishment with monthly effectiveness trending — small cost, biggest habit change" },
        { id: "c", label: "Floating head pressure — near-zero cost, needs the refrigeration contractor's visit" },
      ],
      correctOrder: ["a", "c", "b"],
      explain:
        "Lead with the free schedule fix (it starts saving tonight), then the contractor setpoint change, and present the refurbishment last only because it needs a maintenance window on a hygiene-critical plant — its payback is the best of the three, and the monthly trending habit it establishes is worth as much as the repair.",
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
    "Alderbrook's report feeds the CCA return, the retailers' carbon questionnaires and the board. In a sector whose intake swings 21% with the seasons, only normalised numbers survive all three audiences.",
  questions: [
    {
      kind: "multi",
      id: "report-content",
      prompt: "What must this audit report include to be credible and actionable?",
      options: [
        { id: "baseline", label: "The normalised baseline model (base loads and the intake and CDD coefficients) — not just raw annual totals" },
        { id: "benchmark", label: "The per-litre figure (79.4 kWh/kL) with its site-type caveat, as the trackable headline metric" },
        { id: "ranked", label: "Each measure's saving, cost and payback, ranked, with the food-safety floors made explicit" },
        { id: "generic", label: "A generic list of 'top 10 dairy energy tips' with no site-specific numbers" },
      ],
      correctIds: ["baseline", "benchmark", "ranked"],
      explain:
        "A credible report shows its working: the model that separates the spring flush from genuine performance, the per-litre metric the CCA and retailers track, and every measure costed with the hygiene floors stated. Generic tip lists convince nobody, least of all a retailer's technical team.",
    },
    {
      kind: "single",
      id: "mv-followup",
      prompt: "Twelve months after the plate-pack refurbishment, how should its saving be verified?",
      help: "The measurement & verification method, in a sector with a strong seasonal production cycle.",
      options: [
        { id: "compare-raw", label: "Compare this year's gas bill directly to last year's" },
        { id: "adjusted", label: "Re-run the baseline model on this year's actual intake to get the adjusted baseline, then compare that to actual gas — and trend the regeneration effectiveness directly" },
        { id: "assume", label: "Assume the saving occurred, since the plates were demonstrably refurbished" },
      ],
      correctId: "adjusted",
      explain:
        "Intake changes what the site would have used, so raw bill comparison mixes cow behaviour with plate condition. The adjusted baseline isolates the refurbishment's effect, and the effectiveness trend gives a second, direct check — if the plates are clean, the terminal temperatures say so every single day.",
    },
    {
      kind: "single",
      id: "pitfall",
      prompt: "A colleague's draft tells the retailer: 'energy per litre fell 5% this spring, evidence our programme is working'. What's the flaw?",
      options: [
        { id: "flaw-flush", label: "The spring flush spreads the fixed base over more litres every spring — per-litre figures improve seasonally with no efficiency change, and the model must separate that from the programme" },
        { id: "flaw-none", label: "No flaw — per-litre is the normalised metric, so the claim stands" },
        { id: "flaw-secret", label: "Only absolute totals should ever be shared with customers" },
      ],
      correctId: "flaw-flush",
      explain:
        "Per-litre is the right metric but the wrong comparison: the 100,000 kWh/month gas base spreads over 14,000 kL in May and 11,600 in February, so spring always flatters the ratio. Year-on-year same-month comparisons through the model, or the coefficients themselves, are the honest evidence — exactly the trap the base-load arithmetic in stage 3 exposed.",
    },
  ],
};

export const STAGES: Stage[] = [stage1, stage2, stage3, stage4, stage5];

export type { CalcPart, Stage, MultiQ, SingleQ, OrderQ, Question, ChoiceOption };
