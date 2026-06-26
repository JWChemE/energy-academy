/**
 * Steam Boiler Physics Engine
 * ---------------------------
 * A transparent, defensible model of a natural-gas fire-tube industrial steam
 * boiler, written for *teaching*. Every number an operator sees can be traced
 * back to a lever they moved.
 *
 * Efficiency is on a Gross Calorific Value (GCV / higher heating value) basis,
 * which is why natural gas tops out around the mid-80s% — the ~10% latent heat
 * in the flue-gas moisture is unrecoverable without a condensing economiser.
 * This is the key realism that drives the scenarios: combustion trim alone
 * caps out near 82%; reaching 85%+ needs heat recovery (an economiser), and a
 * fouled/worn boiler may not get there at all without an overhaul.
 *
 * Loss accounting (all as % of fuel energy in):
 *   100%  =  useful heat to steam (efficiency)
 *          + dry flue-gas loss      (sensible heat up the stack)
 *          + moisture loss          (latent heat of combustion water vapour)
 *          + incomplete-combustion  (CO / soot when starved of air)
 *          + blowdown loss          (heat dumped with boiler water)
 *          + radiation/convection   (casing losses; fixed kW, so % rises at low load)
 *          + fouling penalty        (degraded heat transfer on a worn boiler)
 */

export interface BoilerState {
  /** Excess oxygen in flue gas, % (the combustion-trim lever). 1–9. */
  excessO2: number;
  /** Continuous blowdown as % of feedwater. 0.5–6. */
  blowdownRate: number;
  /** Firing rate / demand as % of max continuous rating. 20–100. */
  loadLevel: number;
  /** Capital option: flue-gas economiser (preheats feedwater). */
  economiser: boolean;
  /** Capital option: tubes cleaned / boiler overhauled (removes fouling penalty). */
  tubeOverhaul: boolean;
}

export interface LossBreakdown {
  usefulHeat: number; // = efficiency
  dryGasLoss: number;
  moistureLoss: number;
  incompleteCombustionLoss: number;
  blowdownLoss: number;
  radiationLoss: number;
  foulingLoss: number;
}

export type WarningLevel = "danger" | "caution";

export interface Warning {
  level: WarningLevel;
  text: string;
}

export interface BoilerOutput {
  stackTemp: number; // °C
  flueGasCO2: number; // % (combustion quality indicator)
  flueGasCO: number; // ppm (incomplete combustion indicator)
  efficiency: number; // %
  losses: LossBreakdown;
  steamOutput: number; // kg/h
  fuelInput: number; // kW
  fuelCostPerHour: number; // £/h
  waterCostPerHour: number; // £/h (blowdown water + treatment)
  totalCostPerHour: number; // £/h
  co2PerHour: number; // kg CO2/h
  warnings: Warning[];
  /** The single largest loss the operator could still attack, for coaching. */
  biggestLoss: { name: string; value: number } | null;
}

// ---- Plant & fuel constants -------------------------------------------------

const AMBIENT_TEMP = 20; // °C combustion-air / reference temp
const MCR_STEAM = 5000; // kg/h max continuous rating
const HEAT_PER_KG_STEAM = 2440; // kJ/kg added (feedwater ~80°C → sat. steam @ 10 bar)
const HEAT_PER_KG_STEAM_ECON = 2380; // kJ/kg with economiser (hotter feedwater ~105°C)

const GAS_PRICE = 0.045; // £/kWh, industrial natural gas
const GAS_CO2 = 0.183; // kg CO2 / kWh (GCV basis)
const WATER_PRICE = 0.9; // £/m³ treated make-up water + chemicals + disposal

const MOISTURE_LOSS = 10; // % latent loss inherent to natural gas (GCV basis)
const MOISTURE_LOSS_ECON = 8; // a condensing economiser recovers ~2% of the latent heat

// ---- Derived combustion relationships --------------------------------------

/** Excess-air fraction from measured flue-gas O₂ (simplified dry-air relation). */
function excessAirFraction(o2: number): number {
  const clamped = Math.min(Math.max(o2, 0), 20);
  return clamped / (20.9 - clamped);
}

/** Flue-gas CO₂ %, inversely related to excess air — the classic combustion curve. */
function flueGasCO2(o2: number): number {
  // ~11.7% CO₂ at stoichiometric for natural gas, falling as air is added.
  const co2 = 11.7 * (1 - excessAirFraction(o2) / (1 + excessAirFraction(o2)));
  return Math.max(co2, 4);
}

/** CO in ppm — low until the burner is starved of air, then it spikes. */
function flueGasCO(o2: number): number {
  if (o2 >= 3) return 20; // trace, well-burnt
  if (o2 >= 2) return 20 + (3 - o2) * 180; // climbing
  return 200 + (2 - o2) * 1500; // sharp spike — dangerous, sooting
}

/** Stack (flue-gas) temperature in °C. */
function stackTemperature(state: BoilerState): number {
  // Base for a fire-tube NG boiler, well-trimmed at full load, no economiser.
  let t = 190 + (state.excessO2 - 3) * 8; // excess air carries heat up the stack
  t += (state.loadLevel - 100) * 0.3; // a little cooler at part load
  if (state.economiser) t -= 80; // feedwater economiser reclaims sensible heat
  return Math.max(t, 70);
}

// ---- Main model -------------------------------------------------------------

export function calculateBoilerPerformance(
  state: BoilerState,
  baseFoulingLoss = 0
): BoilerOutput {
  const { excessO2, blowdownRate, loadLevel, economiser, tubeOverhaul } = state;

  const stackTemp = stackTemperature(state);
  const eaFrac = excessAirFraction(excessO2);

  // Dry flue-gas (sensible) loss: more excess air and a hotter stack both hurt.
  const dryGasLoss = (stackTemp - AMBIENT_TEMP) * (1 + eaFrac) * 0.0302;

  // Incomplete-combustion loss: only when starved of air (O₂ below ~2.5%),
  // and it bites hard — unburnt fuel is expensive and dangerous.
  const incompleteCombustionLoss =
    excessO2 < 2.5 ? (2.5 - excessO2) * 6 : 0;

  // Blowdown loss: heat dumped with the hot boiler water (~0.25%/1% blowdown).
  const blowdownLoss = blowdownRate * 0.25;

  // Radiation/convection: a fixed casing loss, so its % grows as load falls.
  const radiationLoss = Math.min(1.5 * (100 / loadLevel), 6);

  // Fouling: a worn boiler's degraded heat transfer, removed by an overhaul.
  const foulingLoss = tubeOverhaul ? 0 : baseFoulingLoss;

  const moistureLoss = economiser ? MOISTURE_LOSS_ECON : MOISTURE_LOSS;

  const totalLoss =
    dryGasLoss +
    moistureLoss +
    incompleteCombustionLoss +
    blowdownLoss +
    radiationLoss +
    foulingLoss;

  const efficiency = Math.max(100 - totalLoss, 40);

  // Energy & cost flows.
  const heatPerKg = economiser ? HEAT_PER_KG_STEAM_ECON : HEAT_PER_KG_STEAM;
  const steamOutput = MCR_STEAM * (loadLevel / 100);
  const usefulKW = (steamOutput * heatPerKg) / 3600; // kJ/h → kW
  const fuelInput = usefulKW / (efficiency / 100);

  const fuelCostPerHour = fuelInput * GAS_PRICE;
  const blowdownVolume = (steamOutput / 1000) * (blowdownRate / 100); // m³/h
  const waterCostPerHour = blowdownVolume * WATER_PRICE;
  const totalCostPerHour = fuelCostPerHour + waterCostPerHour;
  const co2PerHour = fuelInput * GAS_CO2;

  // Warnings — the symptoms a real auditor reads.
  const warnings: Warning[] = [];
  if (excessO2 < 2) {
    warnings.push({
      level: "danger",
      text: "Air-starved combustion — CO and soot forming. Unsafe and very wasteful.",
    });
  } else if (excessO2 < 2.8) {
    warnings.push({
      level: "caution",
      text: "Running rich — slightly short of air. Edging towards incomplete combustion.",
    });
  } else if (excessO2 > 6.5) {
    warnings.push({
      level: "caution",
      text: "Far too much excess air — you are heating cold air and venting it up the stack.",
    });
  }
  if (blowdownRate < 1.5) {
    warnings.push({
      level: "danger",
      text: "Blowdown too low — dissolved solids will build up: scale, fouling and corrosion.",
    });
  } else if (blowdownRate > 4) {
    warnings.push({
      level: "caution",
      text: "Blowdown too high — dumping hot water and treatment chemicals needlessly.",
    });
  }
  if (stackTemp > 240) {
    warnings.push({
      level: "caution",
      text: `Stack temperature very high (${Math.round(stackTemp)}°C) — heat is escaping up the flue.`,
    });
  }
  if (!tubeOverhaul && baseFoulingLoss > 1) {
    warnings.push({
      level: "caution",
      text: "Fouled heat-transfer surfaces are capping efficiency — tuning alone can't fix this.",
    });
  }

  // Biggest remaining controllable loss (ignore the fixed moisture loss).
  const controllable: Array<{ name: string; value: number }> = [
    { name: "dry flue-gas loss", value: dryGasLoss },
    { name: "incomplete combustion", value: incompleteCombustionLoss },
    { name: "blowdown loss", value: blowdownLoss },
    { name: "radiation loss", value: radiationLoss },
    { name: "fouling loss", value: foulingLoss },
  ];
  const biggestLoss = controllable.reduce(
    (max, l) => (l.value > max.value ? l : max),
    { name: "", value: 0 }
  );

  return {
    stackTemp: Math.round(stackTemp),
    flueGasCO2: Math.round(flueGasCO2(excessO2) * 10) / 10,
    flueGasCO: Math.round(flueGasCO(excessO2)),
    efficiency: Math.round(efficiency * 10) / 10,
    losses: {
      usefulHeat: Math.round(efficiency * 10) / 10,
      dryGasLoss: Math.round(dryGasLoss * 10) / 10,
      moistureLoss: Math.round(moistureLoss * 10) / 10,
      incompleteCombustionLoss: Math.round(incompleteCombustionLoss * 10) / 10,
      blowdownLoss: Math.round(blowdownLoss * 10) / 10,
      radiationLoss: Math.round(radiationLoss * 10) / 10,
      foulingLoss: Math.round(foulingLoss * 10) / 10,
    },
    steamOutput: Math.round(steamOutput),
    fuelInput: Math.round(fuelInput),
    fuelCostPerHour: Math.round(fuelCostPerHour * 100) / 100,
    waterCostPerHour: Math.round(waterCostPerHour * 100) / 100,
    totalCostPerHour: Math.round(totalCostPerHour * 100) / 100,
    co2PerHour: Math.round(co2PerHour * 10) / 10,
    warnings,
    biggestLoss: biggestLoss.value > 0.3 ? biggestLoss : null,
  };
}
