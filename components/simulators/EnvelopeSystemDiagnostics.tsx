"use client";

import { ENVELOPE_CASES, ENVELOPE_CAUSES, ENVELOPE_ACTIONS, EnvelopeCase } from "@/lib/envelopeCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import EnvelopeReferencePanel from "./EnvelopeReferencePanel";

const accent: Accent = {
  tag: "bg-stone-200 text-stone-700",
  rowOn: "border-stone-400 bg-stone-50",
  box: "border-stone-500 bg-stone-500",
};

export default function EnvelopeSystemDiagnostics() {
  return (
    <CaseDiagnostics<EnvelopeCase>
      cases={ENVELOPE_CASES}
      causes={ENVELOPE_CAUSES}
      actions={ENVELOPE_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight envelope call-outs on an ageing building. Some you quantify (loft and cavity savings,
          air-leakage losses, thermal-bridge heat loss, glazing economics, summer solar gain), some
          you judge — is this a solid wall or a cavity, a loss problem or a gain problem, too leaky or
          sealed too tight? The thread through every case is <em>fabric first, in sequence</em>:
          cheapest, highest-impact measures before expensive ones, and never a fix that causes the
          moisture or overheating it doesn&apos;t pay for.
        </>
      }
      renderReference={(c) => <EnvelopeReferencePanel tables={c.refTables} />}
    />
  );
}
