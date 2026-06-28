"use client";

import { COMMX_CASES, COMMX_CAUSES, COMMX_ACTIONS, CommxCase } from "@/lib/commxCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import CommxReferencePanel from "./CommxReferencePanel";

const accent: Accent = {
  tag: "bg-sky-100 text-sky-700",
  rowOn: "border-sky-400 bg-sky-50",
  box: "border-sky-500 bg-sky-500",
};

export default function CommxSystemDiagnostics() {
  return (
    <CaseDiagnostics<CommxCase>
      cases={COMMX_CASES}
      causes={COMMX_CAUSES}
      actions={COMMX_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight commissioning call-outs — flows, capacities, sequences, sensors, setpoints, pressures,
          drift and handover. Some you quantify (a performance test, a saving), some you judge — does
          it meet design, and should you sign it off? The thread through every case: commissioning is
          the bridge between design intent and actual performance, and the cardinal sin is accepting a
          handover that doesn&apos;t meet design — because fixing it later costs ten times as much.
        </>
      }
      renderReference={(c) => <CommxReferencePanel tables={c.refTables} />}
    />
  );
}
