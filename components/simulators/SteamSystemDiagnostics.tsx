"use client";

import { STEAM_CASES, STEAM_CAUSES, STEAM_ACTIONS, SteamCase } from "@/lib/steamCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import ReferencePanel from "./ReferencePanel";

const accent: Accent = {
  tag: "bg-teal-100 text-teal-700",
  rowOn: "border-teal-400 bg-teal-50",
  box: "border-teal-500 bg-teal-500",
};

export default function SteamSystemDiagnostics() {
  return (
    <CaseDiagnostics<SteamCase>
      cases={STEAM_CASES}
      causes={STEAM_CAUSES}
      actions={STEAM_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight steam &amp; condensate call-outs. The panel gives you raw readings — meter totals,
          temperatures, pressures, dimensions — and you must <strong>calculate</strong> the figure
          that matters (condensate return, flash %, trap loss, heat loss…) before you can diagnose
          and fix it. Reference data is on hand; the method is yours to recall.
        </>
      }
      renderReference={(c) => <ReferencePanel tables={c.refTables} />}
    />
  );
}
