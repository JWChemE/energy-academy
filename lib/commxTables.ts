/**
 * Commissioning reference data — acceptance criteria, performance testing, sensor
 * verification, drift and prices. Commissioning is the bridge between design
 * intent and actual performance: 15–30% of new buildings have a significant gap,
 * and fixing a defect at commissioning costs ~10× less than after handover.
 */

export const PRICES = {
  elec: 0.2, // £/kWh
  heat: 0.06, // £/kWh displaced gas heat
};

export const CP_WATER = 4.18; // kJ/kg·K
export const COOLING_COP = 3; // electrical COP of cooling plant
export const PCT_PER_DEGREE = 3; // %/°C of over-conditioning

/** Typical acceptance criteria. */
export const ACCEPTANCE = {
  flow: "±10% of design",
  capacity: "±10% of design",
  temp: "±1 °C of setpoint",
  boilerEff: "within 2–5% of nameplate",
  ductStatic: "25–40 Pa",
};

/** Cooling/heating capacity (kW) from flow and temperature difference. */
export function capacityKw(mdot_kgs: number, dT: number): number {
  return mdot_kgs * CP_WATER * dT;
}
