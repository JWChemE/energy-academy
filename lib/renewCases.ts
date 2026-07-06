/**
 * Renewable-energy diagnostic cases — PV yield, sizing to demand, string
 * shading, battery self-consumption, the wind cube law, load-shifting, an
 * undetected string fault, and orientation. A mix of quantify, reason and
 * judgement. Numbers consistent with lib/renewTables.ts. Built on the shared
 * diagnostics core.
 *
 * The discipline: self-consumed power is worth two-to-four times exported power,
 * so size and operate renewables to the building's own demand — and remember PV
 * dominates on-site because wind on or near buildings almost always disappoints.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const RENEW_CAUSES: CauseDef[] = [
  { id: "pv-opportunity", label: "Unshaded roof with daytime demand — PV opportunity not taken" },
  { id: "oversized-export", label: "Array oversized for demand — exporting at low value" },
  { id: "series-shading", label: "Shading throttling a whole series string" },
  { id: "surplus-exported", label: "Midday surplus exported with no storage" },
  { id: "poor-wind-site", label: "Turbulent / low-speed (roof) wind site" },
  { id: "low-self-consumption", label: "Flexible loads not shifted into generation hours" },
  { id: "undetected-fault", label: "String / inverter fault undetected (no monitoring)" },
  { id: "poor-orientation", label: "Panels poorly oriented (north / wrong tilt)" },
  { id: "export-limited", label: "Export-capped grid connection" },
  { id: "renewable-adequate", label: "System appropriate — no fault" },
];

export const RENEW_ACTIONS: ActionDef[] = [
  { id: "dont-roof-mount", label: "Don't roof-mount a micro-turbine (choose PV instead)", tier: 1 },
  { id: "shift-loads-midday", label: "Shift flexible loads into the generation hours", tier: 1 },
  { id: "do-nothing", label: "Do nothing (it's maintenance-free)", tier: 1 },
  { id: "size-to-demand", label: "Size the array to the daytime demand", tier: 2 },
  { id: "fit-monitoring", label: "Fit monitoring and repair the fault", tier: 2 },
  { id: "reorient-eastwest", label: "Reorient to south / east-west; avoid north", tier: 2 },
  { id: "install-pv", label: "Install the PV array", tier: 3 },
  { id: "fit-optimisers", label: "Fit panel optimisers / microinverters", tier: 3 },
  { id: "add-battery", label: "Add battery storage", tier: 3 },
  { id: "use-tall-mast", label: "Use a tall mast on an exposed, measured-wind site", tier: 3 },
  { id: "fill-whole-roof", label: "Fill the whole roof with panels regardless of demand", tier: 3 },
  { id: "add-more-panels", label: "Add more panels", tier: 3 },
  { id: "ignore-shading", label: "Ignore the shading (it's just a couple of panels)", tier: 1 },
];

export type RenewRefTable = "pvyield" | "selfconsume" | "shading" | "battery" | "wind" | "prices";

export interface RenewCase extends DiagnosticCase {
  refTables: RenewRefTable[];
}

export const RENEW_CASES: RenewCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "pv-yield",
    title: "Case 1 — The empty south roof",
    tag: "PV yield",
    brief:
      "A commercial building has a large, unshaded south-facing roof and a steady daytime electricity demand — and no solar on it. PV is now the cheapest new generation there is. Size the opportunity and value it.",
    knownFacts: [
      "Proposed array: 20 kWp on the south roof",
      "UK specific yield ≈ 900 kWh/kWp/yr",
      "About 65% would be self-consumed (daytime demand); rest exported",
      "Retail £0.25/kWh, export £0.10/kWh; installed cost ≈ £900/kWp",
    ],
    readings: [
      { label: "Array size", value: "20", unit: "kWp" },
      { label: "Specific yield", value: "900", unit: "kWh/kWp/yr" },
      { label: "Self-consumption", value: "65", unit: "%" },
      { label: "Retail / export", value: "0.25 / 0.10", unit: "£/kWh" },
    ],
    refTables: ["pvyield", "selfconsume", "prices"],
    calcParts: [
      {
        id: "energy",
        prompt: "How much energy will the array generate per year?",
        unit: "kWh/yr",
        answer: 18000,
        tol: 0.03,
        tolType: "rel",
        hints: ["Capacity × specific yield.", "20 × 900."],
        worked: "20 kWp × 900 kWh/kWp = 18,000 kWh/yr.",
      },
      {
        id: "value",
        prompt: "What is the annual value (65% self-consumed, 35% exported)?",
        unit: "£/yr",
        answer: 3555,
        tol: 0.04,
        tolType: "rel",
        hints: ["SC × energy × retail + export × energy × export rate.", "0.65×18000×0.25 + 0.35×18000×0.10."],
        worked: "0.65×18,000×£0.25 + 0.35×18,000×£0.10 = £2,925 + £630 = £3,555/yr.",
      },
      {
        id: "payback",
        prompt: "What is the simple payback (cost £18,000)?",
        unit: "years",
        answer: 5.1,
        tol: 0.12,
        tolType: "rel",
        hints: ["Cost ÷ annual value.", "18,000 ÷ 3,555."],
        worked: "£18,000 ÷ £3,555 ≈ 5.1 years — then ~20 more years of value over the panels' life.",
      },
    ],
    candidateCauseIds: ["oversized-export", "poor-orientation", "pv-opportunity", "renewable-adequate"],
    correctCauseIds: ["pv-opportunity"],
    candidateActionIds: ["do-nothing", "use-tall-mast", "install-pv", "add-battery"],
    correctActionIds: ["install-pv"],
    improvementActionIds: [],
    debrief:
      "An unshaded south roof over a daytime load is the textbook PV case: ~£3,555/yr at a ~5-year payback, then two decades of near-free generation (panels degrade only ~0.4%/yr). Judge it over 25 years with NPV/IRR, not just simple payback — well-sited PV typically returns a healthy double-digit IRR. The high self-consumption (65%) is what makes the value: every self-consumed kWh is worth 2.5× an exported one.",
    faultChain: [
      "Unshaded south roof, steady daytime demand, no PV",
      "20 kWp × 900 = 18,000 kWh/yr",
      "~£3,555/yr; ~5-yr payback, 25-yr life",
      "Fix: install the PV array",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "oversized-export",
    title: "Case 2 — Filling the roof",
    tag: "Sizing",
    brief:
      "A developer wants to cover an entire roof with 100 kWp of PV on a building with modest daytime demand. Most of that midday output would have nowhere to go but the grid, at the low export rate. Self-consumed power is worth far more — quantify what flooding the grid gives away.",
    knownFacts: [
      "100 kWp array; ~90,000 kWh/yr; only ~30% self-consumed",
      "So ~70% (63,000 kWh) is exported at £0.10/kWh",
      "Self-consumption would displace grid power at £0.25/kWh",
      "A smaller, demand-matched array self-consumes ~80%",
    ],
    readings: [
      { label: "Array size", value: "100", unit: "kWp" },
      { label: "Annual generation", value: "90,000", unit: "kWh" },
      { label: "Self-consumption", value: "30", unit: "%", note: "low daytime demand" },
      { label: "Retail / export", value: "0.25 / 0.10", unit: "£/kWh" },
    ],
    refTables: ["selfconsume", "prices"],
    calcParts: [
      {
        id: "exported",
        prompt: "How much energy does the big array export?",
        unit: "kWh/yr",
        answer: 63000,
        tol: 0.04,
        tolType: "rel",
        hints: ["(1 − self-consumption) × generation.", "0.70 × 90,000."],
        worked: "0.70 × 90,000 = 63,000 kWh exported at the low rate.",
      },
      {
        id: "gap",
        prompt: "What is the value gap per exported kWh (self-consumption vs export)?",
        unit: "£/kWh",
        answer: 0.15,
        tol: 0.01,
        tolType: "abs",
        hints: ["Retail − export.", "0.25 − 0.10."],
        worked: "£0.25 − £0.10 = £0.15 lost for every kWh exported instead of used.",
      },
      {
        id: "forgone",
        prompt: "What value is given away per year by exporting that surplus?",
        unit: "£/yr",
        answer: 9450,
        tol: 0.05,
        tolType: "rel",
        hints: ["Exported energy × value gap.", "63,000 × 0.15."],
        worked: "63,000 × £0.15 = £9,450/yr of value left on the table.",
      },
    ],
    candidateCauseIds: ["renewable-adequate", "oversized-export", "low-self-consumption", "pv-opportunity"],
    correctCauseIds: ["oversized-export"],
    candidateActionIds: ["add-battery", "install-pv", "size-to-demand", "fill-whole-roof"],
    correctActionIds: ["size-to-demand"],
    improvementActionIds: ["add-battery"],
    debrief:
      "Bigger isn't better for self-financed PV. With only 30% self-consumed, 70% of the output is dumped to the grid at £0.10 when it could displace £0.25 — ~£9,450/yr forgone. Size the array to the daytime base load so most output is used on site, or add storage/load-shifting to lift self-consumption before filling the roof. The best return comes from the array tuned to demand, not the one that covers every tile.",
    faultChain: [
      "100 kWp on a low-demand building → 30% self-consumed",
      "63,000 kWh exported at £0.10 vs £0.25 self-use",
      "£0.15/kWh gap → ~£9,450/yr given away",
      "Fix: size to demand (or add storage to lift self-consumption)",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "shading",
    title: "Case 3 — One chimney, half the array",
    tag: "Shading",
    brief:
      "A new flue casts a shadow over two panels of a 12 kWp array each afternoon. Because the panels are wired in series, that shadow doesn't cost two panels' worth of output — it throttles the entire string, like a kink in a hosepipe. Quantify the loss.",
    knownFacts: [
      "12 kWp array in two strings; the shaded panels are on one 6 kWp string",
      "Series shading throttles ~80% of that whole string's output",
      "Specific yield ≈ 900 kWh/kWp/yr",
      "Optimisers / microinverters manage panels individually and recover most of it",
    ],
    readings: [
      { label: "Array size", value: "12", unit: "kWp" },
      { label: "Affected string", value: "6", unit: "kWp", note: "2 panels shaded, series-wired" },
      { label: "String output throttled", value: "80", unit: "%" },
      { label: "Specific yield", value: "900", unit: "kWh/kWp/yr" },
    ],
    refTables: ["pvyield", "shading"],
    calcParts: [
      {
        id: "string-yield",
        prompt: "What would the affected 6 kWp string generate unshaded?",
        unit: "kWh/yr",
        answer: 5400,
        tol: 0.03,
        tolType: "rel",
        hints: ["String kWp × specific yield.", "6 × 900."],
        worked: "6 × 900 = 5,400 kWh/yr.",
      },
      {
        id: "lost",
        prompt: "How much of that is lost to the series shading (80%)?",
        unit: "kWh/yr",
        answer: 4320,
        tol: 0.04,
        tolType: "rel",
        hints: ["String yield × throttle fraction.", "5,400 × 0.80."],
        worked: "5,400 × 0.80 = 4,320 kWh/yr lost — far more than 'two panels' worth'.",
      },
      {
        id: "value",
        prompt: "What is that lost generation worth (self-consumed at £0.25)?",
        unit: "£/yr",
        answer: 1080,
        tol: 0.05,
        tolType: "rel",
        hints: ["Lost kWh × price.", "4,320 × 0.25."],
        worked: "4,320 × £0.25 = £1,080/yr lost to shade on two panels.",
      },
    ],
    candidateCauseIds: ["series-shading", "undetected-fault", "renewable-adequate", "poor-orientation"],
    correctCauseIds: ["series-shading"],
    candidateActionIds: ["ignore-shading", "do-nothing", "fit-optimisers", "add-more-panels"],
    correctActionIds: ["fit-optimisers"],
    improvementActionIds: [],
    debrief:
      "Series wiring means shading is brutally non-linear: shade one cell and the whole string's current collapses, so two shaded panels here cost 80% of a six-panel string — ~£1,080/yr, not two panels' worth. Panel-level electronics (optimisers or microinverters) let each panel work independently, recovering most of the lost output where shading is unavoidable. 'It's only two panels' is exactly the trap; check for chimneys, plant, parapets and trees at survey, and design the string layout around them.",
    faultChain: [
      "New flue shades 2 panels on a 6 kWp series string",
      "Series throttling → 80% of the string lost = 4,320 kWh",
      "~£1,080/yr from shade on two panels",
      "Fix: fit optimisers / microinverters",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "battery",
    title: "Case 4 — Surplus by day, buying by night",
    tag: "Battery",
    brief:
      "A 30 kWp array exports a big midday surplus, then the building buys expensive grid power all evening. A battery could bank the surplus for the evening peak, turning low-value export into high-value self-consumption. Quantify the uplift.",
    knownFacts: [
      "~25 kWh of midday surplus is exported each day",
      "A battery with 25 kWh usable, 90% round-trip efficiency, would bank it",
      "Self-consumption displaces £0.25/kWh; export earns £0.10/kWh",
      "Battery ≈ £8,000",
    ],
    readings: [
      { label: "Daily surplus", value: "25", unit: "kWh", note: "currently exported" },
      { label: "Battery usable", value: "25", unit: "kWh" },
      { label: "Round-trip efficiency", value: "90", unit: "%" },
      { label: "Retail / export", value: "0.25 / 0.10", unit: "£/kWh" },
    ],
    refTables: ["battery", "prices"],
    calcParts: [
      {
        id: "delivered",
        prompt: "How much energy does the battery deliver in the evening (after losses)?",
        unit: "kWh/day",
        answer: 22.5,
        tol: 0.03,
        tolType: "rel",
        hints: ["Stored × round-trip efficiency.", "25 × 0.90."],
        worked: "25 × 0.90 = 22.5 kWh delivered (10% lost in the round trip).",
      },
      {
        id: "uplift-day",
        prompt: "What is the daily value uplift (self-use instead of export)?",
        unit: "£/day",
        answer: 3.38,
        tol: 0.05,
        tolType: "rel",
        hints: ["Delivered × (retail − export).", "22.5 × (0.25 − 0.10)."],
        worked: "22.5 × £0.15 = £3.38/day — displacing £0.25 power instead of earning £0.10.",
      },
      {
        id: "annual",
        prompt: "What is the annual uplift?",
        unit: "£/yr",
        answer: 1232,
        tol: 0.05,
        tolType: "rel",
        hints: ["Daily uplift × 365.", "3.38 × 365."],
        worked: "£3.38 × 365 ≈ £1,232/yr (≈ 6.5-year payback on the battery).",
      },
    ],
    candidateCauseIds: ["surplus-exported", "renewable-adequate", "low-self-consumption", "oversized-export"],
    correctCauseIds: ["surplus-exported"],
    candidateActionIds: ["add-battery", "shift-loads-midday", "do-nothing", "fill-whole-roof"],
    correctActionIds: ["add-battery"],
    improvementActionIds: ["shift-loads-midday"],
    debrief:
      "A battery turns low-value midday export into high-value evening self-consumption: ~£1,232/yr uplift here, lifting the self-consumption rate sharply. Mind the round-trip loss (10% gone each cycle) and the cost — batteries pay best where the export rate is low, the self-consumption uplift is large, the peak/off-peak spread is wide, or resilience is valued. Free load-shifting (moving water heating, EV charging or cooling into the sunny hours) captures some of the same uplift at no capital cost — do that first.",
    faultChain: [
      "25 kWh/day exported at £0.10, then evening grid at £0.25",
      "Battery delivers 22.5 kWh/day at 90% round-trip",
      "£0.15/kWh uplift → ~£1,232/yr",
      "Fix: add a battery (and shift loads to midday first)",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "wind-cube",
    title: "Case 5 — The roof-mounted turbine",
    tag: "Wind",
    brief:
      "A site owner wants to mount a wind turbine on the office roof, where the average wind speed is a turbulent 3.5 m/s. The same turbine on a tall mast on the exposed hill behind would see 7 m/s. Wind power follows the cube of speed — work out just how much that siting matters.",
    knownFacts: [
      "Roof site: average wind speed 3.5 m/s (turbulent, building-disturbed)",
      "Exposed mast site: average wind speed 7 m/s",
      "Wind power ∝ (wind speed)³ — the cube law",
      "A turbine wants ~5–6 m/s or more at hub height to make sense",
    ],
    readings: [
      { label: "Roof wind speed", value: "3.5", unit: "m/s", note: "turbulent" },
      { label: "Mast wind speed", value: "7", unit: "m/s", note: "exposed" },
      { label: "Power law", value: "∝ v³", unit: "" },
      { label: "Viable threshold", value: "5–6", unit: "m/s" },
    ],
    refTables: ["wind"],
    calcParts: [
      {
        id: "speed-ratio",
        prompt: "What is the ratio of mast wind speed to roof wind speed?",
        unit: "×",
        answer: 2,
        tol: 0.1,
        tolType: "abs",
        hints: ["Mast speed ÷ roof speed.", "7 ÷ 3.5."],
        worked: "7 ÷ 3.5 = 2× the wind speed.",
      },
      {
        id: "power-ratio",
        prompt: "By the cube law, how many times more power does the mast site give?",
        unit: "×",
        answer: 8,
        tol: 0.2,
        tolType: "abs",
        hints: ["Speed ratio cubed.", "2³."],
        worked: "2³ = 8× the power — double the wind, eight times the energy.",
      },
      {
        id: "roof-fraction",
        prompt: "The roof turbine therefore produces what percentage of the mast turbine's output?",
        unit: "%",
        answer: 12.5,
        tol: 1,
        tolType: "abs",
        hints: ["1 ÷ power ratio × 100.", "1 ÷ 8 × 100."],
        worked: "1 ÷ 8 = 12.5% — the roof turbine makes barely an eighth of what the mast would.",
      },
    ],
    candidateCauseIds: ["poor-wind-site", "renewable-adequate", "undetected-fault", "pv-opportunity"],
    correctCauseIds: ["poor-wind-site"],
    candidateActionIds: ["add-more-panels", "dont-roof-mount", "use-tall-mast", "do-nothing"],
    correctActionIds: ["dont-roof-mount"],
    improvementActionIds: ["use-tall-mast"],
    debrief:
      "The cube law is unforgiving: half the wind speed means an eighth of the power, so the roof turbine makes ~12.5% of what the same machine would on the exposed mast — and roof sites are turbulent, which adds wear and noise on top. Building-mounted micro-turbines almost always disappoint and rarely repay their cost. The honest advice: don't roof-mount; if the wind resource is genuinely there, use a tall mast on an exposed site with measured wind speeds — otherwise put the money into PV, the more reliable on-site renewable.",
    faultChain: [
      "Roof site 3.5 m/s vs exposed mast 7 m/s",
      "Cube law: 2× speed → 8× power",
      "Roof turbine makes only ~12.5% of the mast's output",
      "Fix: don't roof-mount (tall exposed mast, or choose PV)",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "load-shift",
    title: "Case 6 — Generating at noon, using at six",
    tag: "Self-consumption",
    brief:
      "A 50 kWp array generates a midday peak, but the building's flexible loads — water heating, EV charging, pumping — all run in the evening, so only 40% of the PV is self-consumed. Shifting those loads into the sunny hours would lift self-consumption to 65% at no capital cost. Quantify the gain.",
    knownFacts: [
      "50 kWp array generating ~45,000 kWh/yr",
      "Self-consumption now 40%; load-shifting could lift it to 65%",
      "Self-consumed displaces £0.25/kWh; exported earns £0.10/kWh",
      "Load-shifting is a controls/scheduling change — essentially no cost",
    ],
    readings: [
      { label: "Array size", value: "50", unit: "kWp" },
      { label: "Annual generation", value: "45,000", unit: "kWh" },
      { label: "Self-consumption now", value: "40", unit: "%" },
      { label: "Achievable", value: "65", unit: "%", note: "shift loads to midday" },
    ],
    refTables: ["selfconsume", "prices"],
    calcParts: [
      {
        id: "value-now",
        prompt: "What is the annual value at 40% self-consumption?",
        unit: "£/yr",
        answer: 7200,
        tol: 0.04,
        tolType: "rel",
        hints: ["SC×E×retail + (1−SC)×E×export.", "0.40×45000×0.25 + 0.60×45000×0.10."],
        worked: "0.40×45,000×£0.25 + 0.60×45,000×£0.10 = £4,500 + £2,700 = £7,200/yr.",
      },
      {
        id: "value-after",
        prompt: "What is the value at 65% self-consumption?",
        unit: "£/yr",
        answer: 8888,
        tol: 0.04,
        tolType: "rel",
        hints: ["Same formula at 65%.", "0.65×45000×0.25 + 0.35×45000×0.10."],
        worked: "0.65×45,000×£0.25 + 0.35×45,000×£0.10 = £7,312 + £1,575 = £8,888/yr.",
      },
      {
        id: "uplift",
        prompt: "What is the annual uplift from shifting the loads?",
        unit: "£/yr",
        answer: 1688,
        tol: 0.06,
        tolType: "rel",
        hints: ["Value after − value now.", "8,888 − 7,200."],
        worked: "£8,888 − £7,200 ≈ £1,688/yr — for free, just by scheduling loads into the sun.",
      },
    ],
    candidateCauseIds: ["low-self-consumption", "renewable-adequate", "surplus-exported", "oversized-export"],
    correctCauseIds: ["low-self-consumption"],
    candidateActionIds: ["shift-loads-midday", "add-battery", "do-nothing", "add-more-panels"],
    correctActionIds: ["shift-loads-midday"],
    improvementActionIds: ["add-battery"],
    debrief:
      "The return on PV hinges on the self-consumption rate, and the cheapest way to raise it is free: schedule flexible loads (water heating, EV charging, pumping, cooling) into the generation hours. Lifting self-consumption from 40% to 65% here is worth ~£1,688/yr at no capital cost — a smart energy manager diverts surplus to water heating or EV charging automatically. Adding more panels would do the opposite, pushing self-consumption down and exporting yet more cheap power.",
    faultChain: [
      "50 kWp generating at noon; flexible loads run at 6pm → 40% SC",
      "Shifting loads lifts SC to 65%",
      "Value £7,200 → £8,888, a ~£1,688/yr uplift, free",
      "Fix: shift flexible loads into the generation hours",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "undetected-fault",
    title: "Case 7 — The string that went dark",
    tag: "Monitoring",
    brief:
      "A 30 kWp array has three 10 kWp strings. One string tripped offline in spring and nobody noticed — there's no monitoring, and the array 'just sits there'. It was discovered four months later during an unrelated visit. Quantify what the blind spot cost.",
    knownFacts: [
      "One 10 kWp string offline for ~4 months (over the sunniest period)",
      "Specific yield ≈ 900 kWh/kWp/yr",
      "Generation lost is self-consumed power worth £0.25/kWh",
      "No monitoring — the fault was invisible",
    ],
    readings: [
      { label: "Offline string", value: "10", unit: "kWp" },
      { label: "Time offline", value: "4", unit: "months" },
      { label: "Specific yield", value: "900", unit: "kWh/kWp/yr" },
      { label: "Monitoring", value: "none", note: "fault undetected" },
    ],
    refTables: ["pvyield", "prices"],
    calcParts: [
      {
        id: "string-annual",
        prompt: "What does the 10 kWp string generate in a full year?",
        unit: "kWh/yr",
        answer: 9000,
        tol: 0.03,
        tolType: "rel",
        hints: ["String kWp × specific yield.", "10 × 900."],
        worked: "10 × 900 = 9,000 kWh/yr.",
      },
      {
        id: "lost",
        prompt: "How much generation was lost over the 4 months offline?",
        unit: "kWh",
        answer: 3000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Annual × (4 ÷ 12).", "9,000 × 4 ÷ 12."],
        worked: "9,000 × 4/12 = 3,000 kWh (more, in fact, as those are the sunniest months).",
      },
      {
        id: "value",
        prompt: "What was that worth?",
        unit: "£",
        answer: 750,
        tol: 0.06,
        tolType: "rel",
        hints: ["Lost kWh × price.", "3,000 × 0.25."],
        worked: "3,000 × £0.25 = £750 lost to a fault nobody could see.",
      },
    ],
    candidateCauseIds: ["undetected-fault", "poor-orientation", "renewable-adequate", "series-shading"],
    correctCauseIds: ["undetected-fault"],
    candidateActionIds: ["add-more-panels", "fit-monitoring", "fill-whole-roof", "do-nothing"],
    correctActionIds: ["fit-monitoring"],
    improvementActionIds: [],
    debrief:
      "PV is low-maintenance, not no-maintenance — and that's exactly why faults go unnoticed. A dead string produces no alarm; without monitoring it can sit dark for months, here ~£750 lost over a single summer (and far more if it recurs annually). Fit monitoring that tracks generation, consumption and export, so a failed string or inverter is flagged the day it happens — and repair this one. 'It's maintenance-free, leave it' is how these losses accumulate invisibly.",
    faultChain: [
      "1 of 3 strings (10 kWp) offline 4 months, no monitoring",
      "9,000 kWh/yr string → ~3,000 kWh lost",
      "~£750 lost, invisibly",
      "Fix: fit monitoring and repair the string",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "orientation",
    title: "Case 8 — Facing the wrong way",
    tag: "Orientation",
    brief:
      "The only roof a client wants to use faces due north. They've asked for 15 kWp up there. A north-facing array in the UK gives up a large slice of its potential yield — work out the penalty and the better options.",
    knownFacts: [
      "Proposed: 15 kWp on a north-facing roof",
      "South yields ≈ 900 kWh/kWp/yr; north ≈ 70% of that (≈ 630)",
      "East-west loses only ~15% vs south and can fit more capacity",
      "There is some south and flat-roof space available",
    ],
    readings: [
      { label: "Array size", value: "15", unit: "kWp" },
      { label: "South yield", value: "900", unit: "kWh/kWp/yr" },
      { label: "North yield", value: "630", unit: "kWh/kWp/yr", note: "~70% of south" },
      { label: "Other space", value: "south / flat", note: "available" },
    ],
    refTables: ["pvyield"],
    calcParts: [
      {
        id: "south-energy",
        prompt: "What would 15 kWp generate facing south?",
        unit: "kWh/yr",
        answer: 13500,
        tol: 0.03,
        tolType: "rel",
        hints: ["kWp × south yield.", "15 × 900."],
        worked: "15 × 900 = 13,500 kWh/yr.",
      },
      {
        id: "north-energy",
        prompt: "What would the same 15 kWp generate facing north?",
        unit: "kWh/yr",
        answer: 9450,
        tol: 0.03,
        tolType: "rel",
        hints: ["kWp × north yield.", "15 × 630."],
        worked: "15 × 630 = 9,450 kWh/yr.",
      },
      {
        id: "loss-pct",
        prompt: "What percentage of potential yield does facing north give up?",
        unit: "%",
        answer: 30,
        tol: 2,
        tolType: "abs",
        hints: ["(south − north) ÷ south × 100.", "(13,500 − 9,450) ÷ 13,500 × 100."],
        worked: "(13,500 − 9,450) ÷ 13,500 = 30% of the potential thrown away by facing north.",
      },
    ],
    candidateCauseIds: ["series-shading", "poor-orientation", "renewable-adequate", "oversized-export"],
    correctCauseIds: ["poor-orientation"],
    candidateActionIds: ["install-pv", "fill-whole-roof", "reorient-eastwest", "do-nothing"],
    correctActionIds: ["reorient-eastwest"],
    improvementActionIds: [],
    debrief:
      "Orientation matters enormously: a north-facing array gives up ~30% of its yield before you've even started, throwing away a third of the investment. Use the south and flat-roof space instead — and on a flat roof, an east-west split loses only ~15% versus south while fitting more capacity and spreading generation across the morning and afternoon to lift self-consumption. Only fill a north roof if there's genuinely no alternative and the (reduced) economics still stack up.",
    faultChain: [
      "15 kWp proposed on a north-facing roof",
      "South 13,500 vs north 9,450 kWh/yr",
      "~30% of potential yield given away",
      "Fix: use south / east-west space; avoid north",
    ],
  },
];

export function getRenewCase(id: string): RenewCase | undefined {
  return RENEW_CASES.find((c) => c.id === id);
}
