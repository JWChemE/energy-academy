/**
 * Maintenance reference data — maintenance strategy, degradation mechanisms,
 * condition monitoring and prices. The core message: maintenance and energy
 * efficiency are inseparable. Equipment at its design condition uses the least
 * energy; as it fouls, wears and drifts, energy use creeps up — usually
 * invisibly — and the cost of deferral often dwarfs the maintenance saved.
 */

export const PRICES = {
  elec: 0.2, // £/kWh
  heat: 0.06, // £/kWh displaced gas heat
};

/** Boiler flue-gas temperature: every ~20 °C rise ≈ 1% efficiency loss. */
export const FLUE_PCT_PER_20C = 1;

/** Rules of thumb for degradation. */
export const DEGRADATION = {
  scalePerMm: "5–8%", // fuel penalty per 1 mm of boiler scale
  beltSlip: "up to ~5%", // transmission loss from a slipping V-belt
  buildingDrift: "10–30%", // a poorly maintained building drifts this far above optimal
};

/** Maintenance strategies, matched to asset criticality and energy. */
export const STRATEGIES = {
  reactive: "Run to failure — cheap items, low consequence",
  preventive: "Service on a schedule — the bulk of important plant",
  predictive: "Service on condition (vibration/thermography/oil/KPI) — critical, energy-intensive plant",
};
