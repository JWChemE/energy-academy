import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSector, getSectors } from "@/lib/content";
import { CourseCard } from "@/components/CourseCard";

type Props = { params: Promise<{ sector: string }> };

export function generateStaticParams() {
  return getSectors().map((s) => ({ sector: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector: slug } = await params;
  const sector = getSector(slug);
  if (!sector) return {};
  return {
    title: `Sector: ${sector.title}`,
    description: sector.description,
  };
}

export default async function SectorPage({ params }: Props) {
  const { sector: slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();

  const sectors = getSectors();
  const availableCount = sector.courses.filter((c) => c.status === "available").length;

  return (
    <div>
      {/* Banner */}
      <section className={`border-b border-slate-200 ${sector.accent.softBg}`}>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <Link href="/sectors" className="text-sm font-medium text-slate-500 hover:text-slate-900">
            ← All sectors
          </Link>
          <div className="mt-4 flex items-center gap-4">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${sector.accent.badge}`}
            >
              🏭
            </span>
            <div>
              <div className="text-sm font-medium uppercase tracking-wide text-slate-500">
                Sector · {sector.tagline}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">{sector.title}</h1>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">{sector.description}</p>
          <p className="mt-4 text-sm text-slate-500">
            {sector.courses.length} course{sector.courses.length === 1 ? "" : "s"} · {availableCount} available now
          </p>
        </div>
      </section>

      {/* Courses */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sector.courses.map((course) => (
            <CourseCard key={course.slug} course={course} level={sector} />
          ))}
        </div>
      </section>

      {/* Sector switcher */}
      {sectors.length > 1 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="flex flex-wrap gap-3">
            {sectors
              .filter((s) => s.slug !== sector.slug)
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/sectors/${s.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${s.accent.badge}`}
                  >
                    🏭
                  </span>
                  Go to {s.title} →
                </Link>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
