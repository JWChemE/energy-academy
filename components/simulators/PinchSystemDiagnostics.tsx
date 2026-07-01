"use client";

import { PINCH_CASES, PINCH_CAUSES, PINCH_ACTIONS, PinchCase } from "@/lib/pinchCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import PinchReferencePanel from "./PinchReferencePanel";

const accent: Accent = {
  tag: "bg-cyan-100 text-cyan-700",
  rowOn: "border-cyan-400 bg-cyan-50",
  box: "border-cyan-500 bg-cyan-500",
};

export default function PinchSystemDiagnostics() {
  return (
    <CaseDiagnostics<PinchCase>
      cases={PINCH_CASES}
      causes={PINCH_CAUSES}
      actions={PINCH_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight process-integration call-outs — untargeted designs, misplaced utilities, infeasible
          matches, stream splitting, threshold problems, ΔTmin economics, over-complicated networks and
          a retrofit audit. Some you quantify (the pinch, the utility gap, the total cost), some you
          judge — is this match feasible, does this process need one utility or two, is this network
          over-built? The thread through every case: find the true minimum target before designing
          anything, and never let heat cross the pinch.
        </>
      }
      renderReference={(c) => <PinchReferencePanel tables={c.refTables} />}
    />
  );
}
