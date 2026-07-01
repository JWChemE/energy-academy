/**
 * Brewery sector capstone — content & scoring, reusing the same staged-audit
 * engine (components/simulators/AuditCapstone.tsx) and generic types/scoring
 * from lib/auditCapstone.ts.
 *
 * One realistic client (Fenmarsh Brewing Co., a 24,000 hL/year regional craft
 * brewery) is taken through the whole audit lifecycle. The dataset is
 * internally consistent so every calculation is deterministic:
 *   gas  ≈ 8,000 + 20 × hectolitres brewed          (base load + production)
 *   elec ≈ 15,000 + 10 × hectolitres + 15 × CDD      (base + production + cooling)
 * (CDD = cooling degree-days, base 15 °C — refrigeration/glycol condensers
 * work harder as ambient temperature rises, the mirror of a heating degree-day.)
 */

import type { CalcPart } from "./diagnostics";
import type { Stage, MultiQ, SingleQ, OrderQ, Question, ChoiceOption } from "./auditCapstone";

// ----- Reference values learners need (shown in the data panels) -------------

export const REFERENCE = {
  cddBase: 15, // °C — cooling degree-day base temperature
  elecPrice: 0.2, // £/kWh
  gasPrice: 0.06, // £/kWh
  co2Factor: 0.207, // kg CO₂e per kWh (grid electricity)
  annualHl: 24000, // hectolitres/year — Fenmarsh's scale
};

export interface BreweryMonthRow {
  month: string;
  avgTempC: number;
  cdd: number;
  hectolitres: number;
  gasKwh: number;
  elecKwh: number;
}

/** 12 months of production and utility data (most recent year). Internally consistent. */
export const DATASET: BreweryMonthRow[] = [
  { month: "Jan", avgTempC: 4.5, cdd: 0, hectolitres: 1800, gasKwh: 44000, elecKwh: 33000 },
  { month: "Feb", avgTempC: 5.5, cdd: 0, hectolitres: 1850, gasKwh: 45000, elecKwh: 33500 },
  { month: "Mar", avgTempC: 7.5, cdd: 0, hectolitres: 1900, gasKwh: 46000, elecKwh: 34000 },
  { month: "Apr", avgTempC: 10.0, cdd: 0, hectolitres: 1950, gasKwh: 47000, elecKwh: 34500 },
  { month: "May", avgTempC: 13.0, cdd: 5, hectolitres: 2050, gasKwh: 49000, elecKwh: 35575 },
  { month: "Jun", avgTempC: 16.0, cdd: 25, hectolitres: 2150, gasKwh: 51000, elecKwh: 36875 },
  { month: "Jul", avgTempC: 18.5, cdd: 45, hectolitres: 2250, gasKwh: 53000, elecKwh: 38175 },
  { month: "Aug", avgTempC: 18.0, cdd: 0 /* learner computes */, hectolitres: 2200, gasKwh: 52000, elecKwh: 37600 },
  { month: "Sep", avgTempC: 15.0, cdd: 15, hectolitres: 2100, gasKwh: 50000, elecKwh: 36225 },
  { month: "Oct", avgTempC: 11.5, cdd: 3, hectolitres: 2000, gasKwh: 48000, elecKwh: 35045 },
  { month: "Nov", avgTempC: 7.5, cdd: 0, hectolitres: 1900, gasKwh: 46000, elecKwh: 34000 },
  { month: "Dec", avgTempC: 5.0, cdd: 0, hectolitres: 1850, gasKwh: 45000, elecKwh: 33500 },
];

/** Headline annual figures. */
export const ANNUAL = {
  gasKwh: 576000,
  elecKwh: 421995,
  hectolitres: 24000,
};

// ----- Stage 1 — Plan & scope --------------------------------------------------

const stage1: Stage = {
  id: "plan",
  title: "Plan & Scope",
  competency: "Planning & scoping",
  icon: "🗺️",
  intro:
    "Fenmarsh Brewing Co. is a regional craft brewery producing roughly 24,000 hectolitres a year of cask, keg and canned ale — a brewhouse, an 8-vessel fermentation and conditioning cellar, a canning/kegging line, a CIP (clean-in-place) system, a gas-fired steam boiler, and a glycol refrigeration plant, on one site with an adjoining office. Energy costs are up sharply year-on-year, the owners want a proper audit before committing to capital projects, and nobody has looked at the site's energy holistically before. Before you set foot on site, get the plan right.",
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
        "A detailed (Level 2) audit is the right match: enough measurement and analysis to find and rank genuine opportunities, with investment-grade rigour reserved for whichever one or two projects turn out to be the biggest. A walk-through alone won't produce numbers the owners can commit capital against; full investment-grade on every system is far more than this brief (or budget) calls for.",
    },
    {
      kind: "single",
      id: "boundary",
      prompt:
        "Fenmarsh buys its malt from an external maltster, who does the malting off-site. Should malting's energy use be inside this audit's boundary?",
      help: "This is exactly the system-boundary question from the mass and energy balance method — the boundary you draw decides what the audit can and can't answer.",
      options: [
        { id: "outside", label: "No — draw the boundary at Fenmarsh's own gate; malting is upstream, a different site, a different energy bill, and outside what this audit can measure or change" },
        { id: "inside", label: "Yes — include an estimate of the maltster's energy use as part of the audit's findings" },
        { id: "unsure", label: "It doesn't matter either way, since energy is energy wherever it's used" },
      ],
      correctId: "outside",
      explain:
        "Draw the boundary at the site you can actually measure and act on. Malting happens at a different site, on a different energy bill, under a different operator's control — including it would answer a different question (the beer's whole supply-chain footprint, a scope 3 exercise) than the one this brief asks (how efficiently does Fenmarsh's own site run).",
    },
    {
      kind: "multi",
      id: "site-hazards",
      prompt: "Which of these should be flagged before walking the site unaccompanied?",
      help: "Breweries have real, specific hazards an energy auditor might not expect from an office or a typical factory.",
      options: [
        { id: "co2", label: "CO₂ build-up in cellars and fermentation rooms — fermenting beer releases CO₂, which can accumulate and displace breathable air" },
        { id: "hot-surfaces", label: "Uninsulated or lagged-but-hot brewhouse pipework and the copper/kettle itself" },
        { id: "wet-floors", label: "Wet floors near CIP and the packaging line" },
        { id: "no-hazard", label: "None — a brewery is no different from a typical light-industrial site" },
      ],
      correctIds: ["co2", "hot-surfaces", "wet-floors"],
      explain:
        "All three are real, brewery-specific hazards: CO₂ can silently displace oxygen in cellars (a genuine asphyxiation risk needing a monitor and a chaperone), the brewhouse runs hot pipework and vessels, and CIP/packaging areas are routinely wet. Treating a brewery like a generic light-industrial site is exactly the assumption that gets auditors hurt.",
    },
    {
      kind: "order",
      id: "sequence",
      prompt: "Put these planning steps in the order you'd actually do them.",
      items: [
        { id: "a", label: "Agree the audit's scope, boundary and level with the client" },
        { id: "b", label: "Request 12+ months of gas and electricity bills, plus monthly production (hectolitres) records" },
        { id: "c", label: "Schedule the site visit around brewing/packaging days so you see the process actually running" },
        { id: "d", label: "Brief the site on safety inductions (CO₂ monitors, hot surfaces) before arrival" },
      ],
      correctOrder: ["a", "b", "c", "d"],
      explain:
        "Scope first (everything else depends on knowing what you're auditing), then request the data you'll need to analyse (get the request in early — it often takes longer to arrive than expected), then schedule around the process itself, then handle safety logistics immediately before the visit.",
    },
  ],
};

// ----- Stage 2 — On-site ------------------------------------------------------

const stage2: Stage = {
  id: "onsite",
  title: "On-Site",
  competency: "On-site execution & metering",
  icon: "🔍",
  intro:
    "On site, you walk the brewhouse, cellar, packaging line and plant room, and pull twelve months of gas, electricity and production data. Some observations are immediately telling; others need instruments to quantify.",
  questions: [
    {
      kind: "single",
      id: "walkthrough",
      prompt:
        "The wort leaves the boil at close to 100 °C and is rapidly cooled to fermentation temperature through a plate heat exchanger, using cold water that then goes to drain. What's the single biggest walkthrough observation here?",
      help: "Think about what a mass-and-energy balance around this exchanger would immediately show you.",
      options: [
        { id: "hr", label: "This is a heat-recovery opportunity: the water leaving the exchanger is now hot, and going straight to drain wastes exactly the heat that could preheat the next batch's mash or sparge water" },
        { id: "fine", label: "This is standard practice and needs no further attention" },
        { id: "size", label: "The heat exchanger is probably oversized and should be replaced with a smaller one" },
      ],
      correctId: "hr",
      explain:
        "Every batch's wort cooling releases a large, predictable, reasonably high-grade parcel of heat — and if the warmed water goes straight to drain, that heat (and the water) is thrown away. This is one of the highest-value, most common brewery retrofits, and it should jump out at first sight of the process.",
    },
    {
      kind: "single",
      id: "instr-glycol",
      prompt: "Which instrument would best confirm whether the glycol refrigeration plant is running efficiently?",
      help: "You want a direct read on how hard the compressor is working relative to the cooling it's delivering.",
      options: [
        { id: "clamp", label: "A power/current clamp meter on the compressor, alongside the glycol flow temperature and setpoint" },
        { id: "thermal", label: "A thermal-imaging camera pointed at the fermentation vessels" },
        { id: "sound", label: "A sound level meter near the compressor" },
      ],
      correctId: "clamp",
      explain:
        "Compressor power draw against the glycol supply temperature and setpoint tells you directly how the plant is performing (effectively a live COP check) — exactly the reading you'd use to judge whether a setpoint change would help, the subject of a later stage.",
    },
    {
      kind: "single",
      id: "logging",
      prompt: "Fenmarsh has one gas meter and one electricity meter for the whole site. What's the single most useful sub-metering addition?",
      help: "Where would sub-metering resolve the biggest remaining uncertainty in the audit?",
      options: [
        { id: "refrig", label: "A dedicated sub-meter on the glycol/refrigeration plant, separating it from packaging, pumps and lighting" },
        { id: "office", label: "A sub-meter on the office electricity supply" },
        { id: "none", label: "No sub-metering is needed; whole-site data is already enough" },
      ],
      correctId: "refrig",
      explain:
        "Refrigeration is very likely the single largest electrical end use on a brewery site, running continuously to hold fermentation and conditioning temperatures — but on a single whole-site meter, its consumption is bundled in with everything else. Isolating it turns a rough estimate into a defensible, targetable number.",
    },
    {
      kind: "multi",
      id: "interview",
      prompt: "Which questions to brewery staff would most sharpen the audit's findings?",
      options: [
        { id: "cip-freq", label: "How often is CIP run, and at what temperature — is it on a fixed schedule or triggered by actual need?" },
        { id: "setpoints", label: "Have fermentation and cold-store setpoints ever been reviewed, or are they inherited/unquestioned defaults?" },
        { id: "brand", label: "What brand of forklift does the warehouse use?" },
        { id: "downtime", label: "Are there periods (holidays, planned shutdowns) when the cellar and refrigeration still run at full load unnecessarily?" },
      ],
      correctIds: ["cip-freq", "setpoints", "downtime"],
      explain:
        "CIP frequency/temperature, setpoint provenance, and unnecessary full-load running during downtime are all genuine, common sources of avoidable brewery energy use that a meter alone won't reveal — you have to ask. Forklift brand tells you nothing about energy.",
    },
  ],
  showData: true,
  calcIntro:
    "Fenmarsh's meters and production records give the last 12 months below. One figure is missing: August's cooling degree-days (CDD) reading was lost. Work it out from what you do have.",
  calcParts: [
    {
      id: "hl-coeff",
      prompt:
        "Using January (1,800 hL, 33,000 kWh elec) and April (1,950 hL, 34,500 kWh elec) — both zero-CDD months — find the electrical cost per extra hectolitre brewed (Elec = base + coeff × HL, when CDD = 0).",
      unit: "kWh/hL",
      answer: 10,
      tol: 0.05,
      tolType: "rel",
      hints: [
        "Two zero-CDD months give two equations in two unknowns (base, coeff). Subtract them to eliminate the base load.",
        "(34,500 − 33,000) ÷ (1,950 − 1,800).",
      ],
      worked: "(34,500 − 33,000) ÷ (1,950 − 1,800) = 1,500 ÷ 150 = 10 kWh/hL.",
    },
    {
      id: "base-load",
      prompt: "Using that coefficient and January's data, what is the electrical base load (independent of production and cooling)?",
      unit: "kWh",
      answer: 15000,
      tol: 0.03,
      tolType: "rel",
      hints: ["Base = January's elec − (coefficient × January's HL).", "33,000 − (10 × 1,800)."],
      worked: "33,000 − (10 × 1,800) = 33,000 − 18,000 = 15,000 kWh — lighting, controls, standing refrigeration load, pumps.",
    },
    {
      id: "cdd-coeff",
      prompt:
        "June (2,150 hL, CDD 25, elec 36,875 kWh) has a nonzero CDD. Using the base and HL-coefficient just found, what is the electrical cost per cooling degree-day?",
      unit: "kWh/CDD",
      answer: 15,
      tol: 0.05,
      tolType: "rel",
      hints: [
        "First predict June's elec from base + coeff × HL alone, ignoring CDD. The gap between that and the actual figure is what CDD explains.",
        "(36,875 − 15,000 − 10×2,150) ÷ 25.",
      ],
      worked: "Predicted without CDD: 15,000 + 10×2,150 = 36,500. Gap: 36,875 − 36,500 = 375. Per CDD: 375 ÷ 25 = 15 kWh/CDD.",
    },
    {
      id: "aug-cdd",
      prompt:
        "August: 2,200 hL brewed, 37,600 kWh electricity, CDD not recorded. Using the model you've just built (Elec = 15,000 + 10×HL + 15×CDD), what was August's CDD?",
      unit: "CDD",
      answer: 40,
      tol: 0.05,
      tolType: "rel",
      hints: [
        "Rearrange the model to solve for CDD: CDD = (Elec − base − coeff×HL) ÷ CDD-coeff.",
        "(37,600 − 15,000 − 10×2,200) ÷ 15.",
      ],
      worked: "(37,600 − 15,000 − 22,000) ÷ 15 = 600 ÷ 15 = 40 CDD — a genuinely hot August, consistent with its 18.0 °C average.",
    },
  ],
};

// ----- Stage 3 — Analyse & normalise -------------------------------------------

const stage3: Stage = {
  id: "analyse",
  title: "Analyse & Normalise",
  competency: "Data analysis (normalisation & baselining)",
  icon: "📊",
  intro:
    "With the model complete, turn the year into the headline figures that make Fenmarsh's performance comparable — to its own history, and to the rest of the sector.",
  calcIntro: "Using the completed 12-month dataset (August's CDD now filled in at 40):",
  calcParts: [
    {
      id: "total-gas",
      prompt: "What was total gas consumption for the year?",
      unit: "kWh",
      answer: 576000,
      tol: 0.02,
      tolType: "rel",
      hints: ["Sum all 12 months' gas kWh.", "44,000+45,000+46,000+47,000+49,000+51,000+53,000+52,000+50,000+48,000+46,000+45,000."],
      worked: "Summing all 12 months gives 576,000 kWh.",
    },
    {
      id: "total-elec",
      prompt: "What was total electricity consumption for the year?",
      unit: "kWh",
      answer: 421995,
      tol: 0.02,
      tolType: "rel",
      hints: ["Sum all 12 months' elec kWh (using the completed August figure, 37,600).", "33,000+33,500+34,000+34,500+35,575+36,875+38,175+37,600+36,225+35,045+34,000+33,500."],
      worked: "Summing all 12 months gives 421,995 kWh.",
    },
    {
      id: "thermal-intensity",
      prompt: "What is the thermal (gas) energy intensity, per hectolitre brewed (24,000 hL for the year)?",
      unit: "kWh/hL",
      answer: 24,
      tol: 0.03,
      tolType: "rel",
      hints: ["Total gas ÷ total hectolitres.", "576,000 ÷ 24,000."],
      worked: "576,000 ÷ 24,000 = 24 kWh/hL — within the typical 15–30 kWh/hL thermal range for a brewery this size.",
    },
    {
      id: "electrical-intensity",
      prompt: "What is the electrical energy intensity, per hectolitre brewed?",
      unit: "kWh/hL",
      answer: 17.6,
      tol: 0.05,
      tolType: "rel",
      hints: ["Total elec ÷ total hectolitres.", "421,995 ÷ 24,000."],
      worked: "421,995 ÷ 24,000 ≈ 17.6 kWh/hL — toward the upper end of the typical 10–20 kWh/hL electrical range, worth a closer look at refrigeration.",
    },
  ],
};

// ----- Stage 4 — Opportunities -------------------------------------------------

const stage4: Stage = {
  id: "opportunities",
  title: "Opportunities",
  competency: "Quantifying & prioritising opportunities",
  icon: "💡",
  intro:
    "Two opportunities stood out on the walkthrough: the wasted heat from wort cooling, and a glycol plant running a conservatively cold setpoint. Quantify each, then decide what to actually recommend.",
  calcIntro:
    "Opportunity A — Wort heat recovery: capturing hot water from wort cooling to preheat mash/sparge water typically recovers about 15% of brewhouse thermal energy. A suitable heat-recovery unit costs about £20,000.",
  calcParts: [
    {
      id: "hr-kwh",
      prompt: "How much gas energy would 15% heat recovery save per year?",
      unit: "kWh/yr",
      answer: 86400,
      tol: 0.03,
      tolType: "rel",
      hints: ["15% × total annual gas.", "0.15 × 576,000."],
      worked: "0.15 × 576,000 = 86,400 kWh/yr.",
    },
    {
      id: "hr-saving",
      prompt: "At £0.06/kWh gas, what is that worth per year?",
      unit: "£/yr",
      answer: 5184,
      tol: 0.03,
      tolType: "rel",
      hints: ["kWh saved × gas price.", "86,400 × 0.06."],
      worked: "86,400 × £0.06 = £5,184/yr.",
    },
    {
      id: "hr-payback",
      prompt: "What is the simple payback on the £20,000 heat-recovery unit?",
      unit: "years",
      answer: 3.86,
      tol: 0.08,
      tolType: "rel",
      hints: ["Cost ÷ annual saving.", "20,000 ÷ 5,184."],
      worked: "£20,000 ÷ £5,184 ≈ 3.9 years.",
    },
    {
      id: "refrig-saving",
      prompt:
        "Opportunity B — the glycol plant runs 180,000 kWh/yr and could run 2 °C warmer without breaching any fermentation or food-safety limit. At roughly 3% efficiency improvement per °C, what annual saving (at £0.20/kWh) does that setpoint change alone deliver?",
      unit: "£/yr",
      answer: 2160,
      tol: 0.06,
      tolType: "rel",
      hints: ["Saving fraction = 3% × 2 °C. Apply it to the 180,000 kWh, then price it.", "180,000 × 0.06 × 0.20."],
      worked: "180,000 × (0.03×2) × £0.20 = 180,000 × 0.06 × £0.20 = £2,160/yr, for a controls change alone.",
    },
  ],
  questions: [
    {
      kind: "multi",
      id: "worth-recommending",
      prompt: "Which of these belong in the final recommendations?",
      options: [
        { id: "hr", label: "Install the wort heat-recovery unit (~£20,000, ~3.9-year payback)" },
        { id: "setpoint", label: "Raise the glycol setpoint by 2 °C within the confirmed safe range (near-zero cost)" },
        { id: "cip-off", label: "Reduce CIP cleaning frequency below the food-safety-mandated minimum to save hot water" },
        { id: "led", label: "Replace remaining non-LED lighting across the site (modest saving, short payback)" },
      ],
      correctIds: ["hr", "setpoint", "led"],
      explain:
        "Heat recovery, the setpoint change, and an LED retrofit are all genuine, safe opportunities. Cutting CIP below its food-safety-mandated minimum is never on the table — hygiene requirements set a floor no energy saving can justify crossing, exactly the theme from the food-safety lesson.",
    },
    {
      kind: "order",
      id: "priority-order",
      prompt: "Sequence the recommendations by priority for the report.",
      items: [
        { id: "a", label: "Glycol setpoint change — near-zero cost, immediate saving" },
        { id: "b", label: "LED lighting retrofit — short payback, low disruption" },
        { id: "c", label: "Wort heat-recovery unit — largest saving, but needs capital approval and installation planning" },
      ],
      correctOrder: ["a", "b", "c"],
      explain:
        "Lead with the free win (it costs nothing and can start immediately), then the short-payback retrofit, and present the capital project last — not because it matters least, but because it needs a business case and lead time the other two don't.",
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
    "The audit's value is only realised if the report is acted on, and the savings are actually verified afterwards rather than assumed.",
  questions: [
    {
      kind: "multi",
      id: "report-content",
      prompt: "What must the audit report include to be credible and actionable?",
      options: [
        { id: "baseline", label: "The normalised baseline model (base load, production and weather coefficients) — not just raw annual totals" },
        { id: "benchmark", label: "How Fenmarsh's intensity (kWh/hL) compares to typical sector benchmarks" },
        { id: "ranked", label: "Each opportunity's saving, cost and payback, ranked, with the food-safety-mandated limits made explicit" },
        { id: "generic", label: "A generic list of 'top 10 energy tips' with no site-specific numbers" },
      ],
      correctIds: ["baseline", "benchmark", "ranked"],
      explain:
        "A credible report shows its working: the baseline model that makes future savings verifiable, a benchmark comparison that tells the client whether they're actually behind the sector, and every opportunity individually quantified and ranked — never a generic checklist with no numbers tied to this specific site.",
    },
    {
      kind: "single",
      id: "mv-followup",
      prompt: "Twelve months after the heat-recovery unit is installed, how should its saving actually be verified?",
      help: "This is the measurement & verification method from earlier in the curriculum, applied here.",
      options: [
        { id: "compare-raw", label: "Compare this year's gas bill directly to last year's" },
        { id: "adjusted", label: "Re-run the baseline model on this year's actual production, to get the adjusted baseline, then compare that to actual gas used" },
        { id: "assume", label: "Assume the 15% saving occurred as predicted, since the unit was installed correctly" },
      ],
      correctId: "adjusted",
      explain:
        "Comparing raw bills ignores that production (and therefore expected gas use) changes year to year — exactly the weather-luck trap from measurement & verification, here playing out with production instead of weather. The adjusted baseline — this year's production run through the pre-project model — gives the fair comparison, and the saving is measured, not assumed.",
    },
    {
      kind: "single",
      id: "pitfall",
      prompt: "A colleague's draft report compares this year's electricity bill to last year's and claims the whole difference as 'audit-driven savings'. What's the flaw?",
      options: [
        { id: "flaw-normalise", label: "It ignores that production volume (hectolitres brewed) changed between years, and that summer weather affects refrigeration load — some of the difference is neither a saving nor a cost, just a different year" },
        { id: "flaw-none", label: "There's no flaw — a bill is a bill" },
        { id: "flaw-price", label: "The only issue is that electricity prices may have changed" },
      ],
      correctId: "flaw-normalise",
      explain:
        "Without normalising for production and weather (via the CDD-adjusted model built earlier in this capstone), a raw year-on-year comparison confuses genuine efficiency gains with a quieter or milder year — the same overstatement trap that measurement & verification exists to prevent.",
    },
  ],
};

export const STAGES: Stage[] = [stage1, stage2, stage3, stage4, stage5];

export type { CalcPart, Stage, MultiQ, SingleQ, OrderQ, Question, ChoiceOption };
