"use client";

import { MAINT_CASES, MAINT_CAUSES, MAINT_ACTIONS, MaintCase } from "@/lib/maintCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import MaintReferencePanel from "./MaintReferencePanel";

const accent: Accent = {
  tag: "bg-lime-100 text-lime-700",
  rowOn: "border-lime-400 bg-lime-50",
  box: "border-lime-500 bg-lime-500",
};

export default function MaintSystemDiagnostics() {
  return (
    <CaseDiagnostics<MaintCase>
      cases={MAINT_CASES}
      causes={MAINT_CAUSES}
      actions={MAINT_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight maintenance call-outs — deferral, drift, strategy and prioritisation. Some you
          quantify (the cost of a fouled coil, a flue-temp creep, a slipping belt), some you judge —
          reactive or preventive, what interval, which assets first? The thread through every case:
          maintenance is an energy measure. Equipment at design condition uses the least energy, and
          every fouled surface, worn part and drifted control quietly burns more.
        </>
      }
      renderReference={(c) => <MaintReferencePanel tables={c.refTables} />}
    />
  );
}
