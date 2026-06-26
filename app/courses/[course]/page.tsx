import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCourseParams,
  getCourse,
  getCourseLessons,
  getCourseStats,
} from "@/lib/content";

type Props = { params: Promise<{ course: string }> };

export function generateStaticParams() {
  return getAllCourseParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course: slug } = await params;
  const found = getCourse(slug);
  if (!found) return {};
  return { title: found.course.title, description: found.course.summary };
}

export default async function CoursePage({ params }: Props) {
  const { course: slug } = await params;
  const found = getCourse(slug);
  if (!found) notFound();

  const { course, level } = found;
  const available = course.status === "available";
  const lessons = getCourseLessons(course);
  const { lessonCount, totalMinutes } = getCourseStats(course);
  const firstLesson = lessons[0];

  return (
    <div>
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link
              href={`/levels/${level.slug}`}
              className="font-medium hover:text-slate-900"
            >
              Level {level.number}: {level.title}
            </Link>
            <span>/</span>
            <span className="text-slate-400">{course.title}</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${level.accent.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${level.accent.dot}`} />
              Level {level.number}
            </span>
            {available ? (
              <span className="text-xs font-medium text-slate-400">
                {lessonCount} lessons · {totalMinutes} min
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                Coming soon
              </span>
            )}
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {course.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            {course.summary}
          </p>

          {available && firstLesson && (
            <div className="mt-8">
              <Link
                href={`/courses/${course.slug}/${firstLesson.slug}`}
                className="inline-flex rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
              >
                Start course →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {available ? (
          <div className="space-y-8">
            {course.modules.map((module, mi) => (
              <div key={module.slug}>
                <h2 className="mb-3 flex items-baseline gap-3 text-xl font-semibold text-slate-900">
                  <span className="text-sm font-bold text-slate-300">
                    {String(mi + 1).padStart(2, "0")}
                  </span>
                  {module.title}
                </h2>
                <ol className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.slug}>
                      <Link
                        href={`/courses/${course.slug}/${lesson.slug}`}
                        className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
                          ▶
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-slate-900">
                            {lesson.title}
                          </span>
                          <span className="block truncate text-sm text-slate-500">
                            {lesson.summary}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm text-slate-400">
                          {lesson.minutes} min
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <div className="text-4xl">🚧</div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              This course is on the way
            </h2>
            <p className="mx-auto mt-2 max-w-md text-slate-600">
              We&apos;re building it now. In the meantime, start with the
              foundation course — it sets up everything you&apos;ll need here.
            </p>
            <Link
              href="/courses/intro-to-energy-management"
              className="mt-6 inline-flex rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Go to Introduction to Energy Management →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
