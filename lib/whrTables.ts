/**
 * Waste-heat-recovery reference data — the heat-rate constants, heat-exchanger
 * effectiveness, the supply/demand matching rules, and prices. Every case answer
 * derives from these. The core relationship is Q = ṁ·cp·ΔT (or 1.2·V·ΔT for
 * air); a recovery project only earns when supply, demand, temperature AND
 * timing all align.
 */

export const PRICES = {
  heat: 0.06, // £/kWh of displaced gas/steam heat
  elec: 0.2, // £/kWh
};

export const CP_WATER = 4.18; // kJ/kg·K — Q(kW) = ṁ(kg/s) × 4.18 × ΔT
export const AIR_FACTOR = 1.2; // kW per (m³/s · K) — Q(kW) = 1.2 × V(m³/s) × ΔT
export const LATENT_STEAM = 2200; // kJ/kg — latent heat of low-pressure steam (flash recovery)

/** A flue-gas economiser / condensing retrofit recovers roughly this share of fuel input. */
export const CONDENSING_RECOVERY = 0.1; // ~10%

/** Heat rate for a water stream (kW). */
export function waterHeatKw(mdot_kgs: number, dT: number): number {
  return mdot_kgs * CP_WATER * dT;
}

/** Heat rate for an air stream (kW). */
export function airHeatKw(v_m3s: number, dT: number): number {
  return AIR_FACTOR * v_m3s * dT;
}

/** Heat-exchanger effectiveness: fraction of the maximum possible temperature rise achieved. */
export function effectiveness(actualRise: number, maxRise: number): number {
  return actualRise / maxRise;
}
