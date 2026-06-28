"use client";

import { LIGHTING_CASES, LIGHTING_CAUSES, LIGHTING_ACTIONS, LightingCase } from "@/lib/lightingCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import LightingReferencePanel from "./LightingReferencePanel";

const accent: Accent = {
  tag: "bg-amber-100 text-amber-700",
  rowOn: "border-amber-400 bg-amber-50",
  box: "border-amber-500 bg-amber-500",
};

export default function LightingSystemDiagnostics() {
  return (
    <CaseDiagnostics<LightingCase>
      cases={LIGHTING_CASES}
      causes={LIGHTING_CAUSES}
      actions={LIGHTING_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight lighting call-outs across a building. Some you quantify (over-lighting, an LED
          retrofit, out-of-hours burning, occupancy and daylight savings, ballast losses), some you
          judge — is the lighting the wrong level, the wrong source, on at the wrong time, or just
          badly controlled? The hierarchy runs through every case: light to the right{" "}
          <em>level</em>, with the most efficient <em>source</em>, on only <em>when and where</em>{" "}
          it&apos;s needed.
        </>
      }
      renderReference={(c) => <LightingReferencePanel tables={c.refTables} />}
    />
  );
}
