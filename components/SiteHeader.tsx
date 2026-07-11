'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/auth-context";

function BoltLogo() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
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

// Nav shorthand: one word per level, ordered as the progression
// (full titles live on the level pages themselves).
const LEVELS = [
  { slug: 'level-1', number: 1, title: 'Foundations' },
  { slug: 'level-2', number: 2, title: 'Systems' },
  { slug: 'level-3', number: 3, title: 'Leadership' },
];

const REFERENCE_LINKS = [
  { href: '/reference', title: 'Quick reference' },
  { href: '/glossary', title: 'Glossary' },
  { href: '/tools', title: 'Tools' },
];

export function SiteHeader() {
  // Signed-out links render whenever there's no user (including while the
  // session check is in flight) so Sign In is always visible immediately;
  // they swap to Dashboard/Profile the moment a session resolves.
  const { user } = useAuth();
  const pathname = usePathname();
  // Menus are "open for" a specific path, so navigating anywhere closes
  // them by derivation — no effect, no post-navigation flash.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [refOpenFor, setRefOpenFor] = useState<string | null>(null);
  const menuOpen = openFor === pathname;
  const refOpen = refOpenFor === pathname;
  const setMenuOpen = (open: boolean) => setOpenFor(open ? pathname : null);
  const setRefOpen = (open: boolean) => setRefOpenFor(open ? pathname : null);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <BoltLogo />
          <span className="whitespace-nowrap text-lg font-bold tracking-tight text-slate-900">
            Energy Academy
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LEVELS.map((level) => (
            <Link
              key={level.slug}
              href={`/levels/${level.slug}`}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {level.title}
            </Link>
          ))}
          <Link
            href="/sectors"
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Sectors
          </Link>

          {/* Reference group */}
          <div className="relative">
            <button
              onClick={() => setRefOpen(!refOpen)}
              aria-expanded={refOpen}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Reference
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className={`h-3.5 w-3.5 transition-transform ${refOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {refOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
                {REFERENCE_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/search"
            aria-label="Search"
            title="Search"
            className="flex items-center rounded-lg p-2.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-4.5 w-4.5"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {!user && (
            <>
              <Link
                href="/auth"
                className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 md:block"
              >
                Sign In
              </Link>
              <Link
                href="/courses/intro-to-energy-management"
                className="hidden rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 md:block"
              >
                Start learning
              </Link>
            </>
          )}
          {user && (
            <>
              <Link
                href="/dashboard"
                className="hidden whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 md:block"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                title={user.email}
                aria-label="Your profile"
                className="hidden h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-200 md:flex"
              >
                {(user.full_name || user.email).charAt(0).toUpperCase()}
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
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
          className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 lg:hidden"
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
          <Link
            href="/search"
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Search
          </Link>
          <Link
            href="/tools"
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Tools
          </Link>
          <Link
            href="/reference"
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Quick reference
          </Link>
          <Link
            href="/glossary"
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Glossary
          </Link>

          <div className="mt-2 border-t border-slate-100 pt-2">
            {!user && (
              <>
                <Link
                  href="/auth"
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Sign in / create free account
                </Link>
                <Link
                  href="/courses/intro-to-energy-management"
                  className="mt-1 block rounded-lg bg-brand-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Start learning
                </Link>
              </>
            )}
            {user && (
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
