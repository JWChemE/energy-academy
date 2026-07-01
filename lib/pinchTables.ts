/**
 * Pinch analysis reference data — the problem table method, the golden rules,
 * the CP feasibility rule, the minimum-units target and typical utility
 * prices. Every hot/cold utility figure in the capstone cases comes from this
 * same temperature-interval cascade method, just applied to different stream
 * data each time.
 */

export const PRICES = {
  hotUtility: 0.06, // £/kWh, e.g. gas-fired heating
  coldUtility: 0.01, // £/kWh, e.g. cooling water
};

export const CROSS_PINCH_MULTIPLIER = 2; // every kW crossing the pinch costs 2 kW of extra utility

export const TYPICAL_DTMIN = "10-20 °C for liquids/gases; process-specific"; // typical industrial range

/** Minimum number of units for a region: N = S + L - 1 (L = independent loops, usually 0). */
export function minUnits(streamsAndUtilities: number, loops = 0): number {
  return streamsAndUtilities + loops - 1;
}

/** Heat load for a stream: CP (kW/°C) x |supply - target| (°C). */
export function heatLoad(cp: number, supplyC: number, targetC: number): number {
  return cp * Math.abs(supplyC - targetC);
}
