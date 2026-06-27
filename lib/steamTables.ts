/**
 * Steam & condensate reference data — the figures a real engineer has on hand.
 *
 * These tables are shown to the learner in the Calculate step (data is "on
 * hand"); the *method* for using them is hidden behind the first hint. All
 * case answers are derived from these same numbers so the worked solutions are
 * internally consistent.
 */

export interface SteamRow {
  pBarG: number; // gauge pressure, bar
  tSat: number; // saturation temperature, °C
  hf: number; // sat. water enthalpy, kJ/kg
  hfg: number; // latent heat (enthalpy of evaporation), kJ/kg
  hg: number; // sat. steam enthalpy, kJ/kg
}

/** Saturated steam table (approx., gauge pressure). */
export const SAT_STEAM: SteamRow[] = [
  { pBarG: 0, tSat: 100.0, hf: 419, hfg: 2257, hg: 2676 },
  { pBarG: 1, tSat: 120.2, hf: 505, hfg: 2201, hg: 2706 },
  { pBarG: 2, tSat: 133.5, hf: 561, hfg: 2163, hg: 2725 },
  { pBarG: 3, tSat: 143.6, hf: 605, hfg: 2133, hg: 2738 },
  { pBarG: 4, tSat: 151.8, hf: 640, hfg: 2108, hg: 2748 },
  { pBarG: 5, tSat: 158.8, hf: 670, hfg: 2086, hg: 2756 },
  { pBarG: 6, tSat: 164.9, hf: 697, hfg: 2066, hg: 2763 },
  { pBarG: 7, tSat: 170.4, hf: 721, hfg: 2048, hg: 2769 },
  { pBarG: 8, tSat: 175.4, hf: 743, hfg: 2031, hg: 2774 },
  { pBarG: 10, tSat: 184.1, hf: 781, hfg: 2000, hg: 2781 },
];

export function steamRow(pBarG: number): SteamRow {
  return (
    SAT_STEAM.find((r) => r.pBarG === pBarG) ??
    SAT_STEAM.reduce((a, b) => (Math.abs(b.pBarG - pBarG) < Math.abs(a.pBarG - pBarG) ? b : a))
  );
}

/** Flash-steam fraction when condensate at p1 drops to p2 (both bar g). */
export function flashFraction(p1BarG: number, p2BarG: number): number {
  const a = steamRow(p1BarG);
  const b = steamRow(p2BarG);
  return (a.hf - b.hf) / b.hfg;
}

/**
 * Steam loss through a failed-open trap (kg/h), by orifice diameter and line
 * pressure. Simplified from published trap-loss data (Napier-type discharge).
 */
export const TRAP_LOSS: { orificeMm: number; pBarG: number; kgPerH: number }[] = [
  { orificeMm: 3.2, pBarG: 5, kgPerH: 11 },
  { orificeMm: 3.2, pBarG: 7, kgPerH: 14 },
  { orificeMm: 3.2, pBarG: 10, kgPerH: 19 },
  { orificeMm: 4.5, pBarG: 5, kgPerH: 22 },
  { orificeMm: 4.5, pBarG: 7, kgPerH: 28 },
  { orificeMm: 4.5, pBarG: 10, kgPerH: 38 },
  { orificeMm: 6.0, pBarG: 7, kgPerH: 50 },
];

export function trapLoss(orificeMm: number, pBarG: number): number {
  const hit = TRAP_LOSS.find((t) => t.orificeMm === orificeMm && t.pBarG === pBarG);
  return hit ? hit.kgPerH : 0;
}

/**
 * Heat loss from horizontal steel pipe (W per metre), bare vs insulated, at a
 * steam temperature of ~170 °C in still air ~20 °C. Indicative figures.
 */
export const PIPE_LOSS: { dn: number; bareWperM: number; insulatedWperM: number }[] = [
  { dn: 25, bareWperM: 180, insulatedWperM: 18 },
  { dn: 50, bareWperM: 300, insulatedWperM: 30 },
  { dn: 80, bareWperM: 440, insulatedWperM: 44 },
  { dn: 100, bareWperM: 560, insulatedWperM: 56 },
  { dn: 150, bareWperM: 760, insulatedWperM: 76 },
];

export function pipeLoss(dn: number) {
  return PIPE_LOSS.find((p) => p.dn === dn) ?? PIPE_LOSS[3];
}

// ---- standard cost / property assumptions (UK, indicative) ----
export const STEAM_COST = {
  gasPricePerKWh: 0.045,
  boilerEfficiency: 0.8, // fuel → steam, so delivered heat costs more than raw gas
  hoursPerYear: 6000,
  waterPricePerM3: 2.0, // treated make-up: supply + softening/RO + effluent
  makeupTempC: 10,
  condensateTempC: 90,
  waterCp: 4.19, // kJ/kg·K
};

/** Cost of 1 kW of *delivered heat* for a year, £, accounting for boiler eff. */
export function heatCostPerKWYear(): number {
  return (
    (STEAM_COST.gasPricePerKWh / STEAM_COST.boilerEfficiency) * STEAM_COST.hoursPerYear
  );
}
