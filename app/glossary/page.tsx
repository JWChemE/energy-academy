import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY, type GlossaryEntry } from "@/content/glossary";

export const metadata: Metadata = {
  title: "Energy Management Glossary",
  description:
    "Every term in energy management defined in plain English, from baseload and CUSUM to U-values, COP and spark spread, each linked to the lesson that teaches it.",
  alternates: { canonical: "/glossary" },
};

/** Group entries A–Z by first letter of the term. */
function grouped(): [string, GlossaryEntry[]][] {
  const sorted = [...GLOSSARY].sort((a, b) =>
    a.term.localeCompare(b.term, "en-GB", { sensitivity: "base" }),
  );
  const groups = new Map<string, GlossaryEntry[]>();
  for (const entry of sorted) {
    const letter = entry.term[0].toUpperCase();
    const list = groups.get(letter) ?? [];
    list.push(entry);
    groups.set(letter, list);
  }
  return [...groups.entries()];
}

export default function GlossaryPage() {
  const groups = grouped();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Glossary
      </h1>
      <p className="mt-3 text-slate-600">
        {GLOSSARY.length} terms, defined in plain English and linked to the
        lesson that teaches each one properly.
      </p>

      {/* Letter nav */}
      <nav
        aria-label="Jump to letter"
        className="sticky top-16 z-10 -mx-4 mt-6 flex flex-wrap gap-1 border-b border-slate-100 bg-white/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6"
      >
        {groups.map(([letter]) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            {letter}
          </a>
        ))}
      </nav>

      <div className="mt-6 space-y-10">
        {groups.map(([letter, entries]) => (
          <section key={letter} id={`letter-${letter}`} className="scroll-mt-32">
            <h2 className="text-xl font-bold text-slate-300">{letter}</h2>
            <dl className="mt-3 space-y-5">
              {entries.map((entry) => (
                <div
                  key={entry.anchor}
                  id={entry.anchor}
                  className="scroll-mt-32"
                >
                  <dt className="font-semibold text-slate-900">
                    {entry.term}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-slate-600">
                    {entry.definition}
                    {entry.href && (
                      <>
                        {" "}
                        <Link
                          href={entry.href}
                          className="whitespace-nowrap text-brand-700 underline"
                        >
                          Learn more →
                        </Link>
                      </>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <p className="mt-12 text-sm text-slate-500">
        Missing a term?{" "}
        <Link href="/search" className="text-brand-700 underline">
          Search the whole site
        </Link>{" "}
        or browse the{" "}
        <Link href="/reference" className="text-brand-700 underline">
          quick reference tables
        </Link>
        .
      </p>
    </div>
  );
}
