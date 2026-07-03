"use client";

import StepDiagramShell, { DiagramStep } from "../StepDiagramShell";

/**
 * Step-through diagram of the vapour-compression cycle — the loop behind
 * every fridge, chiller, air-conditioner and heat pump on the platform.
 * Temperatures shown are typical for a water chiller; lessons quote their
 * own figures in the surrounding text.
 */

const STEPS: DiagramStep[] = [
  {
    title: "The whole loop",
    caption:
      "A closed loop of refrigerant passes through four components. Two move heat (evaporator in, condenser out), one moves the refrigerant (compressor — the only place you pay for energy), and one resets it (expansion valve). Step through each in turn.",
  },
  {
    title: "1 · Evaporator — heat in",
    caption:
      "At low pressure the refrigerant boils at a very low temperature (here ~0 °C). Boiling absorbs latent heat — pulled from the space or water being cooled. The refrigerant leaves as a cool, low-pressure vapour.",
  },
  {
    title: "2 · Compressor — work in",
    caption:
      "Electricity drives the compressor, squeezing the vapour to high pressure — and, unavoidably, a high temperature (~70 °C). This is the only energy you pay for in the whole cycle, which is why compressor efficiency and control dominate running cost.",
  },
  {
    title: "3 · Condenser — heat out",
    caption:
      "The hot, high-pressure vapour is now hotter than the outside air (or cooling water), so heat flows out and the refrigerant condenses back to liquid. Everything absorbed in the evaporator plus the compressor's work is rejected here.",
  },
  {
    title: "4 · Expansion valve — the reset",
    caption:
      "The high-pressure liquid throttles through a small orifice. Pressure collapses and the temperature plummets (~0 °C) — no energy input, just physics. The cold mixture re-enters the evaporator and the loop repeats.",
  },
  {
    title: "The payoff — COP",
    caption:
      "The cycle moves far more heat than the electricity it consumes: absorb 100 kW in the evaporator with 30 kW of compressor work and reject 130 kW at the condenser — a COP of 3.3. That multiplier is the whole reason heat pumps beat direct electric heating.",
  },
];

// Which parts light up at each step (0 = overview, 5 = payoff: all lit).
const LIT: Record<number, string[]> = {
  0: ["evap", "comp", "cond", "valve", "p1", "p2", "p3", "p4", "heatin", "heatout", "elec"],
  1: ["evap", "p4", "heatin"],
  2: ["comp", "p1", "elec"],
  3: ["cond", "p2", "heatout"],
  4: ["valve", "p3"],
  5: ["evap", "comp", "cond", "valve", "p1", "p2", "p3", "p4", "heatin", "heatout", "elec", "cop"],
};

export default function VapourCompressionCycle() {
  return (
    <StepDiagramShell
      title="The vapour-compression cycle"
      steps={STEPS}
      renderDiagram={(step) => <CycleSvg step={step} />}
    />
  );
}

function CycleSvg({ step }: { step: number }) {
  const lit = LIT[step] ?? LIT[0];
  const on = (id: string) => lit.includes(id);
  const op = (id: string) => (on(id) ? 1 : 0.22);

  return (
    <svg
      viewBox="0 0 640 410"
      role="img"
      aria-label="Vapour-compression cycle: evaporator, compressor, condenser and expansion valve connected in a loop"
      className="h-auto w-full"
    >
      {/* ---- pipes (drawn first, under the components) ---- */}
      {/* P1: evaporator → compressor (cool low-pressure vapour) */}
      <g opacity={op("p1")} style={{ transition: "opacity .3s" }}>
        <path d="M 440 335 H 552 V 232" fill="none" stroke="#0284c7" strokeWidth="5" strokeLinejoin="round" />
        <path d="M 546 244 L 552 230 L 558 244 Z" fill="#0284c7" />
        <text x="540" y="278" textAnchor="end" fontSize="11" fill="#0369a1" fontWeight="600">cool vapour</text>
        <text x="540" y="291" textAnchor="end" fontSize="10" fill="#64748b">~5 °C · low pressure</text>
      </g>
      {/* P2: compressor → condenser (hot high-pressure vapour) */}
      <g opacity={op("p2")} style={{ transition: "opacity .3s" }}>
        <path d="M 552 168 V 65 H 444" fill="none" stroke="#ef4444" strokeWidth="5" strokeLinejoin="round" />
        <path d="M 456 59 L 442 65 L 456 71 Z" fill="#ef4444" />
        <text x="540" y="112" textAnchor="end" fontSize="11" fill="#b91c1c" fontWeight="600">hot vapour</text>
        <text x="540" y="125" textAnchor="end" fontSize="10" fill="#64748b">~70 °C · high pressure</text>
      </g>
      {/* P3: condenser → expansion valve (warm high-pressure liquid) */}
      <g opacity={op("p3")} style={{ transition: "opacity .3s" }}>
        <path d="M 200 65 H 88 V 178" fill="none" stroke="#f97316" strokeWidth="5" strokeLinejoin="round" />
        <path d="M 82 166 L 88 180 L 94 166 Z" fill="#f97316" />
        <text x="100" y="112" fontSize="11" fill="#c2410c" fontWeight="600">warm liquid</text>
        <text x="100" y="125" fontSize="10" fill="#64748b">~40 °C · high pressure</text>
      </g>
      {/* P4: valve → evaporator (cold low-pressure mixture) */}
      <g opacity={op("p4")} style={{ transition: "opacity .3s" }}>
        <path d="M 88 222 V 335 H 196" fill="none" stroke="#3b82f6" strokeWidth="5" strokeLinejoin="round" />
        <path d="M 184 329 L 198 335 L 184 341 Z" fill="#3b82f6" />
        <text x="100" y="278" fontSize="11" fill="#1d4ed8" fontWeight="600">cold mixture</text>
        <text x="100" y="291" fontSize="10" fill="#64748b">~0 °C · low pressure</text>
      </g>

      {/* ---- heat arrows ---- */}
      {/* heat absorbed into the evaporator */}
      <g opacity={op("heatin")} style={{ transition: "opacity .3s" }}>
        {[260, 320, 380].map((x) => (
          <g key={x}>
            <line x1={x} y1={398} x2={x} y2={372} stroke="#3b82f6" strokeWidth="3" />
            <path d={`M ${x - 5} 376 L ${x} 368 L ${x + 5} 376 Z`} fill="#3b82f6" />
          </g>
        ))}
        <text x="470" y="390" fontSize="10.5" fill="#1d4ed8" fontWeight="600">heat absorbed</text>
        <text x="470" y="402" fontSize="10" fill="#64748b">from the cold space</text>
      </g>
      {/* heat rejected from the condenser */}
      <g opacity={op("heatout")} style={{ transition: "opacity .3s" }}>
        {[260, 320, 380].map((x) => (
          <g key={x}>
            <line x1={x} y1={36} x2={x} y2={12} stroke="#ef4444" strokeWidth="3" />
            <path d={`M ${x - 5} 16 L ${x} 8 L ${x + 5} 16 Z`} fill="#ef4444" />
          </g>
        ))}
        <text x="470" y="16" fontSize="10.5" fill="#b91c1c" fontWeight="600">heat rejected</text>
        <text x="470" y="28" fontSize="10" fill="#64748b">to outside air / water</text>
      </g>

      {/* ---- components ---- */}
      {/* Evaporator */}
      <g opacity={op("evap")} style={{ transition: "opacity .3s" }}>
        <rect x="200" y="312" width="240" height="46" rx="10" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
        <text x="320" y="332" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#1e40af">EVAPORATOR</text>
        <text x="320" y="347" textAnchor="middle" fontSize="10" fill="#64748b">refrigerant boils · cold side</text>
      </g>
      {/* Condenser */}
      <g opacity={op("cond")} style={{ transition: "opacity .3s" }}>
        <rect x="200" y="42" width="240" height="46" rx="10" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
        <text x="320" y="62" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#991b1b">CONDENSER</text>
        <text x="320" y="77" textAnchor="middle" fontSize="10" fill="#64748b">refrigerant condenses · hot side</text>
      </g>
      {/* Compressor */}
      <g opacity={op("comp")} style={{ transition: "opacity .3s" }}>
        <circle cx="552" cy="200" r="30" fill="#f8fafc" stroke="#475569" strokeWidth="2.5" />
        <text x="552" y="197" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#334155">COMP-</text>
        <text x="552" y="208" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#334155">RESSOR</text>
      </g>
      {/* electrical work into the compressor */}
      <g opacity={op("elec")} style={{ transition: "opacity .3s" }}>
        <line x1="626" y1="200" x2="588" y2="200" stroke="#f59e0b" strokeWidth="3" />
        <path d="M 592 194 L 584 200 L 592 206 Z" fill="#f59e0b" />
        <text x="630" y="188" textAnchor="end" fontSize="14" fill="#d97706">⚡</text>
        <text x="607" y="222" textAnchor="middle" fontSize="10" fill="#b45309" fontWeight="600">work in</text>
      </g>
      {/* Expansion valve (bow-tie symbol) */}
      <g opacity={op("valve")} style={{ transition: "opacity .3s" }}>
        <polygon points="70,184 88,200 70,216" fill="#f8fafc" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
        <polygon points="106,184 88,200 106,216" fill="#f8fafc" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
        <text x="88" y="238" textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155">EXPANSION</text>
        <text x="88" y="250" textAnchor="middle" fontSize="10" fontWeight="700" fill="#334155">VALVE</text>
      </g>

      {/* ---- step-6 payoff annotation ---- */}
      {on("cop") && (
        <g>
          <rect x="216" y="158" width="208" height="84" rx="12" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
          <text x="320" y="182" textAnchor="middle" fontSize="12" fontWeight="700" fill="#065f46">100 kW absorbed</text>
          <text x="320" y="200" textAnchor="middle" fontSize="12" fontWeight="700" fill="#b45309">+ 30 kW compressor work</text>
          <text x="320" y="218" textAnchor="middle" fontSize="12" fontWeight="700" fill="#991b1b">= 130 kW rejected</text>
          <text x="320" y="235" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#047857">COP = 100 ÷ 30 ≈ 3.3</text>
        </g>
      )}
    </svg>
  );
}
