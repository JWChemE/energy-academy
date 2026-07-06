/**
 * Static flow diagram of the black-box motor balance from the first-balance
 * lesson: 100 kW of electricity in, 92 kW of shaft power out, 8 kW of heat,
 * with band widths proportional to kW so the balance is visible at a glance.
 */

const S = 0.6; // px per kW
const IN_KW = 100, OUT_KW = 92, LOSS_KW = 8;

const COL_USEFUL = "#059669"; // brand-600 — useful output
const COL_LOSS = "#d97706"; // amber-600 — losses
// Same validated pair as the platform's other flow diagrams; every band is
// directly labelled with its value.

export default function MotorEnergyBalance() {
  const yMid = 118;
  const hIn = IN_KW * S, hOut = OUT_KW * S, hLoss = LOSS_KW * S;

  return (
    <div className="not-prose my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-2.5">
        <span className="text-sm font-bold text-slate-800">
          The black-box motor: a balance you can see
        </span>
      </div>

      <div className="px-4 pt-3">
        <svg
          viewBox="0 0 560 210"
          className="h-auto w-full select-none"
          role="img"
          aria-label="A motor drawn as a black box: 100 kilowatts of electricity in, 92 kilowatts of shaft power out, 8 kilowatts leaving as heat"
        >
          {/* electricity in */}
          <rect x={30} y={yMid - hIn / 2} width={160} height={hIn} fill="#64748b" opacity="0.7" />
          <polygon
            points={`190,${yMid - hIn / 2 - 8} 214,${yMid} 190,${yMid + hIn / 2 + 8}`}
            fill="#64748b" opacity="0.7"
          />
          <text x={38} y={yMid - hIn / 2 - 10} fontSize="11.5" fontWeight="700" fill="#334155">
            Electricity in 100 kW
          </text>

          {/* the box */}
          <rect x={214} y={yMid - hIn / 2 - 4} width={120} height={hIn + 8} rx={10} fill="#1e293b" />
          <text x={274} y={yMid - 4} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#ffffff">
            Motor
          </text>
          <text x={274} y={yMid + 12} textAnchor="middle" fontSize="9.5" fill="#94a3b8">
            (black box)
          </text>

          {/* heat loss, up */}
          <rect x={288 - hLoss / 2} y={38} width={hLoss} height={yMid - hIn / 2 - 42} fill={COL_LOSS} opacity="0.8" />
          <polygon points={`${288 - hLoss / 2 - 5},38 288,22 ${288 + hLoss / 2 + 5},38`} fill={COL_LOSS} opacity="0.8" />
          <text x={302} y={32} fontSize="11" fontWeight="700" fill="#b45309">
            Heat 8 kW
          </text>

          {/* shaft power out */}
          <rect x={334} y={yMid - hOut / 2} width={170} height={hOut} fill={COL_USEFUL} opacity="0.8" />
          <polygon
            points={`504,${yMid - hOut / 2 - 8} 528,${yMid} 504,${yMid + hOut / 2 + 8}`}
            fill={COL_USEFUL} opacity="0.8"
          />
          <text x={340} y={yMid + hOut / 2 + 18} fontSize="11.5" fontWeight="700" fill="#047857">
            Useful shaft power 92 kW
          </text>
        </svg>
      </div>

      <div className="px-5 pb-4">
        <p className="text-xs leading-5 text-slate-400">
          Band widths are proportional to kW. The balance closes exactly: 100 kW in = 92 kW useful
          out + 8 kW of heat, so the motor is 92% efficient, and all 8 missing kilowatts really do
          end up warming the room.
        </p>
      </div>
    </div>
  );
}
