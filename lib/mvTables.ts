/**
 * Measurement & Verification reference data — the savings equation, baselines,
 * normalisation, IPMVP options and the common pitfalls. The honest core of M&V:
 * a saving is the energy you AVOIDED using, measured against an adjusted baseline
 * under the same conditions — never raw year-on-year. The cardinal error is
 * overstatement.
 */

export const PRICES = {
  elec: 0.2, // £/kWh
  heat: 0.06, // £/kWh displaced gas heat
};

/** Saving = adjusted baseline − actual reporting-period energy. */
export function saving(adjustedBaseline: number, actual: number): number {
  return adjustedBaseline - actual;
}

/** IPMVP options, for quick reference. */
export const IPMVP = {
  A: "Retrofit isolation, key-parameter measurement (measure one, estimate the rest)",
  B: "Retrofit isolation, all-parameter measurement (fully metered)",
  C: "Whole facility — utility meters + regression; needs savings ≳10% to show above the noise",
  D: "Calibrated simulation — for new build or no usable baseline",
};
