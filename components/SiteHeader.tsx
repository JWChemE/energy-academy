'use client';

import Link from "next/link";
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
        </nav>

        <div className="flex items-center gap-3">
          {!loading && !user && (
            <>
              <Link
                href="/auth"
                className="hidden items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-slate-700 sm:inline-flex"
                title="Create a free account to track your progress"
              >
                🔖 Save your progress
              </Link>
              <Link
                href="/auth"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                href="/courses/intro-to-energy-management"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
              >
                Start learning
              </Link>
            </>
          )}
          {!loading && user && (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                title="Your profile"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {user.full_name?.split(" ")[0] || user.email}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
