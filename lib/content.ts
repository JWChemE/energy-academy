import { promises as fs } from "fs";
import path from "path";
import {
  curriculum,
  type Course,
  type Lesson,
  type Level,
  type Module,
} from "@/content/curriculum";

const COURSES_DIR = path.join(process.cwd(), "content", "courses");

/* ----------------------------- Level helpers ----------------------------- */

export function getLevels(): Level[] {
  return curriculum;
}

export function getLevel(slug: string): Level | undefined {
  return curriculum.find((l) => l.slug === slug);
}

/* ----------------------------- Course helpers ---------------------------- */

export type CourseWithLevel = { course: Course; level: Level };

export function getCourse(slug: string): CourseWithLevel | undefined {
  for (const level of curriculum) {
    const course = level.courses.find((c) => c.slug === slug);
    if (course) return { course, level };
  }
  return undefined;
}

/** All lessons of a course, flattened across modules in reading order. */
export function getCourseLessons(course: Course): Lesson[] {
  return course.modules.flatMap((m) => m.lessons);
}

export type CourseStats = { lessonCount: number; totalMinutes: number };

export function getCourseStats(course: Course): CourseStats {
  const lessons = getCourseLessons(course);
  return {
    lessonCount: lessons.length,
    totalMinutes: lessons.reduce((sum, l) => sum + l.minutes, 0),
  };
}

/* ----------------------------- Lesson helpers ---------------------------- */

export type LessonContext = {
  level: Level;
  course: Course;
  module: Module;
  lesson: Lesson;
  /** Previous lesson in the course, or null if this is the first. */
  prev: Lesson | null;
  /** Next lesson in the course, or null if this is the last. */
  next: Lesson | null;
  /** 1-based index of this lesson within the whole course. */
  position: number;
  /** Total lessons in the course. */
  total: number;
};

export function getLessonContext(
  courseSlug: string,
  lessonSlug: string,
): LessonContext | undefined {
  const found = getCourse(courseSlug);
  if (!found) return undefined;
  const { course, level } = found;

  const flat = getCourseLessons(course);
  const position = flat.findIndex((l) => l.slug === lessonSlug);
  if (position === -1) return undefined;

  const module = course.modules.find((m) =>
    m.lessons.some((l) => l.slug === lessonSlug),
  )!;

  return {
    level,
    course,
    module,
    lesson: flat[position],
    prev: position > 0 ? flat[position - 1] : null,
    next: position < flat.length - 1 ? flat[position + 1] : null,
    position: position + 1,
    total: flat.length,
  };
}

/** Read the raw MDX source for a lesson from disk. */
export async function getLessonSource(
  courseSlug: string,
  lessonSlug: string,
): Promise<string> {
  const filePath = path.join(COURSES_DIR, courseSlug, `${lessonSlug}.mdx`);
  return fs.readFile(filePath, "utf8");
}

/* --------------------------- Static params ------------------------------- */

/** Every course slug (available and coming-soon) — for the course pages. */
export function getAllCourseParams(): { course: string }[] {
  return curriculum.flatMap((l) => l.courses.map((c) => ({ course: c.slug })));
}

/** Every lesson of every available course — for the lesson reader pages. */
export function getAllLessonParams(): { course: string; lesson: string }[] {
  return curriculum.flatMap((level) =>
    level.courses
      .filter((c) => c.status === "available")
      .flatMap((course) =>
        getCourseLessons(course).map((lesson) => ({
          course: course.slug,
          lesson: lesson.slug,
        })),
      ),
  );
}
