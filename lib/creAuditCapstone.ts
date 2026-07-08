/**
 * CRE sector capstone — content & scoring, reusing the same staged-audit
 * engine (components/simulators/AuditCapstone.tsx) and generic types/scoring
 * from lib/auditCapstone.ts.
 *
 * One realistic client (Marlowe Court, a 1992 multi-let air-conditioned
 * office) is taken through the whole audit lifecycle. The dataset is
 * internally consistent so every calculation is deterministic:
 *   gas  = 10,000 + 195 × HDD     (base DHW/catering + weather-led heating)
 *   elec = 66,000 + 500 × CDD     (flat base + chiller season)
 * Degree-day base 15.5 °C for both. Whole-building intensity lands at
 * 157.4 kWh/m² GIA — a touch better than REEB 2024's "typical" 163 for
 * air-conditioned offices, far off "good practice" 119.
 */

import type { CalcPart } from "./diagnostics";
import type { Stage, MultiQ, SingleQ, OrderQ, Question, ChoiceOption } from "./auditCapstone";

// ----- Reference values learners need (shown in the data panels) -------------

export const REFERENCE = {
  ddBase: 15.5, // °C — degree-day base (heating and cooling)
  elecPrice: 0.2, // £/kWh
  gasPrice: 0.06, // £/kWh
  co2Factor: 0.207, // kg CO₂e per kWh (grid electricity)
  floorAreaGia: 8500, // m² Gross Internal Area
  floorAreaNla: 7000, // m² Net Lettable Area
  reebTypical: 163, // kWh/m² GIA — REEB 2024, AC offices, typical practice
  reebGood: 119, // kWh/m² GIA — REEB 2024, AC offices, good practice
};

export interface CreMonthRow {
  month: string;
  avgTempC: number;
  hdd: number;
  cdd: number;
  gasKwh: number;
  elecKwh: number;
}

/** 12 months of utility data (most recent year). Internally consistent. */
export const DATASET: CreMonthRow[] = [
  { month: "Jan", avgTempC: 4.5, hdd: 341, cdd: 0, gasKwh: 76495, elecKwh: 66000 },
  { month: "Feb", avgTempC: 6.5, hdd: 252, cdd: 0, gasKwh: 59140, elecKwh: 66000 },
  { month: "Mar", avgTempC: 7.5, hdd: 248, cdd: 0, gasKwh: 58360, elecKwh: 66000 },
  { month: "Apr", avgTempC: 10.5, hdd: 150, cdd: 0, gasKwh: 39250, elecKwh: 66000 },
  { month: "May", avgTempC: 12.5, hdd: 93, cdd: 0, gasKwh: 28135, elecKwh: 66000 },
  { month: "Jun", avgTempC: 15.5, hdd: 0, cdd: 0, gasKwh: 10000, elecKwh: 66000 },
  { month: "Jul", avgTempC: 18.5, hdd: 0, cdd: 93, gasKwh: 10000, elecKwh: 112500 },
  { month: "Aug", avgTempC: 17.5, hdd: 0, cdd: 0 /* learner computes: 62 */, gasKwh: 10000, elecKwh: 97000 },
  { month: "Sep", avgTempC: 14.5, hdd: 30, cdd: 0, gasKwh: 15850, elecKwh: 66000 },
  { month: "Oct", avgTempC: 11.5, hdd: 124, cdd: 0, gasKwh: 34180, elecKwh: 66000 },
  { month: "Nov", avgTempC: 7.5, hdd: 240, cdd: 0, gasKwh: 56800, elecKwh: 66000 },
  { month: "Dec", avgTempC: 5.5, hdd: 310, cdd: 0, gasKwh: 70450, elecKwh: 66000 },
];

/** Headline annual figures (Aug CDD shown as 62 once computed). */
export const ANNUAL = {
  gasKwh: 468660,
  elecKwh: 869500,
  hdd: 1788,
  cdd: 155,
};

// ----- Stage 1 — Plan & scope --------------------------------------------------

const stage1: Stage = {
  id: "plan",
  title: "Plan & Scope",
  competency: "Planning & scoping",
  icon: "🗺️",
  intro:
    "Marlowe Court is a 1992 air-conditioned office: 8,500 m² gross internal area, 7,000 m² net lettable, twelve tenants across six floors, gas boilers for heating and hot water, two air-cooled chillers, and a BMS that was last looked at when the chillers were installed. The landlord pays for the central plant and common parts and recovers the cost through the service charge; each tenant has its own electricity supply for its demise. Energy costs in the service charge are up 30% and the managing agent wants an audit before the next tenant negotiation. Before you set foot on site, get the plan right.",
  questions: [
    {
      kind: "single",
      id: "audit-level",
      prompt: "Which level of audit best fits this brief?",
      help: "Match the depth (and cost) of the audit to what the client actually needs to decide.",
      options: [
        { id: "walk", label: "Walk-through (ASHRAE Level 1) only — a quick site tour and bill review" },
        { id: "detailed", label: "Detailed audit (ASHRAE Level 2) — survey, half-hourly data and normalised analysis, with an investment-grade workup on the 1–2 largest measures" },
        { id: "invgrade", label: "Full investment-grade (Level 3) on every system across the whole building" },
      ],
      correctId: "detailed",
      explain:
        "A detailed (Level 2) audit fits: enough measurement and analysis to find and rank real opportunities in the landlord's plant, with investment-grade rigour saved for whichever project turns out biggest. A walk-through won't produce numbers the agent can defend in a service-charge conversation; Level 3 on everything is more than this brief needs.",
    },
    {
      kind: "single",
      id: "boundary",
      prompt:
        "Each tenant buys its own electricity directly for its demise. Should tenant consumption be inside this audit's boundary?",
      help: "The boundary question again — but in CRE the boundary is drawn by the lease as much as by the meter.",
      options: [
        { id: "landlord", label: "Focus the audit on the landlord's supplies and central plant — that is what the client controls and what the service charge recovers — while noting tenant engagement as a separate recommendation" },
        { id: "everything", label: "Include every tenant's consumption in full, since it's all one building" },
        { id: "ignore", label: "Ignore the tenants entirely, including any effect they have on central plant" },
      ],
      correctId: "landlord",
      explain:
        "The audit boundary should match what the client can measure and act on: the landlord supplies and the central plant behind the service charge. Tenant demand still matters (their hours drive the central plant), so the report notes it and recommends engagement and data-sharing — but auditing supplies the client neither pays for nor controls would produce findings nobody in the room can act on.",
    },
    {
      kind: "multi",
      id: "site-hazards",
      prompt: "Which of these should be arranged or flagged before walking the building?",
      help: "Multi-let offices have practical and safety constraints an auditor must plan around.",
      options: [
        { id: "access", label: "Escorted access to roof plant, risers and switchrooms, arranged through the managing agent in advance" },
        { id: "asbestos", label: "The asbestos register — a 1992 building can still contain asbestos-containing materials around plant and risers" },
        { id: "tenants", label: "Tenant notification: you'll be walking occupied, secure office floors during business hours" },
        { id: "none", label: "Nothing special — an office is the lowest-risk site there is" },
      ],
      correctIds: ["access", "asbestos", "tenants"],
      explain:
        "All three are real. Roof plant, risers and switchrooms are locked and often permit-controlled; pre-2000 buildings must have an asbestos register and you check it before disturbing anything; and tenanted floors are other people's workplaces, entered by arrangement, not wandered. 'An office is low-risk' is how auditors end up on a roof without an escort.",
    },
    {
      kind: "order",
      id: "sequence",
      prompt: "Put these planning steps in the order you'd actually do them.",
      items: [
        { id: "a", label: "Agree the audit's scope, boundary and level with the managing agent" },
        { id: "b", label: "Request 12+ months of landlord gas and electricity data, the half-hourly electricity feed, and floor areas" },
        { id: "c", label: "Analyse the data for patterns (base load, weather response) before visiting" },
        { id: "d", label: "Schedule the visit for a normal occupied weekday, with access and escorts arranged" },
      ],
      correctOrder: ["a", "b", "c", "d"],
      explain:
        "Scope first (it defines what data you need), then get the data, then analyse it before the visit so you walk the building already knowing its patterns — the overnight base load in the half-hourly data tells you exactly what to look for in the plant rooms. The visit comes last, timed for a normal working day so you see the building as it actually runs.",
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
    "On site, the plant rooms tell their own story: both chillers enabled year-round, AHU time schedules set to 24/7 ('temporarily', nobody remembers why), boilers on fixed 80 °C flow whatever the weather. The half-hourly data shows overnight demand of 75 kW against a properly-scheduled comparator of about 35 kW. Now turn the monthly data into a model of how Marlowe Court actually behaves.",
  showData: true,
  calcIntro:
    "Use the 12-month dataset and the reference values. The gas and electricity models are linear: a base load plus a weather-driven slope.",
  calcParts: [
    {
      id: "gas-base",
      prompt: "From the summer months, what is the gas base load (kWh/month) — the consumption with no heating demand at all?",
      unit: "kWh/mo",
      answer: 10000,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "Look at the months with zero HDD — June, July, August. What do they all consume?",
        "Gas in June, July and August is the same figure: that's hot water and catering, not heating.",
      ],
      worked: "June, July and August each burn 10,000 kWh with zero HDD — so 10,000 kWh/month is the weather-independent base (domestic hot water and catering).",
    },
    {
      id: "hdd-coeff",
      prompt: "Using January (341 HDD), what is the gas model's heating coefficient (kWh per heating degree-day)?",
      unit: "kWh/HDD",
      answer: 195,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "(January gas − base load) ÷ January HDD.",
        "(76,495 − 10,000) ÷ 341.",
      ],
      worked: "(76,495 − 10,000) ÷ 341 = 195 kWh per heating degree-day. Check it against another month: December gives (70,450 − 10,000) ÷ 310 = 195 too — the model holds.",
    },
    {
      id: "aug-cdd",
      prompt: "August's CDD is missing from the dataset. With an average temperature of 17.5 °C over 31 days (base 15.5 °C), what is it?",
      unit: "CDD",
      answer: 62,
      tol: 0.05,
      tolType: "rel",
      hints: [
        "CDD = (average temperature − base) × days, when the average is above the base.",
        "(17.5 − 15.5) × 31.",
      ],
      worked: "(17.5 − 15.5) × 31 = 62 cooling degree-days.",
    },
    {
      id: "cdd-coeff",
      prompt: "Using July (93 CDD), what is the electricity model's cooling coefficient (kWh per cooling degree-day)?",
      unit: "kWh/CDD",
      answer: 500,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "(July electricity − the flat base month figure) ÷ July CDD.",
        "(112,500 − 66,000) ÷ 93.",
      ],
      worked: "(112,500 − 66,000) ÷ 93 = 500 kWh per cooling degree-day. August confirms it: 66,000 + 500 × 62 = 97,000 kWh, exactly what the meter recorded.",
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
    "With the model complete, turn the year into the figures that make Marlowe Court comparable — to the sector's benchmarks, and to its own future after any project.",
  calcIntro: "Using the completed 12-month dataset (August's CDD now filled in at 62):",
  calcParts: [
    {
      id: "total-gas",
      prompt: "What was total gas consumption for the year?",
      unit: "kWh",
      answer: 468660,
      tol: 0.02,
      tolType: "rel",
      hints: [
        "Sum all 12 months' gas kWh.",
        "76,495+59,140+58,360+39,250+28,135+10,000+10,000+10,000+15,850+34,180+56,800+70,450.",
      ],
      worked: "Summing all 12 months gives 468,660 kWh of gas.",
    },
    {
      id: "total-elec",
      prompt: "What was total electricity consumption for the year (all supplies — the tenants shared their sub-meter data)?",
      unit: "kWh",
      answer: 869500,
      tol: 0.02,
      tolType: "rel",
      hints: [
        "Ten months at 66,000, plus July (112,500) and August (97,000).",
        "10 × 66,000 + 112,500 + 97,000.",
      ],
      worked: "660,000 + 112,500 + 97,000 = 869,500 kWh of electricity.",
    },
    {
      id: "whole-building-intensity",
      prompt: "What is the whole-building energy intensity, on the 8,500 m² gross internal area?",
      unit: "kWh/m²",
      answer: 157.4,
      tol: 0.02,
      tolType: "rel",
      hints: [
        "(Total gas + total electricity) ÷ GIA.",
        "(468,660 + 869,500) ÷ 8,500.",
      ],
      worked: "1,338,160 ÷ 8,500 = 157.4 kWh/m² GIA a year.",
    },
    {
      id: "benchmark-gap",
      prompt: "REEB 2024 puts good practice for air-conditioned offices at 119 kWh/m² GIA. How many kWh/year would Marlowe Court need to save to reach it?",
      unit: "kWh",
      answer: 326660,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "(Actual intensity − good practice) × floor area.",
        "(157.4 − 119) × 8,500.",
      ],
      worked: "(157.4 − 119) × 8,500 ≈ 326,660 kWh/yr — the building sits just better than 'typical' (163), but a quarter of its energy stands between it and 'good practice'.",
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
    "Three findings from the visit are worth working up: the 24/7 schedules (overnight demand 75 kW against an achievable 35 kW), the boilers' fixed 80 °C flow temperature, and the original 1990s luminaires in the common parts. Put numbers on the big one, then rank them.",
  calcIntro:
    "The building is occupied 65 h/week, so it is unoccupied 103 h/week — 5,356 hours a year. Electricity £0.20/kWh, gas £0.06/kWh.",
  calcParts: [
    {
      id: "ooh-kwh",
      prompt: "Restoring the schedules would cut overnight demand from 75 kW to about 35 kW. How much electricity does that save a year?",
      unit: "kWh",
      answer: 214240,
      tol: 0.02,
      tolType: "rel",
      hints: [
        "Excess demand × unoccupied hours per year.",
        "(75 − 35) × 5,356.",
      ],
      worked: "40 kW × 5,356 h = 214,240 kWh/yr currently consumed by an empty building.",
    },
    {
      id: "ooh-saving",
      prompt: "What is that worth per year?",
      unit: "£/yr",
      answer: 42848,
      tol: 0.03,
      tolType: "rel",
      hints: ["Saved kWh × electricity price.", "214,240 × 0.20."],
      worked: "214,240 × £0.20 ≈ £42,848/yr — a quarter of the landlord's entire electricity bill.",
    },
    {
      id: "ooh-payback",
      prompt: "A BMS recommissioning contract (schedules, setpoints, sensor checks across the building) is quoted at £30,000. What is the simple payback on the schedules saving alone?",
      unit: "years",
      answer: 0.7,
      tol: 0.1,
      tolType: "abs",
      hints: ["Cost ÷ annual saving.", "30,000 ÷ 42,848."],
      worked: "30,000 ÷ 42,848 ≈ 0.7 years — about eight months, before counting anything the recommissioning finds beyond the schedules.",
    },
    {
      id: "wc-saving",
      prompt: "Weather compensation on the boilers typically cuts around 15% of the weather-dependent gas (the 195 × HDD slice, 348,660 kWh). What is that worth per year?",
      unit: "£/yr",
      answer: 3138,
      tol: 0.05,
      tolType: "rel",
      hints: [
        "15% × weather-dependent gas × gas price.",
        "0.15 × 348,660 × 0.06.",
      ],
      worked: "0.15 × 348,660 = 52,299 kWh; × £0.06 ≈ £3,138/yr. Smaller money than the schedules, but near-zero cost on boilers that already have the controls capability.",
    },
  ],
  questions: [
    {
      kind: "multi",
      id: "worth-recommending",
      prompt: "Which of these belong in the recommendations?",
      options: [
        { id: "bms", label: "BMS recommissioning including schedule restoration (~£30,000, ~0.7-year payback)" },
        { id: "wc", label: "Enable weather compensation on the boiler flow temperature (near-zero cost)" },
        { id: "led", label: "LED replacement of the original common-parts lighting (modest saving, short payback, and it lifts the EPC ahead of MEES)" },
        { id: "tenant-cut", label: "Reduce cooling to the tenants' server rooms below the temperatures their leases guarantee" },
      ],
      correctIds: ["bms", "wc", "led"],
      explain:
        "The first three all clear the bar: huge no-brainer payback on the recommissioning, near-free gas saving on weather compensation, and an LED retrofit that pays back quickly while improving the EPC before the 2031 MEES horizon. Cutting service below what the leases guarantee is not an energy measure — it's a breach of contract wearing one's clothes.",
    },
    {
      kind: "order",
      id: "priority-order",
      prompt: "Sequence the recommendations by priority for the report.",
      items: [
        { id: "a", label: "Restore BMS schedules / recommission — largest saving, fastest payback" },
        { id: "b", label: "Enable weather compensation — near-zero cost, immediate" },
        { id: "c", label: "LED common-parts retrofit — short payback, needs service-charge budgeting and tenant notice" },
      ],
      correctOrder: ["a", "b", "c"],
      explain:
        "Lead with the schedules: it is both the biggest saving and close to free, which never happens twice in one audit. Weather compensation follows as the other operational fix, and the LED retrofit comes last only because it needs capital through the service charge and coordination with tenants — not because it isn't worth doing.",
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
    "In a multi-let building the report has two audiences: the landlord who commissions the work, and the tenants who ultimately pay through the service charge and need to see that the spend reduced their costs.",
  questions: [
    {
      kind: "multi",
      id: "report-content",
      prompt: "What must this audit report include to be credible and actionable?",
      options: [
        { id: "baseline", label: "The normalised baseline model (base loads and the HDD/CDD coefficients) — not just raw annual totals" },
        { id: "benchmark", label: "Where 157.4 kWh/m² sits against REEB's typical (163) and good practice (119) benchmarks" },
        { id: "ranked", label: "Each measure's saving, cost and payback, ranked, with lease and service-charge implications made explicit" },
        { id: "generic", label: "A generic list of 'top 10 energy tips' with no site-specific numbers" },
      ],
      correctIds: ["baseline", "benchmark", "ranked"],
      explain:
        "A credible report shows its working: the baseline model that makes future savings verifiable, the benchmark position that tells the client how far off the pace the building really is, and every measure costed and ranked with its lease implications — never a generic checklist. In CRE the service-charge angle is part of the recommendation, not an afterthought.",
    },
    {
      kind: "single",
      id: "mv-followup",
      prompt: "Twelve months after the BMS recommissioning, how should its saving be verified?",
      help: "The measurement & verification method from earlier in the curriculum, applied to a weather-dependent building.",
      options: [
        { id: "compare-raw", label: "Compare this year's electricity bill directly to last year's" },
        { id: "adjusted", label: "Re-run the baseline model on this year's actual degree-days to get the adjusted baseline, then compare that to actual consumption" },
        { id: "assume", label: "Assume the predicted saving occurred, since the schedules were demonstrably changed" },
      ],
      correctId: "adjusted",
      explain:
        "A hotter summer or colder winter changes what the building would have used, so raw year-on-year comparison mixes weather luck with genuine savings. The adjusted baseline — this year's degree-days run through the pre-project model — isolates what the recommissioning actually delivered. The overnight base load in the half-hourly data gives a second, faster check: it should have dropped to ~35 kW the week the schedules changed.",
    },
    {
      kind: "single",
      id: "pitfall",
      prompt: "The managing agent wants to tell tenants that 'the service charge will fall by the full £42,848 next year'. What's the flaw?",
      options: [
        { id: "flaw-normalise", label: "The saving is real but the bill also moves with weather, occupancy and prices — promise the measure and the verified saving, not a guaranteed bill reduction" },
        { id: "flaw-none", label: "No flaw — the arithmetic says £42,848, so the charge falls by £42,848" },
        { id: "flaw-secret", label: "The only issue is that savings figures should be kept confidential from tenants" },
      ],
      correctId: "flaw-normalise",
      explain:
        "The £42,848 is a genuine, defensible saving against the baseline — but next year's actual bill also depends on the weather, tenant hours and energy prices, none of which the recommissioning controls. Promising a precise bill reduction sets the project up to 'fail' in a cold year even while working perfectly. Report the verified, normalised saving; in a sector built on service-charge trust, transparency with tenants is exactly how the next project gets funded.",
    },
  ],
};

export const STAGES: Stage[] = [stage1, stage2, stage3, stage4, stage5];

export type { CalcPart, Stage, MultiQ, SingleQ, OrderQ, Question, ChoiceOption };
