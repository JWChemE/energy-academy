'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

/**
 * Lands the email-confirmation (and any future magic-link / recovery) redirect.
 *
 * Supabase can return here two ways depending on flow type:
 *  - PKCE:      ?code=...            → exchangeCodeForSession
 *  - Implicit:  #access_token=...    → supabase-js picks it up automatically
 *                                       (detectSessionInUrl) and fires
 *                                       onAuthStateChange
 * Either way, once a session exists we send the user to their dashboard.
 * Expired/invalid links arrive as ?error_description=... — show it kindly.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return; // avoid double-run in dev strict mode
    ran.current = true;

    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const errDesc =
      url.searchParams.get('error_description') ||
      new URLSearchParams(url.hash.replace(/^#/, '')).get('error_description');

    if (errDesc) {
      // Client-only init: the error arrives in the URL hash, unreadable during SSR.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(errDesc);
      return;
    }

    let cancelled = false;

    async function finish() {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (!cancelled) setError(error.message);
          return;
        }
      }
      // Hash-token (implicit) sessions are absorbed by supabase-js on load;
      // poll briefly for the session either way, then move on.
      for (let i = 0; i < 20; i++) {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (data.session) {
          router.replace('/dashboard');
          return;
        }
        await new Promise((r) => setTimeout(r, 250));
      }
      if (!cancelled) {
        setError(
          'We confirmed your email, but could not start a session in this browser. Please sign in.'
        );
      }
    }

    finish();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        {error ? (
          <>
            <div className="text-3xl">⚠️</div>
            <h1 className="mt-3 text-xl font-bold text-slate-900">
              That link didn&apos;t work
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
            <p className="mt-2 text-sm text-slate-500">
              Confirmation links expire after a while — signing in (or signing up
              again with the same email) will send a fresh one.
            </p>
            <Link
              href="/auth"
              className="mt-6 inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Go to sign in
            </Link>
          </>
        ) : (
          <>
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600"
              aria-hidden
            />
            <h1 className="mt-4 text-lg font-semibold text-slate-900">
              Confirming your account…
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              One moment — we&apos;re signing you in.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
