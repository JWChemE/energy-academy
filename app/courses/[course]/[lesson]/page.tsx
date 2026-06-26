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
import { mdxComponents } from "@/components/mdx";

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
  };
}

export default async function LessonPage({ params }: Props) {
  const { course, lesson } = await params;
  const ctx = getLessonContext(course, lesson);
  if (!ctx) notFound();

  const source = await getLessonSource(course, lesson);
  const { level, position, total } = ctx;
  const progress = Math.round((position / total) * 100);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr]">
      {/* Outline sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <Link
            href={`/courses/${ctx.course.slug}`}
            className="text-sm font-semibold text-slate-900 hover:text-brand-700"
          >
            {ctx.course.title}
          </Link>
          <p className="mt-1 text-xs text-slate-400">
            Lesson {position} of {total}
          </p>
          <nav className="mt-4 space-y-5">
            {ctx.course.modules.map((m) => (
              <div key={m.slug}>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {m.title}
                </div>
                <ul className="space-y-1 border-l border-slate-200">
                  {m.lessons.map((l) => {
                    const current = l.slug === ctx.lesson.slug;
                    return (
                      <li key={l.slug}>
                        <Link
                          href={`/courses/${ctx.course.slug}/${l.slug}`}
                          className={`-ml-px block border-l-2 py-1 pl-3 text-sm transition-colors ${
                            current
                              ? "border-brand-500 font-medium text-brand-700"
                              : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900"
                          }`}
                        >
                          {l.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Lesson content */}
      <article className="min-w-0">
        {/* Breadcrumb + progress */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link
            href={`/levels/${level.slug}`}
            className="hover:text-slate-900"
          >
            Level {level.number}
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
          </p>
        </header>

        <hr className="my-8 border-slate-200" />

        <div className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-a:text-brand-700 prose-a:no-underline hover:prose-a:underline">
          <MDXRemote
            source={source}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>

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
