/**
 * Refrigeration & heat-pump reference data — COP, prices, the setpoint/tuning
 * rules of thumb, and superheat/subcooling targets. Every case answer derives
 * from these. The core relationship: electrical input = useful output ÷ COP.
 */

export const PRICES = {
  elec: 0.2, // £/kWh
};

/** Typical coefficients of performance. */
export const COP = {
  resistance: 1, // direct electric resistance heating
  chiller: 3.5, // water-cooled chiller, full load
  ashp: 3, // air-source heat pump, seasonal
  gshp: 4, // ground-source heat pump
};

/** Chiller COP improves ~3% for each °C of higher chilled-water (or cooler condenser) temperature. */
export const SETPOINT_COP_PER_C = 0.03;

export const SUPERHEAT_TARGET = "5–8 °C"; // measured − saturation at evaporator outlet
export const SUBCOOLING_TARGET = "5–10 °C"; // saturation − measured at condenser exit

/** Electrical input to deliver a given heating/cooling output at a COP. */
export function electricInput(output: number, cop: number): number {
  return output / cop;
}
