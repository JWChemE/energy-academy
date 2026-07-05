import type { Metadata } from "next";
import Link from "next/link";
import AffinityLawsExplorer from "@/components/mdx/AffinityLawsExplorer";

export const metadata: Metadata = {
  title: "Affinity Laws Explorer",
  description:
    "Interactive cube-law tool: see why slowing a pump or fan with a variable-speed drive uses a fraction of the power that throttling with a damper or valve does.",
  alternates: { canonical: "/tools/affinity-laws" },
};

export default function AffinityLawsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Affinity laws explorer
      </h1>
      <p className="mt-3 text-slate-600">
        For centrifugal pumps and fans, power scales with the <em>cube</em> of
        speed: run at 80% speed and the power falls to about half; at 60%, to
        about a fifth. Throttling with a damper or valve keeps the motor
        working hard and destroys the surplus instead. Drag the flow below and
        compare the two.
      </p>

      <div className="mt-8">
        <AffinityLawsExplorer />
      </div>

      <div className="prose prose-slate mt-10 max-w-none">
        <h2>Where the saving is real</h2>
        <p>
          The cube law pays wherever the flow genuinely varies: heating and
          cooling pumps that follow the weather, air-handling fans behind
          dampers, cooling tower fans. It does not pay on loads that always
          need full output, and a drive on a constant full-speed load only
          adds its own losses. Our{" "}
          <Link href="/courses/motors-and-drives/why-vfds">
            Why VFDs lesson
          </Link>{" "}
          works the economics, and the{" "}
          <Link href="/courses/motors-and-drives/vfd-applications">
            applications lesson
          </Link>{" "}
          sorts real equipment into the loads that reward a drive and the ones
          that do not.
        </p>
      </div>
    </div>
  );
}
