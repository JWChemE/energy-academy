"use client";

import Link from "next/link";
import type { Module } from "@/content/curriculum";
import { useAuth } from "@/app/auth-context";
import { useProgress } from "@/app/progress-context";

/**
 * The lesson reader's outline sidebar, with a tick against lessons the
 * signed-in learner has completed.
 */
export default function LessonOutline({
  courseSlug,
  courseTitle,
  modules,
  currentSlug,
  position,
  total,
}: {
  courseSlug: string;
  courseTitle: string;
  modules: Module[];
  currentSlug: string;
  position: number;
  total: number;
}) {
  const { user } = useAuth();
  const { isComplete } = useProgress();

  return (
    <div className="sticky top-24">
      <Link
        href={`/courses/${courseSlug}`}
        className="text-sm font-semibold text-slate-900 hover:text-brand-700"
      >
        {courseTitle}
      </Link>
      <p className="mt-1 text-xs text-slate-400">
        Lesson {position} of {total}
      </p>
      <nav className="mt-4 space-y-5">
        {modules.map((m) => (
          <div key={m.slug}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {m.title}
            </div>
            <ul className="space-y-1 border-l border-slate-200">
              {m.lessons.map((l) => {
                const current = l.slug === currentSlug;
                const done = user && isComplete(courseSlug, l.slug);
                return (
                  <li key={l.slug}>
                    <Link
                      href={`/courses/${courseSlug}/${l.slug}`}
                      className={`-ml-px flex items-start gap-1.5 border-l-2 py-1 pl-3 text-sm transition-colors ${
                        current
                          ? "border-brand-500 font-medium text-brand-700"
                          : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      <span
                        className={`mt-0.5 text-xs ${done ? "text-emerald-600" : "text-slate-300"}`}
                        aria-hidden
                      >
                        {done ? "✓" : "○"}
                      </span>
                      <span>{l.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
