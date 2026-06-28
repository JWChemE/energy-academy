/**
 * Renewable-energy reference data — PV yield, self-consumption value, shading,
 * battery, the wind cube law and prices. The central lesson: self-consumed power
 * is worth far more than exported power, so renewables are sized and operated to
 * the building's own demand.
 */

export const PRICES = {
  retail: 0.25, // £/kWh displaced by self-consumption
  export: 0.1, // £/kWh earned on export
};

export const SPECIFIC_YIELD = 900; // kWh/kWp/yr, well-oriented UK system
export const COST_PER_KWP = 900; // £/kWp installed (commercial)
export const BATTERY_RTE = 0.9; // round-trip efficiency, lithium-ion
export const NORTH_FACTOR = 0.7; // a north roof yields ~70% of a south one
export const EASTWEST_FACTOR = 0.85; // east-west loses ~15% vs south

/** Annual PV energy (kWh) from capacity and specific yield. */
export function pvAnnual(kwp: number, yield_ = SPECIFIC_YIELD): number {
  return kwp * yield_;
}

/** Annual value of PV given a self-consumption fraction. */
export function pvValue(energyKwh: number, selfConsumeFraction: number): number {
  return (
    selfConsumeFraction * energyKwh * PRICES.retail +
    (1 - selfConsumeFraction) * energyKwh * PRICES.export
  );
}
