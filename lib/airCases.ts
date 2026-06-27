/**
 * Compressed-air diagnostic cases — leaks, loaded-vs-unloaded running, pressure,
 * inappropriate use, heat recovery, pressure drop, sequencing and drains. A mix
 * of quantify-the-saving, reason-from-symptoms and judgment. Answers consistent
 * with lib/airTables.ts. Built on the shared diagnostics core.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const AIR_CAUSES: CauseDef[] = [
  { id: "air-leaks", label: "Significant air leaks across the system" },
  { id: "poor-partload-control", label: "Compressor mostly unloaded — poor part-load control (load/unload)" },
  { id: "full-demand", label: "Demand genuinely matches the compressor" },
  { id: "pressure-too-high", label: "System pressure higher than the application needs" },
  { id: "inappropriate-use", label: "Compressed air used where a blower/fan/electric would do" },
  { id: "heat-not-recovered", label: "Compressor heat vented away — not recovered" },
  { id: "excessive-pressure-drop", label: "Excessive pressure drop across filters / dryer" },
  { id: "no-sequencing", label: "Multiple compressors uncoordinated — surplus running idle" },
  { id: "drain-air-loss", label: "Condensate drains bleeding compressed air" },
  { id: "compressor-fault", label: "Compressor mechanical fault" },
  { id: "undersized-compressor", label: "Compressor undersized for demand" },
];

export const AIR_ACTIONS: ActionDef[] = [
  { id: "leak-survey", label: "Carry out a leak survey & repair programme", tier: 1 },
  { id: "fit-leak-monitoring", label: "Fit ultrasonic leak detection / ongoing programme", tier: 3 },
  { id: "fit-vsd-compressor", label: "Replace with / add a variable-speed compressor", tier: 3 },
  { id: "switch-off-offhours", label: "Switch the compressor off out of hours", tier: 1 },
  { id: "reduce-pressure", label: "Reduce the system pressure to suit the application", tier: 1 },
  { id: "fit-regulators", label: "Fit point-of-use regulators / fix artificial demand", tier: 2 },
  { id: "replace-with-blower", label: "Replace the compressed-air use with a blower / fan", tier: 2 },
  { id: "fit-heat-recovery", label: "Fit compressor heat recovery", tier: 3 },
  { id: "replace-filters", label: "Replace the clogged filters / service the dryer", tier: 1 },
  { id: "fit-sequencer", label: "Fit a compressor sequencer / cascade control", tier: 2 },
  { id: "fit-vsd-trim", label: "Add a VSD trim compressor", tier: 3 },
  { id: "fit-zero-loss-drains", label: "Fit zero-loss (electronic) condensate drains", tier: 2 },
  { id: "bigger-compressor", label: "Install a larger compressor", tier: 3 },
  { id: "raise-pressure", label: "Raise the system pressure", tier: 1 },
];

export type AirRefTable = "specificpower" | "unloaded" | "pressure" | "heat" | "costs";

export interface AirCase extends DiagnosticCase {
  refTables: AirRefTable[];
}

export const AIR_CASES: AirCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "leak-audit",
    title: "Case 1 — The weekend that wasn't quiet",
    tag: "Leaks",
    brief:
      "You come in on a Sunday with the whole plant shut down — no tools, no production. Yet the compressor keeps kicking in to hold pressure. Every bit of air it's making is going somewhere it shouldn't. Quantify the leak load.",
    knownFacts: [
      "Compressor delivers 10 m³/min of free air; nothing is in use",
      "With no demand, it still runs loaded ~30% of each cycle to hold pressure",
      "Specific power ≈ 6 kW per m³/min at 7 bar",
      "Plant runs ~8,000 h/yr; electricity £0.20/kWh",
    ],
    readings: [
      { label: "Compressor output (FAD)", value: "10", unit: "m³/min" },
      { label: "Loaded time, no demand", value: "30", unit: "%", note: "should be ~0 with no leaks" },
      { label: "Production air demand now", value: "0", unit: "m³/min", note: "plant shut down" },
      { label: "Run hours", value: "8,000", unit: "h/yr" },
    ],
    refTables: ["specificpower", "costs"],
    calcParts: [
      {
        id: "leak-flow",
        prompt: "What is the leak flow?",
        unit: "m³/min",
        answer: 3.0,
        tol: 0.1,
        tolType: "abs",
        hints: [
          "With nothing in use, all the air the compressor makes is leaks. Leak flow = output × the fraction of time it runs loaded.",
          "10 × 0.30.",
        ],
        worked: "10 m³/min × 0.30 = 3.0 m³/min of leaks.",
      },
      {
        id: "leak-pct",
        prompt: "What proportion of the compressor's output is that?",
        unit: "%",
        answer: 30,
        tol: 2,
        tolType: "abs",
        hints: ["Leak flow ÷ output × 100.", "3.0 ÷ 10 × 100."],
        worked: "3.0 ÷ 10 × 100 = 30% — squarely in the 'poorly managed' range.",
      },
      {
        id: "leak-cost",
        prompt: "What are the leaks costing per year?",
        unit: "£/yr",
        answer: 28800,
        tol: 0.08,
        tolType: "rel",
        hints: [
          "Power for the leaks = leak flow × specific power (6 kW per m³/min). Then × hours × price.",
          "3.0 × 6 = 18 kW; × 8,000 × £0.20.",
        ],
        worked: "3.0 × 6 = 18 kW. 18 × 8,000 × £0.20 ≈ £28,800/yr leaking away.",
      },
    ],
    candidateCauseIds: ["air-leaks", "poor-partload-control", "pressure-too-high", "compressor-fault"],
    correctCauseIds: ["air-leaks"],
    candidateActionIds: ["leak-survey", "fit-leak-monitoring", "bigger-compressor", "raise-pressure"],
    correctActionIds: ["leak-survey"],
    improvementActionIds: ["fit-leak-monitoring"],
    debrief:
      "The shutdown test is the classic leak audit: with nothing in use, the compressor running loaded 30% of the time means leaks equal to 30% of its output — ~£28,800/yr blown into the void. A leak survey and repair programme is the highest-return job in most compressed-air systems. Ongoing ultrasonic monitoring keeps the rate from creeping back. Buying a bigger compressor or raising pressure would only feed the leaks faster.",
    faultChain: [
      "Plant shut down, yet compressor loads 30% of the time",
      "All that air is leaks → 3 m³/min (30% of output)",
      "≈ 18 kW continuously → ~£28,800/yr",
      "Fix: leak survey & repair programme",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "loaded-unloaded",
    title: "Case 2 — Spinning but not delivering",
    tag: "Part-load control",
    brief:
      "A fixed-speed screw compressor on load/unload control sits on a duty well below its capacity. Watch it and it's unloaded most of the time — but unloaded it still draws a third of full power, making no air at all. Work out what that idling costs and what a variable-speed machine would save.",
    knownFacts: [
      "Fixed-speed screw, load/unload control; 75 kW at full load",
      "Unloaded, it still draws ~25 kW (≈ a third) and delivers no air",
      "Over a year it is loaded only ~40% of the time (unloaded 60%)",
      "Runs ~6,000 h/yr; electricity £0.20/kWh",
    ],
    readings: [
      { label: "Full-load power", value: "75", unit: "kW" },
      { label: "Unloaded power", value: "25", unit: "kW", note: "drawn while making no air" },
      { label: "Loaded fraction", value: "40", unit: "%", note: "unloaded the other 60%" },
      { label: "Run hours", value: "6,000", unit: "h/yr" },
    ],
    refTables: ["unloaded", "costs"],
    calcParts: [
      {
        id: "unloaded-hours",
        prompt: "How many hours a year is it running unloaded?",
        unit: "h/yr",
        answer: 3600,
        tol: 50,
        tolType: "abs",
        hints: ["Unloaded fraction × run hours.", "0.60 × 6,000."],
        worked: "0.60 × 6,000 = 3,600 h/yr unloaded.",
      },
      {
        id: "wasted-kwh",
        prompt: "How much energy is spent making no air?",
        unit: "kWh/yr",
        answer: 90000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Unloaded power × unloaded hours.", "25 × 3,600."],
        worked: "25 kW × 3,600 h = 90,000 kWh/yr drawn while unloaded.",
      },
      {
        id: "cost",
        prompt: "What does that idling cost per year?",
        unit: "£/yr",
        answer: 18000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Energy × price.", "90,000 × £0.20."],
        worked: "90,000 × £0.20 = £18,000/yr — most of which a VSD compressor would remove.",
      },
    ],
    candidateCauseIds: ["poor-partload-control", "full-demand", "air-leaks", "undersized-compressor"],
    correctCauseIds: ["poor-partload-control"],
    candidateActionIds: ["fit-vsd-compressor", "switch-off-offhours", "bigger-compressor", "raise-pressure"],
    correctActionIds: ["fit-vsd-compressor"],
    improvementActionIds: ["switch-off-offhours"],
    debrief:
      "Load/unload control is brutal on a part-loaded duty: when unloaded the machine still spins and draws ~a third of full power for zero air — here £18,000/yr of pure idling. A variable-speed compressor ramps its power down with demand and largely eliminates it. Switching off out of hours is a free partial win on top. (If the demand genuinely matched the compressor, you'd see it loaded most of the time — it isn't.)",
    faultChain: [
      "Fixed-speed load/unload machine on a low-demand duty",
      "Unloaded 60% of 6,000 h, drawing ~25 kW for no air",
      "≈ 90,000 kWh → £18,000/yr idling",
      "Fix: variable-speed compressor (plus switch off out of hours)",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "over-pressure",
    title: "Case 3 — A bar too far",
    tag: "Pressure",
    brief:
      "The compressor is set to deliver 8.5 bar, but the highest-pressure tool on site is happy at 6.5 bar — the extra was dialled in years ago 'to be safe'. Higher pressure means more energy and more leakage. Work out the saving from turning it down.",
    knownFacts: [
      "System pressure 8.5 bar; highest genuine requirement 6.5 bar",
      "Rule of thumb: ~7% energy per 1 bar of pressure",
      "Compressor draws ~75 kW on average; ~6,000 h/yr; £0.20/kWh",
    ],
    readings: [
      { label: "System pressure", value: "8.5", unit: "bar" },
      { label: "Pressure required", value: "6.5", unit: "bar", note: "highest tool on site" },
      { label: "Average compressor power", value: "75", unit: "kW" },
      { label: "Run hours", value: "6,000", unit: "h/yr" },
    ],
    refTables: ["pressure", "costs"],
    calcParts: [
      {
        id: "reduction",
        prompt: "How far can the pressure come down?",
        unit: "bar",
        answer: 2.0,
        tol: 0.2,
        tolType: "abs",
        hints: ["Current pressure − required pressure.", "8.5 − 6.5."],
        worked: "8.5 − 6.5 = 2.0 bar of reduction available.",
      },
      {
        id: "saving-pct",
        prompt: "What energy saving does that give?",
        unit: "%",
        answer: 14,
        tol: 1,
        tolType: "abs",
        hints: ["~7% per bar.", "2.0 × 7%."],
        worked: "2.0 bar × 7% ≈ 14% energy saving (plus reduced leakage).",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 12600,
        tol: 0.08,
        tolType: "rel",
        hints: ["Saving % × power × hours × price.", "0.14 × 75 × 6,000 × £0.20."],
        worked: "0.14 × 75 × 6,000 × £0.20 ≈ £12,600/yr.",
      },
    ],
    candidateCauseIds: ["pressure-too-high", "air-leaks", "full-demand", "excessive-pressure-drop"],
    correctCauseIds: ["pressure-too-high"],
    candidateActionIds: ["reduce-pressure", "fit-regulators", "bigger-compressor", "raise-pressure"],
    correctActionIds: ["reduce-pressure"],
    improvementActionIds: ["fit-regulators"],
    debrief:
      "Generating 2 bar more than anything needs costs ~14% extra energy — ~£12,600/yr — and quietly inflates every leak and unregulated use ('artificial demand'). Turn the pressure down to suit the genuine requirement; point-of-use regulators stop individual uses pulling more than they need. Check the highest tool first so you don't starve it.",
    faultChain: [
      "Set to 8.5 bar; nothing needs more than 6.5 bar",
      "2 bar excess → ~14% extra energy, plus more leakage",
      "≈ £12,600/yr",
      "Fix: reduce system pressure; fit point-of-use regulators",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "inappropriate-use",
    title: "Case 4 — Using a Ferrari to deliver pizzas",
    tag: "Inappropriate use",
    brief:
      "A line uses an open compressed-air blow to cool and clear parts, running continuously. Compressed air is one of the most expensive ways to move air there is. A blower could do the same job. Put numbers on the difference.",
    knownFacts: [
      "Open blow uses ~2 m³/min of compressed air, continuously",
      "Specific power ≈ 6 kW per m³/min",
      "A dedicated blower doing the same duty would draw ~1.5 kW",
      "Runs ~8,000 h/yr; electricity £0.20/kWh",
    ],
    readings: [
      { label: "Compressed-air use", value: "2.0", unit: "m³/min", note: "continuous open blow" },
      { label: "Blower alternative", value: "1.5", unit: "kW", note: "same duty" },
      { label: "Run hours", value: "8,000", unit: "h/yr" },
    ],
    refTables: ["specificpower", "costs"],
    calcParts: [
      {
        id: "ca-power",
        prompt: "What power does the compressed-air blow consume?",
        unit: "kW",
        answer: 12,
        tol: 0.05,
        tolType: "rel",
        hints: ["Flow × specific power.", "2.0 × 6."],
        worked: "2.0 m³/min × 6 kW/(m³/min) = 12 kW.",
      },
      {
        id: "ca-cost",
        prompt: "What does running it on compressed air cost per year?",
        unit: "£/yr",
        answer: 19200,
        tol: 0.06,
        tolType: "rel",
        hints: ["kW × hours × price.", "12 × 8,000 × £0.20."],
        worked: "12 × 8,000 × £0.20 = £19,200/yr.",
      },
      {
        id: "saving",
        prompt: "What would switching to a blower save per year?",
        unit: "£/yr",
        answer: 16800,
        tol: 0.08,
        tolType: "rel",
        hints: ["(compressed-air power − blower power) × hours × price.", "(12 − 1.5) × 8,000 × £0.20."],
        worked: "(12 − 1.5) × 8,000 × £0.20 = £16,800/yr — the blower does the same job for a fraction of the energy.",
      },
    ],
    candidateCauseIds: ["inappropriate-use", "air-leaks", "pressure-too-high", "full-demand"],
    correctCauseIds: ["inappropriate-use"],
    candidateActionIds: ["replace-with-blower", "reduce-pressure", "leak-survey", "bigger-compressor"],
    correctActionIds: ["replace-with-blower"],
    improvementActionIds: [],
    debrief:
      "Compressed air costs roughly eight times what a dedicated blower does for moving air — using it for continuous blowing or cooling is the classic 'expensive tool for a cheap job'. A blower (or fan, or electric solution) does this duty for ~1.5 kW instead of 12, saving ~£16,800/yr. Reducing pressure or chasing leaks would trim the waste but never fix the real problem: this shouldn't be on compressed air at all.",
    faultChain: [
      "Continuous open blow on compressed air (~2 m³/min)",
      "≈ 12 kW vs ~1.5 kW for a blower doing the same job",
      "≈ £16,800/yr of avoidable cost",
      "Fix: replace the compressed-air use with a blower",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "heat-recovery",
    title: "Case 5 — All that warm air",
    tag: "Heat recovery",
    brief:
      "The compressor room is hot — almost all the electricity the compressor draws ends up as heat in its cooling air, currently ducted straight outside. The factory next door is burning gas to heat its space. Quantify the heat you could recover.",
    knownFacts: [
      "Compressor draws ~90 kW on average",
      "About 90% of that input is recoverable as useful heat",
      "Recovered heat would displace gas heating (£0.045/kWh, boiler 80%)",
      "Useful for ~6,000 h/yr of the heating season",
    ],
    readings: [
      { label: "Compressor input power", value: "90", unit: "kW" },
      { label: "Recoverable fraction", value: "90", unit: "%", note: "rest is radiated/parasitic" },
      { label: "Useful hours", value: "6,000", unit: "h/yr" },
      { label: "Heat currently", value: "ducted outside", note: "vented to atmosphere" },
    ],
    refTables: ["heat", "costs"],
    calcParts: [
      {
        id: "heat-kw",
        prompt: "How much heat could you recover?",
        unit: "kW",
        answer: 81,
        tol: 0.05,
        tolType: "rel",
        hints: ["Input power × recoverable fraction.", "90 × 0.90."],
        worked: "90 × 0.90 = 81 kW of recoverable heat.",
      },
      {
        id: "heat-kwh",
        prompt: "How much heat energy is that over the year?",
        unit: "kWh/yr",
        answer: 486000,
        tol: 0.05,
        tolType: "rel",
        hints: ["kW × hours.", "81 × 6,000."],
        worked: "81 × 6,000 = 486,000 kWh/yr of heat.",
      },
      {
        id: "value",
        prompt: "What is that worth in displaced gas heating?",
        unit: "£/yr",
        answer: 27300,
        tol: 0.08,
        tolType: "rel",
        hints: [
          "Displaced gas heat: kWh ÷ boiler efficiency × gas price.",
          "486,000 ÷ 0.8 × £0.045.",
        ],
        worked: "486,000 ÷ 0.8 × £0.045 ≈ £27,300/yr of gas you'd no longer burn.",
      },
    ],
    candidateCauseIds: ["heat-not-recovered", "air-leaks", "pressure-too-high", "poor-partload-control"],
    correctCauseIds: ["heat-not-recovered"],
    candidateActionIds: ["fit-heat-recovery", "leak-survey", "reduce-pressure", "bigger-compressor"],
    correctActionIds: ["fit-heat-recovery"],
    improvementActionIds: [],
    debrief:
      "Practically all the energy into a compressor comes out as heat — vent it outside and you throw away ~81 kW you could use. Ducting that warm air (or a water jacket on an oil-cooled machine) into the building or a process displaces ~£27,300/yr of gas. It's one of the best paybacks in compressed air, and entirely separate from fixing leaks or pressure.",
    faultChain: [
      "~90% of 90 kW input becomes heat → ~81 kW",
      "Currently ducted straight outside",
      "Recovering it displaces ~£27,300/yr of gas heating",
      "Fix: fit compressor heat recovery",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "pressure-drop",
    title: "Case 6 — The hidden choke",
    tag: "Pressure drop",
    brief:
      "Tools at the far end of the plant keep starving, so someone has wound the compressor up to compensate. But the gauges either side of the filters and dryer show a big pressure drop — the system is choking on clogged filters, and you're paying for it at the compressor. Quantify it.",
    knownFacts: [
      "Pressure drop across the filters/dryer reads 1.0 bar; clean it would be ~0.2 bar",
      "Every extra bar of generation pressure costs ~7% more energy",
      "Compressor draws ~60 kW; ~6,000 h/yr; £0.20/kWh",
    ],
    readings: [
      { label: "Pressure drop, filters/dryer", value: "1.0", unit: "bar", note: "clogged" },
      { label: "Clean pressure drop", value: "0.2", unit: "bar" },
      { label: "Compressor power", value: "60", unit: "kW" },
      { label: "Run hours", value: "6,000", unit: "h/yr" },
    ],
    refTables: ["pressure", "costs"],
    calcParts: [
      {
        id: "excess-drop",
        prompt: "How much excess pressure drop is the clogging causing?",
        unit: "bar",
        answer: 0.8,
        tol: 0.1,
        tolType: "abs",
        hints: ["Measured drop − the clean drop.", "1.0 − 0.2."],
        worked: "1.0 − 0.2 = 0.8 bar of avoidable pressure drop.",
      },
      {
        id: "penalty-pct",
        prompt: "What energy penalty does that 0.8 bar impose?",
        unit: "%",
        answer: 5.6,
        tol: 0.6,
        tolType: "abs",
        hints: ["~7% per bar.", "0.8 × 7%."],
        worked: "0.8 × 7% ≈ 5.6% — because you must generate 0.8 bar higher to overcome it.",
      },
      {
        id: "saving",
        prompt: "What would new filters save per year?",
        unit: "£/yr",
        answer: 4000,
        tol: 0.1,
        tolType: "rel",
        hints: ["Penalty % × power × hours × price.", "0.056 × 60 × 6,000 × £0.20."],
        worked: "0.056 × 60 × 6,000 × £0.20 ≈ £4,000/yr — and the far tools stop starving.",
      },
    ],
    candidateCauseIds: ["excessive-pressure-drop", "pressure-too-high", "air-leaks", "compressor-fault"],
    correctCauseIds: ["excessive-pressure-drop"],
    candidateActionIds: ["replace-filters", "reduce-pressure", "raise-pressure", "bigger-compressor"],
    correctActionIds: ["replace-filters"],
    improvementActionIds: [],
    debrief:
      "Clogged filters force the compressor to generate ~0.8 bar higher just to push air through them — a ~5.6% penalty, ~£4,000/yr — and they're why the far tools starve. Replace the filters and service the dryer to clear the choke; then you can usually turn the pressure back down too. Winding the compressor up (or buying a bigger one) treats the symptom and pays for the drop forever.",
    faultChain: [
      "Filters/dryer dropping 1.0 bar vs ~0.2 clean",
      "0.8 bar must be generated extra → ~5.6% energy",
      "≈ £4,000/yr, plus starved tools",
      "Fix: replace the clogged filters / service the dryer",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "no-sequencing",
    title: "Case 7 — Two running when one would do",
    tag: "Sequencing",
    brief:
      "A compressor house has several machines on independent pressure switches. Two are running, but the demand is modest — the second is mostly idling, loading only to trim. Nobody co-ordinates them. Work out the spare capacity and what proper sequencing would save.",
    knownFacts: [
      "Two compressors running, each 12 m³/min capacity",
      "Average site demand is ~8 m³/min",
      "The surplus (second) compressor mostly idles, drawing ~12 kW unloaded",
      "It could be off ~5,000 h/yr under a sequencer; £0.20/kWh",
    ],
    readings: [
      { label: "Compressors running", value: "2", unit: "", note: "independent pressure switches" },
      { label: "Capacity each", value: "12", unit: "m³/min" },
      { label: "Average demand", value: "8", unit: "m³/min" },
      { label: "Surplus unit unloaded power", value: "12", unit: "kW" },
      { label: "Hours it could be off", value: "5,000", unit: "h/yr" },
    ],
    refTables: ["unloaded", "costs"],
    calcParts: [
      {
        id: "demand-frac",
        prompt: "What is the average demand as a fraction of one compressor?",
        unit: "%",
        answer: 67,
        tol: 3,
        tolType: "abs",
        hints: ["Average demand ÷ one compressor's capacity × 100.", "8 ÷ 12 × 100."],
        worked: "8 ÷ 12 × 100 ≈ 67% — one machine (ideally a VSD) could carry the load.",
      },
      {
        id: "saved-kwh",
        prompt: "How much energy would turning off the surplus compressor save?",
        unit: "kWh/yr",
        answer: 60000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Its unloaded power × the hours it could be off.", "12 × 5,000."],
        worked: "12 kW × 5,000 h = 60,000 kWh/yr.",
      },
      {
        id: "saving",
        prompt: "What is that worth per year?",
        unit: "£/yr",
        answer: 12000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Energy × price.", "60,000 × £0.20."],
        worked: "60,000 × £0.20 = £12,000/yr.",
      },
    ],
    candidateCauseIds: ["no-sequencing", "full-demand", "air-leaks", "undersized-compressor"],
    correctCauseIds: ["no-sequencing"],
    candidateActionIds: ["fit-sequencer", "fit-vsd-trim", "bigger-compressor", "raise-pressure"],
    correctActionIds: ["fit-sequencer"],
    improvementActionIds: ["fit-vsd-trim"],
    debrief:
      "With the average demand at only ~67% of a single machine, two compressors fighting on independent pressure switches means the second idles away ~£12,000/yr. A sequencer (cascade control) lets one base-load the demand and brings others on only when genuinely needed. Adding a VSD trim machine handles the swings smoothly — a strong complementary upgrade.",
    faultChain: [
      "Two compressors on independent switches; demand only ~67% of one",
      "Surplus machine idles, drawing ~12 kW for little air",
      "≈ 60,000 kWh → £12,000/yr",
      "Fix: fit a sequencer / cascade control (and a VSD trim)",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "drains",
    title: "Case 8 — Draining the budget",
    tag: "Drains",
    brief:
      "Walking the system you hear a steady hiss at the condensate drains. They're old timer-solenoid drains set to open often — and each blast dumps compressed air along with the water. Across the site that adds up. Work out the loss and the fix.",
    knownFacts: [
      "Six timer-solenoid drains; each loses ~0.1 m³/min of air on average",
      "Specific power ≈ 6 kW per m³/min",
      "Zero-loss (electronic) drains release water without venting air",
      "Runs ~8,000 h/yr; electricity £0.20/kWh",
    ],
    readings: [
      { label: "Timer drains", value: "6", unit: "", note: "audible hiss of escaping air" },
      { label: "Air loss per drain", value: "0.1", unit: "m³/min", note: "average, when venting" },
      { label: "Run hours", value: "8,000", unit: "h/yr" },
    ],
    refTables: ["specificpower", "costs"],
    calcParts: [
      {
        id: "total-loss",
        prompt: "What total air loss are the drains causing?",
        unit: "m³/min",
        answer: 0.6,
        tol: 0.05,
        tolType: "abs",
        hints: ["Number of drains × loss each.", "6 × 0.1."],
        worked: "6 × 0.1 = 0.6 m³/min vented with the condensate.",
      },
      {
        id: "power",
        prompt: "How much compressor power is that?",
        unit: "kW",
        answer: 3.6,
        tol: 0.05,
        tolType: "rel",
        hints: ["Flow × specific power.", "0.6 × 6."],
        worked: "0.6 × 6 = 3.6 kW.",
      },
      {
        id: "cost",
        prompt: "What is it costing per year?",
        unit: "£/yr",
        answer: 5760,
        tol: 0.06,
        tolType: "rel",
        hints: ["kW × hours × price.", "3.6 × 8,000 × £0.20."],
        worked: "3.6 × 8,000 × £0.20 ≈ £5,760/yr down the drains.",
      },
    ],
    candidateCauseIds: ["drain-air-loss", "air-leaks", "pressure-too-high", "compressor-fault"],
    correctCauseIds: ["drain-air-loss"],
    candidateActionIds: ["fit-zero-loss-drains", "leak-survey", "reduce-pressure", "bigger-compressor"],
    correctActionIds: ["fit-zero-loss-drains"],
    improvementActionIds: [],
    debrief:
      "Timer-solenoid drains dump air every time they fire, whether or not there's water to release — a hiss at each one is the giveaway. Six of them at ~0.1 m³/min is ~3.6 kW, ~£5,760/yr. Zero-loss (electronic float/level) drains release the condensate without venting air. A general leak survey would flag them, but the specific, lasting fix is to change the drain type.",
    faultChain: [
      "Six timer drains venting air with each discharge",
      "~0.6 m³/min total → ~3.6 kW",
      "≈ £5,760/yr",
      "Fix: fit zero-loss (electronic) condensate drains",
    ],
  },
];

export function getAirCase(id: string): AirCase | undefined {
  return AIR_CASES.find((c) => c.id === id);
}
