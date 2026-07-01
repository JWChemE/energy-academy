"use client";

import { BREWERY_CASES, BREWERY_CAUSES, BREWERY_ACTIONS, BreweryCase } from "@/lib/breweryCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import BreweryReferencePanel from "./BreweryReferencePanel";

const accent: Accent = {
  tag: "bg-amber-100 text-amber-800",
  rowOn: "border-amber-400 bg-amber-50",
  box: "border-amber-500 bg-amber-500",
};

export default function BrewerySystemDiagnostics() {
  return (
    <CaseDiagnostics<BreweryCase>
      cases={BREWERY_CASES}
      causes={BREWERY_CAUSES}
      actions={BREWERY_ACTIONS}
      accent={accent}
      intro={
        <>
          Two quick brewery call-outs — a missed wort heat-recovery opportunity, and a glycol cooling
          shortfall. Same method as every other deep-dive capstone on this platform: calculate, diagnose,
          prescribe, verify.
        </>
      }
      renderReference={(c) => <BreweryReferencePanel tables={c.refTables} />}
    />
  );
}
