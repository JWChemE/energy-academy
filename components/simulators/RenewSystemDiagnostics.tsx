"use client";

import { RENEW_CASES, RENEW_CAUSES, RENEW_ACTIONS, RenewCase } from "@/lib/renewCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import RenewReferencePanel from "./RenewReferencePanel";

const accent: Accent = {
  tag: "bg-green-100 text-green-700",
  rowOn: "border-green-400 bg-green-50",
  box: "border-green-500 bg-green-500",
};

export default function RenewSystemDiagnostics() {
  return (
    <CaseDiagnostics<RenewCase>
      cases={RENEW_CASES}
      causes={RENEW_CAUSES}
      actions={RENEW_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight on-site renewables call-outs. Some you quantify (PV yield, the value of
          self-consumption, the wind cube law), some you judge — is the array sized to demand, the
          roof the right way round, the site actually windy, the fault even visible? The thread
          through every case: self-consumed power is worth two-to-four times exported power, so size
          and operate renewables to the building&apos;s own demand — and PV beats wind on almost every
          building.
        </>
      }
      renderReference={(c) => <RenewReferencePanel tables={c.refTables} />}
    />
  );
}
