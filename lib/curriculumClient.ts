/**
 * Client-safe curriculum helpers.
 *
 * lib/content.ts imports `fs` (it reads MDX from disk), so it can't be used in
 * client components. This module imports only the pure `curriculum` manifest, so
 * progress tracking and the dashboard can compute totals, next lessons, etc. in
 * the browser.
 */

import { curriculum } from "@/content/curriculum";
import type { Course, Level, Lesson } from "@/content/curriculum";

export function findCourse(slug: string): { course: Course; level: Level } | null {
  for (const level of curriculum) {
    const course = level.courses.find((c) => c.slug === slug);
    if (course) return { course, level };
  }
  return null;
}

export function courseLessons(course: Course): Lesson[] {
  return course.modules.flatMap((m) => m.lessons);
}

export function courseLessonCount(slug: string): number {
  const f = findCourse(slug);
  return f ? courseLessons(f.course).length : 0;
}

export function lessonTitle(courseSlug: string, lessonSlug: string): string | null {
  const f = findCourse(courseSlug);
  if (!f) return null;
  return courseLessons(f.course).find((l) => l.slug === lessonSlug)?.title ?? null;
}

export interface LessonRef {
  course: string;
  courseTitle: string;
  lesson: string;
  title: string;
}

/** The next lesson after `lessonSlug` within the same course, or null at the end. */
export function nextLessonInCourse(courseSlug: string, lessonSlug: string): LessonRef | null {
  const f = findCourse(courseSlug);
  if (!f) return null;
  const flat = courseLessons(f.course);
  const i = flat.findIndex((l) => l.slug === lessonSlug);
  if (i === -1 || i >= flat.length - 1) return null;
  const n = flat[i + 1];
  return { course: courseSlug, courseTitle: f.course.title, lesson: n.slug, title: n.title };
}

export function firstLesson(courseSlug: string): LessonRef | null {
  const f = findCourse(courseSlug);
  if (!f) return null;
  const flat = courseLessons(f.course);
  if (flat.length === 0) return null;
  return { course: courseSlug, courseTitle: f.course.title, lesson: flat[0].slug, title: flat[0].title };
}

/** First lesson in the course not present in `completed` (set of `course/lesson`). */
export function firstIncompleteLesson(courseSlug: string, completed: Set<string>): LessonRef | null {
  const f = findCourse(courseSlug);
  if (!f) return null;
  const flat = courseLessons(f.course);
  const n = flat.find((l) => !completed.has(`${courseSlug}/${l.slug}`));
  if (!n) return null;
  return { course: courseSlug, courseTitle: f.course.title, lesson: n.slug, title: n.title };
}

export function availableCourses(): { course: Course; level: Level }[] {
  return curriculum.flatMap((level) =>
    level.courses
      .filter((c) => c.status === "available")
      .map((course) => ({ course, level }))
  );
}
