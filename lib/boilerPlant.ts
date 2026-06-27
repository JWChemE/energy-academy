/**
 * Boiler Plant Simulation — the richer model behind the Diagnostic mode.
 *
 * Where the tuning model (steamBoilerPhysics.ts) exposes a few continuous
 * levers, this models a *configured boiler house with faults* and produces the
 * full set of symptoms an auditor would read and infer from: combustion gases,
 * stack and economiser temperatures, feedwater temperature, and — crucially —
 * the water-side chain (treatment → feedwater TDS → blowdown adequacy → boiler
 * TDS → scale). The loss/efficiency maths mirrors the tuning model so it feels
 * like the same boiler.
 */

export type WaterTreatment = "none" | "softener" | "ro";
export type EconomiserState = "none" | "ok" | "fouled" | "bypassed";
export type BlowdownControl = "manual" | "auto";
export type Condition = "good" | "poor";

export interface PlantConfig {
  excessO2: number; // flue-gas O₂ %
  firingRate: number; // % of capacity
  capacity: number; // kg/h max continuous rating
  steamPressure: number; // bar (context)
  waterTreatment: WaterTreatment;
  softenerExhausted: boolean; // softener fitted but not regenerated → hardness passes
  deaerator: boolean;
  blowdownControl: BlowdownControl;
  blowdownManualRate: number; // % (used when control = manual)
  condensateReturn: number; // % of feedwater returned as condensate
  economiser: EconomiserState;
  tubeScale: number; // 0..1 existing scale severity on tubes
  insulation: Condition;
}

export interface LossBreakdown {
  usefulHeat: number;
  dryGasLoss: number;
  moistureLoss: number;
  incompleteCombustionLoss: number;
  blowdownLoss: number;
  radiationLoss: number;
  foulingLoss: number;
}

export interface PlantWarning {
  level: "danger" | "caution";
  text: string;
}

export interface PlantReadings {
  // combustion
  excessO2: number;
  flueCO2: number;
  flueCO: number; // ppm
  // heat recovery / stack
  stackTemp: number; // final, post-economiser
  economiserGasIn: number | null;
  economiserGasOut: number | null;
  // water side
  feedwaterTemp: number;
  feedwaterTDS: number; // ppm
  boilerTDS: number; // ppm
  makeupPercent: number;
  blowdownRatePct: number;
  // performance
  steamFlow: number; // kg/h
  fuelInput: number; // kW
  efficiency: number; // %
  costPerHour: number; // £/h
  co2PerHour: number; // kg/h
  losses: LossBreakdown;
  warnings: PlantWarning[];
  activeScaling: boolean; // boiler water chemistry is laying down new scale
}

// ---- constants (consistent with the tuning model) ----
const AMBIENT = 20;
const RAW_TDS = 350; // town make-up water, ppm
const COND_TDS = 10; // returned condensate, ppm
const RO_FACTOR = 0.05; // RO removes ~95% of dissolved solids
const TARGET_BOILER_TDS = 3000; // ppm auto-control set point
const MAX_BOILER_TDS = 3500; // ppm above which carryover / scaling
const GAS_PRICE = 0.045; // £/kWh
const GAS_CO2 = 0.183; // kg/kWh
const WATER_PRICE = 0.9; // £/m³

function excessAirFraction(o2: number) {
  const c = Math.min(Math.max(o2, 0), 20);
  return c / (20.9 - c);
}
function flueCO2(o2: number) {
  const ea = excessAirFraction(o2);
  return Math.max(11.7 * (1 - ea / (1 + ea)), 4);
}
function flueCO(o2: number) {
  if (o2 >= 3) return 20;
  if (o2 >= 2) return 20 + (3 - o2) * 180;
  return 200 + (2 - o2) * 1500;
}

export function simulatePlant(cfg: PlantConfig): PlantReadings {
  // ---- water side: make-up, feedwater TDS ----
  const makeupFrac = (100 - cfg.condensateReturn) / 100;
  let makeupTDS: number;
  if (cfg.waterTreatment === "ro") makeupTDS = RAW_TDS * RO_FACTOR;
  else makeupTDS = RAW_TDS; // raw or softened: softening swaps ions, doesn't cut TDS
  const feedwaterTDS = makeupFrac * makeupTDS + (1 - makeupFrac) * COND_TDS;

  // ---- blowdown & boiler TDS ----
  let blowdownFrac: number;
  let boilerTDS: number;
  if (cfg.blowdownControl === "auto") {
    blowdownFrac = feedwaterTDS / TARGET_BOILER_TDS;
    boilerTDS = TARGET_BOILER_TDS;
  } else {
    blowdownFrac = Math.max(cfg.blowdownManualRate / 100, 0.0005);
    boilerTDS = feedwaterTDS / blowdownFrac;
  }
  const blowdownRatePct = blowdownFrac * 100;
  const overLimitTDS = boilerTDS > MAX_BOILER_TDS;
  // Hardness breaking through (no/failed softening on hard water) lays down scale.
  const hardnessPassing =
    cfg.waterTreatment === "none" ||
    (cfg.waterTreatment === "softener" && cfg.softenerExhausted);
  const activeScaling = overLimitTDS || hardnessPassing;

  // ---- feedwater temperature ----
  let feedwaterTemp = makeupFrac * 15 + (1 - makeupFrac) * 90;
  if (cfg.deaerator) feedwaterTemp = Math.max(feedwaterTemp, 105);
  if (cfg.economiser === "ok") feedwaterTemp += 18;
  else if (cfg.economiser === "fouled") feedwaterTemp += 4;

  // ---- existing scale → fouling loss & hotter stack ----
  const foulingLoss = Math.min(cfg.tubeScale, 1) * 4; // up to 4% of fuel

  // ---- combustion / stack ----
  const o2 = cfg.excessO2;
  const eaFrac = excessAirFraction(o2);
  const preEcon =
    190 + (o2 - 3) * 8 + (cfg.firingRate - 100) * 0.3 + foulingLoss * 6;
  let gasIn: number | null = null;
  let gasOut: number | null = null;
  let finalStack: number;
  switch (cfg.economiser) {
    case "none":
      finalStack = preEcon;
      break;
    case "ok":
      gasIn = preEcon;
      gasOut = preEcon - 80;
      finalStack = gasOut;
      break;
    case "fouled":
      gasIn = preEcon;
      gasOut = preEcon - 15;
      finalStack = gasOut;
      break;
    case "bypassed":
      gasIn = preEcon;
      gasOut = preEcon - 2;
      finalStack = gasOut;
      break;
  }
  finalStack = Math.max(finalStack, 70);

  // ---- losses ----
  const dryGasLoss = (finalStack - AMBIENT) * (1 + eaFrac) * 0.0302;
  const moistureLoss = cfg.economiser === "ok" ? 8 : 10;
  const incompleteCombustionLoss = o2 < 2.5 ? (2.5 - o2) * 6 : 0;
  const blowdownLoss = blowdownRatePct * 0.25;
  const radiationLoss = Math.min(
    (cfg.insulation === "poor" ? 2.6 : 1.5) * (100 / cfg.firingRate),
    7
  );
  const efficiency = Math.max(
    100 -
      dryGasLoss -
      moistureLoss -
      incompleteCombustionLoss -
      blowdownLoss -
      radiationLoss -
      foulingLoss,
    40
  );

  // ---- energy & cost ----
  const steamFlow = cfg.capacity * (cfg.firingRate / 100);
  const heatPerKg = Math.max(2778 - feedwaterTemp * 4.187, 1800); // kJ/kg
  const usefulKW = (steamFlow * heatPerKg) / 3600;
  const fuelInput = usefulKW / (efficiency / 100);
  const blowdownVol = (steamFlow / 1000) * blowdownFrac; // m³/h
  const costPerHour = fuelInput * GAS_PRICE + blowdownVol * WATER_PRICE;
  const co2PerHour = fuelInput * GAS_CO2;

  // ---- warnings / symptoms ----
  const warnings: PlantWarning[] = [];
  if (o2 < 2)
    warnings.push({
      level: "danger",
      text: "Air-starved combustion — high CO and soot. Unsafe and wasteful.",
    });
  if (overLimitTDS)
    warnings.push({
      level: "danger",
      text: `Boiler water TDS ${Math.round(boilerTDS)} ppm exceeds the ${MAX_BOILER_TDS} ppm limit — carryover and scaling.`,
    });
  if (hardnessPassing)
    warnings.push({
      level: "caution",
      text: "Hardness is reaching the boiler (untreated/failed softening) — scale will form on the tubes.",
    });
  if (
    cfg.blowdownControl === "manual" &&
    boilerTDS < TARGET_BOILER_TDS * 0.55 &&
    blowdownRatePct > 2
  )
    warnings.push({
      level: "caution",
      text: "Blowing down far more than the water quality needs — dumping hot water for nothing.",
    });
  if (cfg.economiser === "fouled" || cfg.economiser === "bypassed")
    warnings.push({
      level: "caution",
      text: "Stack heat is not being recovered — the economiser is fitted but not doing its job.",
    });
  if (foulingLoss > 1)
    warnings.push({
      level: "caution",
      text: "Scaled heat-transfer surfaces — stack is hot and efficiency capped until descaled.",
    });
  if (!cfg.deaerator && feedwaterTemp < 60)
    warnings.push({
      level: "caution",
      text: "Cold, un-deaerated feedwater — dissolved oxygen risk (corrosion) and more fuel to raise steam.",
    });
  if (cfg.insulation === "poor")
    warnings.push({
      level: "caution",
      text: "Poor casing/pipe insulation — elevated radiation losses.",
    });

  return {
    excessO2: round1(o2),
    flueCO2: round1(flueCO2(o2)),
    flueCO: Math.round(flueCO(o2)),
    stackTemp: Math.round(finalStack),
    economiserGasIn: gasIn === null ? null : Math.round(gasIn),
    economiserGasOut: gasOut === null ? null : Math.round(gasOut),
    feedwaterTemp: Math.round(feedwaterTemp),
    feedwaterTDS: Math.round(feedwaterTDS),
    boilerTDS: Math.round(boilerTDS),
    makeupPercent: Math.round(makeupFrac * 100),
    blowdownRatePct: round1(blowdownRatePct),
    steamFlow: Math.round(steamFlow),
    fuelInput: Math.round(fuelInput),
    efficiency: round1(efficiency),
    costPerHour: round2(costPerHour),
    co2PerHour: round1(co2PerHour),
    losses: {
      usefulHeat: round1(efficiency),
      dryGasLoss: round1(dryGasLoss),
      moistureLoss: round1(moistureLoss),
      incompleteCombustionLoss: round1(incompleteCombustionLoss),
      blowdownLoss: round1(blowdownLoss),
      radiationLoss: round1(radiationLoss),
      foulingLoss: round1(foulingLoss),
    },
    warnings,
    activeScaling,
  };
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}
