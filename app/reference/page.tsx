import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quick Reference",
  description:
    "The working data of energy management in one place: unit conversions, saturated steam tables, motor efficiency classes, typical plant efficiencies and UK reference prices and carbon factors.",
  alternates: { canonical: "/reference" },
};

const PAGES = [
  {
    href: "/reference/energy-units",
    title: "Energy unit conversions",
    blurb: "kWh, MJ, GJ, therms, toe and the SI prefixes, with the one conversion worth memorising.",
  },
  {
    href: "/reference/saturated-steam",
    title: "Saturated steam table",
    blurb: "Saturation temperature and enthalpies by gauge pressure, pipe heat losses, and flash steam fractions.",
  },
  {
    href: "/reference/motor-efficiency",
    title: "Motor efficiency & drives",
    blurb: "IE classes, efficiency at part load, belt losses, the affinity laws and power factor.",
  },
  {
    href: "/reference/typical-plant-efficiency",
    title: "Typical plant efficiencies",
    blurb: "Boilers, chillers, heat pumps, compressed air and lighting: the working figures for first-pass estimates.",
  },
  {
    href: "/reference/uk-energy-compliance-deadlines",
    title: "UK energy compliance deadlines",
    blurb: "ESOS Phase 4, MEES trajectories, the CCA calendar, heat network regulation, TM44 and every recurring cycle, dated and linked.",
  },
  {
    href: "/reference/prices-and-carbon-factors",
    title: "Reference prices & carbon factors",
    blurb: "The platform's standard energy prices and the UK greenhouse-gas conversion factors, dated.",
  },
] as const;

export default function ReferenceIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Quick reference
      </h1>
      <p className="mt-3 text-slate-600">
        The tables a working energy manager keeps to hand, in one place and
        consistent with the figures used throughout the courses. Each page
        says where the data comes from and when it was last checked.
      </p>

      <div className="mt-8 space-y-3">
        {PAGES.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="block rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-brand-300 hover:bg-brand-50/40"
          >
            <div className="font-semibold text-slate-900">{p.title}</div>
            <p className="mt-1 text-sm text-slate-600">{p.blurb}</p>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-sm text-slate-500">
        Terms rather than tables? See the{" "}
        <Link href="/glossary" className="text-brand-700 underline">
          glossary
        </Link>
        . Calculators live under{" "}
        <Link href="/tools" className="text-brand-700 underline">
          tools
        </Link>
        .
      </p>
    </div>
  );
}
