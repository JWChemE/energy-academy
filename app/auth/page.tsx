'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, type CommsChoices } from '@/app/auth-context';
import { COMMS_STREAMS } from '@/lib/profileOptions';

/**
 * Sign in / sign up.
 *
 * Sign-up runs in two steps: (1) account details, (2) a dedicated
 * communication-preferences screen — each of the four streams is a separate,
 * freely-given, unticked choice (UK GDPR/PECR), with "skip" given equal
 * prominence. The account is only created at the end of step 2, so the
 * consent choices ride along in the signup metadata and are captured by the
 * handle_new_user trigger with a full audit trail.
 */

type Mode = 'signin' | 'signup';
type SignupStep = 'details' | 'comms' | 'done';

const EMPTY_COMMS: CommsChoices = {
  comms_updates: false,
  comms_newsletter: false,
  comms_consulting: false,
  comms_events: false,
};

/** Map raw Supabase errors to something a human can act on. */
function friendlyError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials'))
    return 'Email or password is incorrect. If you signed up but never confirmed your email, check your inbox for the confirmation link.';
  if (m.includes('already registered'))
    return 'An account with this email already exists — try signing in instead.';
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Too many attempts — please wait a minute and try again.';
  if (m.includes('email not confirmed'))
    return 'Your email address hasn’t been confirmed yet. Check your inbox for the confirmation link.';
  return message || 'Something went wrong. Please try again.';
}

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin');
  const [step, setStep] = useState<SignupStep>('details');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading, signUp, signIn } = useAuth();
  const router = useRouter();

  // Already signed in? Straight to the dashboard.
  useEffect(() => {
    if (!authLoading && user && step !== 'done') router.replace('/dashboard');
  }, [authLoading, user, step, router]);

  function switchMode(next: Mode) {
    setMode(next);
    setStep('details');
    setError('');
  }

  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (mode === 'signin') {
      setLoading(true);
      try {
        await signIn(email, password);
        router.push('/dashboard');
      } catch (err) {
        setError(friendlyError(err instanceof Error ? err.message : ''));
      } finally {
        setLoading(false);
      }
      return;
    }

    // Sign-up step 1 → validate locally, then move to the comms step.
    if (password.length < 8) {
      setError('Please use a password of at least 8 characters.');
      return;
    }
    setStep('comms');
  }

  async function createAccount(chosen: CommsChoices) {
    setError('');
    setLoading(true);
    try {
      await signUp(email, password, fullName, chosen);
      setStep('done');
    } catch (err) {
      setError(friendlyError(err instanceof Error ? err.message : ''));
      // Send them back to the details step for "already registered" etc.
      setStep('details');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-brand-50 via-white to-sky-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {mode === 'signup' && step === 'done' ? (
          <ConfirmEmailScreen email={email} />
        ) : mode === 'signup' && step === 'comms' ? (
          <CommsStep loading={loading} error={error} onBack={() => setStep('details')} onFinish={createAccount} />
        ) : (
          <>
            <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900">
              Energy Academy
            </h1>
            <p className="mb-6 mt-1 text-center text-slate-600">
              {mode === 'signup' ? 'Create a free account' : 'Sign in to continue'}
            </p>

            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={mode === 'signup' ? 8 : undefined}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-brand-500"
                />
                {mode === 'signup' && (
                  <p className="mt-1 text-xs text-slate-400">At least 8 characters.</p>
                )}
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-brand-600 py-2.5 font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
              >
                {loading ? 'Loading…' : mode === 'signup' ? 'Continue' : 'Sign in'}
              </button>
            </form>

            <button
              onClick={() => switchMode(mode === 'signup' ? 'signin' : 'signup')}
              className="mt-4 w-full text-center text-sm text-brand-700 hover:text-brand-800"
            >
              {mode === 'signup'
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up free"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/** Sign-up step 2 — a deliberate, unbundled comms-consent screen. */
function CommsStep({
  loading,
  error,
  onBack,
  onFinish,
}: {
  loading: boolean;
  error: string;
  onBack: () => void;
  onFinish: (chosen: CommsChoices) => void;
}) {
  const [chosen, setChosen] = useState<CommsChoices>(EMPTY_COMMS);
  const anyChosen = Object.values(chosen).some(Boolean);

  function toggle(key: keyof CommsChoices) {
    setChosen((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
        Step 2 of 2 — optional
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
        Want to hear from us?
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Choose exactly what lands in your inbox — or nothing at all. Every choice
        is optional, doesn&apos;t affect your access, and can be changed or
        withdrawn any time in your profile. See our{' '}
        <Link href="/privacy" className="font-medium text-brand-700 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <div className="mt-5 space-y-2">
        {COMMS_STREAMS.map((s) => (
          <label
            key={s.key}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
              chosen[s.key]
                ? 'border-brand-400 bg-brand-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <input
              type="checkbox"
              checked={chosen[s.key]}
              onChange={() => toggle(s.key)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>
              <span className="block text-sm font-semibold text-slate-800">{s.label}</span>
              <span className="block text-xs leading-5 text-slate-500">{s.description}</span>
            </span>
          </label>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Both paths carry equal visual weight — consent must be freely given. */}
      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          onClick={() => onFinish(EMPTY_COMMS)}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'No emails — just my account'}
        </button>
        <button
          onClick={() => onFinish(chosen)}
          disabled={loading}
          className="rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? 'Creating…' : anyChosen ? 'Create account with these emails' : 'Create account'}
        </button>
      </div>

      <button
        onClick={onBack}
        disabled={loading}
        className="mt-3 w-full text-center text-sm text-slate-400 hover:text-slate-600"
      >
        ← Back to details
      </button>
    </div>
  );
}

/** Post-signup: a clear "check your inbox" state (not an error box). */
function ConfirmEmailScreen({ email }: { email: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-2xl">
        ✉️
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        Check your inbox
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        We&apos;ve sent a confirmation link to{' '}
        <span className="font-semibold text-slate-900">{email}</span>. Click it to
        activate your account — it signs you straight in.
      </p>
      <p className="mt-3 text-xs text-slate-400">
        Nothing arrived after a few minutes? Check your spam folder, or sign up
        again to resend the link.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Back to the homepage
      </Link>
    </div>
  );
}
