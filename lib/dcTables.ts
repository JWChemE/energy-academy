/**
 * Data centre reference data — shared by the DC diagnostics, the facility
 * audit capstone and the sector lessons so numbers can't drift.
 */

export const PRICES = {
  elec: 0.2, // £/kWh
};

export const HOURS_YEAR = 8760;

/**
 * Typical double-conversion UPS efficiency by load fraction (older fleet).
 * The curve is the point: modules loafing at low load waste percent after
 * percent, which is what 2N redundancy quietly encourages.
 */
export const UPS_EFFICIENCY: { loadPct: number; eff: number }[] = [
  { loadPct: 15, eff: 0.89 },
  { loadPct: 30, eff: 0.94 },
  { loadPct: 50, eff: 0.955 },
  { loadPct: 75, eff: 0.96 },
];

/** Fan affinity: power scales with the cube of speed. */
export const FAN_CUBE_NOTE = "P2 = P1 × (N2/N1)³";
