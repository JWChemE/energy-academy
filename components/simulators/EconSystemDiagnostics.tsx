"use client";

import { ECON_CASES, ECON_CAUSES, ECON_ACTIONS, EconCase } from "@/lib/econCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import EconReferencePanel from "./EconReferencePanel";

const accent: Accent = {
  tag: "bg-emerald-100 text-emerald-700",
  rowOn: "border-emerald-400 bg-emerald-50",
  box: "border-emerald-500 bg-emerald-500",
};

export default function EconSystemDiagnostics() {
  return (
    <CaseDiagnostics<EconCase>
      cases={ECON_CASES}
      causes={ECON_CAUSES}
      actions={ECON_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight project-appraisal call-outs — payback, time value, NPV, IRR, whole-life cost,
          financing and risk. Some you quantify (the present value, the NPV), some you judge — which
          project, what financing, how to price the risk? The thread through every case: a pound today
          is worth more than a pound tomorrow. Screen with payback, but <em>decide</em> with NPV, IRR
          and whole-life cost — and never let a high IRR or a long payback fool you.
        </>
      }
      renderReference={(c) => <EconReferencePanel tables={c.refTables} />}
    />
  );
}
