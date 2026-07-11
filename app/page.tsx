import Link from "next/link";
import { getCourseStats, getLevels, getSectors } from "@/lib/content";
import { SECTOR_CATEGORIES, type Course, type Level } from "@/content/curriculum";

/**
 * Homepage: a compact hero, then the full curriculum as a detailed index —
 * the depth of the catalogue is the pitch, with every course title and
 * summary in the page (crawlable, and visitors see what they'd actually get).
 */

function CourseMiniRow({ course, level, index }: { course: Course; level: Level; index: number }) {
  const available = course.status === "available";
  const { lessonCount, totalMinutes } = getCourseStats(course);
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-px hover:border-slate-300 hover:shadow-md"
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
          available ? level.accent.badge : "bg-slate-100 text-slate-400"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-3">
          <span
            className={`truncate text-sm font-semibold ${
              available ? "text-slate-900 group-hover:text-brand-700" : "text-slate-500"
            }`}
          >
            {course.title}
          </span>
          <span className="shrink-0 text-xs font-medium text-slate-400">
            {available ? `${lessonCount} lessons · ${totalMinutes} min` : "Coming soon"}
          </span>
        </span>
        <span className="mt-0.5 line-clamp-2 block text-sm leading-6 text-slate-500">
          {course.summary}
        </span>
      </span>
    </Link>
  );
}

export default function Home() {
  const levels = getLevels();
  const sectors = getSectors();
  const totalCourses =
    levels.reduce((n, l) => n + l.courses.length, 0) +
    sectors.reduce((n, s) => n + s.courses.length, 0);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-white"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Master energy management, one principle at a time.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              A structured path from the fundamentals everyone should know, through
              hands-on technical deep dives, to the leadership skills that drive an
              organisation toward net zero. Written for UK sites, with real numbers
              throughout.
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
                Browse the full curriculum
              </Link>
            </div>
            <p className="mt-8 text-sm font-medium text-slate-500">
              3 levels · {totalCourses} courses · free to start, free account for the deep dives
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum index: the three levels with their courses */}
      <section id="levels" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            The full curriculum
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Three levels, aligned to how the energy profession develops expertise.
            Start at the foundations and go as deep as your role needs.
          </p>
        </div>

        {levels.map((level) => (
          <div key={level.slug} className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${level.accent.badge}`}
                >
                  {level.number}
                </span>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Level {level.number} · {level.tagline}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900">
                    {level.title}
                  </h3>
                </div>
              </div>
              <Link
                href={`/levels/${level.slug}`}
                className={`text-sm font-semibold ${level.accent.text} hover:underline`}
              >
                Browse Level {level.number} →
              </Link>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {level.description}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {level.courses.map((course, i) => (
                <CourseMiniRow key={course.slug} course={course} level={level} index={i} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Sectors */}
      <section id="sectors" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wide text-terra-600">
              A peer to Levels 1–3, not a fourth tier
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Or go deep on one sector
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              The same principles applied to one industry at a time — its processes,
              its energy benchmarks, and the regulation unique to it.
            </p>
          </div>

          {SECTOR_CATEGORIES.map((category) => {
            const inCategory = sectors.filter((s) => s.category === category.id);
            if (inCategory.length === 0) return null;
            return (
              <div key={category.id} className="mt-10">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  {category.title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-slate-500">{category.blurb}</p>
                {inCategory.map((sector) => (
                  <div key={sector.slug} className="mt-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${sector.accent.dot}`} />
                        <h4 className="text-lg font-bold tracking-tight text-slate-900">
                          {sector.title}
                        </h4>
                        <span className="hidden text-sm text-slate-500 sm:inline">
                          · {sector.tagline}
                        </span>
                      </div>
                      <Link
                        href={`/sectors/${sector.slug}`}
                        className={`text-sm font-semibold ${sector.accent.text} hover:underline`}
                      >
                        Browse {sector.title} →
                      </Link>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {sector.courses.map((course, i) => (
                        <CourseMiniRow
                          key={course.slug}
                          course={course}
                          level={sector}
                          index={i}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {/* Account band */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              A free account unlocks the whole platform
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Level 1 is open to everyone, no signup. A free account unlocks all of
              Levels 2 and 3 and every sector course — every lesson, quiz and
              interactive capstone — and saves your progress as you go.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/auth"
                className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
              >
                Create free account
              </Link>
              <Link
                href="/auth"
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
