/**
 * CHP & cogeneration reference data — typical efficiencies, energy prices for
 * the spark spread, carbon factors, and the sizing rules of thumb. Every CHP
 * case answer derives from these constants (cases may override a price in their
 * brief — e.g. the spark-spread case uses a collapsed spread).
 */

/** Typical engine-CHP performance (fractions of fuel input). */
export const EFF = {
  elec: 0.38, // electrical efficiency (35–42% typical)
  thermal: 0.48, // heat recovery efficiency (40–50% typical)
  overall: 0.86, // elec + useful heat (80–90% good)
  powerToHeat: 0.8, // electrical ÷ heat output, gas engine ~0.8–1.0
};

/** Energy prices & running costs (£/kWh unless noted). */
export const PRICES = {
  elecImport: 0.2, // displaced by self-consumption (retail)
  elecExport: 0.05, // earned on export (wholesale) — 2–4× less than import
  gas: 0.06, // fuel gas
  boilerEff: 0.85, // boiler efficiency for valuing displaced heat
  maint: 0.012, // £/kWhe maintenance (O&M)
};

/** Carbon intensities (kg CO₂ per kWh). */
export const CARBON = {
  gas: 0.183, // natural gas
  grid: 0.2, // grid electricity, mid-2020s and falling
  grid2012: 0.5, // grid electricity ~2012, for context
};

/** Run-hours and sizing rules of thumb. */
export const SIZING = {
  hoursPerYear: 8760,
  goodRunHoursLow: 4500,
  goodRunHoursHigh: 8000,
};

/** Value of 1 kW of recovered heat displacing gas boiler heat, £/h. */
export function heatValuePerKW(): number {
  return PRICES.gas / PRICES.boilerEff;
}

/** Carbon intensity of CHP electricity before any heat credit (kg/kWh). */
export function chpElecCarbon(elecEff: number = EFF.elec): number {
  return CARBON.gas / elecEff;
}
