/**
 * Waste-heat-recovery diagnostic cases — flue economiser, chiller condenser
 * recovery, air-to-air (HRV) ventilation recovery, a fouled recovery exchanger,
 * flash-steam recovery, a timing mismatch, process-exhaust recovery, and a
 * temperature (grade) mismatch. A mix of quantify-the-recovery, read-the-numbers
 * and judgement. Numbers consistent with lib/whrTables.ts. Built on the shared
 * diagnostics core.
 *
 * The discipline: a recovery project earns only when SUPPLY, DEMAND, TEMPERATURE
 * and TIMING all align. Find the heat, match it to a sink at the right grade and
 * time, and the paybacks are often under a year.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const WHR_CAUSES: CauseDef[] = [
  { id: "flue-heat-wasted", label: "Hot flue gas vented — recoverable heat lost up the stack" },
  { id: "condenser-heat-wasted", label: "Chiller/refrigeration condenser heat rejected to atmosphere" },
  { id: "vent-heat-wasted", label: "Warm exhaust ventilation air discharged without recovery" },
  { id: "process-exhaust-wasted", label: "Hot process exhaust vented without recovery" },
  { id: "flash-steam-wasted", label: "Flash steam / condensate heat lost" },
  { id: "fouled-hx", label: "Recovery heat exchanger fouled / undersized — low effectiveness" },
  { id: "timing-mismatch", label: "Supply and demand not coincident — poor utilisation" },
  { id: "temperature-mismatch", label: "Source too low-grade for the intended sink" },
  { id: "no-sink", label: "No nearby thermal load to use the heat" },
  { id: "recovery-adequate", label: "Heat already used / no real opportunity — no fault" },
];

export const WHR_ACTIONS: ActionDef[] = [
  { id: "reschedule-process", label: "Reschedule the process to coincide with the demand", tier: 1 },
  { id: "clean-hx", label: "Clean / descale the heat exchanger", tier: 2 },
  { id: "fit-flash-recovery", label: "Fit a flash tank to recover flash steam", tier: 2 },
  { id: "use-for-preheat", label: "Use the low-grade heat for a low-temperature sink / preheat", tier: 2 },
  { id: "fit-economiser", label: "Fit a flue-gas economiser / condensing heat recovery", tier: 3 },
  { id: "recover-condenser-heat", label: "Recover condenser heat for DHW / heating (HX + controls)", tier: 3 },
  { id: "fit-hrv", label: "Fit air-to-air heat recovery (HRV / thermal wheel)", tier: 3 },
  { id: "fit-recovery-hx", label: "Fit a process-exhaust heat-recovery exchanger", tier: 3 },
  { id: "upsize-hx", label: "Upsize the heat exchanger (more effectiveness)", tier: 3 },
  { id: "add-thermal-store", label: "Add thermal storage to bridge the supply/demand timing", tier: 3 },
  { id: "heat-pump-upgrade", label: "Add a heat pump to upgrade the heat to a higher temperature", tier: 3 },
  { id: "pipe-direct-hot-sink", label: "Pipe the low-grade heat straight to the high-temperature load", tier: 2 },
  { id: "install-anyway", label: "Install the recovery as-is despite poor utilisation", tier: 3 },
  { id: "vent-to-atmosphere", label: "Keep venting it / do nothing", tier: 1 },
];

export type WhrRefTable = "heatrate" | "effectiveness" | "matching" | "condensing" | "prices";

export interface WhrCase extends DiagnosticCase {
  refTables: WhrRefTable[];
}

export const WHR_CASES: WhrCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "flue-economiser",
    title: "Case 1 — Heat up the stack",
    tag: "Flue gas",
    brief:
      "A continuously fired boiler vents its flue gas at ~180 °C straight to atmosphere. A flue-gas economiser would cool it and preheat the feedwater, recovering heat that's currently lost up the stack. The feedwater is always there as a sink, so this is about as safe a project as recovery gets. Quantify it.",
    knownFacts: [
      "Boiler fuel input 1,000 kW, running ~8,000 h/yr",
      "An economiser would recover ~8% of fuel input",
      "Recovered heat displaces gas at £0.06/kWh",
      "Economiser retrofit ≈ £50,000",
    ],
    readings: [
      { label: "Fuel input", value: "1,000", unit: "kW" },
      { label: "Flue-gas temperature", value: "180", unit: "°C", note: "heat lost to stack" },
      { label: "Recoverable share", value: "8", unit: "%", note: "economiser, into feedwater" },
      { label: "Run hours", value: "8,000", unit: "h/yr" },
    ],
    refTables: ["condensing", "prices"],
    calcParts: [
      {
        id: "recovered-kw",
        prompt: "How much heat can the economiser recover?",
        unit: "kW",
        answer: 80,
        tol: 3,
        tolType: "abs",
        hints: ["Recoverable share × fuel input.", "0.08 × 1,000."],
        worked: "0.08 × 1,000 = 80 kW recovered into the feedwater.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 38400,
        tol: 0.05,
        tolType: "rel",
        hints: ["kW × hours × price.", "80 × 8,000 × 0.06."],
        worked: "80 kW × 8,000 h × £0.06 = £38,400/yr of gas no longer burned.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback?",
        unit: "years",
        answer: 1.3,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ annual saving.", "50,000 ÷ 38,400."],
        worked: "£50,000 ÷ £38,400 ≈ 1.3 years.",
      },
    ],
    candidateCauseIds: ["no-sink", "recovery-adequate", "flue-heat-wasted", "condenser-heat-wasted"],
    correctCauseIds: ["flue-heat-wasted"],
    candidateActionIds: ["clean-hx", "vent-to-atmosphere", "recover-condenser-heat", "fit-economiser"],
    correctActionIds: ["fit-economiser"],
    improvementActionIds: [],
    debrief:
      "Flue-gas recovery is one of the fastest-paying projects there is, because the feedwater is a guaranteed sink — supply, demand, temperature and timing all line up automatically. An economiser recovering 8% of fuel here saves ~£38,400/yr for a ~1.3-year payback. Watch the practicalities: a true condensing economiser produces acidic condensate that needs an acid-resistant drain, and the return water mustn't be so cold it condenses inside the boiler.",
    faultChain: [
      "Flue gas vented at 180 °C, 8,000 h/yr",
      "Economiser recovers 8% of 1,000 kW = 80 kW",
      "≈ £38,400/yr; ~1.3-yr payback",
      "Fix: fit a flue-gas economiser into the feedwater",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "condenser-recovery",
    title: "Case 2 — Warm water to the cooling tower",
    tag: "Chiller condenser",
    brief:
      "A chiller cools the building and dumps its condenser heat — warm water at ~55 °C — to a cooling tower. Meanwhile the building heats its domestic hot water with a gas boiler. That condenser heat could do the DHW job for free whenever the two coincide. Quantify the recovery.",
    knownFacts: [
      "Chiller: 500 kW cooling for 150 kW compressor work",
      "Condenser water leaves at ~55 °C (currently sent to the cooling tower)",
      "DHW load can absorb ~150 kW, coincident for ~3,000 h/yr",
      "Displaces gas DHW at £0.06/kWh; recovery kit ≈ £40,000",
    ],
    readings: [
      { label: "Cooling duty", value: "500", unit: "kW" },
      { label: "Compressor work", value: "150", unit: "kW" },
      { label: "Condenser temperature", value: "55", unit: "°C", note: "to cooling tower" },
      { label: "Coincident DHW sink", value: "150", unit: "kW", note: "for ~3,000 h/yr" },
    ],
    refTables: ["heatrate", "prices"],
    calcParts: [
      {
        id: "heat-rejected",
        prompt: "How much heat is the condenser rejecting (energy balance)?",
        unit: "kW",
        answer: 650,
        tol: 10,
        tolType: "abs",
        hints: ["Heat rejected = cooling + compressor work.", "500 + 150."],
        worked: "500 + 150 = 650 kW rejected at the condenser.",
      },
      {
        id: "recovered-kwh",
        prompt: "How much heat can the DHW sink actually use per year?",
        unit: "kWh/yr",
        answer: 450000,
        tol: 0.04,
        tolType: "rel",
        hints: ["Sink load × coincident hours.", "150 × 3,000."],
        worked: "150 kW × 3,000 h = 450,000 kWh/yr (limited by the sink, not the supply).",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 27000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Recovered kWh × price.", "450,000 × 0.06."],
        worked: "450,000 × £0.06 = £27,000/yr (≈ 1.5-year payback on the £40,000 kit).",
      },
    ],
    candidateCauseIds: ["recovery-adequate", "no-sink", "condenser-heat-wasted", "flue-heat-wasted"],
    correctCauseIds: ["condenser-heat-wasted"],
    candidateActionIds: ["vent-to-atmosphere", "add-thermal-store", "recover-condenser-heat", "fit-economiser"],
    correctActionIds: ["recover-condenser-heat"],
    improvementActionIds: ["add-thermal-store"],
    debrief:
      "A chiller makes two useful things — cold water and warm condenser water — and most sites throw the second away. Recovering the 55 °C condenser heat for DHW saves ~£27,000/yr where the loads coincide. The limit here is the sink and the timing, not the supply (650 kW is available): the saving is set by what the DHW can absorb when the chiller is running. A hot-water store lifts utilisation by banking condenser heat for use when the chiller is off.",
    faultChain: [
      "Condenser rejecting 650 kW at 55 °C to the cooling tower",
      "DHW sink can use 150 kW for ~3,000 coincident hours",
      "450,000 kWh ≈ £27,000/yr",
      "Fix: recover condenser heat for DHW (add a store to lift utilisation)",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "air-to-air",
    title: "Case 3 — Throwing warm air outside",
    tag: "Ventilation",
    brief:
      "A building extracts warm stale air at 22 °C and draws in fresh air at 2 °C, heating it from scratch every time. An air-to-air heat recovery unit would use the outgoing air to pre-warm the incoming air. Quantify the recoverable heat.",
    knownFacts: [
      "Ventilation rate 2 m³/s; exhaust 22 °C, outdoor 2 °C",
      "An HRV would be ~80% effective (sensible)",
      "Air heat rate ≈ 1.2 kW per (m³/s·°C)",
      "Heating season ~4,000 h/yr; displaced heat £0.06/kWh; HRV ≈ £15,000",
    ],
    readings: [
      { label: "Ventilation rate", value: "2", unit: "m³/s" },
      { label: "Exhaust air temp", value: "22", unit: "°C" },
      { label: "Outdoor air temp", value: "2", unit: "°C" },
      { label: "HRV effectiveness", value: "80", unit: "%" },
    ],
    refTables: ["heatrate", "effectiveness", "prices"],
    calcParts: [
      {
        id: "max-rise",
        prompt: "What is the maximum possible temperature rise for the incoming air?",
        unit: "°C",
        answer: 20,
        tol: 1,
        tolType: "abs",
        hints: ["Exhaust temperature − outdoor temperature.", "22 − 2."],
        worked: "22 − 2 = 20 °C is the most the exhaust could pre-warm the supply.",
      },
      {
        id: "recovered-kw",
        prompt: "How much heat does the 80%-effective HRV recover?",
        unit: "kW",
        answer: 38.4,
        tol: 0.05,
        tolType: "rel",
        hints: ["1.2 × flow × (effectiveness × max rise).", "1.2 × 2 × (0.80 × 20)."],
        worked: "1.2 × 2 × (0.80 × 20 = 16 °C) = 38.4 kW recovered.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 9216,
        tol: 0.06,
        tolType: "rel",
        hints: ["kW × hours × price.", "38.4 × 4,000 × 0.06."],
        worked: "38.4 kW × 4,000 h × £0.06 ≈ £9,216/yr (≈ 1.6-year payback).",
      },
    ],
    candidateCauseIds: ["condenser-heat-wasted", "vent-heat-wasted", "no-sink", "recovery-adequate"],
    correctCauseIds: ["vent-heat-wasted"],
    candidateActionIds: ["vent-to-atmosphere", "clean-hx", "recover-condenser-heat", "fit-hrv"],
    correctActionIds: ["fit-hrv"],
    improvementActionIds: [],
    debrief:
      "Mandatory fresh-air ventilation throws away heated air every hour in winter; an HRV recovers 70–85% of it, here ~£9,216/yr. The supply and demand are perfectly matched — you're pre-warming the very air you'd otherwise heat. In humid climates an ERV (or thermal wheel) also recovers latent heat (humidity), worth more where dehumidification is costly. Keep the filters and core clean — air-side fouling quietly erodes the effectiveness.",
    faultChain: [
      "2 m³/s of fresh air heated from 2 °C while 22 °C air is dumped",
      "80% HRV recovers 1.2 × 2 × 16 = 38.4 kW",
      "≈ £9,216/yr; ~1.6-yr payback",
      "Fix: fit air-to-air heat recovery (HRV)",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "fouled-hx",
    title: "Case 4 — The exchanger that stopped delivering",
    tag: "Effectiveness",
    brief:
      "A recovery heat exchanger that used to deliver hot water now barely warms it, and the boiler is picking up the slack. The waste source is still 100 °C and the cold inlet still 20 °C, but the exchanger now only lifts the water to 50 °C. Work out its effectiveness and say what's happened.",
    knownFacts: [
      "Waste-heat source 100 °C; cold inlet 20 °C",
      "Exchanger now delivers only 50 °C (it used to do better)",
      "Cold-side flow 2 kg/s; water cp 4.18 kJ/kg·K",
      "Tubes show scaling; effectiveness has fallen over time",
    ],
    readings: [
      { label: "Source temperature", value: "100", unit: "°C" },
      { label: "Cold inlet", value: "20", unit: "°C" },
      { label: "Exchanger outlet now", value: "50", unit: "°C", note: "used to be hotter" },
      { label: "Cold-side flow", value: "2", unit: "kg/s", note: "scaled tubes" },
    ],
    refTables: ["effectiveness", "heatrate"],
    calcParts: [
      {
        id: "max-rise",
        prompt: "What is the maximum possible temperature rise?",
        unit: "°C",
        answer: 80,
        tol: 2,
        tolType: "abs",
        hints: ["Source temperature − cold inlet.", "100 − 20."],
        worked: "100 − 20 = 80 °C maximum possible rise.",
      },
      {
        id: "effectiveness",
        prompt: "What is the exchanger's effectiveness now?",
        unit: "%",
        answer: 37.5,
        tol: 2,
        tolType: "abs",
        hints: ["Actual rise ÷ maximum rise. Actual rise = 50 − 20.", "30 ÷ 80 × 100."],
        worked: "(50 − 20) ÷ 80 = 30 ÷ 80 = 37.5% — poor; a clean exchanger should manage 60–80%.",
      },
      {
        id: "recovered-now",
        prompt: "How much heat is it recovering now?",
        unit: "kW",
        answer: 250.8,
        tol: 0.05,
        tolType: "rel",
        hints: ["ṁ × cp × actual rise.", "2 × 4.18 × 30."],
        worked: "2 × 4.18 × 30 = 250.8 kW — well below what a clean exchanger would give.",
      },
    ],
    candidateCauseIds: ["temperature-mismatch", "no-sink", "recovery-adequate", "fouled-hx"],
    correctCauseIds: ["fouled-hx"],
    candidateActionIds: ["fit-recovery-hx", "vent-to-atmosphere", "clean-hx", "upsize-hx"],
    correctActionIds: ["clean-hx"],
    improvementActionIds: ["upsize-hx"],
    debrief:
      "The source and sink are fine — the exchanger isn't. An effectiveness of 37.5% with visible scaling, on a unit that used to perform better, is fouling: scale and dirt throttle the heat transfer and push up the approach temperature, so the boiler makes up the difference. Clean or descale it (and treat the water) to restore effectiveness. If it's genuinely undersized rather than dirty, a larger exchanger is the answer — but clean first and measure before spending on new kit.",
    faultChain: [
      "Outlet only 50 °C from a 100 °C source, 20 °C inlet",
      "Effectiveness 30/80 = 37.5% — scaled tubes",
      "Recovering only 250.8 kW; boiler covers the rest",
      "Fix: clean / descale the exchanger (upsize only if truly undersized)",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "flash-steam",
    title: "Case 5 — Steam from the condensate",
    tag: "Flash recovery",
    brief:
      "A plant's high-pressure condensate is dumped through a trap to a vented receiver, and you can see it flashing off as steam to the roof. That flash steam is recoverable low-pressure steam for heating. Quantify what's blowing away.",
    knownFacts: [
      "Condensate flow 2,000 kg/h; ~10% flashes to low-pressure steam",
      "Latent heat of the flash steam ≈ 2,200 kJ/kg",
      "1 kW = 3,600 kJ/h",
      "Runs ~6,000 h/yr; displaced heat £0.06/kWh; flash tank ≈ £10,000",
    ],
    readings: [
      { label: "Condensate flow", value: "2,000", unit: "kg/h" },
      { label: "Flash fraction", value: "10", unit: "%", note: "to LP steam" },
      { label: "Latent heat", value: "2,200", unit: "kJ/kg" },
      { label: "Run hours", value: "6,000", unit: "h/yr", note: "visible plume to roof" },
    ],
    refTables: ["heatrate", "prices"],
    calcParts: [
      {
        id: "flash-rate",
        prompt: "How much flash steam is being produced?",
        unit: "kg/h",
        answer: 200,
        tol: 5,
        tolType: "abs",
        hints: ["Flash fraction × condensate flow.", "0.10 × 2,000."],
        worked: "0.10 × 2,000 = 200 kg/h of low-pressure steam.",
      },
      {
        id: "heat-kw",
        prompt: "How much heat is that in kW?",
        unit: "kW",
        answer: 122,
        tol: 0.05,
        tolType: "rel",
        hints: ["kg/h × latent heat ÷ 3,600.", "200 × 2,200 ÷ 3,600."],
        worked: "200 × 2,200 = 440,000 kJ/h ÷ 3,600 ≈ 122 kW.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 44000,
        tol: 0.06,
        tolType: "rel",
        hints: ["kW × hours × price.", "122 × 6,000 × 0.06."],
        worked: "122 kW × 6,000 h × £0.06 ≈ £44,000/yr — for a ~£10,000 flash tank.",
      },
    ],
    candidateCauseIds: ["no-sink", "recovery-adequate", "flash-steam-wasted", "vent-heat-wasted"],
    correctCauseIds: ["flash-steam-wasted"],
    candidateActionIds: ["fit-flash-recovery", "recover-condenser-heat", "fit-hrv", "vent-to-atmosphere"],
    correctActionIds: ["fit-flash-recovery"],
    improvementActionIds: [],
    debrief:
      "A plume of steam off a condensate receiver is money to the sky. High-pressure condensate flashes ~10% of its flow to low-pressure steam when its pressure drops; a flash tank captures it for low-pressure heating instead of venting it — ~£44,000/yr here for a ~£10,000 tank, one of the highest-return projects in any steam plant. It only applies where a steam/condensate system exists and there's a low-pressure steam use to feed.",
    faultChain: [
      "2,000 kg/h condensate flashing ~10% to steam, vented",
      "200 kg/h × 2,200 kJ/kg ≈ 122 kW",
      "≈ £44,000/yr for a ~£10,000 flash tank",
      "Fix: fit a flash tank to recover the flash steam",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "timing-mismatch",
    title: "Case 6 — Right heat, wrong time",
    tag: "Timing",
    brief:
      "A proposed scheme would recover heat from a process that only runs 5–8 PM on weekdays, to feed space heating that's mostly needed overnight in winter. The heat is real, but supply and demand barely overlap, so the recovery kit would sit idle most of the time. Work out why the payback looks poor — and what fixes it.",
    knownFacts: [
      "Recovery cost ≈ £50,000",
      "If fully used, the heat available is worth 500,000 kWh/yr",
      "But supply and demand only overlap ~20% of the time",
      "A thermal store could lift the overlap to ~60%; displaced heat £0.06/kWh",
    ],
    readings: [
      { label: "Recovery cost", value: "50,000", unit: "£" },
      { label: "Heat available (full use)", value: "500,000", unit: "kWh/yr" },
      { label: "Supply/demand overlap now", value: "20", unit: "%", note: "process 5–8 PM vs overnight heat" },
      { label: "Overlap with a store", value: "60", unit: "%" },
    ],
    refTables: ["matching", "prices"],
    calcParts: [
      {
        id: "full-saving",
        prompt: "What would the saving be at full utilisation?",
        unit: "£/yr",
        answer: 30000,
        tol: 0.04,
        tolType: "rel",
        hints: ["Available kWh × price.", "500,000 × 0.06."],
        worked: "500,000 × £0.06 = £30,000/yr (a ~1.7-year payback — if you could use it all).",
      },
      {
        id: "actual-saving",
        prompt: "What is the real saving at only 20% overlap?",
        unit: "£/yr",
        answer: 6000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Available kWh × overlap × price.", "500,000 × 0.20 × 0.06."],
        worked: "500,000 × 0.20 × £0.06 = £6,000/yr → an ~8-year payback. Marginal.",
      },
      {
        id: "store-saving",
        prompt: "What would it be with a thermal store lifting overlap to 60%?",
        unit: "£/yr",
        answer: 18000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Available kWh × new overlap × price.", "500,000 × 0.60 × 0.06."],
        worked: "500,000 × 0.60 × £0.06 = £18,000/yr → a ~2.8-year payback. Now it works.",
      },
    ],
    candidateCauseIds: ["temperature-mismatch", "recovery-adequate", "timing-mismatch", "no-sink"],
    correctCauseIds: ["timing-mismatch"],
    candidateActionIds: ["add-thermal-store", "reschedule-process", "install-anyway", "vent-to-atmosphere"],
    correctActionIds: ["add-thermal-store"],
    improvementActionIds: ["reschedule-process"],
    debrief:
      "This is the classic timing failure: the heat is there and the demand is there, but not at the same time, so utilisation — and payback — collapse (£6,000/yr, ~8 years). Don't just install it as-is. A thermal store decouples supply from demand, banking the evening process heat for the overnight load and lifting the saving to ~£18,000/yr (~2.8-year payback). Rescheduling the process to coincide with demand does the same for free where it's possible. Utilisation is everything in waste-heat economics.",
    faultChain: [
      "Process heat at 5–8 PM, heating need overnight → 20% overlap",
      "Saving £6,000/yr vs £30,000 at full use → ~8-yr payback",
      "A store lifting overlap to 60% → £18,000/yr",
      "Fix: add thermal storage (or reschedule the process)",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "process-exhaust",
    title: "Case 7 — The oven that heats the car park",
    tag: "Process exhaust",
    brief:
      "A bakery oven blasts 165 °C exhaust to atmosphere while the building draws in cold fresh air. A heat-recovery exchanger could use that hot exhaust to preheat the incoming combustion or fresh air. High grade, continuous, and a sink right next door — this is the textbook quick win. Quantify it.",
    knownFacts: [
      "Oven exhaust 2 m³/s at 165 °C; incoming air 15 °C",
      "A recovery exchanger would be ~50% effective",
      "Air heat rate ≈ 1.2 kW per (m³/s·°C)",
      "Runs ~8,000 h/yr; displaced heat £0.06/kWh; HX ≈ £30,000",
    ],
    readings: [
      { label: "Exhaust flow", value: "2", unit: "m³/s" },
      { label: "Exhaust temperature", value: "165", unit: "°C" },
      { label: "Incoming air", value: "15", unit: "°C" },
      { label: "Exchanger effectiveness", value: "50", unit: "%" },
    ],
    refTables: ["heatrate", "effectiveness", "prices"],
    calcParts: [
      {
        id: "max-rise",
        prompt: "What is the maximum possible temperature rise for the incoming air?",
        unit: "°C",
        answer: 150,
        tol: 3,
        tolType: "abs",
        hints: ["Exhaust − incoming air temperature.", "165 − 15."],
        worked: "165 − 15 = 150 °C maximum possible rise.",
      },
      {
        id: "recovered-kw",
        prompt: "How much heat does the 50%-effective exchanger recover?",
        unit: "kW",
        answer: 180,
        tol: 0.05,
        tolType: "rel",
        hints: ["1.2 × flow × (effectiveness × max rise).", "1.2 × 2 × (0.50 × 150)."],
        worked: "1.2 × 2 × (0.50 × 150 = 75 °C) = 180 kW recovered.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 86400,
        tol: 0.05,
        tolType: "rel",
        hints: ["kW × hours × price.", "180 × 8,000 × 0.06."],
        worked: "180 kW × 8,000 h × £0.06 = £86,400/yr — a payback well under a year.",
      },
    ],
    candidateCauseIds: ["flue-heat-wasted", "no-sink", "recovery-adequate", "process-exhaust-wasted"],
    correctCauseIds: ["process-exhaust-wasted"],
    candidateActionIds: ["fit-economiser", "fit-recovery-hx", "vent-to-atmosphere", "clean-hx"],
    correctActionIds: ["fit-recovery-hx"],
    improvementActionIds: [],
    debrief:
      "High-grade, continuous process exhaust with a sink right beside it is the best waste-heat opportunity going — paybacks under a year are common. Recovering the oven exhaust to preheat incoming air saves ~£86,400/yr here. The higher the temperature and the more continuous the process, the better the case; the closer the sink, the lower the ductwork cost. Industrial plants running 24/7 are full of these.",
    faultChain: [
      "165 °C oven exhaust vented; cold air drawn in",
      "50% HX recovers 1.2 × 2 × 75 = 180 kW",
      "≈ £86,400/yr; under a year payback",
      "Fix: fit a process-exhaust heat-recovery exchanger",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "temperature-mismatch",
    title: "Case 8 — Too cool to do the job",
    tag: "Grade match",
    brief:
      "A contractor proposes piping 35 °C refrigeration condenser water straight into a 60 °C domestic-hot-water calorifier. It won't work — you can't push heat from 35 °C into a 60 °C load. But the low-grade heat isn't worthless: it can preheat the cold mains feed before the boiler finishes the job. Work out the real, useful saving.",
    knownFacts: [
      "Waste heat available at 35 °C (refrigeration condenser)",
      "DHW target 60 °C; cold mains feed 10 °C; flow 1 kg/s",
      "The 35 °C source can preheat the cold feed to ~30 °C",
      "Runs ~4,000 h/yr; water cp 4.18 kJ/kg·K; displaced heat £0.06/kWh",
    ],
    readings: [
      { label: "Waste-heat grade", value: "35", unit: "°C", note: "too low for a 60 °C load directly" },
      { label: "DHW target", value: "60", unit: "°C" },
      { label: "Cold mains feed", value: "10", unit: "°C" },
      { label: "Preheat achievable", value: "30", unit: "°C", note: "with the 35 °C source" },
    ],
    refTables: ["heatrate", "matching"],
    calcParts: [
      {
        id: "boiler-now",
        prompt: "What heat must the boiler add now (10 → 60 °C)?",
        unit: "kW",
        answer: 209,
        tol: 0.05,
        tolType: "rel",
        hints: ["ṁ × cp × (target − cold feed).", "1 × 4.18 × (60 − 10)."],
        worked: "1 × 4.18 × 50 = 209 kW from the boiler.",
      },
      {
        id: "boiler-after",
        prompt: "What must the boiler add if the feed is preheated to 30 °C?",
        unit: "kW",
        answer: 125.4,
        tol: 0.05,
        tolType: "rel",
        hints: ["ṁ × cp × (target − preheated feed).", "1 × 4.18 × (60 − 30)."],
        worked: "1 × 4.18 × 30 = 125.4 kW — the boiler only finishes the job.",
      },
      {
        id: "saving",
        prompt: "What is the preheat saving worth per year?",
        unit: "£/yr",
        answer: 20064,
        tol: 0.06,
        tolType: "rel",
        hints: ["(boiler now − boiler after) × hours × price.", "(209 − 125.4) × 4,000 × 0.06."],
        worked: "(209 − 125.4) = 83.6 kW; × 4,000 h × £0.06 ≈ £20,064/yr.",
      },
    ],
    candidateCauseIds: ["timing-mismatch", "recovery-adequate", "temperature-mismatch", "no-sink"],
    correctCauseIds: ["temperature-mismatch"],
    candidateActionIds: ["use-for-preheat", "pipe-direct-hot-sink", "vent-to-atmosphere", "heat-pump-upgrade"],
    correctActionIds: ["use-for-preheat"],
    improvementActionIds: ["heat-pump-upgrade"],
    debrief:
      "Heat only flows downhill in temperature, so 35 °C water can't directly serve a 60 °C load — piping it straight in does nothing. But low-grade heat is still useful at the right place: here it preheats the cold mains from 10 to 30 °C, halving the boiler's lift and saving ~£20,064/yr. Match the grade to the sink — low-grade heat suits preheating, pools and underfloor. Where you genuinely need a higher temperature, a heat pump can upgrade the low-grade source (at the cost of some electricity).",
    faultChain: [
      "35 °C source can't feed a 60 °C load directly (temperature mismatch)",
      "But it preheats the cold feed 10 → 30 °C",
      "Boiler load 209 → 125.4 kW ≈ £20,064/yr saved",
      "Fix: use the low-grade heat for preheat (or a heat pump to upgrade it)",
    ],
  },
];

export function getWhrCase(id: string): WhrCase | undefined {
  return WHR_CASES.find((c) => c.id === id);
}
