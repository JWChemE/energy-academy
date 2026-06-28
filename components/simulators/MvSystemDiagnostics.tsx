"use client";

import { MV_CASES, MV_CAUSES, MV_ACTIONS, MvCase } from "@/lib/mvCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import MvReferencePanel from "./MvReferencePanel";

const accent: Accent = {
  tag: "bg-violet-100 text-violet-700",
  rowOn: "border-violet-400 bg-violet-50",
  box: "border-violet-500 bg-violet-500",
};

export default function MvSystemDiagnostics() {
  return (
    <CaseDiagnostics<MvCase>
      cases={MV_CASES}
      causes={MV_CAUSES}
      actions={MV_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight M&amp;V call-outs — savings calculations, baselines, IPMVP option choices, and the
          pitfalls that overstate results. Some you quantify (the adjusted baseline, the real saving),
          some you judge — is it weather luck, a boundary change, noise, rebound? The thread through
          every case is integrity: a saving is the energy you <em>avoided</em>, measured against an
          adjusted baseline under the same conditions — never raw bills — and the cardinal error is
          overstatement.
        </>
      }
      renderReference={(c) => <MvReferencePanel tables={c.refTables} />}
    />
  );
}
