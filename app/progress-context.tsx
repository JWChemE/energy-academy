"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/app/auth-context";
import { supabase, markLessonComplete } from "@/lib/supabase";

export interface ProgressRow {
  course_slug: string;
  lesson_slug: string;
  completed_at: string | null;
}

interface ProgressContextType {
  rows: ProgressRow[];
  loading: boolean;
  isComplete: (course: string, lesson: string) => boolean;
  completedCount: (course: string) => number;
  markComplete: (course: string, lesson: string) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);
const key = (course: string, lesson: string) => `${course}/${lesson}`;

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setRows([]);
      setDone(new Set());
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from("progress")
      .select("course_slug, lesson_slug, completed_at")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (cancelled) return;
        const r = (data ?? []) as ProgressRow[];
        setRows(r);
        setDone(new Set(r.filter((x) => x.completed_at).map((x) => key(x.course_slug, x.lesson_slug))));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const isComplete = useCallback((c: string, l: string) => done.has(key(c, l)), [done]);

  const completedCount = useCallback(
    (c: string) => rows.filter((x) => x.course_slug === c && x.completed_at).length,
    [rows]
  );

  const markComplete = useCallback(
    async (c: string, l: string) => {
      if (!user?.id) return;
      const now = new Date().toISOString();
      // Optimistic update so the UI reacts immediately.
      setDone((prev) => new Set(prev).add(key(c, l)));
      setRows((prev) =>
        prev.some((x) => x.course_slug === c && x.lesson_slug === l)
          ? prev.map((x) =>
              x.course_slug === c && x.lesson_slug === l ? { ...x, completed_at: now } : x
            )
          : [...prev, { course_slug: c, lesson_slug: l, completed_at: now }]
      );
      await markLessonComplete(user.id, c, l);
    },
    [user?.id]
  );

  return (
    <ProgressContext.Provider value={{ rows, loading, isComplete, completedCount, markComplete }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within ProgressProvider");
  return ctx;
}
