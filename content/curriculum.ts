/**
 * The curriculum manifest — the single source of truth for the whole platform.
 *
 * Structure: Level (tier) -> Course -> Module -> Lesson.
 *
 * Lesson body content lives in MDX files at:
 *   content/courses/<course.slug>/<lesson.slug>.mdx
 *
 * To add/reorder/rename courses or lessons, edit this file. Mark a course
 * `status: "available"` and give it modules+lessons once its MDX exists;
 * leave it `"coming-soon"` (empty modules) to show it in the catalogue as a
 * teaser. Lesson metadata (title, summary, minutes) lives here, not in the
 * MDX, so the manifest stays the source of truth.
 */

export type LevelAccent = {
  /** Small pill badge, e.g. for the level label. */
  badge: string;
  /** A solid dot / marker colour. */
  dot: string;
  /** Tailwind gradient stops, e.g. for hero banners. */
  gradient: string;
  /** Focus / outline ring colour. */
  ring: string;
  /** Accent text colour. */
  text: string;
  /** Soft tinted background. */
  softBg: string;
};

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  /** Estimated reading/viewing time in minutes. */
  minutes: number;
};

export type Module = {
  slug: string;
  title: string;
  lessons: Lesson[];
};

export type CourseStatus = "available" | "coming-soon";

export type Course = {
  slug: string;
  title: string;
  summary: string;
  status: CourseStatus;
  modules: Module[];
};

/**
 * A numbered tier (Level 1/2/3 — the expertise progression) or a Sector — a
 * peer section, not a tier, for industry-specific application courses
 * (Breweries, Data Centres, etc.). Discriminated on `kind`: numbered levels
 * omit it, sectors set it to "sector" and have no `number`.
 */
export type Level =
  | {
      kind?: undefined;
      slug: string;
      number: 1 | 2 | 3;
      title: string;
      tagline: string;
      description: string;
      accent: LevelAccent;
      courses: Course[];
    }
  | {
      kind: "sector";
      slug: string;
      title: string;
      tagline: string;
      description: string;
      accent: LevelAccent;
      courses: Course[];
    };

/** The three numbered tiers only (excludes Sectors) — what the homepage's "Tiers" stat counts. */
export type NumberedLevel = Extract<Level, { number: 1 | 2 | 3 }>;

/**
 * NOTE on Tailwind classes below: they are written as complete literal
 * strings so Tailwind's scanner can see them. Don't build them by
 * interpolation or the styles won't be generated.
 */
const accents: Record<1 | 2 | 3, LevelAccent> = {
  1: {
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
    gradient: "from-emerald-500 to-teal-600",
    ring: "ring-emerald-500/20",
    text: "text-emerald-700",
    softBg: "bg-emerald-50",
  },
  2: {
    badge: "bg-sky-100 text-sky-700",
    dot: "bg-sky-500",
    gradient: "from-sky-500 to-indigo-600",
    ring: "ring-sky-500/20",
    text: "text-sky-700",
    softBg: "bg-sky-50",
  },
  3: {
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-500",
    gradient: "from-amber-500 to-orange-600",
    ring: "ring-amber-500/20",
    text: "text-amber-700",
    softBg: "bg-amber-50",
  },
};

/** Accent for the Sectors section — distinct from all three numbered tiers. */
const sectorAccent: LevelAccent = {
  badge: "bg-rose-100 text-rose-700",
  dot: "bg-rose-500",
  gradient: "from-rose-500 to-fuchsia-600",
  ring: "ring-rose-500/20",
  text: "text-rose-700",
  softBg: "bg-rose-50",
};

/** Convenience for declaring a not-yet-written course. */
function comingSoon(slug: string, title: string, summary: string): Course {
  return { slug, title, summary, status: "coming-soon", modules: [] };
}

export const curriculum: NumberedLevel[] = [
  {
    slug: "level-1",
    number: 1,
    title: "Foundations",
    tagline: "Principles for everyone",
    description:
      "The bedrock every energy professional shares. Start here to understand what energy is, how it's measured, the rules of the UK system, and the disciplines that underpin everything in Levels 2 and 3.",
    accent: accents[1],
    courses: [
      {
        slug: "intro-to-energy-management",
        title: "Introduction to Energy Management",
        summary:
          "What energy is, how it's measured, why we manage it, and how to turn a saving into a decision. The foundation course for the whole platform.",
        status: "available",
        modules: [
          {
            slug: "energy-fundamentals",
            title: "Energy Fundamentals",
            lessons: [
              {
                slug: "what-is-energy",
                title: "What Is Energy?",
                summary:
                  "Forms of energy, energy quality, and the two laws of thermodynamics that govern every system you'll ever manage.",
                minutes: 8,
              },
              {
                slug: "energy-units",
                title: "Units, Scales & Conversions",
                summary:
                  "Joules, watts, kWh, therms and tonnes of CO2 — the units you'll meet every day and how to move between them.",
                minutes: 10,
              },
              {
                slug: "energy-vs-power",
                title: "Energy vs. Power: kW and kWh",
                summary:
                  "The single distinction that trips up newcomers — and why your energy bill has two very different kinds of charge.",
                minutes: 8,
              },
              {
                slug: "energy-fundamentals-check",
                title: "Energy Fundamentals Check",
                summary:
                  "Quiz: consolidate energy forms, units, the laws of thermodynamics, and energy vs power.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "the-practice",
            title: "The Practice of Energy Management",
            lessons: [
              {
                slug: "why-manage-energy",
                title: "Why Manage Energy?",
                summary:
                  "The business, environmental, and reliability case — and why energy is one of the most controllable costs an organisation has.",
                minutes: 7,
              },
              {
                slug: "the-energy-management-cycle",
                title: "The Energy Management Cycle",
                summary:
                  "Plan-Do-Check-Act: the continual-improvement loop at the heart of ISO 50001 and every effective energy programme.",
                minutes: 9,
              },
              {
                slug: "energy-management-check",
                title: "Energy Management Practice Check",
                summary:
                  "Quiz: why organisations manage energy, the PDCA cycle, and when and how to apply it.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "making-the-case",
            title: "Making the Case for Savings",
            lessons: [
              {
                slug: "simple-payback",
                title: "The Economics: Simple Payback",
                summary:
                  "Turn an energy saving into a financial decision with the most-used metric in the industry — and learn where it misleads.",
                minutes: 10,
              },
              {
                slug: "course-check",
                title: "Course Check",
                summary:
                  "A short quiz to consolidate everything from the foundation course.",
                minutes: 6,
              },
            ],
          },
        ],
      },
      {
        slug: "mass-and-energy-balances",
        title: "Mass & Energy Balances",
        summary:
          "The universal method behind every audit, diagnosis and M&V calculation: drawing a boundary, tracking what goes in and out, and never losing a kWh.",
        status: "available",
        modules: [
          {
            slug: "conservation-principles",
            title: "Conservation Principles & System Boundaries",
            lessons: [
              {
                slug: "conservation-laws",
                title: "The Conservation Laws: Mass & Energy",
                summary:
                  "Why nothing is created or destroyed — the first law restated as a practical accounting tool, not just theory.",
                minutes: 9,
              },
              {
                slug: "system-boundaries",
                title: "Defining the System: Boundaries & Control Volumes",
                summary:
                  "Drawing the line around what you're analysing — open vs closed systems, steady-state vs transient — and why the boundary you choose changes the answer.",
                minutes: 10,
              },
              {
                slug: "your-first-balance",
                title: "Building Your First Balance: In = Out + Losses",
                summary:
                  "The general balance equation, a black-box worked example, and the habit of always accounting for 100% of what goes in.",
                minutes: 10,
              },
              {
                slug: "conservation-check",
                title: "Conservation Principles Check",
                summary: "Quiz on conservation laws, boundaries and the general balance equation.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "mass-balances",
            title: "Mass Balances in Practice",
            lessons: [
              {
                slug: "conservation-of-mass",
                title: "Conservation of Mass & Material Flow",
                summary:
                  "Mass in = mass out + accumulation; units, density and flow-rate conversions for steady-flow processes.",
                minutes: 9,
              },
              {
                slug: "combustion-mass-balance",
                title: "Worked Example: A Combustion Mass Balance",
                summary:
                  "Balancing fuel and air for methane combustion — stoichiometric air, excess air, and why boilers never run at the theoretical ratio.",
                minutes: 11,
              },
              {
                slug: "psychrometric-mass-balance",
                title: "Worked Example: A Moisture (Psychrometric) Balance",
                summary:
                  "Tracking water vapour through an air-handling unit — where dehumidification energy actually goes.",
                minutes: 10,
              },
              {
                slug: "mass-balances-check",
                title: "Mass Balances Check",
                summary: "Quiz on mass conservation, combustion stoichiometry and moisture balances.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "energy-balances",
            title: "Energy Balances Across Real Systems",
            lessons: [
              {
                slug: "boiler-energy-balance",
                title: "Worked Example: The Boiler Energy Balance",
                summary:
                  "Fuel in, useful heat out, and where the rest goes — flue losses, casing losses, blowdown.",
                minutes: 10,
              },
              {
                slug: "steam-energy-balance",
                title: "Worked Example: The Steam & Condensate Balance",
                summary:
                  "Enthalpy in, enthalpy out — tracking sensible and latent heat through generation, distribution and return.",
                minutes: 10,
              },
              {
                slug: "hvac-energy-balance",
                title: "Worked Example: The HVAC Sensible & Latent Balance",
                summary:
                  "Splitting a cooling load into sensible and latent components, and why over-dehumidifying wastes energy.",
                minutes: 10,
              },
              {
                slug: "energy-balances-check",
                title: "Energy Balances Check",
                summary: "Quiz on boiler, steam and HVAC energy balances.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "applying-balances",
            title: "Visualising, Grading & Applying Balances",
            lessons: [
              {
                slug: "sankey-diagrams",
                title: "Sankey Diagrams: Seeing Where the Energy Goes",
                summary:
                  "Turning a balance into a picture — reading and building a Sankey diagram from your own numbers.",
                minutes: 9,
              },
              {
                slug: "quality-of-energy",
                title: "The Quality of Energy: An Introduction to Exergy",
                summary:
                  "Why a kWh of electricity and a kWh of lukewarm waste heat aren't worth the same — grading energy by its ability to do useful work.",
                minutes: 9,
              },
              {
                slug: "balances-in-the-field",
                title: "Putting It Together: Using Balances to Find Savings",
                summary:
                  "A combined mass-and-energy balance on a real process, and how it becomes the backbone of an energy audit.",
                minutes: 11,
              },
              {
                slug: "practice-check",
                title: "Balances in Practice Check",
                summary: "Quiz on Sankey diagrams, energy quality and applying balances to find savings.",
                minutes: 5,
              },
            ],
          },
        ],
      },
      {
        slug: "electrical-science",
        title: "Electrical Science Refresher",
        summary:
          "Voltage, current, power factor, three-phase basics and the electrical concepts that recur across motors, lighting and metering.",
        status: "available",
        modules: [
          {
            slug: "ac-fundamentals",
            title: "AC Fundamentals",
            lessons: [
              {
                slug: "voltage-current-power",
                title: "Voltage, Current & Power",
                summary: "Ohm's law, relationships between V, I, R, and how power is calculated.",
                minutes: 10,
              },
              {
                slug: "ac-vs-dc",
                title: "AC vs DC",
                summary: "Why buildings use AC, RMS values, and waveforms.",
                minutes: 9,
              },
              {
                slug: "power-factor",
                title: "Power Factor & Reactive Power",
                summary: "Real vs reactive power, why power factor matters, and how to improve it.",
                minutes: 10,
              },
              {
                slug: "ac-check",
                title: "AC Fundamentals Check",
                summary: "Quiz on voltage, current, power, and power factor.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "three-phase",
            title: "Three-Phase Systems",
            lessons: [
              {
                slug: "three-phase-basics",
                title: "Three-Phase Basics",
                summary: "Why three-phase is used, phase angles, and line vs phase voltages.",
                minutes: 10,
              },
              {
                slug: "three-phase-power",
                title: "Power in Three-Phase Systems",
                summary: "How to calculate power, and the advantages over single-phase.",
                minutes: 9,
              },
              {
                slug: "three-phase-check",
                title: "Three-Phase Check",
                summary: "Quiz on three-phase principles and power calculations.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "electrical-energy",
            title: "Electrical Energy Management",
            lessons: [
              {
                slug: "demand-and-power-factor",
                title: "Managing Demand & Power Factor",
                summary: "How utilities charge for demand, and practical steps to reduce it.",
                minutes: 10,
              },
              {
                slug: "metering-and-monitoring",
                title: "Metering & Electrical Monitoring",
                summary: "What energy meters measure, power quality, and harmonic distortion.",
                minutes: 9,
              },
              {
                slug: "electrical-check",
                title: "Electrical Science Check",
                summary: "Quiz on demand management, power factor, and metering concepts.",
                minutes: 5,
              },
            ],
          },
        ],
      },
      {
        slug: "monitoring-and-targeting",
        title: "Monitoring & Targeting (M&T)",
        summary:
          "Turn meter data into action: baselines, energy signatures, regression against drivers, and exception reporting.",
        status: "available",
        modules: [
          {
            slug: "mt-fundamentals",
            title: "M&T Fundamentals",
            lessons: [
              {
                slug: "why-mt",
                title: "Why Monitor & Target?",
                summary: "The discipline of M&T and how it drives continuous energy improvement.",
                minutes: 8,
              },
              {
                slug: "meter-data",
                title: "Collecting Meter Data",
                summary: "What to measure, frequency, accuracy, and data systems.",
                minutes: 9,
              },
              {
                slug: "normalisation",
                title: "Normalisation: Dealing with Weather & Changes",
                summary: "How to account for degree-days and business changes in baseline comparisons.",
                minutes: 10,
              },
              {
                slug: "mt-fundamentals-check",
                title: "M&T Fundamentals Check",
                summary: "Quiz on M&T purpose, data collection, and normalisation.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "baselines-signatures",
            title: "Baselines & Energy Signatures",
            lessons: [
              {
                slug: "establishing-baseline",
                title: "Establishing Your Baseline",
                summary: "What a baseline is and how to set one that's valid and useful.",
                minutes: 10,
              },
              {
                slug: "energy-signatures",
                title: "Energy Signatures & Regression",
                summary: "How energy use varies with external factors; regression analysis to quantify it.",
                minutes: 11,
              },
              {
                slug: "decomposition",
                title: "Decomposing Changes: What Changed & Why",
                summary: "Separating energy savings from changes in weather, production, or occupancy.",
                minutes: 10,
              },
              {
                slug: "baselines-check",
                title: "Baselines & Signatures Check",
                summary: "Quiz on baselines, energy signatures, and change decomposition.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "targeting-reporting",
            title: "Targeting & Reporting",
            lessons: [
              {
                slug: "setting-targets",
                title: "Setting Realistic Targets",
                summary: "How to set energy targets that are ambitious but achievable.",
                minutes: 9,
              },
              {
                slug: "exception-reporting",
                title: "Exception Reporting: Finding the Anomalies",
                summary: "How to spot when consumption is higher than it should be and investigate.",
                minutes: 10,
              },
              {
                slug: "dashboards",
                title: "Dashboards & Communication",
                summary: "How to visualise and communicate energy data to drive action.",
                minutes: 9,
              },
              {
                slug: "targeting-check",
                title: "M&T Check",
                summary: "Quiz on targeting, exception reporting, and effective communication.",
                minutes: 5,
              },
            ],
          },
        ],
      },
      {
        slug: "uk-energy-regulation",
        title: "UK Energy Regulation & Context",
        summary:
          "ESOS, SECR, the Climate Change Levy, EPCs/MEES, carbon budgets and the policy landscape shaping UK energy decisions.",
        status: "available",
        modules: [
          {
            slug: "energy-legislation",
            title: "Energy Legislation & Compliance",
            lessons: [
              {
                slug: "esos",
                title: "ESOS: Mandatory Energy Audits",
                summary: "Who must comply, timing, scope, and what audits must cover.",
                minutes: 10,
              },
              {
                slug: "secr",
                title: "SECR: Streamlined Energy & Carbon Reporting",
                summary: "Who reports, what to report, and how to structure the disclosure.",
                minutes: 9,
              },
              {
                slug: "energy-legislation-check",
                title: "Energy Legislation Check",
                summary: "Quiz on ESOS and SECR requirements and timelines.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "business-energy-costs",
            title: "Business Energy Costs & Taxes",
            lessons: [
              {
                slug: "climate-change-levy",
                title: "The Climate Change Levy (CCL)",
                summary: "How CCL works, exemptions, and the Climate Change Agreement.",
                minutes: 9,
              },
              {
                slug: "business-electricity-relief",
                title: "Business Electricity Relief",
                summary: "CRC Energy Efficiency Scheme history and current business electricity relief.",
                minutes: 8,
              },
              {
                slug: "supplier-obligations",
                title: "Supplier Obligations (EERS / ECO)",
                summary: "What energy suppliers must do; the Energy Company Obligation.",
                minutes: 8,
              },
              {
                slug: "costs-check",
                title: "Energy Costs Check",
                summary: "Quiz on CCL, reliefs, and supplier obligations.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "net-zero-policy",
            title: "UK Policy & Net Zero",
            lessons: [
              {
                slug: "carbon-budgets",
                title: "Carbon Budgets & Targets",
                summary: "The UK's carbon budgets, sectoral targets, and the path to net zero.",
                minutes: 9,
              },
              {
                slug: "epc-and-building-standards",
                title: "EPCs, Building Standards & MEES",
                summary: "Energy Performance Certificates, building regs, and Minimum Energy Efficiency Standards.",
                minutes: 10,
              },
              {
                slug: "future-policy",
                title: "Emerging Policy & Future Trends",
                summary: "Heat pump mandates, methane regulations, and decarbonisation roadmaps.",
                minutes: 9,
              },
              {
                slug: "policy-check",
                title: "UK Policy Check",
                summary: "Quiz on carbon budgets, building standards, and decarbonisation policy.",
                minutes: 5,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "level-2",
    number: 2,
    title: "System Deep Dives",
    tagline: "Technical mastery, system by system",
    description:
      "Roll up your sleeves. Each course takes a major energy-using system — boilers, HVAC, motors, compressed air and more — and teaches how it works, where it wastes energy, and how to fix it.",
    accent: accents[2],
    courses: [
      {
        slug: "energy-audits",
        title: "Energy Audits",
        summary:
          "Plan and deliver a credible audit: walk-throughs, measurement, data analysis, and a prioritised register of opportunities.",
        status: "available",
        modules: [
          {
            slug: "audit-planning",
            title: "Planning & Scoping an Audit",
            lessons: [
              {
                slug: "why-audit",
                title: "Why Audit? The Value Proposition",
                summary: "What an audit is, who needs one, and the business case.",
                minutes: 8,
              },
              {
                slug: "audit-scope-protocol",
                title: "Defining Scope & Following a Protocol",
                summary: "Levels of audit (walk-through, detailed, investment-grade), standards and scope.",
                minutes: 9,
              },
              {
                slug: "audit-planning-check",
                title: "Audit Planning Check",
                summary: "Quiz on audit value, scope, and protocols.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "on-site-work",
            title: "On-Site Data Collection",
            lessons: [
              {
                slug: "building-walkthrough",
                title: "Building Walk-Through & Visual Inspection",
                summary: "What to look for: age, condition, envelope, systems, controls, maintenance.",
                minutes: 10,
              },
              {
                slug: "measurement-and-logging",
                title: "Measurement & Data Logging",
                summary: "What to measure, instruments, accuracy, and frequency.",
                minutes: 9,
              },
              {
                slug: "interview-stakeholders",
                title: "Interviewing Stakeholders",
                summary: "Understanding usage patterns, past issues, maintenance history, and energy consciousness.",
                minutes: 8,
              },
              {
                slug: "on-site-check",
                title: "On-Site Work Check",
                summary: "Quiz on walk-throughs, measurement protocols, and stakeholder engagement.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "analysis-reporting",
            title: "Analysis & Reporting",
            lessons: [
              {
                slug: "normalise-baseline",
                title: "Normalise Data & Establish Baseline",
                summary: "Processing raw data, handling weather/occupancy variations, and baseline calculation.",
                minutes: 10,
              },
              {
                slug: "identify-opportunities",
                title: "Identifying & Quantifying Opportunities",
                summary: "Analysing inefficiencies, estimating savings, and ranking by cost-effectiveness.",
                minutes: 11,
              },
              {
                slug: "audit-report",
                title: "Writing the Audit Report",
                summary: "Executive summary, findings, recommendations, financial analysis, and presentation to client.",
                minutes: 9,
              },
              {
                slug: "analysis-check",
                title: "Audit Analysis Check",
                summary: "Quiz on data normalisation, opportunity identification, and reporting.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "field-audit-capstone",
                title: "Capstone: Audit Frostfield Foods",
                summary:
                  "Take one client through the whole audit lifecycle — plan, on-site, normalise & baseline, quantify opportunities, report — and get scored on every competency.",
                minutes: 35,
              },
            ],
          },
        ],
      },
      {
        slug: "economic-analysis",
        title: "Economic Analysis of Engineering Projects",
        summary:
          "Beyond payback: time value of money, NPV, IRR, life-cycle costing and how to compare competing projects fairly.",
        status: "available",
        modules: [
          {
            slug: "payback-and-time-value",
            title: "Payback & Time Value of Money",
            lessons: [
              {
                slug: "simple-payback-revisited",
                title: "Simple Payback: Uses and Limits",
                summary: "When simple payback works, when it misleads, and why time value matters.",
                minutes: 10,
              },
              {
                slug: "time-value-of-money",
                title: "Time Value of Money & Discounting",
                summary: "Money today is worth more than money tomorrow: discount rates and present value.",
                minutes: 11,
              },
              {
                slug: "npv-and-irr",
                title: "NPV and IRR: Rigorous Project Evaluation",
                summary: "Net present value and internal rate of return — what they mean and when to use each.",
                minutes: 10,
              },
              {
                slug: "payback-check",
                title: "Payback & Time Value Check",
                summary: "Quiz on payback, NPV, IRR, and discount rates.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "lifecycle-costing",
            title: "Life-Cycle Costing & Total Cost of Ownership",
            lessons: [
              {
                slug: "total-cost-of-ownership",
                title: "Total Cost of Ownership",
                summary: "Capital cost is just the start: operating cost, maintenance, replacement, and residual value.",
                minutes: 10,
              },
              {
                slug: "lifecycle-examples",
                title: "Life-Cycle Cost Examples",
                summary: "LED vs halogen, variable-speed vs fixed pump, condensing vs conventional boiler.",
                minutes: 11,
              },
              {
                slug: "lifecycle-check",
                title: "Life-Cycle Costing Check",
                summary: "Quiz on total cost of ownership, operating life, and residual value.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "comparing-projects",
            title: "Comparing & Prioritising Projects",
            lessons: [
              {
                slug: "portfolio-approach",
                title: "Portfolio Approach: Not All Projects Are Equal",
                summary: "Risk, certainty, co-benefits, and strategic fit — beyond just financial metrics.",
                minutes: 10,
              },
              {
                slug: "financing-options",
                title: "Financing Options & Impact on Decision",
                summary: "Cash purchase vs loan vs lease vs performance contract — how to compare.",
                minutes: 10,
              },
              {
                slug: "economic-check",
                title: "Economic Analysis Check",
                summary: "Quiz on project prioritisation, portfolio approach, and financing.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "economic-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "diagnostics-capstone",
                title: "Capstone: Economic Analysis Diagnostics",
                summary:
                  "Hands-on: appraise eight projects — payback screening, time value, NPV, IRR, NPV-vs-IRR, whole-life cost, financing and portfolio risk — then calculate, verify and make the call.",
                minutes: 30,
              },
            ],
          },
        ],
      },
      {
        slug: "boilers-and-fired-systems",
        title: "Boilers & Fired Systems",
        summary:
          "Combustion, excess air, flue-gas losses, blowdown and the practical levers for boiler-plant efficiency.",
        status: "available",
        modules: [
          {
            slug: "combustion-fundamentals",
            title: "Combustion Fundamentals",
            lessons: [
              {
                slug: "combustion-process",
                title: "The Combustion Process",
                summary: "Fuel, air, and ignition — stoichiometric and excess air.",
                minutes: 10,
              },
              {
                slug: "combustion-efficiency",
                title: "Combustion Efficiency",
                summary: "Complete vs incomplete combustion, and measuring flue-gas losses.",
                minutes: 10,
              },
              {
                slug: "boiler-types",
                title: "Boiler Types & Design",
                summary: "Firetube, watertube, and condensing boilers — efficiency implications.",
                minutes: 9,
              },
            ],
          },
          {
            slug: "operation-optimization",
            title: "Operation & Optimization",
            lessons: [
              {
                slug: "excess-air",
                title: "Managing Excess Air",
                summary: "The balance between combustion completeness and flue losses.",
                minutes: 9,
              },
              {
                slug: "blowdown",
                title: "Boiler Blowdown & Water Treatment",
                summary: "Why blowdown happens, its energy cost, and how to minimise it.",
                minutes: 9,
              },
              {
                slug: "controls-setpoints",
                title: "Controls, Setpoints & Sequencing",
                summary: "Weather compensation, load matching, and multi-boiler logic.",
                minutes: 9,
              },
            ],
          },
          {
            slug: "assessment-retrofit",
            title: "Assessment & Retrofit",
            lessons: [
              {
                slug: "boiler-assessment",
                title: "Assessing a Boiler Plant",
                summary: "Age, efficiency, turndown, and fit to actual load.",
                minutes: 10,
              },
              {
                slug: "retrofit-options",
                title: "Retrofit & Replacement Options",
                summary: "Burner upgrades, condensing conversions, and replacement decisions.",
                minutes: 9,
              },
              {
                slug: "optimization-capstone",
                title: "Capstone: Boiler Optimization Simulator",
                summary:
                  "Hands-on: tune a live industrial steam boiler, read the flue gas, and decide when to invest or replace.",
                minutes: 20,
              },
              {
                slug: "boilers-check",
                title: "Boilers & Fired Systems Check",
                summary: "Quiz on combustion, efficiency, and practical optimization.",
                minutes: 7,
              },
            ],
          },
        ],
      },
      {
        slug: "steam-and-condensate",
        title: "Steam & Condensate Systems",
        summary:
          "Steam traps, flash steam, insulation, condensate return and distribution losses across a steam system.",
        status: "available",
        modules: [
          {
            slug: "steam-generation",
            title: "Steam Generation & Distribution",
            lessons: [
              {
                slug: "steam-basics",
                title: "Steam Properties & Generation",
                summary: "Latent heat, saturated vs superheated steam, and steam table basics.",
                minutes: 10,
              },
              {
                slug: "steam-distribution",
                title: "Steam Distribution & Insulation",
                summary: "Pipe sizing, heat losses, insulation thickness, and economical design.",
                minutes: 10,
              },
              {
                slug: "steam-pressure",
                title: "Operating Pressure & Losses",
                summary: "Flash steam at pressure reduction, quality loss, and optimising operating point.",
                minutes: 9,
              },
              {
                slug: "generation-check",
                title: "Steam Generation Check",
                summary: "Quiz on steam properties, distribution, and losses.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "steam-traps",
            title: "Steam Traps & Condensate Recovery",
            lessons: [
              {
                slug: "trap-types",
                title: "Steam Trap Types & Function",
                summary: "Thermostatic, float, inverted bucket, and bimetallic traps — how each works.",
                minutes: 10,
              },
              {
                slug: "trap-failure",
                title: "Trap Failure & Maintenance",
                summary: "Failure modes, detection methods, economic life, and when to replace.",
                minutes: 9,
              },
              {
                slug: "condensate-return",
                title: "Condensate Return & Flash Recovery",
                summary: "Recovering hot water, flash steam, and flash tanks.",
                minutes: 9,
              },
              {
                slug: "traps-check",
                title: "Traps & Condensate Check",
                summary: "Quiz on trap types, failure, and condensate recovery.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "system-optimization",
            title: "System Optimization & Economics",
            lessons: [
              {
                slug: "efficiency-assessment",
                title: "Assessing Steam System Efficiency",
                summary: "Measuring steam quality, trap performance, and distribution losses.",
                minutes: 10,
              },
              {
                slug: "savings-projects",
                title: "Identifying & Quantifying Savings",
                summary: "Trap replacement, insulation, condensate recovery, and pressure optimisation.",
                minutes: 10,
              },
              {
                slug: "diagnostics-capstone",
                title: "Capstone: Steam System Diagnostics",
                summary:
                  "Hands-on: work out condensate return, flash, trap loss and more from raw readings, then diagnose and fix eight real call-outs.",
                minutes: 25,
              },
              {
                slug: "steam-check",
                title: "Steam Systems Check",
                summary: "Quiz on steam system assessment and optimization opportunities.",
                minutes: 5,
              },
            ],
          },
        ],
      },
      {
        slug: "chp-and-cogeneration",
        title: "CHP & Cogeneration",
        summary: "When combined heat and power makes sense, sizing to heat demand, and assessing economic and carbon performance.",
        status: "available",
        modules: [
          {
            slug: "chp-fundamentals",
            title: "CHP Fundamentals",
            lessons: [
              { slug: "how-chp-works", title: "How CHP Works", summary: "Engine/turbine + generator produce electricity; waste heat recovered for heating/DHW.", minutes: 11 },
              { slug: "chp-technologies", title: "CHP Technologies (Gas, Biomass)", summary: "Reciprocating engines, microturbines, Stirling engines; pros and cons; typical sizes.", minutes: 10 },
              { slug: "efficiency-metrics", title: "Efficiency Metrics & Losses", summary: "Electrical efficiency, heat recovery efficiency, overall efficiency, stack losses.", minutes: 10 },
              { slug: "fundamentals-check", title: "CHP Fundamentals Check", summary: "Quiz on CHP operation, technologies, and efficiency.", minutes: 5 },
            ],
          },
          {
            slug: "chp-sizing",
            title: "Sizing & Integration",
            lessons: [
              { slug: "heat-demand", title: "Sizing to Heat Demand (Not Electricity)", summary: "CHP should be sized to annual heat demand curve; oversizing = wasted electricity export.", minutes: 10 },
              { slug: "load-profile", title: "Load Profile Analysis", summary: "Thermal and electrical demand matching; seasonal variation; identifying steady base load.", minutes: 10 },
              { slug: "system-integration", title: "CHP Integration with Boiler/Chiller", summary: "Hybrid operation: CHP for baseload heat, boiler backup for peaks; sequencing controls.", minutes: 10 },
              { slug: "integration-check", title: "Sizing & Integration Check", summary: "Quiz on heat-demand sizing and system integration.", minutes: 5 },
            ],
          },
          {
            slug: "chp-economics",
            title: "Economics & Carbon Assessment",
            lessons: [
              { slug: "cost-benefit", title: "Cost-Benefit Analysis", summary: "Capital cost, fuel cost, electricity export revenue (or avoided grid purchase); 10-year payback.", minutes: 10 },
              { slug: "grid-export", title: "Grid Connection & Export Revenue", summary: "Metering, export tariffs (export price vs avoided import cost), DNO approval.", minutes: 10 },
              { slug: "carbon-assessment", title: "Carbon Payback & Lifecycle", summary: "Manufacturing carbon, fuel carbon, electricity displacement; payback period.", minutes: 10 },
              { slug: "economics-check", title: "Economics & Carbon Check", summary: "Quiz on CHP payback, export economics, and carbon assessment.", minutes: 5 },
            ],
          },
          {
            slug: "chp-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "diagnostics-capstone",
                title: "Capstone: CHP Diagnostics",
                summary:
                  "Hands-on: diagnose eight CHP call-outs — dumped heat, spark spread, low-value export, fouled heat exchangers, short-cycling and the carbon case — then calculate, verify and prescribe the fix.",
                minutes: 30,
              },
            ],
          },
        ],
      },
      {
        slug: "waste-heat-recovery",
        title: "Waste Heat Recovery",
        summary:
          "Find, grade and reuse waste heat — economisers, recuperators, heat exchangers and heat pumps.",
        status: "available",
        modules: [
          {
            slug: "heat-recovery-fundamentals",
            title: "Heat Recovery Fundamentals",
            lessons: [
              {
                slug: "sources-and-grades",
                title: "Heat Sources & Grades of Waste Heat",
                summary: "Where waste heat comes from (boiler flue, chiller condenser, process), and how to grade it.",
                minutes: 10,
              },
              {
                slug: "heat-recovery-overview",
                title: "Heat Recovery Overview & Value",
                summary: "Why recover waste heat, payback timescales, and business case.",
                minutes: 9,
              },
              {
                slug: "economics-and-matching",
                title: "Matching Supply to Demand & Economics",
                summary: "When recovery works: sink availability, temperature match, load profiles, payback.",
                minutes: 10,
              },
              {
                slug: "fundamentals-check",
                title: "Heat Recovery Fundamentals Check",
                summary: "Quiz on heat sources, grading, value, and matching.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "heat-recovery-technologies",
            title: "Heat Recovery Technologies",
            lessons: [
              {
                slug: "heat-exchangers",
                title: "Heat Exchangers & Effectiveness",
                summary: "Plate, shell-and-tube, brazed-plate types; effectiveness, fouling, approach temperature.",
                minutes: 11,
              },
              {
                slug: "air-to-air-recovery",
                title: "Air-to-Air Recovery: ERV & HRV",
                summary: "Enthalpy recovery ventilation, heat recovery ventilation, sensible vs latent, applications.",
                minutes: 10,
              },
              {
                slug: "thermal-storage-recovery",
                title: "Thermal Wheels, Pipes & Flash Tanks",
                summary: "Rotating heat wheels, heat pipes, flash steam recovery from condensate.",
                minutes: 10,
              },
              {
                slug: "technologies-check",
                title: "Heat Recovery Technologies Check",
                summary: "Quiz on exchangers, air-to-air, and thermal recovery devices.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "applications-optimization",
            title: "Applications & Optimization",
            lessons: [
              {
                slug: "boiler-flue-recovery",
                title: "Flue Gas Recovery (Condensing Boilers)",
                summary: "Recovering latent heat from flue gas, condensing boilers, and economics.",
                minutes: 10,
              },
              {
                slug: "chiller-condenser-recovery",
                title: "Chiller Condenser Heat Recovery",
                summary: "Using condenser heat for space heating or domestic hot water.",
                minutes: 10,
              },
              {
                slug: "process-heat-recovery",
                title: "Process & Industrial Heat Recovery",
                summary: "Recovering waste heat from industrial processes, equipment placement, retrofits.",
                minutes: 10,
              },
              {
                slug: "optimization-check",
                title: "Applications & Optimization Check",
                summary: "Quiz on boiler flue, chiller condenser, and process heat recovery.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "whr-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "diagnostics-capstone",
                title: "Capstone: Waste Heat Recovery Diagnostics",
                summary:
                  "Hands-on: diagnose eight waste-heat call-outs — flue economiser, condenser recovery, air-to-air, fouled exchanger, flash steam, timing and temperature mismatches — then calculate, verify and prescribe the fix.",
                minutes: 30,
              },
            ],
          },
        ],
      },
      {
        slug: "pinch-analysis",
        title: "Pinch Analysis & Process Integration",
        summary:
          "Optimise heat exchange across a whole process at once: composite curves, the pinch point, minimum utility targets, network design and the economics of the approach temperature.",
        status: "available",
        modules: [
          {
            slug: "pinch-fundamentals",
            title: "Pinch Analysis Fundamentals",
            lessons: [
              {
                slug: "why-optimise-the-whole-process",
                title: "Why Optimise Heat Exchange Across a Whole Process?",
                summary:
                  "From matching one waste-heat source to one load, to matching every hot and cold stream on a site simultaneously — and finding the truly minimum energy bill.",
                minutes: 9,
              },
              {
                slug: "streams-and-approach-temperature",
                title: "Hot & Cold Streams and the Minimum Approach Temperature",
                summary:
                  "Classifying every stream on a site as hot or cold, and the ΔTmin concept that governs how close they can approach each other.",
                minutes: 10,
              },
              {
                slug: "building-composite-curves",
                title: "Building Composite Curves",
                summary:
                  "Combining many streams into one hot curve and one cold curve — the graphical heart of pinch analysis.",
                minutes: 11,
              },
              {
                slug: "fundamentals-check",
                title: "Pinch Fundamentals Check",
                summary: "Quiz on streams, approach temperature and composite curves.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "finding-the-pinch",
            title: "Finding the Pinch — Targeting Minimum Utilities",
            lessons: [
              {
                slug: "problem-table-algorithm",
                title: "The Problem Table Algorithm",
                summary:
                  "The temperature-interval cascade that finds the pinch and the minimum hot and cold utility requirements by arithmetic alone.",
                minutes: 12,
              },
              {
                slug: "reading-the-pinch",
                title: "Reading the Pinch: Composite Curves & Overlap",
                summary:
                  "Interpreting the graphical picture — where the curves come closest, and why that point sets the whole process's minimum energy target.",
                minutes: 9,
              },
              {
                slug: "the-golden-rules",
                title: "The Golden Rules: Don't Cross the Pinch",
                summary:
                  "The three rules that keep a design at its true minimum utility — and the energy penalty of breaking each one.",
                minutes: 10,
              },
              {
                slug: "targeting-check",
                title: "Targeting Check",
                summary: "Quiz on the problem table algorithm, the pinch point and the golden rules.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "network-design",
            title: "Designing the Heat Exchanger Network",
            lessons: [
              {
                slug: "matching-at-the-pinch",
                title: "Matching Streams at the Pinch",
                summary:
                  "The feasibility rule that decides which streams can be matched right at the pinch, and a fully worked network.",
                minutes: 11,
              },
              {
                slug: "tick-off-and-splitting",
                title: "The Tick-Off Heuristic & Stream Splitting",
                summary:
                  "Building a workable network match by match, and when a stream must be split to keep every match feasible.",
                minutes: 10,
              },
              {
                slug: "minimum-number-of-units",
                title: "Minimum Number of Units & Network Simplification",
                summary:
                  "Targeting the fewest heat exchangers a network needs, and simplifying an over-complicated design by breaking loops.",
                minutes: 10,
              },
              {
                slug: "network-design-check",
                title: "Network Design Check",
                summary: "Quiz on pinch matching, the tick-off heuristic and minimum units.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "economics-and-application",
            title: "Economics & Practical Application",
            lessons: [
              {
                slug: "choosing-delta-t-min",
                title: "Choosing ΔTmin: The Capital-Energy Trade-off",
                summary:
                  "Why the minimum approach temperature is an economic choice, not a fixed constant — balancing utility cost against heat-exchanger capital cost.",
                minutes: 10,
              },
              {
                slug: "threshold-problems",
                title: "Threshold Problems: When There's No Pinch",
                summary:
                  "Processes that only ever need one utility, and why forcing a two-utility design onto them wastes money.",
                minutes: 9,
              },
              {
                slug: "retrofit-pinch-analysis",
                title: "Retrofit Pinch Analysis: Applying It to an Existing Site",
                summary:
                  "Using targets from a pinch study to find the missed heat-recovery opportunities in a plant that already exists.",
                minutes: 10,
              },
              {
                slug: "economics-check",
                title: "Economics & Application Check",
                summary: "Quiz on ΔTmin economics, threshold problems and retrofit application.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "pinch-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "diagnostics-capstone",
                title: "Capstone: Pinch Analysis Diagnostics",
                summary:
                  "Hands-on: diagnose eight process-integration call-outs — cross-pinch heat transfer, infeasible matches, wrong utility placement, threshold problems and over-complicated networks — then calculate, verify and prescribe the fix.",
                minutes: 30,
              },
            ],
          },
        ],
      },
      {
        slug: "buildings-and-envelope",
        title: "Buildings & the Building Envelope",
        summary: "Fabric, air-tightness, thermal bridging and glazing (U-values, g-values, low-E) — controlling loads at source.",
        status: "available",
        modules: [
          {
            slug: "envelope-design",
            title: "Envelope Design & Heat Loss",
            lessons: [
              { slug: "fabric-performance", title: "Fabric Performance & U-Values", summary: "How building elements lose heat; U-value targets for new and retrofit; cost-benefit.", minutes: 11 },
              { slug: "airtightness", title: "Air-Tightness & Infiltration", summary: "Air leakage routes; testing (blower door); infiltration losses; design strategies to minimize.", minutes: 10 },
              { slug: "thermal-bridging", title: "Thermal Bridging in Buildings", summary: "Cold spots at structure, fixtures; impact on temperature, condensation, and overall efficiency.", minutes: 10 },
              { slug: "design-check", title: "Envelope Design Check", summary: "Quiz on fabric, air-tightness, and thermal bridging.", minutes: 5 },
            ],
          },
          {
            slug: "glazing-solar",
            title: "Windows, Glazing & Solar Performance",
            lessons: [
              { slug: "window-types", title: "Window Types & Frame Performance", summary: "Single, double, triple glazing; frame materials (uPVC, aluminium, wood); U-value ranges.", minutes: 10 },
              { slug: "glazing-coatings", title: "Low-E Coatings & Solar Control", summary: "Low-E to reduce radiative heat loss; solar control coatings; seasonal strategy (winter vs summer).", minutes: 10 },
              { slug: "solar-gain", title: "Solar Heat Gain & g-Value", summary: "Solar factor (g-value); east/west/south orientation; shading strategies (blinds, overhangs).", minutes: 10 },
              { slug: "glazing-check", title: "Glazing Check", summary: "Quiz on glazing types, coatings, and solar performance.", minutes: 5 },
            ],
          },
          {
            slug: "retrofit-envelope",
            title: "Retrofit Strategies & Sequencing",
            lessons: [
              { slug: "retrofit-approach", title: "Energy Retrofit Approach", summary: "Insulation first, then systems; payback-driven sequencing; cost-benefit analysis.", minutes: 10 },
              { slug: "insulation-retrofit", title: "Adding Insulation to Existing Buildings", summary: "Internal vs external; solid wall vs cavity; cost and disruption trade-offs.", minutes: 10 },
              { slug: "window-replacement", title: "Window & Door Replacement", summary: "Payback for single to double/triple conversion; cost per m²; bundling with other work.", minutes: 10 },
              { slug: "retrofit-check", title: "Retrofit Strategy Check", summary: "Quiz on retrofit approaches and economics.", minutes: 5 },
            ],
          },
          {
            slug: "envelope-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "diagnostics-capstone",
                title: "Capstone: Building Envelope Diagnostics",
                summary:
                  "Hands-on: diagnose eight envelope call-outs — loft and cavity insulation, air leakage, thermal bridging, solid walls, glazing, solar gain and over-sealing — then calculate, verify and prescribe the fix.",
                minutes: 30,
              },
            ],
          },
        ],
      },
      {
        slug: "hvac-systems",
        title: "HVAC Systems",
        summary:
          "Heating, ventilation and cooling: system types, controls, setpoints, free cooling and demand-based operation.",
        status: "available",
        modules: [
          {
            slug: "hvac-fundamentals",
            title: "HVAC Fundamentals",
            lessons: [
              {
                slug: "comfort-criteria",
                title: "Comfort Criteria & Psychrometrics",
                summary: "Temperature, humidity, air movement, and the comfort envelope.",
                minutes: 10,
              },
              {
                slug: "system-types",
                title: "System Types & Configurations",
                summary: "All-air, air-water, heat pump, and multi-zone systems.",
                minutes: 10,
              },
              {
                slug: "hvac-components",
                title: "Key Components & Operation",
                summary: "Fans, coils, dampers, valves, and controls — how they work together.",
                minutes: 10,
              },
            ],
          },
          {
            slug: "heating-cooling",
            title: "Heating & Cooling Loads",
            lessons: [
              {
                slug: "sensible-latent",
                title: "Sensible vs Latent Loads",
                summary: "Heating/cooling the air vs dehumidifying.",
                minutes: 9,
              },
              {
                slug: "thermal-loads",
                title: "Sources of Thermal Load",
                summary: "Envelope, occupancy, equipment, solar gain, and ventilation.",
                minutes: 10,
              },
              {
                slug: "free-cooling",
                title: "Free Cooling & Heat Recovery",
                summary: "Economisers, heat recovery ventilation, and thermal wheels.",
                minutes: 10,
              },
            ],
          },
          {
            slug: "controls-operation",
            title: "Controls & Operational Strategy",
            lessons: [
              {
                slug: "control-loops",
                title: "Control Loops & Feedback",
                summary: "Temperature, humidity, pressure, and sequence control.",
                minutes: 10,
              },
              {
                slug: "setpoints-scheduling",
                title: "Setpoints, Scheduling & Occupancy",
                summary: "Reset strategies, occupancy-based control, and night setback.",
                minutes: 9,
              },
              {
                slug: "vav-controls",
                title: "VAV Box Control & Duct Static Pressure",
                summary: "How VAV systems modulate to meet zone demands.",
                minutes: 9,
              },
            ],
          },
          {
            slug: "assessment-optimization",
            title: "Assessment & Optimization",
            lessons: [
              {
                slug: "hvac-audit",
                title: "HVAC Auditing & Commissioning",
                summary: "Measuring performance, identifying drift, and balancing.",
                minutes: 10,
              },
              {
                slug: "common-issues",
                title: "Common Faults & Failures",
                summary: "Stuck dampers, failed sensors, thermostat drift, and control errors.",
                minutes: 9,
              },
              {
                slug: "diagnostics-capstone",
                title: "Capstone: HVAC Diagnostics & Optimisation",
                summary:
                  "Hands-on: quantify the waste (fan/pump affinity, COP, free cooling, ventilation) then diagnose and fix eight real HVAC call-outs.",
                minutes: 25,
              },
              {
                slug: "hvac-check",
                title: "HVAC Systems Check",
                summary: "Quiz on loads, controls, free cooling, and optimization.",
                minutes: 7,
              },
            ],
          },
        ],
      },
      {
        slug: "insulation-systems",
        title: "Insulation Systems",
        summary: "Heat-loss calculation, economic thickness, lagging of pipework and vessels, and surface-temperature safety.",
        status: "available",
        modules: [
          {
            slug: "insulation-fundamentals",
            title: "Insulation Fundamentals",
            lessons: [
              { slug: "heat-loss-calculation", title: "Heat Loss Calculation & U-Values", summary: "How heat flows, U-value definition, calculating losses through walls, roofs, windows.", minutes: 11 },
              { slug: "insulation-materials", title: "Insulation Materials & Properties", summary: "Conductivity (W/mK), R-value, density, moisture resistance, fire rating.", minutes: 10 },
              { slug: "economic-thickness", title: "Economic Thickness & Payback", summary: "Optimal thickness balances cost and energy savings; typical payback 3-7 years.", minutes: 10 },
              { slug: "fundamentals-check", title: "Insulation Fundamentals Check", summary: "Quiz on heat loss, U-values, materials, and economic thickness.", minutes: 5 },
            ],
          },
          {
            slug: "building-envelope",
            title: "Building Envelope & Thermal Bridging",
            lessons: [
              { slug: "walls-roofs-floors", title: "Walls, Roofs, Floors & Layering", summary: "Multi-layer construction, vapour barriers, condensation risk, detail design.", minutes: 10 },
              { slug: "thermal-bridges", title: "Thermal Bridges & Heat Loss", summary: "Cold bridges at joints, studs, fasteners; how to minimize; impact on overall U-value.", minutes: 10 },
              { slug: "windows-glazing", title: "Windows & Glazing", summary: "Double/triple glazing, low-E coatings, frame U-values, solar heat gain (g-value).", minutes: 10 },
              { slug: "envelope-check", title: "Envelope & Bridges Check", summary: "Quiz on building envelope design and thermal bridging.", minutes: 5 },
            ],
          },
          {
            slug: "pipe-and-equipment",
            title: "Pipe Insulation & Equipment Lagging",
            lessons: [
              { slug: "pipe-sizing", title: "Pipe Insulation: Thickness & Material", summary: "Pipe diameter, temperature, ambient, and economic insulation thickness.", minutes: 10 },
              { slug: "pipe-installation", title: "Installation & Maintenance", summary: "Fitting insulation at bends, joints, valves; protection from moisture and damage.", minutes: 9 },
              { slug: "vessel-lagging", title: "Tank & Vessel Lagging", summary: "Boiler, chiller, thermal storage tanks; lagging thickness, access doors, heat loss calculation.", minutes: 10 },
              { slug: "safety-surface-temp", title: "Surface Temperature Safety", summary: "Maximum safe touch temperature (60°C), insulation to meet regulations, guarding.", minutes: 8 },
              { slug: "lagging-check", title: "Pipe & Lagging Check", summary: "Quiz on pipe sizing, vessel lagging, and safety.", minutes: 5 },
            ],
          },
          {
            slug: "insulation-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "diagnostics-capstone",
                title: "Capstone: Insulation Diagnostics",
                summary:
                  "Hands-on: diagnose eight insulation call-outs — bare pipes and valves, an unlagged vessel, economic thickness, a sweating cold pipe, material choice, surface safety and lagging removed in maintenance — then calculate, verify and prescribe the fix.",
                minutes: 30,
              },
            ],
          },
        ],
      },
      {
        slug: "motors-and-drives",
        title: "Motors, Drives & Electrical Energy Management",
        summary:
          "Motor efficiency classes, variable-speed drives, sizing, power factor and managing electrical demand.",
        status: "available",
        modules: [
          {
            slug: "motor-fundamentals",
            title: "Motor Fundamentals & Efficiency",
            lessons: [
              {
                slug: "motor-basics",
                title: "Motor Basics & Specifications",
                summary: "How motors work, key parameters (kW, kV, rpm, power factor), and what the nameplate means.",
                minutes: 10,
              },
              {
                slug: "efficiency-classes",
                title: "Efficiency Classes & Losses",
                summary: "IE1/IE2/IE3/IE4 standards, where energy is lost (friction, heat, slip), and payback for upgrades.",
                minutes: 10,
              },
              {
                slug: "motor-selection",
                title: "Selecting the Right Motor Size",
                summary: "Oversizing is common and wastes energy; matching load to motor rating.",
                minutes: 9,
              },
              {
                slug: "motor-check",
                title: "Motor Fundamentals Check",
                summary: "Quiz on motor basics, efficiency classes, and selection.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "variable-speed-drives",
            title: "Variable-Speed Drives & Control",
            lessons: [
              {
                slug: "why-vfds",
                title: "Why Variable-Speed Drives (VFDs)?",
                summary: "How VFDs reduce energy by matching load to speed (not just on/off or dampers).",
                minutes: 10,
              },
              {
                slug: "vfd-applications",
                title: "VFD Applications & Savings",
                summary: "Pumps, fans, compressors: where VFDs save the most, and typical payback.",
                minutes: 10,
              },
              {
                slug: "vfd-installation",
                title: "VFD Installation & Considerations",
                summary: "Electrical requirements, harmonic filtering, thermal effects, and cost.",
                minutes: 9,
              },
              {
                slug: "vfd-check",
                title: "VFD Check",
                summary: "Quiz on VFDs, applications, and installation considerations.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "electrical-management",
            title: "Electrical Energy Management",
            lessons: [
              {
                slug: "power-factor-management",
                title: "Power Factor Management",
                summary: "Why poor power factor costs money, and how to improve it (capacitors, right-sizing).",
                minutes: 10,
              },
              {
                slug: "demand-management",
                title: "Managing Electrical Demand & Peaks",
                summary: "Demand charges, load shifting, soft starters, and reducing peak draw.",
                minutes: 10,
              },
              {
                slug: "system-optimization",
                title: "System-Wide Motor Optimization",
                summary: "Oversized systems, poor load matching, and practical retrofit strategies.",
                minutes: 9,
              },
              {
                slug: "diagnostics-capstone",
                title: "Capstone: Motors & Drives Diagnostics",
                summary:
                  "Hands-on: work out load factor, affinity-law savings, power factor and payback, then diagnose and decide on eight real motor call-outs.",
                minutes: 25,
              },
              {
                slug: "electrical-check",
                title: "Electrical Management Check",
                summary: "Quiz on power factor, demand management, and system optimization.",
                minutes: 5,
              },
            ],
          },
        ],
      },
      {
        slug: "compressed-air",
        title: "Compressed Air Systems",
        summary: "The most expensive utility on site: leaks, pressure, control strategy, heat recovery and right-sizing.",
        status: "available",
        modules: [
          {
            slug: "compression-fundamentals",
            title: "Air Compression Fundamentals",
            lessons: [
              { slug: "why-expensive", title: "Why Compressed Air is Expensive", summary: "Energy cost of compression, inefficiencies, why it's often overlooked.", minutes: 9 },
              { slug: "compressor-types", title: "Compressor Types & Efficiency", summary: "Reciprocating, screw, rotary vane; energy efficiency and performance.", minutes: 10 },
              { slug: "pressure-flow", title: "Pressure, Flow & Energy Loss", summary: "Bar, CFM, power; how pressure drop wastes energy.", minutes: 10 },
              { slug: "fundamentals-check", title: "Compression Fundamentals Check", summary: "Quiz on compression types, pressure, and efficiency.", minutes: 5 },
            ],
          },
          {
            slug: "system-design",
            title: "System Design & Optimization",
            lessons: [
              { slug: "pipe-sizing", title: "Piping, Drying & Air Quality", summary: "Pipe diameter, drying (refrigerant vs desiccant), filtration, moisture removal.", minutes: 10 },
              { slug: "leaks-detection", title: "Leak Detection & Sealing", summary: "How leaks waste energy, ultrasonic detection, ROI of leak repair.", minutes: 10 },
              { slug: "pressure-regulation", title: "Pressure Regulation & Control", summary: "System pressure, modulation, load-unload control, variable-displacement compressors.", minutes: 10 },
              { slug: "design-check", title: "System Design Check", summary: "Quiz on piping, drying, leaks, and pressure regulation.", minutes: 5 },
            ],
          },
          {
            slug: "maintenance-recovery",
            title: "Maintenance & Heat Recovery",
            lessons: [
              { slug: "maintenance", title: "Maintenance & Efficiency Retention", summary: "Filter replacement, oil analysis, bearing care, preventive maintenance.", minutes: 9 },
              { slug: "heat-recovery", title: "Waste Heat Recovery from Compressed Air", summary: "Compressor discharge is 80–100°C; recovery for DHW or space heating.", minutes: 10 },
              { slug: "improvement-projects", title: "Common Improvement Projects", summary: "Speed controllers (VFD), variable-displacement compressors, audits.", minutes: 9 },
              { slug: "diagnostics-capstone", title: "Capstone: Compressed Air Diagnostics", summary: "Hands-on: quantify leaks, idling, pressure and heat-recovery savings, then diagnose and fix eight real compressed-air call-outs.", minutes: 25 },
              { slug: "maintenance-check", title: "Maintenance & Recovery Check", summary: "Quiz on maintenance, heat recovery, and improvement projects.", minutes: 5 },
            ],
          },
        ],
      },
      {
        slug: "lighting",
        title: "Lighting",
        summary: "Lux levels, LED retrofits, controls, daylighting and lighting design for energy and comfort.",
        status: "available",
        modules: [
          {
            slug: "lighting-fundamentals",
            title: "Lighting Fundamentals",
            lessons: [
              { slug: "lux-and-efficacy", title: "Lux, Lumens & Colour Temperature", summary: "Light levels, efficacy (lm/W), colour temp (K), and visual comfort.", minutes: 10 },
              { slug: "lamp-types", title: "Lamp Types: Incandescent, Fluorescent, LED", summary: "Lifespan, efficacy, cost, colour rendering; why LEDs dominate.", minutes: 10 },
              { slug: "ballasts-drivers", title: "Ballasts, Drivers & Circuit Design", summary: "How lamps are powered; ballast losses and LED driver efficiency.", minutes: 9 },
              { slug: "fundamentals-check", title: "Lighting Fundamentals Check", summary: "Quiz on lux, lamp types, and efficacy.", minutes: 5 },
            ],
          },
          {
            slug: "controls-daylight",
            title: "Controls & Daylighting",
            lessons: [
              { slug: "occupancy-sensors", title: "Occupancy Sensors & Motion Control", summary: "PIR, microwave sensors; false-off delays and energy savings.", minutes: 9 },
              { slug: "daylight-harvesting", title: "Daylight Harvesting & Dimming", summary: "Using natural light, photosensors, dimming ballasts, glare control.", minutes: 10 },
              { slug: "time-scheduling", title: "Time Scheduling & Integration with BMS", summary: "Scheduled on/off, seasonal adjustment, linking to occupancy sensors.", minutes: 9 },
              { slug: "controls-check", title: "Controls & Daylight Check", summary: "Quiz on occupancy sensors, daylight harvesting, and scheduling.", minutes: 5 },
            ],
          },
          {
            slug: "retrofit-design",
            title: "LED Retrofit & Design",
            lessons: [
              { slug: "led-retrofit", title: "LED Retrofit Strategy & Payback", summary: "Replacing fluorescent/halogen with LED; typical payback, quality concerns.", minutes: 10 },
              { slug: "design-integration", title: "Lighting Design for Energy & Comfort", summary: "Task lighting, avoiding over-illumination, visual comfort, glare.", minutes: 10 },
              { slug: "measurements", title: "Measuring Lighting Performance", summary: "Lux meter use, power draw verification, energy auditing.", minutes: 9 },
              { slug: "retrofit-check", title: "Retrofit & Design Check", summary: "Quiz on LED retrofits, design principles, and performance measurement.", minutes: 5 },
            ],
          },
          {
            slug: "lighting-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "diagnostics-capstone",
                title: "Capstone: Lighting Diagnostics",
                summary:
                  "Hands-on: diagnose eight lighting call-outs — over-lighting, LED retrofit, scheduling, occupancy, daylight, ballast losses, commissioning and cheap-LED failure — then calculate, verify and prescribe the fix.",
                minutes: 30,
              },
            ],
          },
        ],
      },
      {
        slug: "thermal-energy-storage",
        title: "Thermal Energy Storage",
        summary: "Shifting heating and cooling loads in time — sensible, latent and the economics of storage.",
        status: "available",
        modules: [
          {
            slug: "storage-fundamentals",
            title: "Storage Fundamentals",
            lessons: [
              { slug: "sensible-latent", title: "Sensible & Latent Thermal Storage", summary: "Heating/cooling water vs phase-change materials; capacity and density.", minutes: 10 },
              { slug: "load-shifting", title: "Load Shifting & Peak Reduction", summary: "Storing heat off-peak (cheap rate) for peak use; demand management.", minutes: 10 },
              { slug: "seasonal-storage", summary: "Storing summer heat for winter use (seasonal storage); long-term strategies.", title: "Seasonal Storage", minutes: 10 },
              { slug: "fundamentals-check", title: "Storage Fundamentals Check", summary: "Quiz on sensible/latent storage, load shifting, and seasonal strategies.", minutes: 5 },
            ],
          },
          {
            slug: "storage-technologies",
            title: "Storage Technologies & Systems",
            lessons: [
              { slug: "water-tanks", title: "Water Tanks (Thermal Mass)", summary: "Hot water tanks for DHW, thermal storage; sizing, insulation, stratification.", minutes: 10 },
              { slug: "phase-change", title: "Phase-Change Materials & Ice Storage", summary: "PCM (paraffin, salt hydrates), ice-on-coil, latent heat density.", minutes: 10 },
              { slug: "ground-storage", title: "Ground & Aquifer Thermal Storage", summary: "Boreholes, aquifer storage, seasonal shifting from ground.", minutes: 10 },
              { slug: "technologies-check", title: "Storage Technologies Check", summary: "Quiz on water tanks, phase-change materials, and ground storage.", minutes: 5 },
            ],
          },
          {
            slug: "applications-economics",
            title: "Applications & Economics",
            lessons: [
              { slug: "dhw-heating", title: "Domestic Hot Water & Space Heating Storage", summary: "Buffer tanks for boiler cycling, off-peak charging, solar integration.", minutes: 10 },
              { slug: "cooling-storage", title: "Cooling Load Storage (Ice/Chilled Water)", summary: "Night cooling for day use; reduced chiller size and peak demand.", minutes: 10 },
              { slug: "economics-payback", title: "Economics & Payback Analysis", summary: "Cost of storage vs energy savings, tariff structures, incentives.", minutes: 10 },
              { slug: "applications-check", title: "Applications & Economics Check", summary: "Quiz on DHW, cooling, and economic feasibility of storage.", minutes: 5 },
            ],
          },
          {
            slug: "tes-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "diagnostics-capstone",
                title: "Capstone: Thermal Storage Diagnostics",
                summary:
                  "Hands-on: diagnose eight storage call-outs — sensible vs latent sizing, the cooling business case, the flat-tariff trap, stratification, standing losses, seasonal scale, charging schedules and PCM selection — then calculate, verify and prescribe the fix.",
                minutes: 30,
              },
            ],
          },
        ],
      },
      {
        slug: "renewable-energy",
        title: "Renewable Energy",
        summary: "Solar PV, solar thermal, wind, heat pumps and biomass — sizing, integration and on-site generation.",
        status: "available",
        modules: [
          {
            slug: "solar-pv",
            title: "Solar Photovoltaic (PV)",
            lessons: [
              { slug: "pv-basics", title: "How Solar PV Works", summary: "Photons, silicon, cells, modules, string inverters; efficiency limits.", minutes: 11 },
              { slug: "pv-sizing", title: "Sizing a PV System", summary: "Available roof area, orientation, shading, kWp rating, annual yield.", minutes: 10 },
              { slug: "pv-integration", title: "Grid Interconnection & Battery Storage", summary: "Grid-tied inverters, export metering, batteries for off-grid or resilience.", minutes: 10 },
              { slug: "pv-economics", title: "PV Economics & Payback", summary: "Cost per Wp, FiT/export income, payback period, 25-year lifetime value.", minutes: 10 },
              { slug: "pv-check", title: "Solar PV Check", summary: "Quiz on PV fundamentals, sizing, integration, and economics.", minutes: 5 },
            ],
          },
          {
            slug: "solar-thermal-wind",
            title: "Solar Thermal, Wind & Heat Pumps",
            lessons: [
              { slug: "solar-thermal", title: "Solar Thermal (Hot Water Heating)", summary: "Flat-plate collectors, evacuated tubes, COP, seasonal variation, DHW tanks.", minutes: 10 },
              { slug: "wind", title: "Wind Turbines (Small-Scale)", summary: "Wind potential, turbine types, noise, visual impact, planning constraints.", minutes: 10 },
              { slug: "heat-pump-renewable", title: "Heat Pumps as Renewable (COP as Leverage)", summary: "How heat pumps use renewable electricity more efficiently than direct heat.", minutes: 9 },
              { slug: "solar-wind-check", title: "Solar Thermal & Wind Check", summary: "Quiz on solar thermal, wind, and heat pump performance.", minutes: 5 },
            ],
          },
          {
            slug: "biomass-integration",
            title: "Biomass & System Integration",
            lessons: [
              { slug: "biomass", title: "Biomass Boilers & Heating", summary: "Wood chips, pellets, carbon neutrality, supply chain, efficiency.", minutes: 10 },
              { slug: "hybrid-systems", title: "Hybrid Systems (Fossil + Renewable)", summary: "Boiler + heat pump, PV + grid, diversity for resilience.", minutes: 10 },
              { slug: "microgrid", title: "Local Generation & Microgrids", summary: "Peer-to-peer export, virtual power plants, community solar.", minutes: 9 },
              { slug: "biomass-check", title: "Biomass & Integration Check", summary: "Quiz on biomass, hybrid systems, and microgrids.", minutes: 5 },
            ],
          },
          {
            slug: "grid-storage",
            title: "Grid Connection & Storage Strategy",
            lessons: [
              { slug: "grid-codes", title: "Grid Code Requirements & Export Metering", summary: "DNO approval, export capacity, anti-islanding, metering standards.", minutes: 9 },
              { slug: "battery-storage", title: "Battery Storage for Self-Consumption & Demand Shifting", summary: "Lithium-ion, lead-acid, round-trip efficiency, depth of discharge.", minutes: 10 },
              { slug: "net-zero-pathway", title: "Pathway to Net-Zero (Retrofit Sequencing)", summary: "Insulation → electrification → renewable generation → storage.", minutes: 10 },
              { slug: "grid-check", title: "Grid & Storage Check", summary: "Quiz on grid connection, batteries, and net-zero pathways.", minutes: 5 },
            ],
          },
          {
            slug: "renewables-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "diagnostics-capstone",
                title: "Capstone: Renewable Energy Diagnostics",
                summary:
                  "Hands-on: diagnose eight on-site renewables call-outs — PV yield and sizing, string shading, batteries, the wind cube law, load-shifting, monitoring and orientation — then calculate, verify and prescribe the fix.",
                minutes: 30,
              },
            ],
          },
        ],
      },
      {
        slug: "control-systems-and-bms",
        title: "Control Systems & BMS",
        summary:
          "Control loops, sensors and actuators, BMS strategies for buildings, and process control on industrial sites.",
        status: "available",
        modules: [
          {
            slug: "control-fundamentals",
            title: "Control Fundamentals",
            lessons: [
              {
                slug: "feedback-control",
                title: "Feedback Control & Control Loops",
                summary: "How feedback loops work, setpoint, error, response, stability.",
                minutes: 10,
              },
              {
                slug: "control-modes",
                title: "On-Off, Proportional & PID Control",
                summary: "On-off (bang-bang), proportional (P), integral (I), derivative (D) control modes.",
                minutes: 11,
              },
              {
                slug: "multi-loop-control",
                title: "Multi-Loop & Cascade Control",
                summary: "Coordinating multiple control loops, cascade control, precedent hierarchy.",
                minutes: 9,
              },
              {
                slug: "fundamentals-check",
                title: "Control Fundamentals Check",
                summary: "Quiz on feedback loops, control modes, and multi-loop systems.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "sensors-and-actuators",
            title: "Sensors, Actuators & Accuracy",
            lessons: [
              {
                slug: "temperature-sensors",
                title: "Temperature Sensors: RTD, Thermocouple, NTC",
                summary: "Sensor types, accuracy, response time, placement and errors.",
                minutes: 10,
              },
              {
                slug: "other-sensors",
                title: "Humidity, Pressure, Flow Sensors",
                summary: "Humidity (RH), pressure, flow measurement; common sensor types and issues.",
                minutes: 10,
              },
              {
                slug: "actuators-valves",
                title: "Actuators: Valves, Dampers, VFDs",
                summary: "Valve authority, damper linkage, actuator types (solenoid, pneumatic, electric).",
                minutes: 10,
              },
              {
                slug: "sensors-check",
                title: "Sensors & Actuators Check",
                summary: "Quiz on sensor types, accuracy, and actuator control.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "building-management-systems",
            title: "Building Management Systems (BMS)",
            lessons: [
              {
                slug: "bms-architecture",
                title: "BMS Architecture & Integration",
                summary: "Central vs distributed control, network architecture, protocol standards (BACnet, Modbus).",
                minutes: 10,
              },
              {
                slug: "bms-functions",
                title: "BMS Functions: Trending, Alarming, Scheduling",
                summary: "Data logging, trend analysis, alarm management, occupancy scheduling, reports.",
                minutes: 10,
              },
              {
                slug: "control-strategies",
                title: "Energy-Optimised Control Strategies",
                summary: "Setpoint reset, demand-reset, occupancy-based, economiser logic, load sequencing.",
                minutes: 11,
              },
              {
                slug: "bms-check",
                title: "BMS Check",
                summary: "Quiz on BMS architecture, functions, and energy strategies.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "controls-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "diagnostics-capstone",
                title: "Capstone: Controls & BMS Diagnostics",
                summary:
                  "Hands-on: diagnose eight controls call-outs — out-of-hours running, simultaneous heating/cooling, setpoint reset, sensor drift and placement, on-off vs PID, valve authority and sequencing — then calculate, verify and prescribe the fix.",
                minutes: 30,
              },
            ],
          },
        ],
      },
      {
        slug: "commissioning",
        title: "Commissioning for Energy Management",
        summary:
          "Commissioning and re-commissioning so systems actually deliver designed performance — and keep delivering it.",
        status: "available",
        modules: [
          {
            slug: "commissioning-fundamentals",
            title: "Commissioning Fundamentals",
            lessons: [
              {
                slug: "what-is-commissioning",
                title: "What is Commissioning?",
                summary: "Definition, scope, why it matters, and how it differs from testing and handover.",
                minutes: 9,
              },
              {
                slug: "commissioning-protocol",
                title: "Commissioning Protocol & Planning",
                summary: "Commissioning plan, scope, team roles, schedule, documentation.",
                minutes: 10,
              },
              {
                slug: "etics-framework",
                title: "ETICS Framework: Existing Building Commissioning",
                summary: "Framework for retrofitting and re-commissioning existing systems.",
                minutes: 10,
              },
              {
                slug: "fundamentals-check",
                title: "Commissioning Fundamentals Check",
                summary: "Quiz on commissioning purpose, protocol, and frameworks.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "on-site-commissioning",
            title: "On-Site Commissioning Work",
            lessons: [
              {
                slug: "hvac-commissioning",
                title: "HVAC System Commissioning",
                summary: "Flow balancing, pressure drop verification, setpoint calibration, sensor checks.",
                minutes: 11,
              },
              {
                slug: "controls-commissioning",
                title: "Controls & Sequence Testing",
                summary: "Testing control logic, sensor response, actuator function, failsafe modes.",
                minutes: 10,
              },
              {
                slug: "performance-testing",
                title: "Performance Testing & Verification",
                summary: "Measuring equipment output, efficiency, load-bearing capacity, seasonal variation.",
                minutes: 10,
              },
              {
                slug: "onsite-check",
                title: "On-Site Commissioning Check",
                summary: "Quiz on balancing, controls testing, and performance verification.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "recommissioning-persistence",
            title: "Re-Commissioning & Persistence",
            lessons: [
              {
                slug: "drift-and-degradation",
                title: "Drift, Degradation & Control Failure",
                summary: "How systems drift post-commissioning, common causes, and early detection.",
                minutes: 10,
              },
              {
                slug: "recommissioning",
                title: "Re-Commissioning Strategy",
                summary: "When and how to re-commission, continuous commissioning, ongoing measurement.",
                minutes: 10,
              },
              {
                slug: "handover-documentation",
                title: "Handover & Documentation",
                summary: "Commissioning report, operational manuals, as-built drawings, staff training.",
                minutes: 9,
              },
              {
                slug: "persistence-check",
                title: "Re-Commissioning Check",
                summary: "Quiz on drift, re-commissioning cycles, and persistence.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "commissioning-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "diagnostics-capstone",
                title: "Capstone: Commissioning Diagnostics",
                summary:
                  "Hands-on: diagnose eight commissioning call-outs — flow balancing, performance shortfalls, sequence defects, sensors, setpoints, duct pressure, drift and handover — then calculate, verify and decide whether to sign off.",
                minutes: 30,
              },
            ],
          },
        ],
      },
      {
        slug: "refrigeration-and-heat-pumps",
        title: "Refrigeration & Heat Pump Systems",
        summary:
          "How air conditioning, refrigeration and heat pumps work; thermodynamic cycles, efficiency, optimization.",
        status: "available",
        modules: [
          {
            slug: "refrigeration-fundamentals",
            title: "Refrigeration Fundamentals",
            lessons: [
              {
                slug: "vapour-compression-cycle",
                title: "The Vapour-Compression Cycle",
                summary: "Compressor, condenser, expansion device, evaporator, refrigerant flow.",
                minutes: 11,
              },
              {
                slug: "ph-diagrams",
                title: "Pressure-Enthalpy Diagrams & Refrigerant Properties",
                summary: "Reading P-h diagrams, saturation, superheat, subcooling, refrigerant types.",
                minutes: 11,
              },
              {
                slug: "superheat-subcooling",
                title: "Superheat, Subcooling & System Tuning",
                summary: "Why superheat and subcooling matter, measuring them, field adjustments.",
                minutes: 10,
              },
              {
                slug: "fundamentals-check",
                title: "Refrigeration Fundamentals Check",
                summary: "Quiz on vapour-compression cycle, P-h diagrams, superheat/subcooling.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "heat-pump-cycles",
            title: "Heat Pump Cycles & Performance",
            lessons: [
              {
                slug: "reverse-cycle",
                title: "Reverse Cycle (Heat Pump Mode)",
                summary: "How heat pumps work in heating mode, evaporator outside, condenser inside.",
                minutes: 11,
              },
              {
                slug: "cop-and-performance",
                title: "COP, SCOP & Seasonal Performance",
                summary: "Coefficient of performance, seasonal variations, weather-dependent efficiency.",
                minutes: 10,
              },
              {
                slug: "heating-modes",
                title: "Heating Modes: Heating, Defrost, Electric Backup",
                summary: "Heating-only, heating + cooling (reversible), defrost cycles, auxiliary heating.",
                minutes: 10,
              },
              {
                slug: "heatpump-check",
                title: "Heat Pump Check",
                summary: "Quiz on heat pump cycles, COP, and heating modes.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "system-types",
            title: "System Types & Applications",
            lessons: [
              {
                slug: "split-systems",
                title: "Split Units & Multi-Split Systems",
                summary: "Indoor/outdoor splits, wall-mounted, multi-indoor, refrigerant piping.",
                minutes: 10,
              },
              {
                slug: "water-cooled-systems",
                title: "Water-Cooled & Chillers",
                summary: "Water-cooled condensers, chiller types, cooling tower, water loop design.",
                minutes: 10,
              },
              {
                slug: "ground-source-heat-pumps",
                title: "Ground-Source Heat Pumps (GSHP)",
                summary: "Closed-loop borehole, open-loop groundwater, performance, installation.",
                minutes: 11,
              },
              {
                slug: "systems-check",
                title: "System Types Check",
                summary: "Quiz on split units, water-cooled, and ground-source heat pumps.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "optimization-maintenance",
            title: "Optimization & Maintenance",
            lessons: [
              {
                slug: "partload-efficiency",
                title: "Part-Load Efficiency & Control",
                summary: "How cooling/heating demand varies, part-load COP, capacity control methods.",
                minutes: 10,
              },
              {
                slug: "practical-improvements",
                title: "Practical Efficiency Improvements",
                summary: "Refrigerant charge optimization, cleaning, defrost cycles, setpoint tuning.",
                minutes: 10,
              },
              {
                slug: "maintenance-and-faults",
                title: "Maintenance & Common Faults",
                summary: "Regular servicing, refrigerant leaks, superheat/subcooling errors, sensor drift.",
                minutes: 10,
              },
              {
                slug: "optimization-check",
                title: "Optimization Check",
                summary: "Quiz on part-load efficiency, improvements, and maintenance.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "refrigeration-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "diagnostics-capstone",
                title: "Capstone: Refrigeration & Heat Pump Diagnostics",
                summary:
                  "Hands-on: diagnose eight refrigeration and heat-pump call-outs — fouled condenser, low charge, setpoint, part-load, resistance-vs-heat-pump, flow temperature, free cooling and backup controls — then calculate, verify and prescribe the fix.",
                minutes: 30,
              },
            ],
          },
        ],
      },
      {
        slug: "maintenance",
        title: "Maintenance of Energy Systems",
        summary: "How maintenance regimes protect efficiency, and how to embed energy into planned and reactive maintenance.",
        status: "available",
        modules: [
          {
            slug: "maintenance-strategy",
            title: "Maintenance Strategy & Energy Link",
            lessons: [
              { slug: "planned-reactive", title: "Planned vs Reactive Maintenance", summary: "Preventive maintenance keeps equipment efficient; reactive (breakdown) repair is costly and inefficient.", minutes: 10 },
              { slug: "energy-performance", title: "How Maintenance Affects Energy Performance", summary: "Fouling, wear, leaks, friction; maintenance intervals that protect efficiency.", minutes: 10 },
              { slug: "maintenance-checklist", title: "Energy-Focused Maintenance Checklist", summary: "Boiler, chiller, pump, motor, compressor; what to inspect/clean/adjust for peak performance.", minutes: 10 },
              { slug: "strategy-check", title: "Maintenance Strategy Check", summary: "Quiz on maintenance strategy and energy link.", minutes: 5 },
            ],
          },
          {
            slug: "system-specific",
            title: "System-Specific Maintenance",
            lessons: [
              { slug: "boiler-maintenance", title: "Boiler & Fuel System Maintenance", summary: "Cleaning, scaling removal, combustion tuning, pressure relief testing; efficiency loss timeline.", minutes: 10 },
              { slug: "chiller-cooling", title: "Chiller & Cooling System Maintenance", summary: "Condenser cleaning, refrigerant charge, superheat/subcooling check, filter change.", minutes: 10 },
              { slug: "motor-pump", title: "Motor & Pump Maintenance", summary: "Bearing lubrication, seal inspection, vibration monitoring; early fault detection.", minutes: 10 },
              { slug: "system-check", title: "System-Specific Check", summary: "Quiz on boiler, chiller, motor, and pump maintenance.", minutes: 5 },
            ],
          },
          {
            slug: "maintenance-program",
            title: "Building a Maintenance Program",
            lessons: [
              { slug: "condition-monitoring", title: "Condition Monitoring & Predictive Maintenance", summary: "Vibration, temperature, efficiency trending; early fault detection; avoid catastrophic failure.", minutes: 10 },
              { slug: "maintenance-plan", title: "Maintenance Plan Development", summary: "Equipment inventory, maintenance intervals, cost budgeting, scheduling (seasonal).", minutes: 10 },
              { slug: "performance-tracking", title: "Performance Tracking & KPIs", summary: "Equipment efficiency over time (boiler flue temp, motor current, chiller COP); trend analysis.", minutes: 10 },
              { slug: "program-check", title: "Program Development Check", summary: "Quiz on maintenance planning and performance tracking.", minutes: 5 },
            ],
          },
          {
            slug: "maintenance-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "diagnostics-capstone",
                title: "Capstone: Maintenance Diagnostics",
                summary:
                  "Hands-on: diagnose eight maintenance call-outs — deferral, flue-temp creep, reactive vs preventive, condition monitoring, belt slip, intervals, accumulated drift and prioritisation — then calculate, verify and prescribe the strategy.",
                minutes: 30,
              },
            ],
          },
        ],
      },
      {
        slug: "measurement-and-verification",
        title: "Measurement & Verification (M&V)",
        summary: "Prove the savings: IPMVP options, baselines, adjustments and avoiding the traps that overstate results.",
        status: "available",
        modules: [
          {
            slug: "mv-fundamentals",
            title: "M&V Fundamentals",
            lessons: [
              { slug: "why-mv-matters", title: "Why Measure & Verify Savings?", summary: "Proving energy project ROI; building confidence for future investment; compliance & reporting.", minutes: 10 },
              { slug: "baseline-concept", title: "Baseline Concept & Methodology", summary: "Pre-project consumption as baseline; adjustment for weather, occupancy, production volume.", minutes: 10 },
              { slug: "ipmvp-options", title: "IPMVP Options A, B, C, D", summary: "Option A (whole-building), B (sub-metering), C (engineering calculations), D (deemed savings).", minutes: 11 },
              { slug: "fundamentals-check", title: "M&V Fundamentals Check", summary: "Quiz on baseline, IPMVP options, and M&V methodology.", minutes: 5 },
            ],
          },
          {
            slug: "baseline-adjustment",
            title: "Baseline & Adjustments",
            lessons: [
              { slug: "baseline-development", title: "Baseline Development & Data Collection", summary: "12+ months pre-project data; eliminating anomalies; regression analysis; peak/average load.", minutes: 10 },
              { slug: "weather-normalization", title: "Weather Normalization", summary: "Heating/cooling degree-days; correlation to energy; adjusting baseline for mild/cold years.", minutes: 10 },
              { slug: "occupancy-production", title: "Occupancy & Production Adjustments", summary: "Normalizing for changes in headcount, hours of operation, production volume post-project.", minutes: 10 },
              { slug: "adjustment-check", title: "Baseline & Adjustment Check", summary: "Quiz on baseline development and adjustment factors.", minutes: 5 },
            ],
          },
          {
            slug: "savings-pitfalls",
            title: "Quantifying Savings & Avoiding Pitfalls",
            lessons: [
              { slug: "calculating-savings", title: "Calculating Adjusted Savings", summary: "Savings = (Baseline - Adjusted Actual) with all adjustments; confidence intervals.", minutes: 10 },
              { slug: "common-pitfalls", title: "Common Pitfalls & Overstatement", summary: "Boundary changes, occupancy underestimation, weather luck, rebound effects; how to avoid.", minutes: 10 },
              { slug: "reporting-verification", title: "Reporting & Independent Verification", summary: "M&V plan, annual reports, independent third-party review for credibility.", minutes: 10 },
              { slug: "savings-check", title: "Savings Calculation Check", summary: "Quiz on calculating savings and avoiding pitfalls.", minutes: 5 },
            ],
          },
          {
            slug: "mv-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "diagnostics-capstone",
                title: "Capstone: M&V Diagnostics",
                summary:
                  "Hands-on: work eight M&V call-outs — adjusted baselines, multi-driver models, weather luck, IPMVP option choice, non-routine adjustments, the noise floor, persistence and rebound — then calculate, verify and report honestly.",
                minutes: 30,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "level-3",
    number: 3,
    title: "Leadership & Strategy",
    tagline: "Leading the energy agenda",
    description:
      "Move from running systems to leading change. Strategy, policy, investment, financing, procurement and the people skills to drive an organisation toward net zero.",
    accent: accents[3],
    courses: [
      {
        slug: "energy-leadership",
        title: "Leadership in an Energy Context",
        summary: "Influence without authority, building a coalition, and embedding energy into governance and culture.",
        status: "available",
        modules: [
          { slug: "influence", title: "Influence & Stakeholder Engagement", lessons: [
            { slug: "influencing-without-authority", title: "Influencing Without Authority", summary: "Credibility, coalition-building, persuasion tactics for energy advocates.", minutes: 11 },
            { slug: "stakeholder-mapping", title: "Stakeholder Mapping & Engagement", summary: "Identifying allies, antagonists, fence-sitters; tailored messaging for each.", minutes: 10 },
            { slug: "communication-skills", title: "Communication & Storytelling", summary: "Narrative, data presentation, emotion and logic balance in energy pitches.", minutes: 10 },
            { slug: "influence-check", title: "Influence Check", summary: "Quiz on stakeholder engagement and influence tactics.", minutes: 5 },
          ] },
          { slug: "culture", title: "Building an Energy Culture", lessons: [
            { slug: "culture-shift", title: "Culture Shift & Behaviour Change", summary: "From compliance to commitment; employee engagement in energy programmes.", minutes: 10 },
            { slug: "incentives", title: "Incentives & Recognition", summary: "Rewards (financial, recognition) to reinforce energy-conscious behaviour.", minutes: 10 },
            { slug: "embedding-governance", title: "Embedding Energy in Governance", summary: "Board-level sponsorship, energy in strategy, ESG reporting, accountability.", minutes: 10 },
            { slug: "culture-check", title: "Culture Check", summary: "Quiz on culture, incentives, and governance integration.", minutes: 5 },
          ] },
          { slug: "leadership-practice", title: "Leadership Practice & Self", lessons: [
            { slug: "self-leadership", title: "Self-Leadership & Personal Resilience", summary: "Managing energy project stress, building credibility over time, staying motivated.", minutes: 10 },
            { slug: "team-dynamics", title: "Team Dynamics & Cross-Functional Work", summary: "Working with operations, finance, procurement; navigating silos.", minutes: 10 },
            { slug: "transformation-journey", title: "The Transformation Journey", summary: "Stages of energy transformation; typical timelines, setbacks, celebrating wins.", minutes: 10 },
            { slug: "practice-check", title: "Practice Check", summary: "Quiz on self-leadership, teams, and transformation.", minutes: 5 },
          ] },
        ],
      },
      {
        slug: "energy-strategy-iso-50001",
        title: "Energy Strategy & ISO 50001",
        summary: "Build an energy management system: significant energy uses, objectives, action plans and certification.",
        status: "available",
        modules: [
          { slug: "ems-framework", title: "Energy Management System Framework", lessons: [
            { slug: "iso-50001-overview", title: "ISO 50001 Overview & Requirements", summary: "Standard structure (PDCA), mandatory elements, certification path.", minutes: 11 },
            { slug: "energy-policy-objectives", title: "Policy, Objectives & Targets", summary: "Defining energy policy; SMART objectives and targets aligned to business.", minutes: 10 },
            { slug: "baseline-performance", title: "Baseline & Energy Performance Indicators", summary: "Baseline energy consumption; KPIs (kWh/m², £/unit output); improvement tracking.", minutes: 10 },
            { slug: "framework-check", title: "Framework Check", summary: "Quiz on ISO 50001 and EMS setup.", minutes: 5 },
          ] },
          { slug: "significant-energy", title: "Identifying & Managing Significant Energy Use", lessons: [
            { slug: "seu-identification", title: "Significant Energy Uses (SEU) Analysis", summary: "Which processes/equipment use most energy; Pareto 80-20 rule.", minutes: 10 },
            { slug: "seu-monitoring", title: "Monitoring & Measurement of SEU", summary: "Metering significant uses; real-time tracking; monthly/annual review.", minutes: 10 },
            { slug: "seu-improvement", title: "Improvement Actions for SEU", summary: "Targeted projects on high-impact equipment; ROI and payback focus.", minutes: 10 },
            { slug: "seu-check", title: "SEU Check", summary: "Quiz on identifying and improving significant energy uses.", minutes: 5 },
          ] },
          { slug: "implementation", title: "Implementation, Audit & Certification", lessons: [
            { slug: "implementation-roadmap", title: "Implementation Roadmap", summary: "Rolling out EMS across organization; roles, responsibilities, timeline.", minutes: 10 },
            { slug: "internal-audit", title: "Internal Audit & Non-Conformance", summary: "Regular audits; identifying gaps; corrective actions; continuous improvement.", minutes: 10 },
            { slug: "certification-journey", title: "ISO 50001 Certification Journey", summary: "External audit, certification body, re-certification cycles.", minutes: 10 },
            { slug: "implementation-check", title: "Implementation Check", summary: "Quiz on EMS rollout, audit, and certification.", minutes: 5 },
          ] },
        ],
      },
      {
        slug: "setting-energy-policy",
        title: "Setting Up an Energy Policy",
        summary: "Draft a policy with teeth — scope, commitments, responsibilities and the link to strategy and targets.",
        status: "available",
        modules: [
          { slug: "policy-design", title: "Policy Design & Structure", lessons: [
            { slug: "policy-purpose", title: "Purpose & Scope of Energy Policy", summary: "What a policy is (commitments, not tactics); scope (operations, supply chain, product).", minutes: 10 },
            { slug: "policy-pillars", title: "Policy Pillars (Efficiency, Renewable, Governance)", summary: "Three core pillars: operational efficiency, renewable energy, governance/targets.", minutes: 10 },
            { slug: "policy-language", title: "Policy Language & Tone", summary: "Clear, actionable, ambitious but credible; avoiding waffle; linking to strategy.", minutes: 10 },
            { slug: "design-check", title: "Design Check", summary: "Quiz on policy structure and language.", minutes: 5 },
          ] },
          { slug: "policy-content", title: "Policy Content & Commitments", lessons: [
            { slug: "targets-timelines", title: "Targets, Timelines & Accountability", summary: "Quantified targets (% reduction by 2030); ownership (CFO, ops, procurement).", minutes: 10 },
            { slug: "responsibilities", title: "Roles & Responsibilities", summary: "Who reports to whom; who approves investment; who drives culture.", minutes: 10 },
            { slug: "supply-chain", title: "Supply Chain & Procurement Links", summary: "Supplier expectations; carbon contracts; sustainable procurement policy.", minutes: 10 },
            { slug: "content-check", title: "Content Check", summary: "Quiz on targets, responsibilities, and supply chain.", minutes: 5 },
          ] },
          { slug: "policy-adoption", title: "Policy Adoption & Communication", lessons: [
            { slug: "board-approval", title: "Getting Board Approval", summary: "Framing for executives; risk (climate, regulatory, reputational); benefits.", minutes: 10 },
            { slug: "launch-cascade", title: "Policy Launch & Cascading to Employees", summary: "Communications strategy; training; embedding in job descriptions.", minutes: 10 },
            { slug: "policy-review", title: "Policy Review & Renewal", summary: "Annual review; updating targets; responding to new regulation or tech.", minutes: 10 },
            { slug: "adoption-check", title: "Adoption Check", summary: "Quiz on board engagement and policy communication.", minutes: 5 },
          ] },
        ],
      },
      {
        slug: "building-the-investment-case",
        title: "Building the Investment Case",
        summary: "Frame energy projects for finance directors: risk, hurdle rates, co-benefits and portfolio prioritisation.",
        status: "available",
        modules: [
          { slug: "investment-basics", title: "Investment Case Fundamentals", lessons: [
            { slug: "npv-irr", title: "NPV, IRR & Payback for Energy Projects", summary: "Time value of money; comparing projects; hurdle rate (typical 10-20%).", minutes: 11 },
            { slug: "risk-assessment", title: "Risk & Sensitivity Analysis", summary: "Energy price uncertainty, technical risk (will it work?), occupancy/production change.", minutes: 10 },
            { slug: "co-benefits", title: "Co-Benefits & Non-Energy Outcomes", summary: "Health, productivity, resilience, brand value; quantifying soft benefits.", minutes: 10 },
            { slug: "basics-check", title: "Investment Basics Check", summary: "Quiz on NPV, risk, and co-benefits.", minutes: 5 },
          ] },
          { slug: "case-development", title: "Building the Case", lessons: [
            { slug: "energy-cost-baseline", title: "Energy Cost Baseline & Forecast", summary: "Current consumption and cost; price escalation assumption (2-3% p.a. typical).", minutes: 10 },
            { slug: "project-savings", title: "Quantifying Project Savings", summary: "Conservative estimates; M&V plan; avoiding overstatement (critical!).", minutes: 10 },
            { slug: "financial-structure", title: "Financial Structures (CAPEX, OPEX, ESCO)", summary: "On-balance vs off-balance options; ESCO trade-offs; blended cost of capital.", minutes: 10 },
            { slug: "development-check", title: "Development Check", summary: "Quiz on baseline, savings, and financial structure.", minutes: 5 },
          ] },
          { slug: "case-presentation", title: "Presenting the Case & Portfolio", lessons: [
            { slug: "presentation-structure", title: "Presentation Structure for Financiers", summary: "Executive summary, risk/return profile, timeline, governance.", minutes: 10 },
            { slug: "portfolio-prioritisation", title: "Portfolio Prioritisation", summary: "Ranked projects by IRR, risk, strategic fit; bundling for cost-sharing.", minutes: 10 },
            { slug: "board-approval", title: "Getting Board/Investment Committee Approval", summary: "Escalation path; key decision points; post-approval governance.", minutes: 10 },
            { slug: "presentation-check", title: "Presentation Check", summary: "Quiz on case presentation and portfolio management.", minutes: 5 },
          ] },
        ],
      },
      {
        slug: "financing-and-epcs",
        title: "Financing Projects & Energy Performance Contracts",
        summary: "Fund projects off and on balance sheet: EPCs, ESCOs, shared-savings, on-bill finance and green loans.",
        status: "available",
        modules: [
          { slug: "financing-options", title: "Financing Options Overview", lessons: [
            { slug: "debt-equity", title: "Debt vs Equity Financing", summary: "Corporate loans (on-balance); equity investment; blend depending on risk profile.", minutes: 11 },
            { slug: "green-finance", title: "Green Bonds, Green Loans & ESG Finance", summary: "Preferential rates for energy/environmental projects; ESG verification.", minutes: 10 },
            { slug: "vendor-finance", title: "Vendor Financing & Lease-to-Own", summary: "Equipment suppliers offer financing; low upfront cost, higher total cost.", minutes: 10 },
            { slug: "options-check", title: "Financing Options Check", summary: "Quiz on debt, green finance, and vendor options.", minutes: 5 },
          ] },
          { slug: "epc-model", title: "Energy Performance Contracts (EPC) & ESCOs", lessons: [
            { slug: "epc-structure", title: "EPC Structure & ESCO Model", summary: "ESCO funds project; is paid from energy savings; customer takes no capex risk.", minutes: 10 },
            { slug: "epc-risks", title: "EPC Risks & Mitigants", summary: "Shortfall risk (savings < forecast); guaranteed savings clauses; M&V disputes.", minutes: 10 },
            { slug: "shared-savings", title: "Shared-Savings Contracts", summary: "Customer and ESCO split savings (e.g., 50-50); alignment of interest.", minutes: 10 },
            { slug: "epc-check", title: "EPC Check", summary: "Quiz on EPC structure and risk management.", minutes: 5 },
          ] },
          { slug: "emerging-finance", title: "Emerging Finance Models", lessons: [
            { slug: "on-bill-finance", title: "On-Bill Financing & Utility Programs", summary: "Utility funds efficiency upgrades; repaid via lower energy bills.", minutes: 10 },
            { slug: "vc-ppp", title: "Venture Capital & Public-Private Partnerships", summary: "Scaling innovation; government co-investment in transition projects.", minutes: 10 },
            { slug: "carbon-finance", title: "Carbon Finance & Credits", summary: "Revenue from carbon savings (via carbon markets or internal pricing).", minutes: 10 },
            { slug: "emerging-check", title: "Emerging Models Check", summary: "Quiz on on-bill, PPP, and carbon finance.", minutes: 5 },
          ] },
        ],
      },
      {
        slug: "energy-procurement",
        title: "Energy Procurement & Purchasing",
        summary: "Tariffs, contracts, flexible vs fixed procurement, risk management and buying clean power (PPAs, REGOs).",
        status: "available",
        modules: [
          { slug: "procurement-basics", title: "Procurement Fundamentals", lessons: [
            { slug: "tariff-structures", title: "Tariff Structures & Pricing", summary: "Fixed vs variable; day-ahead, forward markets; unit rates, standing charges.", minutes: 11 },
            { slug: "contract-types", title: "Contract Types (Fixed, Index, Flexible)", summary: "Fixed price (budget certainty), index (spot-following), collar (min-max price).", minutes: 10 },
            { slug: "risk-management", title: "Energy Price Risk Management", summary: "Hedging; price volatility; protecting against spikes; strategic reserves.", minutes: 10 },
            { slug: "basics-check", title: "Procurement Basics Check", summary: "Quiz on tariffs, contracts, and risk.", minutes: 5 },
          ] },
          { slug: "sustainable-procurement", title: "Sustainable & Clean Power Procurement", lessons: [
            { slug: "ppas", title: "Power Purchase Agreements (PPAs)", summary: "Direct purchase of renewable power (long-term, fixed price); off-site wind/solar.", minutes: 10 },
            { slug: "regos", title: "Renewable Energy Guarantees of Origin (REGOs)", summary: "Buying green certificates to offset grid consumption; additionality debate.", minutes: 10 },
            { slug: "supplier-criteria", title: "Supplier Criteria & Procurement Leverage", summary: "Requiring suppliers meet carbon/efficiency targets; sustainability clauses.", minutes: 10 },
            { slug: "clean-check", title: "Clean Power Procurement Check", summary: "Quiz on PPAs, REGOs, and supplier engagement.", minutes: 5 },
          ] },
          { slug: "procurement-execution", title: "Procurement Strategy & Execution", lessons: [
            { slug: "demand-forecasting", title: "Demand Forecasting & Bundling", summary: "Estimating future consumption; bundling small sites for scale.", minutes: 10 },
            { slug: "tendering", title: "Tendering & Supplier Negotiation", summary: "RFP process; negotiating rates; multi-supplier vs single-supplier trade-off.", minutes: 10 },
            { slug: "contract-management", title: "Contract Management & Compliance", summary: "Monitoring supplier performance; metering accuracy; billing disputes.", minutes: 10 },
            { slug: "execution-check", title: "Execution Check", summary: "Quiz on forecasting, tendering, and contract management.", minutes: 5 },
          ] },
        ],
      },
      {
        slug: "organisational-change",
        title: "Organisational Change & Behaviour",
        summary: "Behaviour-change campaigns, engagement, incentives and making energy-conscious habits stick.",
        status: "available",
        modules: [
          { slug: "behaviour-change", title: "Behaviour Change Fundamentals", lessons: [
            { slug: "psychology-of-change", title: "Psychology of Energy Behaviour", summary: "Habit, nudges, social norms, intrinsic vs extrinsic motivation.", minutes: 11 },
            { slug: "change-model", title: "Change Management Model (Awareness → Habit)", summary: "Stages: awareness, trial, adoption, habit; typical timelines.", minutes: 10 },
            { slug: "behaviour-metrics", title: "Measuring Behaviour Change", summary: "Engagement metrics; behaviour surveys; kWh saved; isolation from technical changes.", minutes: 10 },
            { slug: "behaviour-check", title: "Behaviour Change Check", summary: "Quiz on psychology and change models.", minutes: 5 },
          ] },
          { slug: "campaigns", title: "Engagement Campaigns & Programs", lessons: [
            { slug: "campaign-design", title: "Campaign Design & Themes", summary: "Seasonal campaigns (winter heating, summer cooling); co-worker competitions; teams.", minutes: 10 },
            { slug: "communications", title: "Communications & Feedback", summary: "Newsletters, posters, email, social; real-time feedback (dashboard); monthly reporting.", minutes: 10 },
            { slug: "champions", title: "Champion Network & Peer Leaders", summary: "Employee energy champions; training; recognition; grassroots ambassadors.", minutes: 10 },
            { slug: "campaigns-check", title: "Campaigns Check", summary: "Quiz on campaign design and communications.", minutes: 5 },
          ] },
          { slug: "incentives-culture", title: "Incentives & Sustaining Culture", lessons: [
            { slug: "incentive-types", title: "Incentive Types (Financial, Non-Financial)", summary: "Bonuses, recognition, awards; team competitions; avoiding perverse incentives.", minutes: 10 },
            { slug: "sustaining-habits", title: "Sustaining Habits & Avoiding Rebound", summary: "Initial change often reverts (rebound 20-30%); maintenance campaigns needed.", minutes: 10 },
            { slug: "culture-integration", title: "Integration into Organizational Culture", summary: "Energy becoming 'how we do business'; embedded in performance reviews.", minutes: 10 },
            { slug: "incentives-check", title: "Incentives Check", summary: "Quiz on incentives and culture sustainability.", minutes: 5 },
          ] },
        ],
      },
      {
        slug: "net-zero-roadmaps",
        title: "Net Zero & Decarbonisation Roadmaps",
        summary: "Scope 1-2-3, marginal abatement cost curves, electrification, and sequencing a credible path to net zero.",
        status: "available",
        modules: [
          { slug: "net-zero-framework", title: "Net Zero Framework & Scopes", lessons: [
            { slug: "scope-definitions", title: "Scope 1, 2, 3 Emissions & Organizational Boundaries", summary: "Direct (fuel), indirect (electricity), value chain; what to include in commitment.", minutes: 11 },
            { slug: "carbon-accounting", title: "Carbon Accounting & Baseline", summary: "Measuring emissions; carbon factors (kgCO₂/kWh); historical baseline.", minutes: 10 },
            { slug: "net-zero-definition", title: "What Net Zero Means (Reductions + Offsets)", summary: "Net zero = residual emissions balanced by removals/offsets; not 'net neutrality'.", minutes: 10 },
            { slug: "framework-check", title: "Net Zero Framework Check", summary: "Quiz on scopes and carbon accounting.", minutes: 5 },
          ] },
          { slug: "decarbonisation", title: "Decarbonisation Pathways", lessons: [
            { slug: "macc-curves", title: "Marginal Abatement Cost (MAC) Curves", summary: "Ranking all abatement options by cost per tonne; visual roadmap.", minutes: 10 },
            { slug: "electrification", title: "Electrification Strategy (Heat, Transport)", summary: "Replacing gas boilers with heat pumps; EVs for fleet; decoupling from fossil fuel.", minutes: 10 },
            { slug: "renewable-transition", title: "Renewable Energy & System Transition", summary: "Solar/wind onsite or PPA; grid decarbonization; sector coupling.", minutes: 10 },
            { slug: "pathways-check", title: "Pathways Check", summary: "Quiz on MAC curves, electrification, and renewable strategy.", minutes: 5 },
          ] },
          { slug: "roadmap-delivery", title: "Roadmap Development & Delivery", lessons: [
            { slug: "roadmap-phases", title: "Phasing Abatement (Quick Wins → Deep Cuts)", summary: "2025: efficiency & demand reduction. 2030: electrification. 2040+: residual + offsets.", minutes: 10 },
            { slug: "offset-strategy", title: "Offsets & Removals Strategy", summary: "Reforestation, direct air capture (DAC), nature-based solutions; additionality & permanence.", minutes: 10 },
            { slug: "credibility-reporting", title: "Credibility, Reporting & Accountability", summary: "Science-based targets (SBTi); annual progress reporting; reassessment if needed.", minutes: 10 },
            { slug: "delivery-check", title: "Delivery Check", summary: "Quiz on roadmap phasing, offsets, and credibility.", minutes: 5 },
          ] },
        ],
      },
    ],
  },
];

/**
 * Sectors — a peer section to the numbered Levels, not a tier in the
 * expertise progression. Each sector applies the Level 1/2 foundations to one
 * specific vertical: its processes, its benchmarks, its regulation, and which
 * systems matter most there. Sector lessons assume Level 1/2 grounding and
 * cross-link back rather than re-teaching — see AGENTS.md.
 */
export const sectors: Level[] = [
  {
    kind: "sector",
    slug: "breweries",
    title: "Breweries",
    tagline: "Process, energy and regulation in the brewhouse and cellar",
    description:
      "Apply everything from Levels 1 and 2 to one of the most process- and utility-intensive site types there is: mashing, boiling, fermentation and cold conditioning all impose real, sequenced thermal and refrigeration loads, and the sector carries its own regulation — trade effluent, food safety, packaging producer responsibility. This is where steam, refrigeration, compressed air, heat recovery and pinch analysis meet a real production line.",
    accent: sectorAccent,
    courses: [
      {
        slug: "breweries",
        title: "Energy Management in Breweries",
        summary:
          "The brewing process and where energy enters it, brewery-specific benchmarks and regulation, and the heat-recovery and refrigeration opportunities unique to a brewhouse — capped with a full brewery energy audit.",
        status: "available",
        modules: [
          {
            slug: "brewing-process-fundamentals",
            title: "The Brewing Process & Where Energy Goes",
            lessons: [
              {
                slug: "the-brewing-process",
                title: "The Brewing Process, Stage by Stage",
                summary:
                  "From milled grain to packaged beer — mashing, lautering, boiling, fermentation and conditioning — and where each stage draws its energy.",
                minutes: 11,
              },
              {
                slug: "steam-and-hot-water-demand",
                title: "Steam & Hot Water Demand in the Brewhouse",
                summary:
                  "Mashing, sparging and the wort boil are the single biggest thermal load in the building — quantifying it and why the boil dominates.",
                minutes: 10,
              },
              {
                slug: "refrigeration-and-cooling-demand",
                title: "Refrigeration & Cooling Demand: Wort to Cellar",
                summary:
                  "Wort chilling, fermentation temperature control and cold conditioning — the brewery's other dominant load, this time electrical.",
                minutes: 10,
              },
              {
                slug: "fundamentals-check",
                title: "Brewing Fundamentals Check",
                summary: "Quiz on the brewing process and its thermal and refrigeration loads.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "energy-benchmarks",
            title: "Brewery Energy Use & Benchmarks",
            lessons: [
              {
                slug: "energy-intensity-benchmarks",
                title: "Energy Intensity: kWh per Hectolitre",
                summary:
                  "Typical thermal and electrical intensity benchmarks, why craft breweries run less efficiently than macro-breweries, and the water-energy link.",
                minutes: 10,
              },
              {
                slug: "cip-and-packaging-energy",
                title: "CIP, Pasteurisation & Packaging-Line Energy",
                summary:
                  "Clean-in-place cycles and pasteurisation are hidden hot-water heavyweights; the packaging line's own electrical and compressed-air demand.",
                minutes: 10,
              },
              {
                slug: "compressed-air-and-utilities",
                title: "Compressed Air & Site Utilities",
                summary:
                  "Where compressed air is used in a brewery, and the ancillary loads (pumps, cold stores, lighting) that add up across the site.",
                minutes: 9,
              },
              {
                slug: "benchmarks-check",
                title: "Energy Benchmarks Check",
                summary: "Quiz on brewery energy intensity, CIP/packaging and site utilities.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "regulation-and-compliance",
            title: "Regulation & Compliance for Breweries",
            lessons: [
              {
                slug: "trade-effluent-and-water",
                title: "Trade Effluent Consent & Water Reuse",
                summary:
                  "Why brewery effluent is charged by strength as well as volume, and how heat and water recovery cut both the energy bill and the effluent charge together.",
                minutes: 10,
              },
              {
                slug: "food-safety-and-energy",
                title: "Food Safety Requirements That Set Energy Floors",
                summary:
                  "HACCP-driven CIP temperatures and cold-chain limits aren't negotiable — where safety, not efficiency, sets the minimum.",
                minutes: 9,
              },
              {
                slug: "reporting-and-schemes",
                title: "ESOS, SECR, Climate Change Agreements & Packaging EPR",
                summary:
                  "Which UK schemes actually apply to a brewery your size, the sector's historic Climate Change Agreement, and the rising cost of packaging producer responsibility.",
                minutes: 10,
              },
              {
                slug: "compliance-check",
                title: "Regulation & Compliance Check",
                summary: "Quiz on trade effluent, food safety limits and applicable UK schemes.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "efficiency-in-practice",
            title: "Efficiency Opportunities in Practice",
            lessons: [
              {
                slug: "heat-recovery-in-the-brewhouse",
                title: "Heat Recovery in the Brewhouse",
                summary:
                  "Capturing the wort boil's vapour and hot-wort heat, and why a brewery's steady, simultaneous steam-and-power demand often suits CHP unusually well.",
                minutes: 11,
              },
              {
                slug: "refrigeration-and-glycol-optimisation",
                title: "Refrigeration & Glycol System Optimisation",
                summary:
                  "Tuning fermentation and conditioning cooling — setpoints, glycol loop design and free cooling — for the cellar's round-the-clock load.",
                minutes: 10,
              },
              {
                slug: "two-quick-diagnostics",
                title: "Hands-On: Two Quick Diagnostics",
                summary:
                  "Two short, real brewery call-outs — a missed heat-recovery opportunity and a glycol system fault — calculate, diagnose and prescribe the fix.",
                minutes: 12,
              },
              {
                slug: "efficiency-check",
                title: "Efficiency in Practice Check",
                summary: "Quiz on brewhouse heat recovery, CHP suitability and refrigeration optimisation.",
                minutes: 5,
              },
            ],
          },
          {
            slug: "brewery-capstone",
            title: "Capstone Project",
            lessons: [
              {
                slug: "brewery-audit-capstone",
                title: "Capstone: Audit a Brewery",
                summary:
                  "A full, staged energy audit of a fictional brewery — scope it, walk the site, normalise and baseline its data, and rank the opportunities you find by payback.",
                minutes: 35,
              },
            ],
          },
        ],
      },
    ],
  },
];
