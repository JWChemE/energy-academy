/**
 * Food manufacturing reference data — shared by the food diagnostics, the
 * factory audit capstone and the sector lessons so numbers can't drift.
 */

export const PRICES = {
  elec: 0.2, // £/kWh
  gas: 0.06, // £/kWh
};

/** Water heating basics used across washdown/CIP calculations. */
export const WATER = {
  cp: 4.18, // kJ/kg·K
  kgPerM3: 1000,
};

/**
 * Freezing a tonne of typical high-moisture food (≈70% water), 20 °C → −18 °C:
 * sensible above freezing + latent + sensible below ≈ 332 kJ/kg ≈ 92 kWh/t of
 * heat to remove. Verified by script against cp 3.2 / latent 0.7 × 334 /
 * cp 1.8 figures.
 */
export const FREEZING = {
  heatKwhPerTonne: 92,
  /** Typical low-temperature plant COP at −30 °C evaporation. */
  copLowTemp: 1.5,
};
