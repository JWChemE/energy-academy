/**
 * Data centre diagnostic mini-cases — two quick, hands-on facility call-outs
 * for the Data Centres sector course: a hall whose CRAH fans oversupply
 * against their own bypass airflow, and a UPS fleet idling at the worst
 * point on its efficiency curve. Built on the shared diagnostics core
 * (lib/diagnostics.ts) and rendered by the same CaseDiagnostics component
 * as every Level 2 capstone — two cases, embedded partway through a lesson
 * rather than as the course's own capstone (that's the facility audit, in
 * the next module).
 */

import { CauseDef, ActionDef, DiagnosticCase } from "./diagnostics";

export const DC_CAUSES: CauseDef[] = [
  { id: "bypass-airflow", label: "Bypass and recirculation: cold air short-circuits back without passing through the IT, so fans oversupply to compensate" },
  { id: "ups-part-load", label: "UPS modules running far below their efficient load range because of how redundancy was configured" },
  { id: "undersized-cooling", label: "Cooling plant undersized for the hall's IT load" },
  { id: "correct-operation", label: "System operating as designed — no fault" },
];

export const DC_ACTIONS: ActionDef[] = [
  { id: "containment-and-vfd", label: "Fit blanking plates and aisle containment, then commission the CRAH fans to run at reduced speed on VFDs", tier: 3 },
  { id: "rebalance-ups", label: "Reconfigure the UPS fleet so modules run in their efficient load range, preserving the redundancy level", tier: 2 },
  { id: "accept-as-is", label: "Leave the system as it is", tier: 1 },
  { id: "add-crah-units", label: "Install additional CRAH units for more airflow", tier: 3 },
  { id: "add-ups-modules", label: "Install additional UPS modules", tier: 3 },
];

export type DcRefTable = "fans" | "ups" | "prices";

export interface DcCase extends DiagnosticCase {
  refTables: DcRefTable[];
}

export const DC_CASES: DcCase[] = [
  // ---------------------------------------------------------------- Case 1
  {
    id: "bypass-airflow-fans",
    title: "Case 1 — The Hall That Fights Itself",
    tag: "Airflow",
    brief:
      "A legacy data hall runs eight CRAH units at fixed full speed, 4 kW of fan power each. An airflow survey finds why: without blanking plates or containment, roughly half the cold air bypasses the racks and returns unused, so the fans push double the airflow the IT actually needs. With blanking, containment and VFDs, the survey concludes the fans could hold conditions at about 70% speed. Quantify the prize before you name the fault.",
    knownFacts: [
      "8 CRAH units × 4 kW fan power, fixed speed, running 8,760 h/yr",
      "Survey: ~50% of supplied air bypasses the IT (missing blanking plates, open aisle ends)",
      "With containment + VFDs, ~70% fan speed would hold rack inlet conditions",
      "Fan power follows the cube of speed; electricity £0.20/kWh",
    ],
    readings: [
      { label: "CRAH fan power", value: "8 × 4", unit: "kW" },
      { label: "Bypass fraction", value: "~50", unit: "%", note: "Half the cold air never passes through a server" },
      { label: "Achievable speed", value: "70", unit: "%" },
      { label: "Rack inlet temps", value: "18–24", unit: "°C" },
    ],
    refTables: ["fans", "prices"],
    calcParts: [
      {
        id: "fan-power-70",
        prompt: "Using the cube law, what would total fan power be at 70% speed?",
        unit: "kW",
        answer: 10.98,
        tol: 0.03,
        tolType: "rel",
        hints: ["Total power × (speed fraction)³.", "32 × 0.7³."],
        worked: "32 × 0.343 ≈ 10.98 kW — the cube law turns a 30% speed cut into a 66% power cut.",
      },
      {
        id: "saving-kwh",
        prompt: "How much electricity does that save across the year?",
        unit: "kWh",
        answer: 184170,
        tol: 0.02,
        tolType: "rel",
        hints: ["(Current − reduced) kW × 8,760 h.", "(32 − 10.98) × 8,760."],
        worked: "21.02 kW × 8,760 h ≈ 184,170 kWh a year, every hour of which was spent pushing air past the servers rather than through them.",
      },
      {
        id: "saving-value",
        prompt: "What is that worth at £0.20/kWh?",
        unit: "£/yr",
        answer: 36834,
        tol: 0.03,
        tolType: "rel",
        hints: ["Saved kWh × price.", "184,170 × 0.20."],
        worked: "184,170 × £0.20 ≈ £36,834/yr — before counting the chiller energy no longer needed to re-cool recirculated air.",
      },
    ],
    candidateCauseIds: ["undersized-cooling", "correct-operation", "bypass-airflow", "ups-part-load"],
    correctCauseIds: ["bypass-airflow"],
    candidateActionIds: ["add-crah-units", "containment-and-vfd", "accept-as-is", "rebalance-ups"],
    correctActionIds: ["containment-and-vfd"],
    improvementActionIds: [],
    debrief:
      "The hall looks short of cooling, which is why 'more CRAH units' is always the first proposal on the table — and it would have made things worse, adding fan power to push yet more air past the same gaps. The actual fault is that the air isn't going through the IT: missing blanking plates and open aisles let half of it short-circuit home. Containment and blanking fix the path; VFDs then harvest the cube law, cutting fan power by two-thirds for a 30% speed reduction. This sequence (fix the airflow, then slow the fans) is the single most reliable retrofit in legacy data halls.",
    faultChain: [
      "No blanking/containment: ~50% of cold air bypasses the IT",
      "Fans at 100% to compensate: 32 kW around the clock",
      "Containment + VFDs at 70% speed: 32 → 10.98 kW (cube law)",
      "Fix: blank, contain, then commission fans down — ~£36,834/yr",
    ],
  },

  // ---------------------------------------------------------------- Case 2
  {
    id: "ups-part-load",
    title: "Case 2 — The UPS Fleet on Standby Wages",
    tag: "Power chain",
    brief:
      "A facility's IT load of 300 kW is carried by four 500 kVA double-conversion UPS modules, configured so each runs at about 15% load. At that loading the modules manage only 89% efficiency; at 30% load the same modules reach 94%. The site's engineers can reconfigure the fleet to run pairs at 30% while preserving the required redundancy. Work out what the current configuration wastes.",
    knownFacts: [
      "IT load: 300 kW continuous; four 500 kVA modules at ~15% load each",
      "Module efficiency: 89% at 15% load; 94% at 30% load",
      "Reconfiguration keeps the site's contracted redundancy level",
      "8,760 h/yr; electricity £0.20/kWh",
    ],
    readings: [
      { label: "IT load", value: "300", unit: "kW" },
      { label: "Module loading", value: "~15", unit: "%", note: "Far below the efficient range" },
      { label: "Efficiency at 15%", value: "89", unit: "%" },
      { label: "Efficiency at 30%", value: "94", unit: "%" },
    ],
    refTables: ["ups", "prices"],
    calcParts: [
      {
        id: "loss-now",
        prompt: "How much power does the UPS fleet lose right now, carrying 300 kW at 89% efficiency?",
        unit: "kW",
        answer: 37.1,
        tol: 0.03,
        tolType: "rel",
        hints: ["Input = load ÷ efficiency; loss = input − load.", "300 ÷ 0.89 − 300."],
        worked: "300 ÷ 0.89 ≈ 337.1 kW drawn; 37.1 kW lost as heat, continuously.",
      },
      {
        id: "loss-after",
        prompt: "And after reconfiguration, at 94% efficiency?",
        unit: "kW",
        answer: 19.1,
        tol: 0.03,
        tolType: "rel",
        hints: ["Same formula at the better efficiency.", "300 ÷ 0.94 − 300."],
        worked: "300 ÷ 0.94 ≈ 319.1 kW drawn; 19.1 kW lost — nearly halving the loss without touching a server.",
      },
      {
        id: "annual-value",
        prompt: "What is the reconfiguration worth per year?",
        unit: "£/yr",
        answer: 31413,
        tol: 0.03,
        tolType: "rel",
        hints: ["Loss reduction × 8,760 h × price.", "(37.1 − 19.1) × 8,760 × 0.20."],
        worked: "17.93 kW × 8,760 × £0.20 ≈ £31,413/yr — and every saved kilowatt was also heat the cooling plant no longer has to remove.",
      },
    ],
    candidateCauseIds: ["correct-operation", "ups-part-load", "bypass-airflow", "undersized-cooling"],
    correctCauseIds: ["ups-part-load"],
    candidateActionIds: ["add-ups-modules", "accept-as-is", "rebalance-ups", "containment-and-vfd"],
    correctActionIds: ["rebalance-ups"],
    improvementActionIds: [],
    debrief:
      "Nothing is broken: every module is healthy, the redundancy contract is honoured, and the fleet has run this way since a planned expansion doubled the module count ahead of IT growth that arrived slower than forecast. But double-conversion UPS efficiency collapses at low load, and four modules loafing at 15% pay a 37 kW standing loss around the clock. Reconfiguring to run modules in their efficient range, with the same redundancy, claws back £31,413 a year, plus the cooling energy behind it. The power chain rewards anyone who checks not just what equipment the site has, but at what fraction of its rating it actually runs.",
    faultChain: [
      "300 kW carried by four modules at ~15% load each",
      "89% efficiency at that loading: 37.1 kW of continuous loss",
      "Reconfigured to 30% loading: 94% efficient, 19.1 kW loss",
      "Fix: rebalance the fleet — ~£31,413/yr, redundancy preserved",
    ],
  },
];

export function getDcCase(id: string): DcCase | undefined {
  return DC_CASES.find((c) => c.id === id);
}
