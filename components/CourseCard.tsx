import Link from "next/link";
import type { Course, Level } from "@/content/curriculum";
import { getCourseStats } from "@/lib/content";

export function CourseCard({ course, level }: { course: Course; level: Level }) {
  const { lessonCount, totalMinutes } = getCourseStats(course);
  const available = course.status === "available";
  const levelLabel = level.kind === "sector" ? "Sector" : `Level ${level.number}`;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${level.accent.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${level.accent.dot}`} />
          {levelLabel}
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

      <h3 className="text-base font-semibold text-slate-900 group-hover:text-brand-700">
        {course.title}
      </h3>
      <p className="mt-1.5 line-clamp-3 text-sm text-slate-500">
        {course.summary}
      </p>

      <span className="mt-4 text-sm font-semibold text-brand-700">
        {available ? "Start course →" : "Preview →"}
      </span>
    </Link>
  );
}
