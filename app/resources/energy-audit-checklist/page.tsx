import type { Metadata } from "next";
import ChecklistClient from "./ChecklistClient";
import FAQList from "@/components/mdx/FAQList";

export const metadata: Metadata = {
  title: "Commercial Energy Audit Checklist (Free & Printable)",
  description:
    "A practical commercial energy audit checklist covering all five stages: scoping and data, the site walk-through, measurements, normalised analysis and reporting. Built from our Energy Audits course.",
  alternates: { canonical: "/resources/energy-audit-checklist" },
  openGraph: {
    title: "Commercial Energy Audit Checklist (Free & Printable)",
    description:
      "A practical checklist for planning and running a commercial site energy audit.",
    url: "/resources/energy-audit-checklist",
  },
};

export default function EnergyAuditChecklistPage() {
  return (
    <>
      <ChecklistClient />
      {/* FAQ (with FAQPage schema) renders server-side so it is always in the
          public HTML, whatever the client-side unlock state. */}
      <div className="mx-auto max-w-3xl px-4 pb-12 sm:px-6">
        <FAQList id="energy-audit-checklist" />
      </div>
    </>
  );
}
