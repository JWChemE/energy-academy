"use client";

import AuditCapstone from "./AuditCapstone";
import { STAGES, DATASET, REFERENCE } from "@/lib/dcAuditCapstone";

/** Kelbrook Data — the on-site data stage's table + reference panel. */
function DataPanel() {
  return (
    <div className="mt-4 space-y-3">
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-2 py-2 text-left font-semibold">Month</th>
              <th className="px-2 py-2 font-semibold">Avg °C</th>
              <th className="px-2 py-2 font-semibold">CDD</th>
              <th className="px-2 py-2 font-semibold">IT kWh</th>
              <th className="px-2 py-2 font-semibold">Facility kWh</th>
              <th className="px-2 py-2 font-semibold">PUE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DATASET.map((r) => (
              <tr key={r.month} className="text-slate-700">
                <td className="px-2 py-1.5 text-left font-medium">{r.month}</td>
                <td className="px-2 py-1.5">{r.avgTempC.toFixed(1)}</td>
                <td className="px-2 py-1.5">{r.month === "Jul" ? "?" : r.cdd}</td>
                <td className="px-2 py-1.5">{r.itKwh.toLocaleString()}</td>
                <td className="px-2 py-1.5">{r.facilityKwh.toLocaleString()}</td>
                <td className="px-2 py-1.5">{(r.facilityKwh / r.itKwh).toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <span><strong>Reference</strong> —</span>
        <span>CDD base {REFERENCE.cddBase} °C</span>
        <span>Elec £{REFERENCE.elecPrice}/kWh</span>
        <span>Grid {REFERENCE.co2Factor} kg CO₂e/kWh</span>
        <span>Contracted IT capacity {REFERENCE.itDesignKw.toLocaleString()} kW</span>
      </div>
    </div>
  );
}

export default function DcAuditCapstone() {
  return <AuditCapstone stages={STAGES} renderDataPanel={() => <DataPanel />} />;
}
