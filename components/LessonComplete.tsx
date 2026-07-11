"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-context";
import { useProgress } from "@/app/progress-context";

/**
 * End-of-lesson action. Signed in: a "Mark complete & continue" button that
 * records progress and advances to the next lesson. Signed out: a quiet prompt
 * to sign in (progress is account-only), but you can still continue.
 */
export default function LessonComplete({
  course,
  lesson,
  next,
  courseHref,
}: {
  course: string;
  lesson: string;
  next: { slug: string; title: string } | null;
  courseHref: string;
}) {
  const { user, loading } = useAuth();
  const { isComplete, markComplete } = useProgress();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  if (loading) return null;

  const continueHref = next ? `/courses/${course}/${next.slug}` : courseHref;
  const done = user ? isComplete(course, lesson) : false;

  // Signed out — gentle nudge, no blocking.
  if (!user) {
    return (
      <div className="not-prose my-10 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          <Link href="/auth" className="font-semibold text-brand-700 hover:underline">
            Create a free account
          </Link>{" "}
          to track which lessons you&apos;ve completed.
        </p>
        {next && (
          <Link
            href={continueHref}
            className="shrink-0 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            Next: {next.title} →
          </Link>
        )}
      </div>
    );
  }

  async function handleComplete() {
    setSaving(true);
    if (!done) await markComplete(course, lesson);
    router.push(continueHref);
  }

  return (
    <div className="not-prose my-10 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      {done ? (
        <>
          <p className="flex items-center gap-2 text-sm font-medium text-brand-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-xs">✓</span>
            Lesson complete
          </p>
          <Link
            href={continueHref}
            className="shrink-0 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            {next ? `Next: ${next.title} →` : "Back to course →"}
          </Link>
        </>
      ) : (
        <>
          <p className="text-sm text-slate-600">Finished reading? Mark it complete to track your progress.</p>
          <button
            onClick={handleComplete}
            disabled={saving}
            className="shrink-0 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : next ? "Mark complete & continue →" : "Mark complete & finish →"}
          </button>
        </>
      )}
    </div>
  );
}
