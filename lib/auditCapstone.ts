/**
 * Energy Audit capstone — content & scoring.
 *
 * One realistic client (Frostfield Foods, a chilled ready-meals factory + office)
 * is taken through the whole audit lifecycle: plan & scope → on-site → analyse &
 * normalise → quantify & rank opportunities → report. The numeric work reuses the
 * shared CalcStep engine (see lib/diagnostics.ts → CalcPart); the judgement work
 * uses the three question primitives defined here.
 *
 * The dataset is internally consistent so every calculation is deterministic:
 *   gas  ≈ 9,100 + 93.8 × HDD              (base load + weather)
 *   elec ≈ 55,000 + 120 × tonnes (+winter lighting)   (base load + production)
 */

import type { CalcPart } from "./diagnostics";

// ----- Reference values learners need (shown in the data panels) -------------

export const REFERENCE = {
  hddBase: 15.5, // °C — UK degree-day base temperature
  elecPrice: 0.245, // £/kWh
  gasPrice: 0.062, // £/kWh
  co2Factor: 0.207, // kg CO₂e per kWh (grid electricity)
  floorArea: 6500, // m²
};

export interface MonthRow {
  month: string;
  avgTempC: number;
  hdd: number;
  gasKwh: number;
  elecKwh: number;
  tonnes: number;
}

/** 12 months of utility data (most recent year). Internally consistent. */
export const DATASET: MonthRow[] = [
  { month: "Jul", avgTempC: 16.7, hdd: 18, gasKwh: 10800, elecKwh: 98200, tonnes: 360 },
  { month: "Aug", avgTempC: 16.0, hdd: 22, gasKwh: 11200, elecKwh: 95800, tonnes: 340 },
  { month: "Sep", avgTempC: 13.2, hdd: 70, gasKwh: 15700, elecKwh: 100600, tonnes: 380 },
  { month: "Oct", avgTempC: 10.7, hdd: 150, gasKwh: 23200, elecKwh: 103000, tonnes: 400 },
  { month: "Nov", avgTempC: 7.2, hdd: 250, gasKwh: 32600, elecKwh: 104800, tonnes: 390 },
  { month: "Dec", avgTempC: 5.2, hdd: 320, gasKwh: 39100, elecKwh: 94000, tonnes: 300 },
  { month: "Jan", avgTempC: 4.5, hdd: 340, gasKwh: 41000, elecKwh: 91600, tonnes: 280 },
  { month: "Feb", avgTempC: 6.6, hdd: 250, gasKwh: 33000, elecKwh: 94000, tonnes: 300 },
  { month: "Mar", avgTempC: 7.0, hdd: 0 /* learner computes */, gasKwh: 33800, elecKwh: 98200, tonnes: 360 },
  { month: "Apr", avgTempC: 10.7, hdd: 150, gasKwh: 23200, elecKwh: 100600, tonnes: 380 },
  { month: "May", avgTempC: 12.8, hdd: 80, gasKwh: 16600, elecKwh: 103000, tonnes: 400 },
  { month: "Jun", avgTempC: 14.7, hdd: 25, gasKwh: 11500, elecKwh: 104200, tonnes: 410 },
];

/** Headline annual figures (Mar HDD shown as 263.5 once computed). */
export const ANNUAL = {
  gasKwh: 291700,
  elecKwh: 1188000,
  tonnes: 4300,
  // prior year, for the production-normalisation trap
  prevElecKwh: 1140000,
  prevTonnes: 4520,
};

// ----- Question primitives ---------------------------------------------------

export interface ChoiceOption {
  id: string;
  label: string;
}

export interface MultiQ {
  kind: "multi";
  id: string;
  prompt: string;
  help?: string;
  options: ChoiceOption[];
  correctIds: string[];
  explain: string;
}

export interface SingleQ {
  kind: "single";
  id: string;
  prompt: string;
  help?: string;
  options: ChoiceOption[];
  correctId: string;
  explain: string;
}

export interface OrderQ {
  kind: "order";
  id: string;
  prompt: string;
  help?: string;
  /** Presented to the learner shuffled; correctOrder holds the right sequence. */
  items: ChoiceOption[];
  correctOrder: string[];
  explain: string;
}

export type Question = MultiQ | SingleQ | OrderQ;

// ----- Stages ----------------------------------------------------------------

export interface Stage {
  id: string;
  title: string;
  competency: string;
  icon: string;
  intro: string;
  questions?: Question[];
  /** When set, the data table + reference panel is shown above the calc parts. */
  showData?: boolean;
  calcIntro?: string;
  calcParts?: CalcPart[];
}

// --- Stage 1 — Plan & scope --------------------------------------------------

const stage1: Stage = {
  id: "plan",
  title: "Plan & Scope",
  competency: "Planning & scoping",
  icon: "🗺️",
  intro:
    "Frostfield Foods makes chilled ready-meals from a 6,500 m² site (production hall, cold stores, despatch and a two-storey office). They run two shifts, Monday–Saturday. Energy spend is up ~18% year-on-year and the parent group has a net-zero commitment; the site director wants an audit that will feed an ISO 50001 energy management system and surface a handful of investment-grade projects. You have a sensible but not unlimited budget. Before you set foot on site, get the plan right.",
  questions: [
    {
      kind: "single",
      id: "audit-level",
      prompt: "Which level of audit best fits this brief?",
      help: "Match the depth (and cost) of the audit to what the client actually needs to decide.",
      options: [
        { id: "walk", label: "Walk-through (ASHRAE Level 1) only — a quick site tour and bill review" },
        { id: "detailed", label: "Detailed audit (ASHRAE Level 2) — survey, metering and normalised analysis, with investment-grade workup on the 1–2 largest measures" },
        { id: "invgrade", label: "Full investment-grade (Level 3) on every system across the whole site" },
        { id: "remote", label: "Desktop/remote audit from the bills alone — no site visit needed" },
      ],
      correctId: "detailed",
      explain:
        "A Level 2 detailed audit gives the normalised analysis and costed register an ISO 50001 system needs, while reserving the expensive investment-grade rigour for the one or two big-ticket measures where it changes the decision. A walk-through is too shallow to support capital cases; full investment-grade on everything is disproportionate to the budget; and you can't characterise a refrigeration-heavy site from bills alone.",
    },
    {
      kind: "multi",
      id: "data-request",
      prompt: "What should you request from the client BEFORE the site visit?",
      help: "Pick everything that genuinely informs the audit. Wrong picks cost you — judgement includes not asking for what you don't need (or shouldn't have).",
      options: [
        { id: "bills", label: "24 months of gas & electricity bills" },
        { id: "hh", label: "Half-hourly (HH) electricity data" },
        { id: "tariff", label: "Tariff and supply-contract details" },
        { id: "drawings", label: "Site drawings / floor areas" },
        { id: "asset", label: "Asset / equipment list (ratings, ages)" },
        { id: "production", label: "Monthly production volumes (tonnes)" },
        { id: "occupancy", label: "Shift patterns & occupancy" },
        { id: "prev", label: "Any previous audit reports & O&M logs" },
        { id: "payroll", label: "Individual employee salaries and home addresses" },
        { id: "competitor", label: "Competitors' confidential pricing" },
      ],
      correctIds: ["bills", "hh", "tariff", "drawings", "asset", "production", "occupancy", "prev"],
      explain:
        "You want enough history to normalise (24 months of bills + HH data), the drivers (production, occupancy), the physical context (drawings, asset list), the commercial context (tariff) and prior knowledge (previous reports/logs). Payroll and competitor data are irrelevant to energy use and a data-protection liability — asking for them is a red flag, not diligence.",
    },
    {
      kind: "multi",
      id: "plan-safety",
      prompt: "Which of these belong in your visit plan?",
      help: "Think representativeness, safety and scope control.",
      options: [
        { id: "period", label: "Schedule metering over a representative period (typical production weeks)" },
        { id: "ppe", label: "Arrange escorted access, site induction and PPE" },
        { id: "permit", label: "Identify permit-to-work needs (electrical, work at height, confined spaces)" },
        { id: "scope", label: "Agree scope boundaries and exclusions in writing" },
        { id: "shutdown", label: "Time the metering for the annual shutdown week so the site is quieter" },
        { id: "switchoff", label: "Switch equipment off during the day to 'test' what it draws" },
        { id: "oneday", label: "Base conclusions on a single representative day to save time" },
      ],
      correctIds: ["period", "ppe", "permit", "scope"],
      explain:
        "Good planning captures a representative period, handles access and safety properly, and pins down scope so expectations are clear. Metering during the shutdown gives unrepresentative data; switching plant off without authorisation is unsafe and can disrupt production; and a single day won't capture weekday/weekend and shift variation.",
    },
    {
      kind: "order",
      id: "sequence",
      prompt: "Put the audit engagement into a sensible order.",
      help: "Click the steps in the order you'd run them. You can reset if you misclick.",
      items: [
        { id: "objectives", label: "Agree objectives, scope & success criteria" },
        { id: "review", label: "Request & review historical data (bills, HH, production)" },
        { id: "planvisit", label: "Plan the site visit, metering & safety" },
        { id: "survey", label: "Carry out the on-site survey & install metering" },
        { id: "analyse", label: "Analyse & normalise the data; set the baseline" },
        { id: "opps", label: "Identify, quantify & rank opportunities" },
        { id: "report", label: "Write & present the report; agree an action plan" },
      ],
      correctOrder: ["objectives", "review", "planvisit", "survey", "analyse", "opps", "report"],
      explain:
        "Scope first, then learn what the data already tells you, then plan and execute the visit, then analyse against a normalised baseline before quantifying opportunities — and only then report. Skipping the data review before the visit is the classic rookie error: you arrive without knowing where to look.",
    },
  ],
};

// --- Stage 2 — On-site -------------------------------------------------------

const stage2: Stage = {
  id: "onsite",
  title: "On-Site",
  competency: "On-site execution & metering",
  icon: "🔎",
  intro:
    "You're on site for two days during normal production. Here you separate real findings from distractions, meter the right things in the right way, and get the most out of the people who run the plant.",
  questions: [
    {
      kind: "multi",
      id: "walkthrough",
      prompt: "On the walk-through you note the items below. Which are genuine energy findings worth logging?",
      help: "Some observations are real waste; others are normal, or not an energy issue at all.",
      options: [
        { id: "leaks", label: "Audible compressed-air leaks at several conveyor actuators" },
        { id: "lights", label: "High-bay lights full-on in a despatch bay that's empty most of the shift" },
        { id: "door", label: "A cold-store strip-curtain torn, door propped open during loading" },
        { id: "pipe", label: "Uninsulated hot-water flow/return pipes in the plant room" },
        { id: "flue", label: "Boiler flue uncomfortably hot to stand near; no economiser fitted" },
        { id: "fresh", label: "A freshly painted wall in the canteen" },
        { id: "car", label: "The car park is nearly full" },
        { id: "label", label: "A machine guard has a manufacturer's label in a foreign language" },
      ],
      correctIds: ["leaks", "lights", "door", "pipe", "flue"],
      explain:
        "Air leaks, over-lit empty space, a failed cold-store seal, bare hot pipework and a hot flue with no heat recovery are all bankable findings. The paintwork, a full car park and a foreign-language label tell you nothing about energy — chasing them is wasted audit time.",
    },
    {
      kind: "single",
      id: "instr-motor",
      prompt: "You want the ACTUAL running load of a large refrigeration compressor motor. What do you use?",
      options: [
        { id: "clamp", label: "A clamp/power meter (true power, ideally logged over time)" },
        { id: "nameplate", label: "Read the nameplate kW and assume it runs at that" },
        { id: "lux", label: "A lux meter" },
        { id: "flue", label: "A flue-gas analyser" },
      ],
      correctId: "clamp",
      explain:
        "Motors rarely run at nameplate; you need measured power (logged, to catch load cycling). The nameplate is a rating, not a load — using it overstates consumption and savings.",
    },
    {
      kind: "single",
      id: "instr-air",
      prompt: "Which instrument best locates and sizes compressed-air leaks?",
      options: [
        { id: "ultrasonic", label: "An ultrasonic leak detector" },
        { id: "thermal", label: "A thermal-imaging camera" },
        { id: "ear", label: "Just listening as you walk past" },
        { id: "manometer", label: "A water manometer" },
      ],
      correctId: "ultrasonic",
      explain:
        "Ultrasonic detectors hear the high-frequency hiss of leaks over plant noise and let you tag and prioritise them. Casual listening finds only the loudest few; thermal imaging is for heat, not leaks.",
    },
    {
      kind: "single",
      id: "logging",
      prompt: "How long should you log the electrical load profile to characterise this site?",
      options: [
        { id: "twoweeks", label: "At least 1–2 typical weeks at short interval (e.g. 1–15 min), avoiding atypical periods" },
        { id: "onehour", label: "One hour at peak is plenty" },
        { id: "year", label: "A full year, or the data is worthless" },
        { id: "random", label: "A few spot readings whenever convenient" },
      ],
      correctId: "twoweeks",
      explain:
        "One to two representative weeks at a short interval captures the weekday/weekend and shift cycle — including the all-important overnight base load — without waiting a year. Spot readings miss the pattern; an hour at peak tells you almost nothing about base load.",
    },
    {
      kind: "multi",
      id: "interview",
      prompt: "Which questions are worth putting to the operations manager?",
      help: "You're after the context the meters can't give you.",
      options: [
        { id: "hours", label: "What are the real running hours and shift patterns of each area?" },
        { id: "setpoints", label: "What temperature/pressure setpoints do you hold, and why?" },
        { id: "complaints", label: "Where do you get comfort or process complaints?" },
        { id: "changes", label: "Any planned changes to production, product mix or hours?" },
        { id: "maint", label: "What's the maintenance regime and recent fault history?" },
        { id: "weekend", label: "What stays running at night and weekends — and does it need to?" },
        { id: "favourite", label: "What's your favourite machine on the line?" },
        { id: "lunch", label: "Where does the team usually go for lunch?" },
      ],
      correctIds: ["hours", "setpoints", "complaints", "changes", "maint", "weekend"],
      explain:
        "Running hours, setpoints, complaints, planned changes, maintenance history and what's left on out-of-hours are exactly the operational context that turns a meter reading into an opportunity (or rules one out). The last two are just small talk.",
    },
  ],
};

// --- Stage 3 — Analyse & normalise (the data work) --------------------------

const stage3: Stage = {
  id: "analyse",
  title: "Analyse & Normalise",
  competency: "Data analysis (normalisation & baselining)",
  icon: "📊",
  intro:
    "Back at the desk with 12 months of data. Raw totals can't be compared month-to-month without accounting for weather and production, so you normalise before you conclude anything. Use the data table and reference values below.",
  showData: true,
  calcIntro:
    "Work through each figure. The 'I'm stuck' button reveals the method then a numeric nudge — but using help means it won't count as a clean pass until you retry it unaided.",
  calcParts: [
    {
      id: "hdd-mar",
      prompt:
        "March averaged 7.0 °C over 31 days. Using the 15.5 °C base, what were March's heating degree-days (HDD)?",
      unit: "HDD",
      answer: 263.5,
      tol: 3,
      tolType: "abs",
      hints: [
        "HDD/day = base − mean temp (when positive); multiply by the number of days.",
        "(15.5 − 7.0) = 8.5 HDD/day × 31 days.",
      ],
      worked: "(15.5 − 7.0) × 31 = 8.5 × 31 = 263.5 HDD.",
    },
    {
      id: "slope",
      prompt:
        "Estimate the heating sensitivity (the regression slope) from two clean months: January (41,000 kWh gas at 340 HDD) and July (10,800 kWh at 18 HDD).",
      unit: "kWh/HDD",
      answer: 93.8,
      tol: 0.06,
      tolType: "rel",
      hints: [
        "Slope = change in gas ÷ change in HDD between the two months.",
        "(41,000 − 10,800) ÷ (340 − 18) = 30,200 ÷ 322.",
      ],
      worked: "(41,000 − 10,800) ÷ (340 − 18) = 30,200 ÷ 322 ≈ 93.8 kWh/HDD.",
    },
    {
      id: "intercept",
      prompt:
        "Using that slope, what is the base load (intercept) — the gas used when there's no heating demand? Use July: 10,800 kWh at 18 HDD.",
      unit: "kWh/month",
      answer: 9112,
      tol: 400,
      tolType: "abs",
      hints: [
        "Base load = monthly gas − (slope × that month's HDD).",
        "10,800 − (93.8 × 18) = 10,800 − 1,688.",
      ],
      worked:
        "10,800 − (93.8 × 18) ≈ 10,800 − 1,688 ≈ 9,100 kWh/month — the non-weather gas (process hot water etc.).",
    },
    {
      id: "normalised",
      prompt:
        "This February the site changed its heating controls. February used 33,000 kWh at 250 HDD. Using last year's model (base 9,100 + 93.8 × HDD), how much MORE (+) or LESS (−) gas did it use than expected?",
      unit: "kWh",
      answer: 437,
      tol: 250,
      tolType: "abs",
      hints: [
        "Expected = 9,100 + 93.8 × 250. Then compare to the actual 33,000.",
        "Expected ≈ 9,100 + 23,450 = 32,550; actual − expected = 33,000 − 32,550.",
      ],
      worked:
        "Expected = 9,100 + 93.8 × 250 ≈ 32,550 kWh. Actual 33,000 → +450 kWh (≈ +1.4%). Once you normalise for the milder weather, the controls change delivered no real saving — a raw month-on-month comparison would have fooled you.",
    },
    {
      id: "intensity",
      prompt:
        "Building energy intensity: annual gas 291,700 kWh + electricity 1,188,000 kWh over 6,500 m². What's the intensity?",
      unit: "kWh/m²/yr",
      answer: 227.6,
      tol: 0.04,
      tolType: "rel",
      hints: [
        "Add both fuels, then divide by floor area.",
        "(291,700 + 1,188,000) ÷ 6,500 = 1,479,700 ÷ 6,500.",
      ],
      worked:
        "1,479,700 ÷ 6,500 ≈ 227.6 kWh/m²/yr. Note: a chilled-food factory's refrigeration and process loads make a floor-area benchmark misleading — for this site, energy per tonne is the better KPI.",
    },
    {
      id: "sec-now",
      prompt:
        "Specific energy consumption (SEC) this year: electricity 1,188,000 kWh for 4,300 tonnes produced. What's the SEC?",
      unit: "kWh/tonne",
      answer: 276.3,
      tol: 0.03,
      tolType: "rel",
      hints: ["SEC = electricity ÷ tonnes produced.", "1,188,000 ÷ 4,300."],
      worked: "1,188,000 ÷ 4,300 ≈ 276.3 kWh/tonne.",
    },
    {
      id: "sec-prev",
      prompt:
        "Last year the site used 1,140,000 kWh for 4,520 tonnes. What was last year's SEC — and what does the comparison tell you?",
      unit: "kWh/tonne",
      answer: 252.2,
      tol: 0.03,
      tolType: "rel",
      hints: ["Same formula on last year's figures.", "1,140,000 ÷ 4,520."],
      worked:
        "1,140,000 ÷ 4,520 ≈ 252.2 kWh/tonne. SEC has risen from 252 to 276 kWh/t (+9.6%): once you normalise for the drop in production, the site is genuinely LESS efficient — the headline bill rise understates the real problem.",
    },
  ],
};

// --- Stage 4 — Opportunities -------------------------------------------------

const stage4: Stage = {
  id: "opportunities",
  title: "Opportunities",
  competency: "Quantifying & prioritising opportunities",
  icon: "💡",
  intro:
    "Your analysis and survey point to three measures. Quantify each, then prioritise. Use electricity at £0.245/kWh and a grid factor of 0.207 kg CO₂e/kWh.",
  calcIntro:
    "Opportunity A — eliminate avoidable out-of-hours load. HH data shows a flat 78 kW overnight base load; of this, ~55 kW is refrigeration that must run, leaving ~23 kW of avoidable load (lights, an air compressor cycling on leaks, office HVAC). The site is unoccupied about 70 hours per week.",
  calcParts: [
    {
      id: "oohrs-kwh",
      prompt: "Opportunity A: annual energy from the 23 kW of avoidable out-of-hours load (70 unoccupied hours/week, 52 weeks)?",
      unit: "kWh/yr",
      answer: 83720,
      tol: 0.04,
      tolType: "rel",
      hints: ["kWh = kW × hours/week × weeks.", "23 × 70 × 52."],
      worked: "23 kW × 70 h/week × 52 weeks ≈ 83,700 kWh/yr.",
    },
    {
      id: "oohrs-cost",
      prompt: "Opportunity A: annual cost saving at £0.245/kWh?",
      unit: "£/yr",
      answer: 20511,
      tol: 0.05,
      tolType: "rel",
      hints: ["£ = kWh × price.", "83,700 × 0.245."],
      worked: "83,700 × £0.245 ≈ £20,500/yr.",
    },
    {
      id: "oohrs-payback",
      prompt: "Opportunity A costs ~£4,000 (timeclocks/BMS reconfig + leak repairs). Simple payback?",
      unit: "years",
      answer: 0.195,
      tol: 0.1,
      tolType: "rel",
      hints: ["Payback = cost ÷ annual saving.", "4,000 ÷ 20,500."],
      worked: "£4,000 ÷ £20,500 ≈ 0.2 years (about 10 weeks) — a clear quick win.",
    },
    {
      id: "oohrs-co2",
      prompt: "Opportunity A: annual CO₂ saved at 0.207 kg CO₂e/kWh (answer in tonnes)?",
      unit: "t CO₂/yr",
      answer: 17.3,
      tol: 0.06,
      tolType: "rel",
      hints: ["kg = kWh × factor; ÷ 1,000 for tonnes.", "83,700 × 0.207 ÷ 1,000."],
      worked: "83,700 × 0.207 ≈ 17,300 kg ≈ 17.3 tonnes CO₂/yr.",
    },
    {
      id: "fridge-kwh",
      prompt:
        "Opportunity B — refrigeration tune-up (raise suction pressure, fit night blinds, fix door seals). Refrigeration is ~40% of the 1,188,000 kWh; the measure is expected to cut refrigeration energy by 8%. Annual saving?",
      unit: "kWh/yr",
      answer: 38016,
      tol: 0.05,
      tolType: "rel",
      hints: ["Refrigeration energy = 40% of total; then take 8% of that.", "1,188,000 × 0.40 × 0.08."],
      worked: "1,188,000 × 0.40 × 0.08 ≈ 38,000 kWh/yr (≈ £9,300/yr; cost ~£15,000 → ~1.6-yr payback).",
    },
    {
      id: "led-kwh",
      prompt:
        "Opportunity C — LED high-bay retrofit. 60 fittings × 150 W run ~12 h/day for 360 days; LEDs cut their energy by 55%. Annual saving?",
      unit: "kWh/yr",
      answer: 21384,
      tol: 0.05,
      tolType: "rel",
      hints: ["Existing kWh = kW × hours; kW = 60 × 150 W = 9 kW. Then take 55%.", "9 × 12 × 360 × 0.55."],
      worked: "9 kW × 12 h × 360 d × 0.55 ≈ 21,400 kWh/yr (≈ £5,240/yr; cost ~£18,000 → ~3.4-yr payback).",
    },
  ],
  questions: [
    {
      kind: "order",
      id: "rank",
      prompt: "Rank the three measures by simple payback, best (shortest) first.",
      help: "A ≈ 0.2 yr · B ≈ 1.6 yr · C ≈ 3.4 yr.",
      items: [
        { id: "A", label: "A — eliminate avoidable out-of-hours load (£4,000)" },
        { id: "B", label: "B — refrigeration tune-up (£15,000)" },
        { id: "C", label: "C — LED high-bay retrofit (£18,000)" },
      ],
      correctOrder: ["A", "B", "C"],
      explain:
        "By payback: A (0.2 yr) → B (1.6 yr) → C (3.4 yr). The near-free out-of-hours fix should be done immediately; it also costs nothing to start and builds client confidence (and budget) for the capital measures.",
    },
    {
      kind: "single",
      id: "recommend",
      prompt: "The director asks what to do first. Best answer?",
      options: [
        { id: "ooh", label: "Start Opportunity A now (no/low cost, ~10-week payback), and use the saving and momentum to fund B and C" },
        { id: "led", label: "Lead with the LED retrofit because lighting upgrades are visible and popular" },
        { id: "all", label: "Insist all three are done simultaneously or none are worth doing" },
        { id: "wait", label: "Wait a year to gather more data before acting on anything" },
      ],
      correctId: "ooh",
      explain:
        "Sequence the no-cost/quick-win first: it pays back in weeks, needs no capital sign-off, reduces the base load against which you'll measure later, and earns the credibility to get the capital measures approved. Leading with the most expensive, slowest-payback measure (LED) is the wrong order.",
    },
  ],
};

// --- Stage 5 — Report --------------------------------------------------------

const stage5: Stage = {
  id: "report",
  title: "Report & M&V",
  competency: "Reporting & verification",
  icon: "📝",
  intro:
    "A great audit dies in a bad report. Make it decision-ready, honest about uncertainty, and set up so savings can later be verified.",
  questions: [
    {
      kind: "multi",
      id: "report-content",
      prompt: "What belongs in the report you hand to the director?",
      help: "It has to serve a busy decision-maker AND a sceptical finance team.",
      options: [
        { id: "exec", label: "A one-page executive summary with the headline savings and asks" },
        { id: "baseline", label: "The normalised baseline and how it was derived" },
        { id: "register", label: "A prioritised opportunities register (kWh, £, payback, CO₂)" },
        { id: "method", label: "Methodology, assumptions and data sources" },
        { id: "uncertainty", label: "An honest note on measurement uncertainty and confidence" },
        { id: "mv", label: "A measurement & verification (M&V) plan for the recommended measures" },
        { id: "jargon", label: "As much unexplained technical jargon as possible to look authoritative" },
        { id: "guarantee", label: "A guarantee that every estimate is exact to the nearest kWh" },
      ],
      correctIds: ["exec", "baseline", "register", "method", "uncertainty", "mv"],
      explain:
        "Decision-makers need the summary and the costed register; finance and any auditor of the ISO 50001 system need the baseline, methodology, an honest uncertainty statement and an M&V plan. Jargon-for-show and false precision destroy credibility — savings estimates are ranges, not guarantees.",
    },
    {
      kind: "multi",
      id: "pitfalls",
      prompt: "Which of these are real pitfalls to avoid in your numbers?",
      help: "These are the mistakes that get an audit's savings claims torn apart.",
      options: [
        { id: "unnorm", label: "Quoting savings from raw month-on-month figures without normalising" },
        { id: "double", label: "Double-counting savings from measures that interact (e.g. LEDs reduce heat, changing HVAC load)" },
        { id: "nobaseline", label: "Claiming savings with no agreed baseline to measure against" },
        { id: "precision", label: "Reporting figures to false precision that implies certainty you don't have" },
        { id: "nameplate", label: "Sizing motor savings from nameplate ratings instead of measured load" },
        { id: "round", label: "Rounding a payback of 1.63 years to 'about 1.6 years'" },
        { id: "rangenote", label: "Presenting a saving as a range with stated assumptions" },
      ],
      correctIds: ["unnorm", "double", "nobaseline", "precision", "nameplate"],
      explain:
        "Un-normalised claims, double-counting interactive measures, no baseline, false precision and nameplate-based sizing are exactly how savings get overstated and trust gets lost. Sensible rounding and quoting honest ranges with assumptions are good practice, not pitfalls.",
    },
  ],
};

export const STAGES: Stage[] = [stage1, stage2, stage3, stage4, stage5];

// ----- Scoring ---------------------------------------------------------------

/** Multi-select: (right picks − wrong picks) / total right, clamped to 0..1. */
export function scoreMulti(selected: string[], correct: string[]): number {
  const cor = new Set(correct);
  let right = 0;
  let wrong = 0;
  for (const id of selected) (cor.has(id) ? right++ : wrong++);
  return Math.max(0, (right - wrong) / correct.length);
}

/** Ordering: fraction of items in their correct position. */
export function scoreOrder(arranged: string[], correct: string[]): number {
  if (arranged.length !== correct.length) return 0;
  let hits = 0;
  for (let i = 0; i < correct.length; i++) if (arranged[i] === correct[i]) hits++;
  return hits / correct.length;
}

/** CalcStep status → fraction of a mark. */
export function scoreCalcStatus(status: string): number {
  if (status === "unaided") return 1;
  if (status === "hinted") return 0.5;
  return 0; // skipped | wrong | unsolved
}

export function verdict(pct: number): { label: string; tone: "good" | "ok" | "low" } {
  if (pct >= 0.8) return { label: "Audit-ready", tone: "good" };
  if (pct >= 0.6) return { label: "Competent, with gaps", tone: "ok" };
  return { label: "Needs more practice", tone: "low" };
}
