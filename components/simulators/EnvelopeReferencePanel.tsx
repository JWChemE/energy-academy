"use client";

import { useState } from "react";
import { U_VALUES, G_VALUES, AIR, PRICES, ANNUAL_FACTOR, HDD } from "@/lib/envelopeTables";
import { EnvelopeRefTable } from "@/lib/envelopeCases";

/**
 * Building-envelope reference data — typical U-values, the degree-day annual
 * loss factor, airtightness/ventilation constants, glazing U/g-values and
 * prices. Always on hand in the Calculate step; the method stays behind the hint.
 */
export default function EnvelopeReferencePanel({ tables }: { tables: EnvelopeRefTable[] }) {
  const [open, setOpen] = useState(true);
  if (tables.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-bold text-slate-900"
      >
        📑 Reference data {open ? "▾" : "▸"}
      </button>
      {open && (
        <div className="space-y-4 border-t border-slate-100 px-4 py-3 text-xs">
          {tables.includes("uvalues") && (
            <Block title="Typical U-values (W/m²K)">
              <p className="text-slate-600">
                Solid brick {U_VALUES.solidBrickWall} · uninsulated cavity {U_VALUES.uninsulatedCavity} ·
                insulated wall {U_VALUES.insulatedWall} · uninsulated loft {U_VALUES.uninsulatedLoft} ·
                insulated loft {U_VALUES.insulatedLoft}.
              </p>
              <p className="text-slate-500">
                Heat loss = U × A × ΔT. A linear thermal bridge loses ψ × length (W/K).
              </p>
            </Block>
          )}
          {tables.includes("annual") && (
            <Block title="Annual heat loss & cost">
              <p className="text-slate-600">
                At {HDD.toLocaleString()} HDD, annual loss ≈{" "}
                <span className="font-mono font-semibold">(U × A) × {ANNUAL_FACTOR} kWh/yr</span> (i.e. per
                W/K).
              </p>
              <p className="text-slate-500">
                Delivered-heat cost = gas £{PRICES.gas.toFixed(2)} ÷ {Math.round(PRICES.boilerEff * 100)}%
                boiler ≈ £{(PRICES.gas / PRICES.boilerEff).toFixed(3)}/kWh.
              </p>
            </Block>
          )}
          {tables.includes("airtight") && (
            <Block title="Airtightness & ventilation">
              <p className="text-slate-600">
                Heat per air change ≈{" "}
                <span className="font-mono font-semibold">{AIR.volHeatCap} Wh/m³K</span>. Loss = {AIR.volHeatCap}{" "}
                × ACH × volume (W/K).
              </p>
              <p className="text-slate-500">
                In-use ACH ≈ blower-door ACH50 ÷ {AIR.ach50Divisor}. MVHR recovers ≈{" "}
                {Math.round(AIR.mvhrRecovery * 100)}% of ventilation heat.
              </p>
            </Block>
          )}
          {tables.includes("glazing") && (
            <Block title="Glazing">
              <p className="text-slate-600">
                U-value: single {U_VALUES.singleGlazing} · double {U_VALUES.doubleGlazing} · triple{" "}
                {U_VALUES.tripleGlazing} W/m²K.
              </p>
              <p className="text-slate-500">
                g-value (solar gain): clear {G_VALUES.clearDouble} · solar-control {G_VALUES.solarControl}.
                Solar gain = g × area × irradiance.
              </p>
            </Block>
          )}
          {tables.includes("prices") && (
            <Block title="Energy price & cooling">
              <p className="text-slate-500">
                Electricity £{PRICES.elec.toFixed(2)}/kWh; cooling COP ≈ {PRICES.coolingCop}. Cooling
                electricity = heat removed ÷ COP.
              </p>
            </Block>
          )}
        </div>
      )}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 font-semibold text-slate-700">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
