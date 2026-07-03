'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/auth-context";

function BoltLogo() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-teal-600 text-white shadow-sm">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M13 2 4.5 13.5H11l-1 8.5 9-12h-6.5L13 2Z" />
      </svg>
    </span>
  );
}

const LEVELS = [
  { slug: 'level-1', number: 1, title: 'Foundations' },
  { slug: 'level-2', number: 2, title: 'System Deep Dives' },
  { slug: 'level-3', number: 3, title: 'Leadership' },
];

export function SiteHeader() {
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <BoltLogo />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Energy Academy
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LEVELS.map((level) => (
            <Link
              key={level.slug}
              href={`/levels/${level.slug}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <span className="text-slate-400">L{level.number}</span>{" "}
              {level.title}
            </Link>
          ))}
          <Link
            href="/sectors"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <span className="text-slate-400">🏭</span> Sectors
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {!loading && !user && (
            <>
              <Link
                href="/auth"
                className="hidden items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-slate-700 lg:inline-flex"
                title="Create a free account to track your progress"
              >
                🔖 Save your progress
              </Link>
              <Link
                href="/auth"
                className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 md:block"
              >
                Sign In
              </Link>
              <Link
                href="/courses/intro-to-energy-management"
                className="hidden rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 md:block"
              >
                Start learning
              </Link>
            </>
          )}
          {!loading && user && (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 md:block"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                title="Your profile"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 md:block"
              >
                {user.full_name?.split(" ")[0] || user.email}
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-6 w-6" aria-hidden>
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 md:hidden"
        >
          {LEVELS.map((level) => (
            <Link
              key={level.slug}
              href={`/levels/${level.slug}`}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <span className="text-slate-400">Level {level.number}</span>{" "}
              {level.title}
            </Link>
          ))}
          <Link
            href="/sectors"
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Sectors
          </Link>

          <div className="mt-2 border-t border-slate-100 pt-2">
            {!loading && !user && (
              <>
                <Link
                  href="/auth"
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Sign in / create free account
                </Link>
                <Link
                  href="/courses/intro-to-energy-management"
                  className="mt-1 block rounded-lg bg-slate-900 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-slate-700"
                >
                  Start learning
                </Link>
              </>
            )}
            {!loading && user && (
              <>
                <Link
                  href="/dashboard"
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Profile ({user.full_name?.split(" ")[0] || user.email})
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
