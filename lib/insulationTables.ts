/**
 * Insulation reference data — heat-loss constants, bare-pipe losses, material
 * conductivities, the economic-thickness idea, surface-temperature safety, and
 * prices. Focused on mechanical/industrial insulation (pipes, valves, vessels).
 * The core relationship is Q = U·A·ΔT (surfaces) or a per-metre loss (pipes);
 * lagging cuts it by ~90%.
 */

export const PRICES = {
  heat: 0.06, // £/kWh of displaced gas/steam
  elec: 0.2, // £/kWh
  coolingCop: 3, // electrical COP of cooling plant (for cold-pipe gains)
};

/** Lagging typically cuts a bare surface's heat loss by ~90%. */
export const LAGGING_REDUCTION = 0.9;

/** Safe-touch surface temperature for accessible hot surfaces (°C). */
export const SAFE_TOUCH = 50;

/** Thermal conductivity λ (W/m·K) of common insulants. */
export const LAMBDA = {
  aerogel: 0.015,
  pir: 0.02, // PIR / phenolic
  eps: 0.034,
  mineralWool: 0.04,
  calciumSilicate: 0.06, // high-temperature
};

/** Thickness (m) of a material needed to reach a target thermal resistance. */
export function thicknessForR(lambda: number, R: number): number {
  return lambda * R;
}

/** Thermal resistance (m²K/W) given a thickness and conductivity. */
export function resistance(thickness_m: number, lambda: number): number {
  return thickness_m / lambda;
}

/** Surface heat loss (kW) from U, area and ΔT. */
export function surfaceLossKw(u: number, area: number, dT: number): number {
  return (u * area * dT) / 1000;
}
