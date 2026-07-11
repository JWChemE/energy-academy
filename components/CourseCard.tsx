import Link from "next/link";
import type { Course, Level } from "@/content/curriculum";
import { getCourseStats } from "@/lib/content";

/**
 * One course as a detailed, full-width list row: numbered tile in the level's
 * hue, title, summary and meta on a white surface with a soft shadow. Render
 * inside a stacked list (`space-y-*`), not a card grid.
 */
export function CourseCard({
  course,
  level,
  index,
}: {
  course: Course;
  level: Level;
  index: number;
}) {
  const { lessonCount, totalMinutes } = getCourseStats(course);
  const available = course.status === "available";

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-px hover:border-slate-300 hover:shadow-md sm:gap-5"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
          available ? level.accent.badge : "bg-slate-100 text-slate-400"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
          <h3
            className={`text-base font-semibold ${
              available
                ? "text-slate-900 group-hover:text-brand-700"
                : "text-slate-500"
            }`}
          >
            {course.title}
          </h3>
          <span className="shrink-0 text-xs font-medium text-slate-400">
            {available ? `${lessonCount} lessons · ${totalMinutes} min` : "Coming soon"}
          </span>
        </span>
        <p className="mt-1 line-clamp-2 max-w-2xl text-sm leading-6 text-slate-600">
          {course.summary}
        </p>
        <span
          className={`mt-2 inline-block text-sm font-semibold ${
            available ? "text-brand-700" : "text-slate-400"
          }`}
        >
          {available ? "Start course →" : "Preview →"}
        </span>
      </span>
    </Link>
  );
}
