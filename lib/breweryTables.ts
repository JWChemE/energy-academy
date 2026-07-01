/**
 * Brewery diagnostics reference data — wort/water properties for heat-recovery
 * calculations, and glycol/refrigeration figures for cellar cooling faults.
 * Two quick, hands-on call-outs embedded in the Breweries sector course,
 * using the same CaseDiagnostics engine as every Level 2 capstone.
 */

export const PRICES = {
  gas: 0.06, // £/kWh
  elec: 0.2, // £/kWh
};

export const CP_WATER = 4.18; // kJ/kg·K — wort is close enough to water for this purpose
export const HL_TO_KG = 100; // kg per hectolitre, using water's density

/** Heat released cooling a batch from one temperature to another, in kWh. */
export function batchHeatKwh(volumeHl: number, fromC: number, toC: number): number {
  const massKg = volumeHl * HL_TO_KG;
  return (massKg * CP_WATER * Math.abs(fromC - toC)) / 3600;
}
