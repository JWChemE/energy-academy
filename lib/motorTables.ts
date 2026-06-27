/**
 * Motors & drives reference data & helpers — efficiency by class and load, the
 * affinity laws, power-factor trig, belt-drive losses and voltage imbalance.
 * Every motor case answer is derived from these constants.
 */

export const PRICES = {
  elec: 0.2, // £/kWh
};

/** Representative full-load efficiency by IE class (medium motor, ~22–37 kW). */
export const IE_EFFICIENCY: { class: string; eff: number }[] = [
  { class: "IE1 (standard)", eff: 0.89 },
  { class: "IE2 (high)", eff: 0.91 },
  { class: "IE3 (premium)", eff: 0.93 },
  { class: "IE4 (super premium)", eff: 0.95 },
];

/** How a standard induction motor's efficiency falls at part load. */
export const EFF_VS_LOAD: { loadPct: number; eff: number }[] = [
  { loadPct: 100, eff: 0.93 },
  { loadPct: 75, eff: 0.93 },
  { loadPct: 50, eff: 0.91 },
  { loadPct: 40, eff: 0.89 },
  { loadPct: 30, eff: 0.84 },
  { loadPct: 25, eff: 0.8 },
  { loadPct: 20, eff: 0.74 },
];

/** Belt-drive transmission efficiency. */
export const BELT_EFF: { type: string; eff: number }[] = [
  { type: "Worn V-belt", eff: 0.93 },
  { type: "Good V-belt", eff: 0.95 },
  { type: "Cogged V-belt", eff: 0.97 },
  { type: "Synchronous (toothed) belt", eff: 0.98 },
];

/** Fan/pump power scales with the cube of speed (affinity laws). */
export function powerAtSpeed(powerNow: number, speedFraction: number): number {
  return powerNow * speedFraction ** 3;
}

export const AFFINITY: { speedPct: number; powerPct: number }[] = [
  { speedPct: 100, powerPct: 100 },
  { speedPct: 90, powerPct: 73 },
  { speedPct: 80, powerPct: 51 },
  { speedPct: 70, powerPct: 34 },
  { speedPct: 60, powerPct: 22 },
];

// ---- power factor ----
/** tan φ for a given power factor (cos φ). */
export function pfTan(pf: number): number {
  return Math.tan(Math.acos(pf));
}
/** Apparent power (kVA) from real power and power factor. */
export function kvaFromKw(kw: number, pf: number): number {
  return kw / pf;
}
/** Capacitor kVAr needed to move from pf1 up to pf2. */
export function pfcKvar(kw: number, pf1: number, pf2: number): number {
  return kw * (pfTan(pf1) - pfTan(pf2));
}

/** A small power-factor → tan φ table for the reference panel. */
export const PF_TABLE: { pf: number; tan: number }[] = [0.7, 0.78, 0.85, 0.9, 0.95, 0.98].map(
  (pf) => ({ pf, tan: Math.round(pfTan(pf) * 1000) / 1000 })
);

// ---- voltage imbalance ----
/** Voltage imbalance %: max deviation from the average ÷ average × 100. */
export function voltageImbalance(volts: number[]): number {
  const avg = volts.reduce((a, b) => a + b, 0) / volts.length;
  const maxDev = Math.max(...volts.map((v) => Math.abs(v - avg)));
  return (maxDev / avg) * 100;
}
/** Rule of thumb: current imbalance ≈ 6 × voltage imbalance %. */
export const CURRENT_IMBALANCE_FACTOR = 6;

/** Cost of 1 kW of electrical load over a year of given hours, £. */
export function elecCostPerKWYear(hours: number): number {
  return PRICES.elec * hours;
}
