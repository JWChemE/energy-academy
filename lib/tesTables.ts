/**
 * Thermal-energy-storage reference data — sensible/latent capacity, load-shift
 * arbitrage value, stratification, seasonal scale and prices. Storage stores
 * energy, not money: it only pays when the value of shifting energy in time
 * exceeds the cost of the store and its losses.
 */

export const PRICES = {
  peakElec: 0.25, // £/kWh on-peak
  offpeakElec: 0.08, // £/kWh off-peak
  flatElec: 0.15, // £/kWh flat tariff
  heat: 0.06, // £/kWh displaced gas heat
  demandPerKwMonth: 5, // £/kW/month demand (capacity) charge
};

export const WATER_C = 4.18; // kJ/kg·K — specific heat of water
export const ICE_LATENT = 334; // kJ/kg — latent heat of fusion of ice

/** Sensible storage capacity (kWh) for a mass of water over a temperature band. */
export function sensibleKwh(mass_kg: number, dT: number): number {
  return (mass_kg * WATER_C * dT) / 3600;
}

/** Latent storage capacity (kWh) for a mass at a given latent heat (kJ/kg). */
export function latentKwh(mass_kg: number, latent_kJkg: number): number {
  return (mass_kg * latent_kJkg) / 3600;
}
