"use client";

import { BoilerState, BoilerOutput } from "@/lib/steamBoilerPhysics";

/**
 * Live boiler schematic. Everything you see is driven by the physics:
 * - flame colour & shape react to excess air (sooty-yellow when starved,
 *   crisp blue when trimmed, small & pale when over-aired)
 * - the stack glows with its temperature
 * - the steam plume scales with firing rate
 */
export default function BoilerVisualization({
  state,
  output,
}: {
  state: BoilerState;
  output: BoilerOutput;
}) {
  const { excessO2, loadLevel, economiser } = state;
  const { stackTemp, efficiency } = output;

  // ---- Flame character from excess air ----
  // Starved (<2.5%): tall, ragged, sooty orange. Trimmed (3–4.5%): compact blue.
  // Over-aired (>6): short, pale, lifted.
  const starved = excessO2 < 2.5;
  const overAired = excessO2 > 6;
  const flameCore = starved ? "#f59e0b" : overAired ? "#93c5fd" : "#60a5fa";
  const flameTip = starved ? "#b45309" : overAired ? "#bfdbfe" : "#2563eb";
  const flameHeight = starved ? 95 : overAired ? 48 : 70;
  const flameOpacity = Math.min(1, 0.45 + loadLevel / 130);
  const sooty = starved;

  // ---- Stack glow from temperature ----
  const stackGlow =
    stackTemp > 240
      ? "#dc2626"
      : stackTemp > 210
      ? "#f97316"
      : stackTemp > 180
      ? "#f59e0b"
      : stackTemp > 140
      ? "#fbbf24"
      : "#94a3b8";
  const stackHeat = Math.min(1, Math.max(0, (stackTemp - 120) / 140));

  // ---- Steam plume from load ----
  const steamScale = 0.4 + loadLevel / 100;

  const effColor =
    efficiency >= 84 ? "#16a34a" : efficiency >= 78 ? "#ca8a04" : "#dc2626";

  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
      <svg viewBox="0 0 480 340" className="w-full" role="img" aria-label="Boiler schematic">
        <defs>
          <radialGradient id="flameGrad" cx="50%" cy="80%" r="70%">
            <stop offset="0%" stopColor="#fff7ed" />
            <stop offset="40%" stopColor={flameCore} />
            <stop offset="100%" stopColor={flameTip} />
          </radialGradient>
          <linearGradient id="shellGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
          <filter id="soot" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={sooty ? 2.2 : 0} />
          </filter>
        </defs>

        {/* ---- Steam plume ---- */}
        <g opacity={0.75} transform={`translate(372 70)`}>
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={i * 10 * steamScale}
              cy={-i * 16 * steamScale}
              r={(10 + i * 4) * steamScale}
              fill="#e0f2fe"
              className="boiler-steam"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </g>

        {/* ---- Steam outlet pipe ---- */}
        <rect x="350" y="92" width="14" height="60" fill="#94a3b8" />
        <rect x="350" y="86" width="40" height="14" rx="3" fill="#94a3b8" />

        {/* ---- Boiler shell (fire-tube) ---- */}
        <rect x="120" y="120" width="230" height="120" rx="22" fill="url(#shellGrad)" stroke="#64748b" strokeWidth="3" />
        {/* water body */}
        <rect x="132" y="160" width="206" height="68" rx="8" fill="url(#waterGrad)" opacity="0.85" />
        <text x="235" y="200" fontSize="11" textAnchor="middle" fill="#0c4a6e" fontWeight="600">
          boiler water
        </text>
        {/* fire tubes hint */}
        {[150, 170, 190].map((cy) => (
          <line key={cy} x1="150" y1={cy} x2="320" y2={cy} stroke="#cbd5e1" strokeWidth="2" opacity="0.5" />
        ))}
        {/* steam space */}
        <text x="235" y="142" fontSize="10" textAnchor="middle" fill="#475569">
          steam space
        </text>

        {/* ---- Burner / flame ---- */}
        <g transform="translate(96 210)">
          <rect x="-30" y="-8" width="34" height="16" rx="3" fill="#475569" />
          <text x="-13" y="26" fontSize="9" textAnchor="middle" fill="#64748b">
            burner
          </text>
          <path
            d={`M 8 6 Q ${8 + 14} ${6 - flameHeight / 2} 8 ${6 - flameHeight} Q ${8 - 14} ${6 - flameHeight / 2} 8 6 Z`}
            fill="url(#flameGrad)"
            opacity={flameOpacity}
            filter="url(#soot)"
            className="boiler-flame"
          />
          {/* soot puffs when starved */}
          {sooty &&
            [0, 1].map((i) => (
              <circle key={i} cx={8 + i * 6} cy={6 - flameHeight - 8 - i * 8} r={4 + i * 2} fill="#1f2937" opacity={0.35} className="boiler-steam" />
            ))}
        </g>

        {/* ---- Fuel / air inlet ---- */}
        <text x="40" y="216" fontSize="9" fill="#64748b">gas + air →</text>

        {/* ---- Economiser (appears when fitted) ---- */}
        {economiser && (
          <g transform="translate(150 92)">
            <rect x="0" y="-12" width="60" height="22" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
            <text x="30" y="3" fontSize="8.5" textAnchor="middle" fill="#15803d" fontWeight="600">
              economiser
            </text>
          </g>
        )}

        {/* ---- Stack / flue ---- */}
        <g>
          <rect x="150" y="40" width="34" height="80" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
          {/* heat glow overlay */}
          <rect x="150" y="40" width="34" height="80" fill={stackGlow} opacity={stackHeat * 0.55} />
          <rect x="146" y="34" width="42" height="10" rx="2" fill="#94a3b8" />
          {/* rising flue gas */}
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={167} cy={56 + i * 10} r={6} fill={stackGlow} opacity={0.4} className="boiler-steam" style={{ animationDelay: `${i * 0.5}s` }} />
          ))}
          {/* stack temp badge */}
          <rect x="192" y="44" width="74" height="30" rx="4" fill="white" stroke={stackGlow} strokeWidth="2" />
          <text x="229" y="58" fontSize="13" textAnchor="middle" fontWeight="700" fill={stackGlow}>
            {stackTemp}°C
          </text>
          <text x="229" y="69" fontSize="8" textAnchor="middle" fill="#64748b">
            stack temp
          </text>
        </g>

        {/* ---- Blowdown ---- */}
        <g>
          <rect x="230" y="240" width="10" height="34" fill="#fbbf24" />
          <text x="248" y="266" fontSize="9" fill="#92400e">blowdown ↓</text>
        </g>

        {/* ---- Efficiency dial ---- */}
        <g transform="translate(415 250)">
          <circle r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            r="40"
            fill="none"
            stroke={effColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(Math.min(efficiency, 100) / 100) * 251} 251`}
            transform="rotate(-90)"
            style={{ transition: "stroke-dasharray 0.4s ease, stroke 0.4s ease" }}
          />
          <text y="-2" fontSize="20" textAnchor="middle" fontWeight="800" fill={effColor}>
            {efficiency.toFixed(0)}%
          </text>
          <text y="14" fontSize="8.5" textAnchor="middle" fill="#64748b">
            efficiency
          </text>
        </g>
      </svg>

      <style jsx>{`
        :global(.boiler-flame) {
          animation: flicker 0.45s ease-in-out infinite alternate;
          transform-origin: bottom center;
          transition: fill 0.3s ease;
        }
        :global(.boiler-steam) {
          animation: rise 2.4s ease-in-out infinite;
        }
        @keyframes flicker {
          from {
            transform: scaleY(0.96) scaleX(1.02);
            opacity: 0.85;
          }
          to {
            transform: scaleY(1.04) scaleX(0.98);
            opacity: 1;
          }
        }
        @keyframes rise {
          0% {
            transform: translateY(4px);
            opacity: 0.15;
          }
          50% {
            opacity: 0.55;
          }
          100% {
            transform: translateY(-6px);
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
}
