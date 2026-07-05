import type { Metadata } from "next";
import Link from "next/link";
import { PaybackCalculator } from "@/components/mdx/PaybackCalculator";

export const metadata: Metadata = {
  title: "Payback Calculator",
  description:
    "Free simple-payback calculator for energy projects: capital cost divided by annual saving, and why the answer is so sensitive to the saving estimate.",
  alternates: { canonical: "/tools/payback-calculator" },
};

export default function PaybackCalculatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Payback calculator
      </h1>
      <p className="mt-3 text-slate-600">
        Simple payback is the most-used metric in energy management: the
        capital cost of a project divided by its annual saving, giving the
        years until the money comes back. Drag the sliders and notice how
        sensitive the answer is to the annual saving, which is exactly why
        good measurement matters before capital is committed.
      </p>

      <div className="mt-8">
        <PaybackCalculator defaultCost={8000} defaultSaving={2500} />
      </div>

      <div className="prose prose-slate mt-10 max-w-none">
        <h2>Using the result well</h2>
        <p>
          A payback under three years is almost always worth doing; over seven
          deserves harder scrutiny; and for large or long-lived investments,
          payback alone misleads because it ignores everything that happens
          after the cost is recovered. A project paying back in four years but
          lasting twenty looks identical to one lasting five. For decisions
          that matter, move to net present value, which our{" "}
          <Link href="/courses/economic-analysis/npv-and-irr">
            NPV and IRR lesson
          </Link>{" "}
          covers with worked examples.
        </p>
        <p>
          This calculator comes from the free{" "}
          <Link href="/courses/intro-to-energy-management/simple-payback">
            Simple Payback lesson
          </Link>{" "}
          in our Level 1 foundations course, which explains where the metric
          works and where it quietly kills good projects.
        </p>
      </div>
    </div>
  );
}
