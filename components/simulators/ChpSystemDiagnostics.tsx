"use client";

import { CHP_CASES, CHP_CAUSES, CHP_ACTIONS, ChpCase } from "@/lib/chpCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import ChpReferencePanel from "./ChpReferencePanel";

const accent: Accent = {
  tag: "bg-orange-100 text-orange-700",
  rowOn: "border-orange-400 bg-orange-50",
  box: "border-orange-500 bg-orange-500",
};

export default function ChpSystemDiagnostics() {
  return (
    <CaseDiagnostics<ChpCase>
      cases={CHP_CASES}
      causes={CHP_CAUSES}
      actions={CHP_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight CHP call-outs where the unit looks like it&apos;s working but isn&apos;t earning its
          keep. Some you quantify (real efficiency with heat dumped, the spark spread, export value
          given away, lost heat recovery, the carbon balance against a cleaner grid), some you reason
          out from the symptoms. The golden thread runs through every case: a CHP only delivers when
          its heat is genuinely used — and when the economics and carbon still stack up.
        </>
      }
      renderReference={(c) => <ChpReferencePanel tables={c.refTables} />}
    />
  );
}
