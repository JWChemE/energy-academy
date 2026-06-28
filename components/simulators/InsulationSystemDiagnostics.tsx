"use client";

import { INSULATION_CASES, INSULATION_CAUSES, INSULATION_ACTIONS, InsulationCase } from "@/lib/insulationCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import InsulationReferencePanel from "./InsulationReferencePanel";

const accent: Accent = {
  tag: "bg-purple-100 text-purple-700",
  rowOn: "border-purple-400 bg-purple-50",
  box: "border-purple-500 bg-purple-500",
};

export default function InsulationSystemDiagnostics() {
  return (
    <CaseDiagnostics<InsulationCase>
      cases={INSULATION_CASES}
      causes={INSULATION_CAUSES}
      actions={INSULATION_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight insulation call-outs round a plant — bare pipes and valves, an unlagged tank, thin
          lagging, a sweating chilled line, a tight service void, a scalding walkway pipe, and lagging
          hacked off and never replaced. Some you quantify (the heat loss and payback), some you judge
          (is it the right thickness, the right material, safe to touch?). Hot surfaces bleed heat
          continuously and cheaply fixed — but the thickness is set by economics <em>and</em> safety,
          and the material by temperature, moisture and fire.
        </>
      }
      renderReference={(c) => <InsulationReferencePanel tables={c.refTables} />}
    />
  );
}
