"use client";

import { HVAC_CASES, HVAC_CAUSES, HVAC_ACTIONS, HvacCase } from "@/lib/hvacCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import HvacReferencePanel from "./HvacReferencePanel";

const accent: Accent = {
  tag: "bg-sky-100 text-sky-700",
  rowOn: "border-sky-400 bg-sky-50",
  box: "border-sky-500 bg-sky-500",
};

export default function HvacSystemDiagnostics() {
  return (
    <CaseDiagnostics<HvacCase>
      cases={HVAC_CASES}
      causes={HVAC_CAUSES}
      actions={HVAC_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight HVAC call-outs — a real mix. Some you quantify with the fan and pump affinity laws
          or chiller COP; some you reason out from the symptoms; all are about{" "}
          <strong>improvements and optimisations</strong>. Read the raw panel, work out what the
          waste is worth, then diagnose the root cause and prescribe the fix. You won&apos;t know
          what you&apos;ll find until you look.
        </>
      }
      renderReference={(c) => <HvacReferencePanel tables={c.refTables} />}
    />
  );
}
