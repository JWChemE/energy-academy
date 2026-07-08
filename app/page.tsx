import Link from "next/link";
import { getLevels, getSectors } from "@/lib/content";

export default function Home() {
  const levels = getLevels();
  const sectors = getSectors();
  const totalCourses = levels.reduce((n, l) => n + l.courses.length, 0);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-sky-50"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
              Energy management, made learnable
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Master energy management, one principle at a time.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              A structured path from the fundamentals everyone should know, through
              hands-on technical deep dives, to the leadership skills that drive an
              organisation toward net zero.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/courses/intro-to-energy-management"
                className="rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
              >
                Start the foundation course
              </Link>
              <Link
                href="#levels"
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Explore the curriculum
              </Link>
            </div>
            <dl className="mt-12 flex gap-8">
              <div>
                <dt className="text-sm text-slate-500">Tiers</dt>
                <dd className="text-2xl font-bold text-slate-900">3</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Courses</dt>
                <dd className="text-2xl font-bold text-slate-900">
                  {totalCourses}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Cost to start</dt>
                <dd className="text-2xl font-bold text-slate-900">Free</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Three tiers */}
      <section id="levels" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Three tiers of learning
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Aligned to the way the energy profession develops expertise — start at
            the foundations and progress as far as you need.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {levels.map((level) => (
            <Link
              key={level.slug}
              href={`/levels/${level.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                className={`h-1.5 bg-gradient-to-r ${level.accent.gradient}`}
              />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${level.accent.badge}`}
                  >
                    {level.number}
                  </span>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Level {level.number}
                    </div>
                    <div className="text-lg font-semibold text-slate-900">
                      {level.title}
                    </div>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                  {level.description}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    {level.courses.length} courses
                  </span>
                  <span
                    className={`text-sm font-semibold ${level.accent.text} group-hover:underline`}
                  >
                    Browse Level {level.number} →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sectors */}
      <section id="sectors" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
              A peer to Levels 1–3, not a fourth tier
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              Or go deep on one sector
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Once you have the foundations and the system deep dives, apply them to a specific
              industry — its processes, its energy benchmarks, and the regulation unique to it.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {sectors.map((sector) => (
              <Link
                key={sector.slug}
                href={`/sectors/${sector.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className={`h-1.5 bg-gradient-to-r ${sector.accent.gradient}`} />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${sector.accent.badge}`}
                    >
                      🏭
                    </span>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        {sector.category === "industrial" ? "Industrial" : sector.category === "buildings" ? "Buildings" : "Transportation"}
                      </div>
                      <div className="text-lg font-semibold text-slate-900">{sector.title}</div>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                    {sector.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-slate-400">{sector.courses.length} courses</span>
                    <span
                      className={`text-sm font-semibold ${sector.accent.text} group-hover:underline`}
                    >
                      Browse {sector.title} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/sectors" className="text-sm font-semibold text-rose-700 hover:underline">
              See all sectors →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
