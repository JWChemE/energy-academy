import Link from "next/link";
import { getLevels } from "@/lib/content";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

/** Dark pine footer — the one dark moment on every page; content stays light. */
export function SiteFooter() {
  const levels = getLevels();

  return (
    <footer className="mt-20 bg-pine-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="text-base font-bold tracking-tight text-white">
            Energy Academy
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Learn energy management across three tiers — from first principles
            to leadership.
          </p>
        </div>

        {levels.map((level) => (
          <div key={level.slug}>
            <Link
              href={`/levels/${level.slug}`}
              className="text-sm font-semibold text-white hover:text-brand-300"
            >
              Level {level.number}: {level.title}
            </Link>
            <ul className="mt-3 space-y-2">
              {level.courses.slice(0, 5).map((course) => (
                <li key={course.slug}>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {course.title}
                  </Link>
                </li>
              ))}
              {level.courses.length > 5 && (
                <li className="text-sm text-slate-500">
                  +{level.courses.length - 5} more
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>
            © {new Date().getFullYear()} Energy Academy · Written by{" "}
            <Link href="/about" className="transition-colors hover:text-white">
              Jacob Willis
            </Link>
          </span>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/about" className="transition-colors hover:text-white">
              About
            </Link>
            <Link href="/search" className="transition-colors hover:text-white">
              Search
            </Link>
            <Link href="/tools" className="transition-colors hover:text-white">
              Tools
            </Link>
            <Link href="/reference" className="transition-colors hover:text-white">
              Quick Reference
            </Link>
            <Link href="/glossary" className="transition-colors hover:text-white">
              Glossary
            </Link>
            <Link
              href="/resources/energy-audit-checklist"
              className="transition-colors hover:text-white"
            >
              Free Audit Checklist
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Use
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="transition-colors hover:text-white">
              Cookie Policy
            </Link>
            <CookiePreferencesButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}
