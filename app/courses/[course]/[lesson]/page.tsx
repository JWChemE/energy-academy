import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {
  getAllLessonParams,
  getLessonContext,
  getLessonSource,
} from "@/lib/content";
import { lessonExcerpt } from "@/lib/excerpt";
import { mdxComponents } from "@/components/mdx";
import GatedLesson from "@/components/GatedLesson";
import LessonOutline from "@/components/LessonOutline";
import LessonComplete from "@/components/LessonComplete";

type Props = { params: Promise<{ course: string; lesson: string }> };

export function generateStaticParams() {
  return getAllLessonParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { course, lesson } = await params;
  const ctx = getLessonContext(course, lesson);
  if (!ctx) return {};
  return {
    title: `${ctx.lesson.title} — ${ctx.course.title}`,
    description: ctx.lesson.summary,
    alternates: { canonical: `/courses/${course}/${lesson}` },
    openGraph: {
      title: ctx.lesson.title,
      description: ctx.lesson.summary,
      url: `/courses/${course}/${lesson}`,
      type: "article",
    },
  };
}

export default async function LessonPage({ params }: Props) {
  const { course, lesson } = await params;
  const ctx = getLessonContext(course, lesson);
  if (!ctx) notFound();

  const { level, position, total } = ctx;
  const progress = Math.round((position / total) * 100);

  // Level 1 is free and rendered statically (public, indexable). Levels 2 & 3,
  // and all Sectors, are gated: their body is fetched client-side from an
  // authenticated API, so the text is never baked into this page's HTML for
  // signed-out visitors — except a short lead-paragraph excerpt, rendered
  // statically so the page is indexable and gives visitors a real taste.
  const gated = level.kind === "sector" || level.number > 1;
  const source = gated ? null : await getLessonSource(course, lesson);
  const preview = gated ? lessonExcerpt(await getLessonSource(course, lesson)) : "";
  const levelHref = level.kind === "sector" ? `/sectors/${level.slug}` : `/levels/${level.slug}`;
  const levelLabel = level.kind === "sector" ? "Sector" : `Level ${level.number}`;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr]">
      {/* Outline sidebar */}
      <aside className="hidden lg:block">
        <LessonOutline
          courseSlug={ctx.course.slug}
          courseTitle={ctx.course.title}
          modules={ctx.course.modules}
          currentSlug={ctx.lesson.slug}
          position={position}
          total={total}
        />
      </aside>

      {/* Lesson content */}
      <article className="min-w-0">
        {/* Breadcrumb + progress */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link
            href={levelHref}
            className="hover:text-slate-900"
          >
            {levelLabel}
          </Link>
          <span>/</span>
          <Link
            href={`/courses/${ctx.course.slug}`}
            className="hover:text-slate-900"
          >
            {ctx.course.title}
          </Link>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>{ctx.module.title}</span>
            <span>
              {position} / {total}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <header className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {ctx.lesson.title}
          </h1>
          <p className="mt-3 text-lg text-slate-600">{ctx.lesson.summary}</p>
          <p className="mt-3 text-sm text-slate-400">
            {ctx.lesson.minutes} min read
            {ctx.lesson.reviewed && (
              <>
                {" · "}
                <span title="The date this content was last checked for accuracy">
                  Last reviewed{" "}
                  {new Date(ctx.lesson.reviewed).toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </p>
        </header>

        <hr className="my-8 border-slate-200" />

        <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-a:text-brand-700 prose-a:no-underline hover:prose-a:underline">
          {gated ? (
            <GatedLesson
              course={course}
              lesson={lesson}
              levelLabel={levelLabel}
              levelTitle={level.title}
              summary={ctx.lesson.summary}
              preview={preview}
            />
          ) : (
            <MDXRemote
              source={source!}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          )}
        </div>

        {/* Mark complete & continue */}
        <LessonComplete
          course={course}
          lesson={lesson}
          next={ctx.next ? { slug: ctx.next.slug, title: ctx.next.title } : null}
          courseHref={`/courses/${ctx.course.slug}`}
        />

        {/* Prev / next */}
        <nav className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:justify-between">
          {ctx.prev ? (
            <Link
              href={`/courses/${ctx.course.slug}/${ctx.prev.slug}`}
              className="group flex flex-1 flex-col rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-slate-50"
            >
              <span className="text-xs font-medium text-slate-400">
                ← Previous
              </span>
              <span className="mt-0.5 font-medium text-slate-900 group-hover:text-brand-700">
                {ctx.prev.title}
              </span>
            </Link>
          ) : (
            <span className="hidden flex-1 sm:block" />
          )}

          {ctx.next ? (
            <Link
              href={`/courses/${ctx.course.slug}/${ctx.next.slug}`}
              className="group flex flex-1 flex-col rounded-xl border border-slate-200 bg-white p-4 text-right transition-colors hover:border-brand-300 hover:bg-slate-50"
            >
              <span className="text-xs font-medium text-slate-400">
                Next →
              </span>
              <span className="mt-0.5 font-medium text-slate-900 group-hover:text-brand-700">
                {ctx.next.title}
              </span>
            </Link>
          ) : (
            <Link
              href={`/courses/${ctx.course.slug}`}
              className="group flex flex-1 flex-col rounded-xl border border-brand-200 bg-brand-50 p-4 text-right transition-colors hover:bg-brand-100"
            >
              <span className="text-xs font-medium text-brand-600">
                You finished the course 🎉
              </span>
              <span className="mt-0.5 font-medium text-brand-800">
                Back to course overview
              </span>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
