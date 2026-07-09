"use client";

import { DAIRY_CASES, DAIRY_CAUSES, DAIRY_ACTIONS, DairyCase } from "@/lib/dairyCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import DairyReferencePanel from "./DairyReferencePanel";

const accent: Accent = {
  tag: "bg-cyan-100 text-cyan-800",
  rowOn: "border-cyan-400 bg-cyan-50",
  box: "border-cyan-500 bg-cyan-500",
};

export default function DairySystemDiagnostics() {
  return (
    <CaseDiagnostics<DairyCase>
      cases={DAIRY_CASES}
      causes={DAIRY_CAUSES}
      actions={DAIRY_ACTIONS}
      accent={accent}
      intro={
        <>
          Two quick dairy call-outs — a pasteuriser whose regeneration has quietly degraded, and an
          ice bank making its ice at the wrong time of day. Same method as every other deep-dive
          capstone on this platform: calculate, diagnose, prescribe, verify.
        </>
      }
      renderReference={(c) => <DairyReferencePanel tables={c.refTables} />}
    />
  );
}
