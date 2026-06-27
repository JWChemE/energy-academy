"use client";

import { AIR_CASES, AIR_CAUSES, AIR_ACTIONS, AirCase } from "@/lib/airCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import AirReferencePanel from "./AirReferencePanel";

const accent: Accent = {
  tag: "bg-cyan-100 text-cyan-700",
  rowOn: "border-cyan-400 bg-cyan-50",
  box: "border-cyan-500 bg-cyan-500",
};

export default function AirSystemDiagnostics() {
  return (
    <CaseDiagnostics<AirCase>
      cases={AIR_CASES}
      causes={AIR_CAUSES}
      actions={AIR_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight compressed-air call-outs on the most expensive utility on site. Some you quantify
          (leak load, idling cost, pressure savings, heat recovery, payback), some you reason out
          from the symptoms. Read the raw panel, work out what the waste is worth, then diagnose the
          root cause and prescribe the fix.
        </>
      }
      renderReference={(c) => <AirReferencePanel tables={c.refTables} />}
    />
  );
}
