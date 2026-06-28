"use client";

import { REFRIG_CASES, REFRIG_CAUSES, REFRIG_ACTIONS, RefrigCase } from "@/lib/refrigCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import RefrigReferencePanel from "./RefrigReferencePanel";

const accent: Accent = {
  tag: "bg-blue-100 text-blue-700",
  rowOn: "border-blue-400 bg-blue-50",
  box: "border-blue-500 bg-blue-500",
};

export default function RefrigSystemDiagnostics() {
  return (
    <CaseDiagnostics<RefrigCase>
      cases={REFRIG_CASES}
      causes={REFRIG_CAUSES}
      actions={REFRIG_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight refrigeration and heat-pump call-outs. Some you quantify (a collapsed COP, a setpoint
          saving, a part-load fix, a heat-pump business case, free cooling), some you read off the
          gauges (superheat and subcooling), some you judge. The unifying metric is{" "}
          <em>COP</em>: electrical input = useful output ÷ COP — and most faults are a COP that has
          collapsed, or heat made the expensive way.
        </>
      }
      renderReference={(c) => <RefrigReferencePanel tables={c.refTables} />}
    />
  );
}
