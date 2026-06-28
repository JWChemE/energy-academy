/**
 * Building-envelope reference data — typical U-values, the degree-day annual
 * heat-loss factor, the airtightness/ventilation constants, glazing U- and
 * g-values, and energy prices. Every envelope case answer derives from these.
 *
 * The core chain: a fabric element loses (U × A) watts per kelvin; over a year
 * that is (U × A) × ANNUAL_FACTOR kWh of heat; valued at the delivered-heat cost
 * (gas ÷ boiler efficiency). Reducing U × A saves proportionally.
 */

export const HDD = 2200; // heating degree-days per year (°C·days), UK typical

/**
 * Annual heat loss (kWh) per 1 W/K of fabric loss = HDD × 24 ÷ 1000.
 * 2,200 × 24 ÷ 1000 = 52.8 kWh per W/K per year.
 */
export const ANNUAL_FACTOR = (HDD * 24) / 1000; // 52.8

export const PRICES = {
  gas: 0.06, // £/kWh fuel
  boilerEff: 0.85, // boiler efficiency → delivered-heat cost = gas ÷ boilerEff
  elec: 0.2, // £/kWh (for cooling/overheating)
  coolingCop: 3, // electrical COP of cooling plant
};

/** Delivered-heat cost: gas burned to put 1 kWh of heat into the building. */
export function heatCostPerKwh(): number {
  return PRICES.gas / PRICES.boilerEff; // ≈ £0.0706/kWh
}

/** £/yr of heating for each 1 W/K of fabric heat loss. */
export function annualCostPerWPerK(): number {
  return ANNUAL_FACTOR * heatCostPerKwh(); // ≈ £3.73
}

/** Typical U-values (W/m²K). */
export const U_VALUES = {
  solidBrickWall: 2.0,
  uninsulatedCavity: 1.5,
  insulatedWall: 0.28,
  uninsulatedLoft: 2.3,
  insulatedLoft: 0.15,
  singleGlazing: 5.0,
  doubleGlazing: 1.4,
  tripleGlazing: 0.9,
};

/** Glazing solar heat gain coefficient (g-value). */
export const G_VALUES = {
  clearDouble: 0.7,
  solarControl: 0.35,
  reflective: 0.25,
};

/** Airtightness / ventilation constants. */
export const AIR = {
  volHeatCap: 0.33, // Wh per m³ per K — heat to warm one air change
  ach50Divisor: 20, // in-use infiltration ACH ≈ blower-door ACH50 ÷ 20
  mvhrRecovery: 0.88, // MVHR recovers ~85–90% of ventilation heat
};

/** Ventilation/infiltration heat-loss coefficient (W/K) for an air-change rate. */
export function ventLossCoeff(ach: number, volumeM3: number): number {
  return AIR.volHeatCap * ach * volumeM3;
}
