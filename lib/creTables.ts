/**
 * Commercial real estate reference data — shared by the CRE diagnostics,
 * the office audit capstone and the sector lessons so numbers can't drift.
 *
 * Benchmark source: Better Buildings Partnership, Real Estate Environmental
 * Benchmarks 2024 (2022/23–2023/24 data). Whole-building figures for offices,
 * kWh/m²/year on Gross Internal Area (total energy) — typical practice is the
 * 50th percentile, good practice the 25th.
 */

export const PRICES = {
  elec: 0.2, // £/kWh
  gas: 0.06, // £/kWh
};

/** REEB 2024 whole-building office benchmarks, kWh(total)/m² GIA/year. */
export const REEB_OFFICES = {
  airConditioned: { typical: 163, good: 119 },
  naturallyVentilated: { typical: 119, good: 88 },
};

/** A 168-hour week, split for out-of-hours arithmetic. */
export const WEEK = {
  totalHours: 168,
  /** A typical multi-let office: 07:00–20:00 weekdays. */
  occupiedHours: 65,
  unoccupiedHours: 103,
};

/** Hours per year the building is unoccupied at 65 occupied h/week. */
export const UNOCCUPIED_HOURS_YEAR = WEEK.unoccupiedHours * 52; // 5,356
