/**
 * Compressed-air reference data & helpers — specific power (how much
 * electricity a m³ of air costs), unloaded running, the pressure rule of thumb,
 * heat recovery and prices. Every air case answer derives from these constants.
 */

export const PRICES = {
  elec: 0.2, // £/kWh
  gas: 0.045, // £/kWh (for valuing recovered heat that displaces gas)
  boilerEff: 0.8,
};

/**
 * Specific power: roughly 6 kW absorbed per m³/min of free air delivered at
 * ~7 bar (≈ 0.10 kWh per m³). The handy figure for costing air or leaks.
 */
export const SPECIFIC_POWER = 6; // kW per (m³/min) at ~7 bar

/** Electrical power to generate a given free-air flow. */
export function powerForFlow(flow_m3min: number): number {
  return flow_m3min * SPECIFIC_POWER;
}

/** A load/unload screw compressor still draws ~30% of full power when unloaded. */
export const UNLOADED_FRACTION = 0.3;

/** Energy changes by roughly 7% for every 1 bar change in system pressure. */
export const PRESSURE_PCT_PER_BAR = 7;

/** Around 90% of a compressor's electrical input is recoverable as heat. */
export const HEAT_RECOVERABLE_FRACTION = 0.9;

/** Cost of 1 kW of electrical load over a year of given hours, £. */
export function elecCostPerKWYear(hours: number): number {
  return PRICES.elec * hours;
}

/** Value of 1 kW of recovered heat for a year, displacing gas heating, £. */
export function heatValuePerKWYear(hours: number): number {
  return (PRICES.gas / PRICES.boilerEff) * hours;
}

export const TYPICAL_LEAK_LOAD = "20–30% of compressor output on an unmanaged site";
