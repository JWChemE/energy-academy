/**
 * Control-systems & BMS reference data — control modes, energy strategies, loop
 * coordination, sensors and valve authority. Good control keeps a building on
 * setpoint without overshoot, conditions it only when occupied, and trusts only
 * well-placed, calibrated sensors.
 */

export const PRICES = {
  elec: 0.2, // £/kWh
  heat: 0.06, // £/kWh displaced gas heat
};

export const COOLING_COP = 3; // electrical COP of cooling plant

/** Roughly this much extra heating per °C of over-heating (or cooling per °C of over-cooling). */
export const PCT_PER_DEGREE = 3; // %/°C

/** Typical savings from energy-optimised control strategies. */
export const STRATEGY_SAVINGS = {
  setpointReset: "10–20%", // weather compensation
  occupancy: "20–40%", // occupancy-based control
  sequencing: "5–15%", // multi-unit load sequencing
  coordination: "10–20%", // deadband / loop coordination
  pidVsOnOff: "5–10%", // PID vs on-off
};

/** Valve authority = valve pressure drop ÷ total loop pressure drop; target 0.3–0.5. */
export function valveAuthority(valveDrop: number, totalDrop: number): number {
  return valveDrop / totalDrop;
}
