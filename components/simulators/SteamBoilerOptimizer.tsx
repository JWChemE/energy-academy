"use client";

import { useState } from "react";
import DiagnosticMode from "./DiagnosticMode";
import TuningMode from "./TuningMode";

type Mode = "diagnose" | "learn";

/**
 * Entry point registered for MDX. Two modes:
 *   • Diagnose — the capstone: differential fault-finding cases (default).
 *   • Learn    — the guided tuning sandbox, for understanding the relationships.
 */
export default function SteamBoilerOptimizer() {
  const [mode, setMode] = useState<Mode>("diagnose");

  return (
    <div className="not-prose my-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      {/* Mode switch */}
      <div className="mb-5 flex items-center gap-2">
        <div className="inline-flex rounded-lg bg-slate-200 p-1">
          <button
            onClick={() => setMode("diagnose")}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${
              mode === "diagnose" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            🩺 Diagnose
          </button>
          <button
            onClick={() => setMode("learn")}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${
              mode === "learn" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            🎛️ Learn (tuning)
          </button>
        </div>
        <p className="hidden text-xs text-slate-500 sm:block">
          {mode === "diagnose"
            ? "Fault-finding cases — read the plant, diagnose, fix, verify."
            : "Free tuning sandbox — see how each lever moves the losses."}
        </p>
      </div>

      {mode === "diagnose" ? <DiagnosticMode /> : <TuningMode />}
    </div>
  );
}
