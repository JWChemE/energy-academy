"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-context";
import { useProgress } from "@/app/progress-context";
import { supabase } from "@/lib/supabase";
import {
  availableCourses,
  courseLessonCount,
  findCourse,
  firstIncompleteLesson,
  firstLesson,
  nextLessonInCourse,
  type LessonRef,
} from "@/lib/curriculumClient";

const LEVELS = [
  { slug: "level-1", number: 1, title: "Foundations", blurb: "Master energy fundamentals" },
  { slug: "level-2", number: 2, title: "System Deep Dives", blurb: "Technical, system-by-system" },
  { slug: "level-3", number: 3, title: "Leadership & Strategy", blurb: "Policy, finance, net zero" },
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { rows, loading: progressLoading } = useProgress();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading, router]);

  const completedSet = useMemo(
    () => new Set(rows.filter((r) => r.completed_at).map((r) => `${r.course_slug}/${r.lesson_slug}`)),
    [rows]
  );

  // "Continue where you left off": the lesson after the most recently completed
  // one; if that course is finished, the next started course's first gap; if
  // nothing's been done, the very first foundation lesson.
  const resume: LessonRef | null = useMemo(() => {
    const completed = rows
      .filter((r) => r.completed_at)
      .sort((a, b) => (a.completed_at! < b.completed_at! ? 1 : -1));

    if (completed.length === 0) return firstLesson("intro-to-energy-management");

    const latest = completed[0];
    const next = nextLessonInCourse(latest.course_slug, latest.lesson_slug);
    if (next) return next;

    // Current course finished — find the next started course with a gap.
    for (const c of completed) {
      const gap = firstIncompleteLesson(c.course_slug, completedSet);
      if (gap) return gap;
    }
    return null; // everything started is complete
  }, [rows, completedSet]);

  // Per-course progress for every course the learner has started.
  const courseProgress = useMemo(() => {
    const started = new Map<string, number>();
    for (const r of rows) {
      if (r.completed_at) started.set(r.course_slug, (started.get(r.course_slug) ?? 0) + 1);
    }
    return [...started.entries()]
      .map(([slug, completed]) => {
        const f = findCourse(slug);
        const total = courseLessonCount(slug);
        return {
          slug,
          title: f?.course.title ?? slug,
          levelNumber: f?.level.kind === "sector" ? 99 : (f?.level.number ?? 0),
          completed,
          total,
          pct: total ? Math.round((completed / total) * 100) : 0,
        };
      })
      .sort((a, b) => a.levelNumber - b.levelNumber || a.title.localeCompare(b.title));
  }, [rows]);

  const totalCompleted = completedSet.size;
  const coursesFinished = courseProgress.filter((c) => c.total > 0 && c.completed >= c.total).length;
  const totalAvailableCourses = availableCourses().length;

  if (loading || progressLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-500">Loading your dashboard…</div>
    );
  }
  if (!user) return null;

  return (
    <div>
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back, {user.full_name?.split(" ")[0] || user.email}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {totalCompleted} {totalCompleted === 1 ? "lesson" : "lessons"} completed
              {coursesFinished > 0 && ` · ${coursesFinished} ${coursesFinished === 1 ? "course" : "courses"} finished`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user.role === "superuser" && (
              <Link
                href="/admin"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Admin
              </Link>
            )}
            <button
              onClick={() => {
                supabase.auth.signOut();
                router.push("/");
              }}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        {/* Continue learning */}
        <section className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            {totalCompleted === 0 ? "Get started" : "Continue where you left off"}
          </h2>
          {resume ? (
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">{resume.courseTitle}</p>
                <p className="text-xl font-bold text-slate-900">{resume.title}</p>
              </div>
              <Link
                href={`/courses/${resume.course}/${resume.lesson}`}
                className="inline-flex shrink-0 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
              >
                {totalCompleted === 0 ? "Start learning →" : "Resume →"}
              </Link>
            </div>
          ) : (
            <p className="mt-2 text-slate-700">🎉 You&apos;re all caught up on every course you&apos;ve started. Pick a new one below.</p>
          )}
        </section>

        {/* Course progress */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Your courses</h2>
          {courseProgress.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              You haven&apos;t started any courses yet. Mark a lesson complete and it&apos;ll show up here.
            </div>
          ) : (
            <div className="space-y-3">
              {courseProgress.map((c) => {
                const finished = c.total > 0 && c.completed >= c.total;
                return (
                  <Link
                    key={c.slug}
                    href={`/courses/${c.slug}`}
                    className="block rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-slate-50"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-400">L{c.levelNumber}</span>
                        <h3 className="font-medium text-slate-900">{c.title}</h3>
                        {finished && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                            ✓ Complete
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-sm text-slate-500">
                        {c.completed} / {c.total}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${finished ? "bg-emerald-500" : "bg-brand-500"}`}
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Browse levels */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Explore the catalogue
            <span className="ml-2 text-sm font-normal text-slate-400">{totalAvailableCourses} courses</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {LEVELS.map((l) => (
              <Link
                key={l.slug}
                href={`/levels/${l.slug}`}
                className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-slate-50"
              >
                <span className="text-xs font-semibold text-slate-400">Level {l.number}</span>
                <h3 className="mt-0.5 font-bold text-slate-900">{l.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{l.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
