"use client";

import { DC_CASES, DC_CAUSES, DC_ACTIONS, DcCase } from "@/lib/dcCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import DcReferencePanel from "./DcReferencePanel";

const accent: Accent = {
  tag: "bg-violet-100 text-violet-800",
  rowOn: "border-violet-400 bg-violet-50",
  box: "border-violet-500 bg-violet-500",
};

export default function DcSystemDiagnostics() {
  return (
    <CaseDiagnostics<DcCase>
      cases={DC_CASES}
      causes={DC_CAUSES}
      actions={DC_ACTIONS}
      accent={accent}
      intro={
        <>
          Two quick facility call-outs — a hall whose fans fight their own bypass airflow, and a UPS
          fleet idling at the worst point on its efficiency curve. Same method as every other
          deep-dive capstone on this platform: calculate, diagnose, prescribe, verify.
        </>
      }
      renderReference={(c) => <DcReferencePanel tables={c.refTables} />}
    />
  );
}
