import type { Metadata } from "next";
import ChecklistClient from "./ChecklistClient";

export const metadata: Metadata = {
  title: "Free Energy Audit Checklist",
  description:
    "A practical, printable checklist for planning and running a site energy audit — scoping, the walk-through, metering, analysis and reporting. Built from our Energy Audits course.",
  alternates: { canonical: "/resources/energy-audit-checklist" },
  openGraph: {
    title: "Free Energy Audit Checklist",
    description:
      "A practical, printable checklist for planning and running a site energy audit.",
    url: "/resources/energy-audit-checklist",
  },
};

export default function EnergyAuditChecklistPage() {
  return <ChecklistClient />;
}
