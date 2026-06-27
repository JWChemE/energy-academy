"use client";

import { useState } from "react";
import { SAT_STEAM, TRAP_LOSS, PIPE_LOSS } from "@/lib/steamTables";
import { RefTable } from "@/lib/steamCases";

/**
 * The reference data a real engineer has on hand — steam tables, trap-loss and
 * pipe-loss figures. Always available in the Calculate step (the *method* is
 * what's hidden behind hints, not the data). Collapsible to save space.
 */
export default function ReferencePanel({ tables }: { tables: RefTable[] }) {
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
        <div className="space-y-4 border-t border-slate-100 px-4 py-3">
          {tables.includes("steam") && (
            <Table
              title="Saturated steam (gauge pressure)"
              head={["bar g", "Tsat °C", "hf kJ/kg", "hfg kJ/kg", "hg kJ/kg"]}
              rows={SAT_STEAM.map((r) => [r.pBarG, r.tSat, r.hf, r.hfg, r.hg])}
            />
          )}
          {tables.includes("trapLoss") && (
            <Table
              title="Failed-open trap loss (kg/h)"
              head={["Orifice mm", "bar g", "Steam loss kg/h"]}
              rows={TRAP_LOSS.map((t) => [t.orificeMm, t.pBarG, t.kgPerH])}
            />
          )}
          {tables.includes("pipeLoss") && (
            <Table
              title="Pipe heat loss (W/m, ~170 °C steam)"
              head={["DN", "Bare W/m", "Insulated W/m"]}
              rows={PIPE_LOSS.map((p) => [p.dn, p.bareWperM, p.insulatedWperM])}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Table({ title, head, rows }: { title: string; head: string[]; rows: (number | string)[][] }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold text-slate-600">{title}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-slate-400">
              {head.map((h) => (
                <th key={h} className="px-2 py-1 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono text-slate-700">
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-slate-100">
                {r.map((c, j) => (
                  <td key={j} className="px-2 py-1">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
