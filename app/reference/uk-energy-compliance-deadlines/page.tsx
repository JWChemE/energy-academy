import type { Metadata } from "next";
import { RefShell, RefSection, RefTable, RefLinks } from "@/components/reference/RefShell";

export const metadata: Metadata = {
  title: "UK Energy Compliance Deadlines 2026–2033",
  description:
    "Every UK energy compliance date on one page: ESOS Phase 4 (5 Dec 2027), MEES EPC B by 2031, the new CCA scheme to 2033, heat network regulation, SECR, TM44 and EPC cycles, with links to plain-English guides.",
  alternates: { canonical: "/reference/uk-energy-compliance-deadlines" },
};

export default function ComplianceDeadlinesPage() {
  return (
    <RefShell
      title="UK energy compliance deadlines"
      lead="The dates that drive UK energy compliance work, on one page: fixed statutory deadlines, recurring cycles, and the announced trajectories worth planning against. Each row links to the lesson that explains the scheme in plain English. Regulations move; anything compliance-critical should be confirmed against the linked GOV.UK source before you rely on it."
      reviewed="2026-07-09"
    >
      <RefSection
        heading="Fixed deadlines"
        note="Statutory dates with penalties attached. ESOS qualification is a snapshot test: your status on the qualification date decides the whole phase."
      >
        <RefTable
          headers={["Scheme", "Date", "What happens"]}
          rows={[
            ["ESOS Phase 4: qualification", "31 December 2026", "Organisations meeting the size tests (250+ employees, or ~£44m turnover with ~£38m balance sheet) on this date are in scope for the phase"],
            ["ESOS Phase 4: compliance", "5 December 2027", "Energy assessment complete and notified to the Environment Agency; action plan and annual progress updates follow"],
            ["MEES: EPC B (announced)", "2031", "Non-domestic lettings over 1,000 m² to reach EPC B where cost-effective, per the June 2026 interim response; secondary legislation pending"],
            ["CCA: reduced CCL rates end", "31 March 2033", "The renewed Climate Change Agreement scheme's discounted levy rates run to this date, with targets to end of 2030"],
            ["Heat networks: full regulation", "January 2027", "The bulk of Ofgem's authorisation conditions (live since 27 January 2026) planned to be in force and enforced"],
          ]}
        />
      </RefSection>

      <RefSection
        heading="Standing requirements and cycles"
        note="Recurring obligations with no single deadline: the trap is letting a cycle lapse unnoticed."
      >
        <RefTable
          headers={["Requirement", "Cycle", "Applies to"]}
          rows={[
            ["SECR reporting", "Annual, in the directors' report", "Quoted companies and large unquoted companies/LLPs"],
            ["ESOS action plan progress updates", "Annual, following the phase's action plan", "All ESOS participants (introduced from Phase 3)"],
            ["MEES: EPC E floor", "Continuous since 1 April 2023", "All non-domestic lettings in England & Wales (F/G unlawful to let without a registered exemption)"],
            ["EPC validity", "10 years", "Required at construction, sale or letting"],
            ["TM44 air-conditioning inspection", "Every 5 years", "Systems over 12 kW effective rated output"],
            ["DECs (public buildings)", "Annual over 1,000 m²; 10-yearly below", "Public buildings over 250 m² frequently visited by the public"],
            ["F-gas leak checks", "3/6/12-monthly by refrigerant charge", "Operators of equipment containing F-gas refrigerants"],
            ["Heat network metering & billing", "Continuous (2014 regs + 2026 authorisation)", "Anyone supplying heat or cooling through a network, including landlords"],
          ]}
        />
      </RefSection>

      <RefSection
        heading="The CCA scheme calendar"
        note="The renewed Climate Change Agreement scheme: levy discounts in exchange for meeting sector efficiency targets."
      >
        <RefTable
          headers={["Milestone", "Date", "Notes"]}
          rows={[
            ["First target period (TP7) starts", "1 January 2026", "12 months; the following two target periods run 24 months each"],
            ["Targets run to", "End of 2030", "Sector-negotiated, intensity-based against a baseline (data centres: 14.5% vs 2022)"],
            ["New entrant windows", "Annually (historically 1 Jan – 31 Aug)", "New sites and non-members can apply; check the current window on GOV.UK"],
            ["Reduced CCL rates until", "31 March 2033", "For participants meeting their targets or paying the buy-out"],
          ]}
        />
      </RefSection>

      <RefLinks
        taught={[
          { href: "/courses/uk-energy-regulation/esos", label: "ESOS Phase 4: who qualifies and what's required" },
          { href: "/courses/uk-energy-regulation/secr", label: "SECR: what goes in the annual report" },
          { href: "/courses/uk-energy-regulation/climate-change-levy", label: "The Climate Change Levy and CCA discounts" },
          { href: "/courses/commercial-real-estate/mees-minimum-standards", label: "MEES: the minimum standards that bite (EPC B by 2031)" },
          { href: "/courses/commercial-real-estate/heat-network-regulation", label: "Heat networks: the new regulated utility" },
          { href: "/courses/commercial-real-estate/esos-secr-and-tm44", label: "TM44 air-conditioning inspections for landlords" },
          { href: "/courses/food-drink-foundations/cca-esos-and-reporting", label: "CCAs across food & drink" },
          { href: "/courses/data-centres/cca-esos-and-reporting", label: "The data centre CCA (TP7-9)" },
        ]}
        sources={[
          { href: "https://www.gov.uk/guidance/energy-savings-opportunity-scheme-esos", label: "GOV.UK: ESOS guidance" },
          { href: "https://www.gov.uk/guidance/climate-change-agreements--2", label: "GOV.UK: Climate Change Agreements" },
          { href: "https://www.gov.uk/guidance/non-domestic-private-rented-property-minimum-energy-efficiency-standard-landlord-guidance", label: "GOV.UK: non-domestic MEES landlord guidance" },
          { href: "https://www.ofgem.gov.uk/energy-policy-and-regulation/policy-and-regulatory-programmes/heat-networks", label: "Ofgem: heat networks regulation" },
          { href: "https://www.gov.uk/guidance/air-conditioning-inspections-for-buildings", label: "GOV.UK: air-conditioning (TM44) inspections" },
        ]}
      />
    </RefShell>
  );
}
