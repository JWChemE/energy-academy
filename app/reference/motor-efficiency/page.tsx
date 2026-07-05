import type { Metadata } from "next";
import {
  IE_EFFICIENCY,
  EFF_VS_LOAD,
  BELT_EFF,
  AFFINITY,
  PF_TABLE,
} from "@/lib/motorTables";
import { RefShell, RefSection, RefTable, RefLinks } from "@/components/reference/RefShell";

export const metadata: Metadata = {
  title: "Motor Efficiency & Drives Reference",
  description:
    "IE motor efficiency classes, efficiency at part load, belt-drive losses, the affinity laws for pumps and fans, and the power-factor table.",
  alternates: { canonical: "/reference/motor-efficiency" },
};

export default function MotorEfficiencyPage() {
  return (
    <RefShell
      title="Motor efficiency & drives"
      lead="A motor consumes its own purchase price in electricity every few weeks, so efficiency class, loading and transmission losses dominate its lifetime cost. These are the working figures for motor arithmetic."
      reviewed="2026-07-05"
    >
      <RefSection
        heading="IE efficiency classes"
        note="Representative full-load efficiency for a medium motor (~22–37 kW). UK ecodesign rules require at least IE3 for most new three-phase motors (0.75–1,000 kW) and IE4 for 75–200 kW."
      >
        <RefTable
          headers={["Class", "Full-load efficiency"]}
          rows={IE_EFFICIENCY.map((r) => [r.class, `${(r.eff * 100).toFixed(0)}%`])}
        />
      </RefSection>

      <RefSection
        heading="Efficiency at part load"
        note="A standard induction motor holds its efficiency down to about half load, then falls away steeply. A motor drawing under 40% of its rated current is a right-sizing candidate."
      >
        <RefTable
          headers={["Load", "Efficiency"]}
          rows={EFF_VS_LOAD.map((r) => [`${r.loadPct}%`, `${(r.eff * 100).toFixed(0)}%`])}
        />
      </RefSection>

      <RefSection
        heading="Belt-drive transmission efficiency"
        note="Slipping and worn belts lose energy continuously; cogged and synchronous belts recover most of it."
      >
        <RefTable
          headers={["Belt type", "Efficiency"]}
          rows={BELT_EFF.map((r) => [r.type, `${(r.eff * 100).toFixed(0)}%`])}
        />
      </RefSection>

      <RefSection
        heading="The affinity laws (pumps & fans)"
        note="For centrifugal machines, power scales with the cube of speed. This is the whole variable-speed-drive case on variable flows."
      >
        <RefTable
          headers={["Speed", "Power"]}
          rows={AFFINITY.map((r) => [`${r.speedPct}%`, `${r.powerPct}%`])}
        />
      </RefSection>

      <RefSection
        heading="Power factor: tan φ"
        note="Capacitor kVAr to correct from pf₁ to pf₂ = kW × (tan φ₁ − tan φ₂)."
      >
        <RefTable
          headers={["Power factor (cos φ)", "tan φ"]}
          rows={PF_TABLE.map((r) => [r.pf.toFixed(2), r.tan.toFixed(3)])}
        />
      </RefSection>

      <RefLinks
        taught={[
          { href: "/courses/motors-and-drives/efficiency-classes", label: "IE classes" },
          { href: "/courses/motors-and-drives/why-vfds", label: "Why VFDs" },
          { href: "/courses/electrical-science/power-factor", label: "Power factor" },
        ]}
        sources={[
          { href: "https://www.gov.uk/guidance/placing-energy-related-products-on-the-uk-market", label: "UK ecodesign (motors)" },
          { href: "https://www.iec.ch/", label: "IEC 60034-30-1 (IE classes)" },
          { href: "https://www.carbontrust.com/our-work-and-impact/guides-reports-and-tools", label: "Carbon Trust motors guidance" },
        ]}
      />
    </RefShell>
  );
}
