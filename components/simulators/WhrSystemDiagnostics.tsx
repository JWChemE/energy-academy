"use client";

import { WHR_CASES, WHR_CAUSES, WHR_ACTIONS, WhrCase } from "@/lib/whrCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import WhrReferencePanel from "./WhrReferencePanel";

const accent: Accent = {
  tag: "bg-rose-100 text-rose-700",
  rowOn: "border-rose-400 bg-rose-50",
  box: "border-rose-500 bg-rose-500",
};

export default function WhrSystemDiagnostics() {
  return (
    <CaseDiagnostics<WhrCase>
      cases={WHR_CASES}
      causes={WHR_CAUSES}
      actions={WHR_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight waste-heat call-outs across a site — flue gas, condenser water, exhaust air, process
          ovens, flashing condensate. Some you quantify (the heat rate, the effectiveness, the
          recovery and its payback), some you judge: is the heat the right grade, and does it arrive
          when the demand is there? A project only earns when <em>supply, demand, temperature</em> and{" "}
          <em>timing</em> all align — and when they do, the paybacks are often under a year.
        </>
      }
      renderReference={(c) => <WhrReferencePanel tables={c.refTables} />}
    />
  );
}
