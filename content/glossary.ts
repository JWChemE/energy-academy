/**
 * The glossary — every term the platform expects a reader to know, defined in
 * one or two sentences, each linking to the lesson that teaches it properly.
 *
 * Keep definitions self-contained (they double as search snippets), UK voice,
 * and consistent with the owning lesson. Anchors are kebab-case and stable:
 * they are linkable from lessons as /glossary#anchor.
 */

export type GlossaryEntry = {
  term: string;
  /** Stable kebab-case anchor for deep links. */
  anchor: string;
  /** One to two sentences, self-contained. */
  definition: string;
  /** The lesson (or page) that teaches this term in depth. */
  href?: string;
};

export const GLOSSARY: GlossaryEntry[] = [
  // ---------- Fundamentals & bills ----------
  {
    term: "Kilowatt-hour (kWh)",
    anchor: "kilowatt-hour",
    definition:
      "The practical unit of energy on every bill: the energy used by a 1 kW appliance running for one hour. 1 kWh = 3.6 MJ.",
    href: "/courses/intro-to-energy-management/energy-units",
  },
  {
    term: "Power vs energy",
    anchor: "power-vs-energy",
    definition:
      "Power (kW) is the rate of energy use right now, like a speedometer; energy (kWh) is the total used over time, like an odometer. Energy = power × time.",
    href: "/courses/intro-to-energy-management/energy-vs-power",
  },
  {
    term: "Baseload",
    anchor: "baseload",
    definition:
      "The consumption that never switches off: what a site draws at 3 am on a Sunday. On the energy signature it is the intercept, and it runs for all 8,760 hours of the year.",
    href: "/courses/monitoring-and-targeting/energy-signatures",
  },
  {
    term: "Load profile",
    anchor: "load-profile",
    definition:
      "Demand plotted against time, typically from half-hourly meter data. Two sites with identical annual totals can have completely different profiles, and the profile is what reveals waste.",
    href: "/courses/monitoring-and-targeting/meter-data",
  },
  {
    term: "Half-hourly (HH) data",
    anchor: "half-hourly-data",
    definition:
      "Electricity consumption recorded every 30 minutes (17,520 readings a year), the raw material for load profiles, baseload analysis and exception reporting.",
    href: "/courses/monitoring-and-targeting/meter-data",
  },
  {
    term: "Maximum demand",
    anchor: "maximum-demand",
    definition:
      "A site's highest power draw, measured over half-hour windows. Larger supplies pay charges based on it, so flattening peaks saves money even when total kWh is unchanged.",
    href: "/courses/electrical-science/demand-and-power-factor",
  },
  {
    term: "Power factor",
    anchor: "power-factor",
    definition:
      "The fraction of apparent power (kVA) doing real work (kW). Motors and transformers drag it below 1; a poor power factor means extra current, kVA charges and wasted capacity.",
    href: "/courses/electrical-science/power-factor",
  },
  {
    term: "Reactive power (kVAr)",
    anchor: "reactive-power",
    definition:
      "The power that oscillates between source and load magnetising motors and transformers without doing useful work. It is the 'froth' that separates kVA from kW.",
    href: "/courses/electrical-science/power-factor",
  },
  {
    term: "Apparent power (kVA)",
    anchor: "apparent-power",
    definition:
      "The total power a supply must carry: real power (kW) and reactive power (kVAr) combined. Supply capacity and availability charges are priced in kVA.",
    href: "/courses/electrical-science/power-factor",
  },
  {
    term: "Power factor correction",
    anchor: "power-factor-correction",
    definition:
      "Capacitor banks (fixed or automatic) that supply the reactive power locally so the grid connection carries less kVA. Typical target is 0.95 or better.",
    href: "/courses/electrical-science/power-factor",
  },
  {
    term: "Three-phase supply",
    anchor: "three-phase-supply",
    definition:
      "The standard commercial supply: three alternating voltages staggered a third of a cycle apart, giving 400 V line-to-line and 230 V line-to-neutral from the same wires.",
    href: "/courses/electrical-science/three-phase-basics",
  },
  {
    term: "Harmonics",
    anchor: "harmonics",
    definition:
      "Distortion of the supply waveform caused by electronic loads such as variable-speed drives and LED drivers. In bulk they heat transformers and can breach network limits (G5/5).",
    href: "/courses/motors-and-drives/vfd-installation",
  },

  // ---------- Monitoring, targeting & verification ----------
  {
    term: "Monitoring and targeting (M&T)",
    anchor: "monitoring-and-targeting",
    definition:
      "The discipline of comparing actual consumption against what it should have been, so waste announces itself as an exception within days instead of hiding in the bills for years.",
    href: "/courses/monitoring-and-targeting/why-mt",
  },
  {
    term: "Degree days",
    anchor: "degree-days",
    definition:
      "A measure of how cold (heating degree days) or hot (cooling degree days) a period was, used to normalise energy consumption for weather so like is compared with like.",
    href: "/courses/monitoring-and-targeting/normalisation",
  },
  {
    term: "Energy signature",
    anchor: "energy-signature",
    definition:
      "Consumption plotted against degree days. The slope is the weather-dependent load (boiler, fabric, controls) and the intercept is the baseload; changes in either diagnose faults.",
    href: "/courses/monitoring-and-targeting/energy-signatures",
  },
  {
    term: "CUSUM",
    anchor: "cusum",
    definition:
      "Cumulative sum of the differences between actual and expected consumption. Small persistent savings or losses that are invisible month by month show as a steadily sloping CUSUM line.",
    href: "/courses/monitoring-and-targeting/establishing-baseline",
  },
  {
    term: "Baseline (energy)",
    anchor: "baseline",
    definition:
      "The model of what a site should consume given its drivers (weather, output, occupancy), fitted from historical data. Every savings claim is a comparison against a baseline.",
    href: "/courses/monitoring-and-targeting/establishing-baseline",
  },
  {
    term: "Exception report",
    anchor: "exception-report",
    definition:
      "A regular report flagging only the meters whose consumption deviates from expectation by more than a set threshold (commonly two standard deviations), so attention goes where the money is leaking.",
    href: "/courses/monitoring-and-targeting/exception-reporting",
  },
  {
    term: "Measurement and verification (M&V)",
    anchor: "measurement-and-verification",
    definition:
      "The formal discipline of proving a project's savings: define a baseline, adjust it for changed conditions, and compare against measured post-project consumption.",
    href: "/courses/measurement-and-verification",
  },
  {
    term: "IPMVP",
    anchor: "ipmvp",
    definition:
      "The International Performance Measurement and Verification Protocol: the standard framework (Options A to D) for proving energy savings, and the basis of most performance contracts.",
    href: "/courses/measurement-and-verification",
  },
  {
    term: "Energy intensity",
    anchor: "energy-intensity",
    definition:
      "Energy per unit of something useful: kWh per square metre for buildings, kWh per unit of output for industry. The currency of benchmarking.",
    href: "/courses/energy-audits/normalise-baseline",
  },

  // ---------- Audits & economics ----------
  {
    term: "Energy audit",
    anchor: "energy-audit",
    definition:
      "A structured investigation of where a site's energy goes and which improvements would pay, delivering a ranked list of costed opportunities. Comes in walk-through, detailed and investment-grade depths.",
    href: "/courses/energy-audits/why-audit",
  },
  {
    term: "Simple payback",
    anchor: "simple-payback",
    definition:
      "Project cost divided by annual saving: the number of years to get the money back. Good for screening; blind to everything that happens after payback, so poor for big decisions.",
    href: "/courses/economic-analysis/simple-payback-revisited",
  },
  {
    term: "Net present value (NPV)",
    anchor: "npv",
    definition:
      "The sum of a project's future cash flows, each discounted to today's value, minus its cost. Positive NPV means the project earns more than the discount rate and creates value.",
    href: "/courses/economic-analysis/npv-and-irr",
  },
  {
    term: "Internal rate of return (IRR)",
    anchor: "irr",
    definition:
      "The discount rate at which a project's NPV is exactly zero: its built-in rate of return. Accept when IRR beats the organisation's hurdle rate.",
    href: "/courses/economic-analysis/npv-and-irr",
  },
  {
    term: "Discount rate",
    anchor: "discount-rate",
    definition:
      "The return an organisation requires before tying up capital (also called the hurdle rate), used to convert future cash flows to present value. Typically 8 to 12% commercially.",
    href: "/courses/economic-analysis/time-value-of-money",
  },
  {
    term: "Total cost of ownership (TCO)",
    anchor: "total-cost-of-ownership",
    definition:
      "Every pound a piece of equipment costs over its life: capital, energy, maintenance, replacement, minus residual value. For energy-using plant, the energy term usually dwarfs the purchase price.",
    href: "/courses/economic-analysis/total-cost-of-ownership",
  },
  {
    term: "Energy Performance Contract (EPC / ESCO)",
    anchor: "energy-performance-contract",
    definition:
      "A contract where an Energy Services Company funds and installs efficiency measures and is repaid from the verified savings, often with a guaranteed minimum. Transfers risk in exchange for sharing the upside.",
    href: "/courses/economic-analysis/financing-options",
  },
  {
    term: "Marginal abatement cost",
    anchor: "marginal-abatement-cost",
    definition:
      "The cost of avoiding one tonne of CO₂e with a given measure, used to rank decarbonisation options from cheapest to most expensive per tonne saved.",
    href: "/courses/net-zero-roadmaps",
  },

  // ---------- UK regulation & carbon ----------
  {
    term: "ESOS",
    anchor: "esos",
    definition:
      "The Energy Savings Opportunity Scheme: mandatory four-yearly energy audits for large UK undertakings, overseen by the Environment Agency, covering at least 90% of consumption.",
    href: "/courses/uk-energy-regulation/esos",
  },
  {
    term: "SECR",
    anchor: "secr",
    definition:
      "Streamlined Energy and Carbon Reporting: the requirement for quoted and large UK companies to report energy use, emissions and efficiency actions in their annual accounts.",
    href: "/courses/uk-energy-regulation/secr",
  },
  {
    term: "Climate Change Levy (CCL)",
    anchor: "climate-change-levy",
    definition:
      "A tax on business energy, charged per kWh on electricity and gas. Energy-intensive sectors with a Climate Change Agreement receive large discounts in exchange for efficiency targets.",
    href: "/courses/uk-energy-regulation/climate-change-levy",
  },
  {
    term: "Climate Change Agreement (CCA)",
    anchor: "climate-change-agreement",
    definition:
      "A voluntary agreement giving energy-intensive operators a large CCL discount in exchange for meeting negotiated energy-efficiency targets, reported at facility level.",
    href: "/courses/uk-energy-regulation/climate-change-levy",
  },
  {
    term: "MEES",
    anchor: "mees",
    definition:
      "Minimum Energy Efficiency Standards: the rules setting the lowest EPC rating at which a property may legally be let, tightening over time for commercial buildings.",
    href: "/courses/uk-energy-regulation/epc-and-building-standards",
  },
  {
    term: "EPC (Energy Performance Certificate)",
    anchor: "energy-performance-certificate",
    definition:
      "The A-to-G rating of a building's modelled energy performance, required on construction, sale or let. Not to be confused with an Energy Performance Contract.",
    href: "/courses/uk-energy-regulation/epc-and-building-standards",
  },
  {
    term: "TM44 inspection",
    anchor: "tm44-inspection",
    definition:
      "The statutory periodic inspection of air-conditioning systems above 12 kW, producing a report on efficiency and improvement opportunities. A free source of audit findings.",
    href: "/courses/refrigeration-and-heat-pumps/split-systems",
  },
  {
    term: "F-gas regulations",
    anchor: "f-gas",
    definition:
      "The rules governing fluorinated refrigerants: leak-check frequencies scaled by CO₂-equivalent charge, certified personnel for work on circuits, record-keeping and the HFC phase-down.",
    href: "/courses/refrigeration-and-heat-pumps/maintenance-and-faults",
  },
  {
    term: "Carbon budgets",
    anchor: "carbon-budgets",
    definition:
      "The legally binding five-year caps on UK greenhouse-gas emissions under the Climate Change Act, stepping down toward net zero by 2050.",
    href: "/courses/uk-energy-regulation/carbon-budgets",
  },
  {
    term: "Scope 1, 2 and 3 emissions",
    anchor: "scopes",
    definition:
      "The GHG Protocol's categories: Scope 1 is fuel burned on site, Scope 2 is purchased electricity and heat, Scope 3 is everything upstream and downstream in the value chain.",
    href: "/courses/uk-energy-regulation/secr",
  },
  {
    term: "Emission (conversion) factor",
    anchor: "emission-factor",
    definition:
      "The kg of CO₂e per kWh (or per unit) used to convert energy into carbon, published annually by the UK government. Electricity's factor falls each year as the grid decarbonises.",
    href: "/reference/prices-and-carbon-factors",
  },
  {
    term: "Net zero",
    anchor: "net-zero",
    definition:
      "The state where remaining greenhouse-gas emissions are balanced by removals. Credible net-zero plans cut deeply first and offset only the genuine residual.",
    href: "/courses/renewable-energy/net-zero-pathway",
  },

  // ---------- Steam & boilers ----------
  {
    term: "Latent heat",
    anchor: "latent-heat",
    definition:
      "The large energy absorbed or released when a substance changes phase at constant temperature: 2,257 kJ/kg when water boils at atmospheric pressure. It is why steam carries so much heat.",
    href: "/courses/steam-and-condensate/steam-basics",
  },
  {
    term: "Sensible heat",
    anchor: "sensible-heat",
    definition:
      "Heat that changes a substance's temperature (about 4.2 kJ/kg·°C for water), as opposed to latent heat, which changes its phase.",
    href: "/courses/steam-and-condensate/steam-basics",
  },
  {
    term: "Saturated steam",
    anchor: "saturated-steam",
    definition:
      "Steam at exactly its boiling temperature for the pressure, the normal state for heating systems. Its temperature is fixed by pressure alone: 100 °C at atmospheric, about 170 °C at 7 bar g.",
    href: "/courses/steam-and-condensate/steam-basics",
  },
  {
    term: "Dryness fraction",
    anchor: "dryness-fraction",
    definition:
      "The proportion of a steam flow that is vapour rather than entrained water droplets. Wet steam (dryness below 1) delivers less heat and erodes valves and pipework.",
    href: "/courses/steam-and-condensate/steam-basics",
  },
  {
    term: "Flash steam",
    anchor: "flash-steam",
    definition:
      "The steam that instantly re-evaporates when hot condensate drops to a lower pressure. About 13% of condensate flashes from 7 bar g to atmospheric; capturing it in a flash vessel is a standard recovery.",
    href: "/courses/steam-and-condensate/steam-pressure",
  },
  {
    term: "Steam trap",
    anchor: "steam-trap",
    definition:
      "An automatic valve that discharges condensate and air while blocking live steam. The most numerous and most failure-prone component in a steam system; unmanaged populations drift to 10 to 20% failed.",
    href: "/courses/steam-and-condensate/trap-types",
  },
  {
    term: "Condensate return",
    anchor: "condensate-return",
    definition:
      "Piping hot condensate back to the boiler feed tank instead of draining it. It saves the water, the treatment chemicals and most of the sensible heat, and is usually the largest recovery on a steam system.",
    href: "/courses/steam-and-condensate/condensate-return",
  },
  {
    term: "Blowdown",
    anchor: "blowdown",
    definition:
      "The controlled discharge of concentrated boiler water to manage dissolved solids. Necessary, but every kilogram carries full boiler heat, so automatic TDS control and heat recovery pay quickly.",
    href: "/courses/steam-and-condensate/efficiency-assessment",
  },
  {
    term: "Waterhammer",
    anchor: "waterhammer",
    definition:
      "The violent impact of condensate slugs picked up by fast-moving steam and slammed into bends and fittings. A safety hazard as well as a symptom of poor steam-main drainage.",
    href: "/courses/steam-and-condensate/steam-distribution",
  },
  {
    term: "Boiler efficiency",
    anchor: "boiler-efficiency",
    definition:
      "Useful heat out divided by fuel energy in, typically 80 to 85% for a shell boiler and up to low-90s for a condensing boiler that actually condenses. Flue temperature and oxygen tell the story.",
    href: "/courses/boilers-and-fired-systems",
  },
  {
    term: "Excess air",
    anchor: "excess-air",
    definition:
      "Combustion air beyond the theoretical minimum. Some is needed for complete combustion; too much is heated and thrown up the flue. Burners are tuned to a few percent flue oxygen.",
    href: "/courses/boilers-and-fired-systems",
  },
  {
    term: "Economiser",
    anchor: "economiser",
    definition:
      "A heat exchanger in a boiler flue that recovers sensible heat from the exhaust gases to preheat feed or return water, typically saving around 5% of fuel.",
    href: "/courses/waste-heat-recovery/boiler-flue-recovery",
  },
  {
    term: "Condensing boiler",
    anchor: "condensing-boiler",
    definition:
      "A boiler that cools its flue below the dew point, recovering the latent heat in the water vapour. It only condenses when return water is below roughly 55 °C, so system design decides whether the premium pays.",
    href: "/courses/waste-heat-recovery/boiler-flue-recovery",
  },

  // ---------- Compressed air ----------
  {
    term: "Free air delivered (FAD)",
    anchor: "free-air-delivered",
    definition:
      "Compressor output expressed as the volume the air would occupy at atmospheric conditions: the honest basis for comparing machines and demands.",
    href: "/courses/compressed-air/pressure-flow",
  },
  {
    term: "Specific energy (compressed air)",
    anchor: "specific-energy-air",
    definition:
      "kWh of electricity per m³ of free air delivered, typically 0.10 to 0.13 at 7 bar g. The single best health metric a compressed air system has; trend it monthly.",
    href: "/courses/compressed-air/pressure-flow",
  },
  {
    term: "Artificial demand",
    anchor: "artificial-demand",
    definition:
      "The extra air consumed simply because the system pressure is higher than needed: every leak and unregulated use flows faster at higher pressure. One reason pressure reduction saves twice.",
    href: "/courses/compressed-air/pressure-flow",
  },
  {
    term: "Load/unload control",
    anchor: "load-unload",
    definition:
      "The commonest fixed-speed compressor control: full power when making air, and typically 25 to 35% of full power while unloaded making none. The gap a variable-speed drive eliminates.",
    href: "/courses/compressed-air/compressor-types",
  },

  // ---------- Refrigeration & heat pumps ----------
  {
    term: "Coefficient of performance (COP)",
    anchor: "cop",
    definition:
      "Useful heating or cooling delivered per unit of electricity consumed. A chiller absorbing 100 kW with 30 kW of compressor work has a COP of 3.3; it moves mostly with temperature lift.",
    href: "/courses/refrigeration-and-heat-pumps/cop-and-performance",
  },
  {
    term: "SCOP / SEER",
    anchor: "scop-seer",
    definition:
      "Seasonal efficiency metrics: COP or EER averaged across a year's real operating conditions rather than one flattering test point. The only fair basis for comparing equipment.",
    href: "/courses/refrigeration-and-heat-pumps/cop-and-performance",
  },
  {
    term: "Temperature lift",
    anchor: "temperature-lift",
    definition:
      "The gap between where a refrigeration cycle collects heat and where it rejects it. The smaller the lift, the higher the possible COP, which is why setpoints and fouling dominate cooling costs.",
    href: "/courses/refrigeration-and-heat-pumps/cop-and-performance",
  },
  {
    term: "Vapour-compression cycle",
    anchor: "vapour-compression-cycle",
    definition:
      "The four-stage loop behind nearly all refrigeration and heat pumps: evaporator absorbs heat, compressor lifts pressure, condenser rejects heat, expansion valve resets the loop.",
    href: "/courses/refrigeration-and-heat-pumps/vapour-compression-cycle",
  },
  {
    term: "Superheat",
    anchor: "superheat",
    definition:
      "How far the suction gas is above its saturation temperature at the evaporator outlet, typically targeted at 5 to 8 K. With subcooling, one of the two field measurements that diagnose charge and valve health.",
    href: "/courses/refrigeration-and-heat-pumps/superheat-subcooling",
  },
  {
    term: "Subcooling",
    anchor: "subcooling",
    definition:
      "How far the liquid leaving the condenser is below its saturation temperature, typically 5 to 10 K. High superheat with low subcooling is the classic signature of a refrigerant leak.",
    href: "/courses/refrigeration-and-heat-pumps/superheat-subcooling",
  },
  {
    term: "Heat pump",
    anchor: "heat-pump",
    definition:
      "A vapour-compression machine run for its hot side: it moves three to four units of environmental heat indoors per unit of electricity, which is why it is the keystone of heat decarbonisation.",
    href: "/courses/refrigeration-and-heat-pumps/reverse-cycle",
  },
  {
    term: "Ground-source heat pump (GSHP)",
    anchor: "gshp",
    definition:
      "A heat pump using the stable 8 to 12 °C ground as its source via boreholes or buried loops, buying a smaller, steadier temperature lift than air-source at the cost of groundworks.",
    href: "/courses/refrigeration-and-heat-pumps/ground-source-heat-pumps",
  },
  {
    term: "VRF (variable refrigerant flow)",
    anchor: "vrf",
    definition:
      "A building-scale split system where one outdoor unit modulates refrigerant to tens of indoor units. Heat-recovery VRF moves heat between zones that simultaneously heat and cool.",
    href: "/courses/refrigeration-and-heat-pumps/split-systems",
  },
  {
    term: "Free cooling",
    anchor: "free-cooling",
    definition:
      "Meeting a cooling load without running the compressor, using cool outside air or cooling-tower water directly. Valuable wherever loads persist through winter, such as server rooms.",
    href: "/courses/refrigeration-and-heat-pumps/water-cooled-systems",
  },
  {
    term: "Approach temperature",
    anchor: "approach-temperature",
    definition:
      "The gap between what a heat exchanger or cooling tower achieves and the theoretical limit (for a tower, the wet-bulb temperature). A widening approach is the standard sign of fouling.",
    href: "/courses/refrigeration-and-heat-pumps/water-cooled-systems",
  },
  {
    term: "Wet-bulb temperature",
    anchor: "wet-bulb-temperature",
    definition:
      "The lowest temperature achievable by evaporating water into the air, always at or below the ordinary (dry-bulb) reading. It sets the limit for cooling towers and evaporative cooling.",
    href: "/courses/refrigeration-and-heat-pumps/water-cooled-systems",
  },
  {
    term: "Absorption chiller",
    anchor: "absorption-chiller",
    definition:
      "A chiller driven by heat rather than electricity, letting surplus heat (for example from CHP in summer) produce cooling. The basis of trigeneration.",
    href: "/courses/chp-and-cogeneration/load-profile",
  },

  // ---------- Motors, drives & lighting ----------
  {
    term: "IE efficiency class",
    anchor: "ie-class",
    definition:
      "The international motor efficiency bands IE1 to IE5. UK ecodesign rules require at least IE3 for most new three-phase motors, and IE4 for 75 to 200 kW.",
    href: "/courses/motors-and-drives/efficiency-classes",
  },
  {
    term: "Variable-speed drive (VSD / VFD)",
    anchor: "vsd",
    definition:
      "Power electronics that vary a motor's speed to match its load. On centrifugal pumps and fans the affinity laws make the savings dramatic; on constant loads a drive only adds losses.",
    href: "/courses/motors-and-drives/why-vfds",
  },
  {
    term: "Affinity laws",
    anchor: "affinity-laws",
    definition:
      "For centrifugal pumps and fans: flow scales with speed, pressure with speed squared, and power with speed cubed. Running at 80% speed needs only about half the power.",
    href: "/courses/motors-and-drives/why-vfds",
  },
  {
    term: "Soft starter",
    anchor: "soft-starter",
    definition:
      "An electronic starter that ramps motor voltage to avoid the 6 to 8× inrush current of direct-on-line starting, easing both mechanical stress and voltage dips.",
    href: "/courses/motors-and-drives/demand-management",
  },
  {
    term: "Lux and lumens",
    anchor: "lux-and-lumens",
    definition:
      "Lumens measure the light a source emits; lux measures the light landing on a surface (1 lux = 1 lumen/m²). Task standards are set in lux: around 300 to 500 for office work.",
    href: "/courses/lighting/lux-and-efficacy",
  },
  {
    term: "Luminous efficacy",
    anchor: "luminous-efficacy",
    definition:
      "Light output per watt of electricity (lm/W). Incandescent managed 10 to 15; modern LED delivers 100 to 180, which is the entire arithmetic of the LED retrofit case.",
    href: "/courses/lighting/lux-and-efficacy",
  },
  {
    term: "Colour rendering index (CRI)",
    anchor: "cri",
    definition:
      "How faithfully a light source shows colours, on a 0 to 100 scale. Offices want CRI above 80; retail, galleries and clinical settings 90 or better.",
    href: "/courses/lighting/lamp-types",
  },
  {
    term: "Colour temperature",
    anchor: "colour-temperature",
    definition:
      "The warmth or coolness of white light in kelvin: 2,700 to 3,000 K reads warm, 4,000 K neutral office white, 5,000 K and above cool and industrial.",
    href: "/courses/lighting/lamp-types",
  },
  {
    term: "Daylight harvesting",
    anchor: "daylight-harvesting",
    definition:
      "Dimming electric lighting automatically as daylight contributes, holding the task illuminance constant. Perimeter zones typically save 30 to 60% of their lighting energy.",
    href: "/courses/lighting/daylight-harvesting",
  },
  {
    term: "Occupancy and vacancy sensing",
    anchor: "occupancy-sensing",
    definition:
      "Controls that switch lighting on presence. Vacancy (manual-on, auto-off) saves more than occupancy (auto-on) because lights only come on when someone actually wants them.",
    href: "/courses/lighting/occupancy-sensors",
  },

  // ---------- Building fabric ----------
  {
    term: "U-value",
    anchor: "u-value",
    definition:
      "How readily heat passes through a building element, in W/m²K; lower is better. A solid brick wall is around 2.0, a modern insulated wall 0.18 to 0.28.",
    href: "/courses/buildings-and-envelope/fabric-performance",
  },
  {
    term: "g-value",
    anchor: "g-value",
    definition:
      "The fraction of solar energy striking glazing that ends up inside (0 to 1). An asset on a winter south facade, a liability on an overheating west one.",
    href: "/courses/buildings-and-envelope/solar-gain",
  },
  {
    term: "Thermal bridge",
    anchor: "thermal-bridge",
    definition:
      "A localised path where heat bypasses the insulation through a conductive material or junction, quantified at junctions by the psi-value. Bridges waste heat and chill surfaces enough to grow mould.",
    href: "/courses/buildings-and-envelope/thermal-bridging",
  },
  {
    term: "Airtightness",
    anchor: "airtightness",
    definition:
      "How little uncontrolled air leaks through the fabric, measured by a blower-door test at 50 Pa. The principle is build tight, ventilate right: seal the random leaks, ventilate on purpose.",
    href: "/courses/buildings-and-envelope/airtightness",
  },
  {
    term: "MVHR",
    anchor: "mvhr",
    definition:
      "Mechanical ventilation with heat recovery: balanced ventilation that recovers 85 to 90% of the heat from outgoing stale air to pre-warm incoming fresh air.",
    href: "/courses/waste-heat-recovery/air-to-air-recovery",
  },
  {
    term: "Fabric first",
    anchor: "fabric-first",
    definition:
      "The design principle of reducing demand through the envelope before investing in efficient plant or renewables: a well-insulated building needs smaller everything downstream.",
    href: "/courses/buildings-and-envelope/fabric-performance",
  },
  {
    term: "Interstitial condensation",
    anchor: "interstitial-condensation",
    definition:
      "Moisture condensing inside a construction (rather than on its surface), typically where internal insulation leaves the original wall cold. It rots fabric unseen, so internal wall insulation demands a moisture assessment.",
    href: "/courses/buildings-and-envelope/insulation-retrofit",
  },
  {
    term: "Economic thickness",
    anchor: "economic-thickness",
    definition:
      "The insulation thickness at which adding more stops paying: where the marginal cost of insulation equals the marginal value of the heat it saves. Tabulated for pipework in BS 5422.",
    href: "/courses/insulation-systems/economic-thickness",
  },
  {
    term: "PAS 2035",
    anchor: "pas-2035",
    definition:
      "The UK framework for whole-house domestic retrofit: assess the building as a system, plan the sequence, and design sealing, insulation and ventilation together.",
    href: "/courses/buildings-and-envelope/retrofit-approach",
  },

  // ---------- Controls, commissioning & maintenance ----------
  {
    term: "Building management system (BMS)",
    anchor: "bms",
    definition:
      "The central system that monitors and controls a building's HVAC and services, logging thousands of points. Its trend data is where most control-related savings are first found.",
    href: "/courses/control-systems-and-bms/bms-architecture",
  },
  {
    term: "PID control",
    anchor: "pid-control",
    definition:
      "The standard control algorithm combining proportional, integral and derivative terms to hold a setpoint tightly without offset or overshoot. Well tuned, it saves energy over crude on-off switching.",
    href: "/courses/control-systems-and-bms/control-modes",
  },
  {
    term: "Dead band",
    anchor: "dead-band",
    definition:
      "A temperature range in which neither heating nor cooling acts (say 19 to 24 °C), guaranteeing the two can never run simultaneously. One of the cheapest control fixes in buildings.",
    href: "/courses/control-systems-and-bms/multi-loop-control",
  },
  {
    term: "Weather compensation",
    anchor: "weather-compensation",
    definition:
      "Resetting heating flow temperature against outside temperature so the system only makes water as hot as the day requires. Typically saves 10 to 20% of heating energy, and suits heat pumps especially.",
    href: "/courses/control-systems-and-bms/control-strategies",
  },
  {
    term: "Valve authority",
    anchor: "valve-authority",
    definition:
      "The share of a circuit's pressure drop taken by the control valve when fully open. Below about 0.3 the valve has too little leverage and the loop controls badly however well it is tuned.",
    href: "/courses/control-systems-and-bms/actuators-valves",
  },
  {
    term: "Commissioning",
    anchor: "commissioning",
    definition:
      "The structured verification that building systems are installed, configured and performing as designed. Skipping it bakes a 15 to 30% performance gap into the building for its whole life.",
    href: "/courses/commissioning/what-is-commissioning",
  },
  {
    term: "Retro-commissioning",
    anchor: "retro-commissioning",
    definition:
      "Applying commissioning discipline to an existing building to recover drifted performance. Typically finds 10 to 30% savings with paybacks of one to three years, mostly through tuning rather than capital.",
    href: "/courses/commissioning/retro-commissioning-existing",
  },
  {
    term: "Performance gap",
    anchor: "performance-gap",
    definition:
      "The difference between a building's designed and actual energy performance, caused by incomplete controls, uncalibrated sensors and unverified plant. Commissioning exists to close it.",
    href: "/courses/commissioning/what-is-commissioning",
  },
  {
    term: "Planned preventive maintenance (PPM)",
    anchor: "ppm",
    definition:
      "Servicing equipment on a schedule before failure, keeping it near design efficiency. The alternative, run-to-failure, lets efficiency drift downward unchecked between breakdowns.",
    href: "/courses/maintenance/planned-reactive",
  },
  {
    term: "Condition monitoring",
    anchor: "condition-monitoring",
    definition:
      "Watching equipment health through vibration, thermography, oil analysis and efficiency trends, and intervening only when the data shows deterioration. The same degradation that ends in breakdown wastes energy all the way there.",
    href: "/courses/maintenance/condition-monitoring",
  },
  {
    term: "Thermography",
    anchor: "thermography",
    definition:
      "Infrared imaging that makes temperature visible: missing insulation, failed steam traps, fouled coils, overloaded connections and air leakage paths all show up on camera.",
    href: "/courses/maintenance/condition-monitoring",
  },
  {
    term: "CMMS",
    anchor: "cmms",
    definition:
      "A computerised maintenance management system: the asset register, schedules, work orders and history in one tool, so maintenance stops slipping when people get busy.",
    href: "/courses/maintenance/maintenance-plan",
  },

  // ---------- Heat recovery, CHP & storage ----------
  {
    term: "Waste heat recovery",
    anchor: "waste-heat-recovery",
    definition:
      "Capturing heat a site already paid for and would otherwise reject, from flues, condensers, compressors and processes. A project works when source, sink, temperature and timing all line up.",
    href: "/courses/waste-heat-recovery/sources-and-grades",
  },
  {
    term: "Heat exchanger effectiveness",
    anchor: "heat-exchanger-effectiveness",
    definition:
      "The fraction of the theoretically available temperature change a heat exchanger actually delivers. Bought with surface area, and eroded over time by fouling.",
    href: "/courses/waste-heat-recovery/heat-exchangers",
  },
  {
    term: "Pinch analysis",
    anchor: "pinch-analysis",
    definition:
      "The systematic method for finding the minimum heating and cooling a process really needs by matching hot and cold streams, and for spotting where heat exchange is being wasted.",
    href: "/courses/pinch-analysis",
  },
  {
    term: "CHP (combined heat and power)",
    anchor: "chp",
    definition:
      "Generating electricity on site and using the by-product heat, reaching 80 to 90% overall efficiency. It only works sized and run against the heat demand; dumped heat destroys the case.",
    href: "/courses/chp-and-cogeneration/how-chp-works",
  },
  {
    term: "Spark spread",
    anchor: "spark-spread",
    definition:
      "The gap between the value of electricity displaced and the cost of the gas burned to generate it. The single number that most often decides whether a CHP unit should run.",
    href: "/courses/chp-and-cogeneration/efficiency-metrics",
  },
  {
    term: "Trigeneration",
    anchor: "trigeneration",
    definition:
      "CHP plus an absorption chiller, so the heat drives cooling in summer. It gives a heat-led unit a year-round heat sink and dramatically raises its run hours.",
    href: "/courses/chp-and-cogeneration/load-profile",
  },
  {
    term: "Thermal energy storage",
    anchor: "thermal-energy-storage",
    definition:
      "Storing heat or coolth to move consumption in time: charge when energy is cheap or abundant, discharge when it is expensive. Worthless on a flat tariff; powerful on a wide peak/off-peak spread.",
    href: "/courses/thermal-energy-storage/sensible-latent",
  },
  {
    term: "Stratification",
    anchor: "stratification",
    definition:
      "Keeping a thermal store's hot water layered at the top and cold at the bottom rather than mixed. A stratified store holds more usable energy and feeds heat sources the cold return they need.",
    href: "/courses/thermal-energy-storage/water-tanks",
  },
  {
    term: "Phase-change material (PCM)",
    anchor: "pcm",
    definition:
      "A storage material that banks energy by melting and releases it by freezing at a chosen temperature, storing several times more per litre than water across the same band.",
    href: "/courses/thermal-energy-storage/phase-change",
  },
  {
    term: "Load shifting",
    anchor: "load-shifting",
    definition:
      "Moving consumption from expensive peak hours to cheap off-peak ones, usually via storage. It cuts both the energy price paid and the peak-demand charges.",
    href: "/courses/thermal-energy-storage/load-shifting",
  },
  {
    term: "Peak shaving",
    anchor: "peak-shaving",
    definition:
      "Reducing a site's maximum demand, by staggering loads or discharging storage at the peak, to cut capacity and maximum-demand charges and free connection headroom.",
    href: "/courses/thermal-energy-storage/load-shifting",
  },

  // ---------- Renewables & grid ----------
  {
    term: "Kilowatt-peak (kWp)",
    anchor: "kwp",
    definition:
      "A PV array's rated output under standard test conditions. UK systems yield roughly 800 to 1,000 kWh per kWp per year when well oriented.",
    href: "/courses/renewable-energy/pv-sizing",
  },
  {
    term: "Self-consumption",
    anchor: "self-consumption",
    definition:
      "The fraction of on-site generation used on site rather than exported. Self-consumed power displaces retail-price electricity and is worth two to four times the export rate, so it drives PV sizing.",
    href: "/courses/renewable-energy/pv-sizing",
  },
  {
    term: "Smart Export Guarantee (SEG)",
    anchor: "seg",
    definition:
      "The UK scheme under which suppliers pay small generators for electricity exported to the grid. Rates are well below retail prices, which is why self-consumption wins.",
    href: "/courses/renewable-energy/pv-economics",
  },
  {
    term: "G98 / G99",
    anchor: "g98-g99",
    definition:
      "The UK engineering rules for connecting generation in parallel with the grid: G98 is the notify route for small installs, G99 the prior-approval route for larger ones, both requiring protective disconnection.",
    href: "/courses/renewable-energy/grid-codes",
  },
  {
    term: "Anti-islanding",
    anchor: "anti-islanding",
    definition:
      "The mandatory protection that disconnects a grid-tied generator within milliseconds if the grid fails, so it cannot energise lines engineers believe are dead.",
    href: "/courses/renewable-energy/grid-codes",
  },
  {
    term: "Round-trip efficiency",
    anchor: "round-trip-efficiency",
    definition:
      "Energy out of a store divided by energy in: 85 to 95% for lithium-ion batteries. The loss is part of every storage business case.",
    href: "/courses/renewable-energy/battery-storage",
  },
  {
    term: "Microgrid",
    anchor: "microgrid",
    definition:
      "A local network of generation, storage and loads that balances itself and can run connected to the grid or islanded from it, keeping critical loads alive through outages.",
    href: "/courses/renewable-energy/microgrid",
  },
  {
    term: "Virtual power plant (VPP)",
    anchor: "vpp",
    definition:
      "Many distributed batteries, generators and flexible loads aggregated and controlled as one plant, selling balancing services to the grid and sharing the revenue with their owners.",
    href: "/courses/renewable-energy/microgrid",
  },
  {
    term: "Demand response",
    anchor: "demand-response",
    definition:
      "Shifting or shedding load in response to grid signals or prices: reducing demand at system peaks and soaking up surplus renewable generation, increasingly rewarded financially.",
    href: "/courses/renewable-energy/microgrid",
  },
  {
    term: "LCOE",
    anchor: "lcoe",
    definition:
      "Levelised cost of energy: a generator's lifetime costs divided by its lifetime output, giving a per-kWh figure comparable across technologies.",
    href: "/courses/renewable-energy/pv-economics",
  },

  // ---------- Management & strategy ----------
  {
    term: "ISO 50001",
    anchor: "iso-50001",
    definition:
      "The international standard for energy management systems, built on the Plan-Do-Check-Act cycle: policy, baseline, objectives, implementation, monitoring and management review.",
    href: "/courses/energy-strategy-iso-50001",
  },
  {
    term: "Significant energy user (SEU)",
    anchor: "seu",
    definition:
      "The facilities, systems or equipment that account for a substantial share of a site's consumption, where ISO 50001 focuses monitoring, controls and improvement effort.",
    href: "/courses/energy-strategy-iso-50001",
  },
  {
    term: "Plan-Do-Check-Act (PDCA)",
    anchor: "pdca",
    definition:
      "The continual-improvement loop at the heart of energy management: plan the improvement, do it, check whether it worked, act on the lessons, and go round again.",
    href: "/courses/intro-to-energy-management/the-energy-management-cycle",
  },
];
