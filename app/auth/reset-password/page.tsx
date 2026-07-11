'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/auth-context';

/**
 * Lands the password-recovery email's link and lets the user choose a new
 * password. The recovery link itself signs the user in (a limited recovery
 * session): PKCE arrives as ?code=…, implicit as #access_token=… which
 * supabase-js absorbs automatically — same dual handling as /auth/callback.
 * Once a session exists, updateUser({ password }) completes the reset.
 */

type Stage = 'verifying' | 'form' | 'done' | 'link-error';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [stage, setStage] = useState<Stage>('verifying');
  const [linkError, setLinkError] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
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
      setLinkError(errDesc);
      setStage('link-error');
      return;
    }

    let cancelled = false;

    async function establishSession() {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (!cancelled) {
            setLinkError(error.message);
            setStage('link-error');
          }
          return;
        }
      }
      // Hash-token (implicit) sessions are absorbed by supabase-js on load;
      // poll briefly for the session either way.
      for (let i = 0; i < 20; i++) {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (data.session) {
          setStage('form');
          return;
        }
        await new Promise((r) => setTimeout(r, 250));
      }
      if (!cancelled) {
        setLinkError(
          'This reset link has expired or was already used. Request a fresh one from the sign-in page.'
        );
        setStage('link-error');
      }
    }

    establishSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Please use a password of at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('The two passwords don’t match.');
      return;
    }
    setSaving(true);
    try {
      await updatePassword(password);
      setStage('done');
      setTimeout(() => router.replace('/dashboard'), 2000);
    } catch (err) {
      const m = err instanceof Error ? err.message : '';
      setError(
        m.toLowerCase().includes('different from the old')
          ? 'That’s your current password — choose a different one.'
          : m || 'Something went wrong. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-brand-50 via-white to-white p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {stage === 'verifying' && (
          <div className="text-center">
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600"
              aria-hidden
            />
            <h1 className="mt-4 text-lg font-semibold text-slate-900">
              Checking your reset link…
            </h1>
          </div>
        )}

        {stage === 'link-error' && (
          <div className="text-center">
            <div className="text-3xl">⚠️</div>
            <h1 className="mt-3 text-xl font-bold text-slate-900">
              That link didn&apos;t work
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">{linkError}</p>
            <Link
              href="/auth"
              className="mt-6 inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Back to sign in
            </Link>
          </div>
        )}

        {stage === 'form' && (
          <>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Choose a new password
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              You&apos;re verified — set the new password for your account below.
            </p>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  autoFocus
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-500"
                />
                <p className="mt-1 text-xs text-slate-400">At least 8 characters.</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-brand-600 py-2.5 font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Set new password'}
              </button>
            </form>
          </>
        )}

        {stage === 'done' && (
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-2xl">
              ✓
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
              Password updated
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              You&apos;re signed in — taking you to your dashboard…
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Go to dashboard now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
