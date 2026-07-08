/**
 * Data centre sector capstone — content & scoring, reusing the same staged-
 * audit engine (components/simulators/AuditCapstone.tsx) and generic
 * types/scoring from lib/auditCapstone.ts.
 *
 * One realistic client (Kelbrook Data, a regional colocation facility) is
 * taken through the whole audit lifecycle. The dataset is internally
 * consistent so every calculation is deterministic:
 *   facility = 50,000 + 1.25 × IT + 400 × CDD   (kWh/month)
 * IT load steps from 1,000,000 to 1,100,000 kWh/month in July (a customer
 * onboarding). Degree-day base 15.5 °C. Annual: IT 12,600,000 kWh,
 * facility 16,412,000 kWh → PUE 1.30, bill ≈ £3.28M at £0.20/kWh.
 */

import type { CalcPart } from "./diagnostics";
import type { Stage, MultiQ, SingleQ, OrderQ, Question, ChoiceOption } from "./auditCapstone";

// ----- Reference values learners need (shown in the data panels) -------------

export const REFERENCE = {
  cddBase: 15.5, // °C — cooling degree-day base temperature
  elecPrice: 0.2, // £/kWh
  co2Factor: 0.207, // kg CO₂e per kWh (grid electricity)
  itDesignKw: 1600, // kW — contracted IT design capacity
};

export interface DcMonthRow {
  month: string;
  avgTempC: number;
  cdd: number;
  itKwh: number;
  facilityKwh: number;
}

/** 12 months of IT and whole-facility metering (most recent year). Internally consistent. */
export const DATASET: DcMonthRow[] = [
  { month: "Jan", avgTempC: 4.5, cdd: 0, itKwh: 1000000, facilityKwh: 1300000 },
  { month: "Feb", avgTempC: 6.5, cdd: 0, itKwh: 1000000, facilityKwh: 1300000 },
  { month: "Mar", avgTempC: 7.5, cdd: 0, itKwh: 1000000, facilityKwh: 1300000 },
  { month: "Apr", avgTempC: 10.5, cdd: 0, itKwh: 1000000, facilityKwh: 1300000 },
  { month: "May", avgTempC: 12.5, cdd: 0, itKwh: 1000000, facilityKwh: 1300000 },
  { month: "Jun", avgTempC: 15.5, cdd: 0, itKwh: 1000000, facilityKwh: 1300000 },
  { month: "Jul", avgTempC: 18.5, cdd: 0 /* learner computes: 93 */, itKwh: 1100000, facilityKwh: 1462200 },
  { month: "Aug", avgTempC: 17.5, cdd: 62, itKwh: 1100000, facilityKwh: 1449800 },
  { month: "Sep", avgTempC: 14.5, cdd: 0, itKwh: 1100000, facilityKwh: 1425000 },
  { month: "Oct", avgTempC: 11.5, cdd: 0, itKwh: 1100000, facilityKwh: 1425000 },
  { month: "Nov", avgTempC: 7.5, cdd: 0, itKwh: 1100000, facilityKwh: 1425000 },
  { month: "Dec", avgTempC: 5.5, cdd: 0, itKwh: 1100000, facilityKwh: 1425000 },
];

/** Headline annual figures (Jul CDD shown as 93 once computed). */
export const ANNUAL = {
  itKwh: 12600000,
  facilityKwh: 16412000,
  cdd: 155,
};

// ----- Stage 1 — Plan & scope --------------------------------------------------

const stage1: Stage = {
  id: "plan",
  title: "Plan & Scope",
  competency: "Planning & scoping",
  icon: "🗺️",
  intro:
    "Kelbrook Data is a regional colocation facility: two data halls, a 1,600 kW contracted IT capacity currently running around 1,400 kW, chilled-water cooling with CRAH units, a 2N double-conversion UPS fleet, and customers on availability SLAs. Electricity is the business's second-largest cost after staff, the sector's Climate Change Agreement target is biting, and prospective customers now ask for PUE in every tender. Before you set foot on site, get the plan right.",
  questions: [
    {
      kind: "single",
      id: "audit-level",
      prompt: "Which level of audit best fits this brief?",
      help: "Match the depth (and cost) of the audit to what the client actually needs to decide.",
      options: [
        { id: "walk", label: "Walk-through (ASHRAE Level 1) only — a quick site tour and bill review" },
        { id: "detailed", label: "Detailed audit (ASHRAE Level 2) — survey, metering analysis and a normalised model, with investment-grade rigour on the 1–2 largest measures" },
        { id: "invgrade", label: "Full investment-grade (Level 3) on every system across the whole facility" },
      ],
      correctId: "detailed",
      explain:
        "A detailed (Level 2) audit fits: enough measurement and analysis to find and rank genuine opportunities in the cooling and power chains, with investment-grade depth saved for the biggest one or two. A walk-through can't support CCA reporting or tender-grade PUE claims; Level 3 everywhere exceeds the brief.",
    },
    {
      kind: "single",
      id: "boundary",
      prompt:
        "Kelbrook's customers own and operate the servers in their racks; Kelbrook provides power, cooling and space. Should the IT equipment's internal efficiency (server utilisation, zombie servers) be inside this audit's boundary?",
      help: "The boundary follows control — and in colocation, the meter and the rack have different owners.",
      options: [
        { id: "facility", label: "Focus on the facility systems Kelbrook controls (cooling, power chain, controls), treating metered IT load as a given — while noting customer IT efficiency as an engagement recommendation" },
        { id: "everything", label: "Audit inside the customers' racks too, since it is all electricity through Kelbrook's intake" },
        { id: "exclude-it", label: "Exclude the IT load from the analysis entirely, including its effect on cooling" },
      ],
      correctId: "facility",
      explain:
        "Kelbrook controls the facility overhead: cooling, UPS, distribution, controls. The customers' IT is contractually theirs, so the audit treats metered IT load as the given the overhead serves — exactly what PUE assumes — while recommending customer engagement on utilisation separately. Auditing inside racks Kelbrook may not touch would produce findings nobody can act on.",
    },
    {
      kind: "multi",
      id: "site-hazards",
      prompt: "Which of these should be arranged or flagged before working in the facility?",
      help: "Data centres are controlled operational environments with resilience obligations.",
      options: [
        { id: "change", label: "Change control: even 'just looking' near live plant needs method statements, and any adjustment goes through the site's change-management process" },
        { id: "security", label: "Security clearance and escorts: customer SLAs make halls controlled spaces with access logging" },
        { id: "live", label: "Live electrical systems: UPS rooms, switchboards and battery strings have specific safety rules and no lone working" },
        { id: "none", label: "Nothing special — with no production line, a data centre is a low-risk office-like environment" },
      ],
      correctIds: ["change", "security", "live"],
      explain:
        "All three are real. Availability contracts make uncontrolled changes the cardinal sin (many outages start as well-intentioned tweaks), halls are security-controlled on behalf of customers, and the power train is live, high-energy plant with battery rooms. 'It's just an office with computers' is how visitors cause incidents.",
    },
    {
      kind: "order",
      id: "sequence",
      prompt: "Put these planning steps in the order you'd actually do them.",
      items: [
        { id: "a", label: "Agree the audit's scope, boundary and level with the facility manager" },
        { id: "b", label: "Request 12+ months of intake metering, the IT (UPS output) metering, and the BMS/DCIM trend data" },
        { id: "c", label: "Analyse the data for patterns (overhead vs IT load, weather response) before visiting" },
        { id: "d", label: "Schedule the site survey with security clearance, escorts and change-control notification arranged" },
      ],
      correctOrder: ["a", "b", "c", "d"],
      explain:
        "Scope first, then data, then analysis before the visit — the monthly overhead-versus-IT relationship tells you exactly what to inspect in the plant rooms. The survey comes last, arranged through the site's security and change-control processes rather than around them.",
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
    "On site: hall one has aisle containment, hall two (the older hall) has none and its CRAH fans run at fixed full speed; the chilled-water setpoint is 7 °C, unchanged since commissioning; and the 2N UPS fleet runs each module at low load. The half-hourly data shows the classic data centre signature: a nearly flat line, around the clock. Now turn the monthly data into a model of how Kelbrook actually behaves.",
  showData: true,
  calcIntro:
    "Use the 12-month dataset and the reference values. The facility model is linear: a fixed base plus terms for IT load and cooling degree-days.",
  calcParts: [
    {
      id: "it-coeff",
      prompt: "Compare January (IT 1,000,000 kWh) with December (IT 1,100,000 kWh), both zero-CDD months. What is the facility model's IT coefficient (facility kWh per IT kWh)?",
      unit: "kWh/kWh",
      answer: 1.25,
      tol: 0.02,
      tolType: "rel",
      hints: [
        "(December facility − January facility) ÷ (December IT − January IT).",
        "(1,425,000 − 1,300,000) ÷ 100,000.",
      ],
      worked: "125,000 ÷ 100,000 = 1.25: every IT kilowatt-hour drags 0.25 kWh of overhead (power-chain losses and load-following cooling) along with it.",
    },
    {
      id: "fixed-base",
      prompt: "Using January, what is the fixed monthly base (kWh/month) — lighting, offices, controls and standing plant that don't follow IT load?",
      unit: "kWh/mo",
      answer: 50000,
      tol: 0.05,
      tolType: "rel",
      hints: [
        "January facility − (coefficient × January IT).",
        "1,300,000 − 1.25 × 1,000,000.",
      ],
      worked: "1,300,000 − 1,250,000 = 50,000 kWh/month of fixed base. Check September: 50,000 + 1.25 × 1,100,000 = 1,425,000 — matches the meter.",
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
      prompt: "Using August (IT 1,100,000 kWh, 62 CDD), what is the weather coefficient (kWh per cooling degree-day)?",
      unit: "kWh/CDD",
      answer: 400,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "(August facility − base − 1.25 × IT) ÷ August CDD.",
        "(1,449,800 − 50,000 − 1,375,000) ÷ 62.",
      ],
      worked: "24,800 ÷ 62 = 400 kWh per cooling degree-day — the chillers and dry coolers working harder in warm weather. July confirms it: 50,000 + 1.25 × 1,100,000 + 400 × 93 = 1,462,200, exactly what the meter recorded.",
    },
  ],
};

// ----- Stage 3 — Analyse & normalise -------------------------------------------

const stage3: Stage = {
  id: "analyse",
  title: "Analyse & Normalise",
  competency: "Data analysis (PUE & benchmarking)",
  icon: "📊",
  intro:
    "With the model complete, produce the figures Kelbrook's tenders, CCA reporting and board pack all need — and read them the way an auditor should, not the way a brochure would.",
  calcIntro: "Using the completed 12-month dataset (July's CDD now filled in at 93):",
  calcParts: [
    {
      id: "total-it",
      prompt: "What was total IT energy for the year?",
      unit: "kWh",
      answer: 12600000,
      tol: 0.02,
      tolType: "rel",
      hints: [
        "Six months at 1,000,000 plus six at 1,100,000.",
        "6 × 1,000,000 + 6 × 1,100,000.",
      ],
      worked: "6,000,000 + 6,600,000 = 12,600,000 kWh of IT energy.",
    },
    {
      id: "total-facility",
      prompt: "What was total facility energy for the year?",
      unit: "kWh",
      answer: 16412000,
      tol: 0.02,
      tolType: "rel",
      hints: [
        "Sum the facility column (with July's 1,462,200).",
        "6 × 1,300,000 + 1,462,200 + 1,449,800 + 4 × 1,425,000.",
      ],
      worked: "Summing all 12 months gives 16,412,000 kWh — a £3.28M bill at £0.20/kWh.",
    },
    {
      id: "annual-pue",
      prompt: "What is the facility's annual PUE?",
      unit: "",
      answer: 1.30,
      tol: 0.01,
      tolType: "abs",
      hints: [
        "Total facility energy ÷ total IT energy.",
        "16,412,000 ÷ 12,600,000.",
      ],
      worked: "16,412,000 ÷ 12,600,000 ≈ 1.30: respectable for a regional colo (legacy enterprise sites run 1.8+, new hyperscale ~1.1), with clear headroom in hall two's airflow and the UPS fleet.",
    },
    {
      id: "pue-point-value",
      prompt: "At this IT load, what is each 0.01 of PUE worth per year at £0.20/kWh?",
      unit: "£/yr",
      answer: 25200,
      tol: 0.03,
      tolType: "rel",
      hints: [
        "0.01 × annual IT energy × price.",
        "0.01 × 12,600,000 × 0.20.",
      ],
      worked: "126,000 kWh × £0.20 = £25,200 per year per 0.01 of PUE — the exchange rate that turns every finding in stage 4 into money the board understands.",
    },
  ],
  questions: [
    {
      kind: "single",
      id: "pue-dilution",
      prompt: "Monthly PUE improved from 1.300 to 1.295 in September, when the new customer's IT load came on and nothing else changed. What does that improvement represent?",
      options: [
        { id: "efficiency", label: "A genuine efficiency gain: the facility systems responded well to the higher load" },
        { id: "dilution", label: "Arithmetic dilution: the 50,000 kWh fixed base spread over more IT — no plant ran any better" },
        { id: "weather", label: "Cooler September weather reducing the chiller load relative to August" },
      ],
      correctId: "dilution",
      explain:
        "The model says it exactly: base and coefficients unchanged, only IT rose, so the fixed 50,000 kWh/month is divided by a bigger denominator. PUE rewards filling the building as much as running it well — which is worth knowing before a tender brochure claims the September number as an achievement.",
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
    "Three findings from the survey are worth working up: hall two's uncontained airflow (fans at fixed full speed against heavy bypass), the UPS fleet's low module loading, and a chilled-water setpoint of 7 °C that the ASHRAE-compliant rack inlets don't need. The survey concludes the airflow programme would cut the IT-proportional overhead coefficient from 1.25 to 1.22, and the UPS work from 1.22 to 1.20.",
  calcIntro: "Electricity £0.20/kWh; annual IT energy 12,600,000 kWh.",
  calcParts: [
    {
      id: "containment-saving",
      prompt: "The hall-two airflow programme (blanking, containment, CRAH VFDs) cuts the IT coefficient by 0.03. What is that worth per year?",
      unit: "£/yr",
      answer: 75600,
      tol: 0.03,
      tolType: "rel",
      hints: ["0.03 × annual IT energy × price.", "0.03 × 12,600,000 × 0.20."],
      worked: "378,000 kWh × £0.20 = £75,600/yr — fan energy no longer spent pushing air past the servers, plus the cooling it dragged along.",
    },
    {
      id: "containment-payback",
      prompt: "The airflow programme is quoted at £120,000. What is its simple payback?",
      unit: "years",
      answer: 1.6,
      tol: 0.1,
      tolType: "abs",
      hints: ["Cost ÷ annual saving.", "120,000 ÷ 75,600."],
      worked: "120,000 ÷ 75,600 ≈ 1.6 years, on plant that runs 8,760 hours a year.",
    },
    {
      id: "ups-saving",
      prompt: "Rebalancing the UPS fleet cuts the coefficient a further 0.02. What is that worth per year?",
      unit: "£/yr",
      answer: 50400,
      tol: 0.03,
      tolType: "rel",
      hints: ["0.02 × annual IT energy × price.", "0.02 × 12,600,000 × 0.20."],
      worked: "252,000 kWh × £0.20 = £50,400/yr of power-chain losses recovered, with the contracted redundancy preserved.",
    },
    {
      id: "new-pue",
      prompt: "With both measures in place (coefficient 1.20, base and weather terms unchanged), what would the annual PUE have been on the same loads?",
      unit: "",
      answer: 1.25,
      tol: 0.01,
      tolType: "abs",
      hints: [
        "(12 × 50,000 + 1.20 × 12,600,000 + 400 × 155) ÷ 12,600,000.",
        "(600,000 + 15,120,000 + 62,000) ÷ 12,600,000.",
      ],
      worked: "15,782,000 ÷ 12,600,000 ≈ 1.25 — five points of PUE, worth about £126,000 a year at the stage-3 exchange rate, from airflow and configuration rather than new plant.",
    },
  ],
  questions: [
    {
      kind: "multi",
      id: "worth-recommending",
      prompt: "Which of these belong in the recommendations?",
      options: [
        { id: "airflow", label: "The hall-two airflow programme (~£120,000, ~1.6-year payback)" },
        { id: "ups", label: "UPS fleet rebalancing within the contracted redundancy (~£50,400/yr, configuration-level cost)" },
        { id: "chw", label: "Raise the chilled-water setpoint stepwise within ASHRAE rack-inlet limits, through change control (near-zero cost)" },
        { id: "shed", label: "Shut down one UPS path during summer peaks to cut losses, accepting a temporary reduction below the contracted redundancy" },
      ],
      correctIds: ["airflow", "ups", "chw"],
      explain:
        "The first three clear the bar: a sub-2-year payback on containment, a five-figure configuration saving, and a free setpoint programme run through change control. Dropping below contracted redundancy to save energy is not an efficiency measure — availability is the product, and no saving survives breaching the SLA that pays for everything.",
    },
    {
      kind: "order",
      id: "priority-order",
      prompt: "Sequence the recommendations by priority for the report.",
      items: [
        { id: "a", label: "Chilled-water setpoint programme — near-zero cost, staged through change control" },
        { id: "b", label: "UPS fleet rebalancing — configuration-level cost, large saving" },
        { id: "c", label: "Hall-two airflow programme — capital project, needs design and installation windows" },
      ],
      correctOrder: ["a", "b", "c"],
      explain:
        "Lead with the free setpoint work, follow with the configuration change, and present the capital programme last — not because it matters least (it is the biggest saving) but because it needs a business case, design and carefully planned works in a live hall the other two don't.",
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
    "Kelbrook's report feeds three audiences: the board (money), the CCA reporting (normalised improvement), and future tenders (PUE claims that must survive due diligence). The numbers need to be defensible in all three rooms.",
  questions: [
    {
      kind: "multi",
      id: "report-content",
      prompt: "What must this audit report include to be credible and actionable?",
      options: [
        { id: "baseline", label: "The facility model (fixed base, 1.25 IT coefficient, 400 kWh/CDD) — not just the annual PUE" },
        { id: "exchange", label: "The £25,200-per-0.01-PUE exchange rate that converts findings into board-ready money" },
        { id: "ranked", label: "Each measure's saving, cost and payback, ranked, with the SLA and change-control constraints made explicit" },
        { id: "generic", label: "A generic list of 'top 10 data centre tips' with no site-specific numbers" },
      ],
      correctIds: ["baseline", "exchange", "ranked"],
      explain:
        "A credible report shows its working: the model that makes savings verifiable and separates load growth from performance, the exchange rate that prices PUE for the board, and every measure costed with its resilience constraints stated. Generic tip lists convince nobody who operates critical infrastructure.",
    },
    {
      kind: "single",
      id: "mv-followup",
      prompt: "Twelve months after the airflow programme, how should its saving be verified?",
      help: "The measurement & verification method from earlier in the curriculum, applied to a facility whose IT load grows.",
      options: [
        { id: "compare-raw", label: "Compare this year's facility total directly to last year's" },
        { id: "adjusted", label: "Re-run the baseline model on this year's actual IT load and degree-days, then compare that adjusted baseline to actual consumption" },
        { id: "pue-only", label: "Check that the brochure PUE is lower than last year's and declare success" },
      ],
      correctId: "adjusted",
      explain:
        "IT growth changes what the facility would have used, in both directions: raw totals rise with new customers even as efficiency improves, and PUE alone improves with dilution even if nothing was fixed. The adjusted baseline (this year's IT and weather through the pre-project model) isolates what the programme actually delivered; the new IT coefficient is the honest headline.",
    },
    {
      kind: "single",
      id: "pitfall",
      prompt: "Marketing wants the tender deck to lead with 'PUE improved from 1.30 to 1.25 — a 4% efficiency gain'. After the September lesson, what must the report make clear?",
      options: [
        { id: "flaw-split", label: "How much of any PUE movement is genuine (coefficient reduction) versus dilution from IT growth — the model separates the two; a brochure won't" },
        { id: "flaw-none", label: "Nothing — PUE is the industry metric and the movement speaks for itself" },
        { id: "flaw-hide", label: "That PUE figures should not be shared with customers at all" },
      ],
      correctId: "flaw-split",
      explain:
        "The facility's own September data proved PUE improves with load growth alone. Due diligence teams know this too, so a defensible claim states the mechanism: 'the IT-overhead coefficient fell from 1.25 to 1.20 following the airflow and UPS programmes' survives scrutiny that a bare PUE delta invites.",
    },
  ],
};

export const STAGES: Stage[] = [stage1, stage2, stage3, stage4, stage5];

export type { CalcPart, Stage, MultiQ, SingleQ, OrderQ, Question, ChoiceOption };
