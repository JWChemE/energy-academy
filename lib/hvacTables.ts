/**
 * HVAC reference data & helpers — the figures an HVAC engineer keeps to hand.
 * Air-side heat, the fan/pump affinity laws, chiller COP, ventilation rates and
 * energy prices. Every HVAC case answer is derived from these constants.
 */

// Air-side: Q (kW) = 1.2 × volumetric flow (m³/s) × ΔT (K).
export const AIR = {
  density: 1.2, // kg/m³
  cp: 1.005, // kJ/kg·K
  volHeat: 1.2, // kJ/m³·K  (ρ·cp, the handy "1.2 rule")
};

export const PRICES = {
  elec: 0.2, // £/kWh (fans, pumps, chillers)
  gas: 0.045, // £/kWh (heating fuel)
  boilerEff: 0.8, // heating delivered per unit fuel
};

/** Air-side load for a flow and temperature difference, kW. */
export function airLoadKW(flow_m3s: number, dT: number): number {
  return AIR.volHeat * flow_m3s * dT;
}

/** Fan/pump power scales with the cube of speed (affinity laws). */
export function powerAtSpeed(powerNow: number, speedFraction: number): number {
  return powerNow * speedFraction ** 3;
}

/** Affinity-law table: speed % → power % of full speed. */
export const AFFINITY: { speedPct: number; powerPct: number }[] = [
  { speedPct: 100, powerPct: 100 },
  { speedPct: 90, powerPct: 73 },
  { speedPct: 80, powerPct: 51 },
  { speedPct: 70, powerPct: 34 },
  { speedPct: 60, powerPct: 22 },
  { speedPct: 50, powerPct: 13 },
];

/** Chiller electrical input from cooling duty and COP. */
export function elecFromCooling(coolingKW: number, cop: number): number {
  return coolingKW / cop;
}

export const TYPICAL_COP: { type: string; cop: string }[] = [
  { type: "Air-cooled chiller", cop: "2.5 – 3.5" },
  { type: "Water-cooled chiller", cop: "5.0 – 6.5" },
  { type: "Well-maintained, good condenser", cop: "≈ design" },
];

export const VENTILATION = {
  perPerson_Ls: 10, // L/s per person (typical office)
  co2Outdoor: 400, // ppm
  co2Target: 1000, // ppm — above this, under-ventilated
};

/** Cost of 1 kW of delivered heat for a year of given hours, £ (gas-fired). */
export function heatCostPerKWYear(hours: number): number {
  return (PRICES.gas / PRICES.boilerEff) * hours;
}

/** Cost of 1 kW of electrical load for a year of given hours, £. */
export function elecCostPerKWYear(hours: number): number {
  return PRICES.elec * hours;
}
