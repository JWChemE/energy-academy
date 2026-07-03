"use client";

import { useState } from "react";
import Link from "next/link";
import LeadCaptureForm from "@/components/LeadCaptureForm";

/**
 * The Energy Audit Checklist lead magnet. The intro and first section are
 * public (and indexable via the server page's metadata); the full checklist
 * unlocks when the visitor subscribes through the capture form.
 */

type Item = string;
type Section = { title: string; intro: string; items: Item[] };

const SECTIONS: Section[] = [
  {
    title: "1 · Before you visit — scoping & data",
    intro: "An audit is won or lost before you arrive. Agree what you're auditing and get the data flowing early.",
    items: [
      "Agree the audit level with the client (walk-through vs detailed vs investment-grade) and match it to what they need to decide",
      "Draw the boundary explicitly: which buildings, processes and meters are in scope — and which are not",
      "Request 12+ months of gas and electricity bills (half-hourly data if available)",
      "Request production/occupancy records for the same period — you cannot normalise without them",
      "Ask for a site plan, a plant list and any previous audit reports",
      "Book the visit for a day the site is actually running normally",
      "Confirm site-specific safety requirements (PPE, permits, escorted areas) before arrival",
    ],
  },
  {
    title: "2 · The walk-through",
    intro: "Walk the energy path from the meter to the point of use — and trust your senses.",
    items: [
      "Start at the incoming meters and trace each energy stream to its major users",
      "List the significant energy users (the ~20% of plant that takes ~80% of the energy)",
      "Listen for compressed-air leaks (hiss), look for steam plumes and dripping traps",
      "Feel for uninsulated hot pipework, valves and flanges — every hot surface is a running cost",
      "Note plant running that serves nothing (lights in empty rooms, ventilation in unused areas, idling compressors)",
      "Check setpoints against actual need: heating and cooling fighting each other, cold stores colder than spec",
      "Photograph nameplates of major plant (ratings, efficiencies, model numbers)",
      "Ask the operators what runs overnight and at weekends — then verify against half-hourly data",
    ],
  },
  {
    title: "3 · Measurements worth taking",
    intro: "A few instruments turn opinions into findings.",
    items: [
      "Flue-gas analysis on every boiler (O₂, CO, flue temperature → combustion efficiency)",
      "Clamp-meter or logger on the largest motors — compare running load to nameplate",
      "Overnight/weekend baseload from half-hourly data — what's consuming when nobody's there?",
      "Compressed air: system pressure, compressor load/unload cycling, leak test during quiet hours",
      "Spot temperatures: hot surfaces (thermal camera or IR gun), space temperatures vs setpoints",
      "Refrigeration: condensing and evaporating temperatures against design",
    ],
  },
  {
    title: "4 · Analysis & normalisation",
    intro: "Raw bills mislead. Normalise before you conclude anything.",
    items: [
      "Plot monthly energy against degree-days (heating) and production (process) — fit the baseline",
      "Separate base load from variable load: the intercept is what you use just by existing",
      "Compare energy intensity (kWh/m², kWh/unit) with sector benchmarks — like for like",
      "Check year-on-year changes against weather and output before crediting or blaming anyone",
      "Quantify every opportunity: kWh saved, £ saved, cost to implement, simple payback",
      "Sanity-check every number with a balance: inputs must equal outputs plus losses",
    ],
  },
  {
    title: "5 · Reporting & follow-through",
    intro: "The audit's value is realised in the months after the report lands.",
    items: [
      "Rank opportunities by payback — quick wins first to build credibility and fund the rest",
      "State every assumption (prices, hours, efficiencies) so the numbers can be defended",
      "Flag any measure that touches safety or compliance limits — never trade those for energy",
      "Agree who owns each recommendation and by when",
      "Set the measurement & verification plan now: how will savings be proven against the baseline?",
      "Diarise a 6-month follow-up — an unimplemented audit saves nothing",
    ],
  },
];

export default function ChecklistClient() {
  const [unlocked, setUnlocked] = useState(false);
  const publicSection = SECTIONS[0];
  const gatedSections = SECTIONS.slice(1);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
        Free resource
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        The Energy Audit Checklist
      </h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">
        Everything to check before, during and after a site energy audit — scoping, the
        walk-through, the measurements worth taking, normalising the data, and reporting so the
        recommendations actually happen. Distilled from our full{" "}
        <Link href="/courses/energy-audits" className="font-medium text-brand-700 hover:underline">
          Energy Audits course
        </Link>
        .
      </p>

      {/* Section 1 is free — proof of quality before the ask. */}
      <ChecklistSection section={publicSection} />

      {!unlocked ? (
        <>
          <div className="relative mt-8" aria-hidden>
            <div className="pointer-events-none select-none opacity-40 blur-[2px]">
              <h2 className="text-xl font-semibold text-slate-900">{gatedSections[0].title}</h2>
              <ul className="mt-3 space-y-2">
                {gatedSections[0].items.slice(0, 3).map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-600">
                    <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-slate-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50" />
          </div>
          <div className="mt-4">
            <LeadCaptureForm
              source="energy-audit-checklist"
              onUnlocked={() => setUnlocked(true)}
            />
          </div>
        </>
      ) : (
        <>
          {gatedSections.map((s) => (
            <ChecklistSection key={s.title} section={s} />
          ))}
          <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-6">
            <h2 className="text-lg font-bold text-slate-900">Want to go deeper?</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              The free{" "}
              <Link href="/courses/energy-audits" className="font-medium text-brand-700 hover:underline">
                Energy Audits course
              </Link>{" "}
              teaches the method behind every item here — including a full interactive audit
              capstone where you scope, survey, normalise and report on a realistic site.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function ChecklistSection({ section }: { section: Section }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
      <p className="mt-1 text-sm text-slate-500">{section.intro}</p>
      <ul className="mt-3 space-y-2">
        {section.items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
            <span className="mt-1 h-4 w-4 shrink-0 rounded border border-slate-300" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
