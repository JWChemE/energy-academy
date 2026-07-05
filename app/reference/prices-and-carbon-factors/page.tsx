import type { Metadata } from "next";
import { RefShell, RefSection, RefTable, RefLinks } from "@/components/reference/RefShell";

export const metadata: Metadata = {
  title: "Reference Prices & Carbon Factors",
  description:
    "The standard energy prices used in Energy Academy worked examples (electricity £0.20/kWh, gas £0.06/kWh) and the UK greenhouse-gas conversion factors, with their as-at dates.",
  alternates: { canonical: "/reference/prices-and-carbon-factors" },
};

export default function PricesAndFactorsPage() {
  return (
    <RefShell
      title="Reference prices & carbon factors"
      lead="Every worked example on this platform uses the same reference prices so results agree across courses. Real tariffs vary by site and contract; substitute your own marginal prices for a live business case. Carbon factors change every year, so always check the current GOV.UK set before reporting."
      reviewed="2026-07-05"
    >
      <RefSection
        heading="Platform reference prices"
        note="Chosen as round, realistic UK commercial figures. Lessons state explicitly when they vary them."
      >
        <RefTable
          headers={["Energy", "Reference price", "Used for"]}
          rows={[
            ["Electricity", "£0.20/kWh", "All electrical savings examples"],
            ["Natural gas", "£0.06/kWh", "All heating and steam examples"],
            ["Delivered heat (85% boiler)", "≈ £0.071/kWh", "Gas ÷ boiler efficiency"],
            ["Steam at 7 bar g", "≈ £48/tonne fuel cost", "See the saturated steam page"],
            ["Compressed air", "≈ £22 per 1,000 m³", "At 0.11 kWh/m³ specific energy"],
          ]}
        />
      </RefSection>

      <RefSection
        heading="UK greenhouse-gas conversion factors"
        note="Indicative values from the UK government company-reporting factors (2024 set, checked July 2026). The electricity factor falls each year as the grid decarbonises; use the current published set for any formal reporting."
      >
        <RefTable
          headers={["Energy", "kg CO₂e per kWh", "Notes"]}
          rows={[
            ["Grid electricity (location-based)", "≈ 0.207", "Falls year on year"],
            ["Natural gas (gross CV)", "≈ 0.183", "Stable"],
            ["Gas heat via 85% boiler", "≈ 0.215 per kWh heat", "Factor ÷ efficiency"],
            ["Heat pump heat at SCOP 3.5", "≈ 0.059 per kWh heat", "Electricity factor ÷ SCOP"],
          ]}
        />
      </RefSection>

      <RefSection
        heading="Two derived figures worth knowing"
        note="Both follow directly from the tables above and recur throughout the courses."
      >
        <RefTable
          headers={["Figure", "Value", "Why it matters"]}
          rows={[
            [
              "Electricity-to-gas price ratio",
              "≈ 3.3 : 1",
              "A heat pump needs SCOP above ~2.8 to beat a gas boiler on running cost",
            ],
            [
              "Heat pump carbon saving vs boiler",
              "≈ 70%+ today",
              "0.059 vs 0.215 kg/kWh of heat, widening as the grid cleans",
            ],
          ]}
        />
      </RefSection>

      <RefLinks
        taught={[
          { href: "/courses/intro-to-energy-management/energy-units", label: "Units & carbon" },
          { href: "/courses/refrigeration-and-heat-pumps/heating-modes", label: "Heat pump vs boiler" },
          { href: "/courses/uk-energy-regulation/secr", label: "SECR reporting" },
        ]}
        sources={[
          {
            href: "https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting",
            label: "UK government conversion factors (current set)",
          },
          { href: "https://www.ofgem.gov.uk/", label: "Ofgem price context" },
        ]}
      />
    </RefShell>
  );
}
