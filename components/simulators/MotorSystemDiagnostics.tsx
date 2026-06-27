"use client";

import { MOTOR_CASES, MOTOR_CAUSES, MOTOR_ACTIONS, MotorCase } from "@/lib/motorCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import MotorReferencePanel from "./MotorReferencePanel";

const accent: Accent = {
  tag: "bg-violet-100 text-violet-700",
  rowOn: "border-violet-400 bg-violet-50",
  box: "border-violet-500 bg-violet-500",
};

export default function MotorSystemDiagnostics() {
  return (
    <CaseDiagnostics<MotorCase>
      cases={MOTOR_CASES}
      causes={MOTOR_CAUSES}
      actions={MOTOR_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight motors &amp; drives call-outs — a real mix. Some you quantify (load factor, the
          affinity laws, power-factor correction, payback), some you reason out from the symptoms,
          and some are <strong>financial judgments</strong> — rewind or replace, upgrade now or wait.
          Read the raw panel, work out what the prize is worth, then diagnose and prescribe.
        </>
      }
      renderReference={(c) => <MotorReferencePanel tables={c.refTables} />}
    />
  );
}
