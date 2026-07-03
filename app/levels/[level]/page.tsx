import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLevel, getLevels } from "@/lib/content";
import { CourseCard } from "@/components/CourseCard";

type Props = { params: Promise<{ level: string }> };

export function generateStaticParams() {
  return getLevels().map((l) => ({ level: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level: slug } = await params;
  const level = getLevel(slug);
  if (!level) return {};
  return {
    title: `Level ${level.number}: ${level.title}`,
    description: level.description,
    alternates: { canonical: `/levels/${slug}` },
  };
}

export default async function LevelPage({ params }: Props) {
  const { level: slug } = await params;
  const level = getLevel(slug);
  if (!level) notFound();

  const levels = getLevels();
  const availableCount = level.courses.filter(
    (c) => c.status === "available",
  ).length;

  return (
    <div>
      {/* Banner */}
      <section className={`border-b border-slate-200 ${level.accent.softBg}`}>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Link
            href="/#levels"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← All levels
          </Link>
          <div className="mt-4 flex items-center gap-4">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold ${level.accent.badge}`}
            >
              {level.number}
            </span>
            <div>
              <div className="text-sm font-medium uppercase tracking-wide text-slate-500">
                Level {level.number} · {level.tagline}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {level.title}
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            {level.description}
          </p>
          <p className="mt-4 text-sm text-slate-500">
            {level.courses.length} courses · {availableCount} available now
          </p>
        </div>
      </section>

      {/* Courses */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {level.courses.map((course) => (
            <CourseCard key={course.slug} course={course} level={level} />
          ))}
        </div>
      </section>

      {/* Level switcher */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="flex flex-wrap gap-3">
          {levels
            .filter((l) => l.slug !== level.slug)
            .map((l) => (
              <Link
                key={l.slug}
                href={`/levels/${l.slug}`}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold ${l.accent.badge}`}
                >
                  {l.number}
                </span>
                Go to Level {l.number}: {l.title} →
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
