"use client";

import { useState } from "react";
import { WATER_C, ICE_LATENT, PRICES } from "@/lib/tesTables";
import { TesRefTable } from "@/lib/tesCases";

/**
 * Thermal-energy-storage reference data — sensible/latent capacity, load-shift
 * arbitrage, stratification, seasonal scale and prices. Always on hand in the
 * Calculate step; the method stays behind the hint.
 */
export default function TesReferencePanel({ tables }: { tables: TesRefTable[] }) {
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
          {tables.includes("sensible") && (
            <Block title="Sensible storage">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">Q = m × c × ΔT</span> (water c = {WATER_C}{" "}
                kJ/kg·K). 1,000 L over 40 °C ≈ 46 kWh.
              </p>
              <p className="text-slate-500">Surface standing loss = U × A × ΔT (W). Mass (kg) ≈ litres.</p>
            </Block>
          )}
          {tables.includes("latent") && (
            <Block title="Latent storage">
              <p className="text-slate-600">
                Energy = mass × latent heat. Ice latent heat ={" "}
                <span className="font-mono font-semibold">{ICE_LATENT} kJ/kg</span> — ~10× the density of
                chilled-water storage.
              </p>
              <p className="text-slate-500">A PCM must melt/freeze at the application&apos;s temperature.</p>
            </Block>
          )}
          {tables.includes("arbitrage") && (
            <Block title="Load-shift value">
              <p className="text-slate-600">
                Saving ≈ <span className="font-mono">(discharge price − charge price) × energy shifted</span>{" "}
                − losses. Plus demand-charge savings from cutting the peak.
              </p>
              <p className="text-slate-500">A flat tariff has no spread, so storage saves nothing.</p>
            </Block>
          )}
          {tables.includes("stratification") && (
            <Block title="Stratification">
              <p className="text-slate-600">
                Keep hot at the top, cold at the bottom. A mixed tank sits at the average temperature and
                delivers far less usable energy.
              </p>
              <p className="text-slate-500">Preserved by slim tanks, low-velocity diffusers, correct connection heights.</p>
            </Block>
          )}
          {tables.includes("scale") && (
            <Block title="Seasonal scale">
              <p className="text-slate-600">
                Heat loss ∝ surface area; stored energy ∝ volume. Larger stores lose proportionally less
                (lower surface-to-volume ratio).
              </p>
              <p className="text-slate-500">Seasonal storage only works at district scale.</p>
            </Block>
          )}
          {tables.includes("prices") && (
            <Block title="Energy prices">
              <p className="text-slate-500">
                Peak £{PRICES.peakElec.toFixed(2)} · off-peak £{PRICES.offpeakElec.toFixed(2)} · flat £
                {PRICES.flatElec.toFixed(2)}/kWh. Heat £{PRICES.heat.toFixed(2)}/kWh. Demand charge £
                {PRICES.demandPerKwMonth}/kW/month.
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
