import type { Metadata } from "next";
import Link from "next/link";
import VapourCompressionCycle from "@/components/mdx/diagrams/VapourCompressionCycle";

export const metadata: Metadata = {
  title: "Vapour-Compression Cycle Explainer",
  description:
    "Step-through diagram of the refrigeration and heat pump cycle: evaporator, compressor, condenser and expansion valve, and why a COP above 1 is not magic.",
  alternates: { canonical: "/tools/vapour-compression-cycle" },
};

export default function VapourCompressionCyclePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        The vapour-compression cycle
      </h1>
      <p className="mt-3 text-slate-600">
        Nearly every fridge, chiller, air conditioner and heat pump runs the
        same four-stage loop. Step through it below: heat is absorbed in the
        evaporator, the compressor lifts the refrigerant's pressure and
        temperature, the condenser rejects the heat, and the expansion valve
        resets the loop. The machine moves about three units of heat per unit
        of electricity, which is why heat pumps beat every fuel-burning
        appliance.
      </p>

      <div className="mt-8">
        <VapourCompressionCycle />
      </div>

      <div className="prose prose-slate mt-10 max-w-none">
        <h2>Go deeper</h2>
        <p>
          The full{" "}
          <Link href="/courses/refrigeration-and-heat-pumps/vapour-compression-cycle">
            vapour-compression cycle lesson
          </Link>{" "}
          adds the energy balance and a worked chiller example, and the rest of
          the{" "}
          <Link href="/courses/refrigeration-and-heat-pumps">
            Refrigeration &amp; Heat Pumps course
          </Link>{" "}
          builds from this loop to COP, diagnostics and the savings that
          follow. For the heating side, start with{" "}
          <Link href="/courses/refrigeration-and-heat-pumps/reverse-cycle">
            the heat pump lesson
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
