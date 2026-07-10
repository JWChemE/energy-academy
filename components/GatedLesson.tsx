"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { useAuth } from "@/app/auth-context";
import { mdxComponents } from "@/components/mdx";

/**
 * Renders a gated (Level 2/3, or Sector) lesson body. The text is never in the
 * page HTML — this component fetches it from /api/lesson with the user's
 * access token. Signed out, it shows a sign-in wall instead; the lesson title,
 * summary and outline (rendered by the page around this component) stay
 * visible as a preview.
 */
type State = "checking" | "loading" | "ready" | "locked" | "error";

export default function GatedLesson({
  course,
  lesson,
  levelLabel,
  levelTitle,
  summary,
  preview,
}: {
  course: string;
  lesson: string;
  levelLabel: string;
  levelTitle: string;
  summary: string;
  /**
   * Short lead-paragraph excerpt, extracted server-side. Rendered while the
   * lesson is locked/loading (so it's in the server HTML for crawlers and
   * signed-out visitors), and replaced by the full body once it arrives.
   */
  preview?: string;
}) {
  const { user, session, loading } = useAuth();
  const [state, setState] = useState<State>("checking");
  const [mdx, setMdx] = useState<MDXRemoteSerializeResult | null>(null);

  // Supabase refreshes the access token whenever the tab regains focus, which
  // replaces the session object. If this effect depended on `session`, every
  // tab switch would flip back to "loading" and unmount the lesson body —
  // wiping any in-progress quiz or capstone state. So the effect keys on the
  // stable user id only, and reads the current token from a ref at fetch time.
  const token = session?.access_token;
  const tokenRef = useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);
  const userId = user?.id;

  useEffect(() => {
    if (loading) return;
    if (!userId || !tokenRef.current) {
      setState("locked");
      return;
    }
    let cancelled = false;
    setState("loading");
    fetch(`/api/lesson?course=${encodeURIComponent(course)}&lesson=${encodeURIComponent(lesson)}`, {
      headers: { Authorization: `Bearer ${tokenRef.current}` },
    })
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 401) {
          setState("locked");
          return;
        }
        if (!res.ok) {
          setState("error");
          return;
        }
        const data = await res.json();
        setMdx(data.mdxSource as MDXRemoteSerializeResult);
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [loading, userId, course, lesson]);

  if (loading || state === "checking" || state === "loading") {
    return (
      <>
        <Preview text={preview} />
        <Skeleton />
      </>
    );
  }

  if (state === "locked") {
    return (
      <>
        <Preview text={preview} />
        <Wall levelLabel={levelLabel} levelTitle={levelTitle} summary={summary} />
      </>
    );
  }

  if (state === "error") {
    return (
      <div className="not-prose rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        Something went wrong loading this lesson. Please refresh, or sign out and back in.
      </div>
    );
  }

  return <MDXRemote {...mdx!} components={mdxComponents} />;
}

/** The indexable lead-paragraph teaser, with a fade into the wall below. */
function Preview({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="relative mb-6" aria-label="Lesson preview">
      <p>{text}</p>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-50 to-transparent"
        aria-hidden
      />
    </div>
  );
}

function Skeleton() {
  return (
    <div className="not-prose animate-pulse space-y-4" aria-hidden>
      <div className="h-4 w-3/4 rounded bg-slate-200" />
      <div className="h-4 w-full rounded bg-slate-200" />
      <div className="h-4 w-5/6 rounded bg-slate-200" />
      <div className="h-32 w-full rounded-xl bg-slate-100" />
      <div className="h-4 w-2/3 rounded bg-slate-200" />
    </div>
  );
}

function Wall({
  levelLabel,
  levelTitle,
  summary,
}: {
  levelLabel: string;
  levelTitle: string;
  summary: string;
}) {
  return (
    <div className="not-prose rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-2xl">
        🔒
      </div>
      <span className="mt-4 inline-block rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-800">
        {levelLabel} · {levelTitle}
      </span>
      <h2 className="mt-3 text-xl font-bold text-slate-900">Create a free account to read this lesson</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{summary}</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
        Level 1 is open to everyone. A free account unlocks all of Level 2 &amp; 3, and every Sector
        — every lesson, quiz and interactive capstone.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
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
  );
}
