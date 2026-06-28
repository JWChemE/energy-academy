"use client";

import { TES_CASES, TES_CAUSES, TES_ACTIONS, TesCase } from "@/lib/tesCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import TesReferencePanel from "./TesReferencePanel";

const accent: Accent = {
  tag: "bg-indigo-100 text-indigo-700",
  rowOn: "border-indigo-400 bg-indigo-50",
  box: "border-indigo-500 bg-indigo-500",
};

export default function TesSystemDiagnostics() {
  return (
    <CaseDiagnostics<TesCase>
      cases={TES_CASES}
      causes={TES_CAUSES}
      actions={TES_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight thermal-storage call-outs. Some you quantify (the capacity, the arbitrage value, the
          standing loss), some you judge — is the medium right, the tariff right, the tank stratified,
          the store charged at the right time? The thread through every case: storage stores energy,
          not money. It earns only from a <em>time value</em> — a price spread, a demand charge,
          avoided plant — and only if it's the right medium, well stratified, well insulated and
          charged when energy is cheap.
        </>
      }
      renderReference={(c) => <TesReferencePanel tables={c.refTables} />}
    />
  );
}
