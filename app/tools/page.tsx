import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Interactive Tools",
  description:
    "Free energy calculators plus the interactive diagnostic simulators from our courses: payback, affinity laws, refrigeration cycle, steam, HVAC, motors and more.",
  alternates: { canonical: "/tools" },
};

const FREE_TOOLS = [
  {
    href: "/tools/payback-calculator",
    title: "Payback calculator",
    blurb:
      "Simple payback from capital cost and annual saving, with the sensitivity that estimate deserves.",
  },
  {
    href: "/tools/affinity-laws",
    title: "Affinity laws explorer",
    blurb:
      "Drag the flow and watch the cube law: why a VFD at 80% speed uses half the power a damper would.",
  },
  {
    href: "/tools/vapour-compression-cycle",
    title: "Vapour-compression cycle",
    blurb:
      "Step through the refrigeration and heat pump cycle: where the heat goes and why COP beats 1.",
  },
] as const;

/**
 * The interactive diagnostic simulators, each embedded in its course's
 * capstone lesson (a free account is required to open them).
 */
const DIAGNOSTICS = [
  { href: "/courses/energy-audits/field-audit-capstone", title: "Field energy audit", blurb: "Run a full simulated site audit: bills, walkround findings and the ranked opportunity table." },
  { href: "/courses/boilers-and-fired-systems/optimization-capstone", title: "Steam boiler optimiser", blurb: "Tune a live boiler: excess air, blowdown and flue temperature against fuel cost." },
  { href: "/courses/steam-and-condensate/diagnostics-capstone", title: "Steam system diagnostics", blurb: "Eight steam call-outs: failed traps, flash losses, condensate return and insulation." },
  { href: "/courses/compressed-air/diagnostics-capstone", title: "Compressed air diagnostics", blurb: "Leaks, pressure, control mode and heat recovery on a misbehaving air system." },
  { href: "/courses/hvac-systems/diagnostics-capstone", title: "HVAC diagnostics", blurb: "AHUs, setpoints, free cooling and simultaneous heating and cooling." },
  { href: "/courses/refrigeration-and-heat-pumps/diagnostics-capstone", title: "Refrigeration diagnostics", blurb: "Superheat, subcooling, fouled condensers and COP recovery." },
  { href: "/courses/motors-and-drives/diagnostics-capstone", title: "Motors & drives diagnostics", blurb: "Oversized motors, belt losses, VFD opportunities and power factor." },
  { href: "/courses/lighting/diagnostics-capstone", title: "Lighting diagnostics", blurb: "Over-lighting, LED retrofits, controls and commissioning failures." },
  { href: "/courses/buildings-and-envelope/diagnostics-capstone", title: "Building fabric diagnostics", blurb: "U-values, bridging, airtightness and retrofit sequencing." },
  { href: "/courses/insulation-systems/diagnostics-capstone", title: "Insulation diagnostics", blurb: "Bare pipes, economic thickness, cold-line vapour barriers and safe-touch." },
  { href: "/courses/control-systems-and-bms/diagnostics-capstone", title: "Controls & BMS diagnostics", blurb: "Sensor drift, dead bands, schedules and setpoint reset." },
  { href: "/courses/commissioning/diagnostics-capstone", title: "Commissioning diagnostics", blurb: "Find what commissioning would have caught: drift, overrides and failed sequences." },
  { href: "/courses/maintenance/diagnostics-capstone", title: "Maintenance diagnostics", blurb: "Fouling, worn plant and the energy cost of deferred maintenance." },
  { href: "/courses/waste-heat-recovery/diagnostics-capstone", title: "Waste heat recovery diagnostics", blurb: "Match sources to sinks and size the recovery that actually pays." },
  { href: "/courses/chp-and-cogeneration/diagnostics-capstone", title: "CHP diagnostics", blurb: "Sizing to heat, spark spread and integration failures." },
  { href: "/courses/thermal-energy-storage/diagnostics-capstone", title: "Thermal storage diagnostics", blurb: "Sensible vs latent sizing, stratification and the flat-tariff trap." },
  { href: "/courses/renewable-energy/diagnostics-capstone", title: "Renewables diagnostics", blurb: "PV sizing, self-consumption, batteries and grid limits." },
  { href: "/courses/economic-analysis/diagnostics-capstone", title: "Economics diagnostics", blurb: "Payback traps, NPV calls and portfolio sequencing." },
  { href: "/courses/measurement-and-verification/diagnostics-capstone", title: "M&V diagnostics", blurb: "Baselines, adjustments and proving savings that survive scrutiny." },
  { href: "/courses/pinch-analysis/diagnostics-capstone", title: "Pinch analysis diagnostics", blurb: "Composite curves, minimum utilities and cross-pinch violations." },
  { href: "/courses/energy-audits/diagnostics-capstone", title: "Energy audit diagnostics", blurb: "Eight audit call-outs from scoping to reporting." },
  { href: "/courses/breweries/brewery-audit-capstone", title: "Brewery audit capstone", blurb: "A full audit of a working brewery: brewhouse, cellar, packaging and utilities." },
] as const;

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Interactive tools
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        The calculators and simulators from our courses, gathered in one place.
        The free tools below work without an account; the course diagnostics
        open inside their capstone lessons with a free account.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-slate-900">Free tools</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {FREE_TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50/40"
          >
            <div className="font-semibold text-slate-900">{tool.title}</div>
            <p className="mt-1.5 text-sm text-slate-600">{tool.blurb}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-semibold text-slate-900">
        Course diagnostic simulators
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-slate-500">
        Each course ends with a hands-on capstone: a misbehaving system, its
        data, and the job of finding the money. Free account required.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {DIAGNOSTICS.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-slate-900">{d.title}</span>
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                Free account
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{d.blurb}</p>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-sm text-slate-500">
        Looking for data rather than tools? See the{" "}
        <Link href="/reference" className="text-brand-700 underline">
          quick reference tables
        </Link>{" "}
        and the{" "}
        <Link href="/glossary" className="text-brand-700 underline">
          glossary
        </Link>
        .
      </p>
    </div>
  );
}
