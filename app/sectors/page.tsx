import Link from "next/link";
import type { Metadata } from "next";
import { getSectors } from "@/lib/content";
import { SECTOR_CATEGORIES } from "@/content/curriculum";

export const metadata: Metadata = {
  title: "Sectors",
  description:
    "Apply the foundations and system deep dives to a specific industry — its processes, its benchmarks, its regulation.",
};

export default function SectorsPage() {
  const sectors = getSectors();

  return (
    <div>
      <section className="border-b border-slate-200 bg-terra-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900">
            ← Home
          </Link>
          <div className="mt-4 text-sm font-medium uppercase tracking-wide text-slate-500">
            A peer to Levels 1–3
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Sectors</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            Levels 1–3 build expertise; Sectors apply it. Each sector course assumes the Level 1/2
            foundations and focuses purely on what&apos;s different about that industry — its
            processes, its energy benchmarks, its regulation, and which systems matter most there.
            A retail specialist and a data-centre specialist can both be at &ldquo;Level 2 depth,&rdquo;
            just pointed at very different sites.
          </p>
          <p className="mt-4 text-sm text-slate-500">{sectors.length} sector{sectors.length === 1 ? "" : "s"} available</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:px-6">
        {SECTOR_CATEGORIES.map((cat) => {
          const inCategory = sectors.filter((s) => s.category === cat.id);
          return (
            <div key={cat.id}>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">{cat.title}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{cat.blurb}</p>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {inCategory.map((sector) => (
                  <Link
                    key={sector.slug}
                    href={`/sectors/${sector.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className={`h-1.5 bg-gradient-to-r ${sector.accent.gradient}`} />
                    <div className="flex flex-1 flex-col p-6">
                      <span
                        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${sector.accent.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${sector.accent.dot}`} />
                        {cat.title}
                      </span>
                      <div className="mt-3 text-lg font-semibold text-slate-900">{sector.title}</div>
                      <p className="mt-1 text-sm font-medium text-slate-500">{sector.tagline}</p>
                      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                        {sector.description}
                      </p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-sm text-slate-400">{sector.courses.length} course{sector.courses.length === 1 ? "" : "s"}</span>
                        <span className={`text-sm font-semibold ${sector.accent.text} group-hover:underline`}>
                          Browse {sector.title} →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}

                {inCategory.length === 0 && (
                  <div className="flex flex-col justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-6">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                      In development
                    </span>
                    <div className="mt-3 text-lg font-semibold text-slate-500">
                      Fleet Electrification &amp; Depot Charging
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      The first transportation sector course is planned: grid connections, load
                      management and smart charging where fleets meet site infrastructure.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
