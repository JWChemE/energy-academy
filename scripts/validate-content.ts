/**
 * Content validator — the platform's invariants as executable checks, run
 * before every build (`npm run validate`, wired into `npm run build` and CI).
 *
 * Each check exists because its failure mode has either already happened or
 * would ship silently:
 *   1. Curriculum structure   — unique slugs, valid categories, sane nesting
 *                               (a sector-merge bug once filed Food
 *                               Manufacturing inside the CRE sector).
 *   2. Lesson files           — every curriculum lesson has an MDX file, and
 *                               every MDX file has a curriculum entry.
 *   3. Internal links         — every /courses/... link in MDX resolves.
 *   4. Quiz wiring            — every <Quiz id> exists in the registry and
 *                               every registry entry is referenced somewhere.
 *   5. FAQ wiring             — same, for <FAQList id>, course faqId and
 *                               lesson faqId. Gated lessons must not embed
 *                               <FAQList> in their MDX: the body never
 *                               reaches signed-out visitors or crawlers, so
 *                               the FAQs (and their FAQPage schema) would be
 *                               invisible exactly where they matter. Use the
 *                               lesson's faqId, rendered outside the gate.
 *   6. Quiz no-tells rules    — answers must not be predictable by position
 *                               or by option length (style guide, bullet 8).
 *   7. House style            — no em-dashes in lesson prose (style guide,
 *                               bullet 9); reviewed dates are valid ISO.
 *   8. Reviewed-age warnings  — regulation-sensitive content older than 12
 *                               months is flagged (warning, not failure).
 */

import fs from "node:fs";
import path from "node:path";
import { curriculum, sectors, SECTOR_CATEGORIES, type Course, type Level } from "../content/curriculum";
import { isGated } from "../lib/content";
import { quizzes } from "../content/quizzes";
import { faqs } from "../content/faqs";

const ROOT = path.join(__dirname, "..");
const COURSES_DIR = path.join(ROOT, "content", "courses");

const errors: string[] = [];
const warnings: string[] = [];
const fail = (msg: string) => errors.push(msg);
const warn = (msg: string) => warnings.push(msg);

const allLevels: Level[] = [...curriculum, ...sectors];
const allCourses: { level: Level; course: Course }[] = allLevels.flatMap((level) =>
  level.courses.map((course) => ({ level, course })),
);

// ---------------------------------------------------------------- 1. structure
{
  const levelSlugs = new Set<string>();
  for (const level of allLevels) {
    if (levelSlugs.has(level.slug)) fail(`duplicate level/sector slug: ${level.slug}`);
    levelSlugs.add(level.slug);
    if (level.kind === "sector") {
      if (!SECTOR_CATEGORIES.some((c) => c.id === level.category))
        fail(`sector ${level.slug} has unknown category "${level.category}"`);
    }
  }

  const courseSlugs = new Set<string>();
  for (const { level, course } of allCourses) {
    if (courseSlugs.has(course.slug)) fail(`duplicate course slug: ${course.slug}`);
    courseSlugs.add(course.slug);
    if (course.status === "available" && course.modules.length === 0)
      fail(`available course ${course.slug} has no modules`);

    const lessonSlugs = new Set<string>();
    for (const mod of course.modules) {
      if (mod.lessons.length === 0) fail(`module ${course.slug}/${mod.slug} has no lessons`);
      for (const lesson of mod.lessons) {
        if (lessonSlugs.has(lesson.slug))
          fail(`duplicate lesson slug in ${course.slug}: ${lesson.slug}`);
        lessonSlugs.add(lesson.slug);
        if (lesson.reviewed && !/^\d{4}-\d{2}-\d{2}$/.test(lesson.reviewed))
          fail(`${course.slug}/${lesson.slug}: reviewed "${lesson.reviewed}" is not YYYY-MM-DD`);
      }
    }
    void level;
  }
}

// ------------------------------------------------------- 2. lesson files ↔ manifest
const manifestLessons = new Set<string>(); // "course/lesson"
for (const { course } of allCourses) {
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      const key = `${course.slug}/${lesson.slug}`;
      manifestLessons.add(key);
      const file = path.join(COURSES_DIR, course.slug, `${lesson.slug}.mdx`);
      if (!fs.existsSync(file)) fail(`missing MDX file for curriculum lesson: ${key}`);
    }
  }
}
for (const dir of fs.readdirSync(COURSES_DIR)) {
  const full = path.join(COURSES_DIR, dir);
  if (!fs.statSync(full).isDirectory()) continue;
  for (const f of fs.readdirSync(full)) {
    if (!f.endsWith(".mdx")) continue;
    const key = `${dir}/${f.replace(/\.mdx$/, "")}`;
    if (!manifestLessons.has(key)) fail(`orphan MDX file with no curriculum entry: ${key}`);
  }
}

// ------------------------------------------------- 3–5, 7. per-file MDX checks
const courseDirs = new Set(allCourses.map(({ course }) => course.slug));
const quizIdsUsed = new Set<string>();
const faqIdsUsed = new Set<string>();
const oneYearAgo = new Date(Date.now() - 365 * 24 * 3600 * 1000);

for (const { level, course } of allCourses) {
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      const key = `${course.slug}/${lesson.slug}`;

      if (lesson.faqId) {
        faqIdsUsed.add(lesson.faqId);
        if (!faqs[lesson.faqId])
          fail(`${key}: faqId "${lesson.faqId}" not in content/faqs.ts`);
      }

      const file = path.join(COURSES_DIR, course.slug, `${lesson.slug}.mdx`);
      if (!fs.existsSync(file)) continue;
      const src = fs.readFileSync(file, "utf8");

      // 3. internal links
      for (const m of src.matchAll(/\]\(\/courses\/([a-z0-9-]+)\/([a-z0-9-]+)\)/g)) {
        if (!manifestLessons.has(`${m[1]}/${m[2]}`))
          fail(`${key}: broken lesson link ${m[0]}`);
      }
      for (const m of src.matchAll(/\]\(\/courses\/([a-z0-9-]+)\)/g)) {
        if (!courseDirs.has(m[1])) fail(`${key}: broken course link ${m[0]}`);
      }

      // 4–5. quiz / FAQ ids
      for (const m of src.matchAll(/<Quiz id="([a-z0-9-]+)"/g)) {
        quizIdsUsed.add(m[1]);
        if (!quizzes[m[1]]) fail(`${key}: <Quiz id="${m[1]}"> not in content/quizzes.ts`);
      }
      for (const m of src.matchAll(/<FAQList id="([a-z0-9-]+)"/g)) {
        faqIdsUsed.add(m[1]);
        if (!faqs[m[1]]) fail(`${key}: <FAQList id="${m[1]}"> not in content/faqs.ts`);
        if (isGated(level))
          fail(
            `${key}: <FAQList> inside a gated lesson body is invisible to ` +
              `signed-out visitors and crawlers; set faqId on the lesson's ` +
              `curriculum entry instead (rendered outside the gate)`,
          );
      }

      // 7. house style: no em-dashes in lesson prose
      if (src.includes("—")) fail(`${key}: contains em-dash (style guide bullet 9)`);

      // 8. reviewed-age warning
      if (lesson.reviewed && new Date(lesson.reviewed) < oneYearAgo)
        warn(`${key}: reviewed ${lesson.reviewed} is over 12 months old`);
    }
  }
  if (course.faqId) {
    faqIdsUsed.add(course.faqId);
    if (!faqs[course.faqId]) fail(`course ${course.slug}: faqId "${course.faqId}" not in content/faqs.ts`);
  }
}

// orphaned registry entries
for (const id of Object.keys(quizzes)) {
  if (!quizIdsUsed.has(id)) fail(`quiz registry entry "${id}" is referenced by no lesson`);
}
for (const id of Object.keys(faqs)) {
  if (!faqIdsUsed.has(id)) fail(`FAQ registry entry "${id}" is referenced by nothing`);
}

// ------------------------------------------------------------- 6. quiz no-tells
for (const [id, questions] of Object.entries(quizzes)) {
  if (questions.length === 0) {
    fail(`quiz "${id}" has no questions`);
    continue;
  }
  const positions = new Set<number>();
  let strictlyLongestWithMargin = 0;
  for (const [i, q] of questions.entries()) {
    if (q.answer < 0 || q.answer >= q.options.length)
      fail(`quiz "${id}" Q${i + 1}: answer index ${q.answer} out of range`);
    positions.add(q.answer);
    const lens = q.options.map((o) => o.length);
    const ans = lens[q.answer];
    const rest = lens.filter((_, j) => j !== q.answer);
    if (ans === Math.max(...lens) && lens.filter((l) => l === ans).length === 1) {
      const margin = (ans - Math.max(...rest)) / ans;
      if (margin >= 0.1) strictlyLongestWithMargin++;
    }
    if (q.options.some((o) => o.includes("—")) || q.question.includes("—"))
      fail(`quiz "${id}" Q${i + 1}: em-dash in question/options`);
  }
  if (questions.length >= 4 && positions.size === 1)
    fail(`quiz "${id}": every answer is in position ${[...positions][0]} (position tell)`);
  if (strictlyLongestWithMargin / questions.length > 0.4)
    fail(
      `quiz "${id}": ${strictlyLongestWithMargin}/${questions.length} answers are the strictly ` +
        `longest option by a >=10% margin (length tell; style guide bullet 8)`,
    );
}

// ---------------------------------------------------------------------- report
if (warnings.length) {
  console.warn(`\ncontent validation: ${warnings.length} warning(s)`);
  for (const w of warnings) console.warn(`  ⚠ ${w}`);
}
if (errors.length) {
  console.error(`\ncontent validation FAILED: ${errors.length} error(s)`);
  for (const e of errors) console.error(`  ✖ ${e}`);
  process.exit(1);
}
console.log(
  `content validation OK: ${manifestLessons.size} lessons, ${Object.keys(quizzes).length} quizzes, ` +
    `${Object.keys(faqs).length} FAQ sets across ${allCourses.length} courses`,
);
