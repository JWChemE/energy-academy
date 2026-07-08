"use client";

import { FOOD_CASES, FOOD_CAUSES, FOOD_ACTIONS, FoodCase } from "@/lib/foodCases";
import CaseDiagnostics, { Accent } from "./CaseDiagnostics";
import FoodReferencePanel from "./FoodReferencePanel";

const accent: Accent = {
  tag: "bg-orange-100 text-orange-800",
  rowOn: "border-orange-400 bg-orange-50",
  box: "border-orange-500 bg-orange-500",
};

export default function FoodSystemDiagnostics() {
  return (
    <CaseDiagnostics<FoodCase>
      cases={FOOD_CASES}
      causes={FOOD_CAUSES}
      actions={FOOD_ACTIONS}
      accent={accent}
      intro={
        <>
          Two quick factory call-outs — washdown water heated by gas while the refrigeration plant
          throws heat away, and a freezer defrosting on a timer nobody questioned. Same method as
          every other deep-dive capstone on this platform: calculate, diagnose, prescribe, verify.
        </>
      }
      renderReference={(c) => <FoodReferencePanel tables={c.refTables} />}
    />
  );
}
