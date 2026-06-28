/**
 * Economic-analysis reference data — payback, time value of money, NPV/IRR,
 * annuity factors, TCO, financing and portfolio thinking. The core ideas: a
 * pound today is worth more than a pound tomorrow; judge projects by NPV/IRR and
 * whole-life cost, not simple payback alone; and price in risk.
 */

/**
 * Annuity present-value factors — the present value of £1/year for n years at
 * rate r, i.e. (1 − (1+r)^−n) / r. Keyed "rate%,years".
 */
export const ANNUITY: Record<string, number> = {
  "8,5": 3.993,
  "8,15": 8.559,
  "5,20": 12.462,
  "5,25": 14.094,
  "6,10": 7.36,
  "12,10": 5.65,
};

/** Present value of a future amount. */
export function presentValue(future: number, rate: number, years: number): number {
  return future / Math.pow(1 + rate, years);
}

/** Present value of a level annual cash flow, given an annuity factor. */
export function pvAnnuity(annual: number, annuityFactor: number): number {
  return annual * annuityFactor;
}

/** NPV from a level annual saving, its annuity factor, and the up-front cost. */
export function npv(annual: number, annuityFactor: number, cost: number): number {
  return annual * annuityFactor - cost;
}
