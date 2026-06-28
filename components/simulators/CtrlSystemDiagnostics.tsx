"use client";

import { CTRL_CASES, CTRL_CAUSES, CTRL_ACTIONS, CtrlCase } from "@/lib/ctrlCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import CtrlReferencePanel from "./CtrlReferencePanel";

const accent: Accent = {
  tag: "bg-fuchsia-100 text-fuchsia-700",
  rowOn: "border-fuchsia-400 bg-fuchsia-50",
  box: "border-fuchsia-500 bg-fuchsia-500",
};

export default function CtrlSystemDiagnostics() {
  return (
    <CaseDiagnostics<CtrlCase>
      cases={CTRL_CASES}
      causes={CTRL_CAUSES}
      actions={CTRL_ACTIONS}
      accent={accent}
      intro={
        <>
          Eight controls and BMS call-outs. Some you quantify (out-of-hours running, a reset saving, a
          sensor error), some you judge — is it the schedule, the deadband, the sensor or the valve?
          The thread through every case: good control keeps the building on setpoint without
          overshoot, conditions it only when occupied, stops its loops fighting, and trusts only
          sensors that are well placed and calibrated. Most waste is a setting, not the plant.
        </>
      }
      renderReference={(c) => <CtrlReferencePanel tables={c.refTables} />}
    />
  );
}
