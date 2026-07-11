/**
 * FAQ registry — question/answer sets rendered by <FAQList id="…" />, wired
 * up three ways: a course's `faqId` (course page), a lesson's `faqId`
 * (lesson page, rendered OUTSIDE the gated body so it stays in the public
 * HTML), or <FAQList id> directly in free-lesson MDX. Gated lessons must use
 * the lesson `faqId` route — embedding <FAQList> in a gated body hides it
 * from signed-out visitors and crawlers (validator-enforced). Each render
 * also emits FAQPage structured data, so keep answers self-contained,
 * factual and concise (they may be quoted directly in search results and AI
 * answers). Same registry principle as quizzes: never pass complex data as
 * MDX props.
 */

export type FaqItem = {
  q: string;
  a: string;
};

export const faqs: Record<string, FaqItem[]> = {
  "intro-energy-management": [
    {
      q: "What is energy management?",
      a: "Energy management is the systematic practice of measuring, controlling and reducing an organisation's energy consumption, so it gets the same output for less cost and carbon. In practice it combines metering and data analysis, operational improvements such as controls and scheduling, capital projects such as insulation or plant upgrades, and compliance with UK schemes like ESOS and SECR.",
    },
    {
      q: "What does an energy manager do?",
      a: "An energy manager monitors consumption against baselines, finds and quantifies savings opportunities, builds business cases for efficiency projects, manages compliance deadlines, and reports performance to management. The day-to-day toolkit is data: half-hourly meter readings, degree-day normalisation and exception reporting, backed by site knowledge of boilers, HVAC, motors, compressed air and lighting.",
    },
    {
      q: "What is the energy management cycle?",
      a: "The energy management cycle is Plan-Do-Check-Act (PDCA), the continual-improvement loop at the heart of ISO 50001. Plan a baseline, policy and targets; Do the improvements; Check results against the baseline through monitoring and verification; Act by standardising what worked and feeding lessons into the next cycle.",
    },
    {
      q: "Is this energy management course free?",
      a: "Yes. Level 1, including this introduction, is completely free and open with no signup. A free account unlocks the deeper Level 2 and 3 courses and every sector course, including the interactive capstones.",
    },
    {
      q: "Do I need an engineering background to start?",
      a: "No. Level 1 assumes no prior knowledge: it starts with what a kilowatt-hour is and builds from there. The technical Level 2 courses go deeper into individual systems, but every concept is introduced from first principles with worked UK examples.",
    },
  ],

  "esos-phase-4": [
    {
      q: "What is the ESOS Phase 4 deadline?",
      a: "The ESOS Phase 4 compliance deadline is 5 December 2027. Qualification is assessed on 31 December 2026: if your organisation meets the size tests on that date, it must complete its assessment and notify the Environment Agency by the deadline.",
    },
    {
      q: "Who qualifies for ESOS Phase 4?",
      a: "Large UK undertakings: organisations with 250 or more employees, or with annual turnover above about £44 million together with a balance sheet above about £38 million, assessed on 31 December 2026. If any UK member of a corporate group qualifies, the whole UK group is in scope.",
    },
    {
      q: "What does ESOS compliance require?",
      a: "Measuring total energy consumption across buildings, transport and industrial processes for a 12-month reference period, covering at least 90% of it through ESOS energy audits (overseen by a registered lead assessor), ISO 50001 certification, or in limited cases DECs or Green Deal assessments, then notifying the Environment Agency. Since Phase 3, participants must also submit an action plan and annual progress updates.",
    },
    {
      q: "What are the penalties for missing ESOS?",
      a: "The Environment Agency can issue penalties of up to £50,000 for non-compliance, with additional daily penalties for continued failure, and it publishes the names of non-compliant organisations. In practice the avoidable cost is the late scramble: lead assessors book up in the months before each deadline.",
    },
    {
      q: "Does ISO 50001 exempt an organisation from ESOS?",
      a: "An ISO 50001 certified energy management system covering the organisation's energy use is a full compliance route: the certified consumption does not need separate ESOS auditing, though the organisation must still notify the Environment Agency. Many large organisations comply almost entirely this way.",
    },
  ],

  "uk-three-phase": [
    {
      q: "What is the three-phase voltage in the UK?",
      a: "UK three-phase supplies are nominally 400 V between any two lines and 230 V between a line and neutral, with a permitted tolerance of +10% to −6%. In practice, measured voltages often sit closer to the older nominal figures of 415 V and 240 V, because the physical network changed very little when the nominal values were harmonised in 1995.",
    },
    {
      q: "Is UK three-phase 400 V or 415 V?",
      a: "Both labels describe the same supply. 415 V was the UK nominal line-to-line voltage until January 1995 (240 V × √3); European harmonisation renamed the nominals 400 V and 230 V without materially changing the network. Equipment rated for either will normally be compatible, but always check the rated voltage range on the nameplate rather than the single headline figure.",
    },
    {
      q: "What is the difference between single-phase and three-phase power?",
      a: "A single-phase supply is one alternating voltage wave on one live conductor, so the power it delivers pulses rather than flows steadily. A three-phase supply is three waves staggered by a third of a cycle on three conductors, so their combined power delivery is constant. That smoothness, and the rotating magnetic field three phases create, is why motors above a few kilowatts are almost always three-phase.",
    },
    {
      q: "When does a building need a three-phase supply?",
      a: "Broadly, when total demand approaches the limit of a single-phase supply (typically 100 A in the UK, about 23 kW) or when any single machine above a few kilowatts, such as a lift, compressor or large motor, must be powered. Most commercial buildings and effectively all industrial sites take three-phase by default.",
    },
    {
      q: "How can I tell if a supply is three-phase?",
      a: "Look at the incoming supply position: a three-phase supply has three fuses (or a three- or four-pole main switch) where single-phase has one, and the meter will be marked as three-phase. On equipment, a 400 V or 415 V rating indicates a three-phase connection; 230 V or 240 V indicates single-phase.",
    },
  ],

  "monitoring-and-targeting": [
    {
      q: "What is monitoring and targeting (M&T)?",
      a: "M&T is the discipline of measuring energy consumption frequently, comparing each period's use against what conditions (weather, production, occupancy) say it should have been, and investigating the gaps. It finds faults, drift and waste that bills alone hide, and it needs no capital equipment to start: meter readings, driver data and a spreadsheet are enough for a first pass.",
    },
    {
      q: "What is automatic monitoring and targeting (aM&T)?",
      a: "aM&T is M&T with the mechanical steps automated by software: half-hourly meter data is collected automatically, compared against expected values calculated from drivers such as degree days or production, and exceptions are flagged to a named person. The judgement about what an anomaly means, and what to do, stays human; the software removes the data-handling drudgery and shortens detection from months to days.",
    },
    {
      q: "What is the difference between M&T and M&V?",
      a: "M&T (monitoring and targeting) is continuous surveillance of consumption to find and fix waste. M&V (measurement and verification) is the formal process of proving how much a specific project saved, usually against a baseline adjusted to protocols such as IPMVP. M&T tells you something changed; M&V demonstrates rigorously what a deliberate change achieved.",
    },
    {
      q: "How much energy does M&T typically save?",
      a: "Published UK guidance and practitioner experience typically credit a well-run M&T programme with savings of around 5% to 10% of annual energy spend, mostly from finding faults, control drift and out-of-hours waste faster than bills would reveal them. The return depends on someone actually investigating the exceptions: the analysis itself saves nothing.",
    },
    {
      q: "What data do you need to start M&T?",
      a: "At minimum, regular meter readings (half-hourly electricity and gas data can be requested from suppliers for most non-domestic UK meters) and matching records of the main consumption drivers, such as degree days for heating or production output for process load. Twelve months of history lets you build a defensible baseline; sub-meters improve resolution later.",
    },
  ],

  "energy-audit-checklist": [
    {
      q: "What should a commercial energy audit checklist include?",
      a: "Five stages: scoping (agree the audit level, boundary, and gather 12+ months of bills plus production or occupancy data), a structured walk-through tracing energy from the meters to the major users, targeted measurements (flue-gas analysis, motor loads, overnight baseload, compressed-air checks), normalised analysis against weather and output, and a report that quantifies every recommendation with costs, savings and paybacks.",
    },
    {
      q: "How long does a commercial energy audit take?",
      a: "A walk-through audit of a straightforward site is typically a day on site plus reporting time. Detailed audits of complex or industrial sites take several days, plus data analysis either side of the visit. ESOS-compliant audits are sized so that, together with other compliance routes, they cover at least 90% of the organisation's total energy consumption.",
    },
    {
      q: "What is the difference between a walk-through and a detailed energy audit?",
      a: "A walk-through relies on observation and existing data (bills, half-hourly profiles) to find behavioural waste and obvious faults; it is quick and cheap but its savings estimates are indicative. A detailed or investment-grade audit adds measurement, sub-metering and engineering analysis, producing numbers robust enough to underwrite capital spending decisions.",
    },
    {
      q: "Do I need an energy audit for ESOS?",
      a: "If your organisation qualifies as a large UK undertaking (250+ employees, or turnover above roughly £44m with a balance sheet above roughly £38m), ESOS requires its energy consumption to be covered by compliant audits, ISO 50001 certification or equivalent routes, and the Phase 4 deadline is 5 December 2027. Smaller organisations have no legal obligation, but the same audit method is how they find savings.",
    },
  ],

  "carbon-accounting": [
    {
      q: "What are scope 1, 2 and 3 emissions?",
      a: "Scope 1 is direct emissions from sources you own or control (gas boilers, company vehicles, process and refrigerant emissions). Scope 2 is indirect emissions from the electricity, heat or steam you purchase. Scope 3 is everything else in your value chain: purchased goods, transport, commuting, product use and disposal. The split comes from the GHG Protocol and prevents double counting between organisations.",
    },
    {
      q: "What is the difference between the GHG Protocol and ISO 14064?",
      a: "The GHG Protocol is the detailed how-to methodology most corporate footprints follow: scopes, boundaries, principles and calculation guidance. ISO 14064 is the formal international standard family that specifies requirements for quantifying (part 1), project accounting (part 2) and verifying (part 3) greenhouse gas statements. They are compatible: organisations typically calculate to the GHG Protocol and verify against ISO 14064-3.",
    },
    {
      q: "How do you convert kWh into carbon emissions?",
      a: "Multiply the activity data by an emission factor: kWh × kgCO₂e/kWh. The UK government publishes conversion factors annually; the 2024 set puts grid electricity at roughly 0.207 kgCO₂e/kWh and natural gas at roughly 0.183 kgCO₂e/kWh. The electricity factor falls every year as the grid decarbonises, so always use the factor for the year being reported.",
    },
    {
      q: "Is carbon reporting mandatory in the UK?",
      a: "For large companies, yes: SECR requires quoted and large unquoted companies to report energy use and emissions in their annual accounts. Most SMEs have no legal obligation yet, but customer questionnaires, tender requirements and supply-chain programmes increasingly make a footprint commercially necessary regardless of size.",
    },
    {
      q: "What replaced PAS 2060 for carbon neutrality claims?",
      a: "ISO 14068-1, published in 2023. PAS 2060 was withdrawn in November 2025, and the ISO standard is stricter: it requires a hierarchy of actual emissions reductions before offsetting can support a carbon-neutrality claim.",
    },
  ],
};
