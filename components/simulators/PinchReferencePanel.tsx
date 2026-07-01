"use client";

import { useState } from "react";
import { PRICES, CROSS_PINCH_MULTIPLIER, TYPICAL_DTMIN } from "@/lib/pinchTables";
import { PinchRefTable } from "@/lib/pinchCases";

/**
 * Pinch analysis reference data — the problem table method, the golden rules,
 * the CP feasibility rule, minimum units and prices. Always on hand in the
 * Calculate step; the method stays behind the hint.
 */
export default function PinchReferencePanel({ tables }: { tables: PinchRefTable[] }) {
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
          {tables.includes("targeting") && (
            <Block title="Targeting (problem table)">
              <p className="text-slate-600">
                Heat load = CP × |supply − target|. Shift hot streams down ΔTmin/2, cold streams up
                ΔTmin/2; cascade the net heat surplus/deficit down the shifted scale.
              </p>
              <p className="text-slate-500">
                Most-negative cascade point = minimum hot utility (topped up there); final cascade
                value = minimum cold utility. Where cascade = 0 is the pinch.
              </p>
            </Block>
          )}
          {tables.includes("goldenrules") && (
            <Block title="The golden rules">
              <p className="text-slate-600">
                Never use cold utility above the pinch; never use hot utility below it; never transfer
                heat directly across it.
              </p>
              <p className="text-slate-500">
                Every kW crossing the pinch costs {CROSS_PINCH_MULTIPLIER}× in total utility — 1 extra kW
                hot utility + 1 extra kW cold utility.
              </p>
            </Block>
          )}
          {tables.includes("feasibility") && (
            <Block title="CP feasibility rule">
              <p className="text-slate-600">
                Above the pinch: CP(hot) ≤ CP(cold) for any match touching the pinch. Below the pinch:
                CP(hot) ≥ CP(cold).
              </p>
              <p className="text-slate-500">
                If no unsplit match satisfies the rule, split a stream — flow (and CP) split in direct
                proportion.
              </p>
            </Block>
          )}
          {tables.includes("units") && (
            <Block title="Minimum number of units">
              <p className="text-slate-600">
                <span className="font-mono font-semibold">N = S + L − 1</span> (S = streams + utilities
                in the region, L = independent loops, usually 0).
              </p>
              <p className="text-slate-500">More units than this target usually means a loop — break it and rebalance.</p>
            </Block>
          )}
          {tables.includes("economics") && (
            <Block title="ΔTmin economics">
              <p className="text-slate-600">
                Typical ΔTmin: {TYPICAL_DTMIN}. Tighter ΔTmin → less utility, more exchanger area/capital;
                looser → more utility, less capital.
              </p>
              <p className="text-slate-500">Total annual cost = utility cost + annualised capital; the optimum is site-specific.</p>
            </Block>
          )}
          {tables.includes("prices") && (
            <Block title="Utility prices">
              <p className="text-slate-500">
                Hot utility (e.g. gas) £{PRICES.hotUtility.toFixed(2)}/kWh; cold utility (e.g. cooling
                water) £{PRICES.coldUtility.toFixed(2)}/kWh.
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
