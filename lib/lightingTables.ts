/**
 * Lighting reference data — luminous efficacy by technology, task illuminance
 * targets (EN 12464-1), typical controls savings, magnetic-ballast losses and
 * the electricity price. Every lighting case answer derives from these.
 */

export const PRICES = {
  elec: 0.2, // £/kWh
};

/** Luminous efficacy, lumens per watt (the lighting efficiency metric). */
export const EFFICACY = {
  incandescent: 12,
  halogen: 20,
  cfl: 60,
  fluorescent: 75, // linear T8
  t5: 95,
  led: 130,
}; // lm/W

/** Task illuminance targets (lux) — what a space should be lit to. */
export const LUX_TARGETS = [
  { space: "Circulation / corridors", lux: "100–150" },
  { space: "Warehouse storage", lux: "150–200" },
  { space: "General office / reading", lux: "300–500" },
  { space: "Detailed work / drawing", lux: "750–1,000" },
  { space: "Fine inspection", lux: "1,000+" },
];

/** Typical savings from controls, by control type and space. */
export const CONTROL_SAVINGS = {
  occupancy: "Toilets/changing 40–65% · stores 40–60% · corridors 30–50% · cellular office 20–45%",
  daylight: "Window perimeter 30–60% · under rooflights 60–70% · deep interior: minimal",
  scheduling: "Removes out-of-hours burning entirely (lights only on in permitted hours)",
};

/** A magnetic ballast wastes roughly this much extra power per fluorescent tube. */
export const MAGNETIC_BALLAST_LOSS_W = 10;

/** Energy from power and hours. */
export function energyKwh(kW: number, hours: number): number {
  return kW * hours;
}
