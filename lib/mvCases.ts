/**
 * Measurement & Verification diagnostic cases — the core normalised saving, a
 * multi-driver baseline, weather luck, IPMVP option choice, a non-routine
 * adjustment, savings below the noise floor, persistence decay, and the rebound
 * effect. A mix of quantify, reason and judgement. Numbers consistent with
 * lib/mvTables.ts. Built on the shared diagnostics core.
 *
 * The discipline: a saving is the energy AVOIDED, measured against an adjusted
 * baseline under the same conditions — never raw bills year-on-year. The thread
 * through every case is integrity: avoid overstatement, and report what really
 * happened.
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const MV_CAUSES: CauseDef[] = [
  { id: "needs-normalised-baseline", label: "Saving must be measured against an adjusted (normalised) baseline" },
  { id: "multi-driver", label: "Energy driven by more than one variable (weather + production)" },
  { id: "weather-luck", label: "Apparent saving is weather luck, not the project" },
  { id: "small-measure-isolation", label: "Small single-system measure — needs isolation, not whole-building" },
  { id: "boundary-change", label: "A static factor changed inside the boundary — needs a non-routine adjustment" },
  { id: "saving-below-noise", label: "Claimed whole-building saving is smaller than the baseline uncertainty" },
  { id: "persistence-decay", label: "Savings have decayed — the year-one figure overstates the lifetime" },
  { id: "rebound-effect", label: "Measured saving below prediction due to rebound (take-back)" },
  { id: "raw-comparison-ok", label: "Raw year-on-year comparison is fine" },
  { id: "mv-sound", label: "M&V is correct as stated — accept" },
];

export const MV_ACTIONS: ActionDef[] = [
  { id: "report-normalised-saving", label: "Report the weather-normalised (adjusted-baseline) saving", tier: 1 },
  { id: "use-multivariable-baseline", label: "Use a multi-variable baseline (all real drivers)", tier: 1 },
  { id: "normalise-for-weather", label: "Normalise for weather before claiming any saving", tier: 1 },
  { id: "use-option-a", label: "Use IPMVP Option A (retrofit isolation, key parameter)", tier: 1 },
  { id: "use-isolation-submetering", label: "Use isolation / sub-metering (Option A or B) for a small saving", tier: 2 },
  { id: "make-non-routine-adjustment", label: "Make a non-routine adjustment for the static-factor change", tier: 1 },
  { id: "ongoing-verification", label: "Verify savings on an ongoing basis (don't claim year-one for life)", tier: 1 },
  { id: "report-measured-explain-rebound", label: "Report the measured saving and explain the rebound", tier: 1 },
  { id: "claim-raw-saving", label: "Claim the raw year-on-year saving", tier: 1 },
  { id: "claim-inflated", label: "Claim the inflated / unadjusted figure", tier: 1 },
  { id: "force-to-prediction", label: "Adjust the measurement up to the engineering prediction", tier: 1 },
  { id: "claim-lifetime-from-year1", label: "Claim the year-one saving for the whole life", tier: 1 },
];

export type MvRefTable = "savings" | "baseline" | "normalisation" | "ipmvp" | "pitfalls" | "prices";

export interface MvCase extends DiagnosticCase {
  refTables: MvRefTable[];
}

export const MV_CASES: MvCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "core-saving",
    title: "Case 1 — What did the project actually save?",
    tag: "Adjusted baseline",
    brief:
      "After a heating retrofit, the facilities manager wants to know the monthly saving. You have a baseline model from before the work: Energy = 20,000 + 50 × HDD (kWh/month). This month had 200 heating degree-days and the building used 26,000 kWh. Work out the saving the proper way.",
    knownFacts: [
      "Baseline model: Energy = 20,000 + 50 × HDD (kWh/month)",
      "Reporting month: 200 HDD; actual energy 26,000 kWh",
      "Saving = adjusted baseline − actual",
      "Displaced heat £0.06/kWh",
    ],
    readings: [
      { label: "Baseline model", value: "20,000 + 50 × HDD", unit: "kWh" },
      { label: "This month's HDD", value: "200", unit: "" },
      { label: "Actual energy", value: "26,000", unit: "kWh" },
      { label: "Heat price", value: "0.06", unit: "£/kWh" },
    ],
    refTables: ["savings", "normalisation", "prices"],
    calcParts: [
      {
        id: "adjusted",
        prompt: "What is the adjusted baseline (what it would have used this month)?",
        unit: "kWh",
        answer: 30000,
        tol: 0.02,
        tolType: "rel",
        hints: ["Put this month's HDD into the baseline model.", "20,000 + 50 × 200."],
        worked: "20,000 + 50 × 200 = 20,000 + 10,000 = 30,000 kWh.",
      },
      {
        id: "saving",
        prompt: "What is the saving?",
        unit: "kWh",
        answer: 4000,
        tol: 0.03,
        tolType: "rel",
        hints: ["Adjusted baseline − actual.", "30,000 − 26,000."],
        worked: "30,000 − 26,000 = 4,000 kWh avoided this month.",
      },
      {
        id: "value",
        prompt: "What is that worth?",
        unit: "£",
        answer: 240,
        tol: 0.05,
        tolType: "rel",
        hints: ["Saving × heat price.", "4,000 × 0.06."],
        worked: "4,000 × £0.06 = £240 — measured against this month's actual weather, so it's genuinely the project's.",
      },
    ],
    candidateCauseIds: ["needs-normalised-baseline", "raw-comparison-ok", "weather-luck", "mv-sound"],
    correctCauseIds: ["needs-normalised-baseline"],
    candidateActionIds: ["report-normalised-saving", "claim-raw-saving", "use-option-a", "claim-inflated"],
    correctActionIds: ["report-normalised-saving"],
    improvementActionIds: [],
    debrief:
      "Every saving is the difference between an adjusted baseline and the actual energy. The adjusted baseline — the old building's model run on this month's actual conditions — is what makes the comparison fair: 30,000 kWh it would have used versus 26,000 it did, so 4,000 kWh (£240) was genuinely avoided. Never compare this month's bill to last year's; always compare actual against what the baseline would have used under the same conditions.",
    faultChain: [
      "Baseline model 20,000 + 50 × HDD; this month 200 HDD",
      "Adjusted baseline 30,000 kWh vs actual 26,000 kWh",
      "Saving 4,000 kWh ≈ £240, conditions-matched",
      "Fix: report the adjusted-baseline (normalised) saving",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "multi-driver",
    title: "Case 2 — Weather and output both matter",
    tag: "Multi-variable",
    brief:
      "A factory's energy depends on both the weather and how much it produces. Its baseline model is Energy = 100,000 + 40 × HDD + 5 × (tonnes), per month. A reporting month had 150 HDD, produced 8,000 tonnes, and used 130,000 kWh. Find the saving — accounting for both drivers.",
    knownFacts: [
      "Baseline: Energy = 100,000 + 40 × HDD + 5 × tonnes (kWh/month)",
      "Reporting month: 150 HDD, 8,000 tonnes, actual 130,000 kWh",
      "Both weather and production must be in the model",
      "Displaced heat £0.06/kWh",
    ],
    readings: [
      { label: "Baseline model", value: "100,000 + 40×HDD + 5×t", unit: "kWh" },
      { label: "HDD / tonnes", value: "150 / 8,000", unit: "" },
      { label: "Actual energy", value: "130,000", unit: "kWh" },
      { label: "Heat price", value: "0.06", unit: "£/kWh" },
    ],
    refTables: ["savings", "baseline", "prices"],
    calcParts: [
      {
        id: "adjusted",
        prompt: "What is the adjusted baseline for this month?",
        unit: "kWh",
        answer: 146000,
        tol: 0.02,
        tolType: "rel",
        hints: ["Put both drivers into the model.", "100,000 + 40×150 + 5×8,000."],
        worked: "100,000 + (40×150 = 6,000) + (5×8,000 = 40,000) = 146,000 kWh.",
      },
      {
        id: "saving",
        prompt: "What is the saving?",
        unit: "kWh",
        answer: 16000,
        tol: 0.03,
        tolType: "rel",
        hints: ["Adjusted baseline − actual.", "146,000 − 130,000."],
        worked: "146,000 − 130,000 = 16,000 kWh avoided — adjusted for this month's weather AND output.",
      },
      {
        id: "value",
        prompt: "What is that worth?",
        unit: "£",
        answer: 960,
        tol: 0.05,
        tolType: "rel",
        hints: ["Saving × heat price.", "16,000 × 0.06."],
        worked: "16,000 × £0.06 = £960 — attributable to the project, not to weather or output.",
      },
    ],
    candidateCauseIds: ["multi-driver", "needs-normalised-baseline", "raw-comparison-ok", "mv-sound"],
    correctCauseIds: ["multi-driver"],
    candidateActionIds: ["use-multivariable-baseline", "normalise-for-weather", "claim-raw-saving", "claim-inflated"],
    correctActionIds: ["use-multivariable-baseline"],
    improvementActionIds: [],
    debrief:
      "Many sites need more than one driver. A factory's energy moves with both the weather (HDD) and production (tonnes), so the baseline must include both — normalising for weather alone would still credit (or blame) the project for changes in output. With both in the model, the adjusted baseline is 146,000 kWh and the genuine saving is 16,000 kWh (£960). Include every driver that genuinely and significantly moves energy — but no spurious ones, or you over-fit.",
    faultChain: [
      "Energy depends on weather AND production",
      "Adjusted baseline 100,000 + 6,000 + 40,000 = 146,000 kWh",
      "Saving 16,000 kWh ≈ £960, both drivers accounted for",
      "Fix: use a multi-variable baseline with all real drivers",
    ],
  },

  // ---------------------------------------------------------------- Case 3
  {
    id: "weather-luck",
    title: "Case 3 — Crediting the mild winter",
    tag: "Weather luck",
    brief:
      "A manager proudly reports a 50,000 kWh saving: last year the building used 500,000 kWh, this year only 450,000. But this winter was much milder (2,000 HDD vs last year's 2,500). The baseline model is Energy = 200,000 + 120 × HDD. Find out how much of that 'saving' was really the weather.",
    knownFacts: [
      "Raw claim: 500,000 last year − 450,000 this year = 50,000 kWh 'saved'",
      "This winter 2,000 HDD; last winter 2,500 HDD (much milder)",
      "Baseline model: Energy = 200,000 + 120 × HDD",
      "Actual energy this year: 450,000 kWh",
    ],
    readings: [
      { label: "Raw 'saving'", value: "50,000", unit: "kWh", note: "500,000 − 450,000" },
      { label: "HDD this year / last", value: "2,000 / 2,500", unit: "" },
      { label: "Baseline model", value: "200,000 + 120×HDD", unit: "kWh" },
      { label: "Actual this year", value: "450,000", unit: "kWh" },
    ],
    refTables: ["normalisation", "savings"],
    calcParts: [
      {
        id: "adjusted",
        prompt: "What would the old building have used in this year's milder weather?",
        unit: "kWh",
        answer: 440000,
        tol: 0.02,
        tolType: "rel",
        hints: ["Baseline model with this year's HDD.", "200,000 + 120 × 2,000."],
        worked: "200,000 + 120 × 2,000 = 200,000 + 240,000 = 440,000 kWh.",
      },
      {
        id: "real-saving",
        prompt: "What is the real, weather-normalised saving?",
        unit: "kWh",
        answer: -10000,
        tol: 2000,
        tolType: "abs",
        hints: ["Adjusted baseline − actual.", "440,000 − 450,000."],
        worked: "440,000 − 450,000 = −10,000 kWh — the building actually used 10,000 MORE than expected. No saving at all.",
      },
      {
        id: "overstatement",
        prompt: "By how much did the raw claim overstate the saving?",
        unit: "kWh",
        answer: 60000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Raw claim − real saving.", "50,000 − (−10,000)."],
        worked: "50,000 − (−10,000) = 60,000 kWh overstated — the whole 'saving' was a mild winter (and worse).",
      },
    ],
    candidateCauseIds: ["weather-luck", "needs-normalised-baseline", "raw-comparison-ok", "mv-sound"],
    correctCauseIds: ["weather-luck"],
    candidateActionIds: ["normalise-for-weather", "claim-raw-saving", "claim-inflated", "use-option-a"],
    correctActionIds: ["normalise-for-weather"],
    improvementActionIds: [],
    debrief:
      "This is the classic M&V trap: comparing raw bills across years of different weather. Once you normalise — what would the old building have used in this year's milder weather? — the 50,000 kWh 'saving' vanishes, and the building actually used 10,000 kWh MORE than expected. The raw claim overstated reality by 60,000 kWh. Never take credit for a mild winter (nor blame for a harsh one); always compare actual against the baseline under the same weather.",
    faultChain: [
      "Raw claim 50,000 kWh — but this winter was much milder",
      "Adjusted baseline 440,000 vs actual 450,000 → −10,000 kWh",
      "Raw claim overstated by 60,000 kWh — it was weather luck",
      "Fix: normalise for weather before claiming any saving",
    ],
  },

  // ---------------------------------------------------------------- Case 4
  {
    id: "ipmvp-option",
    title: "Case 4 — Which IPMVP option?",
    tag: "IPMVP",
    brief:
      "A modest lighting retrofit replaces 50 kW of old fittings with 20 kW of LEDs in one area. You need a credible saving figure without spending more on M&V than the project warrants. One parameter dominates (the power), and the hours can be reasonably estimated. Pick the option and quantify the saving.",
    knownFacts: [
      "Lighting retrofit: 50 kW old → 20 kW LED (measured power)",
      "Operating hours estimated at ~4,000 h/yr",
      "The saving is small and isolated to one system",
      "Electricity £0.20/kWh",
    ],
    readings: [
      { label: "Old / new power", value: "50 / 20", unit: "kW" },
      { label: "Estimated hours", value: "4,000", unit: "h/yr" },
      { label: "Scope", value: "one system", note: "isolated, modest value" },
      { label: "Electricity", value: "0.20", unit: "£/kWh" },
    ],
    refTables: ["ipmvp", "prices"],
    calcParts: [
      {
        id: "power-saved",
        prompt: "What is the measured power saving (the key parameter)?",
        unit: "kW",
        answer: 30,
        tol: 1,
        tolType: "abs",
        hints: ["Old − new power.", "50 − 20."],
        worked: "50 − 20 = 30 kW — the key parameter you measure under Option A.",
      },
      {
        id: "energy",
        prompt: "Using the estimated hours, what is the annual saving?",
        unit: "kWh/yr",
        answer: 120000,
        tol: 0.03,
        tolType: "rel",
        hints: ["Power saved × estimated hours.", "30 × 4,000."],
        worked: "30 × 4,000 = 120,000 kWh/yr (measured power × estimated hours = Option A).",
      },
      {
        id: "value",
        prompt: "What is that worth?",
        unit: "£/yr",
        answer: 24000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Energy × price.", "120,000 × 0.20."],
        worked: "120,000 × £0.20 = £24,000/yr.",
      },
    ],
    candidateCauseIds: ["small-measure-isolation", "needs-normalised-baseline", "boundary-change", "mv-sound"],
    correctCauseIds: ["small-measure-isolation"],
    candidateActionIds: ["use-option-a", "use-isolation-submetering", "report-normalised-saving", "claim-inflated"],
    correctActionIds: ["use-option-a"],
    improvementActionIds: ["use-isolation-submetering"],
    debrief:
      "Match the M&V method to the project. A small, isolated single-system measure with one dominant parameter is the textbook Option A: measure the key parameter (the power, here 30 kW saved) and reasonably estimate the rest (the hours). Whole-building Option C would never see a saving this small above the noise; Option D (simulation) is overkill when you have the equipment to measure. If the value justified more rigour — a performance contract, say — Option B would meter the hours too.",
    faultChain: [
      "Small, isolated lighting retrofit; one dominant parameter",
      "Measure power (30 kW saved), estimate hours (4,000)",
      "30 × 4,000 = 120,000 kWh ≈ £24,000/yr",
      "Fix: use IPMVP Option A (retrofit isolation, key parameter)",
    ],
  },

  // ---------------------------------------------------------------- Case 5
  {
    id: "non-routine",
    title: "Case 5 — A server room appeared",
    tag: "Non-routine adjustment",
    brief:
      "After an efficiency project, the weather-normalised baseline says the building should have used 480,000 kWh, and it actually used 470,000 — an apparent 10,000 kWh saving. But a new server room was installed inside the measurement boundary after the baseline, drawing 60,000 kWh/yr. That static-factor change needs a non-routine adjustment. Find the true saving.",
    knownFacts: [
      "Normalised baseline (pre-project model): 480,000 kWh",
      "Actual reporting-period energy: 470,000 kWh",
      "A new server room (added after baseline) draws 60,000 kWh/yr, inside the boundary",
      "Static-factor changes require a non-routine adjustment to the baseline",
    ],
    readings: [
      { label: "Normalised baseline", value: "480,000", unit: "kWh" },
      { label: "Actual energy", value: "470,000", unit: "kWh" },
      { label: "New server room", value: "60,000", unit: "kWh/yr", note: "added inside the boundary" },
      { label: "Apparent saving", value: "10,000", unit: "kWh", note: "before adjustment" },
    ],
    refTables: ["pitfalls", "savings"],
    calcParts: [
      {
        id: "naive",
        prompt: "What is the apparent (unadjusted) saving?",
        unit: "kWh",
        answer: 10000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Baseline − actual, before adjusting.", "480,000 − 470,000."],
        worked: "480,000 − 470,000 = 10,000 kWh — but this is masked by the new load.",
      },
      {
        id: "adjusted-baseline",
        prompt: "What is the baseline after a non-routine adjustment for the server room?",
        unit: "kWh",
        answer: 540000,
        tol: 0.02,
        tolType: "rel",
        hints: ["Add the new static load the baseline never had.", "480,000 + 60,000."],
        worked: "480,000 + 60,000 = 540,000 kWh — what the old building plus the new server room would use.",
      },
      {
        id: "true-saving",
        prompt: "What is the true saving?",
        unit: "kWh",
        answer: 70000,
        tol: 0.03,
        tolType: "rel",
        hints: ["Adjusted baseline − actual.", "540,000 − 470,000."],
        worked: "540,000 − 470,000 = 70,000 kWh — far more than the 10,000 it appeared, once the new load is accounted for.",
      },
    ],
    candidateCauseIds: ["boundary-change", "weather-luck", "needs-normalised-baseline", "mv-sound"],
    correctCauseIds: ["boundary-change"],
    candidateActionIds: ["make-non-routine-adjustment", "claim-inflated", "normalise-for-weather", "report-normalised-saving"],
    correctActionIds: ["make-non-routine-adjustment"],
    improvementActionIds: [],
    debrief:
      "When a static factor changes inside the boundary — an extension, new equipment, a process change — the baseline must be formally adjusted, or the comparison is wrong. Here a new server room added 60,000 kWh that the baseline never knew about, masking the real saving: account for it with a non-routine adjustment and the true saving is 70,000 kWh, not 10,000. Failing to make non-routine adjustments is a leading cause of wrong savings figures — in both directions.",
    faultChain: [
      "Apparent saving only 10,000 kWh after the project",
      "But a new 60,000 kWh server room was added inside the boundary",
      "Adjusted baseline 540,000 vs actual 470,000 → 70,000 kWh true saving",
      "Fix: make a non-routine adjustment for the static-factor change",
    ],
  },

  // ---------------------------------------------------------------- Case 6
  {
    id: "noise-floor",
    title: "Case 6 — Lost in the noise",
    tag: "Uncertainty",
    brief:
      "A whole-building (Option C) project claims a 4% saving on a building using 1,000,000 kWh/yr. But the baseline regression has a scatter of about ±6% — the month-to-month noise in the model. Can a 4% saving be claimed with confidence against ±6% of noise? Work it out.",
    knownFacts: [
      "Whole-building energy ~1,000,000 kWh/yr; claimed saving 4%",
      "Baseline model uncertainty (scatter) ≈ ±6%",
      "Option C needs savings comfortably above the baseline noise (≳10%)",
      "A saving smaller than the noise cannot be claimed with confidence",
    ],
    readings: [
      { label: "Annual energy", value: "1,000,000", unit: "kWh" },
      { label: "Claimed saving", value: "4", unit: "%" },
      { label: "Baseline uncertainty", value: "±6", unit: "%" },
      { label: "Method", value: "Option C", note: "whole-building" },
    ],
    refTables: ["pitfalls", "ipmvp"],
    calcParts: [
      {
        id: "claimed",
        prompt: "How large is the claimed saving in kWh?",
        unit: "kWh/yr",
        answer: 40000,
        tol: 0.03,
        tolType: "rel",
        hints: ["Saving % × energy.", "0.04 × 1,000,000."],
        worked: "0.04 × 1,000,000 = 40,000 kWh.",
      },
      {
        id: "uncertainty",
        prompt: "How large is the baseline uncertainty in kWh?",
        unit: "kWh/yr",
        answer: 60000,
        tol: 0.03,
        tolType: "rel",
        hints: ["Uncertainty % × energy.", "0.06 × 1,000,000."],
        worked: "0.06 × 1,000,000 = 60,000 kWh.",
      },
      {
        id: "gap",
        prompt: "By how much does the noise exceed the claimed saving?",
        unit: "kWh/yr",
        answer: 20000,
        tol: 0.1,
        tolType: "rel",
        hints: ["Uncertainty − claimed saving.", "60,000 − 40,000."],
        worked: "60,000 − 40,000 = 20,000 kWh — the saving is buried in the noise, so it can't be claimed with confidence.",
      },
    ],
    candidateCauseIds: ["saving-below-noise", "needs-normalised-baseline", "weather-luck", "mv-sound"],
    correctCauseIds: ["saving-below-noise"],
    candidateActionIds: ["use-isolation-submetering", "claim-inflated", "report-normalised-saving", "normalise-for-weather"],
    correctActionIds: ["use-isolation-submetering"],
    improvementActionIds: [],
    debrief:
      "A savings figure is only meaningful if it's larger than the uncertainty around it. Here a 4% (40,000 kWh) claim sits inside a ±6% (60,000 kWh) baseline scatter — the saving is smaller than the noise, so whole-building Option C can't prove it. That's why Option C needs savings of roughly 10%+ to stand out, and why small savings need tighter methods: isolate the affected system and sub-meter it (Option A/B) so the saving is measured directly, above the whole-building noise.",
    faultChain: [
      "Option C claim of 4% (40,000 kWh) on 1,000,000 kWh",
      "Baseline scatter ±6% (60,000 kWh) — bigger than the saving",
      "Saving buried in the noise — not defensible",
      "Fix: isolate and sub-meter (Option A/B) for a saving this small",
    ],
  },

  // ---------------------------------------------------------------- Case 7
  {
    id: "persistence",
    title: "Case 7 — Claiming year one for ten years",
    tag: "Persistence",
    brief:
      "A project verified a 100,000 kWh saving in year one, and the business case multiplies that by ten years for a 1,000,000 kWh lifetime claim. But ongoing M&V shows the saving decaying — controls have drifted back — falling roughly linearly to 30,000 kWh by year ten. Work out the honest lifetime figure.",
    knownFacts: [
      "Year-one verified saving: 100,000 kWh",
      "Ongoing M&V shows it decaying linearly to ~30,000 kWh by year ten",
      "Naive claim: year-one saving × 10 years",
      "Decay is controls drift / fouling — the link to maintenance",
    ],
    readings: [
      { label: "Year-1 saving", value: "100,000", unit: "kWh" },
      { label: "Year-10 saving", value: "30,000", unit: "kWh", note: "decayed (drift)" },
      { label: "Project life", value: "10", unit: "years" },
      { label: "Decay", value: "linear", note: "controls drifting back" },
    ],
    refTables: ["pitfalls", "savings"],
    calcParts: [
      {
        id: "naive",
        prompt: "What is the naive lifetime claim (year one × 10)?",
        unit: "kWh",
        answer: 1000000,
        tol: 0.02,
        tolType: "rel",
        hints: ["Year-one saving × years.", "100,000 × 10."],
        worked: "100,000 × 10 = 1,000,000 kWh — what the business case assumed.",
      },
      {
        id: "average",
        prompt: "What is the average annual saving (linear decay 100,000 → 30,000)?",
        unit: "kWh/yr",
        answer: 65000,
        tol: 0.03,
        tolType: "rel",
        hints: ["Average of the start and end values.", "(100,000 + 30,000) ÷ 2."],
        worked: "(100,000 + 30,000) ÷ 2 = 65,000 kWh/yr on average.",
      },
      {
        id: "real-lifetime",
        prompt: "What is the honest lifetime saving?",
        unit: "kWh",
        answer: 650000,
        tol: 0.03,
        tolType: "rel",
        hints: ["Average annual × years.", "65,000 × 10."],
        worked: "65,000 × 10 = 650,000 kWh — 350,000 kWh less than the naive claim.",
      },
    ],
    candidateCauseIds: ["persistence-decay", "weather-luck", "needs-normalised-baseline", "mv-sound"],
    correctCauseIds: ["persistence-decay"],
    candidateActionIds: ["ongoing-verification", "claim-lifetime-from-year1", "claim-inflated", "report-normalised-saving"],
    correctActionIds: ["ongoing-verification"],
    improvementActionIds: [],
    debrief:
      "A saving proven in year one may not persist: controls drift back, equipment fouls, staff override the efficient setup. Claiming the year-one figure for all ten years here overstates the lifetime by 350,000 kWh — the saving actually averaged 65,000, not 100,000. Ongoing verification catches the decay (and points to the maintenance needed to arrest it). Report the honest, declining lifetime figure, and use continued M&V both to claim savings credibly and to keep them from slipping away.",
    faultChain: [
      "Year-1 saving 100,000 kWh; claimed × 10 = 1,000,000",
      "But it decays to 30,000 by year 10 (drift)",
      "Average 65,000/yr → real lifetime 650,000 kWh",
      "Fix: verify on an ongoing basis; don't claim year-one for life",
    ],
  },

  // ---------------------------------------------------------------- Case 8
  {
    id: "rebound",
    title: "Case 8 — Short of the promise",
    tag: "Rebound",
    brief:
      "An insulation-and-heating upgrade was predicted by the engineers to save 200,000 kWh/yr. The properly normalised measured saving is 160,000 kWh. The shortfall isn't an M&V error — occupants have taken some of the benefit back as extra warmth (rebound). The pressure is on to 'make the number match the promise'. Decide what to report.",
    knownFacts: [
      "Engineering prediction: 200,000 kWh/yr saving",
      "Measured, normalised saving: 160,000 kWh/yr",
      "The gap is rebound (take-back) — typically 5–20% of the prediction",
      "Displaced heat £0.06/kWh",
    ],
    readings: [
      { label: "Predicted saving", value: "200,000", unit: "kWh" },
      { label: "Measured saving", value: "160,000", unit: "kWh", note: "normalised" },
      { label: "Gap", value: "rebound", note: "occupants take some back as warmth" },
      { label: "Heat price", value: "0.06", unit: "£/kWh" },
    ],
    refTables: ["pitfalls", "prices"],
    calcParts: [
      {
        id: "shortfall",
        prompt: "How much is the rebound (predicted − measured)?",
        unit: "kWh",
        answer: 40000,
        tol: 0.05,
        tolType: "rel",
        hints: ["Predicted − measured.", "200,000 − 160,000."],
        worked: "200,000 − 160,000 = 40,000 kWh taken back.",
      },
      {
        id: "rebound-pct",
        prompt: "What percentage of the prediction is the rebound?",
        unit: "%",
        answer: 20,
        tol: 1,
        tolType: "abs",
        hints: ["Shortfall ÷ predicted × 100.", "40,000 ÷ 200,000 × 100."],
        worked: "40,000 ÷ 200,000 = 20% — within the typical 5–20% rebound range.",
      },
      {
        id: "value",
        prompt: "What is the real, measured saving worth?",
        unit: "£/yr",
        answer: 9600,
        tol: 0.05,
        tolType: "rel",
        hints: ["Measured saving × heat price.", "160,000 × 0.06."],
        worked: "160,000 × £0.06 = £9,600/yr — the honest figure to report.",
      },
    ],
    candidateCauseIds: ["rebound-effect", "weather-luck", "saving-below-noise", "mv-sound"],
    correctCauseIds: ["rebound-effect"],
    candidateActionIds: ["report-measured-explain-rebound", "force-to-prediction", "claim-inflated", "claim-lifetime-from-year1"],
    correctActionIds: ["report-measured-explain-rebound"],
    improvementActionIds: [],
    debrief:
      "Engineering predictions assume ideal operation and full persistence; measured savings often come in lower because of rebound — a cheaper-to-heat building gets heated a bit warmer. The 40,000 kWh gap (20%) is real take-back, not an M&V error: the measured 160,000 kWh (£9,600/yr) is the honest saving. M&V's job is to report what actually happened, not to defend the original promise — so resist the pressure to 'adjust' the measurement up to 200,000. Overstating savings is the most damaging error in energy management.",
    faultChain: [
      "Predicted 200,000 kWh, measured 160,000 kWh",
      "40,000 kWh (20%) is rebound — occupants take some back",
      "The real saving is 160,000 kWh ≈ £9,600/yr",
      "Fix: report the measured saving and explain the rebound",
    ],
  },
];

export function getMvCase(id: string): MvCase | undefined {
  return MV_CASES.find((c) => c.id === id);
}
