/**
 * Thermal-energy-storage diagnostic cases — sensible vs latent sizing, the
 * cooling-storage business case, the flat-tariff trap, poor stratification,
 * standing losses, seasonal scale, a charging-schedule fault, and a PCM
 * transition-temperature mismatch. A mix of quantify, reason and judgement.
 * Numbers consistent with lib/tesTables.ts. Built on the shared diagnostics core.
 *
 * The discipline: storage stores energy, not money. It only earns from a time
 * value — a price spread, a demand charge, avoided plant — and only if the store
 * is the right medium, well stratified, well insulated and charged at the right
 * time. On a flat tariff, a perfectly engineered store saves nothing.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const TES_CAUSES: CauseDef[] = [
  { id: "sensible-too-bulky", label: "Sensible (water) store too bulky for the space" },
  { id: "storage-undervalued", label: "A clear storage opportunity (price spread) not being captured" },
  { id: "flat-tariff", label: "Flat tariff / no price spread — storage can't pay" },
  { id: "poor-stratification", label: "Store mixing (poor stratification) — usable energy lost" },
  { id: "standing-losses", label: "Poor insulation — the store bleeds its stored energy" },
  { id: "seasonal-too-small", label: "Seasonal store too small — loses proportionally too much" },
  { id: "wrong-charge-schedule", label: "Store charged at the wrong time (controls error)" },
  { id: "pcm-wrong-temp", label: "PCM transition temperature mismatched to the application" },
  { id: "oversized-store", label: "Store oversized — excess standing loss for no benefit" },
  { id: "storage-adequate", label: "Storage appropriate / not needed — no fault" },
];

export const TES_ACTIONS: ActionDef[] = [
  { id: "reschedule-charging", label: "Reschedule charging to off-peak / night (controls)", tier: 1 },
  { id: "get-tou-tariff", label: "Move to a time-of-use tariff before storing", tier: 1 },
  { id: "dont-install", label: "Don't install storage here", tier: 1 },
  { id: "fix-stratification", label: "Restore stratification (diffusers, connection heights, slim tank)", tier: 2 },
  { id: "insulate-store", label: "Insulate / lag the store", tier: 2 },
  { id: "select-correct-pcm", label: "Select a PCM matched to the application temperature", tier: 2 },
  { id: "use-ice-latent", label: "Use ice / latent storage for density", tier: 3 },
  { id: "install-thermal-store", label: "Install a thermal (chilled-water / ice) store", tier: 3 },
  { id: "downsize-plant", label: "Downsize the chiller / heat pump (storage covers the peak)", tier: 3 },
  { id: "district-scale-only", label: "Only build seasonal storage at district scale", tier: 3 },
  { id: "bigger-tank", label: "Fit a bigger tank", tier: 3 },
  { id: "add-more-pcm", label: "Add more of the same PCM", tier: 2 },
  { id: "run-plant-peak", label: "Keep making heat/coolth on-peak (do nothing)", tier: 1 },
];

export type TesRefTable = "sensible" | "latent" | "arbitrage" | "stratification" | "scale" | "prices";

export interface TesCase extends DiagnosticCase {
  refTables: TesRefTable[];
}

export const TES_CASES: TesCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "ice-vs-water",
    title: "Case 1 — No room for a water tank",
    tag: "Sensible vs latent",
    brief:
      "A plant room needs to store 500 kWh of cooling overnight, but there's no room for the enormous chilled-water tank that would take. Ice stores the same coolth in a fraction of the volume, thanks to the latent heat of melting. Quantify the difference.",
    knownFacts: [
      "Cooling to store: 500 kWh",
      "Chilled-water store would use an 8 °C temperature band",
      "Water specific heat 4.18 kJ/kg·K; ice latent heat 334 kJ/kg",
      "Mass (kg) ≈ volume in litres for water/ice",
    ],
    readings: [
      { label: "Cooling to store", value: "500", unit: "kWh" },
      { label: "Chilled-water band", value: "8", unit: "°C" },
      { label: "Water specific heat", value: "4.18", unit: "kJ/kg·K" },
      { label: "Ice latent heat", value: "334", unit: "kJ/kg" },
    ],
    refTables: ["sensible", "latent"],
    calcParts: [
      {
        id: "water-mass",
        prompt: "What mass of chilled water would store 500 kWh over an 8 °C band?",
        unit: "tonnes",
        answer: 53.8,
        tol: 0.05,
        tolType: "rel",
        hints: [
          "Mass = energy ÷ (c × ΔT). Convert 500 kWh to kJ (×3,600) first; ÷1,000 for tonnes.",
          "500 × 3,600 ÷ (4.18 × 8) ÷ 1,000.",
        ],
        worked: "500 × 3,600 = 1,800,000 kJ; ÷ (4.18 × 8 = 33.4) = 53,800 kg ≈ 53.8 tonnes (≈ 54 m³).",
      },
      {
        id: "ice-mass",
        prompt: "What mass of ice would store the same 500 kWh?",
        unit: "tonnes",
        answer: 5.4,
        tol: 0.06,
        tolType: "rel",
        hints: ["Mass = energy ÷ latent heat.", "1,800,000 ÷ 334 ÷ 1,000."],
        worked: "1,800,000 ÷ 334 = 5,390 kg ≈ 5.4 tonnes — about a tenth of the water store.",
      },
      {
        id: "ratio",
        prompt: "How many times smaller is the ice store?",
        unit: "×",
        answer: 10,
        tol: 1,
        tolType: "abs",
        hints: ["Water mass ÷ ice mass.", "53.8 ÷ 5.4."],
        worked: "53.8 ÷ 5.4 ≈ 10× — the latent-heat density advantage in action.",
      },
    ],
    candidateCauseIds: ["sensible-too-bulky", "storage-undervalued", "oversized-store", "storage-adequate"],
    correctCauseIds: ["sensible-too-bulky"],
    candidateActionIds: ["use-ice-latent", "install-thermal-store", "bigger-tank", "run-plant-peak"],
    correctActionIds: ["use-ice-latent"],
    improvementActionIds: [],
    debrief:
      "Melting ice absorbs 334 kJ/kg — equivalent to heating the same water by about 80 °C sensibly — so an ice store holds the same cooling in roughly a tenth of the volume of a chilled-water tank. Where space is tight, that density transforms the cooling case. Sensible water storage is simpler and cheaper where volume isn't the constraint; latent (ice/PCM) wins when it is.",
    faultChain: [
      "Need to store 500 kWh of cooling; no room for the water tank",
      "Water: ~53.8 tonnes; ice: ~5.4 tonnes",
      "Ice store ~10× smaller for the same coolth",
      "Fix: use ice / latent storage for the density",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "cooling-business-case",
    title: "Case 2 — Cheap nights, expensive afternoons",
    tag: "Load shifting",
    brief:
      "An office chiller runs flat-out through the hot afternoon — exactly when both cooling demand and electricity prices peak. An ice store charged overnight on cheap power could meet the afternoon load instead, cutting the energy bill and the peak demand. Build the business case.",
    knownFacts: [
      "500 kWh of chiller electricity could be shifted from peak to off-peak each day",
      "Peak £0.25/kWh, off-peak £0.08/kWh; ~260 cooling days/yr",
      "The store would cut the site's peak demand by 150 kW",
      "Demand charge £5/kW/month; store ≈ £75,000",
    ],
    readings: [
      { label: "Daily energy shifted", value: "500", unit: "kWh" },
      { label: "Peak / off-peak price", value: "0.25 / 0.08", unit: "£/kWh" },
      { label: "Peak demand cut", value: "150", unit: "kW" },
      { label: "Cooling days", value: "260", unit: "/yr" },
    ],
    refTables: ["arbitrage", "prices"],
    calcParts: [
      {
        id: "energy-saving",
        prompt: "What is the annual energy-cost saving from the arbitrage?",
        unit: "£/yr",
        answer: 22100,
        tol: 0.05,
        tolType: "rel",
        hints: ["(peak − off-peak) × daily kWh × days.", "(0.25 − 0.08) × 500 × 260."],
        worked: "(0.25 − 0.08) × 500 × 260 = £0.17 × 130,000 = £22,100/yr.",
      },
      {
        id: "demand-saving",
        prompt: "What is the annual demand-charge saving from cutting 150 kW?",
        unit: "£/yr",
        answer: 9000,
        tol: 0.05,
        tolType: "rel",
        hints: ["kW cut × £/kW/month × 12.", "150 × 5 × 12."],
        worked: "150 × £5 × 12 = £9,000/yr off the capacity charge.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback on the £75,000 store (energy + demand)?",
        unit: "years",
        answer: 2.4,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ (energy saving + demand saving).", "75,000 ÷ (22,100 + 9,000)."],
        worked: "£75,000 ÷ £31,100 ≈ 2.4 years — before the avoided cost of a smaller chiller.",
      },
    ],
    candidateCauseIds: ["storage-undervalued", "flat-tariff", "storage-adequate", "oversized-store"],
    correctCauseIds: ["storage-undervalued"],
    candidateActionIds: ["install-thermal-store", "downsize-plant", "run-plant-peak", "dont-install"],
    correctActionIds: ["install-thermal-store"],
    improvementActionIds: ["downsize-plant"],
    debrief:
      "Cooling storage stacks three benefits: cheaper energy (£22,100/yr of arbitrage), lower demand charges (£9,000/yr), and — the bonus — a smaller chiller, since the store covers the peak so the plant is sized to the average. The energy and demand savings alone give a ~2.4-year payback; the plant-downsizing capital often transforms it further. A wide peak/off-peak spread is the engine of the whole case.",
    faultChain: [
      "Chiller peaks with the tariff every afternoon",
      "Shifting 500 kWh/day saves £22,100 energy + £9,000 demand",
      "~2.4-yr payback, better with chiller downsizing",
      "Fix: install an ice store (and downsize the chiller)",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "flat-tariff",
    title: "Case 3 — Storage on a flat tariff",
    tag: "Economics",
    brief:
      "A keen facilities manager wants a thermal store to 'save energy'. But the site is on a flat tariff — the same price all day — with no demand charge. Storage shifts energy in time; it doesn't create any. Work out what the store would actually save here.",
    knownFacts: [
      "Flat tariff £0.15/kWh, all hours; no demand charge",
      "Proposed store would shift 500 kWh/day over 260 days",
      "Round-trip losses ~10% of the energy stored",
      "Store ≈ £60,000",
    ],
    readings: [
      { label: "Tariff", value: "0.15", unit: "£/kWh", note: "flat — all hours" },
      { label: "Demand charge", value: "none", unit: "" },
      { label: "Energy shifted", value: "500", unit: "kWh/day" },
      { label: "Round-trip loss", value: "10", unit: "%" },
    ],
    refTables: ["arbitrage", "prices"],
    calcParts: [
      {
        id: "spread",
        prompt: "What is the price spread between charging and discharging?",
        unit: "£/kWh",
        answer: 0,
        tol: 0.001,
        tolType: "abs",
        hints: ["Discharge price − charge price, on a flat tariff.", "0.15 − 0.15."],
        worked: "0.15 − 0.15 = £0 — there's no spread to arbitrage.",
      },
      {
        id: "arbitrage",
        prompt: "What is the annual arbitrage saving?",
        unit: "£/yr",
        answer: 0,
        tol: 0.001,
        tolType: "abs",
        hints: ["Spread × energy shifted × days.", "0 × 500 × 260."],
        worked: "£0 × 130,000 kWh = £0. Storage saves nothing on a flat tariff.",
      },
      {
        id: "loss-cost",
        prompt: "What do the round-trip losses cost per year?",
        unit: "£/yr",
        answer: 1950,
        tol: 0.06,
        tolType: "rel",
        hints: ["Loss fraction × energy × tariff × days.", "0.10 × 500 × 0.15 × 260."],
        worked: "0.10 × 500 × £0.15 × 260 = £1,950/yr — the store actually loses money here.",
      },
    ],
    candidateCauseIds: ["flat-tariff", "storage-undervalued", "oversized-store", "storage-adequate"],
    correctCauseIds: ["flat-tariff"],
    candidateActionIds: ["dont-install", "get-tou-tariff", "install-thermal-store", "bigger-tank"],
    correctActionIds: ["dont-install"],
    improvementActionIds: ["get-tou-tariff"],
    debrief:
      "Storage stores energy, not money — its value comes entirely from a time difference in price. On a flat tariff with no demand charge there's no spread to exploit, so the store saves nothing and actually loses ~£1,950/yr to its own round-trip losses. The right move is not to install it (or, better, first move to a time-of-use tariff that creates the spread, then revisit). Engineering a perfect store against a flat tariff is effort wasted.",
    faultChain: [
      "Flat £0.15 tariff, no demand charge",
      "Price spread £0 → £0 arbitrage saving",
      "Round-trip losses cost ~£1,950/yr",
      "Fix: don't install (or get a time-of-use tariff first)",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "stratification",
    title: "Case 4 — The tank that mixed itself",
    tag: "Stratification",
    brief:
      "A 2,000-litre thermal store is charged to 70 °C, but the high-velocity inlet pipe stirs the whole tank so it sits at one uniform temperature instead of hot-at-top, cold-at-bottom. The heating load needs water at 55 °C or above. Work out why the 'full' tank delivers almost nothing.",
    knownFacts: [
      "2,000 litre store; charged 70 °C, cold return 30 °C",
      "The load needs water at ≥ 55 °C to be useful",
      "Poor pipework mixes the tank to a single average temperature",
      "Water specific heat 4.18 kJ/kg·K",
    ],
    readings: [
      { label: "Tank volume", value: "2,000", unit: "L" },
      { label: "Charge / return temp", value: "70 / 30", unit: "°C" },
      { label: "Temperature needed", value: "55", unit: "°C" },
      { label: "Tank state", value: "fully mixed", note: "high-velocity inlet" },
    ],
    refTables: ["stratification", "sensible"],
    calcParts: [
      {
        id: "stored",
        prompt: "How much energy is stored across the 70→30 °C band?",
        unit: "kWh",
        answer: 92.9,
        tol: 0.04,
        tolType: "rel",
        hints: ["Q = m × c × ΔT, ÷ 3,600 for kWh. m ≈ 2,000 kg, ΔT = 40.", "2,000 × 4.18 × 40 ÷ 3,600."],
        worked: "2,000 × 4.18 × 40 = 334,400 kJ ÷ 3,600 ≈ 92.9 kWh stored.",
      },
      {
        id: "mixed-temp",
        prompt: "If fully mixed, what temperature does the tank sit at?",
        unit: "°C",
        answer: 50,
        tol: 2,
        tolType: "abs",
        hints: ["A mixed tank sits at the average of its hot and cold contents.", "(70 + 30) ÷ 2."],
        worked: "(70 + 30) ÷ 2 = 50 °C — the whole tank, top to bottom.",
      },
      {
        id: "shortfall",
        prompt: "By how much does the mixed tank fall short of the 55 °C the load needs?",
        unit: "°C",
        answer: 5,
        tol: 1,
        tolType: "abs",
        hints: ["Required temperature − mixed temperature.", "55 − 50."],
        worked: "55 − 50 = 5 °C short — so the 92.9 kWh 'in the tank' is unusable. A stratified tank would deliver 70 °C off the top.",
      },
    ],
    candidateCauseIds: ["poor-stratification", "standing-losses", "oversized-store", "storage-adequate"],
    correctCauseIds: ["poor-stratification"],
    candidateActionIds: ["fix-stratification", "bigger-tank", "insulate-store", "install-thermal-store"],
    correctActionIds: ["fix-stratification"],
    improvementActionIds: [],
    debrief:
      "Stratification is the single most important design feature of a store: keep hot at the top and cold at the bottom and you draw usable 70 °C water off the top until the cold front arrives. Stir the tank and it sits at the 50 °C average — below the 55 °C the load needs — so a tank that's 'full' of energy delivers almost none of it usefully (and gives the heat source a hot return, hurting boiler/heat-pump efficiency too). Fix the pipework: low-velocity diffusers, correct connection heights, a tall slim tank. A bigger tank would just mix more water.",
    faultChain: [
      "2,000 L 'full' at a notional 70 °C, but stirred",
      "Mixed tank sits at the 50 °C average — 5 °C below the 55 °C needed",
      "92.9 kWh stored, ~none usable",
      "Fix: restore stratification (diffusers, connections, geometry)",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "standing-losses",
    title: "Case 5 — Heating the plant room",
    tag: "Standing loss",
    brief:
      "A thermal store charged each night at 70 °C is poorly insulated, sitting in a 20 °C plant room with bare flanges and thin lagging. It bleeds heat continuously — much of the energy you banked overnight has leaked away before the morning peak. Quantify the standing loss.",
    knownFacts: [
      "Store surface area ~12 m²; surface 70 °C, room 20 °C",
      "Poorly lagged: U ≈ 2 W/m²K; well insulated would be ~0.4 W/m²K",
      "Stored heat displaces gas at £0.06/kWh",
      "Loses heat continuously, 8,760 h/yr; insulation upgrade ≈ £500",
    ],
    readings: [
      { label: "Surface area", value: "12", unit: "m²" },
      { label: "Surface / room temp", value: "70 / 20", unit: "°C" },
      { label: "U now / insulated", value: "2.0 / 0.4", unit: "W/m²K" },
      { label: "Hours", value: "8,760", unit: "h/yr" },
    ],
    refTables: ["sensible", "prices"],
    calcParts: [
      {
        id: "loss-now",
        prompt: "What is the standing-loss rate now (Q = U·A·ΔT)?",
        unit: "kW",
        answer: 1.2,
        tol: 0.05,
        tolType: "rel",
        hints: ["U × A × ΔT ÷ 1,000. ΔT = 70 − 20.", "2.0 × 12 × 50 ÷ 1,000."],
        worked: "2.0 × 12 × 50 = 1,200 W = 1.2 kW lost continuously.",
      },
      {
        id: "loss-saved",
        prompt: "How much of that loss would proper insulation remove?",
        unit: "kW",
        answer: 0.96,
        tol: 0.06,
        tolType: "rel",
        hints: ["Insulated loss = 0.4 × 12 × 50; saving = now − insulated.", "1.2 − (0.4 × 12 × 50 ÷ 1,000)."],
        worked: "Insulated: 0.4 × 12 × 50 = 240 W; saving = 1.2 − 0.24 = 0.96 kW.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 505,
        tol: 0.07,
        tolType: "rel",
        hints: ["kW saved × hours × price.", "0.96 × 8,760 × 0.06."],
        worked: "0.96 × 8,760 × £0.06 ≈ £505/yr — and the store actually holds its overnight charge.",
      },
    ],
    candidateCauseIds: ["standing-losses", "poor-stratification", "oversized-store", "storage-adequate"],
    correctCauseIds: ["standing-losses"],
    candidateActionIds: ["insulate-store", "fix-stratification", "bigger-tank", "run-plant-peak"],
    correctActionIds: ["insulate-store"],
    improvementActionIds: [],
    debrief:
      "A store only helps if it keeps what you put in. Bare flanges and thin lagging here leak 1.2 kW continuously — banked overnight heat warming the plant room instead of the building. Proper insulation (and lagged connections, with anti-thermosyphon loops on the pipes) cuts ~0.96 kW, ~£505/yr, and — just as important — means the morning peak is actually met from the store. Standing loss is the quiet tax on every poorly insulated tank.",
    faultChain: [
      "70 °C store, bare flanges, thin lagging, 20 °C room",
      "U·A·ΔT = 2 × 12 × 50 = 1.2 kW lost continuously",
      "Insulating saves ~0.96 kW ≈ £505/yr (and keeps the charge)",
      "Fix: insulate the store and its connections",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "seasonal-scale",
    title: "Case 6 — A seasonal store for one house",
    tag: "Seasonal",
    brief:
      "A developer wants to store summer solar heat for winter in a single house — a small interseasonal tank. Over months, even insulated stores lose heat, and small ones lose proportionally far more, because loss scales with surface area while stored energy scales with volume. Compare the two scales.",
    knownFacts: [
      "Small store: volume 200 m³, surface area 200 m²",
      "District store: volume 20,000 m³, surface area 4,500 m²",
      "Heat loss ∝ surface area; stored energy ∝ volume",
      "Loss-to-energy ∝ surface-area-to-volume ratio",
    ],
    readings: [
      { label: "Small store volume", value: "200", unit: "m³" },
      { label: "Small store surface", value: "200", unit: "m²" },
      { label: "District store volume", value: "20,000", unit: "m³" },
      { label: "District store surface", value: "4,500", unit: "m²" },
    ],
    refTables: ["scale"],
    calcParts: [
      {
        id: "small-sv",
        prompt: "What is the surface-to-volume ratio of the small store?",
        unit: "m²/m³",
        answer: 1.0,
        tol: 0.05,
        tolType: "abs",
        hints: ["Surface ÷ volume.", "200 ÷ 200."],
        worked: "200 ÷ 200 = 1.0 m²/m³.",
      },
      {
        id: "large-sv",
        prompt: "What is the surface-to-volume ratio of the district store?",
        unit: "m²/m³",
        answer: 0.225,
        tol: 0.04,
        tolType: "rel",
        hints: ["Surface ÷ volume.", "4,500 ÷ 20,000."],
        worked: "4,500 ÷ 20,000 = 0.225 m²/m³.",
      },
      {
        id: "ratio",
        prompt: "How many times more loss-per-unit-stored does the small store suffer?",
        unit: "×",
        answer: 4.4,
        tol: 0.1,
        tolType: "rel",
        hints: ["Small ratio ÷ large ratio.", "1.0 ÷ 0.225."],
        worked: "1.0 ÷ 0.225 ≈ 4.4× more loss per unit stored — which is why seasonal storage only works at scale.",
      },
    ],
    candidateCauseIds: ["seasonal-too-small", "standing-losses", "storage-adequate", "oversized-store"],
    correctCauseIds: ["seasonal-too-small"],
    candidateActionIds: ["district-scale-only", "install-thermal-store", "insulate-store", "bigger-tank"],
    correctActionIds: ["district-scale-only"],
    improvementActionIds: [],
    debrief:
      "Seasonal storage holds energy for months, so heat loss — which scales with surface area — has a long time to bite. But stored energy scales with volume, so larger stores lose proportionally far less: the district store here loses ~4.4× less per unit stored than the single-house one. That's why interseasonal storage is inherently a community/district technology (Danish solar district heating, BTES, ATES), not a single-building one. For this one house, the answer is don't build a seasonal store; pursue it only at district scale.",
    faultChain: [
      "Single-house seasonal store proposed",
      "Surface/volume: small 1.0 vs district 0.225 m²/m³",
      "Small store loses ~4.4× more per unit stored over the season",
      "Fix: seasonal storage only stacks up at district scale",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "charge-schedule",
    title: "Case 7 — Charging at the wrong time",
    tag: "Controls",
    brief:
      "An ice store was installed to shift cooling to off-peak — but the bills haven't moved. Logging the controls shows the BMS is charging the store during the day, on expensive peak power, then discharging it... also during the day. The kit is fine; the schedule is backwards. Quantify the prize from fixing it.",
    knownFacts: [
      "500 kWh/day of cooling could be made off-peak instead of on-peak",
      "Peak £0.25/kWh, off-peak £0.08/kWh; ~260 cooling days/yr",
      "The store and chiller are healthy — only the schedule is wrong",
      "Recommissioning the schedule is essentially no-cost",
    ],
    readings: [
      { label: "Energy mischarged", value: "500", unit: "kWh/day", note: "charged on-peak" },
      { label: "Peak / off-peak", value: "0.25 / 0.08", unit: "£/kWh" },
      { label: "Cooling days", value: "260", unit: "/yr" },
      { label: "Store & chiller", value: "healthy", note: "controls fault only" },
    ],
    refTables: ["arbitrage", "prices"],
    calcParts: [
      {
        id: "peak-cost",
        prompt: "What does charging 500 kWh/day on peak cost over the year?",
        unit: "£/yr",
        answer: 32500,
        tol: 0.05,
        tolType: "rel",
        hints: ["kWh × peak price × days.", "500 × 0.25 × 260."],
        worked: "500 × £0.25 × 260 = £32,500/yr.",
      },
      {
        id: "offpeak-cost",
        prompt: "What would charging off-peak cost?",
        unit: "£/yr",
        answer: 10400,
        tol: 0.05,
        tolType: "rel",
        hints: ["kWh × off-peak price × days.", "500 × 0.08 × 260."],
        worked: "500 × £0.08 × 260 = £10,400/yr.",
      },
      {
        id: "recoverable",
        prompt: "What is recoverable just by rescheduling the charging?",
        unit: "£/yr",
        answer: 22100,
        tol: 0.05,
        tolType: "rel",
        hints: ["Peak cost − off-peak cost.", "32,500 − 10,400."],
        worked: "£32,500 − £10,400 = £22,100/yr — at no capital cost, just a corrected schedule.",
      },
    ],
    candidateCauseIds: ["wrong-charge-schedule", "storage-undervalued", "flat-tariff", "storage-adequate"],
    correctCauseIds: ["wrong-charge-schedule"],
    candidateActionIds: ["reschedule-charging", "install-thermal-store", "bigger-tank", "run-plant-peak"],
    correctActionIds: ["reschedule-charging"],
    improvementActionIds: [],
    debrief:
      "Storage benefits depend entirely on how the system is operated — which is why you verify with logging after installation. Here the hardware is perfect but the BMS charges on peak power, throwing away the whole point of the store: £22,100/yr recoverable for the price of correcting a schedule. Always check that a store actually charges at the cheapest, most efficient times. Buying a bigger store would just mischarge more energy.",
    faultChain: [
      "Ice store installed, but bills unchanged",
      "BMS charging on-peak (£32,500) instead of off-peak (£10,400)",
      "£22,100/yr recoverable at ~no cost",
      "Fix: reschedule charging to off-peak (recommission the controls)",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "pcm-temp",
    title: "Case 8 — The PCM that never melts",
    tag: "PCM selection",
    brief:
      "PCM panels were fitted in a lightweight office ceiling to cap summer temperatures by absorbing heat as they melt. But the room peaks at 24 °C and the PCM was specified to melt at 28 °C — so it never changes phase and stores nothing. The transition temperature has to match the application.",
    knownFacts: [
      "500 kg of PCM, latent heat 180 kJ/kg",
      "Installed PCM melts at 28 °C",
      "The room only peaks at 24 °C",
      "A PCM melting at ~22 °C would engage across the comfort range",
    ],
    readings: [
      { label: "PCM mass", value: "500", unit: "kg" },
      { label: "PCM latent heat", value: "180", unit: "kJ/kg" },
      { label: "Installed melt point", value: "28", unit: "°C", note: "never reached" },
      { label: "Room peak", value: "24", unit: "°C" },
    ],
    refTables: ["latent"],
    calcParts: [
      {
        id: "capacity",
        prompt: "What latent capacity does the PCM have, if it engaged?",
        unit: "kWh",
        answer: 25,
        tol: 0.05,
        tolType: "rel",
        hints: ["Mass × latent heat ÷ 3,600.", "500 × 180 ÷ 3,600."],
        worked: "500 × 180 = 90,000 kJ ÷ 3,600 = 25 kWh of peak-shaving capacity.",
      },
      {
        id: "used-now",
        prompt: "How much of that is actually used at a 28 °C melt point (room peaks 24 °C)?",
        unit: "kWh",
        answer: 0,
        tol: 0.1,
        tolType: "abs",
        hints: ["If the room never reaches the melt point, the PCM never changes phase.", "Room 24 °C < melt 28 °C → 0."],
        worked: "The room never reaches 28 °C, so the PCM never melts — 0 kWh used. The 25 kWh of capacity is dormant.",
      },
      {
        id: "used-correct",
        prompt: "How much would a correctly specified 22 °C PCM deliver?",
        unit: "kWh",
        answer: 25,
        tol: 0.05,
        tolType: "rel",
        hints: ["A 22 °C PCM melts as the room rises through 22 °C, using its full capacity.", "The full 25 kWh."],
        worked: "Melting at 22 °C, it engages across the comfort range and delivers the full ~25 kWh of peak-shaving.",
      },
    ],
    candidateCauseIds: ["pcm-wrong-temp", "sensible-too-bulky", "storage-adequate", "oversized-store"],
    correctCauseIds: ["pcm-wrong-temp"],
    candidateActionIds: ["select-correct-pcm", "add-more-pcm", "bigger-tank", "install-thermal-store"],
    correctActionIds: ["select-correct-pcm"],
    improvementActionIds: [],
    debrief:
      "A PCM's defining property is its transition temperature — it must melt and freeze at exactly the temperature the application needs. Specified at 28 °C for a room that peaks at 24 °C, it simply never changes phase, so its 25 kWh of latent capacity sits dormant. Re-specify a PCM that melts around the comfort target (~22 °C) and it engages, capping the peak and refreezing overnight. Adding more of the wrong PCM changes nothing — it still won't melt.",
    faultChain: [
      "PCM ceiling melts at 28 °C; room peaks at 24 °C",
      "25 kWh of capacity, but 0 kWh used — it never melts",
      "A 22 °C PCM would deliver the full 25 kWh",
      "Fix: select a PCM matched to the application temperature",
    ],
  },
];

export function getTesCase(id: string): TesCase | undefined {
  return TES_CASES.find((c) => c.id === id);
}
