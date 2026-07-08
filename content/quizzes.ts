/**
 * Quiz registry. Author quizzes here and reference them from MDX with a simple
 * id: <Quiz id="intro-final" />. Keeping the (structured) quiz data in TypeScript
 * means it's type-checked, reusable, and avoids passing complex objects across
 * the server/client boundary from MDX.
 *
 * Authoring rules (no tells): options must be comparable in length and detail,
 * and the correct answer must not be predictable by position. Positions are
 * balanced by the seeded shuffle in scripts; keep lengths balanced by hand.
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
        "Energy is the instantaneous rate; power is what accumulates over time",
        "Power is always the larger of the two numbers for any real machine",
        "Power is the rate of use; energy is that rate accumulated over time",
        "They are the same physical quantity, just expressed in different units",
      ],
      answer: 2,
      explanation:
        "Power (kW) is the instantaneous rate; energy (kWh) accumulates over time. Energy = power × time.",
    },
    {
      question:
        "A 5 kW motor runs continuously for 4 hours. How much energy does it use?",
      options: ["20 kWh", "9 kWh", "5 kWh", "1.25 kWh"],
      answer: 0,
      explanation: "Energy = power × time = 5 kW × 4 h = 20 kWh.",
    },
    {
      question: "One kilowatt-hour (kWh) is equal to:",
      options: ["1,000 J", "100 MJ", "3,600 MJ", "3.6 MJ"],
      answer: 3,
      explanation:
        "1 kW (1000 J/s) running for 3600 s delivers 3,600,000 J = 3.6 MJ.",
    },
    {
      question: "The first law of thermodynamics tells us that:",
      options: [
        "Energy is conserved: it is converted between forms, never destroyed",
        "The total energy of any system always increases over time",
        "Heat is a form of energy that can never be turned into useful work",
        "Energy can be created on demand if you supply enough power",
      ],
      answer: 0,
      explanation:
        "Energy is conserved (first law). The second law explains why it still degrades in quality with every conversion.",
    },
    {
      question:
        "A project costs £12,000 and saves £4,000 per year. Its simple payback is:",
      options: ["8 years", "3 years", "4 years", "0.33 years"],
      answer: 1,
      explanation:
        "Simple payback = capital cost ÷ annual saving = 12,000 ÷ 4,000 = 3 years.",
    },
    {
      question: "A key limitation of simple payback is that it:",
      options: [
        "Ignores the time value of money and savings beyond the payback point",
        "Only works for projects whose annual savings are exactly constant",
        "Systematically overstates the true return of every energy project",
        "Requires a discount rate, which most organisations cannot agree on",
      ],
      answer: 0,
      explanation:
        "Simple payback ignores cash flows beyond payback and the time value of money, which is why NPV and IRR exist.",
    },
  ],
  "boilers-final": [
    {
      question: "Complete combustion of natural gas requires what ratio of air to fuel?",
      options: [
        "About 10:1, the stoichiometric air requirement",
        "About 50:1, far more air than fuel by volume",
        "About 1:1, roughly equal volumes of air and gas",
        "None: natural gas carries its own oxygen and burns alone",
      ],
      answer: 0,
      explanation:
        "Stoichiometric air is about 10 volumes of air per 1 volume of methane. In practice, you run 10–20% excess air to ensure complete combustion.",
    },
    {
      question:
        "A boiler is found to be running at 12% O₂ in the flue gas. What does this indicate?",
      options: [
        "Excellent combustion: high oxygen proves the fuel burned fully",
        "Too much excess air, carrying heat away up the flue as waste",
        "A faulty analyser: flue oxygen cannot physically reach 12%",
        "Too little air, causing incomplete combustion and CO formation",
      ],
      answer: 1,
      explanation:
        "12% O₂ is high excess air (target is 3–5%). All that extra air is heated and thrown up the flue.",
    },
    {
      question:
        "Flue-gas temperature is 185 °C on a non-condensing boiler. What is the most likely cause?",
      options: [
        "Normal operation: modern boilers run flues at 180–200 °C by design",
        "Fouling (soot or scale) or excess-air drift is reducing heat transfer",
        "The return water temperature is too low for the burner to modulate",
        "The building's heating load is higher than the boiler was sized for",
      ],
      answer: 1,
      explanation:
        "A well-tuned non-condensing boiler runs 140–160 °C flue. 185 °C suggests dirty heat-transfer surfaces or excess-air creep.",
    },
    {
      question:
        "Continuous blowdown at 3% on a 500 kW boiler costs roughly how much per year in wasted heat?",
      options: [
        "£500: negligible against the fuel bill",
        "£2,000: real but minor at this scale",
        "£15,000: typically the boiler's biggest loss",
        "£5,000–6,000: a significant recurring loss",
      ],
      answer: 3,
      explanation:
        "3% continuous blowdown wastes ~15 kW of heat (the energy to reheat incoming cold water). At ~£0.10/kWh, that's ~£5,000/year.",
    },
    {
      question:
        "A boiler has a fixed temperature setpoint of 75 °C year-round. What is the main inefficiency?",
      options: [
        "No weather compensation: on mild days 75 °C is needlessly high",
        "Nothing: a stable fixed setpoint is optimal for most buildings",
        "Fixed setpoints force the burner to cycle on and off constantly",
        "The setpoint is too low for winter, so comfort suffers on cold days",
      ],
      answer: 0,
      explanation:
        "Weather compensation adjusts setpoint to outdoor temperature. On a mild day, 50 °C may be sufficient. Running at 75 °C wastes 5–10% of heating energy.",
    },
    {
      question:
        "When is a condensing boiler NOT a good choice, despite high efficiency?",
      options: [
        "When the boiler is small, since condensing only works above 100 kW",
        "When the building is newly built to current fabric standards",
        "When the fuel is natural gas rather than oil or LPG",
        "When the heating system returns water hot (above about 60 °C)",
      ],
      answer: 3,
      explanation:
        "Condensing boilers need return water below ~55 °C to condense. Systems with hot returns never reach the dew point, so the efficiency benefit is lost.",
    },
  ],
  "hvac-final": [
    {
      question: "What is the main advantage of weather compensation in HVAC?",
      options: [
        "It adjusts the heating setpoint automatically to outdoor conditions",
        "It holds the flow temperature perfectly constant all year round",
        "It removes the need for any cooling plant in a mild climate",
        "It lets one thermostat control every zone in the whole building",
      ],
      answer: 0,
      explanation:
        "Weather compensation lowers the flow setpoint on mild days and raises it on cold days, matching output to real demand automatically.",
    },
    {
      question: "On a 15 °C mild day in spring, the best HVAC strategy is:",
      options: [
        "Run the chiller continuously to hold exactly 21 °C inside",
        "Use the outdoor-air economiser or free cooling instead of plant",
        "Shut down all mechanical systems and rely on opening windows",
        "Run the boiler at full output so comfort is guaranteed",
      ],
      answer: 1,
      explanation:
        "An economiser uses outdoor air to meet conditioning needs when the outside temperature suits, far cheaper than mechanical heating or cooling.",
    },
    {
      question: "A VAV (variable-air-volume) system reduces fan energy by:",
      options: [
        "Switching satisfied zones fully off and isolating their ducts",
        "Recirculating exactly half of the return air at all times",
        "Throttling zone dampers so total flow falls and the fan slows",
        "Replacing large supply fans with many small booster pumps",
      ],
      answer: 2,
      explanation:
        "VAV dampers close as zones reach setpoint, reducing total flow and duct pressure, allowing the fan to slow and use far less energy.",
    },
    {
      question:
        "A building is always 2 °C colder than its 21 °C setpoint. What is the most likely problem?",
      options: [
        "The boiler has failed and is providing no heat at all",
        "The occupants keep adjusting the setpoint without recording it",
        "The thermostat sensor has drifted and reads higher than actual",
        "The heating pipework is undersized for the building's load",
      ],
      answer: 2,
      explanation:
        "If the sensor reads 23 °C when the room is actually 21 °C, the controller thinks it's already warm and stops heating. Fix: recalibrate the sensor.",
    },
    {
      question: "What is latent cooling, and why is it energy-intensive?",
      options: [
        "Cooling delivered overnight, expensive because of off-peak tariffs",
        "Cooling with outdoor air alone, using no mechanical refrigeration",
        "Pre-cooling the building fabric before the occupants arrive",
        "Cooling air below dew point to remove moisture, then reheating it",
      ],
      answer: 3,
      explanation:
        "To remove moisture you cool air below its dew point (~8 °C), then reheat to comfort (~20 °C). That reheat is largely wasted energy if humidity control is stricter than needed.",
    },
    {
      question: "An economizer is not working on a 10 °C day. What is the problem?",
      options: [
        "Outdoor air at 10 °C is too cold to introduce into a building",
        "Economisers are seasonal devices that lock out in spring",
        "A stuck outdoor damper, or controls not recognising the opportunity",
        "The chiller must run first before an economiser can enable",
      ],
      answer: 2,
      explanation:
        "An economiser should be active whenever outdoor conditions can do the cooling. If not, the damper may be stuck or the control isn't seeing the opportunity.",
    },
  ],
  "energy-fundamentals-check": [
    {
      question: "The first law of thermodynamics states:",
      options: [
        "Heat flows spontaneously from cold bodies to hot bodies",
        "Energy is conserved: converted between forms, never destroyed",
        "A perfectly designed machine can approach 100% efficiency",
        "All energy eventually ends up as unrecoverable waste heat",
      ],
      answer: 1,
      explanation:
        "The first law says energy is conserved. The second law explains why perfect efficiency is impossible (energy degrades in quality).",
    },
    {
      question: "What is the relationship between energy and power?",
      options: [
        "They are two names for the same measured quantity",
        "Power equals energy multiplied by time",
        "Energy equals power multiplied by time",
        "Energy is always numerically larger than power",
      ],
      answer: 2,
      explanation: "Power (kW) is the rate; energy (kWh) accumulates over time. Energy = power × time.",
    },
    {
      question: "Which unit conversion is correct?",
      options: [
        "1 MJ = 3.6 kWh",
        "1 kWh = 1 MJ",
        "1 kWh = 360 MJ",
        "1 kWh = 3.6 MJ",
      ],
      answer: 3,
      explanation: "1 kW running for 3600 seconds (1 hour) = 3,600,000 J = 3.6 MJ.",
    },
    {
      question: "A 10 kW heater runs for 2 hours. How much energy does it use?",
      options: ["10 kWh", "2 kWh", "20 kWh", "5 kWh"],
      answer: 2,
      explanation: "Energy = power × time = 10 kW × 2 h = 20 kWh.",
    },
  ],
  "energy-management-check": [
    {
      question: "The primary business case for energy management is:",
      options: [
        "Carbon reporting requires it for all UK companies by law",
        "Employee comfort improves whenever energy use is reduced",
        "Regulatory compliance is impossible without a formal programme",
        "Energy savings go straight to profit, unlike extra sales revenue",
      ],
      answer: 3,
      explanation:
        "A £10k energy saving improves profit by £10k. At a 5% margin, matching that would take £200k of new sales.",
    },
    {
      question: "What does the Plan-Do-Check-Act cycle do?",
      options: [
        "Delivers a single one-off improvement and then completes",
        "Removes the need for audits once the first lap is finished",
        "Enables continuous improvement by repeating the loop",
        "Guarantees each energy project only ever needs doing once",
      ],
      answer: 2,
      explanation: "PDCA is a loop: each lap finds new savings as the baseline rises and controls are refined.",
    },
    {
      question: "Which statement about the energy management cycle is false?",
      options: [
        "Check means verifying that claimed savings are real (M&V)",
        "Do means implementing the chosen measures on the ground",
        "Act means running the building at higher setpoints for savings",
        "Plan includes setting objectives and auditing for opportunities",
      ],
      answer: 2,
      explanation: "Act means reviewing performance, standardising what worked, and feeding lessons back into the next Plan. Higher setpoints waste energy.",
    },
    {
      question: "An energy audit typically includes:",
      options: [
        "Installing permanent sensors and waiting a year for trends",
        "A review of the utility bills and nothing further on site",
        "Walk-throughs, measurement, analysis and ranked opportunities",
        "Replacing the oldest equipment before any data is collected",
      ],
      answer: 2,
      explanation: "A credible audit has scope, measurement, analysis, and ranked recommendations.",
    },
  ],
  "ac-check": [
    {
      question: "Ohm's law states:",
      options: [
        "V = I / R",
        "V = P × R",
        "P = V / I",
        "V = I × R",
      ],
      answer: 3,
      explanation: "V = I × R (voltage equals current times resistance).",
    },
    {
      question: "Why do buildings use AC instead of DC?",
      options: [
        "AC wiring is cheaper to install and needs no earthing",
        "AC delivers the same power while drawing much less current",
        "DC distribution is illegal in commercial buildings under the UK wiring regulations",
        "Transformers make AC efficient to distribute, and motors run well on it",
      ],
      answer: 3,
      explanation:
        "AC can be stepped up and down by transformers for efficient distribution, and AC motors are simple and reliable.",
    },
    {
      question: "Power factor is the ratio of:",
      options: [
        "Real power to apparent power",
        "Peak demand to average demand",
        "Voltage to current",
        "Energy used to energy billed",
      ],
      answer: 0,
      explanation:
        "Power factor = real power ÷ apparent power. A PF below 1 means reactive power is circulating without doing useful work.",
    },
    {
      question: "A poor power factor (say, 0.7) means:",
      options: [
        "The supply voltage has sagged below its statutory minimum",
        "The building is actually drawing less energy than its billing meters are recording",
        "Extra current flows for the same useful power, incurring charges",
        "The site's equipment is running unusually efficiently",
      ],
      answer: 2,
      explanation:
        "Low PF means reactive power: utilities charge for it, and the extra current heats cables and wastes capacity.",
    },
  ],
  "three-phase-check": [
    {
      question: "In a three-phase system, the three phases are separated by:",
      options: [
        "120 degrees",
        "90 degrees",
        "180 degrees",
        "360 degrees",
      ],
      answer: 0,
      explanation: "Three-phase voltages are 120 degrees apart, creating smooth power delivery.",
    },
    {
      question: "Line voltage in a three-phase system is:",
      options: [
        "Exactly the same as the phase voltage",
        "Double the phase voltage on a balanced supply",
        "Lower than the phase voltage by a factor of √3 (about 0.58)",
        "Higher than the phase voltage by a factor of √3 (about 1.73)",
      ],
      answer: 3,
      explanation: "V_line = V_phase × √3. In a 230 V system, line voltage is about 400 V.",
    },
    {
      question: "Three-phase systems are preferred in industry because:",
      options: [
        "They are exempt from maximum-demand charges on the bill",
        "They need only a single conductor to carry the full current, saving copper on every run",
        "They deliver electricity at a much higher frequency",
        "Power delivery is smooth and motors are simpler and more efficient",
      ],
      answer: 3,
      explanation:
        "Three-phase power delivery is constant (no dips like single-phase) and three-phase motors are self-starting and efficient.",
    },
  ],
  "electrical-check": [
    {
      question: "Demand charges on a business electricity bill are based on:",
      options: [
        "The number of separate circuits on the distribution board",
        "The declared voltage of the incoming supply",
        "The total kWh consumed across the whole month",
        "The highest power draw in any half-hour interval",
      ],
      answer: 3,
      explanation:
        "Demand charges penalise peak power. A single half-hour spike can set the charge for the whole month.",
    },
    {
      question: "An energy meter typically measures:",
      options: [
        "Voltage only, with current inferred from the tariff",
        "Current only, since voltage is fixed by the network",
        "Real power and energy, and often power factor and reactive power",
        "Temperature-corrected energy for the heating fuels alone, with electricity read separately",
      ],
      answer: 2,
      explanation: "Modern meters measure real power, reactive power, and power factor; older ones may record less.",
    },
    {
      question: "Which is a practical step to reduce electrical demand charges?",
      options: [
        "Increase the declared supply capacity with the network operator",
        "Switch every load off simultaneously at the end of each day",
        "Replace three-phase equipment with single-phase equivalents",
        "Stagger the start-ups of large equipment across the morning",
      ],
      answer: 3,
      explanation:
        "Load shifting, spreading start-ups over time, flattens the demand curve and avoids setting a new monthly peak.",
    },
  ],
  "mt-fundamentals-check": [
    {
      question: "The main goal of Monitoring & Targeting is to:",
      options: [
        "Record consumption accurately for the annual accounts",
        "Prove to tenants that their bills are calculated fairly",
        "Turn meter data into continuous energy improvement",
        "Replace the need for periodic energy audits entirely",
      ],
      answer: 2,
      explanation:
        "M&T is about using data to drive action: baselines, targets, and spotting anomalies early so you improve continuously.",
    },
    {
      question: "Normalisation in M&T means:",
      options: [
        "Smoothing anomalies out of the data before reporting it",
        "Bringing an abnormal building back to standard operation",
        "Adjusting consumption for drivers like weather so comparisons are fair",
        "Calibrating every meter on the site against a single reference standard once each year",
      ],
      answer: 2,
      explanation:
        "A degree-day adjustment lets you fairly compare year-on-year consumption despite one winter being milder than another.",
    },
    {
      question: "Meter data should be collected:",
      options: [
        "Continuously and automatically, but reviewed in detail no more than once each year",
        "Only when a problem is already suspected",
        "Frequently (weekly, daily or half-hourly) so trends show early",
        "Annually, when the utility statement arrives",
      ],
      answer: 2,
      explanation:
        "High-frequency data lets you spot changes within days and investigate while the cause is still findable.",
    },
    {
      question: "Which is the best interval for comparing energy consumption?",
      options: [
        "Hours, since more granularity always beats less",
        "Individual days, carefully matched by calendar date and day of week across the years",
        "Weeks or months, normalised for weather and business changes",
        "Annual totals, since they smooth out all the noise",
      ],
      answer: 2,
      explanation:
        "Weekly or monthly intervals smooth daily variation while staying frequent enough to catch developing problems.",
    },
  ],
  "baselines-check": [
    {
      question: "An energy baseline is:",
      options: [
        "A normalised reference of consumption against which change is measured",
        "The lowest consumption the building could theoretically achieve with perfect operation",
        "The design consumption stated in the building's original spec",
        "The consumption recorded on the coldest day of the year",
      ],
      answer: 0,
      explanation:
        "A baseline is a calculated reference (usually averaged and normalised) that represents the 'no improvements' case.",
    },
    {
      question: "An energy signature relates:",
      options: [
        "Baseload consumption to the building's floor area",
        "Consumption to external drivers like temperature or production",
        "A site's consumption to the industry benchmark for its sector",
        "Each meter reading to the tariff being paid at the time",
      ],
      answer: 1,
      explanation:
        "An energy signature shows how consumption changes with its drivers, e.g. more heating load on colder days.",
    },
    {
      question: "A regression analysis on energy data helps you:",
      options: [
        "Forecast future fuel prices from historical bills",
        "Quantify how much a change in a driver affects consumption",
        "Identify which department is responsible for the waste",
        "Check whether the utility has applied the correct unit rates",
      ],
      answer: 1,
      explanation:
        "Regression finds the relationship: for every degree colder, heating rises by X kWh. That lets you isolate true savings.",
    },
    {
      question: "When decomposing a change in consumption, you separate:",
      options: [
        "Fixed standing charges from variable unit charges",
        "Heating consumption from cooling consumption",
        "Real savings from the effects of weather, production or occupancy",
        "The old equipment's share of consumption from the newly installed equipment's share",
      ],
      answer: 2,
      explanation:
        "If consumption dropped 10% but occupancy fell 20%, the 'saving' may hide a real deterioration. Decomposition reveals it.",
    },
  ],
  "targeting-check": [
    {
      question: "A good energy target should be:",
      options: [
        "As aggressive as possible to maximise the team's motivation",
        "Last year's consumption carried forward without change",
        "Identical across all buildings so comparisons stay simple",
        "Ambitious but achievable, reflecting planned improvements",
      ],
      answer: 3,
      explanation:
        "A target should stretch the team but stay credible: usually a percentage reduction from baseline, adjusted for growth.",
    },
    {
      question: "Exception reporting in M&T means:",
      options: [
        "Excluding abnormal weeks from the published statistics",
        "Escalating every deviation directly to senior management",
        "Flagging consumption above expectation and investigating why",
        "Reporting only the meters that performed better than target",
      ],
      answer: 2,
      explanation:
        "Exception reporting flags anomalies: this week is 15% above baseline, so someone investigates while the trail is fresh.",
    },
    {
      question: "The best way to communicate energy data is:",
      options: [
        "Dashboards with trends, targets and actionable insights",
        "Monthly league tables naming the worst-performing sites",
        "A comprehensive annual report covering every meter in detail",
        "Raw half-hourly meter readings issued to every manager",
      ],
      answer: 0,
      explanation:
        "Visual dashboards with trends, targets, and flagged anomalies drive action far better than raw numbers or long reports.",
    },
  ],
  "energy-legislation-check": [
    {
      question: "ESOS applies to:",
      options: [
        "Industrial sites with combustion plant above 20 MW",
        "Large undertakings, broadly 250+ employees or high turnover",
        "Public-sector bodies such as councils and NHS trusts",
        "Every organisation with a UK electricity supply contract",
      ],
      answer: 1,
      explanation:
        "ESOS is for large undertakings. If you're covered, you must assess your energy at least every four years.",
    },
    {
      question: "What must ESOS audits cover?",
      options: [
        "At least 90% of total energy use across buildings, industry and transport",
        "Electricity consumption only, with gas and transport fuels reported on a voluntary basis",
        "Office buildings only, since transport is exempt",
        "Whichever sites the board nominates as most significant",
      ],
      answer: 0,
      explanation:
        "ESOS audits are comprehensive: buildings, industrial processes and transport, covering at least 90% of consumption.",
    },
    {
      question: "SECR requires organisations to report:",
      options: [
        "Their energy strategy to the regulator every six months",
        "Energy use and carbon emissions in their annual accounts",
        "Only if their emissions exceed a set carbon threshold",
        "Electricity consumption alone, with gas exempted",
      ],
      answer: 1,
      explanation:
        "SECR is mandatory disclosure for quoted and large companies, made in the directors' report within the annual accounts.",
    },
    {
      question: "The reporting deadline for SECR is:",
      options: [
        "The 31st of January every year for all companies",
        "Three months after each ESOS compliance date",
        "Set individually for each company by the Environment Agency's compliance team",
        "Aligned with filing the annual accounts for the financial year",
      ],
      answer: 3,
      explanation: "SECR reporting is part of the annual accounts, so it follows the company's statutory filing timetable.",
    },
  ],
  "costs-check": [
    {
      question: "The Climate Change Levy is:",
      options: [
        "A discount scheme for the largest industrial energy users",
        "A carbon border charge applied to imported energy only",
        "A voluntary levy that funds industrial decarbonisation grants",
        "A tax on business energy use designed to incentivise efficiency",
      ],
      answer: 3,
      explanation:
        "CCL is a tax on business energy; energy-intensive users can reduce it via a Climate Change Agreement by meeting targets.",
    },
    {
      question: "Which energy supply is outside the main CCL charge?",
      options: [
        "Electricity supplied to an office",
        "Natural gas supplied to a factory",
        "Supplies to domestic households",
        "LPG delivered to a rural site",
      ],
      answer: 2,
      explanation:
        "CCL applies to business energy; domestic supply and some low-use or charitable supplies are excluded.",
    },
    {
      question: "The Energy Company Obligation (ECO) requires:",
      options: [
        "Generators to source a share of output from renewables",
        "Businesses to cut consumption by a set percentage yearly",
        "Suppliers to fund efficiency measures for eligible households",
        "Homeowners to insulate before selling their properties",
      ],
      answer: 2,
      explanation:
        "ECO is a supplier obligation: they must fund insulation, heating and efficiency measures for eligible households.",
    },
  ],
  "policy-check": [
    {
      question: "The UK's carbon budgets set:",
      options: [
        "Legally binding five-year caps on national CO₂ emissions",
        "The traded price of carbon in the UK emissions market",
        "Voluntary reduction goals for large listed companies",
        "Annual departmental spending limits on climate policy",
      ],
      answer: 0,
      explanation:
        "Carbon budgets are legally binding five-year caps stepping down toward net zero by 2050.",
    },
    {
      question: "What does an Energy Performance Certificate (EPC) rate?",
      options: [
        "The renewable share of the electricity supplied to the building",
        "The efficiency of the heating plant alone, tested annually",
        "The building's modelled energy performance on a scale of A to G",
        "The measured energy consumption of the building's occupants",
      ],
      answer: 2,
      explanation:
        "EPCs rate buildings A to G on modelled performance. They're required for sales and lettings and underpin MEES.",
    },
    {
      question: "Minimum Energy Efficiency Standards (MEES) require:",
      options: [
        "Rented buildings to meet a minimum EPC rating to be let",
        "Landlords to publish tenants' energy consumption yearly",
        "All commercial buildings to reach net zero carbon by 2030",
        "New buildings to be built one EPC band above regulations",
      ],
      answer: 0,
      explanation:
        "MEES sets the lowest EPC band at which a property may legally be let, tightening over time for commercial buildings.",
    },
    {
      question: "The UK's path to net zero involves:",
      options: [
        "Offsetting most current emissions through international credits",
        "Electrified heat, decarbonised electricity, and efficiency everywhere",
        "An immediate prohibition on new fossil-fuelled equipment",
        "Replacing the gas grid wholesale with hydrogen by 2035",
      ],
      answer: 1,
      explanation:
        "Net zero combines clean electricity, heat pumps replacing boilers, deep efficiency, and hydrogen only in hard-to-electrify niches.",
    },
  ],
  "audit-planning-check": [
    {
      question: "The main purpose of an energy audit is to:",
      options: [
        "Identify and quantify savings opportunities with a case for each",
        "Benchmark the site against others in the same industry sector",
        "Produce an accurate record of the building's total consumption",
        "Verify the building complies with current building regulations",
      ],
      answer: 0,
      explanation:
        "An audit finds inefficiencies and quantifies the savings: it's the foundation for investment decisions.",
    },
    {
      question: "Which is an example of a walk-through audit?",
      options: [
        "A desktop review of two years of utility bills and tariffs",
        "Three months of sub-metering with regression analysis",
        "A quick visual site inspection to spot the obvious issues",
        "The audit stage of ISO 50001 certification by an external body",
      ],
      answer: 2,
      explanation:
        "A walk-through is quick and preliminary, identifying obvious issues. Detailed audits follow where the money justifies it.",
    },
    {
      question: "An investment-grade audit differs from a detailed audit in that it:",
      options: [
        "Focuses on operational measures rather than capital ones",
        "Uses rigour sufficient to underwrite large capital investment",
        "Skips the site visits and relies on design documentation",
        "Costs less because the scope is restricted to one system",
      ],
      answer: 1,
      explanation:
        "Investment-grade audits carry defensible measurement and stated confidence, enough for financing decisions on major projects.",
    },
  ],
  "on-site-check": [
    {
      question: "During a walk-through, what should you prioritise checking?",
      options: [
        "The plant room, since everything important is inside it",
        "Envelope, HVAC, controls, maintenance history and major loads",
        "The roof and glazing, where most heat loss always occurs",
        "The lighting layout, as lighting dominates most sites' bills",
      ],
      answer: 1,
      explanation:
        "A good walk-through covers all energy-using areas: envelope, heating and cooling, lighting, controls, and equipment condition.",
    },
    {
      question: "Why is measurement important in an audit, even if you have utility bills?",
      options: [
        "Sub-metering and logging reveal when and where energy really goes",
        "The regulator requires calibrated readings in every audit report",
        "Bills are frequently estimated, so they cannot be trusted at all",
        "Measurement lets you invoice departments for their exact usage",
      ],
      answer: 0,
      explanation:
        "Bills show monthly totals. Measurement reveals the patterns: when systems run, which zones consume, where losses occur.",
    },
    {
      question: "What information from stakeholder interviews is most valuable?",
      options: [
        "Complaints, past issues, maintenance history and future plans",
        "The exact budget available for the audit's recommendations",
        "Their view of which energy supplier offers the best rates",
        "A list of the equipment they believe should be replaced",
      ],
      answer: 0,
      explanation:
        "Stakeholders know what's broken, what was bodged, occupancy patterns and planned changes: all critical to an accurate audit.",
    },
  ],
  "analysis-check": [
    {
      question: "What does normalising audit data do?",
      options: [
        "Removes outlier readings that would distort the averages",
        "Scales the data to match the sector benchmark distribution",
        "Adjusts for weather and occupancy so comparisons are fair",
        "Converts every meter's readings into a single common unit",
      ],
      answer: 2,
      explanation:
        "Normalisation accounts for heating-season differences, occupancy changes and similar drivers, so the baseline is fair.",
    },
    {
      question: "When ranking audit opportunities, the most important metric is:",
      options: [
        "Total energy saved in kilowatt-hours over the asset life",
        "Ease of implementation with the site's existing contractors",
        "Visibility of the measure to occupants and senior managers",
        "Payback period: the cost divided by the annual savings",
      ],
      answer: 3,
      explanation:
        "Simple payback tells you how fast the investment recovers itself, and it is the ranking everyone understands.",
    },
    {
      question: "An audit report should include:",
      options: [
        "The recommendations alone, since any supporting detail only dilutes the core message",
        "The raw measurement data so readers can draw conclusions",
        "Technical appendices in place of an executive summary",
        "Summary, findings, and ranked opportunities with costs and savings",
      ],
      answer: 3,
      explanation:
        "A good report is executive-friendly (summary), technically sound (findings), and actionable (ranked, costed recommendations).",
    },
  ],
  "generation-check": [
    {
      question: "Latent heat in steam is important because:",
      options: [
        "It is the large energy released when steam condenses to water",
        "It is the energy that first brings the water up to the boil",
        "It sets the maximum temperature the steam can ever reach",
        "It only exists once steam has been superheated well past saturation",
      ],
      answer: 0,
      explanation:
        "Latent heat is ~2,250 kJ/kg at atmospheric pressure: the reason steam carries so much heat, released on condensing.",
    },
    {
      question: "Flash steam occurs when:",
      options: [
        "Saturated steam is heated further by the boiler's burner",
        "A steam trap opens too quickly under a high-pressure load",
        "Hot condensate drops in pressure and part of it re-evaporates",
        "Condensate cools quickly against a colder metal surface",
      ],
      answer: 2,
      explanation:
        "A pressure drop leaves hot condensate holding more heat than water can carry at the new pressure, so some flashes to steam.",
    },
    {
      question: "The economical thickness of pipe insulation is where:",
      options: [
        "The insulation fills all the space available around the pipe",
        "The combined cost of heat loss plus insulation is at a minimum",
        "The surface temperature first drops below the safe-touch limit",
        "The heat loss reaches exactly half of the bare-pipe figure",
      ],
      answer: 1,
      explanation:
        "More insulation keeps saving heat, but each layer saves less. The optimum is where total cost (energy + insulation) bottoms out.",
    },
  ],
  "traps-check": [
    {
      question: "A thermostatic trap works by:",
      options: [
        "Sensing temperature: cool condensate opens it, hot steam closes it",
        "Floating a sealed ball on the condensate to open the valve",
        "Spinning a small turbine that only water can drive",
        "Using an inverted bucket that sinks in water and rises in steam",
      ],
      answer: 0,
      explanation:
        "Thermostatic traps sense temperature. Cool condensate opens the valve; steam (or near-saturation condensate) closes it.",
    },
    {
      question: "A failed steam trap (stuck open) results in:",
      options: [
        "Water hammer developing in the condensate return line",
        "Condensate backing up until the heat exchanger waterlogs",
        "Live steam blowing through to waste with the condensate",
        "The steam main gradually losing all of its pressure",
      ],
      answer: 2,
      explanation:
        "A stuck-open trap passes live steam continuously into the condensate line: a large, silent, ongoing energy loss.",
    },
    {
      question: "Condensate return is valuable because:",
      options: [
        "It keeps the steam traps warm so they cycle less frequently",
        "Hot treated water is reused, and its flash steam can be captured",
        "It dilutes the boiler water and reduces the need for treatment",
        "It raises the boiler pressure without extra burner firing",
      ],
      answer: 1,
      explanation:
        "Returned condensate at 80–90 °C cuts the energy needed to make new steam versus heating cold make-up water from 10 °C.",
    },
  ],
  "steam-check": [
    {
      question: "How do you detect a failed trap in the field?",
      options: [
        "Compare the trap's size against the load it is draining",
        "Watch the boiler's gas meter for a step change in consumption",
        "Check the trap's age against the manufacturer's service life",
        "Test with temperature and ultrasound, or check condensate for steam",
      ],
      answer: 3,
      explanation:
        "Surveys combine temperature readings, ultrasonic listening and sight: a blowing trap sounds and reads differently from a working one.",
    },
    {
      question: "The main efficiency loss in a steam system is usually from:",
      options: [
        "The boiler shell radiating heat into the boiler house",
        "The condensate pump running continuously at full speed",
        "Failed traps, poor insulation, and unrecovered flash steam",
        "Friction losses in the steam mains at high velocity",
      ],
      answer: 2,
      explanation:
        "Trap failures and distribution losses are the classic big wins: often far larger than anything wrong with the boiler itself.",
    },
    {
      question: "Optimising operating pressure saves energy by:",
      options: [
        "Making the boiler fire harder but for correspondingly shorter periods across each day",
        "Allowing smaller traps to be fitted throughout the system",
        "Increasing the steam velocity so pipes can be downsized",
        "Cutting flash losses at pressure reduction and lowering flue losses",
      ],
      answer: 3,
      explanation:
        "Lower pressure means less flash steam at reductions, cooler pipe surfaces, and lower boiler losses: a standing saving.",
    },
  ],
  "payback-check": [
    {
      question: "Simple payback is useful because:",
      options: [
        "It is the appraisal method lenders require for energy projects",
        "It automatically accounts for inflation and future price rises",
        "It is the single most rigorous method available for comparing any two competing projects",
        "It is quick and intuitive, though blind to time value and project life",
      ],
      answer: 3,
      explanation:
        "Payback = cost ÷ annual saving. Fast to calculate, but it treats a pound saved in year one the same as year ten.",
    },
    {
      question: "Time value of money means:",
      options: [
        "A pound today is worth more than a pound tomorrow, since it can earn",
        "Cash held on deposit always loses value in real terms",
        "Inflation is the only reason future money is worth less",
        "Future cash flows are too uncertain to be included in any honest project appraisal",
      ],
      answer: 0,
      explanation:
        "At a 5% discount rate, £100 in one year is worth £95.24 today, because £95.24 invested at 5% grows to £100.",
    },
    {
      question: "NPV (Net Present Value) is:",
      options: [
        "The undiscounted total of every cash flow a project produces",
        "All future cash flows discounted to today, minus the initial cost",
        "The number of years until the project's cash turns positive",
        "The project's average annual profit divided by its capital cost",
      ],
      answer: 1,
      explanation:
        "If NPV > 0, the project earns more than your discount rate and creates value. NPV = 0 is the break-even point.",
    },
    {
      question: "IRR (Internal Rate of Return) is:",
      options: [
        "The discount rate at which the project's NPV equals zero",
        "The rate of return promised in the supplier's proposal",
        "The interest rate your bank charges to finance the project",
        "The organisation's weighted average cost of capital",
      ],
      answer: 0,
      explanation:
        "IRR is the project's built-in rate of return. If IRR beats the hurdle rate, accept the project.",
    },
  ],
  "lifecycle-check": [
    {
      question: "Total cost of ownership includes:",
      options: [
        "The energy costs across the life, since they dominate everything",
        "The purchase price plus delivery and installation only",
        "Whatever costs the finance team chooses to capitalise",
        "Capital, operating, maintenance and replacement, less residual value",
      ],
      answer: 3,
      explanation:
        "TCO counts every pound over the life. For energy-using plant, the energy term usually dwarfs the purchase price.",
    },
    {
      question: "A condensing boiler has higher capital cost but lower operating cost. Over 15 years:",
      options: [
        "The comparison depends only on which boiler lasts longer",
        "The two options cost the same once maintenance is included",
        "The conventional boiler wins, because its capital saving is banked up front with certainty",
        "The condensing boiler usually costs less overall through fuel savings",
      ],
      answer: 3,
      explanation:
        "The condensing boiler's efficiency gain, applied to fifteen years of fuel, normally repays its capital premium several times over.",
    },
    {
      question: "When comparing LED to halogen lighting, you should account for:",
      options: [
        "The energy use alone, because lamp costs are negligible",
        "The lamp prices, since the technologies use similar energy",
        "Lamp cost, energy, replacement labour, lifespan and frequency",
        "The light quality, which outweighs any cost difference",
      ],
      answer: 2,
      explanation:
        "LED costs more per lamp but lasts many times longer and uses a fraction of the energy: life-cycle costing captures all of it.",
    },
  ],
  "economic-check": [
    {
      question: "A portfolio approach to energy projects means:",
      options: [
        "Excluding any project whose payback exceeds three years",
        "Funding every identified project simultaneously in one programme",
        "Weighing risk, certainty, co-benefits and fit alongside the finances",
        "Ranking strictly by payback and funding from the top down",
      ],
      answer: 2,
      explanation:
        "A certain 3-year payback can beat a risky 2-year one, and strong co-benefits can justify a lower financial return.",
    },
    {
      question: "If you can borrow money at 3% interest but your discount rate is 5%, borrowing to fund a project with 4% IRR is:",
      options: [
        "Break-even, since the rates average out across the term",
        "Not worthwhile, because 4% is below your 5% hurdle rate",
        "Worthwhile only if the loan is repaid inside the payback period",
        "Worthwhile, because the project's return exceeds the loan rate",
      ],
      answer: 1,
      explanation:
        "The hurdle rate (5%) is your required return on capital. A 4% project fails it regardless of how cheap the loan is.",
    },
    {
      question: "Performance contracts and ESCO models appeal because:",
      options: [
        "They always deliver a project more cheaply than self-funding",
        "The provider funds the work and takes the savings-delivery risk",
        "The savings are unlimited because the contractor keeps improving",
        "They remove the need for measurement and verification entirely",
      ],
      answer: 1,
      explanation:
        "The ESCO funds the retrofit and is paid from verified savings, often guaranteed. You trade some upside for less risk and no capex.",
    },
  ],
  "motor-check": [
    {
      question: "Motor efficiency class IE3 vs IE2 means:",
      options: [
        "IE3 wastes noticeably less energy, which compounds over the life",
        "IE3 applies to inverter-driven motors and IE2 to direct-on-line",
        "IE3 motors cost less to buy because of higher production volumes",
        "The classes differ only in their frame size and mounting",
      ],
      answer: 0,
      explanation:
        "IE3 (premium) motors are a couple of percent more efficient than IE2. Over a motor's long life that saves real money.",
    },
    {
      question: "A 50 kW motor running at 25 kW load (half capacity) is inefficient because:",
      options: [
        "Oversized motors run at poor power factor and reduced efficiency",
        "The starting inrush current roughly doubles every time the connected load is halved",
        "Induction motors cannot physically run below rated load",
        "The cooling fan absorbs half the output at low loads",
      ],
      answer: 0,
      explanation:
        "Oversized motors draw excess reactive power and slide down the efficiency curve at part load. Matching size to load fixes both.",
    },
    {
      question: "Motor slip (the difference between synchronous and actual speed) causes:",
      options: [
        "The driven load to creep faster as the motor warms up",
        "The stator windings to overheat progressively at any sustained load above half rated",
        "Vibration that steadily wears the drive-end bearing",
        "Rotor losses as heat: more slip means lower motor efficiency",
      ],
      answer: 3,
      explanation:
        "Slip is what induces rotor current and torque, but it is also a loss: efficient motors run with small slip.",
    },
  ],
  "vfd-check": [
    {
      question: "The main benefit of a VFD on a pump or fan is:",
      options: [
        "It matches speed to demand instead of throttling at full speed",
        "It softens the starting current so fuses can be downsized",
        "It corrects the motor's power factor back towards unity",
        "It removes the need for routine bearing maintenance",
      ],
      answer: 0,
      explanation:
        "A pump at half speed uses about an eighth of the power (cube law). A valve or damper at half flow wastes most of it.",
    },
    {
      question: "VFD payback is typically shortest for:",
      options: [
        "Constant-load equipment that always needs its full rated output whenever it is running",
        "Standby plant that runs only during grid outages",
        "Small motors that start and stop many times per hour",
        "Large motors running long hours on genuinely variable loads",
      ],
      answer: 3,
      explanation:
        "VFD savings scale with power, running hours and load variability. Large, variable, continuous duties pay back fastest.",
    },
    {
      question: "Harmonic filtering on a VFD is important because:",
      options: [
        "It stops the drive nuisance-tripping whenever the incoming supply voltage briefly dips",
        "Drives inject harmonics that heat transformers and disturb equipment",
        "It raises the motor's efficiency by smoothing the torque",
        "It quietens the audible whine the motor makes at low speed",
      ],
      answer: 1,
      explanation:
        "A drive's rectifier draws distorted current. In bulk, harmonics heat transformers and can breach network limits, so filtering matters.",
    },
  ],
  "motors-electrical-check": [
    {
      question: "Poor power factor (say, 0.8 vs 0.95) costs money because:",
      options: [
        "The energy meter over-records consumption at low power factor",
        "Utilities charge for the extra apparent power and reactive current",
        "The motor's shaft speed falls in proportion to the power factor",
        "Low power factor shortens the winding insulation's life",
      ],
      answer: 1,
      explanation:
        "Many tariffs charge on kVA. Low PF means higher kVA (and current) for the same useful kW, so higher charges and losses.",
    },
    {
      question: "Demand charges on an electricity bill are based on:",
      options: [
        "The average power drawn during working hours only",
        "The sum of the nameplate ratings of connected equipment",
        "The highest power draw in any half-hour metering period",
        "The total energy consumed across the billing month",
      ],
      answer: 2,
      explanation:
        "A single half-hour spike can set the demand charge for the whole month. Flattening peaks saves real money.",
    },
    {
      question: "Soft starters reduce demand peaks by:",
      options: [
        "Delaying the start until the site's demand has fallen",
        "Ramping the voltage so the motor avoids its hard-start inrush",
        "Holding the motor at reduced speed throughout its running",
        "Switching in capacitors during the acceleration period",
      ],
      answer: 1,
      explanation:
        "Direct-on-line starting draws 6–8× full-load current. A soft starter ramps up gradually, easing both the network and the machine.",
    },
  ],
  "whr-fundamentals-check": [
    {
      question: "The most valuable waste heat to recover is usually from:",
      options: [
        "A source of adequate grade sitting near a simultaneous heat demand",
        "The hottest source on site, whatever its location or timing",
        "The largest source on site, since quantity beats temperature",
        "Sources below 50 °C, because they are the most plentiful",
      ],
      answer: 0,
      explanation:
        "Temperature, quantity, and a time-coincident nearby sink must all line up. A matched medium-grade source beats an unmatched hot one.",
    },
    {
      question: "A waste heat recovery project payback depends on:",
      options: [
        "The carbon intensity of the fuel being displaced",
        "Source availability, nearby demand, equipment cost and energy prices",
        "The temperature of the waste stream, which alone determines whether recovery can ever pay",
        "The efficiency rating of the heat exchanger selected",
      ],
      answer: 1,
      explanation:
        "If the source runs 24/7 but the sink only four hours a day, utilisation is poor and the payback stretches badly.",
    },
    {
      question: "Heat recovery effectiveness describes:",
      options: [
        "The proportion of the site's heat demand met by recovery",
        "The fraction of the available temperature difference recovered",
        "The ratio of energy saved to the capital cost of the project",
        "The share of the year the recovery equipment is running",
      ],
      answer: 1,
      explanation:
        "A 50 °C source and 20 °C cold stream offer a 30 °C potential; 85% effectiveness lifts the cold stream by about 25.5 °C.",
    },
  ],
  "whr-technologies-check": [
    {
      question: "Plate heat exchangers are preferred for waste heat recovery because:",
      options: [
        "They transfer heat between air streams without cross-leakage",
        "They tolerate higher pressures than any shell-and-tube design",
        "They pack high effectiveness into a compact, cleanable unit",
        "They are immune to fouling and never need maintenance",
      ],
      answer: 2,
      explanation:
        "Plate exchangers offer a large surface area in a small volume: the default for liquid-to-liquid recovery duties.",
    },
    {
      question: "Enthalpy recovery ventilation (ERV) recovers:",
      options: [
        "Sensible heat only, leaving the moisture in the exhaust",
        "Latent heat only, by exchanging moisture between the streams",
        "Heat from the extract fan motors rather than the air",
        "Both sensible and latent heat from the exhaust air",
      ],
      answer: 3,
      explanation:
        "ERV recovers temperature and humidity from exhaust air, cutting both the heating and the dehumidification loads.",
    },
    {
      question: "Flash steam recovery from condensate is valuable because:",
      options: [
        "It returns effectively distilled water that needs no further chemical treatment at all",
        "It raises the condensate pressure back to the main's level",
        "It prevents water hammer forming in the return lines",
        "The recovered low-pressure steam can serve lower-temperature loads",
      ],
      answer: 3,
      explanation:
        "Hot condensate flashing at a pressure drop yields perfectly good low-pressure steam, typically piped to feedwater heating.",
    },
  ],
  "whr-optimization-check": [
    {
      question: "Recovering heat from a boiler flue (condensing retrofit) saves energy by:",
      options: [
        "Raising the flame temperature so combustion completes faster",
        "Reducing the draught losses through the boiler at standby",
        "Capturing flue heat, including latent heat, to preheat the water",
        "Allowing the burner to run with much less excess air",
      ],
      answer: 2,
      explanation:
        "Cooling the flue recovers sensible heat, and condensing its moisture releases latent heat too: several percent of fuel input.",
    },
    {
      question: "A chiller condenser recovery system uses recovered heat for:",
      options: [
        "Hot water or heating loads that coincide with the cooling demand",
        "Regenerating the desiccant dehumidification wheel inside the air handling units",
        "Boosting the chiller's own evaporator during light loads",
        "Keeping the cooling tower basin from freezing in winter",
      ],
      answer: 0,
      explanation:
        "When a site cools and heats simultaneously, condenser heat displaces boiler fuel: the classic simultaneous-demand win.",
    },
    {
      question: "Industrial process heat recovery payback is typically longest when:",
      options: [
        "The process runs continuously through all three shifts",
        "The process is intermittent or seasonal, so utilisation is low",
        "The recovered heat is used within the same process line",
        "The waste stream is hot enough to raise low-pressure steam",
      ],
      answer: 1,
      explanation:
        "Recovery kit sized for a source that rarely runs sits idle. Continuous processes with coincident demand pay back fastest.",
    },
  ],
  "ctrl-fundamentals-check": [
    {
      question: "A feedback control loop requires:",
      options: [
        "Two sensors so every reading can be cross-checked",
        "A setpoint, a sensor, a controller and an actuator",
        "An actuator wired directly to a manual override switch",
        "A setpoint and a timer to switch the plant at fixed intervals",
      ],
      answer: 1,
      explanation:
        "The loop measures the actual value, compares it to the setpoint, and drives the actuator until the error is gone.",
    },
    {
      question: "PID control is more sophisticated than on-off because:",
      options: [
        "It can hold several unrelated setpoints from one output",
        "It needs no tuning once installed on any normal system",
        "It modulates smoothly using error, accumulated error and its rate",
        "It can switch its output far faster than any relay-based on-off controller could",
      ],
      answer: 2,
      explanation:
        "On-off bangs between full on and full off. PID modulates to the required output, killing offset and minimising overshoot.",
    },
    {
      question: "Cascade control is useful when:",
      options: [
        "A single loop keeps hunting no matter how it is tuned",
        "The plant must keep running after the BMS goes offline",
        "Two separate zones are forced to share a single temperature sensor between them",
        "A fast inner loop can steady a variable a slow outer loop depends on",
      ],
      answer: 3,
      explanation:
        "Example: the outer loop sets a flow-temperature target; a fast inner loop works the valve to hold it, absorbing disturbances.",
    },
  ],
  "ctrl-sensors-check": [
    {
      question: "An RTD (resistance temperature detector) is preferred in many HVAC applications because:",
      options: [
        "It is accurate, near-linear, stable and tolerant of vibration",
        "It is the cheapest sensor type available in bulk",
        "It never drifts in service, so calibration becomes a one-off commissioning exercise",
        "It works at flue-gas temperatures where others fail",
      ],
      answer: 0,
      explanation:
        "RTDs (Pt100, Pt1000) are the building-controls standard; thermocouples suit high temperatures, thermistors suit low cost.",
    },
    {
      question: "A humidity sensor (RH) placed near a window in winter is problematic because:",
      options: [
        "Winter air is too dry for capacitive sensors to register",
        "Condensation forming on the cold glass permanently recalibrates the sensing element",
        "The cold surface skews local RH, so the reading misrepresents the room",
        "Sunlight through the glass bleaches the sensing element",
      ],
      answer: 2,
      explanation:
        "Placement drives the reading: an RH sensor belongs away from thermal extremes, draughts and condensation zones.",
    },
    {
      question: "Actuator authority (valve) describes:",
      options: [
        "The torque rating of the actuator motor turning the valve",
        "The controller's priority when two loops share the valve",
        "The valve's share of the circuit pressure drop when fully open",
        "The stroke time from fully closed to fully open",
      ],
      answer: 2,
      explanation:
        "Low authority (say 0.1) means moving the valve barely changes the flow, so control hunts. Aim for roughly 0.3–0.5.",
    },
  ],
  "ctrl-bms-check": [
    {
      question: "BACnet is important in BMS because:",
      options: [
        "It is an open, vendor-neutral protocol for device communication",
        "It doubles the speed of legacy Modbus installations",
        "It encrypts every controller's traffic end-to-end by default",
        "It is required by UK building regulations on new projects",
      ],
      answer: 0,
      explanation:
        "BACnet lets boilers, chillers, VAV boxes and lighting from different makers talk to one BMS without proprietary bridges.",
    },
    {
      question: "Setpoint reset (or reset) in a BMS adjusts setpoint based on:",
      options: [
        "The average of the last twenty-four hours of readings",
        "An external driver such as outdoor temperature or demand",
        "A fixed weekly timetable configured at commissioning",
        "Manual entries made by the operators at shift change",
      ],
      answer: 1,
      explanation:
        "Example: heating flow temperature rises on cold days and falls on mild ones, matching output to load automatically.",
    },
    {
      question: "A BMS alarming strategy should:",
      options: [
        "Log every deviation and alert operators to each one equally",
        "Route all alarms to a printer for a permanent paper record",
        "Suppress all alarms outside normal working hours to protect the on-call engineer's rest",
        "Separate critical faults from noise, alerting only what needs action",
      ],
      answer: 3,
      explanation:
        "Too many alarms create alarm fatigue and real problems get ignored. Thresholds should be meaningful and prioritised.",
    },
  ],
  "commx-fundamentals-check": [
    {
      question: "Commissioning differs from testing because:",
      options: [
        "Commissioning is performed only after the defects period ends",
        "Testing needs specialists while commissioning does not",
        "Commissioning verifies design intent is delivered, not just operation",
        "Testing happens physically on site while commissioning is essentially a desk exercise",
      ],
      answer: 2,
      explanation:
        "Testing asks whether the pump runs. Commissioning asks whether it delivers the design flow at the design conditions.",
    },
    {
      question: "A commissioning plan should cover:",
      options: [
        "Scope, procedures, acceptance criteria, roles, schedule and records",
        "The witnessing arrangements for the client's insurers",
        "The HVAC systems alone, since all other building services arrive fully factory-tested",
        "Only plant above a defined capacity threshold",
      ],
      answer: 0,
      explanation:
        "Good commissioning defines what will be tested, how, by whom, to what pass mark, and how it will be documented.",
    },
    {
      question: "Retro-commissioning existing buildings is important because:",
      options: [
        "It recovers the 10–30% of energy lost to drift and poor sequences",
        "Buildings commissioned at handover stay in tune indefinitely",
        "It is a statutory requirement for buildings over 1,000 m²",
        "It replaces the need for planned maintenance programmes",
      ],
      answer: 0,
      explanation:
        "Controls drift, sensors drift, and sequences get overridden. Retro-commissioning finds and fixes the accumulated waste.",
    },
  ],
  "commx-onsite-check": [
    {
      question: "Flow balancing in HVAC commissioning ensures:",
      options: [
        "The pumps and fans are running at their best-efficiency points",
        "Each zone receives its design flow rather than starving or hogging",
        "The system's pressure relief valves lift at the right settings",
        "The strainers and filters are clean before handover",
      ],
      answer: 1,
      explanation:
        "Without balancing, low-resistance zones take more than their share and the far zones starve, driving complaints and waste.",
    },
    {
      question: "Sensor calibration during commissioning is critical because:",
      options: [
        "Wrong readings make every downstream control decision wrong",
        "Regulations require calibration certificates at handover",
        "New sensors drift fastest during their first month",
        "Uncalibrated sensors invalidate the equipment warranties",
      ],
      answer: 0,
      explanation:
        "A sensor reading 2 °C high makes the system control 2 °C wrong, silently and permanently, until someone checks it.",
    },
    {
      question: "Control sequence testing verifies that:",
      options: [
        "The controllers fail safe when their network drops out",
        "The BMS graphics match the plant actually installed",
        "The programmed logic drives the plant correctly in every mode",
        "Each sensor is wired to the terminal shown on the drawings",
      ],
      answer: 2,
      explanation:
        "Sequences are forced through every mode to prove the response, catching classics like heating and cooling running together.",
    },
  ],
  "commx-persistence-check": [
    {
      question: "Control drift post-commissioning typically causes:",
      options: [
        "Sudden failures that the alarm system catches immediately",
        "No measurable change if the plant is maintained to schedule",
        "Improved efficiency as the controls learn the building",
        "Gradual performance loss from sensor drift and setpoint creep",
      ],
      answer: 3,
      explanation:
        "Without re-commissioning, a 5–15% drift within a couple of years is common: the system quietly walks away from design.",
    },
    {
      question: "Continuous commissioning means:",
      options: [
        "Keeping the commissioning contractor on a retainer",
        "Ongoing monitoring and re-tuning so performance persists",
        "Leaving the BMS in commissioning mode permanently",
        "Repeating the full handover commissioning every five years",
      ],
      answer: 1,
      explanation:
        "Continuous commissioning is data-driven and proactive: trend analysis flags drift before occupants ever complain.",
    },
    {
      question: "Handover documentation should include:",
      options: [
        "Warranty certificates, since everything else is online",
        "The commissioning engineer's complete site diary, marked-up drawings and photographs",
        "As-builts, manuals, sequences, maintenance plan and training records",
        "The equipment schedule and the final account summary",
      ],
      answer: 2,
      explanation:
        "Complete handover documentation lets operators run and maintain the systems without the commissioning team on call.",
    },
  ],
  "refr-fundamentals-check": [
    {
      question: "In a vapour-compression refrigeration cycle, the compressor:",
      options: [
        "Meters the refrigerant flow into the evaporator coil",
        "Raises the gas's pressure and temperature so it can reject heat",
        "Cools the refrigerant before it enters the expansion valve",
        "Pumps liquid refrigerant around the circuit at constant pressure",
      ],
      answer: 1,
      explanation:
        "The compressor lifts pressure so the refrigerant's saturation temperature rises above ambient, letting the condenser reject heat.",
    },
    {
      question: "Superheat in the evaporator ensures:",
      options: [
        "The refrigerant leaves the evaporator as cold as possible",
        "The expansion valve always receives solid liquid refrigerant without any vapour bubbles",
        "All liquid has boiled off, so none can reach and damage the compressor",
        "The evaporator surface stays free of frost in heat pump duty",
      ],
      answer: 2,
      explanation:
        "Liquid slugging destroys compressors. A few degrees of superheat proves the evaporator finished its job safely.",
    },
    {
      question: "A P-h diagram is useful because it:",
      options: [
        "Shows the exact physical layout of the refrigeration pipework",
        "Predicts the remaining service life of the compressor",
        "Converts gauge pressures into saturation temperatures",
        "Maps the whole cycle so duties and COP can be read as distances",
      ],
      answer: 3,
      explanation:
        "The cycle draws as a loop on the pressure-enthalpy chart: cooling effect, compressor work and rejection are horizontal distances.",
    },
  ],
  "heatpump-check": [
    {
      question: "In heat pump heating mode, the evaporator is:",
      options: [
        "Inside the building, absorbing heat from the rooms",
        "Bypassed entirely, since heating needs no evaporation",
        "Inside the hot water cylinder, warming the coil",
        "Outside, absorbing heat from the air, ground or water",
      ],
      answer: 3,
      explanation:
        "A heat pump reverses the layout: the outdoor coil evaporates (collecting heat), the indoor coil condenses (delivering it).",
    },
    {
      question: "COP (coefficient of performance) of 3 means:",
      options: [
        "The heat pump consumes 3 kW of electricity at full output",
        "The machine is 300% efficient, which breaks the first law",
        "Each kilowatt of electricity delivers three kilowatts of heat",
        "Three units of heat are lost for every unit delivered",
      ],
      answer: 2,
      explanation:
        "COP = heat delivered ÷ work input. The extra two-thirds is environmental heat moved indoors, not energy created.",
    },
    {
      question: "Heat pump efficiency drops significantly when:",
      options: [
        "Outdoor temperatures are mild and demand is moderate",
        "The temperature lift is large, such as very cold weather",
        "The building's heat emitters run at low flow temperatures",
        "The unit runs steadily for long periods without stopping",
      ],
      answer: 1,
      explanation:
        "COP falls as the lift grows: colder source or hotter delivery. At -15 °C outside, COP may drop to ~2 versus ~3.5 at 5 °C.",
    },
  ],
  "refr-systems-check": [
    {
      question: "A split AC unit (mini-split) has indoor and outdoor units connected by:",
      options: [
        "Flexible ductwork carrying the conditioned air indoors",
        "Refrigerant lines plus power and a condensate drain",
        "A power cable, with the refrigerant sealed in each unit",
        "An insulated water loop between two heat exchangers",
      ],
      answer: 1,
      explanation:
        "The refrigerant piping is the critical link: poor installation or wrong charge quietly ruins the unit's efficiency.",
    },
    {
      question: "A ground-source heat pump (GSHP) is more efficient than air-source because:",
      options: [
        "GSHP compressors run at half the speed of air-source ones",
        "Soil conducts heat into the loop faster than air ever can",
        "The ground's stable temperature means a smaller, steadier lift",
        "Ground loops need no defrost, which is the main loss in air units",
      ],
      answer: 2,
      explanation:
        "The ground sits at a stable 8–12 °C year-round, so the lift is smaller and steadier than against winter air: higher SCOP.",
    },
    {
      question: "A water-cooled chiller uses a cooling tower to:",
      options: [
        "Strip dissolved oxygen from the condenser water loop",
        "Store chilled water for the following day's peak load",
        "Reject condenser heat evaporatively, toward the wet-bulb temperature",
        "Pre-cool the ambient air entering the air handling units before it reaches the coils",
      ],
      answer: 2,
      explanation:
        "Evaporative rejection cools condenser water below what air-cooling achieves, cutting condensing temperature and lifting COP.",
    },
  ],
  "refr-optimization-check": [
    {
      question: "At part-load (e.g., 50% cooling demand), a fixed-displacement compressor:",
      options: [
        "Cycles on and off, wasting energy against steadier control options",
        "Trips on low pressure until the load recovers",
        "Slows its motor down automatically so its output tracks the reduced cooling demand exactly",
        "Runs continuously at half of its rated input power",
      ],
      answer: 0,
      explanation:
        "On-off cycling wastes energy and wears the machine. Staged or variable-speed capacity control handles part load far better.",
    },
    {
      question: "Superheat optimization means:",
      options: [
        "Matching the superheat to the condenser's subcooling figure",
        "Raising the suction superheat as high as the compressor allows",
        "Holding superheat near 5–10 °C: enough for safety, no more",
        "Eliminating superheat entirely to maximise the cooling effect",
      ],
      answer: 2,
      explanation:
        "Too little superheat risks liquid at the compressor; too much wastes evaporator surface on feeble vapour heating.",
    },
    {
      question: "Refrigerant leaks in a system cause:",
      options: [
        "No performance change until the charge is nearly gone",
        "Frost forming on the condenser rather than the evaporator",
        "Higher efficiency, since less refrigerant means less pumping",
        "Falling capacity and efficiency, and eventual plant damage",
      ],
      answer: 3,
      explanation:
        "Undercharge shows as high superheat and lost capacity; left alone it overheats and eventually destroys the compressor.",
    },
  ],
  "ca-fundamentals-check": [
    {
      question: "Compressed air is expensive because:",
      options: [
        "The air must be bought from the network like gas or water",
        "Compressed air cannot usefully be stored on site, so the compressors can never be stopped",
        "Compressors are the most maintenance-hungry plant on site",
        "Only a small fraction of the compressor's electricity reaches the tool",
      ],
      answer: 3,
      explanation:
        "Compressing air to 7 bar turns most of the input electricity into heat; typically only 10–15% arrives at the tool as useful energy.",
    },
    {
      question: "A reciprocating compressor is most efficient at:",
      options: [
        "Rated pressure and capacity, running at full load",
        "Start-up, before the machine reaches temperature",
        "Any operating point, since efficiency is fixed by design",
        "Very light loads, where its cylinders barely have to work",
      ],
      answer: 0,
      explanation:
        "Reciprocating machines are most efficient at rated duty. Screw compressors hold their efficiency better at part load.",
    },
    {
      question: "Reducing system pressure from 8 bar to 6 bar saves energy because:",
      options: [
        "The compressor does less work per unit of air, and leaks flow slower",
        "The receiver vessel stores a larger volume of usable air when held at the lower pressure",
        "The dryers and filters no longer need to run continuously",
        "The motors can be rewired for the lower supply voltage",
      ],
      answer: 0,
      explanation:
        "Each bar of generation pressure costs roughly 7% of compressor energy, and every leak and open blow flows faster at higher pressure.",
    },
  ],
  "ca-design-check": [
    {
      question: "The main cause of energy waste in compressed air systems is:",
      options: [
        "Undersized distribution pipework raising the pressure drop",
        "Oil carryover coating the inside of the air mains",
        "Leaks, which commonly lose 20–30% of everything generated",
        "Compressors more than ten years past their design life",
      ],
      answer: 2,
      explanation:
        "Leaks are the silent loss: a 3 mm hole at 7 bar wastes thousands of pounds a year, and unmanaged systems accumulate dozens.",
    },
    {
      question: "A refrigerated dryer removes moisture and:",
      options: [
        "Achieves lower dew points than any desiccant alternative",
        "Suits general industrial use at around a 3 °C dew point",
        "Needs replacement desiccant cartridges twice a year",
        "Consumes a fifth of the air it treats as purge losses",
      ],
      answer: 1,
      explanation:
        "Refrigerated dryers reach ~3 °C dew point cheaply. Desiccant dryers go to -40 °C but cost far more energy; dry only as deep as needed.",
    },
    {
      question: "Variable-displacement compressor benefits:",
      options: [
        "Higher maximum delivery pressure from the same motor",
        "Elimination of the need for a receiver and buffer volume",
        "Better part-load efficiency, avoiding load-unload idle losses",
        "Lower purchase price than an equivalent fixed-speed machine",
      ],
      answer: 2,
      explanation:
        "Matching output to demand avoids the unloaded running that wastes 25–35% of full power while making no air at all.",
    },
  ],
  "ca-maintenance-check": [
    {
      question: "Waste heat from a compressor (discharge at 80-100°C) can be recovered for:",
      options: [
        "Re-cooling the compressor's own intake air in summer",
        "Space heating or hot water, since most input power becomes heat",
        "Regenerating the refrigerated dryer's cooling circuit",
        "Raising low-pressure steam to supply the site's smaller process heating loads",
      ],
      answer: 1,
      explanation:
        "Around 70–90% of a compressor's input power is recoverable as heat: ducted warm air or hot water via the oil circuit.",
    },
    {
      question: "An ultrasonic leak detector helps because:",
      options: [
        "It hears the ultrasonic hiss of leaks even in a noisy plant",
        "It seals small leaks automatically with an aerosol resin",
        "It maps the pipework so leak-prone joints can be predicted",
        "It measures each leak's flow rate directly in litres per second",
      ],
      answer: 0,
      explanation:
        "Escaping air produces ultrasound around 40 kHz. A detector finds leaks fast while production runs, paying back in weeks.",
    },
    {
      question: "Annual maintenance on a compressed air system includes:",
      options: [
        "A pressure-vessel recertification and little besides",
        "Re-piping the distribution loop to remove dead legs",
        "Filters, oil and separator service, drain checks and a leak survey",
        "A complete strip-down and rebuild of each compressor, with new bearings and seals throughout",
      ],
      answer: 2,
      explanation:
        "Routine service holds efficiency: blocked filters, saturated separators and stuck drains each quietly tax the system.",
    },
  ],
  "lighting-fundamentals-check": [
    {
      question: "Lux is a measure of:",
      options: [
        "The colour rendering quality of the light source, rated on a scale of zero to one hundred",
        "Illuminance: the light landing on each square metre of surface",
        "The total light output a lamp emits in all directions",
        "The electrical power a luminaire draws from the circuit",
      ],
      answer: 1,
      explanation:
        "Lux = lumens per square metre. An office task area typically needs 300–500 lux; a corridor far less.",
    },
    {
      question: "LED efficacy (lumens per watt) is typically:",
      options: [
        "400–500 lm/W, close to the theoretical maximum",
        "15–25 lm/W, similar to the halogen lamps they replace",
        "Below fluorescent, which is why quality matters",
        "100–180 lm/W, several times better than fluorescent",
      ],
      answer: 3,
      explanation:
        "Modern LED delivers 100–180 lm/W against 10–15 for incandescent and 50–100 for fluorescent: the basis of the retrofit case.",
    },
    {
      question: "Colour temperature in Kelvin (K) describes:",
      options: [
        "The junction temperature the LED chip runs at in service",
        "The warmth or coolness of the light's appearance",
        "The maximum ambient temperature the lamp tolerates",
        "How long the lamp takes to reach full output from cold",
      ],
      answer: 1,
      explanation:
        "2,700–3,000 K reads warm like incandescent; 4,000 K is neutral office white; 5,000 K+ is cool and industrial.",
    },
  ],
  "lighting-controls-check": [
    {
      question: "An occupancy sensor saves energy by:",
      options: [
        "Switching lights off after a delay when nobody is detected",
        "Reducing the supply voltage to the whole lighting circuit",
        "Dimming the lamps smoothly as daylight becomes available",
        "Alternating which luminaires run to share the burning hours",
      ],
      answer: 0,
      explanation:
        "Occupancy control pays best in intermittently used spaces (stores, toilets, corridors), saving 30–60% of their lighting energy.",
    },
    {
      question: "Daylight harvesting uses:",
      options: [
        "Roof-mounted collectors that pipe sunlight indoors through ducts",
        "A photosensor to dim electric lighting when daylight suffices",
        "Reflective ceiling finishes to spread the available light",
        "Automatic blinds that track the sun through the day",
      ],
      answer: 1,
      explanation:
        "A photosensor holds the task illuminance constant, dimming the electric light as daylight contributes: 30–60% in perimeter zones.",
    },
    {
      question: "Glare from daylighting is best mitigated by:",
      options: [
        "Raising the electric lighting level high enough to balance out the window contrast",
        "Shading such as blinds and overhangs, with diffusion where needed",
        "Repositioning every workstation to face the windows",
        "Tinting the glazing dark enough to remove direct sun",
      ],
      answer: 1,
      explanation:
        "Shading devices control glare at source while keeping the daylight useful; heavy tints sacrifice daylight all year round.",
    },
  ],
  "lighting-retrofit-check": [
    {
      question: "LED retrofit payback from energy savings alone is typically:",
      options: [
        "Beyond the product's life unless electricity prices double",
        "Seven to ten years, so the case rests on maintenance savings",
        "Under six months in almost any building, whatever the hours",
        "One to three years for typical commercial operating hours",
      ],
      answer: 3,
      explanation:
        "LED draws 50–80% less than what it replaces and lasts several times longer; high-hours spaces pay back fastest.",
    },
    {
      question: "Over-illumination (providing more light than needed) wastes energy by:",
      options: [
        "Shortening lamp life so replacements come around sooner",
        "Drawing excess power and adding to the cooling load as heat",
        "Confusing the daylight sensors into dimming too early",
        "Causing glare that makes occupants switch on task lights",
      ],
      answer: 1,
      explanation:
        "Lighting to 800 lux where 500 is specified wastes the difference as electricity and again as unwanted heat.",
    },
    {
      question: "A lux meter is useful for:",
      options: [
        "Measuring the electrical load of each lighting circuit",
        "Detecting flicker invisible to the naked eye",
        "Checking the colour rendering quality of newly installed luminaires against specification",
        "Verifying levels meet the task standard and finding over-lit areas",
      ],
      answer: 3,
      explanation:
        "A lux meter checks the working plane against the design target, revealing both over-lit waste and under-lit risk.",
    },
  ],
  "tes-fundamentals-check": [
    {
      question: "Sensible thermal storage stores heat by:",
      options: [
        "Driving a reversible chemical reaction in the storage medium",
        "Melting and freezing a material at its transition point",
        "Compressing a gas so it heats and holds the energy",
        "Raising the temperature of a medium such as water or concrete",
      ],
      answer: 3,
      explanation:
        "Sensible storage: heating 1,000 litres of water through 40 °C banks about 46 kWh. Latent storage melts a material instead.",
    },
    {
      question: "Load shifting from off-peak to peak works because:",
      options: [
        "Shifting reduces the site's total energy consumption",
        "The plant runs more efficiently at night in every season",
        "Off-peak carbon intensity is always lower than peak",
        "Cheap off-peak energy is stored and used when prices peak",
      ],
      answer: 3,
      explanation:
        "The saving is the price spread times the energy shifted, less storage losses. A flat tariff makes storage pointless.",
    },
    {
      question: "Seasonal storage (e.g., summer heat for winter use) is challenging because:",
      options: [
        "No material can hold heat for longer than a few weeks",
        "Losses over months demand huge volumes, so only large schemes work",
        "Regulations prevent storing heat in the ground long-term",
        "Summer heat is far too low-grade to be worth collecting and storing in the first place",
      ],
      answer: 1,
      explanation:
        "Bigger stores lose proportionally less (volume beats surface area), so seasonal storage is inherently district-scale.",
    },
  ],
  "tes-technologies-check": [
    {
      question: "Phase-change materials (PCM) are valuable for storage because:",
      options: [
        "They work at any temperature the application demands",
        "They charge and discharge faster than water can",
        "They store far more energy per litre across a narrow band",
        "They cost less per kilowatt-hour stored than a water tank",
      ],
      answer: 2,
      explanation:
        "Latent heat packs several times water's density into the same volume, at the price of cost and slower heat transfer.",
    },
    {
      question: "Ice-on-coil storage works by:",
      options: [
        "Freezing water on cheap overnight power, melting it for day cooling",
        "Letting night air freeze an open storage pond naturally",
        "Importing ice made off-site during the winter months",
        "Chilling a glycol solution below zero overnight and storing it in insulated buffer tanks",
      ],
      answer: 0,
      explanation:
        "Melting ice absorbs 334 kJ/kg, so a compact tank shifts a large cooling load from expensive afternoons to cheap nights.",
    },
    {
      question: "Ground thermal storage (borehole seasonal store) is most viable when:",
      options: [
        "Cheap gas is available to top the store up in cold snaps",
        "A single dwelling wants independence from winter fuel prices",
        "The site's cooling demand vastly exceeds its heating demand",
        "Scale, long life, suitable ground and balanced loads all line up",
      ],
      answer: 3,
      explanation:
        "Payback is long, so it suits district schemes and campuses with balanced demands, built for decades of service.",
    },
  ],
  "tes-applications-check": [
    {
      question: "DHW storage tanks reduce boiler cycling by:",
      options: [
        "Spreading the draw-off across several smaller cylinders",
        "Keeping the boiler's return water hot between firings",
        "Raising the stored water above the delivery temperature",
        "Buffering demand so the boiler runs longer, steadier burns",
      ],
      answer: 3,
      explanation:
        "The tank absorbs spiky draw-off, so the boiler fires long and steady instead of short-cycling inefficiently.",
    },
    {
      question: "Night cooling (storing coolth for day use) works best when:",
      options: [
        "Humidity is high enough to help the fabric hold the cold",
        "The chiller plant is oversized for the building's peak",
        "Thermal mass, cool nights and a predictable day load coincide",
        "The building is lightweight with large glazed elevations",
      ],
      answer: 2,
      explanation:
        "Heavy fabric charged with cool night air rides the building through the next day's heat: free cooling from mass and timing.",
    },
    {
      question: "Economic payback for thermal storage depends on:",
      options: [
        "The tariff spread, storage cost, losses and system lifetime",
        "The energy prices alone, since equipment costs are similar",
        "The season in which the store is first commissioned",
        "The building's age and its construction type",
      ],
      answer: 0,
      explanation:
        "A wide peak/off-peak spread carries the case; losses and capital erode it. Model all of them over the life.",
    },
  ],
  "re-pv-check": [
    {
      question: "Solar PV efficiency (% of sunlight converted to electricity) is typically:",
      options: [
        "18–23% for modern silicon panels on the market today",
        "40–50% for anything sold with a 25-year warranty",
        "5–8% for the panels installed on most commercial roofs",
        "Above 60% when panels are mounted on solar trackers",
      ],
      answer: 0,
      explanation:
        "Modern silicon modules run 18–23%. The single-junction theoretical limit is about 33%; tandem cells push past it.",
    },
    {
      question: "Annual PV yield (kWh per kWp installed) in the UK is typically:",
      options: [
        "1,400–1,800 kWh/kWp on any reasonably unshaded, southern-facing roof in the UK",
        "300–500 kWh/kWp even on well-oriented systems",
        "2,000+ kWh/kWp where bifacial panels are used",
        "800–1,000 kWh/kWp depending on location and orientation",
      ],
      answer: 3,
      explanation:
        "A well-oriented UK system yields roughly 800–1,000 kWh per kWp per year; sunnier climates reach 1,400–1,800.",
    },
    {
      question: "A grid-tied PV system with batteries provides resilience by:",
      options: [
        "Doubling the array's output during the evening peak",
        "Powering essential loads from storage when the grid fails",
        "Removing the need for anti-islanding protection",
        "Letting the panels keep exporting during a network outage",
      ],
      answer: 1,
      explanation:
        "Plain grid-tied PV shuts down in an outage for safety. A battery-hybrid with islanding keeps critical loads alive.",
    },
  ],
  "re-thermal-wind-check": [
    {
      question: "Solar thermal (hot water) efficiency is typically:",
      options: [
        "50–70%, since making heat from sunlight is more direct than power",
        "10–20%, roughly the same as photovoltaic panels",
        "Above 90% for evacuated-tube collectors operating in clear summer conditions",
        "Under 5%, which is why the technology is declining",
      ],
      answer: 0,
      explanation:
        "Collectors convert 50–70% of incident solar energy to heat: far higher than PV's 18–23%, but heat is all they make.",
    },
    {
      question: "Small wind turbines in urban areas often disappoint because:",
      options: [
        "Planning rules cap their rotor diameter below the useful size",
        "Urban wind is slow and turbulent, and the cube law punishes that",
        "Grid connection fees exceed the value of the generation",
        "Bird-strike mitigation forces them to brake in daytime",
      ],
      answer: 1,
      explanation:
        "Power scales with wind speed cubed. Low, turbulent urban wind gives a fraction of rated output; open rural masts fare far better.",
    },
    {
      question: "A heat pump with COP 3 using renewable electricity is more efficient than:",
      options: [
        "A ground-source heat pump running at a COP of four",
        "A direct electric heater using the same renewable supply",
        "District heating drawn from an energy-from-waste plant",
        "A hydrogen boiler fed from curtailed wind electrolysis",
      ],
      answer: 1,
      explanation:
        "The heat pump delivers three units of heat per unit of electricity; a resistance heater delivers one. Same power, triple the heat.",
    },
  ],
  "re-biomass-check": [
    {
      question: "Biomass is considered carbon-neutral because:",
      options: [
        "Regrowth reabsorbs the CO₂ released, if sourcing is genuinely sustainable",
        "Its emissions fall outside the UK's carbon budgets",
        "Burning wood releases no carbon dioxide at the point of use",
        "The carbon in recently grown wood is a different, lighter isotope from fossil-fuel carbon",
      ],
      answer: 0,
      explanation:
        "The neutral claim depends on sustainable sourcing, short transport and clean burning: it must be checked, not assumed.",
    },
    {
      question: "A hybrid boiler system (fossil + heat pump) makes sense when:",
      options: [
        "The site wants to defer its electrical connection upgrade",
        "Gas remains cheaper than electricity per kilowatt-hour at every single hour of the year",
        "The building's radiators are too small for either alone",
        "The heat pump carries the base load and the boiler covers rare peaks",
      ],
      answer: 3,
      explanation:
        "The heat pump serves most of the year at high COP; the boiler tops up the coldest days: most of the carbon cut, less capital.",
    },
    {
      question: "A microgrid with peer-to-peer energy trading allows:",
      options: [
        "Unlimited export regardless of the network's capacity",
        "The community to fix its own regulated electricity tariff",
        "Local surplus generation to be sold directly between neighbours",
        "Participants to disconnect permanently from the national grid",
      ],
      answer: 2,
      explanation:
        "Local generation, storage and smart settlement let surplus PV serve a neighbour, keeping energy and value in the community.",
    },
  ],
  "re-grid-check": [
    {
      question: "A grid code (DNO approval) for PV export requires:",
      options: [
        "A dedicated export cable separate from the site's supply",
        "Anti-islanding protection, compliant inverters and export metering",
        "A battery installed to smooth every kilowatt that is exported onto the local network",
        "An annual generation licence from the energy regulator",
      ],
      answer: 1,
      explanation:
        "If the grid fails, your inverter must disconnect within milliseconds so it cannot energise lines engineers believe are dead.",
    },
    {
      question: "Battery storage round-trip efficiency (charge in, discharge out) for lithium-ion is typically:",
      options: [
        "85–95%, with only small inverter and chemistry losses",
        "70–80%, roughly the same as lead-acid batteries",
        "50–60%, so half of every stored unit is sacrificed",
        "99% or better across thousands of charge cycles",
      ],
      answer: 0,
      explanation:
        "Lithium-ion round-trip efficiency runs 85–95%. The loss is part of every storage business case, but it is small.",
    },
    {
      question: "Net-zero pathway (insulation → electrification → generation) assumes:",
      options: [
        "Generation leads, since renewables are the cheapest step",
        "Insulation can be skipped where renewables are abundant",
        "Demand falls first, loads electrify, then renewables are sized to fit",
        "All three steps are designed and delivered together in one single capital programme",
      ],
      answer: 2,
      explanation:
        "Reduce demand first, electrify heat and transport, then generate: each step shrinks and cheapens the ones that follow.",
    },
  ],
  "insulation-fundamentals-check": [
    { question: "U-value measures:", options: ["The cost of an element per square metre installed", "The density of the insulating material in kg/m³", "Heat flow per square metre per degree of temperature difference", "The thickness of insulation installed in an element, measured through its full build-up"], answer: 2, explanation: "Lower U-value = better insulation, in W/m²K. A typical modern wall target is around 0.3 W/m²K or better." },
    { question: "Economic insulation thickness is where:", options: ["The outer surface temperature first falls to exactly the safe-touch limit for the site", "The insulation completely fills the space available", "The marginal cost of more insulation equals the energy it saves", "The U-value stops improving with added thickness"], answer: 2, explanation: "Each added layer saves less than the last while costing the same. The optimum is where total cost bottoms out." },
  ],
  "insulation-envelope-check": [
    { question: "Thermal bridges occur at:", options: ["Junctions and penetrations where insulation is interrupted", "The centre of large uninsulated wall panels", "Any surface that faces the prevailing wind", "Random points spread statistically evenly across every element of the whole envelope"], answer: 0, explanation: "A steel stud or an uninsulated junction lets heat bypass the insulation, and the cold inner surface invites mould." },
    { question: "Low-E glazing coating reduces:", options: ["The solar gain admitted in summer, at the cost of losing useful winter warmth", "The visible light passing through, darkening the room", "Radiative heat loss, by reflecting long-wave heat back indoors", "Surface condensation, by warming the outer pane"], answer: 2, explanation: "Low-E coatings reflect long-wave (heat) radiation back into the room while letting visible light through." },
  ],
  "insulation-lagging-check": [
    { question: "A 50mm uninsulated hot water pipe at 60°C loses roughly:", options: ["Nothing measurable once the pipe has warmed its surroundings", "50 W or more per metre, continuously while the system runs", "5 W per metre, small enough to ignore in practice", "500 W per metre, enough to heat the whole corridor"], answer: 1, explanation: "Bare hot pipe bleeds heat continuously; lagging cuts the loss by around 90% and typically repays within a year." },
    { question: "Safe touch surface temperature is typically maximum:", options: ["35 °C, matching body temperature, on every surface that any person could conceivably reach", "About 50–60 °C, which insulation must achieve where people can reach", "100 °C, the boiling point, on all industrial plant", "80 °C, provided warning labels are clearly displayed"], answer: 1, explanation: "Guidance requires accessible hot surfaces to stay around 50–60 °C or below; insulation is sized for it, or guarding is added." },
  ],
  "buildings-design-check": [
    { question: "U-value target for a new building wall (to meet modern standards):", options: ["Whatever the designer chooses, since walls are unregulated", "Around 0.3 W/m²K or better, needing substantial insulation", "Around 1.0 W/m²K, the level of a filled cavity wall", "Around 2.0 W/m²K, matching traditional solid brick"], answer: 1, explanation: "Regulations have tightened: new walls come in around 0.25–0.35 W/m²K, against 0.8–1.5 for older stock." },
    { question: "Air-tightness testing (blower door) measures:", options: ["The air leakage rate through the fabric at a set pressure", "The ventilation system's ability to hold a set flow", "The structural wind resistance of the completed envelope", "The insulation continuity across junctions and bridges"], answer: 0, explanation: "A blower door pressurises the building to 50 Pa; the airflow needed to hold that reveals how leaky the fabric is." },
  ],
  "buildings-glazing-check": [
    { question: "Solar factor (g-value) describes:", options: ["The glazing's ability to reject ultraviolet radiation", "The fraction of solar energy that enters the building as heat", "The percentage of visible daylight the glazing transmits into the occupied space", "The glass's resistance to conducted heat flow"], answer: 1, explanation: "g = 0.7 means 70% of the solar energy striking the glass ends up inside: an asset in winter, a liability in summer." },
    { question: "East/west-facing windows need:", options: ["Vertical shading or solar glass, as low sun defeats overhangs", "No solar protection, since the sun never strikes them directly", "Overhangs sized to the summer midday sun angle", "Less insulation than north-facing glazing of the same size"], answer: 0, explanation: "East and west sun arrives low and head-on, so horizontal overhangs barely help; blinds, fins or coatings work better." },
  ],
  "buildings-retrofit-check": [
    { question: "Energy retrofit sequence should prioritize:", options: ["Glazing first, as windows dominate most buildings' losses", "Renewables first, since they cut carbon from day one", "Fabric first, so later plant is sized for the reduced demand", "Heating plant first, so the new boiler sets the design basis"], answer: 2, explanation: "Reduce demand through the envelope first; plant installed afterwards can then be smaller, cheaper and more efficient." },
    { question: "External wall insulation on existing solid walls typically costs:", options: ["Roughly £500–800 per square metre installed", "Roughly £15–25 per square metre installed", "Little more than the price of the insulation boards", "Roughly £100–200 per square metre installed"], answer: 3, explanation: "EWI runs about £100–200/m² with render and detailing, which is why it rarely pays on energy alone and bundles with other works." },
  ],
  "chp-fundamentals-check": [
    { question: "CHP produces electricity by:", options: ["Converting waste process heat directly through thermocouples", "Driving a generator with an engine and recovering its heat", "Recovering the flue losses of the site's existing boilers", "Storing off-peak electricity for use at peak times"], answer: 1, explanation: "CHP = prime mover + generator + heat recovery. Around 35–42% of fuel becomes power and 40–50% recoverable heat." },
    { question: "Compared to grid electricity, CHP is more efficient because:", options: ["It avoids the standing charges on grid electricity", "Generation losses become useful heat instead of cooling-tower waste", "Its generators run at higher speeds than power stations", "It burns natural gas, which carries more usable energy than the grid's mixed fuel inputs"], answer: 1, explanation: "A power station throws its heat away and loses more in transmission; CHP captures the heat on site, reaching 80–90% overall." },
  ],
  "chp-integration-check": [
    { question: "CHP should be sized to:", options: ["The heat base load, so the unit runs long hours fully used", "The largest single heat load connected anywhere on the site's distribution system", "The site's peak electrical demand on the coldest day", "The maximum export the grid connection will allow"], answer: 0, explanation: "Size to the heat demand present for thousands of hours; oversizing forces heat dumping and destroys the economics." },
    { question: "CHP + boiler hybrid system benefits because:", options: ["The boiler can be removed once the CHP has bedded in", "CHP serves the base load efficiently while boilers cover peaks", "The CHP can then follow the electrical load instead", "Both machines share the site's heat load exactly equally through every week of the year"], answer: 1, explanation: "A modest CHP covers most annual heat energy at high utilisation; boilers handle the short peaks. Smaller unit, better payback." },
  ],
  "chp-economics-check": [
    { question: "CHP payback (10-year) in the UK typically requires:", options: ["High heat demand and a wide gap between power and gas prices", "A unit above one megawatt, where scale economics begin", "A subsidy scheme, since unsupported CHP cannot pay back", "Round-the-clock electrical demand regardless of heat use"], answer: 0, explanation: "The spark spread and heat utilisation carry the case: long running hours with the heat genuinely used." },
    { question: "Exporting CHP-generated electricity to grid provides:", options: ["Credits that offset the site's Climate Change Levy", "Revenue at close to the full retail price of electricity", "Nothing, since export by CHP units is not permitted", "Modest revenue, typically well below the import price avoided"], answer: 3, explanation: "Export earns wholesale-level prices, roughly half retail or less, which is why self-consumption is worth so much more." },
  ],
  "maintenance-strategy-check": [
    { question: "Planned maintenance differs from reactive because:", options: ["It replaces components on age regardless of their condition", "It transfers the breakdown risk to the service contractor", "It costs more overall but keeps the paperwork simpler", "It services plant before failure, holding efficiency and uptime"], answer: 3, explanation: "Servicing before failure keeps plant near design efficiency and avoids the downtime and premium costs of breakdowns." },
    { question: "A clogged boiler tube loses efficiency by:", options: ["5–10%, as deposits insulate the tubes and flue temperature rises", "Only affecting the steam's dryness quality rather than the boiler's fuel consumption", "Nothing, provided the burner is modulating correctly", "Around 1%, within the measurement noise of a flue test"], answer: 0, explanation: "Soot and scale insulate the heat-transfer surfaces, so heat leaves up the flue: rising flue temperature is the tell." },
  ],
  "maintenance-systems-check": [
    { question: "Chiller superheat should be maintained at:", options: ["Whatever the ambient conditions happen to produce", "About 5–8 °C: enough to protect the compressor, no more", "At least 15 °C to guarantee dry gas at the compressor", "Zero, so the evaporator surface is fully wetted"], answer: 1, explanation: "Too little superheat risks liquid slugging; too much wastes evaporator surface. Drift here quietly costs capacity and COP." },
    { question: "Motor bearing lubrication prevents:", options: ["The winding insulation from absorbing moisture", "Friction, heat and the silent wear that ends in seizure", "Voltage imbalance developing across the three phases", "Harmonic currents circulating through the shaft"], answer: 1, explanation: "Bearing failure is the leading cause of motor breakdown, and it develops silently: lubricate to schedule, monitor for wear." },
  ],
  "maintenance-program-check": [
    { question: "Condition monitoring (vibration, temperature, efficiency) helps by:", options: ["Removing the need for any scheduled maintenance visits", "Catching developing faults early, before failure and waste", "Extending warranty periods on monitored equipment", "Proving to insurers that the plant is being looked after"], answer: 1, explanation: "Trends reveal faults weeks ahead: repairs become planned and cheap, and the energy-wasting decline is cut short." },
    { question: "A maintenance program should track:", options: ["Only the critical plant, since minor items are disposable", "Costs and completion dates, which is all audits require", "Contractor response times against the agreed service levels", "Assets, history, failures and efficiency trends for planning"], answer: 3, explanation: "The register and its history are what turn maintenance into a data-driven, continuously improving programme." },
  ],
  "mv-fundamentals-check": [
    { question: "Baseline in M&V means:", options: ["A target agreed between the client and the contractor", "Pre-project consumption, adjusted for its real drivers", "The lowest consumption the site has ever recorded", "The design consumption from the original specification"], answer: 1, explanation: "The baseline models consumption before the project, normalised for weather, occupancy and production, so savings are honest." },
    { question: "IPMVP Option C is best suited to:", options: ["Verifying a single measure on one isolated piece of plant", "Stipulating savings from manufacturer performance data", "Calibrated simulation when no metering exists at all", "Whole-building measurement when savings are large at the meter"], answer: 3, explanation: "Option C uses whole-facility meter data: right when combined savings are big enough to show clearly at the main meter." },
  ],
  "mv-baseline-check": [
    { question: "Weather normalization is needed because:", options: ["Heating and cooling respond to weather a year in arrears", "Weather records are too unreliable to include in models", "A mild winter would otherwise masquerade as an energy saving", "Regulators require degree-day corrections in all reports"], answer: 2, explanation: "Compare a cold baseline year to a mild reporting year without adjustment and you claim savings the weather delivered." },
    { question: "If building occupancy increased post-retrofit, adjustment should:", options: ["Leave the baseline alone, since occupancy is not energy", "Exclude the affected months from the analysis entirely", "Raise the baseline to what the old building would have used", "Lower the baseline in proportion to the extra people"], answer: 2, explanation: "The question is what the unimproved building would have used at the new occupancy: adjust the baseline up, then compare." },
  ],
  "mv-savings-check": [
    { question: "Rebound effect in M&V means:", options: ["Savings alternate between good and bad years", "Savings bounce back after equipment settles in", "The baseline rebounds upward as the building and its equipment age between the measurement periods", "Comfort-taking erodes predicted savings once running costs fall"], answer: 3, explanation: "When heat gets cheaper, people take some benefit as comfort: expected 30% becomes measured 25%, and honest M&V reports it." },
    { question: "Independent third-party M&V verification is valuable because:", options: ["It is cheaper than doing the measurement in-house", "It is a legal requirement for savings above £50,000", "It removes bias and gives the numbers credibility with funders", "It transfers responsibility for shortfalls to the verifier"], answer: 2, explanation: "Self-reported savings invite scepticism. Independent verification underpins performance contracts and financing." },
  ],
  "leadership-influence-check": [{ question: "Influencing without authority relies on:", options: ["Controlling the budget lines that fund the projects", "Escalating every significant decision to whoever holds the formal position power", "Credibility, persuasion and coalitions built with stakeholders", "Waiting for a mandate before proposing any change"], answer: 2, explanation: "Energy managers rarely command; they persuade. Credibility plus allies beats hierarchy for getting measures adopted." }],
  "leadership-culture-check": [{ question: "Embedding energy in culture means:", options: ["Adding energy targets to the induction training pack", "Appointing champions and leaving the rest to them", "Publishing the energy policy widely and then auditing departmental compliance against it", "Moving from compliance to commitment via incentives and governance"], answer: 3, explanation: "Culture shifts when recognition, metrics and board sponsorship reinforce the behaviour until it becomes the norm." }],
  "leadership-practice-check": [{ question: "Organizational silos hinder energy by:", options: ["Splitting decisions so operations, finance and procurement misalign", "Slowing communication between departments while improving each team's own accountability", "Duplicating meters and data across the departments", "Concentrating expertise where it is most effective"], answer: 0, explanation: "The classic failure: procurement buys on price, operations run for output, finance sees only budgets. Integration fixes it." }],
  "strategy-framework-check": [{ question: "ISO 50001 baseline means:", options: ["The average performance of certified organisations", "The reference consumption and EnPIs improvement is measured against", "The first full year's consumption data recorded after certification has been achieved", "The minimum performance the standard allows"], answer: 1, explanation: "The baseline is the starting point; energy performance indicators track improvement against it, lap after lap." }],
  "strategy-seu-check": [{ question: "Significant Energy Uses (SEU) focus on:", options: ["Every energy-consuming asset, weighted equally", "The few systems that dominate consumption, prioritised first", "Whatever plant and equipment the maintenance plan shows falling due for replacement soonest", "The loads that occupants complain about most often"], answer: 1, explanation: "The Pareto principle: most consumption sits in a few systems. Focus monitoring and improvement effort there first." }],
  "strategy-implementation-check": [{ question: "ISO 50001 certification requires:", options: ["An energy policy signed by the chief executive", "A working EnMS: baseline, SEUs, audits and management review", "Sub-metering on every significant energy use", "A demonstrated year-on-year reduction in the organisation's absolute energy consumption"], answer: 1, explanation: "Certification verifies the management system works: the PDCA loop, baseline, SEU control, internal audit and review." }],
  "policy-design-check": [{ question: "Energy policy should be:", options: ["Short-lived, refreshed completely every twelve months", "Specific and measurable, with clear ownership and strategy links", "Written technically, so that the engineers who must deliver it take the content seriously", "Broad and aspirational, leaving detail to the teams"], answer: 1, explanation: "Vague policies change nothing. Specific commitments with named owners and dates drive behaviour." }],
  "policy-content-check": [{ question: "Policy targets should address:", options: ["Operational efficiency alone, where the site has control", "Whatever the latest regulations explicitly require", "Carbon intensity, leaving energy cost to the finance team", "Efficiency, renewable supply and decarbonisation together"], answer: 3, explanation: "Three pillars: use less, source cleaner, and decarbonise the value chain. A one-pillar policy leaves value behind." }],
  "policy-adoption-check": [{ question: "Policy communication cascading means:", options: ["Multi-level rollout with training and roles embedded at each layer", "Sending the policy to managers for onward distribution", "The chief executive announces the policy at the annual meeting", "Publishing the policy on the intranet and noticeboards"], answer: 0, explanation: "Policy sticks when every level understands its own role: board to managers to teams, with training and accountability." }],
  "investment-basics-check": [{ question: "Hurdle rate for energy projects is typically:", options: ["Zero, since energy savings are considered risk-free", "Negative, reflecting the carbon benefits delivered", "Set equal to the bank's base lending rate", "Around 10–20% IRR, competing with other calls on capital"], answer: 3, explanation: "Finance sets hurdle rates; energy projects compete with everything else, and perceived risk pushes the bar up." }],
  "investment-development-check": [{ question: "Co-benefits of energy retrofits include:", options: ["Lower insurance premiums mandated for efficient buildings", "The energy savings measured at the utility meters", "Exemption from energy audits under the ESOS scheme", "Health, productivity, resilience and brand value, quantified"], answer: 3, explanation: "Better air and comfort cut absence and lift productivity: often worth more than the energy, if you quantify them." }],
  "investment-presentation-check": [{ question: "Portfolio prioritization ranks projects by:", options: ["Simple payback alone, since boards and committees rarely understand anything else", "The order in which the audits identified them", "Return and risk together, bundled and phased deliberately", "Capital cost, funding the cheapest measures first"], answer: 2, explanation: "Mix quick certain wins with strategic projects: the early savings fund and de-risk the later, bigger moves." }],
  "financing-options-check": [{ question: "Green loans and ESG finance offer:", options: ["Fixed energy prices bundled into the loan agreement", "Grants that never need to be repaid if targets are met", "Exemption from normal credit and covenant checks", "Preferential rates for verified environmental projects"], answer: 3, explanation: "Green finance markets reward verified projects with margins typically 0.5–1.5% below standard lending." }],
  "financing-epc-check": [{ question: "ESCO model (EPC) transfers risk by:", options: ["Making the contractor own and operate all site plant", "Fixing the client's energy price for the contract term", "Insuring the project's savings with a third-party underwriter", "Paying the provider from guaranteed, verified savings"], answer: 3, explanation: "The ESCO's income depends on delivering the savings, which aligns incentives, but scrutinise the M&V definitions hard." }],
  "financing-emerging-check": [{ question: "On-bill financing means:", options: ["Charging tenants for efficiency through a service charge", "Utility-funded upgrades repaid through the energy bill itself", "Paying for efficiency works from the maintenance budget", "Spreading the annual energy bill into monthly instalments"], answer: 1, explanation: "The bill falls by more than the repayment, so cash flow is positive from day one: powerful for smaller organisations." }],
  "procurement-basics-check": [{ question: "Index contract energy price is:", options: ["Set annually by the regulator's price control", "Fixed at the price prevailing on the signature date", "Guaranteed to undercut any fixed-price alternative", "Variable, tracking the wholesale market as it moves"], answer: 3, explanation: "Index contracts follow the market: lower average cost historically, but exposed to spikes unless hedged." }],
  "procurement-clean-check": [{ question: "PPA (Power Purchase Agreement) means:", options: ["A supplier's standard renewable-backed tariff with certificates", "A long-term contract buying power directly from a generator", "A pooled purchasing agreement across several sites", "An agreement to export surplus generation to the grid"], answer: 1, explanation: "PPAs contract directly with (often renewable) generators at agreed prices for years: price certainty plus credible green claims." }],
  "procurement-execution-check": [{ question: "Demand forecasting for procurement is critical because:", options: ["It removes the need for flexible or index contracts", "Suppliers refuse to quote without ten years of history", "Forecasts fix the price the supplier is allowed to charge", "Volume errors in either direction cost money at contract time"], answer: 3, explanation: "Understate and you buy the shortfall at spot prices; overstate and you pay for energy you never use. Forecast carefully." }],
  "behaviour-change-check": [{ question: "Habit formation in energy behaviour takes roughly:", options: ["A single well-designed launch campaign", "Three to six months of consistent reinforcement", "A fortnight of reminders at the point of use", "Longer than any employer can realistically sustain"], answer: 1, explanation: "Without months of reinforcement, behaviour reverts and the rebound eats the savings. Campaigns need follow-through." }],
  "behaviour-campaigns-check": [{ question: "Energy champion network benefits by:", options: ["Qualifying the organisation for accreditation schemes", "Relieving the energy manager of routine reporting", "Concentrating training budgets on a few volunteers", "Peer influence, which lands better than top-down messaging"], answer: 3, explanation: "Colleagues persuade colleagues. Champions in each area carry the message credibly and spot waste the centre cannot see." }],
  "behaviour-incentives-check": [{ question: "To sustain behavior change long-term:", options: ["Rotate the responsibility so nobody burns out", "Reinforce continuously: recognition, feedback and culture", "Switch from rewards to penalties once habits form", "Repeat the original campaign annually without changes"], answer: 1, explanation: "Engagement fades without ongoing reinforcement. Feedback, recognition and integration into culture keep it alive." }],
  "netzero-framework-check": [{ question: "Scope 3 emissions include:", options: ["The emissions from purchased electricity and heat", "Only the emissions a company chooses to disclose", "Value-chain emissions: suppliers, travel, waste and products", "The fuel burned in the organisation's own boilers and fleet"], answer: 2, explanation: "Scope 3 is everything upstream and downstream, and for many organisations it dominates the total footprint." }],
  "netzero-pathways-check": [{ question: "Electrification strategy for net-zero prioritizes:", options: ["Hydrogen conversion of the existing boiler stock", "Heat pumps and EVs powered by an ever-cleaner grid", "Offsetting fossil use while prices remain favourable", "Retaining efficient gas plant until the grid is fully clean"], answer: 1, explanation: "Electrified heat and transport get cleaner automatically as the grid decarbonises; fossil plant stays fossil for life." }],
  "netzero-delivery-check": [{ question: "Offset strategy is needed because:", options: ["Offsets are cheaper than most efficiency measures", "Offsets protect against future energy price rises", "Reporting regulations require offsets to be purchased before any reductions can be counted", "A small residual remains after deep cuts, and must be balanced"], answer: 3, explanation: "Credible net zero is deep reduction plus a little high-quality removal. Heavy offsetting in place of cuts is greenwash." }],
  "meb-conservation-check": [
    {
      question: "The first law of thermodynamics, restated as a balance, says:",
      options: [
        "Energy is conserved only within closed systems that have no flows crossing the boundary",
        "Energy always degrades to heat before it can leave any system",
        "Every unit of energy entering a system must leave it, or still be inside",
        "Energy can be created inside a system if enough power is supplied",
      ],
      answer: 2,
      explanation:
        "Energy is neither created nor destroyed. In = Out + Accumulation, always: that's the whole content of the first law as a practical tool.",
    },
    {
      question: "Why must you define a system boundary before building a balance?",
      options: [
        "Boundaries are strictly needed for mass balances but are optional for energy balances",
        "It is a documentation formality with no effect on the numbers",
        "The boundary decides which streams count, so it sets the question you answer",
        "Only fully closed systems can be given a meaningful boundary",
      ],
      answer: 2,
      explanation:
        "The same equipment gives different, equally valid answers depending on where you draw the line: a boiler-only boundary and a whole-steam-system boundary tell different stories.",
    },
    {
      question: "A boiler running at a constant load, hour after hour, is best approximated as:",
      options: ["A transient system", "An adiabatic system", "A steady-state system", "A closed system"],
      answer: 2,
      explanation:
        "Steady-state means nothing inside the boundary is changing with time: the same mass and energy enter as leave, continuously.",
    },
    {
      question:
        "You measure a motor's electrical input and mechanical output, and estimate its heat loss separately. The three don't quite add up. What does that gap most likely indicate?",
      options: [
        "The instruments disagree, so the whole exercise should be discarded",
        "A stream crossing the boundary hasn't been measured or counted yet",
        "Normal behaviour, since balances never close on real equipment",
        "The first law does not hold exactly for rotating machinery",
      ],
      answer: 1,
      explanation:
        "A balance that doesn't close is a signal, not an error to shrug off: it usually points to an unmeasured stream, which is often exactly where a fault or saving is hiding.",
    },
    {
      question: "For a steady-state open system, the general balance equation 'Accumulation = In − Out' simplifies to:",
      options: ["In = Out", "Out = 0", "In × Out = 1", "In = 0"],
      answer: 0,
      explanation:
        "At steady state nothing builds up inside the boundary, so accumulation is zero and everything entering must equal everything leaving.",
    },
  ],
  "meb-mass-check": [
    {
      question: "For a steady-state open system, the mass balance states that:",
      options: [
        "Mass in exceeds mass out by the amount reacted",
        "Mass is conserved for liquids but not for gases",
        "Mass is destroyed in proportion to the energy released",
        "Mass in equals mass out, with nothing accumulating",
      ],
      answer: 3,
      explanation: "At steady state, nothing accumulates inside the boundary, so mass in must equal mass out.",
    },
    {
      question: "A flow meter reads 2 m³/s of air at a density of 1.2 kg/m³. The mass flow rate is:",
      options: ["0.6 kg/s", "2.0 kg/s", "1.2 kg/s", "2.4 kg/s"],
      answer: 3,
      explanation: "Mass flow = density × volume flow = 1.2 × 2 = 2.4 kg/s.",
    },
    {
      question: "Why does a combustion mass balance need the mass fraction of oxygen in air (~23.2%), not the volume/mole fraction (~21%)?",
      options: [
        "O₂ and N₂ molecules weigh differently, and a mass balance needs mass units",
        "23.2% is simply the more precisely measured modern value of the same physical quantity",
        "The volume fraction applies only to liquid and solid fuels",
        "The two figures are interchangeable, so either works in practice",
      ],
      answer: 0,
      explanation:
        "Because O₂ molecules are heavier than N₂ molecules, air's oxygen content differs by mass versus by mole or volume; mixing the two up is a classic source of error.",
    },
    {
      question:
        "A boiler burns 0.01 kg/s of methane, needing 0.206 kg/s of actual (excess) air. By mass conservation alone, the flue gas mass flow must be:",
      options: ["0.196 kg/s", "0.226 kg/s", "0.216 kg/s", "0.01 kg/s"],
      answer: 2,
      explanation:
        "Everything entering the combustion chamber (fuel + air) must leave as flue gas: 0.01 + 0.206 = 0.216 kg/s, found from the balance with no flue-gas flow measurement needed.",
    },
    {
      question:
        "An air handling unit has 24 g/s of water vapour entering and 16 g/s leaving in the supply air. By mass conservation, the condensate draining from the coil must be:",
      options: ["24 g/s", "8 g/s", "16 g/s", "40 g/s"],
      answer: 1,
      explanation:
        "Water vapour in = water vapour out (as vapour) + condensate, so condensate = 24 − 16 = 8 g/s. The water is not destroyed, just converted from vapour to liquid.",
    },
  ],
  "meb-energy-check": [
    {
      question:
        "A boiler's fuel input, useful heat output, flue loss and blowdown loss are all measured or estimated directly. Casing loss is not directly measured. How is it found?",
      options: [
        "Estimate it from the boiler's surface area and paint colour",
        "Assume it to be zero, since radiation losses are negligible",
        "Solve for it as the residual once every measured stream is subtracted",
        "Scale it directly from the measured flue loss using a standard published loss factor",
      ],
      answer: 2,
      explanation:
        "This is the balance's most useful trick: solve for the one stream you can't easily measure by subtracting everything you can measure from the total input.",
    },
    {
      question: "In a steam system's energy balance, why does condensate typically return to the boiler carrying less energy than it left the point of use with?",
      options: [
        "It doesn't: condensate returns at the enthalpy it left with",
        "Some of the condensate's mass evaporates away in transit",
        "Sensible heat is lost from the return pipework on the way back",
        "The steam traps absorb the difference as they cycle",
      ],
      answer: 2,
      explanation:
        "Condensate leaves the process near steam temperature and cools in transit if the return line isn't well insulated: a genuine, avoidable loss the balance reveals directly.",
    },
    {
      question: "Removing moisture from air in a cooling coil (dehumidification) requires cooling the air:",
      options: [
        "Only when the outdoor air is more humid than the room air",
        "Above its dew point, so the moisture evaporates off the coil",
        "Below its dew point, so that water vapour condenses out",
        "To exactly the target supply temperature and no further",
      ],
      answer: 2,
      explanation: "Moisture only condenses out of air once it's cooled below its dew point: the basis of the standard cool-and-reheat dehumidification cycle.",
    },
    {
      question: "In an HVAC energy balance, 'reheat' (warming dehumidified air back up to a comfortable supply temperature) represents:",
      options: [
        "A reduction in the total load the chiller has to meet",
        "A bookkeeping entry that cancels out of the coil's balance",
        "Free heat recovered from the refrigeration circuit's condenser",
        "A genuine extra energy cost on top of the cooling already done",
      ],
      answer: 3,
      explanation:
        "Reheat is real additional energy spent purely to correct for over-cooling the air: it can be a third or more of the total coil load in a poorly designed system.",
    },
    {
      question: "A boiler's own combustion efficiency and a wider 'fuel to point of use' efficiency for the same plant can legitimately differ because:",
      options: [
        "Combustion efficiency is theoretical while the wider figure is measured",
        "They are balances around different boundaries, answering different questions",
        "The wider boundary double-counts the distribution losses",
        "One of the two figures must contain a measurement error",
      ],
      answer: 1,
      explanation:
        "A boiler-only boundary excludes distribution losses that a whole-system boundary includes: both numbers can be correct, for different questions.",
    },
  ],
  "meb-practice-check": [
    {
      question: "In a Sankey diagram, the width of each arrow represents:",
      options: [
        "The measurement confidence attached to that stream",
        "The magnitude of the flow, so wider arrows mean bigger flows",
        "The temperature of the flow it depicts",
        "The cost per kilowatt-hour of the energy in that stream",
      ],
      answer: 1,
      explanation: "Sankey diagrams use proportional width so the eye can compare flow sizes at a glance, without reading numbers.",
    },
    {
      question: "Exergy (or 'quality of energy') describes:",
      options: [
        "The fraction of a stream's energy that was renewably generated",
        "How much of a stream's energy could in principle become useful work",
        "The rate at which a stream's energy decays toward ambient",
        "The total quantity of energy a stream carries, as a balance measures it",
      ],
      answer: 1,
      explanation:
        "Exergy captures usefulness, not just quantity: a kWh of electricity and a kWh of lukewarm waste heat hold the same energy but very different exergy.",
    },
    {
      question: "Compared with a heat source close to ambient temperature, a heat source much hotter than ambient has:",
      options: [
        "More exergy, and so more potential to do useful work",
        "Negative exergy until it is brought back to ambient",
        "The same exergy, since exergy depends on quantity alone",
        "Less exergy, since more of its heat escapes before use",
      ],
      answer: 0,
      explanation:
        "The further a source's temperature is above ambient, the greater the fraction of its heat that could, in principle, be converted into useful work.",
    },
    {
      question: "Which sequence best describes the general method taught throughout this course?",
      options: [
        "Measure every stream directly and never calculate any by difference",
        "Draw a boundary, list the streams, measure what you can, solve the rest",
        "Start from the arithmetic and add the boundary once it closes",
        "Estimate the losses from tables, then reconcile the input to match",
      ],
      answer: 1,
      explanation: "This sequence (boundary, streams, measure, solve, check it closes) is the method behind every balance in this course.",
    },
    {
      question: "If a generic industry rule of thumb disagrees with a balance you've built from your own measured, plant-specific numbers, you should generally:",
      options: [
        "Re-measure until your numbers agree with the rule of thumb",
        "Trust the rule of thumb, since it embodies wide industry experience",
        "Average the two figures and carry the uncertainty forward",
        "Trust your balance: rules of thumb are for screening, not decisions",
      ],
      answer: 3,
      explanation: "Rules of thumb are useful for a first rapid screen, but a balance built from your own measured numbers on the actual plant is the more trustworthy figure for a real decision.",
    },
  ],
  "pinch-fundamentals-check": [
    {
      question: "Compared with matching waste heat sources to loads one pair at a time, pinch analysis:",
      options: [
        "Trades accuracy for speed by approximating the stream data",
        "Applies only to fully continuous processes whose stream flows never vary through the day",
        "Reaches the same answer with considerably more paperwork",
        "Considers every stream at once and proves the minimum utility needed",
      ],
      answer: 3,
      explanation:
        "A one-at-a-time search can find good matches but can never prove it found the best combination; pinch analysis calculates the provable minimum for the whole process.",
    },
    {
      question: "A stream with a supply temperature of 160 °C that needs to leave at 60 °C is:",
      options: ["A utility stream", "A cold stream", "A hot stream", "A threshold stream"],
      answer: 2,
      explanation: "A hot stream needs cooling: its supply temperature is higher than its target. This one needs cooling from 160 to 60 °C.",
    },
    {
      question: "CP (heat capacity flow rate), in kW/°C, is:",
      options: [
        "The specific heat capacity at constant pressure alone",
        "Mass flow rate multiplied by specific heat capacity",
        "The stream's temperature change per metre of exchanger",
        "The stream's heat load divided by its supply temperature",
      ],
      answer: 1,
      explanation: "CP = ṁ × cp: the same quantity from the Mass & Energy Balances course, given its own symbol because it's used so heavily in this method.",
    },
    {
      question: "The minimum approach temperature, ΔTmin, is best described as:",
      options: [
        "The smallest temperature any stream reaches in the process",
        "A property of the working fluid fixed by thermodynamics",
        "A design choice trading heat recovery against exchanger cost",
        "A safety margin required by pressure-equipment regulations",
      ],
      answer: 2,
      explanation: "ΔTmin isn't fixed by physics: it's chosen to balance how much heat you recover against how much exchanger area you're willing to pay for.",
    },
    {
      question: "A hot composite curve is built by:",
      options: [
        "Plotting the single largest hot stream and scaling it up",
        "Joining each hot stream's endpoints with straight lines in turn",
        "Averaging the supply and target temperatures of all hot streams",
        "Summing hot-stream CPs in each temperature band and accumulating heat",
      ],
      answer: 3,
      explanation: "Composite curves combine multiple streams by adding their CPs within each temperature interval where they're simultaneously present, then accumulating heat band by band.",
    },
  ],
  "pinch-targeting-check": [
    {
      question: "Why do you shift hot stream temperatures down and cold stream temperatures up by ΔTmin ÷ 2 before building the problem table?",
      options: [
        "To keep the arithmetic positive throughout the cascade",
        "To convert every temperature onto the absolute Kelvin scale",
        "To correct for the heat losses expected in the exchangers",
        "To put both kinds of stream on one scale with ΔTmin built in",
      ],
      answer: 3,
      explanation: "Shifting lets you compare hot and cold streams directly on one scale without tracking the ΔTmin offset separately at every step of the cascade.",
    },
    {
      question: "In the problem table cascade (started at zero heat input), the most negative running value represents:",
      options: [
        "The minimum cold utility the process can ever achieve",
        "The total heat load of every cold stream added together",
        "The minimum hot utility needed to make the cascade feasible",
        "An infeasible stream set that must be re-specified",
      ],
      answer: 2,
      explanation: "A negative cascade value is thermodynamically impossible on its own; topping it up to zero at its lowest point sets the minimum hot utility.",
    },
    {
      question: "After topping up the cascade with the minimum hot utility, the pinch point is located where:",
      options: [
        "The largest single temperature interval sits",
        "The cascade reaches its highest running value",
        "The hot and cold utilities are equal",
        "The cascade touches exactly zero",
      ],
      answer: 3,
      explanation: "The pinch is exactly where the topped-up cascade reaches zero: the single tightest point in the whole process.",
    },
    {
      question: "According to the golden rules, above the pinch you should never use:",
      options: ["Stream splitting", "Cold utility", "Hot utility", "Process-to-process matches"],
      answer: 1,
      explanation: "Above the pinch is a net heat sink: using cold utility there wastes heat the process itself needs, forcing extra hot utility to compensate.",
    },
    {
      question: "If 15 kW of heat is transferred directly across the pinch, the total utility penalty (extra hot + extra cold combined) is:",
      options: ["30 kW", "7.5 kW", "15 kW", "45 kW"],
      answer: 0,
      explanation: "Every kW crossing the pinch costs 2 kW of total utility: one extra kW of hot utility to replace what's missing, and one of cold utility to reject what shouldn't have been cooled there.",
    },
  ],
  "pinch-network-design-check": [
    {
      question: "Immediately above the pinch, a feasible match requires:",
      options: [
        "CP(hot) = CP(cold) exactly",
        "Equal stream duties on both sides",
        "CP(hot) ≥ CP(cold)",
        "CP(hot) ≤ CP(cold)",
      ],
      answer: 3,
      explanation: "Above the pinch, CP(hot) ≤ CP(cold) keeps the temperature approach growing rather than shrinking as you move away from the pinch.",
    },
    {
      question: "The 'tick-off' heuristic means:",
      options: [
        "Checking each golden rule off a list before designing",
        "Marking every infeasible match on the grid so that it is never revisited during design",
        "Sizing each exchanger to tick over at part load",
        "Matching at the pinch, exhausting one stream per match, repeating",
      ],
      answer: 3,
      explanation: "Tick-off works outward from the pinch, exhausting one stream per match and removing it before continuing with the remainder.",
    },
    {
      question: "Splitting a stream into two branches is the right move when:",
      options: [
        "No unsplit match at the pinch can satisfy the CP feasibility rule",
        "The stream's total duty is too large to fit within a single heat-exchanger shell",
        "The stream crosses the pinch and must be divided there",
        "Two identical exchangers happen to be available on site",
      ],
      answer: 0,
      explanation: "Splitting creates two smaller-CP branches, which can satisfy the feasibility rule even when the original unsplit stream couldn't against either target.",
    },
    {
      question: "The minimum number of heat-transfer units for a region with 5 streams and utilities (no loops) is:",
      options: ["6", "3", "5", "4"],
      answer: 3,
      explanation: "N = S + L − 1 = 5 + 0 − 1 = 4.",
    },
    {
      question: "A network with more units than its minimum-units target most likely contains:",
      options: [
        "A utility exchanger doing process-to-process duty",
        "A process stream that was accidentally left out of the original stream data table",
        "An arithmetic error in the problem table cascade",
        "An independent loop: a redundant path that can often be removed",
      ],
      answer: 3,
      explanation: "Extra units beyond S − 1 signal a loop; breaking it usually cuts capital cost for a small energy trade-off.",
    },
  ],
  "pinch-economics-check": [
    {
      question: "As ΔTmin is tightened (made smaller), the minimum hot and cold utility requirements:",
      options: [
        "Both increase together",
        "Move in opposite directions, one up and one down",
        "Both decrease, or at worst stay the same",
        "Stay fixed, since ΔTmin only affects equipment sizing",
      ],
      answer: 2,
      explanation: "A smaller ΔTmin lets more heat be recovered between process streams, reducing (or holding steady) both utility requirements.",
    },
    {
      question: "As ΔTmin is tightened, heat-exchanger capital cost typically:",
      options: [
        "Halves predictably for every halving of the chosen approach temperature difference",
        "Falls, since less utility plant is needed",
        "Rises, because smaller temperature differences need more area",
        "Stays fixed, since the duties are unchanged",
      ],
      answer: 2,
      explanation: "A tighter approach drives heat transfer more slowly per unit area, so more area (and cost) is needed to move the same heat.",
    },
    {
      question: "A 'threshold problem' in pinch analysis is a process that:",
      options: [
        "Genuinely needs only one utility, either hot or cold",
        "Has its pinch located at the very highest process temperature",
        "Needs both utilities in exactly equal amounts",
        "Cannot be solved by the problem table algorithm",
      ],
      answer: 0,
      explanation: "In a threshold problem, one stream's surplus or deficit is large enough, with good temperature overlap, that only one utility is ever needed.",
    },
    {
      question: "Before recommending new heat-recovery equipment on an existing site, a retrofit pinch study should first check for:",
      options: [
        "Existing cross-pinch violations, often fixable by cheap re-piping",
        "Space in the plant room for the new heat exchangers",
        "The age and condition of the site's existing exchangers",
        "Whether the site's utility contracts allow reduced consumption",
      ],
      answer: 0,
      explanation: "Existing cross-pinch violations are usually the cheapest fix available, often just re-routing an existing connection, and should be corrected before proposing new capital.",
    },
    {
      question: "In a retrofit audit, if actual hot utility and actual cold utility both exceed their calculated targets by the same amount, that pattern most likely indicates:",
      options: [
        "A single connection crossing the pinch, of exactly that size",
        "Both utility meters are drifting by the same calibration error",
        "The site is running its utilities at part load deliberately",
        "The stream data used for the targets is out of date",
      ],
      answer: 0,
      explanation: "Equal gaps on both hot and cold utility is the signature of a golden-rule violation: a single misplaced connection of that size crossing the pinch.",
    },
  ],
  "brewery-fundamentals-check": [
    {
      question: "Malting (steeping, germinating and kilning barley into malt) usually happens:",
      options: [
        "At the farm, before the barley is ever harvested",
        "In the mash tun, during the first hour of mashing",
        "At the brewery itself, as the first process step at the start of every single brew day",
        "Off-site at a maltster, outside the brewery audit's boundary",
      ],
      answer: 3,
      explanation: "Malting is normally done off-site by a specialist maltster, on a different energy bill and outside what a brewery's own audit can measure or change.",
    },
    {
      question: "Which single brewhouse step is typically the biggest thermal (gas) load?",
      options: ["The wort boil", "Mashing", "Milling the malt", "Lautering"],
      answer: 0,
      explanation: "Boiling the wort for 60–90 minutes, raising it to boiling and maintaining a rolling boil, is the single largest heat demand in the brewhouse.",
    },
    {
      question: "Fermentation is a major electrical (refrigeration) load because:",
      options: [
        "The CO₂ recovery compressors have to run continuously throughout the fermentation",
        "The vessels must be lit and ventilated around the clock",
        "It is exothermic, so cooling must remove heat to hold temperature",
        "The yeast needs to be chilled before every pitching",
      ],
      answer: 2,
      explanation: "Fermentation releases real heat as a byproduct of the biological reaction, and active cooling is needed throughout to hold the target temperature.",
    },
    {
      question: "Comparing a 12-day fermentation cycle to a 14-day conditioning cycle for a similar-sized vessel, which typically costs more in refrigeration electricity, and why?",
      options: [
        "Fermentation can cost more, because its peak cooling intensity is far higher",
        "Conditioning always costs more, simply because the vessel is held cold for the extra two days",
        "They cost the same, since the vessels are similar sizes",
        "Neither: both loads are met by free cooling in a UK climate",
      ],
      answer: 0,
      explanation: "Intensity matters as much as duration: a short, intense fermentation load can outweigh a longer but gentler conditioning load in total electrical cost.",
    },
    {
      question: "A brewery's electrical load profile, compared to a typical office building's, usually:",
      options: [
        "Peaks sharply in the daytime and falls to nothing overnight",
        "Runs fairly flat, since refrigeration works around the clock",
        "Peaks overnight when the off-peak tariff windows open",
        "Follows the weather far more closely than an office's does",
      ],
      answer: 1,
      explanation: "Because refrigeration for fermentation and conditioning runs continuously, a brewery's load looks much flatter than an occupancy-driven building load.",
    },
  ],
  "brewery-benchmarks-check": [
    {
      question: "Energy intensity (kWh per hectolitre) is a more useful comparison metric than total annual energy because:",
      options: [
        "It excludes the brewhouse, where usage is hardest to measure",
        "It always comes out smaller and easier to communicate",
        "It is the figure the industry's regulators ask breweries for",
        "It normalises for production, so different sizes compare fairly",
      ],
      answer: 3,
      explanation: "A brewery's total energy tells you little without knowing how much beer it made: intensity (kWh/hL) is the normalised, comparable figure.",
    },
    {
      question: "Craft breweries typically show higher energy intensity (kWh/hL) than large macro-breweries mainly because:",
      options: [
        "Their brewers prioritise flavour over any energy concern",
        "They brew stronger, more heavily hopped beers that inherently take more energy per litre produced",
        "Fixed losses don't shrink with output, so they weigh more at small scale",
        "They pay domestic tariffs rather than industrial ones",
      ],
      answer: 2,
      explanation: "Fixed equipment losses stay roughly constant regardless of scale, so they dominate more at smaller production volumes: a scale effect, not a competence one.",
    },
    {
      question: "The water-to-beer ratio matters for energy management because:",
      options: [
        "Regulators cap the ratio for breweries above a set size",
        "Most brewing water needs heating, so less water means less energy",
        "Water charges are usually larger than the site's energy bills",
        "It determines the strength of the trade effluent discharged",
      ],
      answer: 1,
      explanation: "Reducing water use often reduces the energy needed to heat that water: the two are linked, not independent, in a brewery.",
    },
    {
      question: "Before comparing a small regional brewery's energy intensity to a published benchmark, you should:",
      options: [
        "Convert both figures into carbon rather than energy terms",
        "Confirm the benchmark comes from the same calendar year",
        "Adjust the brewery's own figure downward to compensate for its much smaller scale",
        "Check the benchmark matches the scale and beer style being brewed",
      ],
      answer: 3,
      explanation: "Benchmarks are only useful compared like-for-like: scale and process style (lager's longer, colder conditioning costs more than ale) both change what's achievable.",
    },
    {
      question: "A brewery's own historical intensity trend (kWh/hL over time, production held roughly constant) is useful because:",
      options: [
        "It converts directly into the site's carbon footprint",
        "It satisfies the record-keeping duty under a sector CCA",
        "It lets the brewery ignore published benchmarks entirely",
        "A rising trend flags a developing problem worth investigating",
      ],
      answer: 3,
      explanation: "Establishing your own baseline and watching it over time reveals developing problems directly: the same principle as the monitoring & targeting baseline method.",
    },
  ],
  "brewery-compliance-check": [
    {
      question: "Why is brewery trade effluent typically charged more than its raw volume would suggest?",
      options: [
        "The charges include the cost of the brewery's incoming water",
        "Water companies apply a standard sector surcharge to all food and drink producers by default",
        "Brewery discharge volumes are estimated rather than metered",
        "Charges also reflect strength (BOD/COD), and brewery effluent is strong",
      ],
      answer: 3,
      explanation: "Trade effluent charging (the Mogden formula) has volume and strength components: brewery effluent's high organic content pushes up the strength charge specifically.",
    },
    {
      question: "Recovering both the heat AND the water from wort cooling (reusing it as brewing liquor, rather than draining it) can reduce:",
      options: [
        "Neither bill materially, on a brewery of typical scale",
        "The trade effluent bill alone, since the heat is low grade",
        "Both the gas bill and the trade effluent bill at once",
        "The gas bill alone, since the water was already paid for",
      ],
      answer: 2,
      explanation: "Recovering the water itself, not just its heat, cuts the volume side of the trade effluent charge alongside the energy saving: two benefits from one project.",
    },
    {
      question: "A HACCP critical limit, such as a CIP wash temperature, should be treated as:",
      options: [
        "A food-safety requirement never crossed without proper validation",
        "A starting point for negotiation with the energy assessor",
        "A guideline that experienced brewers may use their judgement on",
        "A target that applies to packaging lines but not to vessels",
      ],
      answer: 0,
      explanation: "HACCP critical limits are set to reliably prevent a hazard: lowering one without validating that it still works is a food-safety risk, not a legitimate efficiency measure.",
    },
    {
      question: "Most craft and regional UK breweries, in terms of ESOS and SECR applicability, are:",
      options: [
        "Covered only once their exports exceed a set threshold",
        "In scope for ESOS but exempt from SECR reporting",
        "In scope for both, as alcohol producers are always covered",
        "Below the size thresholds and exempt, unlike the large groups",
      ],
      answer: 3,
      explanation: "ESOS and SECR apply to large undertakings by employee count and turnover thresholds: most craft and regional breweries fall below these, unlike large brewing groups.",
    },
    {
      question: "A Climate Change Agreement (CCA), historically available to the brewing sector, works by:",
      options: [
        "Exempting breweries from the Climate Change Levy entirely",
        "Discounting the levy in exchange for meeting efficiency targets",
        "Funding brewery efficiency projects from a sector-wide pot",
        "Replacing ESOS audits with a lighter sector assessment",
      ],
      answer: 1,
      explanation: "A CCA is a sector-negotiated agreement trading a lower CCL rate for meeting efficiency targets: always check current eligibility and terms for the specific site.",
    },
  ],
  "brewery-efficiency-check": [
    {
      question: "Vapour condensing (recovering heat from the wort boil's evaporated water) and wort-cooling heat recovery (recovering heat from the cooled wort afterward) are:",
      options: [
        "Two independent recoveries at different points, so savings add",
        "Both dependent on installing a new steam boiler first",
        "Two names for the same heat-recovery installation",
        "Alternatives, of which a brewery can only ever justify one",
      ],
      answer: 0,
      explanation: "One captures latent heat leaving as vapour during the boil; the other captures heat leaving as hot water afterward: genuinely separate recovery points.",
    },
    {
      question: "Breweries often suit CHP (combined heat and power) unusually well because:",
      options: [
        "They need heat and power together, steadily, most of the time",
        "Brewing gas is cheaper under sector supply agreements",
        "Their sites have space for containerised generation plant",
        "Their electrical demand is too peaky for a grid supply alone",
      ],
      answer: 0,
      explanation: "A steady, simultaneous heat-and-power demand (unlike a weather-driven building load) is exactly the profile that makes a CHP business case work well.",
    },
    {
      question: "Running one shared glycol loop at the coldest temperature any user needs (e.g. conditioning) means:",
      options: [
        "Warmer users are overcooled, paying the cold loop's premium needlessly",
        "Fermentation control improves because the glycol responds faster",
        "The chiller runs at its highest COP for all of its running hours",
        "Every user is served correctly with the simplest possible plant",
      ],
      answer: 0,
      explanation: "Making colder glycol always costs more (the COP falls with temperature): supplying warmer-temperature users from an unnecessarily cold shared loop wastes that premium on them too.",
    },
    {
      question: "Before proposing a new free-cooling system for a glycol chiller, you should first check whether:",
      options: [
        "The local climate reliably provides at least six months of sub-freezing night temperatures",
        "The plant already has free-cooling capability that is unused or disabled",
        "The brewery's insurance permits running without the compressor",
        "The glycol concentration is high enough for sub-zero operation",
      ],
      answer: 1,
      explanation: "Some plants are free-cooling-capable but never commissioned to use it, or had it disabled after a fault: recommissioning existing capability is far cheaper than adding new equipment.",
    },
    {
      question: "A glycol chiller's condenser becomes fouled. What is the direct effect on the fermentation jacket it serves?",
      options: [
        "Colder glycol supply, as the chiller compensates automatically",
        "Warmer glycol supply, which cuts the jacket's real cooling capacity",
        "Faster fouling of the jacket itself through the shared circuit",
        "None on the jacket: fouling only raises the compressor's electricity",
      ],
      answer: 1,
      explanation: "A fouled condenser can't reject heat effectively, forcing a warmer glycol supply, which shrinks the approach temperature driving heat transfer in the jacket and cuts its capacity.",
    },
  ],

  // ---------------------------------------------------------------- CRE sector
  "cre-fundamentals-check": [
    {
      question: "In a standard multi-let office, the landlord's supplies typically feed:",
      options: [
        "Each tenant's desks, monitors, kitchenettes and server cupboards within its own demised floor space",
        "Only the lifts and the fire alarm panel, with everything else on tenant meters",
        "The central plant and common parts: boilers, chillers, AHUs, lifts and lobby lighting",
        "Whichever circuits the electricity supplier happened to connect first",
      ],
      answer: 2,
      explanation: "The landlord buys energy for what it is contractually obliged to provide: the shared services and common areas. Tenant demises normally sit on the tenants' own supplies or on recharged sub-meters, which is why any analysis starts by mapping which meter belongs to whom.",
    },
    {
      question: "Landlord energy costs reach the tenants through:",
      options: [
        "The service charge, apportioned between tenants (usually by floor area)",
        "A statutory levy collected alongside business rates by the local authority",
        "The rent review, which adjusts rent to cover the previous year's utility bills",
        "Direct invoices from the energy supplier to each tenant in proportion to headcount",
      ],
      answer: 0,
      explanation: "The service charge pools the landlord's running costs (energy, cleaning, security, maintenance) and divides them between tenants under the lease's apportionment rules. Economically the landlord's energy bill is the tenants' bill, which is what creates the split incentive.",
    },
    {
      question: "An office is occupied 65 hours a week. Roughly what fraction of the year's 8,760 hours is it empty?",
      options: [
        "About a quarter, since weekends account for most of the empty time",
        "About half, because nights and weekends roughly cancel out the working day",
        "Almost none, once cleaning, security and early starts are counted in",
        "Around 60%, which is why the overnight base load matters so much",
      ],
      answer: 3,
      explanation: "Unoccupied time is 103 of 168 hours a week, about 61% of the year. Every kilowatt running in those hours consumes more energy annually than a kilowatt used only in the working day, which is why the 3 a.m. demand is the fastest health check in commercial property.",
    },
    {
      question: "The 'split incentive' in commercial property means:",
      options: [
        "Landlords and tenants split the cost of any efficiency project equally by convention",
        "The party able to fund an improvement is often not the party whose bills would fall",
        "Energy suppliers offer different tariffs to landlords and tenants for the same building",
        "Efficiency incentives from government are shared between the freeholder and leaseholder",
      ],
      answer: 1,
      explanation: "The lease boundary cuts the cash flows: a landlord funding an LED retrofit in a tenant's demise sees none of the saving, and a tenant improving the landlord's asset hands the benefit back at lease expiry. Projects with perfectly good paybacks die in that gap unless the lease rewires it.",
    },
    {
      question: "A green lease typically addresses the split incentive by:",
      options: [
        "Obliging the landlord to fund all efficiency works from its own profits with no recovery",
        "Requiring the tenant to accept any works the landlord proposes without consultation",
        "Setting a fixed annual energy price for the tenant regardless of consumption",
        "Adding cost-recovery, data-sharing and cooperation clauses that make efficiency investable",
      ],
      answer: 3,
      explanation: "Model green-lease clauses let landlords recover improvement costs through the service charge where tenants' total outgoings genuinely fall, oblige both sides to share consumption data, and commit both to consider efficiency at plant replacement, converting a stand-off into a mechanism.",
    },
  ],

  "cre-ratings-check": [
    {
      question: "The fundamental difference between an EPC and a DEC is that:",
      options: [
        "An EPC applies to whole buildings while a DEC applies only to individual floors",
        "An EPC models the building as an asset; a DEC grades its measured, in-use energy",
        "An EPC is voluntary in the commercial sector while a DEC is required at every sale",
        "An EPC is renewed annually while a DEC lasts for ten years from issue",
      ],
      answer: 1,
      explanation: "The EPC is an asset rating built from standardised modelling of fabric and plant; occupant behaviour is deliberately excluded. A DEC does the opposite, grading actual metered consumption against a benchmark, which is why the two can flatly disagree about the same building.",
    },
    {
      question: "REEB 2024 puts typical and good practice for air-conditioned offices (whole building, GIA) at about:",
      options: [
        "500 and 350 kWh/m² per year",
        "50 and 25 kWh/m² per year",
        "300 and 240 kWh/m² per year",
        "163 and 119 kWh/m² per year",
      ],
      answer: 3,
      explanation: "The Better Buildings Partnership's 2024 benchmarks, from over 700 measured offices, put the median air-conditioned office at 163 kWh/m² GIA and the top quartile at 119. The 27% gap between them is the practical size of the prize in typical stock.",
    },
    {
      question: "A building consumes 1,338,160 kWh/yr; its GIA is 8,500 m² and NLA 7,000 m². Quoting intensity per NLA instead of per GIA:",
      options: [
        "Raises the reported figure from about 157 to about 191 kWh/m², a 21% difference",
        "Lowers the reported figure, because NLA includes plant rooms that GIA excludes",
        "Makes no difference, since benchmark sets accept either basis interchangeably",
        "Roughly halves the reported figure, because NLA counts only occupied floors",
      ],
      answer: 0,
      explanation: "NLA is the smaller denominator (it excludes cores and plant), so the same energy produces a bigger number: 1,338,160 ÷ 7,000 ≈ 191 versus ÷ 8,500 ≈ 157. Compare an NLA figure against a GIA benchmark and a fine building looks poor, so always state and match the basis.",
    },
    {
      question: "The 'performance gap' refers to buildings:",
      options: [
        "Performing worse in winter than in summer because heating dominates UK consumption",
        "Losing efficiency steadily with age as plant wears out and warranties expire",
        "Using far more energy in operation than their design-stage ratings imply",
        "Underperforming their rental valuations in the years following construction",
      ],
      answer: 2,
      explanation: "Measured consumption routinely lands at two to three times the design-stage assessment, driven by commissioning shortfalls, control drift and real occupancy differing from assumptions. It is why the sector is shifting weight from modelled ratings to measured ones like NABERS.",
    },
    {
      question: "NABERS UK's 'base building' rating is particularly useful in multi-let stock because it:",
      options: [
        "Replaces the EPC, removing the need for MEES compliance in rated buildings",
        "Isolates the landlord-controlled services from tenant consumption when scoring",
        "Rates only the tenants' fit-out quality, which other schemes ignore entirely",
        "Applies a flat national benchmark so every office competes on identical terms",
      ],
      answer: 1,
      explanation: "By rating the landlord's services separately from whole-building consumption, the base-building rating solves the attribution problem that muddies multi-let comparisons: the landlord is scored on exactly what the landlord controls, however its tenants behave.",
    },
  ],

  "cre-compliance-check": [
    {
      question: "Under MEES, since 1 April 2023 a landlord of non-domestic property in England and Wales may not:",
      options: [
        "Charge tenants for energy through the service charge without an annual audit",
        "Sell a building rated below EPC C without first registering an exemption",
        "Advertise floor space without publishing five years of consumption data",
        "Continue to let a building rated F or G without a valid registered exemption",
      ],
      answer: 3,
      explanation: "The 2023 milestone extended MEES from new lettings to continuing ones: an F or G building may not be let at all unless an exemption (7-year payback, consent refused, or devaluation) is on the public register. Penalties scale with rateable value up to £150,000 per property.",
    },
    {
      question: "The government's interim response of June 2026 changed the non-domestic MEES trajectory to:",
      options: [
        "EPC C for all commercial buildings by 2027 and B by 2030, exactly as the original consultations proposed",
        "EPC B by 2031 for buildings over 1,000 m², with smaller buildings staying at the E floor",
        "EPC A for all new leases from 2030, with existing leases exempt indefinitely",
        "No change at all: the consultation was closed with the existing rules confirmed",
      ],
      answer: 1,
      explanation: "The interim response dropped the 2027 EPC C milestone and moved the B requirement to 2031, scoped to buildings over 1,000 m² where cost-effective. It still needs secondary legislation, so treat it as the planning basis and check GOV.UK before advising on it.",
    },
    {
      question: "In a multi-let building, a landlord's ESOS assessment covers:",
      options: [
        "Every kilowatt-hour used in the building, whoever holds the supply contract",
        "Only the energy used by the managing agent's own head-office operations",
        "The energy the landlord itself purchases: central plant and common parts",
        "Nothing, because ESOS applies only to manufacturers and industrial sites",
      ],
      answer: 2,
      explanation: "ESOS responsibility follows who buys the energy. The landlord audits its own supplies (even where costs are recharged to tenants); tenants that qualify for ESOS audit their own contracted supplies separately. Assembling the portfolio supply list is half the compliance battle.",
    },
    {
      question: "TM44 inspections are required for:",
      options: [
        "Air-conditioning systems over 12 kW effective rated output, at least every five years",
        "Gas boilers over 20 kW rated output, inspected annually by a Gas Safe registered engineer under Part L",
        "All electrical distribution boards, every ten years, under the wiring regulations",
        "Lifts and escalators in buildings over 1,000 m², every three years",
      ],
      answer: 0,
      explanation: "The Energy Performance of Buildings regime requires five-yearly accredited inspections of air conditioning above 12 kW, lodged on the national register. Compliance is historically poor, which is a shame: a good TM44 report is effectively a subsidised mini-audit of the biggest electrical load in the building.",
    },
    {
      question: "Since 27 January 2026, a landlord supplying heat to tenants from a communal boiler is:",
      options: [
        "Exempt from regulation provided the building contains fewer than ten tenants",
        "Required only to display the boiler's efficiency rating in the building lobby",
        "Obliged to transfer ownership of the boiler plant to a licensed utility company",
        "A regulated heat supplier under Ofgem, with billing, fairness and redress duties",
      ],
      answer: 3,
      explanation: "The Energy Act 2023 framework brought heat networks under Ofgem from January 2026: authorisation conditions, accurate metered billing, standards of conduct and escalation to the Energy Ombudsman. The definition is functional, so a communal boiler counts even if the landlord never thought of itself as an energy company.",
    },
  ],

  "cre-efficiency-check": [
    {
      question: "A building idles at 75 kW overnight when 35 kW would cover its genuine needs. Over 5,356 unoccupied hours a year at £0.20/kWh, the waste is worth about:",
      options: [
        "£43,000 a year",
        "£4,300 a year",
        "£11,000 a year",
        "£86,000 a year",
      ],
      answer: 0,
      explanation: "The excess is 40 kW; 40 × 5,356 h = 214,240 kWh, and at £0.20/kWh that is £42,848 a year, roughly a quarter of a typical mid-size office's electricity bill, spent while the building is empty. The fix (restoring schedules) is usually close to free.",
    },
    {
      question: "Optimum start control saves energy compared with a fixed early start because it:",
      options: [
        "Runs the plant at reduced capacity all night instead of starting it in the morning",
        "Preheats the building only on days when the weather forecast predicts frost",
        "Learns how long the building takes to warm and starts plant as late as it dares",
        "Delegates the start decision to whichever tenant arrives earliest each day",
      ],
      answer: 2,
      explanation: "A fixed start time must cover the worst morning of the year, so it wastes hours on every mild day. Optimum start uses the building's measured warm-up behaviour and the actual internal and outside temperatures to hit the target at occupancy time with the shortest possible preheat.",
    },
    {
      question: "Heating setpoint 22.5 °C, cooling setpoint 21.5 °C on the same air handler. The consequence is:",
      options: [
        "Nothing unusual: a 1 °C overlap sits within the normal control tolerance of a commercial AHU's sensors",
        "The building pays twice for the same air as heating and cooling run simultaneously",
        "The AHU trips on its safety interlock and delivers no conditioning at all",
        "Comfort improves slightly, at the cost of marginally higher fan energy only",
      ],
      answer: 1,
      explanation: "With the heating target above the cooling trigger there is no dead band: the heating coil warms the air (gas), and the cooling coil removes that heat again (chiller electricity). Re-establishing a proper dead band, say heat to 21 °C and cool from 24 °C, removes the entire cost.",
    },
    {
      question: "The best moment to buy a step-change in chiller efficiency is:",
      options: [
        "Immediately after a new tenant signs its lease, to demonstrate the landlord's commitment to sustainability",
        "Mid-lease, when the service charge budget has the most headroom in it",
        "During the coldest month, when the chillers are least needed by the building",
        "At plant end-of-life, when only the increment over like-for-like needs justifying",
      ],
      answer: 3,
      explanation: "When the machine must be replaced anyway, the efficient option costs only the difference over the default, and that increment is judged against the full saving: a COP 3 to COP 5 replacement saving £8,000 a year justifies a £40,000 premium four times over across a 20-year life.",
    },
    {
      question: "At current UK prices (electricity £0.20/kWh, gas £0.06/kWh), a SCOP-3 heat pump replacing an 85%-efficient gas boiler typically:",
      options: [
        "Roughly breaks even on running cost while cutting the heating's carbon by about two-thirds",
        "Cuts the heating bill by around two-thirds while leaving the building's emissions broadly unchanged overall",
        "Triples the running cost, which is why no commercial conversions are proceeding",
        "Halves both the running cost and the emissions simultaneously in most buildings",
      ],
      answer: 0,
      explanation: "Electricity's price premium (about 3.3×) nearly cancels the efficiency gain (about 3.5×), so the bill barely moves, but the carbon falls by roughly two-thirds and keeps falling as the grid decarbonises. Office conversions are currently driven by MEES trajectory and net-zero positioning more than by the energy bill.",
    },
  ],

  // ---------------------------------------------------------------- Food manufacturing sector
  "food-fundamentals-check": [
    {
      question: "A food factory's three energy centres are best summarised as:",
      options: [
        "Lighting, ventilation and the office block that supports the production operation",
        "Process heat for cooking, refrigeration for chilling and freezing, and hot water for hygiene",
        "Compressed air, conveyor motors and the packaging hall's sealing machinery",
        "Steam raising, on-site electricity generation and the standby diesel plant that backs up the freezers",
      ],
      answer: 1,
      explanation: "Cook, chill, clean: a food factory heats product, cools product, and heats water to clean everything the food touched. Almost every significant kilowatt-hour on site serves one of those three, and their physical adjacency is what makes heat recovery the sector's defining opportunity.",
    },
    {
      question: "Why does a large share of a food factory's gas get burned after production stops for the day?",
      options: [
        "Night-rate gas tariffs make it cheaper to run the cookers overnight than during the day shift",
        "The boilers must be kept at full pressure overnight to protect them from thermal shock",
        "Ovens are left idling overnight so they are at temperature for the following morning",
        "The nightly washdown and CIP clean consumes large volumes of hot water once the lines stop",
      ],
      answer: 3,
      explanation: "When production ends, the hygiene shift begins: washdown and CIP bring every product-contact surface back to a validated standard, mostly with hot water from gas-fired calorifiers. On many sites a third or more of annual gas is spent cleaning rather than cooking.",
    },
    {
      question: "Regenerative pasteurisation is astonishingly cheap because:",
      options: [
        "The outgoing hot product preheats the incoming cold product, leaving only a small top-up for the boiler",
        "Milk needs to reach only 72 °C for 15 seconds, which is a very modest duty by the standards of industrial process heating",
        "Modern pasteurisers use electric heating, which is more efficient than gas at that scale",
        "The hold time is only 15 seconds, so the heating element barely has time to draw power",
      ],
      answer: 0,
      explanation: "A regenerative plate exchanger sets the hot pasteurised stream against the incoming cold stream: at 90% effectiveness, the product supplies 90% of its own heating and the boiler only tops up the last stretch. A 1,473 kWh/day duty becomes about 147 kWh/day.",
    },
    {
      question: "Freezing a tonne of high-moisture food costs far more than chilling it mainly because:",
      options: [
        "Freezers must hold temperature around the clock, while blast chillers only need to operate during production hours",
        "Frozen product needs thicker packaging, which adds mass the plant must also cool down",
        "The latent heat of the product's water dominates the load and is removed at the plant's worst COP",
        "Freezer fans consume more electricity than the refrigeration compressors themselves",
      ],
      answer: 2,
      explanation: "About seven-tenths of the freezing load is the latent heat of fusion of the product's own water (334 kJ/kg of it), and it is removed at low-temperature conditions where COP is around 1.5. Chilling is a sensible-heat job at COP ~3; freezing pays a bigger bill at a worse rate.",
    },
    {
      question: "Chilled prep rooms add to the refrigeration bill even when throughput is low because:",
      options: [
        "The prep equipment inside them generates most of the heat the plant removes",
        "They are usually located on the sunny side of the building for daylighting reasons",
        "Food safety requires frequent door openings to move product in and out quickly",
        "The rooms themselves are held cold for food safety whether the line is busy or not",
      ],
      answer: 3,
      explanation: "Prep areas are commonly held at 10 to 12 °C as a hygiene control, so the space is a refrigeration load in its own right, independent of tonnage. It is one reason food factories carry unusually large fixed loads, and why quiet months barely dent the bills.",
    },
  ],

  "food-benchmarks-check": [
    {
      question: "Specific energy consumption (SEC) for a food factory is:",
      options: [
        "The site's total annual energy consumption divided by its total floor area in square metres, as used for buildings",
        "The energy used by the single most intensive machine, quoted per hour of operation",
        "Energy in divided by product out: kWh per tonne, tracked separately for gas and electricity",
        "The percentage of energy that comes from renewable sources in a given month",
      ],
      answer: 2,
      explanation: "kWh per tonne of saleable output is the sector's core metric, and splitting it by fuel is the diagnosis: gas per tonne tracks the cooking side, electricity per tonne tracks the cold chain. Floor-area intensity belongs to buildings, not production sites.",
    },
    {
      question: "A factory with a 40,000 kWh/month gas base load and 60 kWh/t slope produces 800 t in a quiet month instead of its usual 1,000 t. Its gas SEC:",
      options: [
        "Rises from 100 to 110 kWh/t with nothing on site running any worse",
        "Falls, because less production always means proportionally less energy",
        "Stays exactly the same, since SEC is designed to be independent of volume",
        "Cannot be calculated without knowing the month's weather data as well",
      ],
      answer: 0,
      explanation: "The fixed 40,000 kWh spreads over fewer tonnes: (40,000 + 48,000) ÷ 800 = 110 kWh/t versus 100 in a normal month. Raw SEC punishes quiet months and flatters busy ones, which is why the regression model, base load and slope estimated separately, has to come first.",
    },
    {
      question: "Why are published cross-industry SEC benchmarks of limited use to a food site?",
      options: [
        "Publication lags mean the figures are always several years out of date by the time a site can compare against them",
        "They are usually quoted in imperial units that do not convert cleanly",
        "Most published figures come from overseas plants with different climates",
        "A bakery, a dairy and a frozen-meals plant are thermodynamically different businesses",
      ],
      answer: 3,
      explanation: "Product and process decide the physics: fresh prep can run below 100 kWh/t while fried frozen products run several times higher, with nothing wrong at either site. Published figures serve as sanity checks; the benchmark with teeth is the site against its own normalised history.",
    },
    {
      question: "The most reliable way to discover what the nightly clean actually costs is to:",
      options: [
        "Ask the hygiene team to estimate their hot water consumption from the chemical dosing records and shift patterns",
        "Measure it: a temporary heat meter on the calorifier circuit, or logged make-up volumes and temperatures",
        "Take the water bill and assume half of the total volume is heated for washdown",
        "Use the detergent supplier's published figures for factories of a similar size",
      ],
      answer: 1,
      explanation: "Cleaning hides inside 'site gas' and 'site water' because it shares calorifiers and mains with everything else. Sites measuring their clean for the first time typically find it 20 to 40% larger than anyone's estimate, which reshapes both the SEC base load and the heat-recovery case.",
    },
    {
      question: "Compressed air in a food factory deserves particular attention because:",
      options: [
        "It is the costliest utility per delivered kWh, and washdown environments breed leaks",
        "It is the largest single electrical load on almost every food manufacturing site",
        "Food-grade air must be imported from certified suppliers rather than generated on site",
        "Its pressure must be doubled after every hygiene clean to purge the lines of moisture",
      ],
      answer: 0,
      explanation: "Air keeps its Level 2 reputation (around 90% of the input energy is lost before the tool), and food adds hose-damaged fittings and corrosion from nightly washdown. Surveys should follow the hygiene calendar, and only point-of-use air that can contact product needs the food-grade treatment premium.",
    },
  ],

  "food-compliance-check": [
    {
      question: "An energy measure that would shorten a validated cook step's time-at-temperature is:",
      options: [
        "Acceptable provided the projected energy saving exceeds the estimated cost of any product quality complaints",
        "Acceptable during low-risk production runs provided extra swab tests are scheduled",
        "Not an energy measure at all: the kill step is a food safety floor no measure may cross",
        "Acceptable with the operations manager's sign-off at the weekly production meeting",
      ],
      answer: 2,
      explanation: "Cook steps are critical control points validated to deliver a specified lethality; they are legal obligations, not variables. Energy work changes how the heat is generated, recovered and insulated, never the product's validated thermal history.",
    },
    {
      question: "A freezer specified at −18 °C has been run at −25 °C for years 'to be safe'. The right reading is:",
      options: [
        "The extra margin is prudent, and the energy cost is the fair price of that prudence",
        "Seven degrees of pure compressor cost protecting nothing the validated plan asked for",
        "The setpoint should be raised to −10 °C to claw back the years of accumulated waste",
        "The freezer is probably faulty, since no plant should be able to overshoot by that much",
      ],
      answer: 1,
      explanation: "The safety plan specifies −18 °C; below it is habit, not hygiene, and at low-temperature COPs every degree costs roughly 2 to 3% of the plant's bill. The test is always 'show me where the plan requires this', and the fix is agreed with the technical team, not smuggled past them.",
    },
    {
      question: "Under the Climate Change Agreement scheme as renewed, participants get:",
      options: [
        "A substantial discount on the Climate Change Levy in exchange for meeting efficiency targets, with reduced rates running to March 2033",
        "Full exemption from ESOS assessments and SECR reporting obligations for as long as they remain compliant participants in the scheme, plus relief from air-conditioning inspection duties",
        "Government grants covering half the capital cost of any energy efficiency project",
        "Exemption from trade effluent strength charges on any process water they discharge",
      ],
      answer: 0,
      explanation: "The CCA deal is levy discount for targets: the renewed scheme's first target period began 1 January 2026 with targets to 2030 and reduced CCL rates for compliant sites until 31 March 2033. For a mid-size factory the discount is worth tens of thousands of pounds a year; ESOS and SECR still apply.",
    },
    {
      question: "Food factory trade effluent is expensive mainly because:",
      options: [
        "Water companies charge food sites a punitive flat rate regardless of what they discharge",
        "Food factories are legally required to pre-treat all effluent to drinking-water standard",
        "Discharge volumes are metered at a premium rate during night-time washdown hours",
        "Charges scale with strength, and fats, starches and product losses make food effluent strong",
      ],
      answer: 3,
      explanation: "Strength-based charging (the Mogden formula family) prices the COD and solids the treatment works must digest. Product down the drain is paid for three times: as raw material, as the process energy already spent on it, and as the strength charge. That is why dry clean-up is such a high-value habit.",
    },
    {
      question: "The relationship between a site's CCA target, its SECR disclosure and its retail customers' carbon questionnaires is best handled by:",
      options: [
        "Keeping them separate, since each scheme's rules differ too much to share data safely",
        "One normalised, production-adjusted dataset feeding all three from a single source",
        "Outsourcing each to a different consultancy so no single error can affect all three",
        "Reporting raw annual totals everywhere and explaining variances when challenged",
      ],
      answer: 1,
      explanation: "All three ultimately ask the same question: energy per tonne, trending which way? One maintained measurement system answers the CCA reporting, the SECR intensity metric and the retailer questionnaire consistently, and turns every efficiency project into a compliance credit as well as a saving.",
    },
  ],

  "food-efficiency-check": [
    {
      question: "The most reliable heat-recovery pairing in food manufacturing is:",
      options: [
        "Refrigeration heat rejection preheating the washdown and CIP hot water",
        "Compressed air aftercoolers preheating the boiler house combustion air",
        "Cold store evaporator defrost water recovered into the staff amenity block",
        "Packaging hall lighting heat captured by the air handling system in winter",
      ],
      answer: 0,
      explanation: "Both halves are inherent to making chilled food: the plant cannot stop rejecting heat, and the site cannot stop washing down. The streams overlap in temperature (especially via the discharge desuperheat), recur every day of operation, and a desuperheater bridging them typically pays back in two to three years.",
    },
    {
      question: "A desuperheater preheats 15 m³/night of washdown water from 10 °C to 35 °C, against a full requirement of 10 °C to 60 °C costing £19,056/yr in gas. The saving is about:",
      options: [
        "£19,000 a year, since the desuperheater effectively replaces the calorifier",
        "£3,200 a year, limited by the desuperheater's small share of rejected heat",
        "£9,500 a year: half the temperature lift, so half the gas",
        "£1,000 a year, because preheating only helps on the coldest winter nights",
      ],
      answer: 2,
      explanation: "Heating is proportional to temperature lift: 10 → 35 °C is 25 of the 50 degrees, so the recovery displaces half the gas, about £9,528/yr. The calorifier still tops up the final 35 → 60 °C, and the plant benefits slightly too, since recovered heat is heat the condensers no longer reject.",
    },
    {
      question: "Defrost heat is described as the most expensive heat in the factory because:",
      options: [
        "Defrost heaters run overnight, when many industrial supply contracts charge their premium distribution rates",
        "The site pays twice: once at the heater, then again at the compressor removing it from the cold space",
        "Electric defrost elements are less efficient than gas burners at converting energy to heat",
        "Defrosting must be supervised by an engineer, adding labour cost to every cycle",
      ],
      answer: 1,
      explanation: "Every kWh of defrost heat is released inside the cold envelope and must be removed again at the low-temperature plant's COP: at COP 1.5, a further 0.67 kWh of compressor electricity per kWh of heat. That is why a timer running three unnecessary hours a day can cost £12,600 a year.",
    },
    {
      question: "Floating head pressure control saves energy by:",
      options: [
        "Holding the condensing pressure steady at the value the designers chose for the hottest summer design day",
        "Switching the condenser fans to run only during the site's cheap-rate hours",
        "Diverting compressor discharge gas around the condenser during cold weather",
        "Letting condensing temperature follow ambient down instead of sitting at a fixed worst-case setpoint",
      ],
      answer: 3,
      explanation: "A fixed head-pressure setpoint sized for the hottest day wastes the whole British winter. Each degree of condensing temperature saved is worth roughly 2 to 3% of compressor energy, and floating control harvests it automatically whenever the weather cooperates.",
    },
    {
      question: "Warm product loaded into a cold store before blast chilling has finished its cycle:",
      options: [
        "Shifts the remaining cooling into the most expensive room on site, at the worst COP",
        "Is good practice, since the cold store has more spare capacity than the blast chiller",
        "Saves energy overall by spreading the cooling load across two systems in parallel",
        "Only matters for frozen product, since chilled storage tolerates any inlet temperature",
      ],
      answer: 0,
      explanation: "Blast chillers are designed for rapid heat extraction; storage rooms are designed to hold temperature. Moving unfinished cooling work into the store means slower cooling (a food safety concern) and heat removed at storage conditions, in a freezer at the plant's worst COP.",
    },
  ],

  // ---------------------------------------------------------------- Data centres sector
  "dc-fundamentals-check": [
    {
      question: "In a colocation facility, the operator controls:",
      options: [
        "The customers' servers, storage and operating systems, but not the building's mechanical and electrical plant",
        "Everything on site, including the workloads running on the hosted equipment",
        "The building systems (power chain, cooling, controls), while customers own and run the IT in their racks",
        "Only the security and reception functions, with all plant outsourced to the utility",
      ],
      answer: 2,
      explanation: "Colocation sells space, power and cooling; the IT belongs to the customers. That split shapes the audit boundary the same way a lease does in commercial property: the operator can fix the overhead directly but can only influence the IT load through engagement and data.",
    },
    {
      question: "A data centre's half-hourly load profile typically looks like:",
      options: [
        "A nearly flat line around the clock, through nights, weekends and holidays",
        "A sharp daytime plateau that falls to almost nothing overnight, like an office",
        "A weather-led curve that peaks in winter mornings and summer afternoons",
        "A sawtooth following the batch schedule of the largest customer's workloads",
      ],
      answer: 0,
      explanation: "Servers idle hot and cooling follows the IT, so the site runs at essentially constant load. That constancy is the sector's defining arithmetic: every steady kilowatt is 8,760 kWh a year, which makes a data centre kilowatt worth roughly five office kilowatts.",
    },
    {
      question: "Double-conversion UPS efficiency is worst when:",
      options: [
        "The modules run above 90% of their rated capacity for long periods",
        "The incoming grid supply is at the upper end of its voltage tolerance",
        "Ambient temperature in the UPS room falls below 20 °C in winter",
        "The modules run far below their rated load, as 2N redundancy encourages",
      ],
      answer: 3,
      explanation: "The efficiency curve collapses at low load: a typical older fleet manages ~89% at 15% load against ~96% above half load. Redundancy plus slower-than-planned fill parks fleets exactly there, which is why configuration reviews find continuous losses nobody itemised.",
    },
    {
      question: "The cooling load of a data hall equals:",
      options: [
        "Roughly half the IT load, since modern servers convert most electricity to computation",
        "The electrical load dissipated inside the envelope, watt for watt, continuously",
        "The design capacity of the installed chillers, regardless of what the IT draws",
        "The building's fabric heat gains, which dwarf the internal equipment loads",
      ],
      answer: 1,
      explanation: "Electricity in is heat out, one for one: computation is not an energy sink. A hall drawing 1,500 kW of IT power is a 1,500 kW heater that never switches off, and the cooling chain's job is to move exactly that heat from the chips to the sky.",
    },
    {
      question: "AI training clusters are forcing a shift to liquid cooling primarily because:",
      options: [
        "Liquid-cooled halls need no security zoning, simplifying multi-customer layouts",
        "Water is cheaper per kWh of heat removed than electricity in most UK regions",
        "GPU racks are legally required to be liquid-cooled under the 2024 CNI designation",
        "Rack densities of 40 to 100+ kW exceed what air can practically remove",
      ],
      answer: 3,
      explanation: "Air struggles beyond roughly 20 to 30 kW per rack, and AI clusters demand several times that. The energy silver lining: liquid captures heat at higher temperatures, slashing compressor lift and transforming the heat-reuse prospects that low-grade warm air never offered.",
    },
  ],

  "dc-benchmarks-check": [
    {
      question: "PUE is defined as:",
      options: [
        "IT equipment energy divided by cooling system energy over any representative week",
        "Total facility energy divided by IT equipment energy, measured over a full year",
        "The percentage of facility energy that comes from renewable supply contracts",
        "Peak facility demand divided by the site's contracted grid connection capacity",
      ],
      answer: 1,
      explanation: "PUE = total facility ÷ IT energy, annually, with the IT conventionally metered at the UPS output. A PUE of 1.30 means every kWh of computing carries 0.30 kWh of overhead, and the measurement boundary and period matter as much as the number.",
    },
    {
      question: "A facility's monthly PUE improves the month a large new customer's IT load comes online, with no plant changes. This is:",
      options: [
        "Evidence the cooling plant runs more efficiently at higher loads",
        "A sign the new customer's servers are more efficient than the existing estate's",
        "A reporting error, since PUE cannot change without an efficiency change",
        "Arithmetic dilution: fixed overheads spread over a larger IT denominator",
      ],
      answer: 3,
      explanation: "PUE rewards filling the building as much as running it well: the fixed base divides by more IT and the ratio falls. Any PUE trend must be read alongside the load that produced it, which is why the audit model separates coefficient changes from load growth.",
    },
    {
      question: "Switching off 100 zombie servers (powered, cooled, doing nothing) would typically:",
      options: [
        "Cut total energy substantially while slightly worsening the facility's PUE",
        "Improve PUE substantially while leaving total energy roughly unchanged",
        "Breach most colocation SLAs, which guarantee minimum IT power draws",
        "Save nothing, since idle servers draw negligible power in modern estates",
      ],
      answer: 0,
      explanation: "Idle servers draw 30 to 60% of peak power, so the saving is real (about £80,000 a year for 100 typical machines through a 1.3 overhead). But less IT under the same fixed overhead nudges PUE up: the clearest demonstration that the wrapper metric and the right decision can point opposite ways.",
    },
    {
      question: "The conventional meter point for PUE's IT-energy denominator is:",
      options: [
        "The utility intake, since that is the only fiscal-grade meter on site",
        "The chilled-water plant's electrical supply board",
        "The UPS output, so that power-chain losses count as facility overhead",
        "Each server's internal power supply, summed across the estate",
      ],
      answer: 2,
      explanation: "Measuring IT energy at the UPS output puts the UPS losses on the overhead side of the ratio, where they belong. Meter placement moves PUE by whole points: an undercounted IT meter made the worked example's 1.30 facility report 1.357, so 'measured where?' is always the first question.",
    },
    {
      question: "WUE (water usage effectiveness) matters alongside PUE because:",
      options: [
        "Evaporative cooling can buy electrical efficiency by spending large volumes of water",
        "Water leaks are the leading cause of data centre outages in UK facilities",
        "Planning law caps data centre water use at a fixed litres-per-rack allowance",
        "Chilled-water systems consume large volumes of make-up water continuously through normal operation",
      ],
      answer: 0,
      explanation: "Evaporative and adiabatic systems trade water for compressor energy, and at facility scale the volumes are material enough to be a live planning issue in water-stressed regions. Optimising PUE at WUE's expense is easy and invisible unless both are reported together.",
    },
  ],

  "dc-compliance-check": [
    {
      question: "Under the renewed Climate Change Agreement scheme, the data centre sector's target is:",
      options: [
        "A fixed PUE of 1.3 or better for every participating facility by 2028",
        "Carbon neutrality across all participating facilities by the end of 2030",
        "A 25% reduction in absolute electricity consumption across all participating facilities by March 2033",
        "A 14.5% energy-efficiency improvement on a 2022 baseline by the end of 2030",
      ],
      answer: 3,
      explanation: "techUK holds the sector umbrella agreement, with target periods 7 to 9 running 2026 to 2030 and reduced CCL rates for compliant participants until 31 March 2033. The metric is intensity-based, so genuine overhead reduction counts and load-growth dilution should not.",
    },
    {
      question: "Running only one path of a contracted 2N UPS system to save its losses is:",
      options: [
        "A sensible summer measure, provided the second path can restart within an hour",
        "Not an energy measure at all: it breaches the availability product the customers are paying for",
        "Standard practice in facilities that have already enabled high-efficiency eco modes on their UPS fleets, since the risk profiles are equivalent",
        "Acceptable if the saving exceeds the value of any SLA penalty that results",
      ],
      answer: 1,
      explanation: "Contracted redundancy is the product, and no saving survives breaching it. The legitimate versions of the same idea preserve the redundancy level: rebalancing module loading, modular systems that keep active units well loaded, and properly risk-assessed eco modes.",
    },
    {
      question: "The September 2024 CNI designation and the 2024–2025 planning reforms mean that:",
      options: [
        "Data centres are now exempt from ESOS, SECR and Climate Change Levy obligations",
        "New facilities can only be built inside the designated AI Growth Zones",
        "Policy now favours data centre development, with scrutiny shifting to PUE, water and heat-reuse plans",
        "Local authorities gained significant new powers to refuse data centre planning applications specifically on energy-consumption grounds",
      ],
      answer: 2,
      explanation: "The state wants these buildings built: councils must consider the need for them, large projects can opt into the NSIP regime, and AI Growth Zones coordinate power and planning. The practical consequence is that applications now compete on energy performance, making efficiency skills growth skills.",
    },
    {
      question: "In grid-constrained regions, a kilowatt of facility overhead eliminated is often worth more than its energy saving because:",
      options: [
        "It frees contracted capacity for revenue-earning IT load under the existing connection",
        "The distribution network operator pays facilities directly for every kilowatt saved",
        "It reduces the facility's Climate Change Levy liability at the marginal rate",
        "Overhead kilowatts are billed at a premium tariff compared with IT kilowatts",
      ],
      answer: 0,
      explanation: "Connection queues make grid capacity the binding constraint on growth, so overhead reduction converts directly into sellable IT capacity, often worth many times the £1,752/yr a steady kilowatt costs in energy. Efficiency has become how facilities grow, not just how they save.",
    },
    {
      question: "A facility's rejected heat is hard to reuse today mainly because:",
      options: [
        "Heat networks are prohibited from taking heat from commercial sources under Ofgem's rules",
        "Air-cooled facilities produce low-grade heat, and a network must exist within economic reach",
        "The volumes involved are too small to interest any district heating operator",
        "Data centre heat is contaminated and requires treatment before it can be distributed",
      ],
      answer: 1,
      explanation: "Legacy facilities reject 30 to 40 °C air, which needs heat pumps to reach network temperatures, and the offtake network must be nearby. Liquid cooling changes the grade, regulated heat networks are professionalising the demand side, and zoning is mapping facilities as anchor sources. The direction is one-way.",
    },
  ],

  "dc-efficiency-check": [
    {
      question: "The correct sequence for cutting a legacy hall's cooling energy is:",
      options: [
        "Fix the airflow separation first, then slow the fans, then raise temperatures stepwise",
        "Raise the temperatures first to prove the concept, then invest in containment",
        "Replace the existing CRAH units with larger, more modern models, then optimise whatever loads remain afterwards",
        "Lower the chilled-water setpoint to create margin, then fit blanking plates",
      ],
      answer: 0,
      explanation: "Raising temperatures in a poorly separated hall creates hotspots at the worst-placed server and gets programmes cancelled. Blank and contain until the rack-inlet spread is tight, harvest the cube law on the fans, then walk the setpoints up with monitoring: each step makes the next one safe.",
    },
    {
      question: "Eight CRAH units totalling 32 kW of fan power are commissioned down to 70% speed after containment. The cube law puts the new fan power at about:",
      options: [
        "22.4 kW",
        "16.0 kW",
        "11.0 kW",
        "25.6 kW",
      ],
      answer: 2,
      explanation: "Power scales with speed cubed: 32 × 0.7³ = 32 × 0.343 ≈ 11 kW. A 30% speed reduction becomes a 66% power reduction, worth about £36,800 a year at 8,760 hours: the arithmetic that makes airflow remediation the sector's most reliable retrofit.",
    },
    {
      question: "Each degree of chilled-water setpoint raised is typically worth:",
      options: [
        "Nothing directly, though it improves the dehumidification performance of the coils",
        "Around 2 to 4% of chiller energy, plus extended free-cooling hours",
        "Around 15 to 20% of chiller energy, which is why one big step is preferred",
        "A fixed 1% of whole-facility energy regardless of the cooling design",
      ],
      answer: 1,
      explanation: "The compressor's lift shrinks by a degree, worth roughly 2 to 4% of chiller energy, and the same degree raises the outdoor temperature below which economisers can carry the load, which in the UK climate is often worth as much again. Setpoints and free cooling are one programme.",
    },
    {
      question: "An installed economiser that never runs is most often explained by:",
      options: [
        "Undersized dry coolers that cannot reject the hall's full heat load during the warmer months of the year",
        "UK weather being too humid for economiser operation most of the year",
        "A missing utility approval that most facilities never obtained",
        "Conservative changeover setpoints or an old lockout that nobody has revisited",
      ],
      answer: 3,
      explanation: "The kit is usually fine; the configuration is the fault. Changeover thresholds set cautiously at commissioning, or lockouts from some ancient nuisance trip, quietly hand the load back to the chillers. Trending achieved economiser hours against what the weather offered makes the gap visible.",
    },
    {
      question: "Rebalancing a UPS fleet so modules run at 30% load instead of 15% saves energy because:",
      options: [
        "Modules at higher load run cooler, reducing the UPS room's ventilation demand",
        "Fewer modules means lower maintenance costs, which the site rebates as energy",
        "Double-conversion efficiency rises steeply between those loadings (roughly 89% to 94%)",
        "The battery strings charge more efficiently when the fleet's load is concentrated onto fewer modules",
      ],
      answer: 2,
      explanation: "The efficiency curve is the whole story: carrying 300 kW at 89% loses 37 kW continuously; at 94% it loses 19 kW. The reconfiguration preserves the contracted redundancy and pays about £31,400 a year, plus the cooling energy behind every recovered watt.",
    },
  ],
};
