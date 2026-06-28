"use client";

import { useState } from "react";
import { EFFICACY, LUX_TARGETS, CONTROL_SAVINGS, MAGNETIC_BALLAST_LOSS_W, PRICES } from "@/lib/lightingTables";
import { LightingRefTable } from "@/lib/lightingCases";

/**
 * Lighting reference data — efficacy by technology, task lux targets, typical
 * controls savings, magnetic-ballast loss and the electricity price. Always on
 * hand in the Calculate step; the method stays behind the hint.
 */
export default function LightingReferencePanel({ tables }: { tables: LightingRefTable[] }) {
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
          {tables.includes("efficacy") && (
            <Block title="Luminous efficacy (lm/W)">
              <p className="text-slate-600">
                Incandescent {EFFICACY.incandescent} · halogen {EFFICACY.halogen} · CFL {EFFICACY.cfl} ·
                fluorescent {EFFICACY.fluorescent} · T5 {EFFICACY.t5} ·{" "}
                <span className="font-semibold">LED {EFFICACY.led}</span>.
              </p>
              <p className="text-slate-500">Efficacy = lumens out per watt in. LED also wins on life and quality.</p>
            </Block>
          )}
          {tables.includes("lux") && (
            <Block title="Task illuminance targets (lux)">
              <ul className="space-y-0.5 text-slate-600">
                {LUX_TARGETS.map((t) => (
                  <li key={t.space}>
                    {t.space}: <span className="font-mono">{t.lux}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-500">Lighting to the target — not above it — is itself an efficiency measure.</p>
            </Block>
          )}
          {tables.includes("controls") && (
            <Block title="Typical controls savings">
              <p className="text-slate-600">Occupancy: {CONTROL_SAVINGS.occupancy}.</p>
              <p className="text-slate-600">Daylight: {CONTROL_SAVINGS.daylight}.</p>
              <p className="text-slate-500">Scheduling: {CONTROL_SAVINGS.scheduling}.</p>
            </Block>
          )}
          {tables.includes("ballast") && (
            <Block title="Magnetic ballast loss">
              <p className="text-slate-600">
                A magnetic ballast wastes ≈{" "}
                <span className="font-mono font-semibold">{MAGNETIC_BALLAST_LOSS_W} W per tube</span> as heat
                (10–20% of lamp power), and causes flicker. Loss = fitting power − tube rating.
              </p>
            </Block>
          )}
          {tables.includes("prices") && (
            <Block title="Energy price">
              <p className="text-slate-500">
                Electricity £{PRICES.elec.toFixed(2)}/kWh. Energy ={" "}
                <span className="font-mono">kW × hours</span>; annual cost ={" "}
                <span className="font-mono">kWh × £{PRICES.elec.toFixed(2)}</span>.
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
