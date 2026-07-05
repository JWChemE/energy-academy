import type { Metadata } from "next";
import { RefShell, RefSection, RefTable, RefLinks } from "@/components/reference/RefShell";

export const metadata: Metadata = {
  title: "Typical Plant Efficiencies",
  description:
    "Working efficiency figures for boilers, chillers, heat pumps, compressed air, CHP and lighting: the numbers for first-pass estimates, consistent with our course worked examples.",
  alternates: { canonical: "/reference/typical-plant-efficiency" },
};

export default function TypicalPlantEfficiencyPage() {
  return (
    <RefShell
      title="Typical plant efficiencies"
      lead="The working figures for first-pass estimates, consistent with the worked examples across the courses. Real plant varies with age, load and maintenance; treat these as the starting point an audit then measures against."
      reviewed="2026-07-05"
    >
      <RefSection heading="Heat generation">
        <RefTable
          headers={["Plant", "Typical figure", "Notes"]}
          rows={[
            ["Shell (fire-tube) boiler, good order", "80–85%", "Falls with fouling and excess air"],
            ["Condensing boiler, actually condensing", "90–92%", "Needs return water below ~55 °C"],
            ["Condensing boiler on a hot circuit", "≈ standard boiler", "Never reaches dew point"],
            ["Electric resistance heating", "100% (COP 1)", "Efficient but expensive per kWh of heat"],
            ["Air-source heat pump (space heating)", "SCOP ≈ 2.8–3.5", "Depends heavily on flow temperature"],
            ["Ground-source heat pump", "SCOP ≈ 3.5–4.5", "Steadier source, smaller lift"],
            ["CHP (gas engine), overall", "80–90%", "Only with the heat genuinely used"],
            ["CHP electrical share", "35–42%", "Reciprocating engine"],
          ]}
        />
      </RefSection>

      <RefSection heading="Cooling">
        <RefTable
          headers={["Plant", "Typical figure", "Notes"]}
          rows={[
            ["Air-cooled chiller", "COP 2.5–3.5", "Worse on hot days, exactly when loaded"],
            ["Water-cooled chiller (tower)", "COP 4–6", "Wet-bulb rejection buys the difference"],
            ["Condensing-temperature rule", "≈ 2–3% per °C", "Every degree of lift avoided saves this"],
            ["Heat-recovery ventilation (MVHR)", "70–90% effectiveness", "Sensible heat recovered from exhaust air"],
          ]}
        />
      </RefSection>

      <RefSection heading="Motive power & compressed air">
        <RefTable
          headers={["Plant", "Typical figure", "Notes"]}
          rows={[
            ["Electric motor (IE3, full load)", "≈ 93%", "See the motor reference page"],
            ["Compressed air, wire to tool", "10–15%", "Most input becomes recoverable heat"],
            ["Compressed air specific energy", "0.10–0.13 kWh/m³", "At 7 bar g; trend it monthly"],
            ["Compressor heat recoverable", "70–90% of input", "As warm air or hot water"],
            ["Pressure rule of thumb", "≈ 7% per bar", "Generation energy per bar of setpoint"],
          ]}
        />
      </RefSection>

      <RefSection heading="Lighting">
        <RefTable
          headers={["Source", "Efficacy (lm/W)", "Notes"]}
          rows={[
            ["Incandescent", "10–15", "Phased out"],
            ["Halogen", "15–25", "Phased out for general lighting"],
            ["Compact fluorescent", "50–70", "Legacy"],
            ["Linear fluorescent (T5)", "90–100", "Plus ballast losses"],
            ["LED", "100–180", "The default; quality varies"],
          ]}
        />
      </RefSection>

      <RefLinks
        taught={[
          { href: "/courses/boilers-and-fired-systems", label: "Boilers course" },
          { href: "/courses/refrigeration-and-heat-pumps/cop-and-performance", label: "COP lesson" },
          { href: "/courses/compressed-air/why-expensive", label: "Compressed air" },
          { href: "/courses/lighting/lux-and-efficacy", label: "Lighting" },
        ]}
        sources={[
          { href: "https://www.carbontrust.com/our-work-and-impact/guides-reports-and-tools", label: "Carbon Trust technology guides" },
          { href: "https://www.cibse.org/knowledge-research/knowledge-portal", label: "CIBSE guides" },
        ]}
      />
    </RefShell>
  );
}
