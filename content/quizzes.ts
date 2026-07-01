/**
 * Quiz registry. Author quizzes here and reference them from MDX with a simple
 * id: <Quiz id="intro-final" />. Keeping the (structured) quiz data in TypeScript
 * means it's type-checked, reusable, and avoids passing complex objects across
 * the server/client boundary from MDX.
 */

export type QuizQuestion = {
  question: string;
  options: string[];
  /** Index of the correct option in `options`. */
  answer: number;
  /** Optional explanation shown after checking. */
  explanation?: string;
};

export const quizzes: Record<string, QuizQuestion[]> = {
  "intro-final": [
    {
      question:
        "Which statement best describes the difference between energy and power?",
      options: [
        "They are the same thing measured in different units",
        "Power is the rate of energy use; energy is power multiplied by time",
        "Energy is measured in kW and power in kWh",
        "Power is always a larger number than energy",
      ],
      answer: 1,
      explanation:
        "Power (kW) is the instantaneous rate; energy (kWh) accumulates over time. Energy = power × time.",
    },
    {
      question:
        "A 5 kW motor runs continuously for 4 hours. How much energy does it use?",
      options: ["5 kWh", "9 kWh", "20 kWh", "1.25 kWh"],
      answer: 2,
      explanation: "Energy = power × time = 5 kW × 4 h = 20 kWh.",
    },
    {
      question: "One kilowatt-hour (kWh) is equal to:",
      options: ["3.6 MJ", "1,000 J", "100 MJ", "3,600 MJ"],
      answer: 0,
      explanation:
        "1 kW (1000 J/s) running for 3600 s delivers 3,600,000 J = 3.6 MJ.",
    },
    {
      question: "The first law of thermodynamics tells us that:",
      options: [
        "Energy can be created if you supply enough power",
        "Energy is conserved — it is converted, never destroyed",
        "Energy always increases over time",
        "Heat can never be turned into useful work",
      ],
      answer: 1,
      explanation:
        "Energy is conserved (first law). The second law explains why it still degrades in quality with every conversion.",
    },
    {
      question:
        "A project costs £12,000 and saves £4,000 per year. Its simple payback is:",
      options: ["0.33 years", "3 years", "4 years", "8 years"],
      answer: 1,
      explanation:
        "Simple payback = capital cost ÷ annual saving = 12,000 ÷ 4,000 = 3 years.",
    },
    {
      question: "A key limitation of simple payback is that it:",
      options: [
        "Is too complicated for screening projects",
        "Ignores the time value of money and any savings after the payback point",
        "Always overstates the return on a project",
        "Cannot be applied to energy projects",
      ],
      answer: 1,
      explanation:
        "Simple payback ignores cash flows beyond payback and the time value of money — which is why NPV and IRR exist.",
    },
  ],
  "boilers-final": [
    {
      question: "Complete combustion of natural gas requires what ratio of air to fuel?",
      options: [
        "1:1 (equal volumes)",
        "About 10:1 (stoichiometric air requirement)",
        "20:1 or higher (excessive)",
        "No air needed — gas burns on its own",
      ],
      answer: 1,
      explanation:
        "Stoichiometric air is about 10 volumes of air per 1 volume of methane. In practice, you run 10–20% excess air to ensure complete combustion.",
    },
    {
      question:
        "A boiler is found to be running at 12% O₂ in the flue gas. What does this indicate?",
      options: [
        "Excellent combustion efficiency",
        "Too much excess air — wasting energy up the flue",
        "Too little air — incomplete combustion and CO formation",
        "The boiler is broken and needs replacement",
      ],
      answer: 1,
      explanation:
        "12% O₂ is high excess air (target is 3–5%). Each percentage point above optimal costs ~0.1% efficiency.",
    },
    {
      question:
        "Flue-gas temperature is 185 °C on a non-condensing boiler. What is the most likely cause?",
      options: [
        "The boiler is new and working well",
        "The building load is too high",
        "Fouling (soot/scale) or excess air drift is reducing heat transfer",
        "The water temperature is too low",
      ],
      answer: 2,
      explanation:
        "A well-tuned non-condensing boiler runs 140–160 °C flue. 185 °C suggests either dirty tubes (fouling) or excess air creep.",
    },
    {
      question:
        "Continuous blowdown at 3% on a 500 kW boiler costs roughly how much per year in wasted heat?",
      options: [
        "£500 — negligible",
        "£2,000 — minor loss",
        "£5,000–6,000 — significant loss",
        "£15,000 — major loss",
      ],
      answer: 2,
      explanation:
        "3% continuous blowdown wastes ~15 kW of heat (the energy to reheat incoming cold water). At ~£0.10/kWh, that's ~£5,000/year.",
    },
    {
      question:
        "A boiler has a fixed temperature setpoint of 75 °C year-round. What is the main inefficiency?",
      options: [
        "The setpoint is too low",
        "No weather compensation — on mild days, 75 °C is unnecessarily high and wastes energy",
        "The setpoint is too precise",
        "Fixed setpoints are optimal for all buildings",
      ],
      answer: 1,
      explanation:
        "Weather compensation adjusts setpoint to outdoor temperature. On a 15 °C mild day, 50 °C may be sufficient. Running at 75 °C wastes 5–10% of heating energy.",
    },
    {
      question:
        "When is a condensing boiler NOT a good choice, despite high efficiency?",
      options: [
        "When the boiler is small (<100 kW)",
        "When the heating system has high return water temperature (>60 °C)",
        "When the building is new",
        "When fuel is natural gas",
      ],
      answer: 1,
      explanation:
        "Condensing boilers need return water <55 °C to condense. Old systems with large radiators and hot returns won't allow this, so you lose the efficiency benefit.",
    },
  ],
  "hvac-final": [
    {
      question: "What is the main advantage of weather compensation in HVAC?",
      options: [
        "It makes cooling unnecessary",
        "It automatically adjusts heating/cooling setpoint based on outdoor temperature",
        "It eliminates the need for thermostats",
        "It makes the system immune to occupant changes",
      ],
      answer: 1,
      explanation:
        "Weather compensation lowers the setpoint on mild days and raises it on cold days, reducing heating/cooling demand automatically.",
    },
    {
      question: "On a 15 °C mild day in spring, the best HVAC strategy is:",
      options: [
        "Run the boiler at full capacity for safety",
        "Run the chiller to cool to 21 °C",
        "Use outdoor air economizer or free cooling instead of boiler/chiller",
        "Shut off all HVAC and rely on windows",
      ],
      answer: 2,
      explanation:
        "Outdoor air economizer uses outdoor air to meet conditioning needs when outdoor T is between indoor setpoint and zone T — much cheaper than heating/cooling.",
    },
    {
      question: "A VAV (variable-air-volume) system reduces fan energy by:",
      options: [
        "Turning off zones that are satisfied",
        "Throttling dampers to reduce airflow as zones are satisfied, allowing fans to slow down",
        "Using only 50% of the outdoor air",
        "Replacing fans with pumps",
      ],
      answer: 1,
      explanation:
        "VAV dampers close as zones reach setpoint, reducing total flow and duct pressure, allowing the fan to slow and use less energy.",
    },
    {
      question:
        "A building is always 2 °C colder than its 21 °C setpoint. What is the most likely problem?",
      options: [
        "The boiler is broken",
        "The thermostat sensor has drifted and is reading higher than actual",
        "The heating load is too high",
        "The building is too large for the boiler",
      ],
      answer: 1,
      explanation:
        "If the sensor reads 23 °C when the room is actually 21 °C, the controller thinks it's already warm and doesn't heat. Fix: recalibrate sensor.",
    },
    {
      question: "What is latent cooling, and why is it energy-intensive?",
      options: [
        "Cooling in the evening — it's intensive because of solar heat",
        "Cooling the air, then reheating it to remove moisture — you waste energy in the reheat step",
        "Using outdoor air only, with no mechanical cooling",
        "Cooling the building structure before occupancy",
      ],
      answer: 1,
      explanation:
        "To remove moisture, you cool air below its dew point (~8 °C), then reheat to comfort (~20 °C). That reheat is mostly wasted if humidity control is too strict.",
    },
    {
      question: "An economizer is not working on a 10 °C day. What is the problem?",
      options: [
        "The outdoor air is too cold to use",
        "Economizers don't work in spring",
        "The outdoor damper may be stuck, or the control may not recognize the opportunity",
        "Economizers only work in summer",
      ],
      answer: 2,
      explanation:
        "An economizer should be active whenever outdoor T < indoor setpoint. If not, the damper may be stuck or the sensor/control isn't recognizing the opportunity.",
    },
  ],
  "energy-fundamentals-check": [
    {
      question: "The first law of thermodynamics states:",
      options: [
        "Energy is always lost as heat",
        "Energy is conserved — it cannot be created or destroyed, only converted",
        "Heat always flows from cold to hot",
        "Efficiency can approach 100% with perfect design",
      ],
      answer: 1,
      explanation:
        "The first law says energy is conserved. The second law explains why perfect efficiency is impossible (energy degrades in quality).",
    },
    {
      question: "What is the relationship between energy and power?",
      options: [
        "They are the same thing",
        "Energy = power × time",
        "Power = energy × time",
        "Energy is larger than power",
      ],
      answer: 1,
      explanation: "Power (kW) is the rate; energy (kWh) accumulates over time. Energy = power × time.",
    },
    {
      question: "Which unit conversion is correct?",
      options: [
        "1 kWh = 1 MJ",
        "1 kWh = 3.6 MJ",
        "1 kWh = 360 MJ",
        "1 MJ = 3.6 kWh",
      ],
      answer: 1,
      explanation: "1 kW running for 3600 seconds (1 hour) = 3,600,000 J = 3.6 MJ.",
    },
    {
      question: "A 10 kW heater runs for 2 hours. How much energy does it use?",
      options: ["10 kWh", "20 kWh", "5 kWh", "2 kW"],
      answer: 1,
      explanation: "Energy = power × time = 10 kW × 2 h = 20 kWh.",
    },
  ],
  "energy-management-check": [
    {
      question: "The primary business case for energy management is:",
      options: [
        "To comply with regulations",
        "Energy savings go straight to profit, unlike extra sales revenue",
        "To reduce carbon emissions",
        "To improve employee comfort",
      ],
      answer: 1,
      explanation:
        "A £10k energy saving improves profit by £10k (no cost of goods sold). £10k of sales might only add £500 profit at 5% margin.",
    },
    {
      question: "What does the Plan-Do-Check-Act cycle do?",
      options: [
        "Ensures energy projects are completed once",
        "Creates a one-time energy improvement",
        "Enables continuous improvement by repeating the loop",
        "Replaces the need for energy audits",
      ],
      answer: 2,
      explanation: "PDCA is a loop — each lap finds new savings as the baseline rises and controls are refined.",
    },
    {
      question: "Which statement about the energy management cycle is false?",
      options: [
        "Plan includes setting objectives and auditing for opportunities",
        "Do means implementing the chosen measures",
        "Check means verifying that savings are real (M&V)",
        "Act means running the building at higher setpoints for savings",
      ],
      answer: 3,
      explanation: "Act means reviewing performance, standardising what worked, and feeding lessons back into the next Plan. Higher setpoints waste energy.",
    },
    {
      question: "An energy audit typically includes:",
      options: [
        "Only looking at the utility bill",
        "Walk-throughs, measurement, data analysis, and a prioritised register of opportunities",
        "Just replacing old equipment with new",
        "Installing sensors without analysis",
      ],
      answer: 1,
      explanation: "A credible audit has scope, measurement, analysis, and ranked recommendations.",
    },
  ],
  "ac-check": [
    {
      question: "Ohm's law states:",
      options: [
        "V = I / R",
        "V = I × R",
        "P = V / I",
        "V = P × R",
      ],
      answer: 1,
      explanation: "V = I × R (voltage equals current times resistance).",
    },
    {
      question: "Why do buildings use AC instead of DC?",
      options: [
        "It's cheaper to install",
        "It travels long distances efficiently with transformers, and motors run well on AC",
        "DC is unsafe",
        "AC uses less power",
      ],
      answer: 1,
      explanation:
        "AC can be stepped up/down by transformers for efficient distribution. AC motors are simple and reliable.",
    },
    {
      question: "Power factor is the ratio of:",
      options: [
        "Real power to apparent power",
        "Voltage to current",
        "Energy to power",
        "Watts to joules",
      ],
      answer: 0,
      explanation:
        "Power factor = real power / apparent power. A PF <1 means reactive power is being wasted.",
    },
    {
      question: "A poor power factor (say, 0.7) means:",
      options: [
        "The building is using less energy",
        "More current is drawn than needed, wasting energy and incurring utility penalties",
        "The voltage is too high",
        "The building is very efficient",
      ],
      answer: 1,
      explanation:
        "Low PF means reactive power; utilities charge for it, and extra current heats up wiring, wasting energy.",
    },
  ],
  "three-phase-check": [
    {
      question: "In a three-phase system, the three phases are separated by:",
      options: [
        "90 degrees",
        "120 degrees",
        "180 degrees",
        "360 degrees",
      ],
      answer: 1,
      explanation: "Three-phase voltages are 120 degrees apart, creating smooth power delivery.",
    },
    {
      question: "Line voltage in a three-phase system is:",
      options: [
        "The same as phase voltage",
        "Lower than phase voltage",
        "Higher than phase voltage by a factor of √3 (about 1.73)",
        "Unpredictable",
      ],
      answer: 2,
      explanation: "V_line = V_phase × √3. In a 230V system, line voltage is ~400V.",
    },
    {
      question: "Three-phase systems are preferred in industry because:",
      options: [
        "They use less wire",
        "Power delivery is smoother and motors are simpler and more efficient",
        "They are cheaper than single-phase",
        "They deliver more voltage",
      ],
      answer: 1,
      explanation:
        "Three-phase has constant power delivery (no dips like single-phase) and motors have high starting torque.",
    },
  ],
  "electrical-check": [
    {
      question: "Demand charges on a business electricity bill are based on:",
      options: [
        "Total kWh used in the month",
        "The highest power draw in any 30-minute interval",
        "The voltage used",
        "The number of lights in the building",
      ],
      answer: 1,
      explanation:
        "Demand charges penalize peak power. A single 10-minute spike can trigger charges for the whole month.",
    },
    {
      question: "An energy meter typically measures:",
      options: [
        "Only voltage",
        "Only current",
        "Active (real) power in kW/kWh, and often power factor and reactive power",
        "Just the temperature of the building",
      ],
      answer: 2,
      explanation: "Modern meters measure real power, reactive power, and power factor; older ones may measure less.",
    },
    {
      question: "Which is a practical step to reduce electrical demand charges?",
      options: [
        "Turn off all lights at once",
        "Stagger start-ups of large equipment so they don't all switch on together",
        "Use only low-wattage equipment",
        "Ignore the demand charge",
      ],
      answer: 1,
      explanation:
        "Load shifting — spreading start-ups over time — flattens the demand curve and avoids peak charges.",
    },
  ],
  "mt-fundamentals-check": [
    {
      question: "The main goal of Monitoring & Targeting is to:",
      options: [
        "Measure consumption without any action",
        "Turn meter data into continuous energy improvement",
        "Replace energy audits",
        "Reduce comfort for tenants",
      ],
      answer: 1,
      explanation:
        "M&T is about using data to drive action — baselines, targets, and spot anomalies so you improve.",
    },
    {
      question: "Normalisation in M&T means:",
      options: [
        "Making the building operate normally",
        "Adjusting consumption data for changes like weather or business size so you can compare apples-to-apples",
        "Standardizing all meters",
        "Ignoring anomalies in the data",
      ],
      answer: 1,
      explanation:
        "A degree-day adjustment (heating season shorter in mild years) lets you fairly compare year-on-year consumption.",
    },
    {
      question: "Meter data should be collected:",
      options: [
        "Once a year",
        "Whenever you remember",
        "As frequently as possible (monthly, weekly, or even real-time) to spot trends",
        "Never — it wastes time",
      ],
      answer: 2,
      explanation:
        "High-frequency data (daily or real-time) lets you spot changes immediately and investigate quickly.",
    },
    {
      question: "Which is the best interval for comparing energy consumption?",
      options: [
        "Just comparing total annual figures",
        "Comparing individual days (weather varies too much)",
        "Comparing weeks or months, normalized for weather and business changes",
        "Comparing hours (too much noise)",
      ],
      answer: 2,
      explanation:
        "Weekly or monthly intervals smooth out daily variations while staying frequent enough to spot trends.",
    },
  ],
  "baselines-check": [
    {
      question: "An energy baseline is:",
      options: [
        "The lowest energy a building could use",
        "A normalized reference period of consumption against which improvements are measured",
        "The energy used on the coldest day",
        "An auditor's opinion",
      ],
      answer: 1,
      explanation:
        "A baseline is a calculated reference (usually averaged and normalized) that represents 'no improvements'.",
    },
    {
      question: "An energy signature relates:",
      options: [
        "The building's name to energy use",
        "Energy consumption to external drivers like temperature, production volume, or occupancy",
        "The utility company to the building owner",
        "Equipment serial numbers",
      ],
      answer: 1,
      explanation:
        "An energy signature shows how consumption changes with drivers (e.g., more heating load on cold days).",
    },
    {
      question: "A regression analysis on energy data helps you:",
      options: [
        "Complain to the utility",
        "Quantify how much a change in driver (temperature, production) affects energy use",
        "Find who's responsible for waste",
        "Calculate the cost of fuel",
      ],
      answer: 1,
      explanation:
        "Regression finds the relationship: 'For every °C colder, heating increases by X kWh.' This lets you isolate true savings.",
    },
    {
      question: "When decomposing a change in consumption, you separate:",
      options: [
        "Real savings from changes in weather, production, or occupancy",
        "Heating from cooling",
        "Fixed from variable costs",
        "Old from new equipment",
      ],
      answer: 0,
      explanation:
        "If consumption dropped 10% but the building was 20% less occupied, true savings are hidden. Decomposition finds them.",
    },
  ],
  "targeting-check": [
    {
      question: "A good energy target should be:",
      options: [
        "As low as possible, even if unrealistic",
        "Based on the previous year, unchanged",
        "Ambitious but achievable, based on efficiency improvements and business growth",
        "The same for all buildings",
      ],
      answer: 2,
      explanation:
        "A target should stretch the team but be credible — usually a % reduction from baseline, accounting for growth.",
    },
    {
      question: "Exception reporting in M&T means:",
      options: [
        "Reporting only to the CEO",
        "Identifying when consumption is higher than expected and investigating why",
        "Ignoring small deviations",
        "Reporting only bad news",
      ],
      answer: 1,
      explanation:
        "Exception reporting flags anomalies: 'This week's consumption is 15% above baseline. Why? Let's investigate.'",
    },
    {
      question: "The best way to communicate energy data is:",
      options: [
        "Raw meter readings in kWh",
        "Dashboards with visualizations, trends, targets, and actionable insights",
        "Lengthy reports with no charts",
        "Not at all — keep it secret",
      ],
      answer: 1,
      explanation:
        "Visual dashboards with trends, targets, and anomalies are much more engaging and drive action than raw numbers.",
    },
  ],
  "energy-legislation-check": [
    {
      question: "ESOS applies to:",
      options: [
        "All buildings",
        "Large undertakings (usually 250+ employees or >€50M turnover) and large energy users",
        "Only government buildings",
        "Only industrial sites",
      ],
      answer: 1,
      explanation:
        "ESOS is for large undertakings. If you're covered, you must audit at least every 4 years (next deadline 2027).",
    },
    {
      question: "What must ESOS audits cover?",
      options: [
        "Only the office",
        "All significant energy-using systems in buildings and industry",
        "Just the boiler",
        "Whatever the auditor chooses",
      ],
      answer: 1,
      explanation:
        "ESOS audits are comprehensive — all buildings, industrial facilities, transport, and cross-organisational systems.",
    },
    {
      question: "SECR requires organisations to report:",
      options: [
        "Only if they want to",
        "Energy consumption and carbon emissions in company accounts (if >500 staff or non-UK standard large undertaking)",
        "Only to the government",
        "Only electricity, not gas",
      ],
      answer: 1,
      explanation:
        "SECR is mandatory disclosure for certain sizes; it's in the notes to the financial statements and a separate report.",
    },
    {
      question: "The reporting deadline for SECR is:",
      options: [
        "Whenever you finish the audit",
        "4 months after the financial year-end",
        "Only annually if you feel like it",
        "At the director's discretion",
      ],
      answer: 1,
      explanation: "SECR must be reported within 4 months of the financial year-end (part of statutory accounts filing).",
    },
  ],
  "costs-check": [
    {
      question: "The Climate Change Levy is:",
      options: [
        "A voluntary scheme",
        "A tax on business use of energy (electricity, gas, fuel) to incentivise efficiency",
        "A discount for large users",
        "Only applied to coal",
      ],
      answer: 1,
      explanation:
        "CCL is a tax; large energy users can reduce it via a Climate Change Agreement (CCA) by meeting energy targets.",
    },
    {
      question: "Which fuel is exempt from the Climate Change Levy?",
      options: [
        "Natural gas",
        "Electricity",
        "Renewable sources (solar, wind, hydro)",
        "Coal",
      ],
      answer: 2,
      explanation:
        "CCL exempts renewables to encourage clean energy. Fossil fuels (gas, electricity from fossil fuels, coal, oil) are all charged.",
    },
    {
      question: "The Energy Company Obligation (ECO) requires:",
      options: [
        "Consumers to insulate their homes",
        "Energy suppliers to deliver efficiency measures to low-income and vulnerable households",
        "Businesses to use less energy",
        "Generators to produce only green power",
      ],
      answer: 1,
      explanation:
        "ECO is a supplier obligation — they must fund/deliver insulation, heating, and other efficiency to eligible households.",
    },
  ],
  "policy-check": [
    {
      question: "The UK's carbon budgets set:",
      options: [
        "The price of carbon",
        "Mandatory CO₂ reduction targets for 5-year periods that all sectors must meet",
        "Only goals for large companies",
        "No legal obligation",
      ],
      answer: 1,
      explanation:
        "Carbon budgets are legally binding 5-year targets. The 6th carbon budget (2033–2037) requires 81% cuts vs 1990.",
    },
    {
      question: "What does an Energy Performance Certificate (EPC) rate?",
      options: [
        "The efficiency of a building's HVAC system",
        "The likely energy costs and carbon emissions of a building on a scale A–G",
        "Only electricity consumption",
        "The age of the building",
      ],
      answer: 1,
      explanation:
        "EPCs rate buildings A–G (A is most efficient). They're required for sales/lettings and inform Minimum Energy Efficiency Standards.",
    },
    {
      question: "Minimum Energy Efficiency Standards (MEES) require:",
      options: [
        "All buildings to be net zero by 2030",
        "Rented buildings to meet minimum EPC ratings or be delisted (with exceptions for hardship)",
        "Only new buildings to be efficient",
        "No changes — it's voluntary",
      ],
      answer: 1,
      explanation:
        "MEES requires private rented buildings to be EPC 'E' or better. Non-compliance can lead to fines and eviction.",
    },
    {
      question: "The UK's path to net zero involves:",
      options: [
        "No specific targets",
        "Electrification of heating, decarbonisation of electricity, and efficiency improvements across all sectors",
        "Only wind power",
        "Banning all fossil fuels immediately",
      ],
      answer: 1,
      explanation:
        "Net zero combines: clean electricity (renewables), heat pumps replacing gas boilers, energy efficiency, and hydrogen in industry/shipping.",
    },
  ],
  "audit-planning-check": [
    {
      question: "The main purpose of an energy audit is to:",
      options: [
        "Measure the building's total energy use",
        "Identify and quantify energy-saving opportunities with a business case for each",
        "Determine the building's age",
        "Check compliance with building regulations",
      ],
      answer: 1,
      explanation:
        "An audit finds inefficiencies and quantifies savings. It's the foundation for investment decisions.",
    },
    {
      question: "Which is an example of a walk-through audit?",
      options: [
        "Detailed metering and analysis of all systems over 3 months",
        "Quick visual inspection (hours) to spot obvious inefficiencies",
        "ISO 50001 certification process",
        "Utility bill analysis only",
      ],
      answer: 1,
      explanation:
        "A walk-through is quick and preliminary, identifying obvious issues. Detailed audits follow for major opportunities.",
    },
    {
      question: "An investment-grade audit differs from a detailed audit in that it:",
      options: [
        "Is cheaper",
        "Uses more rigorous measurement and analysis to justify large capital investment",
        "Takes less time",
        "Doesn't require walk-throughs",
      ],
      answer: 1,
      explanation:
        "Investment-grade audits are thorough and defensible; they justify financing decisions on projects over 100k GBP.",
    },
  ],
  "on-site-check": [
    {
      question: "During a walk-through, what should you prioritise checking?",
      options: [
        "Only the mechanical room",
        "Envelope condition, HVAC age, controls, maintenance history, and major energy-using systems",
        "Just the lights and switches",
        "Only the roof",
      ],
      answer: 1,
      explanation:
        "A good walk-through covers all energy-using areas: envelope, heating/cooling, lighting, controls, and equipment condition.",
    },
    {
      question: "Why is measurement important in an audit, even if you have utility bills?",
      options: [
        "To verify utility bill accuracy",
        "To sub-meter key systems, understand daily/hourly patterns, and isolate where energy is really going",
        "To satisfy the utility company",
        "It isn't — bills are always enough",
      ],
      answer: 1,
      explanation:
        "Bills show totals monthly. Measurement reveals patterns: when systems run, which zones are warm/cool, where losses occur.",
    },
    {
      question: "What information from stakeholder interviews is most valuable?",
      options: [
        "Only their electricity rate",
        "Complaints, past issues, maintenance history, occupancy patterns, and future plans",
        "Their annual budget",
        "Nothing — interviews waste time",
      ],
      answer: 1,
      explanation:
        "Stakeholders know what's broken, when things were fixed, occupancy, and planned expansions — all critical for audit accuracy.",
    },
  ],
  "analysis-check": [
    {
      question: "What does normalising audit data do?",
      options: [
        "Makes all numbers the same",
        "Adjusts consumption for weather and occupancy so you can compare to other buildings",
        "Reduces the amount of data",
        "Nothing — raw data is always comparable",
      ],
      answer: 1,
      explanation:
        "Normalisation accounts for heating season differences, occupancy changes, etc., so your baseline is fair.",
    },
    {
      question: "When ranking audit opportunities, the most important metric is:",
      options: [
        "Payback period (cost divided by annual savings)",
        "Total savings in kWh",
        "Simplicity to implement",
        "The manager's preference",
      ],
      answer: 0,
      explanation:
        "Simple payback (typically less than 3–5 years) tells you how fast the investment pays for itself.",
    },
    {
      question: "An audit report should include:",
      options: [
        "Only a list of recommendations",
        "Executive summary, findings, ranked opportunities, cost and savings for each, and financial summary",
        "Just kWh savings",
        "Only technical details",
      ],
      answer: 1,
      explanation:
        "A good report is executive-friendly (summary), technically sound (findings), and actionable (ranked, costed recommendations).",
    },
  ],
  "generation-check": [
    {
      question: "Latent heat in steam is important because:",
      options: [
        "It's used to heat the water",
        "It's the energy released when steam condenses to water — a large part of steam's usefulness",
        "It's not important",
        "It only applies to superheated steam",
      ],
      answer: 1,
      explanation:
        "Latent heat is ~2,250 kJ/kg at 100°C — why steam is such an efficient heat transfer medium. When it condenses, that energy is released.",
    },
    {
      question: "Flash steam occurs when:",
      options: [
        "Steam is heated further",
        "Condensate cools down",
        "Pressure drops suddenly, and some of the hot condensate (or water) vaporises at the lower pressure",
        "A trap fails",
      ],
      answer: 2,
      explanation:
        "Pressure drop from, say, 10 bar to 1 bar causes some of the hot water to flash to steam. This steam is usually wasted.",
    },
    {
      question: "The economical thickness of pipe insulation is where:",
      options: [
        "Maximum insulation is used",
        "No insulation is needed",
        "Heat loss cost plus insulation cost are minimised together",
        "Insulation costs are lowest",
      ],
      answer: 2,
      explanation:
        "Adding insulation saves heat loss (saves money), but at some point the added cost exceeds the savings. That's the optimum.",
    },
  ],
  "traps-check": [
    {
      question: "A thermostatic trap works by:",
      options: [
        "Floating on steam",
        "Responding to temperature — opening to let cool condensate through, closing on steam",
        "A mechanical bucket that inverts",
        "A bimetallic strip that bends",
      ],
      answer: 1,
      explanation:
        "Thermostatic traps sense temperature. Cool condensate opens the valve; hot steam (or condensate near saturation) closes it.",
    },
    {
      question: "A failed steam trap (stuck open) results in:",
      options: [
        "No condensate leaving",
        "Steam escaping with the condensate, wasting energy and potentially killing the system",
        "Better heating",
        "Lower pressure",
      ],
      answer: 1,
      explanation:
        "A stuck-open trap lets steam blow through, losing the heat that was meant to be transferred. A major waste.",
    },
    {
      question: "Condensate return is valuable because:",
      options: [
        "It reduces corrosion in the boiler",
        "It's hot water that can be reused, and flash steam can be captured for additional heating",
        "It eliminates the need for a boiler",
        "It prevents leaks",
      ],
      answer: 1,
      explanation:
        "Returned condensate at 80–90°C reduces the energy needed to re-boil it (vs. cold feed water at 15°C). Flash steam is a bonus.",
    },
  ],
  "steam-check": [
    {
      question: "How do you detect a failed trap in the field?",
      options: [
        "Listen for hissing near the trap",
        "Feel for excessive heat with your hand (or infrared), or test condensate for steam",
        "Check the trap age",
        "Ask the building operator",
      ],
      answer: 1,
      explanation:
        "A failed trap (stuck open) will be hot to touch and may hiss. Condensate from a failed trap contains steam.",
    },
    {
      question: "The main efficiency loss in a steam system is usually from:",
      options: [
        "The boiler itself",
        "Failed or failing traps, distribution losses (insulation), and flash steam at pressure reduction",
        "The piping material",
        "The condensate pump",
      ],
      answer: 1,
      explanation:
        "Trap failure (can be 30% of steam losses) and distribution losses (insulation) are the biggest wins in steam efficiency.",
    },
    {
      question: "Optimising operating pressure saves energy by:",
      options: [
        "Running the boiler harder",
        "Reducing flash steam losses at pressure reduction and lowering flue losses",
        "Using smaller pipes",
        "Running fewer traps",
      ],
      answer: 1,
      explanation:
        "Lower pressure reduces the pressure drop needed to reach use points, minimising flash steam. It also lowers boiler flue losses.",
    },
  ],
  "payback-check": [
    {
      question: "Simple payback is useful because:",
      options: [
        "It's always the best metric for comparing projects",
        "It's quick to calculate and tells you how fast money is recovered, but ignores time value",
        "It accounts for inflation and discount rates",
        "It's required by all financial institutions",
      ],
      answer: 1,
      explanation:
        "Payback = cost / annual savings. Fast to calculate, but treats a £1 saved in year 1 the same as year 10.",
    },
    {
      question: "Time value of money means:",
      options: [
        "Money should be saved in the bank",
        "A pound today is worth more than a pound tomorrow because it can be invested and earn returns",
        "Inflation destroys all purchasing power",
        "Future cash flows are always uncertain",
      ],
      answer: 1,
      explanation:
        "At a 5% discount rate, £100 in one year is worth £95.24 today (because £95.24 invested at 5% grows to £100).",
    },
    {
      question: "NPV (Net Present Value) is:",
      options: [
        "The total profit a project makes",
        "The sum of all future cash flows discounted to today at a chosen discount rate, minus the initial cost",
        "The payback period of a project",
        "The average profit per year",
      ],
      answer: 1,
      explanation:
        "If NPV > 0, the project earns more than your discount rate (hurdle rate) and is worth doing. NPV = 0 is the break-even point.",
    },
    {
      question: "IRR (Internal Rate of Return) is:",
      options: [
        "The interest rate charged on a loan",
        "The discount rate at which NPV = 0 (the project's true rate of return)",
        "The inflation rate",
        "The cost of capital for the organisation",
      ],
      answer: 1,
      explanation:
        "If IRR > hurdle rate, accept the project. IRR is useful for comparing projects on an equal footing.",
    },
  ],
  "lifecycle-check": [
    {
      question: "Total cost of ownership includes:",
      options: [
        "Just the purchase price",
        "Capital cost, operating cost, maintenance, replacement, and residual value",
        "Only energy costs",
        "Just labour cost",
      ],
      answer: 1,
      explanation:
        "An LED bulb costs more upfront but uses 75% less energy and lasts 25,000 hours vs 1,000 for incandescent. TCO is much lower.",
    },
    {
      question: "A condensing boiler has higher capital cost but lower operating cost. Over 15 years:",
      options: [
        "The conventional boiler is always cheaper",
        "The condensing boiler usually has lower total cost due to energy savings",
        "They cost the same",
        "Operating cost doesn't matter",
      ],
      answer: 1,
      explanation:
        "Condensing boiler: 90% efficient, higher cost. Conventional: 85% efficient, lower cost. Over 15 years, condensing's 5% efficiency gain saves more than capital premium.",
    },
    {
      question: "When comparing LED to halogen lighting, you should account for:",
      options: [
        "Only the bulb cost",
        "Bulb cost, energy cost, maintenance (labour), lifespan, and replacement frequency",
        "Only labour cost",
        "Just energy cost",
      ],
      answer: 1,
      explanation:
        "LED: 50 GBP upfront, 10W, 50,000-hour life. Halogen: 5 GBP, 60W, 2,000-hour life. LCC heavily favours LED when you count replacements and energy.",
    },
  ],
  "economic-check": [
    {
      question: "A portfolio approach to energy projects means:",
      options: [
        "Doing all projects at once",
        "Considering not just financial metrics but also risk, certainty, co-benefits, and strategic alignment",
        "Always picking the highest payback first",
        "Ignoring projects with long payback",
      ],
      answer: 1,
      explanation:
        "A 3-year payback with high certainty might be preferred over a 2-year with high risk. A low-payback project might have co-benefits (health, safety).",
    },
    {
      question: "If you can borrow money at 3% interest but your discount rate is 5%, borrowing to fund a project with 4% IRR is:",
      options: [
        "Always a good idea",
        "Not worth doing (4% return < 5% hurdle rate), even though loan rate is 3%",
        "Always breaks even",
        "Only good if cash flows are certain",
      ],
      answer: 1,
      explanation:
        "Your hurdle rate (5%) is your cost of capital. A 4% project doesn't meet it, regardless of the loan rate. You'd be earning less than you require.",
    },
    {
      question: "Performance contracts and ESCO models appeal because:",
      options: [
        "They're always cheaper than self-funding",
        "They shift risk to the energy service provider; you pay from the savings they generate",
        "They guarantee savings",
        "They have no risk",
      ],
      answer: 1,
      explanation:
        "ESCO funds the retrofit, guarantees savings, and is paid from those savings. Reduces upfront capital and risk to you, but costs more than cash purchase.",
    },
  ],
  "motor-check": [
    {
      question: "Motor efficiency class IE3 vs IE2 means:",
      options: [
        "IE3 is cheaper",
        "IE3 uses significantly less energy, especially at part load",
        "There's no difference in efficiency",
        "IE3 is only for three-phase motors",
      ],
      answer: 1,
      explanation:
        "IE3 (Premium Efficiency) motors are 2–3% more efficient than IE2. Over a motor's 10+ year life, this saves substantial energy and cost.",
    },
    {
      question: "A 50 kW motor running at 25 kW load (half capacity) is inefficient because:",
      options: [
        "It can't run at half load",
        "Oversized motors have poor power factor and low efficiency at part load",
        "Half load isn't possible in practice",
        "The motor breaks down",
      ],
      answer: 1,
      explanation:
        "Oversized motors draw excess reactive power and have poor efficiency at part load. Matching motor size to load improves both.",
    },
    {
      question: "Motor slip (the difference between synchronous and actual speed) causes:",
      options: [
        "The motor to overheat",
        "Energy losses as heat in the rotor; higher slip = higher losses, lower efficiency",
        "The motor to vibrate",
        "The load to run faster",
      ],
      answer: 1,
      explanation:
        "Slip is necessary for a motor to produce torque, but it's an efficiency loss. Minimising slip (using better motors, lower loads) saves energy.",
    },
  ],
  "vfd-check": [
    {
      question: "The main benefit of a VFD on a pump or fan is:",
      options: [
        "It makes the motor louder",
        "It matches motor speed to load demand instead of running full-speed with a valve/damper",
        "It increases power factor automatically",
        "It eliminates the need for maintenance",
      ],
      answer: 1,
      explanation:
        "A pump at half speed uses 1/8 the power (cube law). A damper at half capacity still wastes 7/8. VFD saves dramatically.",
    },
    {
      question: "VFD payback is typically shortest for:",
      options: [
        "Motors running only a few hours per year",
        "Large motors running continuously with variable load (pumps, fans)",
        "Fixed-load equipment",
        "Single-phase motors",
      ],
      answer: 1,
      explanation:
        "VFD savings = (power reduction) × (hours per year) × (energy rate). Large, variable-load, continuous-run applications save the most.",
    },
    {
      question: "Harmonic filtering on a VFD is important because:",
      options: [
        "It makes the motor quieter",
        "VFDs generate harmonics that distort voltage and interfere with other equipment; filters reduce these",
        "It's required by law",
        "It increases motor efficiency",
      ],
      answer: 1,
      explanation:
        "VFDs switch on/off at high frequency, creating harmonics. These distort the voltage waveform, causing overheating in transformers and other equipment.",
    },
  ],
  "motors-electrical-check": [
    {
      question: "Poor power factor (say, 0.8 vs 0.95) costs money because:",
      options: [
        "It increases utility charges for reactive power and causes utility penalties",
        "It makes the motor spin slower",
        "It reduces the motor's lifespan",
        "It has no real cost",
      ],
      answer: 0,
      explanation:
        "Utilities charge for apparent power (kVA) in many tariffs. Low PF means higher kVA for the same kW, so higher charges.",
    },
    {
      question: "Demand charges on an electricity bill are based on:",
      options: [
        "Total kWh per month",
        "The highest power draw in any 30-minute interval (or similar period)",
        "The average power",
        "The number of motors",
      ],
      answer: 1,
      explanation:
        "A single spike to 100 kW for 30 minutes can set your demand charge for the whole month. Flattening demand peaks saves significantly.",
    },
    {
      question: "Soft starters reduce demand peaks by:",
      options: [
        "Starting the motor slowly to limit inrush current instead of hard-starting",
        "Reducing the motor's speed",
        "Adding capacitors",
        "Running the motor less often",
      ],
      answer: 0,
      explanation:
        "Hard-starting a large motor can draw 6–7× rated current briefly. Soft starters ramp up voltage gradually, reducing inrush and demand charges.",
    },
  ],
  "whr-fundamentals-check": [
    {
      question: "The most valuable waste heat to recover is usually from:",
      options: [
        "Boiler flue gas (200°C+)",
        "Chiller condenser (50°C)",
        "Equipment at moderate temperature with a nearby thermal load",
        "Ambient air",
      ],
      answer: 2,
      explanation:
        "High-temperature waste heat is valuable, but recovery tech is expensive. Medium-temp with nearby load (e.g., 60°C condenser + DHW demand) is the sweet spot.",
    },
    {
      question: "A waste heat recovery project payback depends on:",
      options: [
        "Waste heat temperature only",
        "Waste heat availability, nearby thermal demand, equipment cost, energy prices",
        "Just equipment cost",
        "Never economical",
      ],
      answer: 1,
      explanation:
        "If waste heat source runs 24/7 but thermal sink only 4h/day, utilisation is poor and payback is long.",
    },
    {
      question: "Heat recovery effectiveness describes:",
      options: [
        "How much money is saved",
        "The fraction of available temperature difference actually recovered",
        "The size of the heat exchanger",
        "The efficiency of the pump",
      ],
      answer: 1,
      explanation:
        "A 50°C waste stream and 20°C cold stream have a 30°C potential. 85% effectiveness means you recover 85% of that, reaching ~45.5°C.",
    },
  ],
  "whr-technologies-check": [
    {
      question: "Plate heat exchangers are preferred for waste heat recovery because:",
      options: [
        "They are cheapest",
        "High effectiveness, compact, low fouling risk, easy cleaning",
        "They work at any temperature",
        "They never need maintenance",
      ],
      answer: 1,
      explanation:
        "Plate exchangers have high surface area in small volume, good for liquid-to-liquid heat transfer.",
    },
    {
      question: "Enthalpy recovery ventilation (ERV) recovers:",
      options: [
        "Only sensible heat",
        "Only latent heat (moisture)",
        "Both sensible and latent heat from exhaust air",
        "No heat; it just filters air",
      ],
      answer: 2,
      explanation:
        "ERV recovers both temperature and humidity from exhaust, improving comfort and reducing dehumidification load.",
    },
    {
      question: "Flash steam recovery from condensate is valuable because:",
      options: [
        "It's hot water",
        "Steam at lower pressure can be used for lower-temp loads, avoiding waste",
        "It's free electricity",
        "It eliminates the need for a boiler",
      ],
      answer: 1,
      explanation:
        "Condensate at 95°C returning through a restriction flashes 5-10% to steam at atmospheric pressure, usable for low-pressure heating.",
    },
  ],
  "whr-optimization-check": [
    {
      question: "Recovering heat from a boiler flue (condensing retrofit) saves energy by:",
      options: [
        "Making the boiler smaller",
        "Capturing latent heat from flue gas, raising feedwater temperature, reducing fuel needed",
        "Installing a fan",
        "Using less fuel to start",
      ],
      answer: 1,
      explanation:
        "Flue gas at 200°C condenses when cooled, releasing ~2,250 kJ/kg latent heat; recovering this saves 5-10% of boiler fuel.",
    },
    {
      question: "A chiller condenser recovery system uses recovered heat for:",
      options: [
        "Space heating in winter only",
        "Domestic hot water, space heating, or pre-heating cooling water (simultaneous heating + cooling)",
        "Dehumidification",
        "Refrigerant cooling",
      ],
      answer: 1,
      explanation:
        "In summer, you're cooling and heating simultaneously (chilling + DHW), so condenser heat is immediately useful.",
    },
    {
      question: "Industrial process heat recovery payback is typically longest when:",
      options: [
        "Process runs continuously",
        "Process runs intermittently or seasonally, utilisation is low",
        "The facility is large",
        "The waste is very hot",
      ],
      answer: 1,
      explanation:
        "If a process runs 3 months/year, heat recovery equipment sits idle 9 months; payback stretches significantly.",
    },
  ],
  "ctrl-fundamentals-check": [
    {
      question: "A feedback control loop requires:",
      options: [
        "Only a setpoint",
        "Setpoint, sensor, controller, actuator",
        "Just an actuator",
        "No sensor; open-loop only",
      ],
      answer: 1,
      explanation:
        "Feedback loop: measure (sensor) actual value, compare to setpoint, adjust (actuator) until error is zero.",
    },
    {
      question: "PID control is more sophisticated than on-off because:",
      options: [
        "It's more expensive",
        "It proportionally adjusts actuator based on error, integral (offset), and rate of change (deadbeat)",
        "It uses electricity",
        "It's older technology",
      ],
      answer: 1,
      explanation:
        "On-off is bang-bang (on or off). PID smoothly modulates to the required output, reducing overshoot and energy waste.",
    },
    {
      question: "Cascade control is useful when:",
      options: [
        "You have one sensor",
        "A controlled variable affects another; inner loop controls fast response, outer loop sets demand",
        "You want to save money",
        "There are no actuators",
      ],
      answer: 1,
      explanation:
        "Example: BMS sets heating demand, lower-level loop controls valve position based on actual flow.",
    },
  ],
  "ctrl-sensors-check": [
    {
      question: "An RTD (resistance temperature detector) is preferred in many HVAC applications because:",
      options: [
        "It's the cheapest option",
        "Accurate, linear, good repeatability, not affected by vibration",
        "It never needs calibration",
        "It works at any temperature",
      ],
      answer: 1,
      explanation:
        "RTDs (Pt100, Pt1000) are industry standard; thermocouples are for higher temps; NTC thermistors for simple applications.",
    },
    {
      question: "A humidity sensor (RH) placed near a window in winter is problematic because:",
      options: [
        "It's always wet",
        "Cold window surface affects local RH, sensor reading is unrepresentative of space average",
        "Humidity is constant in winter",
        "RH sensors don't work in winter",
      ],
      answer: 1,
      explanation:
        "Sensor placement affects reading; RH sensor should be away from thermal extremes and draught.",
    },
    {
      question: "Actuator authority (valve) describes:",
      options: [
        "The brand of the valve",
        "The fraction of pressure drop across the valve vs total system; 0.3-0.5 is typical",
        "How fast the actuator moves",
        "The size of the pipe",
      ],
      answer: 1,
      explanation:
        "Low authority (e.g., 0.1) means tiny pressure drop across valve; changes have little effect. Authority should be 0.3-0.5.",
    },
  ],
  "ctrl-bms-check": [
    {
      question: "BACnet is important in BMS because:",
      options: [
        "It's a type of sensor",
        "It's an open standard protocol for inter-device communication, vendor-neutral",
        "It's a control mode",
        "It's a pipe material",
      ],
      answer: 1,
      explanation:
        "BACnet allows boiler, chiller, VAV, and lighting from different makers to talk to one BMS without proprietary bridges.",
    },
    {
      question: "Setpoint reset (or reset) in a BMS adjusts setpoint based on:",
      options: [
        "Time of day only",
        "External driver (outdoor temp, demand) to optimise performance without manual changes",
        "Random selection",
        "The occupant's mood",
      ],
      answer: 1,
      explanation:
        "Example: Heating setpoint rises from 16°C on mild days to 20°C on cold days, matching load and saving energy.",
    },
    {
      question: "A BMS alarming strategy should:",
      options: [
        "Alert on every small deviation",
        "Distinguish critical faults from minor deviations; alert only for actionable issues",
        "Never alert; silent operation",
        "Alert every 5 minutes",
      ],
      answer: 1,
      explanation:
        "Too many alarms → alarm fatigue → operators ignore real problems. Alarm thresholds should be meaningful.",
    },
  ],
  "commx-fundamentals-check": [
    {
      question: "Commissioning differs from testing because:",
      options: [
        "They are the same thing",
        "Commissioning verifies design intent delivered; testing just checks if something works",
        "Commissioning is cheaper",
        "Commissioning is only for new buildings",
      ],
      answer: 1,
      explanation:
        "Testing: does the pump run? Commissioning: does it deliver the right flow at the right pressure for the load?",
    },
    {
      question: "A commissioning plan should cover:",
      options: [
        "Just the HVAC system",
        "Scope (systems), procedures, acceptance criteria, team roles, schedule, documentation",
        "Only new equipment",
        "Just the electrical system",
      ],
      answer: 1,
      explanation:
        "Good commissioning is holistic: defines what will be tested, how, by whom, and what 'pass' looks like.",
    },
    {
      question: "ETICS (existing building commissioning) is important because:",
      options: [
        "New buildings always work perfectly",
        "Retrofit commissioning can unlock 10-30% energy savings in existing buildings",
        "It's a legal requirement",
        "It's only for historic buildings",
      ],
      answer: 1,
      explanation:
        "Most buildings have control drift, sensor drift, or poor sequences post-commissioning. ETICS fixes these.",
    },
  ],
  "commx-onsite-check": [
    {
      question: "Flow balancing in HVAC commissioning ensures:",
      options: [
        "The pump is big enough",
        "Each zone/terminal receives designed flow rate (setpoint); unbalanced systems waste energy and cause complaints",
        "The pipes are clean",
        "The compressor works",
      ],
      answer: 1,
      explanation:
        "Without balancing, low-resistance zones get all the flow; high-resistance zones starve. Over-pumping wastes energy.",
    },
    {
      question: "Sensor calibration during commissioning is critical because:",
      options: [
        "It's nice to have",
        "Wrong sensor readings cause control errors, setpoint drift, and wasted energy",
        "Sensors never drift",
        "Calibration is only for thermometers",
      ],
      answer: 1,
      explanation:
        "A temperature sensor 2°C high means heating stays off 2°C too long; over time, this degrades performance.",
    },
    {
      question: "Control sequence testing verifies that:",
      options: [
        "The BMS exists",
        "Control logic executes as designed (if temp high, cool; if low, heat; etc.)",
        "The thermostat is present",
        "The building is insulated",
      ],
      answer: 1,
      explanation:
        "Many systems have logic errors in the sequence (e.g., heating and cooling simultaneously), only discovered in testing.",
    },
  ],
  "commx-persistence-check": [
    {
      question: "Control drift post-commissioning typically causes:",
      options: [
        "Nothing; systems remain perfect",
        "Gradual performance loss (sensor drift, setpoint creep, logic degradation) if not monitored",
        "Immediate failure",
        "Comfort improvement",
      ],
      answer: 1,
      explanation:
        "Without re-commissioning, a 12-month degradation of 5-15% is common; the system 'drifts' away from design.",
    },
    {
      question: "Continuous commissioning means:",
      options: [
        "Commissioning the building once",
        "Ongoing monitoring and re-commissioning cycle to maintain performance over time",
        "Never commissioning",
        "Hiring permanent staff just for commissioning",
      ],
      answer: 1,
      explanation:
        "Continuous commissioning is data-driven and proactive; trend analysis alerts to drift before occupants complain.",
    },
    {
      question: "Handover documentation should include:",
      options: [
        "Just the equipment list",
        "As-built drawings, operation manuals, control sequences, maintenance schedules, staff training sign-off",
        "Only the warranty",
        "Just the invoice",
      ],
      answer: 1,
      explanation:
        "Complete handover documentation ensures operators can maintain the system and troubleshoot without the commissioning team.",
    },
  ],
  "refr-fundamentals-check": [
    {
      question: "In a vapour-compression refrigeration cycle, the compressor:",
      options: [
        "Removes refrigerant from the system",
        "Raises refrigerant pressure and temperature so it condenses and rejects heat",
        "Cools the refrigerant",
        "Stores refrigerant",
      ],
      answer: 1,
      explanation:
        "Compressor raises pressure (e.g., 5 bar → 20 bar), raising saturation temperature so heat can be rejected at ambient.",
    },
    {
      question: "Superheat in the evaporator ensures:",
      options: [
        "The refrigerant boils completely so no liquid reaches the compressor (damage)",
        "The system is more efficient",
        "The cycle is easier to understand",
        "The evaporator is larger",
      ],
      answer: 0,
      explanation:
        "Liquid slugging (liquid to compressor) is catastrophic; superheat keeps evaporator outlet gas, protecting compressor.",
    },
    {
      question: "A P-h diagram is useful because it:",
      options: [
        "Shows the pressure and enthalpy at every point in the cycle; allows calculation of cooling capacity and work",
        "Is mandatory by law",
        "Replaces the need for sensors",
        "Predicts equipment cost",
      ],
      answer: 0,
      explanation:
        "Reading a P-h diagram: find your cycle points (saturation line, superheat, subcooling), measure enthalpy drops to find cooling capacity.",
    },
  ],
  "heatpump-check": [
    {
      question: "In heat pump heating mode, the evaporator is:",
      options: [
        "Inside the building",
        "Outside (absorbing heat from outdoor air, ground, or water)",
        "In the boiler",
        "Nonexistent in heating mode",
      ],
      answer: 1,
      explanation:
        "Heat pump reverses the cycle: outdoor unit is evaporator (absorbs heat), indoor unit is condenser (rejects heat).",
    },
    {
      question: "COP (coefficient of performance) of 3 means:",
      options: [
        "The heat pump uses 3 kW input",
        "For every 1 kW of compressor work, 3 kW of heating is delivered",
        "The system is 300% efficient (impossible)",
        "The heat pump is cheap",
      ],
      answer: 1,
      explanation:
        "COP = heat delivered / work input. COP 3 is realistic at moderate temperature lift (e.g., 55°C output, 10°C input).",
    },
    {
      question: "Heat pump efficiency drops significantly when:",
      options: [
        "Outdoor temperature is mild",
        "Outdoor temperature is very cold (large temperature lift) or part-load demand is low",
        "The unit is new",
        "The building is insulated",
      ],
      answer: 1,
      explanation:
        "COP degrades as outdoor temp drops (larger lift needed); at -15°C, COP might drop to 2.0 vs 3.5 at 5°C.",
    },
  ],
  "refr-systems-check": [
    {
      question: "A split AC unit (mini-split) has indoor and outdoor units connected by:",
      options: [
        "Electrical cable only",
        "Refrigerant lines (liquid and gas), electrical cable, and drain line",
        "Water pipes",
        "Ductwork",
      ],
      answer: 1,
      explanation:
        "Refrigerant piping is critical; poor installation (leaks, restrictions) ruins efficiency. Charging errors are common.",
    },
    {
      question: "A ground-source heat pump (GSHP) is more efficient than air-source because:",
      options: [
        "It's always more efficient",
        "Ground temperature is stable (10-15°C) vs air fluctuations, reducing temperature lift and improving COP",
        "It uses different refrigerant",
        "It's cheaper",
      ],
      answer: 1,
      explanation:
        "GSHP COP is typically 4-5 vs 2-3 for air-source in cold climates; but ground installation is expensive.",
    },
    {
      question: "A water-cooled chiller uses a cooling tower to:",
      options: [
        "Make ice",
        "Reject heat from condenser water to the atmosphere (evaporative cooling is very efficient)",
        "Add water to the chiller",
        "Cool the evaporator",
      ],
      answer: 1,
      explanation:
        "Cooling tower condenses condenser water to ~28°C (vs 35-40°C with air-cooled); this improves chiller COP.",
    },
  ],
  "refr-optimization-check": [
    {
      question: "At part-load (e.g., 50% cooling demand), a fixed-displacement compressor:",
      options: [
        "Automatically adjusts displacement",
        "Cycles on-off, wasting energy; capacity control (unloading, VFD) is better",
        "Always runs at full power",
        "Stops completely",
      ],
      answer: 1,
      explanation:
        "On-off cycling has inefficiency; VFD on compressor or unloading (valve bypass) is better for part-load efficiency.",
    },
    {
      question: "Superheat optimization means:",
      options: [
        "Running the system hot",
        "Adjusting expansion device so superheat is 5-10°C; too high = wasted capacity, too low = risk of slugging",
        "Removing all superheat",
        "Increasing system pressure",
      ],
      answer: 1,
      explanation:
        "Superheat too high (say, 20°C) means the evaporator isn't fully utilized; wrong expansion device setting.",
    },
    {
      question: "Refrigerant leaks in a system cause:",
      options: [
        "Nothing; the system auto-refills",
        "Reduced cooling, higher pressure, motor overheating, system shutdown if unaddressed",
        "Better efficiency",
        "Lower cost",
      ],
      answer: 1,
      explanation:
        "Even small leaks (1% per year) degrade performance and eventually require compressor replacement if not found.",
    },
  ],
  "ca-fundamentals-check": [
    {
      question: "Compressed air is expensive because:",
      options: [
        "Compressors consume a lot of electricity to pressurize air",
        "Air cannot be stored",
        "Compressed air is always wasted",
        "It's the cheapest utility on site",
      ],
      answer: 0,
      explanation:
        "Compressing air to 7 bar requires significant electrical energy. A 1% leak wastes ~10 kW continuously. In many facilities, compressed air energy cost rivals electricity for other systems.",
    },
    {
      question: "A reciprocating compressor is most efficient at:",
      options: [
        "Very low pressure (1 bar)",
        "Rated pressure and capacity (full load)",
        "Any pressure or load",
        "Partial load (50%)",
      ],
      answer: 1,
      explanation:
        "Reciprocating compressors are most efficient at rated capacity. Screw compressors maintain better efficiency at partial load.",
    },
    {
      question: "Reducing system pressure from 8 bar to 6 bar saves energy because:",
      options: [
        "The compressor doesn't need to work as hard",
        "Pressure drop in pipes is reduced; less energy wasted in throttling",
        "Air disappears",
        "There's no real benefit",
      ],
      answer: 1,
      explanation:
        "Lower pressure = lower compressor work. Also, pressure drop losses in pipes scale with system pressure.",
    },
  ],
  "ca-design-check": [
    {
      question: "The main cause of energy waste in compressed air systems is:",
      options: [
        "Poor piping material",
        "Old compressors",
        "Leaks (often 20-30% of output is lost)",
        "Too much air being used",
      ],
      answer: 2,
      explanation:
        "Leaks are the silent killer. A small 1 mm hole at 7 bar loses ~10 CFM; undetected for a year = massive energy waste.",
    },
    {
      question: "A refrigerated dryer removes moisture and:",
      options: [
        "Cools the air permanently",
        "Reduces pressure for safe use",
        "Is better at -40°C dew point than desiccant",
        "Requires no maintenance",
      ],
      answer: 2,
      explanation:
        "Refrigerated dryers cool to ~3°C (dew point ~-5°C). Desiccant dryers go lower (~-40°C) but use more energy. Choose based on application.",
    },
    {
      question: "Variable-displacement compressor benefits:",
      options: [
        "Cost less than fixed-displacement",
        "Maintain better efficiency at part-load; energy savings 10-30% vs load-unload",
        "Never need maintenance",
        "Produce no noise",
      ],
      answer: 1,
      explanation:
        "Variable-displacement compressors adjust cylinder volume to match demand, avoiding idle losses of load-unload control.",
    },
  ],
  "ca-maintenance-check": [
    {
      question: "Waste heat from a compressor (discharge at 80-100°C) can be recovered for:",
      options: [
        "Cooling the compressor (circular)",
        "Domestic hot water, space heating, pre-heating; typical recovery 20-40 kW",
        "The compressed air itself",
        "Nothing useful",
      ],
      answer: 1,
      explanation:
        "Compressor discharge heat is valuable. A 50 kW compressor wastes ~20 kW as heat; recovery can supply significant DHW.",
    },
    {
      question: "An ultrasonic leak detector helps because:",
      options: [
        "It eliminates leaks",
        "It finds leaks you can't hear; a trained operator can locate all leaks in minutes",
        "It seals leaks automatically",
        "Leaks don't matter",
      ],
      answer: 1,
      explanation:
        "Ultrasonic detectors hear the high-frequency hiss of leaks even in noisy environments. Cost: ~£1,000. ROI: Often <1 year from leak repairs.",
    },
    {
      question: "Annual maintenance on a compressed air system includes:",
      options: [
        "Nothing — it runs forever",
        "Filter replacement, oil analysis, bearing inspection, dryer cartridge change",
        "Complete overhaul",
        "Just checking pressure once per year",
      ],
      answer: 1,
      explanation:
        "Regular maintenance prevents degradation. Neglect leads to: clogged filters → higher pressure → energy waste.",
    },
  ],
  "lighting-fundamentals-check": [
    {
      question: "Lux is a measure of:",
      options: [
        "Power consumption",
        "Light level (lumens per square meter); perceived brightness at a surface",
        "Colour temperature",
        "Lamp lifespan",
      ],
      answer: 1,
      explanation:
        "Lux = lumens/m². An office typically needs 500 lux for reading; a corridor might be 200 lux.",
    },
    {
      question: "LED efficacy (lumens per watt) is typically:",
      options: [
        "10-20 lm/W (same as old fluorescent)",
        "50-100 lm/W (halogen is ~15 lm/W)",
        "500 lm/W (impossible)",
        "Varies unpredictably",
      ],
      answer: 1,
      explanation:
        "Modern LEDs: 80-100+ lm/W. Old incandescent: 10-15 lm/W. Fluorescent: 60-90 lm/W. LEDs are most efficient.",
    },
    {
      question: "Colour temperature in Kelvin (K) describes:",
      options: [
        "How hot the lamp gets",
        "Whether the bulb is lit",
        "The perceived warmth of light (3000K = warm white, 6000K = cool white)",
        "The lifespan",
      ],
      answer: 2,
      explanation:
        "3000K is yellowish (warm, like incandescent). 6000K is bluish (cool, like daylight). Choice affects visual perception and alertness.",
    },
  ],
  "lighting-controls-check": [
    {
      question: "An occupancy sensor saves energy by:",
      options: [
        "Changing the lamp colour",
        "Turning lights off when no motion is detected (adjustable delay)",
        "Reducing lamp power",
        "Only working at night",
      ],
      answer: 1,
      explanation:
        "Occupancy sensors can save 30-50% in rooms with variable use (restrooms, storage, hallways). Less effective in constantly occupied spaces.",
    },
    {
      question: "Daylight harvesting uses:",
      options: [
        "Solar panels",
        "A photosensor to dim lights when natural light is sufficient",
        "Mirrors to reflect sunlight",
        "No artificial lights",
      ],
      answer: 1,
      explanation:
        "Photosensors measure ambient lux and dim the artificial lights proportionally. Can save 20-40% in daylit spaces.",
    },
    {
      question: "Glare from daylighting is best mitigated by:",
      options: [
        "Closing all windows",
        "Blinds, overhangs, diffusing films, task lighting on non-window walls",
        "Using brighter lights",
        "Installing more skylights",
      ],
      answer: 1,
      explanation:
        "Glare reduces visual comfort and productivity. Shading devices (blinds, overhangs) control it; task lighting moves light away from windows.",
    },
  ],
  "lighting-retrofit-check": [
    {
      question: "LED retrofit payback from energy savings alone is typically:",
      options: [
        "Never pays back",
        "1-3 years for office/commercial (replacing fluorescent/halogen)",
        "10+ years",
        "Immediate",
      ],
      answer: 1,
      explanation:
        "LED cost ~£5-20/bulb vs £1-2 for fluorescent, but lasting 25,000+ hours (vs 8,000) and using 75% less power. Payback typical 1-3 years.",
    },
    {
      question: "Over-illumination (providing more light than needed) wastes energy by:",
      options: [
        "Using bigger bulbs",
        "Drawing excess power; also increases cooling load (more heat)",
        "Making rooms darker",
        "Using fluorescent instead of LED",
      ],
      answer: 1,
      explanation:
        "If 500 lux is needed but you provide 800 lux, you're wasting 37% of lighting energy. Plus extra heat load.",
    },
    {
      question: "A lux meter is useful for:",
      options: [
        "Measuring lamp temperature",
        "Verifying lighting levels match design (500 lux, 300 lux, etc.)",
        "Counting lamps",
        "Finding LED bulbs",
      ],
      answer: 1,
      explanation:
        "Lux meters (£100-500) let you verify that lighting retrofits and re-designs meet spec and identify over/under-lit areas.",
    },
  ],
  "tes-fundamentals-check": [
    {
      question: "Sensible thermal storage stores heat by:",
      options: [
        "Changing phase (melting/freezing)",
        "Raising temperature of a medium (water, concrete, sand)",
        "Changing colour",
        "Creating pressure",
      ],
      answer: 1,
      explanation:
        "Sensible storage: heating water 20→60°C = 40°C × 4.2 kJ/kg·K. Latent storage: melting ice = 334 kJ/kg (no temp change).",
    },
    {
      question: "Load shifting from off-peak to peak works because:",
      options: [
        "It reduces total energy use",
        "Off-peak electricity is cheaper; store cheap energy, use at peak rates, save money",
        "It eliminates the need for cooling",
        "Peak energy is free",
      ],
      answer: 1,
      explanation:
        "If off-peak (night) electricity is £0.05/kWh and peak is £0.15/kWh, storing 10 MWh at night saves £1,000.",
    },
    {
      question: "Seasonal storage (e.g., summer heat for winter use) is challenging because:",
      options: [
        "It's impossible",
        "Heat loss over months is enormous; storage volume required is large; economics are marginal",
        "There's no summer heat",
        "It's already widely deployed",
      ],
      answer: 1,
      explanation:
        "A borehole store loses 10-20% of heat over 6 months. Requires large volume (1000+ m³) for a building. Payback >10 years in most climates.",
    },
  ],
  "tes-technologies-check": [
    {
      question: "Phase-change materials (PCM) are valuable for storage because:",
      options: [
        "They're cheaper than water",
        "Much higher energy density per unit volume (latent heat ~250+ kJ/kg vs sensible ~200 kJ/kg for 40°C rise)",
        "They eliminate the need for a tank",
        "They produce electricity",
      ],
      answer: 1,
      explanation:
        "PCM (paraffin wax, salt hydrates) store more energy in less space than water. Trade-off: cost (~£500-1000/MWh vs £50 for water tank).",
    },
    {
      question: "Ice-on-coil storage works by:",
      options: [
        "Freezing water once and using it forever",
        "Freezing water at night (cheap rate) using a chiller, melting during day for cooling",
        "Natural winter cooling",
        "Eliminating the air conditioner",
      ],
      answer: 1,
      explanation:
        "Ice melting absorbs 334 kJ/kg; a 10-tonne tank stores 3.34 MWh of cooling. Chiller can be 30-50% smaller.",
    },
    {
      question: "Ground thermal storage (borehole seasonal store) is most viable when:",
      options: [
        "Always worthwhile",
        "Long building life, high heating/cooling demand, suitable geology, electricity cheaper than fuel",
        "Never economical",
        "Only in cold climates",
      ],
      answer: 1,
      explanation:
        "Payback typically 10-20 years. Makes sense for district heating systems, large institutions (schools, hospitals), not typical offices.",
    },
  ],
  "tes-applications-check": [
    {
      question: "DHW storage tanks reduce boiler cycling by:",
      options: [
        "Making hot water hotter",
        "Buffering demand, so boiler runs longer at full load (vs frequent on-off)",
        "Using more gas",
        "Changing the boiler type",
      ],
      answer: 1,
      explanation:
        "A 500L tank means boiler runs 1h to heat it, then off for hours as tank supplies DHW. Efficiency: better than small tanked boiler cycling every 5min.",
    },
    {
      question: "Night cooling (storing coolth for day use) works best when:",
      options: [
        "Always",
        "Building has high thermal mass (concrete), outdoor night temps are cool, day demand is predictable",
        "Never practical",
        "Only in winter",
      ],
      answer: 1,
      explanation:
        "Offices with concrete structure: cool at night, close windows, pre-cool building. Day: avoid cooling, rely on stored coolth. Saves 20-30%.",
    },
    {
      question: "Economic payback for thermal storage depends on:",
      options: [
        "Only energy prices",
        "Tariff difference (peak vs off-peak), storage cost, thermal losses, system lifetime",
        "Building age",
        "Never worth analyzing",
      ],
      answer: 1,
      explanation:
        "High peak/off-peak ratio (2-3×) favours storage. Low ratio (<1.5×) usually doesn't. Must model losses and tank cost.",
    },
  ],
  "re-pv-check": [
    {
      question: "Solar PV efficiency (% of sunlight converted to electricity) is typically:",
      options: [
        "50% (very high)",
        "15-22% for modern panels (theoretical limit ~30%, silicon bandgap)",
        "1-5% (very low)",
        "Varies by weather only",
      ],
      answer: 1,
      explanation:
        "Modern panels: 18-22% typical. Premium panels: 22-23%. Best-in-lab: 47% (multi-junction). Silicon limit: 33%.",
    },
    {
      question: "Annual PV yield (kWh per kWp installed) in the UK is typically:",
      options: [
        "500 kWh/kWp (poor)",
        "800-1,000 kWh/kWp depending on location, orientation, shading",
        "2,000 kWh/kWp (Spain-level)",
        "100 kWh/kWp (unusable)",
      ],
      answer: 1,
      explanation:
        "South-facing, unshaded, optimally tilted: ~950 kWh/kWp in SE England, ~800 in Scotland. Shading can halve this.",
    },
    {
      question: "A grid-tied PV system with batteries provides resilience by:",
      options: [
        "Running forever without electricity",
        "Storing daytime PV generation to use if grid fails (critical load backup)",
        "Reducing grid demand",
        "Being cheaper than grid-only",
      ],
      answer: 1,
      explanation:
        "Grid-tied + battery: if grid fails, batteries power essential loads (lights, heating, medical). Typical: 10-30 kWh storage.",
    },
  ],
  "re-thermal-wind-check": [
    {
      question: "Solar thermal (hot water) efficiency is typically:",
      options: [
        "10-20% (same as PV)",
        "50-70% (much higher than PV, less complete conversion needed)",
        "90% (impossible, violates thermodynamics)",
        "1%",
      ],
      answer: 1,
      explanation:
        "Solar thermal collectors convert 50-70% of incident solar energy to heat. No electronic conversion needed, so fewer losses than PV.",
    },
    {
      question: "Small wind turbines in urban areas often disappoint because:",
      options: [
        "Wind is always sufficient",
        "Wind speed is low and turbulent; payback often 15-20+ years, vs 5-8 for rooftop PV",
        "They never work",
        "Noise is prohibited",
      ],
      answer: 1,
      explanation:
        "Wind speed increases with height. Rooftop turbines are low, turbulent, inefficient. Ground-mounted in open areas work better.",
    },
    {
      question: "A heat pump with COP 3 using renewable electricity is more efficient than:",
      options: [
        "A fossil boiler (efficiency 90%)",
        "An electric heater (COP 1) running on renewable electricity",
        "Nothing — it's less efficient than alternatives",
        "Only compared to fossil fuel",
      ],
      answer: 1,
      explanation:
        "Heat pump COP 3 on renewable electricity: 3 kWh heat per 1 kWh renewable. Electric heater: 1 kWh heat per 1 kWh. Heat pump is 3× better.",
    },
  ],
  "re-biomass-check": [
    {
      question: "Biomass is considered carbon-neutral because:",
      options: [
        "It produces no CO₂",
        "Growing trees absorb CO₂; burning releases it; cycle is neutral (ignoring transport, processing)",
        "All energy is renewable",
        "It's always sustainable",
      ],
      answer: 1,
      explanation:
        "Assumption: CO₂ released = CO₂ absorbed by regrowth. Reality: depends on forestry practice, transport distance, processing. Not always truly neutral.",
    },
    {
      question: "A hybrid boiler system (fossil + heat pump) makes sense when:",
      options: [
        "Always",
        "Peak heat demand exceeds heat pump capacity; heat pump handles base load (COP 3), fossil backup for peaks (rare, extreme cold)",
        "Never — choose one or the other",
        "Only for cooling",
      ],
      answer: 1,
      explanation:
        "Hybrid: heat pump covers 80% of season at high efficiency, gas boiler covers 20% at peak. Better than oversizing heat pump.",
    },
    {
      question: "A microgrid with peer-to-peer energy trading allows:",
      options: [
        "Everyone to be off-grid",
        "Houses with solar to sell surplus to neighbours; community balances supply/demand locally",
        "No grid electricity ever",
        "Free electricity",
      ],
      answer: 1,
      explanation:
        "Microgrids: local generation (PV, wind) + storage + software. Excess traded locally. Reduces grid congestion, lowers costs, improves resilience.",
    },
  ],
  "re-grid-check": [
    {
      question: "A grid code (DNO approval) for PV export requires:",
      options: [
        "Nothing",
        "Anti-islanding device, export metering, voltage/frequency compliance; prevents backfeeding during outages",
        "Only if you export more than 5 kW",
        "Only in Scotland",
      ],
      answer: 1,
      explanation:
        "Safety requirement: if grid fails and your PV is still energizing lines, electricians can be electrocuted. Anti-islanding prevents this.",
    },
    {
      question: "Battery storage round-trip efficiency (charge in, discharge out) for lithium-ion is typically:",
      options: [
        "50% (half the energy is wasted)",
        "85-95% (minimal losses from inverter, cell chemistry)",
        "100% (no losses)",
        "10% (very inefficient)",
      ],
      answer: 1,
      explanation:
        "Lithium round-trip: 90-95% typical. Lead-acid: 70-80%. Trade-off: cost vs efficiency. For PV self-consumption, lithium is worth it.",
    },
    {
      question: "Net-zero pathway (insulation → electrification → generation) assumes:",
      options: [
        "All steps happen at once",
        "Improving building envelope first (cheaper per kWh saved), then replacing fossil with heat pump, finally adding renewables",
        "Only generation matters",
        "Insulation is not needed if you generate enough",
      ],
      answer: 1,
      explanation:
        "Logic: reduce demand (insulate), electrify (heat pump), then generate renewables. PV cost per kWh is high; better to use less.",
    },
  ],
  "insulation-fundamentals-check": [
    { question: "U-value measures:", options: ["Insulation thickness", "Heat flow rate per square meter per degree of temperature difference (W/m²K)", "Density of material", "Cost per m²"], answer: 1, explanation: "Lower U-value = better insulation. Typical wall U-value target: 0.3 W/m²K." },
    { question: "Economic insulation thickness is where:", options: ["Insulation is free", "Energy savings equal insulation cost over payback period (typically 3-7 years)", "Thicker is always better", "Determined by law only"], answer: 1, explanation: "Adding insulation saves energy, but cost-benefit is optimal at ~50-100mm for most applications." },
  ],
  "insulation-envelope-check": [
    { question: "Thermal bridges occur at:", options: ["Everywhere in buildings", "Junctions where insulation is interrupted (studs, fasteners, joints); they allow heat to bypass insulation", "Windows only", "Never in modern buildings"], answer: 1, explanation: "A steel stud in insulated cavity wall is a thermal bridge. Local heat loss is much higher at that point." },
    { question: "Low-E glazing coating reduces:", options: ["Visible light transmission (makes windows darker)", "Radiative heat loss (infra-red radiation escaping); helps in winter", "Solar gain only (not needed in winter)", "Condensation only"], answer: 1, explanation: "Low-E coating reflects long-wave (heat) radiation back indoors in winter; solar gain (visible light) still passes." },
  ],
  "insulation-lagging-check": [
    { question: "A 50mm uninsulated hot water pipe at 60°C loses roughly:", options: ["5 W/m", "50 W/m (or more, depending on ambient temp and pipe size)", "500 W/m", "No loss in modern buildings"], answer: 1, explanation: "Heat loss from hot pipes is continuous; 50mm insulation reduces this to ~5-10 W/m (payback often <1 year)." },
    { question: "Safe touch surface temperature is typically maximum:", options: ["80°C (always)", "60°C (to prevent burns); insulation must ensure this", "No limit", "40°C (too conservative)"], answer: 1, explanation: "Regulations require insulation such that exposed surface is below 60°C to prevent contact burns." },
  ],
  "buildings-design-check": [
    { question: "U-value target for a new building wall (to meet modern standards):", options: ["1.0 W/m²K", "0.3 W/m²K or better (requires ~150-200mm insulation)", "5.0 W/m²K (old standard)", "Varies randomly"], answer: 1, explanation: "Building regulations tightened; new buildings now ~0.25-0.35 W/m²K. Old buildings: 0.8-1.5 W/m²K." },
    { question: "Air-tightness testing (blower door) measures:", options: ["Wind resistance", "Air leakage rate (CFM or m³/h at 50 Pa); indicates infiltration and heat loss", "Insulation thickness", "Temperature gradient"], answer: 1, explanation: "Blower door fans pressurize building to measure how much air escapes; tighter = lower heating/cooling." },
  ],
  "buildings-glazing-check": [
    { question: "Solar factor (g-value) describes:", options: ["Temperature of glass", "Fraction of solar radiation that enters the building as heat (0-1); high=more solar gain", "Color of window", "Cost per window"], answer: 1, explanation: "g=0.8 means 80% of solar energy enters. Low-E coatings reduce this for summer shading." },
    { question: "East/west-facing windows need:", options: ["No protection", "More shading than south (sun angle is lower in morning/evening, direct heat longer)", "Less insulation", "Only reflective glass"], answer: 1, explanation: "East/west sun is harder to shade with overhangs. Blinds or external shading work better." },
  ],
  "buildings-retrofit-check": [
    { question: "Energy retrofit sequence should prioritize:", options: ["Systems first (boiler, chiller)", "Building envelope first (insulation, air-tightness); cheaper per kWh saved than system upgrades", "Random order", "Windows only"], answer: 1, explanation: "Payback for insulation often 3-5 years. System upgrade payback often 5-10 years. Envelope first is logical." },
    { question: "Adding external insulation to existing solid wall cost is roughly:", options: ["£1,000-3,000 per m² (material + labour for full coverage)", "£500/m²", "£20,000/m²", "Always free"], answer: 0, explanation: "External insulation (EWI) costs £150-200/m² material + £50-100/m² labour. Payback ~10-15 years on retrofit." },
  ],
  "chp-fundamentals-check": [
    { question: "CHP produces electricity by:", options: ["Burning fuel without heat recovery", "Running a small wind turbine", "Using engine/turbine to drive generator; waste heat recovered for heating/DHW", "Only solar panels"], answer: 2, explanation: "CHP = combustion engine + generator + heat exchanger. Thermal efficiency 30-40%, heat recovery 40-60%, total 70-90%." },
    { question: "Compared to grid electricity, CHP is more efficient because:", options: ["It's always cheaper", "On-site generation avoids grid transmission loss (6-8%); waste heat is captured instead of wasted", "It uses less fuel", "No advantage"], answer: 1, explanation: "Grid power plant: 35% efficient + 8% transmission loss = 32% effective delivery. CHP: 70%+ overall." },
  ],
  "chp-integration-check": [
    { question: "CHP should be sized to:", options: ["Peak electrical demand", "Annual heat demand curve (base load); oversizing wastes electricity export value", "Maximum possible size", "Grid frequency"], answer: 1, explanation: "If building needs 100 kW avg heat but CHP produces 150 kW, excess 50 kW electricity is wasted or exported at low price." },
    { question: "CHP + boiler hybrid system benefits because:", options: ["Cheaper upfront", "CHP handles baseload heat (efficient), boiler covers peaks (less of the year); optimal capital + operating cost", "Boiler is unnecessary", "CHP alone is always better"], answer: 1, explanation: "A 50 kW CHP covers ~70% of annual heat, boiler covers 30% peaks. Lower CHP size = better payback." },
  ],
  "chp-economics-check": [
    { question: "CHP payback (10-year) in the UK typically requires:", options: ["Free fuel", "High thermal demand (hospitals, etc.) with gas <£0.05/kWh and electricity saved >£0.15/kWh", "Only with subsidies", "5+ MW size"], answer: 1, explanation: "Small CHP (50-200 kW) payback 5-10 years if heat demand is high and fuel/electricity costs favour it." },
    { question: "Exporting CHP-generated electricity to grid provides:", options: ["No value", "Revenue (export tariff) or avoided cost (reduced import); metering required, typical £0.05-0.10/kWh", "Only subsidies", "Carbon credit only"], answer: 1, explanation: "Grid export metering and DNO approval required. Export price is typically 50-60% of import price." },
  ],
  "maintenance-strategy-check": [
    { question: "Planned maintenance differs from reactive because:", options: ["It costs the same", "It prevents efficiency loss by servicing before failure (vs waiting for breakdown = downtime + high repair cost)", "Reactive is always better", "No difference"], answer: 1, explanation: "Boiler combustion tuning once per year = £500, saves ~3% energy (~£5,000/year). Waiting for failure costs 10× more." },
    { question: "A clogged boiler tube loses efficiency by:", options: ["1%", "5-10% (soot/scale blocks heat transfer; flue temp rises)", "No effect", "Gains efficiency"], answer: 1, explanation: "Scale/soot insulates tubes. Each 10°C rise in flue temp = ~0.5% efficiency loss. Annual cleaning is cheap." },
  ],
  "maintenance-systems-check": [
    { question: "Chiller superheat should be maintained at:", options: ["0°C (impossible)", "5-8°C (ensures dry compressor inlet; too low risks slugging, too high wastes capacity)", "15°C (acceptable)", "Variable"], answer: 1, explanation: "Superheat drift is common; annual check and adjustment maintains capacity and efficiency." },
    { question: "Motor bearing lubrication prevents:", options: ["Noise only", "Friction, heat, and eventually bearing failure (seizure = sudden motor death)", "Electrical faults", "Unnecessary now with modern motors"], answer: 1, explanation: "Bearing wear is silent; by the time you hear noise, damage is done. Preventive lubrication extends motor life 2-3×." },
  ],
  "maintenance-program-check": [
    { question: "Condition monitoring (vibration, temperature, efficiency) helps by:", options: ["Replacing guesswork with data", "Detecting early faults before catastrophic failure; allowing planned replacement vs emergency repair", "Eliminating maintenance entirely", "No benefit"], answer: 1, explanation: "Rising vibration or declining COP signals developing fault; early repair = low cost. Breakdown repair = high cost + lost production." },
    { question: "A maintenance program should track:", options: ["Nothing (too much work)", "Equipment inventory, service history, failure dates, efficiency trends (kWh/unit output); enables predictive planning", "Only emergency repairs", "Costs only"], answer: 1, explanation: "Data-driven maintenance predicts failures 2-4 weeks ahead, allows planned outages, and reduces emergency costs 50-70%." },
  ],
  "mv-fundamentals-check": [
    { question: "Baseline in M&V means:", options: ["Random starting point", "Pre-project energy consumption, adjusted for weather, occupancy, production; used to calculate savings", "Minimum required by law", "Project target"], answer: 1, explanation: "Baseline = average of 12+ months pre-project data. Post-project consumption vs baseline = savings." },
    { question: "IPMVP Option A is best for:", options: ["Small single-measure projects", "Large multi-measure whole-building retrofit (one meter, measure total consumption)", "Specific equipment (chiller, boiler)", "Never used"], answer: 1, explanation: "Option A: whole-building baseline + meter. Simpler than sub-metering. Common for retrofit projects." },
  ],
  "mv-baseline-check": [
    { question: "Weather normalization is needed because:", options: ["Weather is unpredictable", "Heating/cooling varies with outdoor temperature; a mild winter vs cold winter creates false savings/penalties if baseline not adjusted", "Weather is always same", "Never used"], answer: 1, explanation: "2019 was mild, 2018 was cold. Baseline from 2018 would show false savings in 2019 without normalization." },
    { question: "If building occupancy increased post-retrofit, adjustment should:", options: ["Ignore it", "Increase baseline proportionally (more occupancy = more energy use regardless of retrofit)", "Decrease baseline (opposite effect)", "Not apply"], answer: 1, explanation: "100 people vs 200 people uses ~2× energy. Baseline must be adjusted up to isolate retrofit effect." },
  ],
  "mv-savings-check": [
    { question: "Rebound effect in M&V means:", options: ["Energy savings are fake", "Occupants use more heating/cooling because it's cheaper now (fewer savings than predicted); common 5-20% reduction", "Baseline error only", "Never happens"], answer: 1, explanation: "Retrofit cuts costs; occupants raise thermostat comfort. Expected savings 30% → actual 25% (5-10% rebound)." },
    { question: "Independent third-party M&V verification is valuable because:", options: ["Always free", "Reduces bias; improves credibility for financing, compliance reporting, public claims", "Only required for government", "Never needed"], answer: 1, explanation: "Self-reported savings lack credibility. Third-party review builds investor/stakeholder confidence; enables larger financing." },
  ],
  "leadership-influence-check": [{ question: "Influencing without authority relies on:", options: ["Formal power", "Credibility, persuasion, coalition-building with stakeholders", "Orders only", "Finance"], answer: 1, explanation: "Energy leaders need allies. Credibility + shared vision = influence without hierarchy." }],
  "leadership-culture-check": [{ question: "Embedding energy in culture means:", options: ["Policy only", "Behavior change from compliance → commitment via incentives & governance integration", "No cost", "Technology alone"], answer: 1, explanation: "Culture shift requires reinforcement: recognition, performance metrics, board-level sponsorship." }],
  "leadership-practice-check": [{ question: "Organizational silos hinder energy by:", options: ["Nothing", "Operations, finance, procurement not aligned; energy decisions made in isolation", "Improving efficiency", "Being modern"], answer: 1, explanation: "Cross-functional teams (ops + finance + procurement) are critical for integrated energy strategy." }],
  "strategy-framework-check": [{ question: "ISO 50001 baseline means:", options: ["Minimum standard", "Pre-project energy consumption & KPIs (kWh/m², £/unit) against which improvement is measured", "Random", "Highest possible"], answer: 1, explanation: "Baseline establishes the starting point. All improvements measured vs baseline (% reduction)." }],
  "strategy-seu-check": [{ question: "Significant Energy Uses (SEU) focus on:", options: ["All equipment equally", "Top 20% of equipment/processes consuming 80% of energy; target improvements here first", "Only small items", "Nothing"], answer: 1, explanation: "Pareto principle: 80-20 rule. Biggest wins from focusing on high-impact SEU." }],
  "strategy-implementation-check": [{ question: "ISO 50001 certification requires:", options: ["Policy only", "EMS framework (plan-do-check-act), baseline, SEU management, internal audit, external audit", "No audit", "Energy reduction only"], answer: 1, explanation: "Certification involves external auditor verifying EMS is in place and effective." }],
  "policy-design-check": [{ question: "Energy policy should be:", options: ["Vague", "Specific, measurable targets with clear ownership and link to strategy", "Technical only", "No limits"], answer: 1, explanation: "Vague policies don't drive behavior. Specific commitments (% reduction by 2030) with named owners work." }],
  "policy-content-check": [{ question: "Policy targets should address:", options: ["Energy only", "Operational efficiency, renewable energy, and decarbonization (scope 1-2-3)", "Nothing", "Cost alone"], answer: 1, explanation: "Three pillars: demand reduction, renewable generation, and scope 3 supply-chain emissions." }],
  "policy-adoption-check": [{ question: "Policy communication cascading means:", options: ["CEO announces once", "Multi-level rollout: board → managers → employees; training; embedding in job descriptions", "Email only", "No communication needed"], answer: 1, explanation: "Policy sticks when every level understands their role. Training & accountability essential." }],
  "investment-basics-check": [{ question: "Hurdle rate for energy projects is typically:", options: ["0% (no return needed)", "10-20% IRR (higher than corporate average due to energy price uncertainty)", "50%+", "Negative"], answer: 1, explanation: "Finance directors set hurdle rates. Energy projects compete with other capex; higher risk = higher hurdle." }],
  "investment-development-check": [{ question: "Co-benefits of energy retrofits include:", options: ["Only energy savings", "Health, productivity, resilience, brand value; quantified and included in business case", "Nothing", "Costs only"], answer: 1, explanation: "Better indoor air → fewer absences (£2-5k/person/year saved). Quantify all benefits." }],
  "investment-presentation-check": [{ question: "Portfolio prioritization ranks projects by:", options: ["Random", "IRR and risk; bundling for cost-sharing and phasing", "Cost alone", "Size only"], answer: 1, explanation: "Mix of quick wins (high IRR) and strategic projects (lower IRR but critical to roadmap)." }],
  "financing-options-check": [{ question: "Green loans and ESG finance offer:", options: ["No benefit", "Lower interest rates for energy/environmental projects; ESG verification required", "Higher costs", "No difference"], answer: 1, explanation: "Green finance market growing. Preferential rates 0.5-1.5% lower for verified projects." }],
  "financing-epc-check": [{ question: "ESCO model (EPC) transfers risk by:", options: ["Customer bears all risk", "ESCO funds project and is paid from guaranteed savings; customer avoids capex risk", "No risk transfer", "Doubles cost"], answer: 1, explanation: "ESCO profit depends on delivering savings. Aligns incentives. But check M&V definition carefully." }],
  "financing-emerging-check": [{ question: "On-bill financing means:", options: ["Paying utility for energy", "Utility funds efficiency upgrades; repaid via lower bills (customer cash flow positive from day 1)", "No connection", "Not used"], answer: 1, explanation: "Powerful for residential/SME: energy bill drops more than payment owed, instant appeal." }],
  "procurement-basics-check": [{ question: "Index contract energy price is:", options: ["Fixed forever", "Follows wholesale market (variable); lower average cost but uncertain", "Always high", "Prohibited"], answer: 1, explanation: "Index tracking + hedging combo: get market-level pricing + some protection vs spikes." }],
  "procurement-clean-check": [{ question: "PPA (Power Purchase Agreement) means:", options: ["No renewable energy", "Long-term contract to buy renewable power directly (off-site wind/solar) at fixed price", "Same as grid", "Complicated always"], answer: 1, explanation: "PPAs lock in renewable price. Strategic for organizations targeting 100% clean power." }],
  "procurement-execution-check": [{ question: "Demand forecasting for procurement is critical because:", options: ["No real impact", "Undershooting misses opportunity to negotiate better rates; overshooting pays for unneeded power", "Same every year", "Never varies"], answer: 1, explanation: "1 year ahead forecast allows time to tender and negotiate. 3-5 year outlook for PPAs." }],
  "behaviour-change-check": [{ question: "Habit formation in energy behaviour takes roughly:", options: ["1 week", "3-6 months of consistent reinforcement; without, rebound effect (20-30%) occurs", "Never happens", "1 day"], answer: 1, explanation: "Retrofit alone doesn't change use. Behavior must be reinforced or use creeps back up." }],
  "behaviour-campaigns-check": [{ question: "Energy champion network benefits by:", options: ["No value", "Peer-to-peer influence more credible than top-down; grassroots buy-in drives adoption", "Expensive", "Not needed"], answer: 1, explanation: "Champions in each dept become advocates. Cost: training + recognition. ROI: 3-5× behavior lift." }],
  "behaviour-incentives-check": [{ question: "To sustain behavior change long-term:", options: ["One-time campaign enough", "Continuous reinforcement: recognition, feedback, performance metrics, integration into culture", "Impossible", "Only punishment works"], answer: 1, explanation: "Initial engagement fades without ongoing support. Quarterly themes + annual recognition keep momentum." }],
  "netzero-framework-check": [{ question: "Scope 3 emissions include:", options: ["Only direct (fuel, electricity)", "Indirect value-chain: supply chain, business travel, waste; often 50-75% of total", "Nothing", "Not counted"], answer: 1, explanation: "Many organizations forget scope 3. For manufacturing/retail, it often dominates total emissions." }],
  "netzero-pathways-check": [{ question: "Electrification strategy for net-zero prioritizes:", options: ["Keep fossil fuels", "Heat pump replacement of gas boilers; EV fleet; coupling with renewable grid", "No change", "Impossible"], answer: 1, explanation: "Decarbonization = eliminating fossil fuel use. Heat pump COP 3-4 on renewable electricity >> boiler." }],
  "netzero-delivery-check": [{ question: "Offset strategy is needed because:", options: ["All emissions can be eliminated", "Residual emissions (10-20% after efficiency & electrification) must be balanced by removals/offsets", "Never needed", "Offsets alone sufficient"], answer: 1, explanation: "True net-zero: 90% reduction + 10% offsets. Fake net-zero: 50% reduction + 50% offsets. Be credible." }],

  "meb-conservation-check": [
    {
      question: "The first law of thermodynamics, restated as a balance, says:",
      options: [
        "Energy can be created if enough power is supplied",
        "Every unit of energy crossing into a system must leave it, or still be inside it",
        "Energy always increases over time as equipment ages",
        "Only mass is conserved; energy is not",
      ],
      answer: 1,
      explanation:
        "Energy is neither created nor destroyed. In = Out + Accumulation, always — that's the whole content of the first law as a practical tool.",
    },
    {
      question: "Why must you define a system boundary before building a balance?",
      options: [
        "It's a formality with no effect on the numbers",
        "The boundary you choose determines which streams are 'inside' and which are ignored, so it changes what question the balance actually answers",
        "Boundaries are only needed for mass balances, not energy balances",
        "Only closed systems need a boundary",
      ],
      answer: 1,
      explanation:
        "The same equipment gives different, equally valid answers depending on where you draw the line — a boiler-only boundary and a whole-steam-system boundary tell different stories.",
    },
    {
      question: "A boiler running at a constant load, hour after hour, is best approximated as:",
      options: ["A closed system", "A transient system", "A steady-state system", "An unbalanced system"],
      answer: 2,
      explanation:
        "Steady-state means nothing inside the boundary is changing with time — the same mass and energy enter as leave, continuously.",
    },
    {
      question:
        "You measure a motor's electrical input and mechanical output, and estimate its heat loss separately. The three don't quite add up — there's a small unexplained gap. What does that gap most likely indicate?",
      options: [
        "The first law has been violated",
        "A stream crossing the boundary hasn't been fully measured or accounted for yet",
        "The units must be wrong somewhere and the whole calculation should be discarded",
        "Balances never close in practice, so the gap can be ignored",
      ],
      answer: 1,
      explanation:
        "A balance that doesn't close is a signal, not an error to shrug off — it usually points to an unmeasured stream, which is often exactly where a fault or saving is hiding.",
    },
    {
      question: "For a steady-state open system, the general balance equation 'Accumulation = In − Out' simplifies to:",
      options: ["In = 0", "Out = 0", "In = Out", "Accumulation = In × Out"],
      answer: 2,
      explanation:
        "At steady state nothing builds up inside the boundary, so accumulation is zero and everything entering must equal everything leaving.",
    },
  ],

  "meb-mass-check": [
    {
      question: "For a steady-state open system, the mass balance states that:",
      options: [
        "Mass in is always greater than mass out",
        "Mass in equals mass out",
        "Mass is destroyed in proportion to energy released",
        "Mass balances only apply to liquids, not gases",
      ],
      answer: 1,
      explanation: "At steady state, nothing accumulates inside the boundary, so mass in must equal mass out.",
    },
    {
      question: "A flow meter reads 2 m³/s of air at a density of 1.2 kg/m³. The mass flow rate is:",
      options: ["1.2 kg/s", "0.6 kg/s", "2.4 kg/s", "2.0 kg/s"],
      answer: 2,
      explanation: "Mass flow = density × volume flow = 1.2 × 2 = 2.4 kg/s.",
    },
    {
      question: "Why does a combustion mass balance need the mass fraction of oxygen in air (~23.2%), not the volume/mole fraction (~21%)?",
      options: [
        "They're the same number and it doesn't matter which is used",
        "Mass and volume/mole percentages differ because oxygen and nitrogen molecules have different masses, and a mass balance must be done in mass units",
        "The volume fraction is only used for liquid fuels",
        "23.2% is simply a more accurate measurement of the same 21% figure",
      ],
      answer: 1,
      explanation:
        "Because O₂ molecules are heavier than N₂ molecules, air's oxygen content differs when expressed by mass versus by mole/volume — mixing the two up is a classic source of error.",
    },
    {
      question:
        "A boiler burns 0.01 kg/s of methane, needing 0.206 kg/s of actual (excess) air. By mass conservation alone, the flue gas mass flow must be:",
      options: ["0.01 kg/s", "0.196 kg/s", "0.216 kg/s", "It cannot be found without measuring it directly"],
      answer: 2,
      explanation:
        "Everything entering the combustion chamber (fuel + air) must leave as flue gas: 0.01 + 0.206 = 0.216 kg/s — found from the balance, with no flue-gas flow measurement needed.",
    },
    {
      question:
        "An air handling unit has 24 g/s of water vapour entering and 16 g/s leaving in the supply air. By mass conservation, the condensate draining from the coil must be:",
      options: ["40 g/s", "8 g/s", "24 g/s", "It depends on the air's temperature, not its mass balance"],
      answer: 1,
      explanation:
        "Water vapour in = water vapour out (as vapour) + condensate, so condensate = 24 − 16 = 8 g/s — the water is not destroyed, just converted from vapour to liquid.",
    },
  ],

  "meb-energy-check": [
    {
      question:
        "A boiler's fuel input, useful heat output, flue loss and blowdown loss are all measured or estimated directly. Casing loss is not directly measured. How is it found?",
      options: [
        "It's assumed to be zero",
        "As the residual: Fuel In − Useful Heat − Flue Loss − Blowdown Loss",
        "By multiplying the flue loss by a standard factor",
        "It cannot be estimated without a thermal-imaging survey",
      ],
      answer: 1,
      explanation:
        "This is the balance's most useful trick: solve for the one stream you can't easily measure directly by subtracting everything you can measure from the total input.",
    },
    {
      question: "In a steam system's energy balance, why does condensate typically return to the boiler carrying less energy than it left the point of use with?",
      options: [
        "Condensate loses mass on the way back",
        "Sensible heat radiates from uninsulated or long condensate return pipework as it travels back",
        "The boiler consumes the missing energy before the condensate arrives",
        "Condensate always returns at the same enthalpy it left with; nothing is ever lost",
      ],
      answer: 1,
      explanation:
        "Condensate leaves the process near steam temperature and cools in transit if the return line isn't well insulated — a genuine, avoidable heat loss the balance reveals directly.",
    },
    {
      question: "Removing moisture from air in a cooling coil (dehumidification) requires cooling the air:",
      options: [
        "To exactly the target supply temperature, no further",
        "Below its dew point, so water vapour condenses out",
        "Above its dew point, so water evaporates faster",
        "It requires no cooling at all, only a change in air speed",
      ],
      answer: 1,
      explanation: "Moisture only condenses out of air once it's cooled below its dew point — the basis of the standard cool-and-reheat dehumidification cycle.",
    },
    {
      question: "In an HVAC energy balance, 'reheat' (warming dehumidified air back up to a comfortable supply temperature) represents:",
      options: [
        "Free energy recovered from the cooling process",
        "A genuine additional energy cost, on top of the cooling and dehumidification already done",
        "A reduction in the coil's total load",
        "Energy that doesn't need to be counted in the balance",
      ],
      answer: 1,
      explanation:
        "Reheat is real additional energy spent purely to correct for over-cooling the air — it can be a third or more of the total coil load in a poorly designed system.",
    },
    {
      question: "A boiler's own combustion efficiency and a wider 'fuel to point of use' efficiency for the same plant can legitimately differ because:",
      options: [
        "One of the two figures must be a measurement error",
        "They are balances drawn around two different boundaries, answering two different questions",
        "Efficiency can only be defined one way; a difference always signals a fault",
        "Wider boundaries always show identical numbers to narrower ones",
      ],
      answer: 1,
      explanation:
        "A boiler-only boundary excludes distribution losses that a whole-system boundary includes — both numbers can be correct, for different questions.",
    },
  ],

  "meb-practice-check": [
    {
      question: "In a Sankey diagram, the width of each arrow represents:",
      options: [
        "The temperature of that flow",
        "The magnitude of that flow, so wider arrows are bigger flows",
        "How recently that flow was measured",
        "The cost per kWh of that flow",
      ],
      answer: 1,
      explanation: "Sankey diagrams use proportional width so the eye can compare flow sizes at a glance, without reading numbers.",
    },
    {
      question: "Exergy (or 'quality of energy') describes:",
      options: [
        "The total quantity of energy in a stream, exactly as an energy balance measures it",
        "How much of a stream's energy could theoretically be converted into useful work, given its temperature relative to its surroundings",
        "The price of energy in pounds per kWh",
        "A stream's mass flow rate",
      ],
      answer: 1,
      explanation:
        "Exergy captures usefulness, not just quantity — a kWh of electricity and a kWh of lukewarm waste heat contain the same energy but very different amounts of exergy.",
    },
    {
      question: "Compared with a heat source close to ambient temperature, a heat source much hotter than ambient has:",
      options: [
        "Less exergy (less potential to do useful work)",
        "More exergy (more potential to do useful work)",
        "Exactly the same exergy, since exergy doesn't depend on temperature",
        "No exergy at all, regardless of temperature",
      ],
      answer: 1,
      explanation:
        "The further a source's temperature is above ambient, the greater the fraction of its heat that could, in principle, be converted into useful work.",
    },
    {
      question: "Which sequence best describes the general method taught throughout this course?",
      options: [
        "Guess the losses, then adjust the input to match",
        "Draw a boundary, list every stream crossing it, measure what you can, and use conservation to solve for the rest",
        "Only ever measure every single stream directly; never calculate one",
        "Skip the boundary step and go straight to the arithmetic",
      ],
      answer: 1,
      explanation: "This sequence — boundary, streams, measure, solve, check it closes — is the method behind every balance in this course.",
    },
    {
      question: "If a generic industry rule of thumb disagrees with a balance you've built from your own measured, plant-specific numbers, you should generally:",
      options: [
        "Always trust the rule of thumb, since it's based on wide industry experience",
        "Trust your own balance, since rules of thumb are generic approximations meant for quick screening, not site-specific decisions",
        "Average the two figures together",
        "Discard both and use neither",
      ],
      answer: 1,
      explanation: "Rules of thumb are useful for a first, rapid screen — but a balance built from your own measured numbers on the actual plant is the more trustworthy figure for a real decision.",
    },
  ],

  "pinch-fundamentals-check": [
    {
      question: "Compared with matching waste heat sources to loads one pair at a time, pinch analysis:",
      options: [
        "Gives exactly the same result, just with more paperwork",
        "Looks at every hot and cold stream on site at once and calculates the true minimum utility requirement, which one-at-a-time matching cannot prove it has found",
        "Only works for a single stream at a time, like the waste heat recovery method",
        "Is only useful for processes with no waste heat at all",
      ],
      answer: 1,
      explanation:
        "A one-at-a-time search can find good matches but can never prove it found the best combination — pinch analysis calculates the provable minimum by considering the whole process simultaneously.",
    },
    {
      question: "A stream with a supply temperature of 160 °C that needs to leave at 60 °C is:",
      options: ["A cold stream", "A hot stream", "Neither — it needs a fixed temperature, not a change", "Both, depending on the fluid"],
      answer: 1,
      explanation: "A hot stream needs cooling — its supply temperature is higher than its target. This one needs cooling from 160 to 60 °C.",
    },
    {
      question: "CP (heat capacity flow rate), in kW/°C, is:",
      options: [
        "The stream's absolute temperature",
        "Mass flow rate × specific heat capacity",
        "The stream's pressure divided by its temperature",
        "A fixed constant that's the same for every stream",
      ],
      answer: 1,
      explanation: "CP = ṁ × cp — the same quantity from the Mass & Energy Balances course, given its own symbol because it's used so heavily in this method.",
    },
    {
      question: "The minimum approach temperature, ΔTmin, is best described as:",
      options: [
        "A universal physical constant that never changes",
        "A design choice, applied across the whole process, that trades off heat recovery against heat-exchanger size and cost",
        "The boiling point of the process fluid",
        "Something that only matters for cold streams, not hot ones",
      ],
      answer: 1,
      explanation: "ΔTmin isn't fixed by physics — it's chosen to balance how much heat you want to recover against how much exchanger area you're willing to pay for.",
    },
    {
      question: "A hot composite curve is built by:",
      options: [
        "Picking the single hottest stream and ignoring the rest",
        "In each temperature band, summing the CP of every hot stream present, multiplying by the band width, and accumulating the heat from the highest temperature downward",
        "Averaging the supply temperatures of all hot streams",
        "Plotting each hot stream on a separate, unrelated chart",
      ],
      answer: 1,
      explanation: "Composite curves combine multiple streams by adding their CPs within each temperature interval where they're simultaneously present, then accumulating heat band by band.",
    },
  ],

  "pinch-targeting-check": [
    {
      question: "Why do you shift hot stream temperatures down and cold stream temperatures up by ΔTmin ÷ 2 before building the problem table?",
      options: [
        "It's just a convention with no real purpose",
        "It puts hot and cold streams on one shared scale, where touching shifted ranges are automatically exactly ΔTmin apart in reality",
        "It converts the temperatures from Celsius to Kelvin",
        "It only applies to cold streams, not hot ones",
      ],
      answer: 1,
      explanation: "Shifting lets you compare hot and cold streams directly on one scale without tracking the ΔTmin offset separately at every step of the cascade.",
    },
    {
      question: "In the problem table cascade (started at zero heat input), the most negative running value represents:",
      options: [
        "A calculation error that should be ignored",
        "The minimum hot utility that must be added at the top to make the whole cascade thermodynamically feasible",
        "The minimum cold utility needed",
        "The total heat load of all cold streams combined",
      ],
      answer: 1,
      explanation: "A negative cascade value is thermodynamically impossible on its own; topping it up to zero at its lowest point sets the minimum hot utility.",
    },
    {
      question: "After topping up the cascade with the minimum hot utility, the pinch point is located where:",
      options: [
        "The cascade is at its highest value", "The cascade touches exactly zero", "The cascade is negative", "The very top of the temperature scale, always",
      ],
      answer: 1,
      explanation: "The pinch is exactly where the topped-up cascade reaches zero — the single tightest point in the whole process.",
    },
    {
      question: "According to the golden rules, above the pinch you should never use:",
      options: ["Hot utility", "Cold utility", "Any process stream", "A heat exchanger"],
      answer: 1,
      explanation: "Above the pinch is a net heat sink — using cold utility there wastes heat the process itself needs, forcing extra hot utility to compensate.",
    },
    {
      question: "If 15 kW of heat is transferred directly across the pinch, the total utility penalty (extra hot + extra cold combined) is:",
      options: ["15 kW", "30 kW", "7.5 kW", "0 kW — crossing the pinch has no energy penalty"],
      answer: 1,
      explanation: "Every kW crossing the pinch costs 2 kW of total utility — 1 extra kW of hot utility to replace what's missing, and 1 extra kW of cold utility to reject what shouldn't have been cooled there.",
    },
  ],

  "pinch-network-design-check": [
    {
      question: "Immediately above the pinch, a feasible match requires:",
      options: [
        "CP(hot) ≥ CP(cold)", "CP(hot) ≤ CP(cold)", "CP(hot) = CP(cold), always exactly", "The rule doesn't apply above the pinch",
      ],
      answer: 1,
      explanation: "Above the pinch, CP(hot) ≤ CP(cold) keeps the temperature approach growing (not shrinking) as you move away from the pinch.",
    },
    {
      question: "The 'tick-off' heuristic means:",
      options: [
        "Randomly assigning matches until something works",
        "Matching feasible streams at the pinch, transferring heat until one stream is exhausted, removing it from consideration, and repeating with what's left",
        "Ticking a checklist with no calculation involved",
        "Only ever matching streams of identical CP",
      ],
      answer: 1,
      explanation: "Tick-off works outward from the pinch, exhausting one stream per match and removing ('ticking off') it before continuing with the remainder.",
    },
    {
      question: "Splitting a stream into two branches is the right move when:",
      options: [
        "You want to add unnecessary complexity to a network",
        "No single unsplit match between the streams involved satisfies the CP feasibility rule",
        "Every possible match is already feasible",
        "The stream's CP is very small",
      ],
      answer: 1,
      explanation: "Splitting creates two smaller-CP branches from one stream, which can satisfy the feasibility rule even when the original, unsplit stream couldn't against either target on its own.",
    },
    {
      question: "The minimum number of heat-transfer units for a region with 5 streams and utilities (no loops) is:",
      options: ["5", "4", "6", "2.5"],
      answer: 1,
      explanation: "N = S + L − 1 = 5 + 0 − 1 = 4.",
    },
    {
      question: "A network with more units than its minimum-units target most likely contains:",
      options: [
        "A calculation error that should be re-checked from scratch",
        "An independent loop — a redundant connection that can often be removed with a small energy penalty",
        "A missing utility that needs to be added",
        "Nothing unusual — extra units are always harmless",
      ],
      answer: 1,
      explanation: "Extra units beyond S − 1 signal a loop; breaking it (removing the smallest-duty exchanger and rebalancing) usually cuts capital cost for a small energy trade-off.",
    },
  ],

  "pinch-economics-check": [
    {
      question: "As ΔTmin is tightened (made smaller), the minimum hot and cold utility requirements:",
      options: [
        "Both increase", "Both decrease (or stay the same)", "Hot utility increases while cold utility decreases", "Neither changes — ΔTmin only affects equipment size",
      ],
      answer: 1,
      explanation: "A smaller ΔTmin lets more heat be recovered between process streams, reducing (or holding steady) both utility requirements.",
    },
    {
      question: "As ΔTmin is tightened, heat-exchanger capital cost typically:",
      options: ["Falls", "Rises, because a smaller temperature difference needs more heat-transfer area", "Stays exactly fixed", "Becomes irrelevant"],
      answer: 1,
      explanation: "A tighter approach temperature drives heat transfer more slowly for a given area, so more area (and cost) is needed to move the same heat.",
    },
    {
      question: "A 'threshold problem' in pinch analysis is a process that:",
      options: [
        "Needs both a hot and cold utility in equal amounts",
        "Genuinely needs only one utility — either hot or cold, never both",
        "Cannot be analysed with the problem table method",
        "Always requires stream splitting",
      ],
      answer: 1,
      explanation: "In a threshold problem, one stream's surplus (or deficit) is large enough, with good temperature overlap, that only one utility is ever needed.",
    },
    {
      question: "Before recommending new heat-recovery equipment on an existing site, a retrofit pinch study should first check for:",
      options: [
        "Whether the site has a large car park",
        "Existing golden-rule violations already in the plant, since correcting those is often a near-free re-piping job",
        "The colour of the pipework",
        "Whether competitors use pinch analysis",
      ],
      answer: 1,
      explanation: "Existing cross-pinch violations are usually the cheapest fix available — often just re-routing an existing connection — and should be found and corrected before proposing new capital.",
    },
    {
      question: "In a retrofit audit, if actual hot utility and actual cold utility both exceed their calculated targets by the same amount, that pattern most likely indicates:",
      options: [
        "A meter calibration error that should be ignored",
        "A single connection crossing the pinch, since a violation of size Q raises both utilities by Q each",
        "The targets were calculated incorrectly",
        "The process needs a completely new stream table",
      ],
      answer: 1,
      explanation: "Equal gaps on both hot and cold utility is the signature of a golden-rule violation — a single misplaced connection of that size crossing the pinch.",
    },
  ],

  "brewery-fundamentals-check": [
    {
      question: "Malting — steeping, germinating and kilning barley into malt — usually happens:",
      options: [
        "At the brewery itself, as the very first process step",
        "Off-site, at a maltster, and is outside a brewery energy audit's usual boundary",
        "During the wort boil",
        "During fermentation",
      ],
      answer: 1,
      explanation: "Malting is normally done off-site by a specialist maltster, on a different energy bill and outside what a brewery's own audit can measure or change.",
    },
    {
      question: "Which single brewhouse step is typically the biggest thermal (gas) load?",
      options: ["Milling the malt", "Mashing", "The wort boil", "Lautering"],
      answer: 2,
      explanation: "Boiling the wort for 60–90 minutes — raising it to boiling and maintaining a rolling boil — is the single largest heat demand in the brewhouse.",
    },
    {
      question: "Fermentation is a major electrical (refrigeration) load because:",
      options: [
        "It requires bright lighting",
        "It's exothermic — yeast converting sugar to alcohol releases heat that a cooling jacket must continuously remove to hold the target temperature",
        "It uses compressed air",
        "It requires reheating the wort",
      ],
      answer: 1,
      explanation: "Fermentation releases real heat as a byproduct of the biological reaction, and active cooling is needed throughout to hold the target temperature.",
    },
    {
      question: "Comparing a 12-day fermentation cycle to a 14-day conditioning cycle for a similar-sized vessel, which typically costs more in refrigeration electricity, and why?",
      options: [
        "Conditioning always costs more, simply because it lasts longer",
        "Fermentation can cost more despite the shorter duration, because its peak cooling intensity (kW) is much higher than conditioning's gentler, steady load",
        "They always cost exactly the same",
        "Neither uses meaningful refrigeration energy",
      ],
      answer: 1,
      explanation: "Intensity matters as much as duration — a short, intense fermentation load can outweigh a longer but gentler conditioning load in total electrical cost.",
    },
    {
      question: "A brewery's electrical load profile, compared to a typical office building's, usually:",
      options: [
        "Shows a sharp daytime peak and a night-time trough, just like an office",
        "Is fairly flat and continuous, because fermentation and conditioning refrigeration run around the clock regardless of time of day",
        "Only draws power during office hours",
        "Has no predictable pattern at all",
      ],
      answer: 1,
      explanation: "Because refrigeration for fermentation and conditioning runs continuously, a brewery's load looks much flatter than an occupancy-driven building load.",
    },
  ],

  "brewery-benchmarks-check": [
    {
      question: "Energy intensity (kWh per hectolitre) is a more useful comparison metric than total annual energy because:",
      options: [
        "It's easier to calculate",
        "It normalises for production volume, so breweries of different sizes (or the same brewery in different years) can be compared fairly",
        "It ignores production entirely",
        "Total energy is always a bigger number",
      ],
      answer: 1,
      explanation: "A brewery's total energy tells you little without knowing how much beer it made — intensity (kWh/hL) is the normalised, comparable figure.",
    },
    {
      question: "Craft breweries typically show higher energy intensity (kWh/hL) than large macro-breweries mainly because:",
      options: [
        "Craft brewers are careless with energy",
        "Fixed losses (standing losses, minimum practical batch sizes) don't shrink with output, so they're a bigger share of the total at smaller production scales",
        "Craft beer requires more hops",
        "Macro-breweries use free energy",
      ],
      answer: 1,
      explanation: "Fixed equipment losses stay roughly constant regardless of scale, so they dominate more at smaller production volumes — a scale effect, not a competence one.",
    },
    {
      question: "The water-to-beer ratio matters for energy management because:",
      options: [
        "Water has no connection to energy use",
        "Most water used in brewing (mashing, sparging, CIP) needs heating, so a lower water-to-beer ratio often means lower energy intensity too",
        "It only affects the water bill, never the energy bill",
        "It's purely an environmental metric with no cost link",
      ],
      answer: 1,
      explanation: "Reducing water use often reduces the energy needed to heat that water — the two are linked, not independent, in a brewery.",
    },
    {
      question: "Before comparing a small regional brewery's energy intensity to a published benchmark, you should:",
      options: [
        "Assume all breweries should hit the same number regardless of scale",
        "Check whether the benchmark reflects a comparable scale and beer style (e.g. ale vs lager), since both significantly affect achievable intensity",
        "Ignore benchmarks entirely",
        "Only compare to breweries in other countries",
      ],
      answer: 1,
      explanation: "Benchmarks are only useful compared like-for-like — scale and process style (lager's longer, colder conditioning costs more than ale) both genuinely change what's achievable.",
    },
    {
      question: "A brewery's own historical intensity trend (kWh/hL over time, production held roughly constant) is useful because:",
      options: [
        "It's required by law",
        "A rising trend is a clear signal that something (fouling, drift, a failing control) needs investigating, independent of any external benchmark",
        "It replaces the need for any external benchmark comparison",
        "It only matters once a year",
      ],
      answer: 1,
      explanation: "Establishing your own baseline and watching it over time reveals developing problems directly — the same principle as the monitoring & targeting course's baseline method.",
    },
  ],

  "brewery-compliance-check": [
    {
      question: "Why is brewery trade effluent typically charged more than its raw volume would suggest?",
      options: [
        "Trade effluent charges are always flat-rate regardless of content",
        "Charging formulas (like the Mogden formula) charge for strength (BOD/COD load) as well as volume, and brewery effluent is often high in organic strength",
        "Breweries are charged extra purely because they make alcohol",
        "There is no separate trade effluent charge for breweries",
      ],
      answer: 1,
      explanation: "Trade effluent charging typically has both a volume component and a strength (BOD/COD) component — brewery effluent's high organic content pushes up the strength-based charge specifically.",
    },
    {
      question: "Recovering both the heat AND the water from wort cooling (reusing it as brewing liquor, rather than draining it) can reduce:",
      options: [
        "Only the gas bill",
        "Both the gas bill (recovered heat) and the trade effluent bill (reduced discharge volume) at the same time",
        "Only the trade effluent bill",
        "Neither bill",
      ],
      answer: 1,
      explanation: "Recovering the water itself, not just its heat, cuts the volume side of the trade effluent charge alongside the energy saving — two benefits from one project.",
    },
    {
      question: "A HACCP critical limit, such as a CIP wash temperature, should be treated as:",
      options: [
        "A setpoint that can be lowered freely if it saves energy",
        "A food-safety requirement that should never be crossed without proper validation, regardless of the energy saving on offer",
        "A rough suggestion with no real consequence",
        "Something only relevant to large breweries",
      ],
      answer: 1,
      explanation: "HACCP critical limits are set to reliably prevent a hazard — lowering one without validating that it still works is a food-safety risk, not a legitimate efficiency measure.",
    },
    {
      question: "Most craft and regional UK breweries, in terms of ESOS and SECR applicability, are:",
      options: [
        "Always in scope, regardless of size",
        "Likely SMEs, below the size thresholds, and therefore exempt from both — though large or multinational brewing groups are firmly in scope",
        "Automatically exempt because they make alcohol",
        "Only in scope if they export beer",
      ],
      answer: 1,
      explanation: "ESOS and SECR apply to large undertakings by employee count and turnover/balance-sheet thresholds — most craft/regional breweries fall below these and are exempt, unlike large brewing groups.",
    },
    {
      question: "A Climate Change Agreement (CCA), historically available to the brewing sector, works by:",
      options: [
        "Banning the use of gas in breweries",
        "Giving a reduced Climate Change Levy rate in exchange for the sector meeting agreed energy-efficiency targets",
        "Replacing the need for an energy audit entirely",
        "Applying automatically to every business regardless of sector",
      ],
      answer: 1,
      explanation: "A CCA is a sector-negotiated agreement trading a lower CCL rate for meeting efficiency targets — eligibility and terms should always be checked current for the specific site.",
    },
  ],

  "brewery-efficiency-check": [
    {
      question: "Vapour condensing (recovering heat from the wort boil's evaporated water) and wort-cooling heat recovery (recovering heat from the cooled wort afterward) are:",
      options: [
        "The same project under two different names",
        "Two independent opportunities that recover heat at different points in the process, so their savings add rather than compete",
        "Mutually exclusive — only one can ever be installed",
        "Not worth pursuing in a brewery of any size",
      ],
      answer: 1,
      explanation: "One captures latent heat leaving as vapour during the boil; the other captures heat leaving as hot water afterward — genuinely separate recovery points.",
    },
    {
      question: "Breweries often suit CHP (combined heat and power) unusually well because:",
      options: [
        "They have no electrical demand at all",
        "They typically need steam/hot water and electricity simultaneously and fairly continuously — a load profile CHP economics favour",
        "CHP is mandatory for food and drink businesses",
        "Breweries never use any heat",
      ],
      answer: 1,
      explanation: "A steady, simultaneous heat-and-power demand (unlike a weather-driven building load) is exactly the profile that makes a CHP business case work well.",
    },
    {
      question: "Running one shared glycol loop at the coldest temperature any user needs (e.g. conditioning) means:",
      options: [
        "Every user gets exactly the temperature it needs, with no waste",
        "Users needing a warmer temperature (e.g. fermentation) are cooled by unnecessarily cold glycol, costing more energy than a correctly-matched loop would",
        "The plant automatically becomes more efficient",
        "Nothing changes regardless of loop design",
      ],
      answer: 1,
      explanation: "Making colder glycol always costs more per the COP relationship — supplying warmer-temperature users from an unnecessarily cold shared loop wastes that extra cost on them too.",
    },
    {
      question: "Before proposing a new free-cooling system for a glycol chiller, you should first check whether:",
      options: [
        "The plant already has free-cooling capability that's simply unused or disabled",
        "Free cooling is illegal in the UK",
        "The brewery has ever heard of the concept",
        "It's cheaper to just buy a second chiller",
      ],
      answer: 0,
      explanation: "Some plants are free-cooling-capable but never commissioned to use it, or had it disabled after a fault — recommissioning existing capability is usually far cheaper than adding new equipment.",
    },
    {
      question: "A glycol chiller's condenser becomes fouled. What is the direct effect on the fermentation jacket it serves?",
      options: [
        "No effect — fouling only affects the compressor's electricity bill, not cooling capacity",
        "The chiller can only deliver glycol at a warmer supply temperature, which reduces the jacket's cooling capacity by shrinking the temperature approach available",
        "The jacket's cooling capacity increases",
        "Fouling only matters for boilers, not refrigeration plant",
      ],
      answer: 1,
      explanation: "A fouled condenser can't reject heat as effectively, forcing a warmer glycol supply temperature — which directly shrinks the approach temperature driving heat transfer in the jacket, cutting its real cooling capacity.",
    },
  ],
};
