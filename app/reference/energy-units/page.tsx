import type { Metadata } from "next";
import { RefShell, RefSection, RefTable, RefLinks } from "@/components/reference/RefShell";

export const metadata: Metadata = {
  title: "Energy Unit Conversions",
  description:
    "Convert between kWh, MJ, GJ, therms and tonnes of oil equivalent, with SI prefixes. 1 kWh = 3.6 MJ; 1 therm = 29.31 kWh.",
  alternates: { canonical: "/reference/energy-units" },
};

export default function EnergyUnitsPage() {
  return (
    <RefShell
      title="Energy unit conversions"
      lead="Energy management runs on the kilowatt-hour: electricity is billed in it and UK gas bills convert to it, so once everything is in kWh, energy, cost and carbon all line up. These are the conversions for everything else you will meet."
      reviewed="2026-07-05"
    >
      <RefSection
        heading="Conversions to kWh"
        note="The one worth memorising: 1 kWh = 3.6 MJ, because 1 kW for 3,600 seconds delivers 3,600,000 joules."
      >
        <RefTable
          headers={["Unit", "In kWh", "Notes"]}
          rows={[
            ["1 kWh", "1", "The everyday unit; billed on every meter"],
            ["1 MJ (megajoule)", "0.278", "1 kWh = 3.6 MJ"],
            ["1 GJ (gigajoule)", "277.8", "Common in district heating and industry"],
            ["1 therm", "29.31", "Older gas unit (100,000 Btu)"],
            ["1 Btu", "0.000293", "1 Btu ≈ 1.055 kJ"],
            ["1 toe (tonne of oil equivalent)", "11,630", "Large energy totals and national statistics"],
          ]}
        />
      </RefSection>

      <RefSection
        heading="SI prefixes"
        note="Prefix errors are the classic factor-of-a-thousand mistake. Sanity-check any figure's scale against something you already know."
      >
        <RefTable
          headers={["Prefix", "Symbol", "Factor", "Example"]}
          rows={[
            ["kilo", "k", "×1,000", "A 3 kW kettle"],
            ["mega", "M", "×1,000,000", "A 500 MWh annual site total"],
            ["giga", "G", "×10⁹", "A 2 GWh factory; 1 GJ of heat"],
            ["tera", "T", "×10¹²", "National statistics (TWh)"],
          ]}
        />
      </RefSection>

      <RefSection
        heading="Power vs energy"
        note="kW is a rate (never 'per hour', that is already baked in); kWh is a quantity. Energy = power × time: a 10 kW heater for 3 hours is 30 kWh."
      >
        <RefTable
          headers={["Quantity", "Unit", "Analogy"]}
          rows={[
            ["Power", "kW", "Speedometer: the rate right now"],
            ["Energy", "kWh", "Odometer: the total that accumulates"],
            ["Capacity (electrical)", "kVA", "The supply's carrying capacity, incl. reactive power"],
          ]}
        />
      </RefSection>

      <RefLinks
        taught={[
          { href: "/courses/intro-to-energy-management/energy-units", label: "Energy units lesson" },
          { href: "/courses/intro-to-energy-management/energy-vs-power", label: "Energy vs power" },
        ]}
        sources={[
          { href: "https://www.gov.uk/government/collections/digest-of-uk-energy-statistics-dukes", label: "DUKES (GOV.UK) unit conventions" },
          { href: "https://www.bipm.org/en/measurement-units", label: "BIPM SI units" },
        ]}
      />
    </RefShell>
  );
}
