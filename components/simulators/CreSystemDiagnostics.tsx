"use client";

import { CRE_CASES, CRE_CAUSES, CRE_ACTIONS, CreCase } from "@/lib/creCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import CreReferencePanel from "./CreReferencePanel";

const accent: Accent = {
  tag: "bg-sky-100 text-sky-800",
  rowOn: "border-sky-400 bg-sky-50",
  box: "border-sky-500 bg-sky-500",
};

export default function CreSystemDiagnostics() {
  return (
    <CaseDiagnostics<CreCase>
      cases={CRE_CASES}
      causes={CRE_CAUSES}
      actions={CRE_ACTIONS}
      accent={accent}
      intro={
        <>
          Two quick office call-outs — a building running flat-out around the clock, and an
          air-handling unit heating and cooling the same air. Same method as every other deep-dive
          capstone on this platform: calculate, diagnose, prescribe, verify.
        </>
      }
      renderReference={(c) => <CreReferencePanel tables={c.refTables} />}
    />
  );
}
