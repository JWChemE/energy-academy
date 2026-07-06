/**
 * CHP & cogeneration diagnostic cases — heat utilisation, sizing, spark-spread
 * economics, export value, heat-exchanger fouling, short-cycling, the carbon
 * case against a decarbonising grid, and engine condition. A mix of
 * quantify-the-number, reason-from-symptoms and judgement. Numbers are
 * consistent with lib/chpTables.ts. Built on the shared diagnostics core.
 *
 * The defining CHP discipline: a unit only earns its efficiency when its heat is
 * genuinely used. Most faults here trace back to heat that isn't — or to running
 * the machine when the economics or carbon no longer justify it.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const CHP_CAUSES: CauseDef[] = [
  { id: "heat-dumped", label: "Recovered heat being dumped — poor heat utilisation" },
  { id: "oversized-base", label: "Unit oversized for the site's base heat load" },
  { id: "no-summer-sink", label: "No year-round / summer heat sink — too few run hours" },
  { id: "no-thermal-store", label: "No thermal store — unit short-cycles (stop/start)" },
  { id: "fouled-hx", label: "Fouled exhaust-gas heat exchanger — heat recovery down" },
  { id: "engine-worn", label: "Engine worn / due overhaul — electrical efficiency down" },
  { id: "narrow-spark", label: "Narrow or negative spark spread — uneconomic to run" },
  { id: "elec-oversized-export", label: "Sized to electrical peak — surplus exported at low value" },
  { id: "grid-cleaner", label: "Grid now lower-carbon than the CHP's own electricity" },
  { id: "ph-mismatch", label: "Power-to-heat ratio mismatched to site demand" },
  { id: "heat-demand-fine", label: "Heat genuinely used — no fault" },
  { id: "controls-fault", label: "Boiler/CHP sequencing control fault" },
];

export const CHP_ACTIONS: ActionDef[] = [
  { id: "run-heat-led", label: "Operate heat-led — modulate/stop to match heat demand", tier: 1 },
  { id: "switch-off-no-heat", label: "Switch the unit off when there is no heat demand", tier: 1 },
  { id: "review-run-economics", label: "Operate to the spark spread — run only when economic", tier: 1 },
  { id: "fix-partload", label: "Run at full load (buffered) rather than poor part-load", tier: 1 },
  { id: "cap-to-elec-base", label: "Cap generation to the electrical base load (avoid low-value export)", tier: 2 },
  { id: "add-onsite-elec-load", label: "Shift on-site electrical load to self-consume more output", tier: 2 },
  { id: "service-exhaust-hx", label: "Clean / service the exhaust-gas heat exchanger", tier: 2 },
  { id: "overhaul-engine", label: "Schedule an engine top-end overhaul / service", tier: 2 },
  { id: "fit-thermal-store", label: "Fit or enlarge a thermal buffer store", tier: 3 },
  { id: "add-absorption-chiller", label: "Add an absorption chiller (trigeneration) for a summer heat sink", tier: 3 },
  { id: "add-heat-sink", label: "Add a year-round heat sink (DHW / process)", tier: 3 },
  { id: "resize-unit", label: "Right-size the unit to the base load on replacement", tier: 3 },
  { id: "switch-to-biogas", label: "Convert to biogas / biomethane (or hydrogen-ready)", tier: 3 },
  { id: "mothball-unit", label: "Mothball / decommission the unit", tier: 3 },
  { id: "install-larger-unit", label: "Install a larger unit", tier: 3 },
  { id: "increase-export", label: "Increase grid export", tier: 1 },
];

export type ChpRefTable = "efficiency" | "prices" | "carbon" | "sizing" | "sparkspread";

export interface ChpCase extends DiagnosticCase {
  refTables: ChpRefTable[];
}

export const CHP_CASES: ChpCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "heat-dumping",
    title: "Case 1 — The radiator that shouldn't be on",
    tag: "Heat utilisation",
    brief:
      "A gas-engine CHP unit is humming away in spring. Walk past the plant and the dump radiator's fan is running — it's rejecting recovered heat to atmosphere because the building doesn't need it all right now. A CHP only earns its efficiency when its heat is used. Work out what this unit is really achieving.",
    knownFacts: [
      "Fuel input 500 kW; electrical output 190 kW (38%)",
      "Heat recovered 240 kW (48%) — nameplate overall 86%",
      "Site heat demand right now is only 110 kW",
      "The balance is being rejected through the dump radiator",
    ],
    readings: [
      { label: "Fuel input", value: "500", unit: "kW" },
      { label: "Electrical output", value: "190", unit: "kW" },
      { label: "Heat recovered", value: "240", unit: "kW" },
      { label: "Site heat demand now", value: "110", unit: "kW", note: "the rest is dumped" },
      { label: "Dump radiator", value: "running", note: "should never run on a well-matched unit" },
    ],
    refTables: ["efficiency", "prices"],
    calcParts: [
      {
        id: "dumped",
        prompt: "How much heat is being dumped?",
        unit: "kW",
        answer: 130,
        tol: 5,
        tolType: "abs",
        hints: ["Heat recovered − heat the site can actually use.", "240 − 110."],
        worked: "240 − 110 = 130 kW of recovered heat rejected to atmosphere.",
      },
      {
        id: "nameplate-eff",
        prompt: "What is the nameplate overall efficiency (if all heat were used)?",
        unit: "%",
        answer: 86,
        tol: 2,
        tolType: "abs",
        hints: ["(electricity + ALL recovered heat) ÷ fuel input.", "(190 + 240) ÷ 500."],
        worked: "(190 + 240) ÷ 500 = 86% — the figure on the brochure.",
      },
      {
        id: "real-eff",
        prompt: "What is the REAL overall efficiency, counting only the heat actually used?",
        unit: "%",
        answer: 60,
        tol: 2,
        tolType: "abs",
        hints: [
          "Only useful heat counts. (electricity + USED heat) ÷ fuel input.",
          "(190 + 110) ÷ 500.",
        ],
        worked:
          "(190 + 110) ÷ 500 = 60%. With a third of its heat dumped, the '86% efficient' unit is really running at 60% — an expensive generator with a warm radiator.",
      },
    ],
    candidateCauseIds: ["heat-dumped", "heat-demand-fine", "fouled-hx", "oversized-base"],
    correctCauseIds: ["heat-dumped"],
    candidateActionIds: ["install-larger-unit", "run-heat-led", "fit-thermal-store", "add-absorption-chiller"],
    correctActionIds: ["run-heat-led"],
    improvementActionIds: ["fit-thermal-store", "add-absorption-chiller"],
    debrief:
      "The dump radiator is the tell-tale: heat the unit makes but the site can't use is being thrown away, collapsing the real efficiency from 86% to 60%. The immediate, no-cost fix is to run heat-led — modulate or stop the unit so it only makes the heat the building needs. A thermal store smooths short dips so it can run steadily rather than dump; an absorption chiller or other summer sink turns spare heat into a useful load. Buying a bigger unit would only dump more.",
    faultChain: [
      "Dump radiator running in spring — heat being rejected",
      "240 kW recovered but only 110 kW used → 130 kW dumped",
      "Real overall efficiency 60%, not the nameplate 86%",
      "Fix: run heat-led; buffer with a store; find a summer heat sink",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "spark-spread",
    title: "Case 2 — Efficient, but is it earning?",
    tag: "Economics",
    brief:
      "A 200 kWe / 300 kWth engine is running beautifully — high efficiency, heat all used. But gas prices have risen and grid electricity has fallen since it was installed. The site manager wants to know whether it's still worth running. Technical efficiency and economics are not the same thing. Work the spark spread.",
    knownFacts: [
      "200 kWe electrical, 300 kWth heat, all heat used",
      "Electrical efficiency 38%",
      "NOW: grid electricity £0.10/kWh, gas £0.085/kWh",
      "Maintenance £0.012 per kWhe; heat displaces gas at 85% boiler efficiency",
    ],
    readings: [
      { label: "Electrical output", value: "200", unit: "kW" },
      { label: "Useful heat", value: "300", unit: "kW" },
      { label: "Grid electricity price", value: "0.10", unit: "£/kWh", note: "fallen since install" },
      { label: "Gas price", value: "0.085", unit: "£/kWh", note: "risen since install" },
    ],
    refTables: ["sparkspread", "efficiency"],
    calcParts: [
      {
        id: "fuel",
        prompt: "What is the fuel input (gas burned) at 38% electrical efficiency?",
        unit: "kW",
        answer: 526,
        tol: 12,
        tolType: "abs",
        hints: ["Fuel = electrical output ÷ electrical efficiency.", "200 ÷ 0.38."],
        worked: "200 ÷ 0.38 ≈ 526 kW of gas burned.",
      },
      {
        id: "gas-cost",
        prompt: "What is the gas cost per running hour at £0.085/kWh?",
        unit: "£/h",
        answer: 44.7,
        tol: 0.06,
        tolType: "rel",
        hints: ["Fuel input × gas price.", "526 × 0.085."],
        worked: "526 × £0.085 ≈ £44.7/hour.",
      },
      {
        id: "net",
        prompt:
          "What is the NET benefit per hour? (electricity displaced + heat displaced − gas − maintenance)",
        unit: "£/h",
        answer: 2.9,
        tol: 1.5,
        tolType: "abs",
        hints: [
          "Elec displaced = 200 × 0.10. Heat displaced = 300 × (0.085 ÷ 0.85). Maintenance = 200 × 0.012.",
          "(20 + 30) − (44.7 + 2.4).",
        ],
        worked:
          "Elec 200×£0.10 = £20; heat 300×(0.085/0.85) = £30; gas £44.7; maint 200×£0.012 = £2.4. Net = 50 − 47.1 ≈ £2.9/hour — barely positive. The spark spread has all but closed.",
      },
    ],
    candidateCauseIds: ["grid-cleaner", "narrow-spark", "heat-demand-fine", "engine-worn"],
    correctCauseIds: ["narrow-spark"],
    candidateActionIds: ["mothball-unit", "install-larger-unit", "fit-thermal-store", "review-run-economics"],
    correctActionIds: ["review-run-economics"],
    improvementActionIds: ["fit-thermal-store"],
    debrief:
      "Nothing is mechanically wrong — the economics moved. At today's narrow spark spread the unit nets under £3/hour, and a bad week of prices would push it negative. The answer isn't to scrap a healthy machine but to operate it to the spread: run hard when grid prices and demand charges are high, ease off when they aren't. A thermal store makes that load-shifting possible by decoupling generation from heat supply. Mothballing is premature while it still earns.",
    faultChain: [
      "Gas up, grid power down since install",
      "Gas £44.7/h vs only £50 of energy displaced",
      "Net ≈ £2.9/hour — spark spread nearly closed",
      "Fix: operate to the spark spread; add a store to shift to high-value hours",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "low-value-export",
    title: "Case 3 — Generous to the grid",
    tag: "Export value",
    brief:
      "A 500 kWe unit was sized to the site's electrical peak. But the steady electrical base load is only 350 kW, so 150 kW is exported to the grid almost continuously — earning the wholesale export price while the site keeps importing at the much higher retail price for its peaks. Put a number on what that's costing.",
    knownFacts: [
      "500 kWe unit; site electrical base load only 350 kW",
      "≈150 kW exported continuously at £0.05/kWh (wholesale)",
      "On-site electricity displaced is worth £0.20/kWh (retail)",
      "Runs ~7,000 h/yr",
    ],
    readings: [
      { label: "Unit electrical output", value: "500", unit: "kW" },
      { label: "Site electrical base load", value: "350", unit: "kW" },
      { label: "Export price", value: "0.05", unit: "£/kWh", note: "wholesale" },
      { label: "Import price displaced", value: "0.20", unit: "£/kWh", note: "retail — 4× the export" },
      { label: "Run hours", value: "7,000", unit: "h/yr" },
    ],
    refTables: ["prices", "sizing"],
    calcParts: [
      {
        id: "surplus",
        prompt: "How much power is exported (rather than self-consumed)?",
        unit: "kW",
        answer: 150,
        tol: 5,
        tolType: "abs",
        hints: ["Unit output − site base load.", "500 − 350."],
        worked: "500 − 350 = 150 kW exported almost continuously.",
      },
      {
        id: "value-gap",
        prompt: "What is the value gap per exported kWh (self-consumption vs export)?",
        unit: "£/kWh",
        answer: 0.15,
        tol: 0.01,
        tolType: "abs",
        hints: ["Import price displaced − export price earned.", "0.20 − 0.05."],
        worked: "£0.20 − £0.05 = £0.15 lost for every kWh exported instead of used on site.",
      },
      {
        id: "annual-loss",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 157500,
        tol: 0.06,
        tolType: "rel",
        hints: ["Surplus kW × value gap × run hours.", "150 × 0.15 × 7,000."],
        worked:
          "150 × £0.15 × 7,000 ≈ £157,500/yr of value given away — because the unit was sized to the electrical peak, not the base load.",
      },
    ],
    candidateCauseIds: ["ph-mismatch", "narrow-spark", "elec-oversized-export", "heat-demand-fine"],
    correctCauseIds: ["elec-oversized-export"],
    candidateActionIds: ["add-onsite-elec-load", "increase-export", "cap-to-elec-base", "install-larger-unit"],
    correctActionIds: ["cap-to-elec-base"],
    improvementActionIds: ["add-onsite-elec-load"],
    debrief:
      "Self-consumed electricity is worth two-to-four times exported electricity, so a unit sized to electrical peak bleeds value every hour it exports. The fix is to match generation to the electrical base load (cap output, or genuinely shift more on-site load onto it to self-consume) — not, as tempting as it looks, to 'increase export', which only sells more at the low price. Building CHP is sized to base electrical load for exactly this reason.",
    faultChain: [
      "500 kWe unit on a 350 kW base load",
      "150 kW exported at £0.05 instead of displacing £0.20 import",
      "£0.15/kWh gap × 150 kW × 7,000 h ≈ £157,500/yr",
      "Fix: match generation to the electrical base load; self-consume",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "low-run-hours",
    title: "Case 4 — Idle all summer",
    tag: "Run hours",
    brief:
      "A 100 kWe / 150 kWth unit at a school only has a heat load in the heating season — come spring it shuts down and sits idle until autumn. CHP only repays its capital by running. The numbers show why this scheme is struggling, and what would rescue it.",
    knownFacts: [
      "100 kWe / 150 kWth gas engine",
      "Heat needed only Oct–Mar → runs ~2,800 h/yr",
      "Good schemes run 4,500–8,000 h/yr",
      "On-site electricity is worth £0.20/kWh",
    ],
    readings: [
      { label: "Electrical output", value: "100", unit: "kW" },
      { label: "Run hours achieved", value: "2,800", unit: "h/yr", note: "winter only" },
      { label: "Hours in a year", value: "8,760", unit: "h" },
      { label: "Summer heat sink", value: "none", note: "unit sits idle" },
    ],
    refTables: ["sizing", "prices"],
    calcParts: [
      {
        id: "capacity-factor",
        prompt: "What is the unit's capacity factor (run hours as a % of the year)?",
        unit: "%",
        answer: 32,
        tol: 2,
        tolType: "abs",
        hints: ["Run hours ÷ hours in a year × 100.", "2,800 ÷ 8,760 × 100."],
        worked: "2,800 ÷ 8,760 ≈ 32% — well below the 4,500 h (~51%) a viable scheme needs.",
      },
      {
        id: "elec-now",
        prompt: "How much electricity does it generate per year now?",
        unit: "kWh/yr",
        answer: 280000,
        tol: 0.04,
        tolType: "rel",
        hints: ["Electrical output × run hours.", "100 × 2,800."],
        worked: "100 × 2,800 = 280,000 kWh/yr.",
      },
      {
        id: "uplift",
        prompt:
          "If a summer heat sink lifted run hours to 6,500, what is the extra generation worth per year at £0.20/kWh?",
        unit: "£/yr",
        answer: 74000,
        tol: 0.06,
        tolType: "rel",
        hints: [
          "Extra hours × output = extra kWh; × price.",
          "(6,500 − 2,800) × 100 × 0.20.",
        ],
        worked:
          "(6,500 − 2,800) × 100 = 370,000 kWh extra × £0.20 ≈ £74,000/yr — the difference between a dead investment and a good one.",
      },
    ],
    candidateCauseIds: ["engine-worn", "heat-demand-fine", "oversized-base", "no-summer-sink"],
    correctCauseIds: ["no-summer-sink"],
    candidateActionIds: ["install-larger-unit", "fit-thermal-store", "add-heat-sink", "add-absorption-chiller"],
    correctActionIds: ["add-absorption-chiller"],
    improvementActionIds: ["add-heat-sink", "fit-thermal-store"],
    debrief:
      "A heat-led unit with no summer heat demand can only run half the year, and a 32% capacity factor will never repay the capital. The classic rescue is to create a year-round heat sink: an absorption chiller turns surplus summer heat into air-conditioning (trigeneration), and domestic-hot-water or process loads help too. Lifting run hours from 2,800 to 6,500 is worth roughly £74,000/yr here. A bigger unit would make the seasonality worse, not better.",
    faultChain: [
      "Heat only needed in winter → ~2,800 run hours",
      "Capacity factor ~32% — far below viable",
      "A summer sink could add ~£74,000/yr of generation",
      "Fix: add an absorption chiller / year-round heat sink",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "fouled-hx",
    title: "Case 5 — Hot exhaust, cold building",
    tag: "Heat recovery",
    brief:
      "Maintenance reports the boilers are running more than they used to, even though the CHP is on. The engine's electrical output is normal — but the exhaust leaving the unit is far hotter than its design, and the heat going into the building has dropped. The heat recovery side is the problem.",
    knownFacts: [
      "Fuel input 500 kW; electrical output still 190 kW (38% — normal)",
      "Heat recovered has fallen to 180 kW (design 240 kW, 48%)",
      "Exhaust-gas outlet 250 °C vs ~120 °C by design",
      "Boilers make up the shortfall; ~7,000 h/yr; gas £0.06/kWh, boiler 85%",
    ],
    readings: [
      { label: "Electrical output", value: "190", unit: "kW", note: "normal — engine is fine" },
      { label: "Heat recovered now", value: "180", unit: "kW", note: "design 240" },
      { label: "Exhaust-gas outlet temp", value: "250", unit: "°C", note: "design ~120 — heat not being captured" },
      { label: "Run hours", value: "7,000", unit: "h/yr" },
    ],
    refTables: ["efficiency", "prices"],
    calcParts: [
      {
        id: "thermal-now",
        prompt: "What is the thermal (heat recovery) efficiency now?",
        unit: "%",
        answer: 36,
        tol: 2,
        tolType: "abs",
        hints: ["Heat recovered ÷ fuel input × 100.", "180 ÷ 500 × 100."],
        worked: "180 ÷ 500 = 36% — down from the 48% design.",
      },
      {
        id: "shortfall",
        prompt: "How much heat is the boiler now having to make up?",
        unit: "kW",
        answer: 60,
        tol: 5,
        tolType: "abs",
        hints: ["Design recovered heat − recovered heat now.", "240 − 180."],
        worked: "240 − 180 = 60 kW the CHP no longer delivers, now burned in the boiler.",
      },
      {
        id: "cost",
        prompt: "What is that lost heat recovery costing per year in extra boiler gas?",
        unit: "£/yr",
        answer: 29650,
        tol: 0.08,
        tolType: "rel",
        hints: [
          "Boiler gas for the shortfall = kW ÷ boiler efficiency × hours × gas price.",
          "60 ÷ 0.85 × 7,000 × 0.06.",
        ],
        worked: "60 ÷ 0.85 × 7,000 × £0.06 ≈ £29,650/yr of boiler gas the CHP should have displaced.",
      },
    ],
    candidateCauseIds: ["engine-worn", "fouled-hx", "heat-dumped", "controls-fault"],
    correctCauseIds: ["fouled-hx"],
    candidateActionIds: ["overhaul-engine", "run-heat-led", "install-larger-unit", "service-exhaust-hx"],
    correctActionIds: ["service-exhaust-hx"],
    improvementActionIds: [],
    debrief:
      "The decisive clue is the split: electrical efficiency is bang on 38%, so the engine is healthy — but the exhaust is leaving at 250 °C instead of 120 °C, meaning the exhaust-gas heat exchanger is fouled and dumping recoverable heat up the stack. Thermal efficiency has slumped to 36% and the boiler is quietly burning ~£29,650/yr to cover it. Clean/service the heat exchanger. Overhauling the (healthy) engine would be chasing the wrong side of the unit.",
    faultChain: [
      "Boilers running more; exhaust 250 °C vs 120 °C design",
      "Electrical efficiency normal → engine fine; heat recovery down to 36%",
      "60 kW shortfall on the boiler ≈ £29,650/yr",
      "Fix: clean / service the exhaust-gas heat exchanger",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "short-cycling",
    title: "Case 6 — Stop, start, stop, start",
    tag: "Thermal store",
    brief:
      "A 50 kWe / 80 kWth unit serves a fluctuating summer hot-water load that often dips below its minimum output. With no buffer, the unit keeps tripping off and restarting — a dozen times a day — wearing itself out and losing generation. There's no thermal store. Quantify the cost of all that cycling.",
    knownFacts: [
      "50 kWe / 80 kWth unit; ~12 starts per day from cycling",
      "Cycling holds it to ~3,500 run hours/yr",
      "A buffer store would let it run steadily to ~6,000 h/yr",
      "On-site electricity worth £0.20/kWh",
    ],
    readings: [
      { label: "Electrical output", value: "50", unit: "kW" },
      { label: "Starts per day", value: "12", unit: "", note: "should be a handful — heavy wear" },
      { label: "Run hours now", value: "3,500", unit: "h/yr", note: "cut short by cycling" },
      { label: "Thermal store", value: "none", note: "nothing to ride through demand dips" },
    ],
    refTables: ["sizing", "prices"],
    calcParts: [
      {
        id: "cf-now",
        prompt: "What is the capacity factor now (run hours as a % of the year)?",
        unit: "%",
        answer: 40,
        tol: 2,
        tolType: "abs",
        hints: ["Run hours ÷ 8,760 × 100.", "3,500 ÷ 8,760 × 100."],
        worked: "3,500 ÷ 8,760 ≈ 40%.",
      },
      {
        id: "extra-kwh",
        prompt: "How much extra electricity would steady running (6,000 h) generate per year?",
        unit: "kWh/yr",
        answer: 125000,
        tol: 0.04,
        tolType: "rel",
        hints: ["Extra hours × output.", "(6,000 − 3,500) × 50."],
        worked: "(6,000 − 3,500) × 50 = 125,000 kWh/yr of generation lost to cycling.",
      },
      {
        id: "extra-value",
        prompt: "What is that extra generation worth per year at £0.20/kWh?",
        unit: "£/yr",
        answer: 25000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Extra kWh × price.", "125,000 × 0.20."],
        worked: "125,000 × £0.20 = £25,000/yr — before counting the maintenance saved by stopping the cycling.",
      },
    ],
    candidateCauseIds: ["engine-worn", "heat-demand-fine", "oversized-base", "no-thermal-store"],
    correctCauseIds: ["no-thermal-store"],
    candidateActionIds: ["increase-export", "run-heat-led", "fit-thermal-store", "resize-unit"],
    correctActionIds: ["fit-thermal-store"],
    improvementActionIds: ["resize-unit"],
    debrief:
      "Twelve starts a day is the signature of a unit with no buffer chasing a demand that dips below its minimum output. Each stop/start wastes fuel, wears the engine and loses run hours — here ~£25,000/yr of generation, plus heavy maintenance. A thermal store absorbs the surplus when demand dips and lets the unit run steadily for thousands of hours instead of hunting. If cycling persists, a smaller unit better matched to the load is the longer-term answer.",
    faultChain: [
      "Demand dips below minimum output; no store to ride it",
      "~12 starts/day; run hours held to ~3,500 (40% CF)",
      "Steady running would add 125,000 kWh ≈ £25,000/yr",
      "Fix: fit a thermal buffer store (or right-size the unit)",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "carbon-vs-grid",
    title: "Case 7 — Still green?",
    tag: "Carbon",
    brief:
      "The board wants the CHP counted as a carbon-saving asset in the net-zero plan. The unit was a clear winner when the grid was full of coal — but the grid has decarbonised hard. Does this gas engine still cut carbon? Run the comparison properly, electricity and heat.",
    knownFacts: [
      "200 kWe / 300 kWth gas engine, 38% electrical efficiency, heat all used",
      "Natural gas 0.183 kg CO₂/kWh; grid now ~0.20 kg CO₂/kWh",
      "Fuel input ≈ 526 kW",
      "Compare: all the gas burned vs grid electricity + boiler heat (85%)",
    ],
    readings: [
      { label: "Electrical output", value: "200", unit: "kW" },
      { label: "Useful heat", value: "300", unit: "kW" },
      { label: "Gas carbon", value: "0.183", unit: "kg/kWh" },
      { label: "Grid carbon now", value: "0.20", unit: "kg/kWh", note: "was ~0.50 in 2012" },
    ],
    refTables: ["carbon", "efficiency"],
    calcParts: [
      {
        id: "chp-elec-carbon",
        prompt: "What is the carbon intensity of the CHP's electricity (before any heat credit)?",
        unit: "kg/kWh",
        answer: 0.482,
        tol: 0.03,
        tolType: "rel",
        hints: ["Gas carbon ÷ electrical efficiency.", "0.183 ÷ 0.38."],
        worked: "0.183 ÷ 0.38 ≈ 0.48 kg/kWh — more than double the grid's 0.20. The electricity alone is now dirtier than the grid.",
      },
      {
        id: "with-chp",
        prompt: "WITH CHP: what are the emissions per hour (all the gas burned)?",
        unit: "kg/h",
        answer: 96.3,
        tol: 0.05,
        tolType: "rel",
        hints: ["Fuel input × gas carbon.", "526 × 0.183."],
        worked: "526 × 0.183 ≈ 96 kg CO₂/hour.",
      },
      {
        id: "without-chp",
        prompt: "WITHOUT CHP: emissions per hour for the same output (grid electricity + boiler heat)?",
        unit: "kg/h",
        answer: 104.6,
        tol: 0.05,
        tolType: "rel",
        hints: [
          "Grid: 200 × 0.20. Boiler: (300 ÷ 0.85) × 0.183. Add them.",
          "40 + (353 × 0.183).",
        ],
        worked: "Grid 200×0.20 = 40; boiler (300/0.85)×0.183 = 64.6; total ≈ 104.6 kg/hour.",
      },
      {
        id: "net-carbon",
        prompt: "What is the net carbon saving per hour from running the CHP?",
        unit: "kg/h",
        answer: 8.3,
        tol: 2,
        tolType: "abs",
        hints: ["Without − with.", "104.6 − 96.3."],
        worked:
          "104.6 − 96.3 ≈ 8 kg/hour — still a saving, but only thanks to the heat credit, and shrinking every year as the grid gets cleaner.",
      },
    ],
    candidateCauseIds: ["engine-worn", "grid-cleaner", "narrow-spark", "heat-demand-fine"],
    correctCauseIds: ["grid-cleaner"],
    candidateActionIds: ["increase-export", "mothball-unit", "run-heat-led", "switch-to-biogas"],
    correctActionIds: ["switch-to-biogas"],
    improvementActionIds: ["run-heat-led"],
    debrief:
      "The unit's electricity (0.48 kg/kWh) is now well above the grid (0.20) — only the heat credit keeps the whole scheme marginally carbon-positive at ~8 kg/hour, and that margin shrinks every year the grid decarbonises. Assess it over its 15-year life against an ever-cleaner grid, not today's average. The durable carbon fix is the fuel: biogas/biomethane (or hydrogen-ready) makes the recovered energy renewable. Maximising heat use protects the credit meanwhile. Treat gas CHP as transitional.",
    faultChain: [
      "Grid fell from ~0.50 to ~0.20 kg/kWh; CHP electricity is 0.48",
      "With-CHP 96 kg/h vs without 105 kg/h",
      "Net saving only ~8 kg/h — from the heat credit, and shrinking",
      "Fix: switch fuel to biogas/biomethane; maximise heat utilisation",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "engine-worn",
    title: "Case 8 — Burning more for the same",
    tag: "Engine condition",
    brief:
      "An older engine is still putting out its rated 190 kW of electricity and its heat is fully used — but the gas meter says it's drinking far more fuel than it should, and oil consumption is creeping up. The heat-recovery side checks out. This is the engine itself.",
    knownFacts: [
      "Electrical output 190 kW, fully used; heat recovery normal",
      "Electrical efficiency has fallen to 31% (was 38%)",
      "Oil consumption up; hours since last overhaul are high",
      "~7,000 h/yr; gas £0.06/kWh",
    ],
    readings: [
      { label: "Electrical output", value: "190", unit: "kW", note: "still on rating" },
      { label: "Electrical efficiency", value: "31", unit: "%", note: "design 38% — engine is tired" },
      { label: "Heat recovery", value: "normal", note: "so it is not the heat exchanger" },
      { label: "Run hours", value: "7,000", unit: "h/yr" },
    ],
    refTables: ["efficiency", "prices"],
    calcParts: [
      {
        id: "fuel-now",
        prompt: "What is the fuel input now, at 31% electrical efficiency?",
        unit: "kW",
        answer: 613,
        tol: 12,
        tolType: "abs",
        hints: ["Fuel = electrical output ÷ electrical efficiency.", "190 ÷ 0.31."],
        worked: "190 ÷ 0.31 ≈ 613 kW (it was 190 ÷ 0.38 = 500 kW when healthy).",
      },
      {
        id: "extra-fuel",
        prompt: "How much extra gas is it burning for the same electrical output?",
        unit: "kW",
        answer: 113,
        tol: 8,
        tolType: "abs",
        hints: ["Fuel now − fuel when healthy (190 ÷ 0.38 = 500).", "613 − 500."],
        worked: "613 − 500 = 113 kW of extra gas, producing nothing extra.",
      },
      {
        id: "cost",
        prompt: "What is that extra fuel costing per year?",
        unit: "£/yr",
        answer: 47460,
        tol: 0.08,
        tolType: "rel",
        hints: ["Extra kW × hours × gas price.", "113 × 7,000 × 0.06."],
        worked: "113 × 7,000 × £0.06 ≈ £47,460/yr — the cost of deferring the overhaul.",
      },
    ],
    candidateCauseIds: ["engine-worn", "narrow-spark", "heat-demand-fine", "fouled-hx"],
    correctCauseIds: ["engine-worn"],
    candidateActionIds: ["service-exhaust-hx", "run-heat-led", "install-larger-unit", "overhaul-engine"],
    correctActionIds: ["overhaul-engine"],
    improvementActionIds: [],
    debrief:
      "Same power out, much more gas in — electrical efficiency has fallen from 38% to 31%, and the rising oil consumption confirms a worn engine due its top-end overhaul. Because heat recovery is normal, this is the engine, not the heat exchanger (the mirror image of Case 5). The extra fuel is costing ~£47,460/yr — far more than the overhaul — so deferring maintenance is a false economy. Servicing the (perfectly good) heat exchanger would change nothing.",
    faultChain: [
      "Same 190 kW out, but fuel up and oil consumption rising",
      "Electrical efficiency 31% vs 38% design → engine worn",
      "≈113 kW extra gas ≈ £47,460/yr",
      "Fix: schedule the engine top-end overhaul",
    ],
  },
];

export function getChpCase(id: string): ChpCase | undefined {
  return CHP_CASES.find((c) => c.id === id);
}
