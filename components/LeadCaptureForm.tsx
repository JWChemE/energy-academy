"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Lead-magnet capture form. The wording IS the consent record: subscribing to
 * the newsletter is the single, explicit purpose, and the resource is what
 * you get for it. The exact consent text is stored alongside the email.
 * On success the parent's gated content is revealed via the callback.
 */
const CONSENT_TEXT =
  "Send me the resource and the Energy Academy newsletter — occasional energy-management tips and course updates. Unsubscribe any time.";

export default function LeadCaptureForm({
  source,
  onUnlocked,
}: {
  source: string;
  onUnlocked: () => void;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, consentText: CONSENT_TEXT }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong — please try again.");
        setState("error");
        return;
      }
      setState("done");
      onUnlocked();
    } catch {
      setError("Something went wrong — please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">
        <strong>You&apos;re in.</strong> The checklist is unlocked below — bookmark this page or use
        your browser&apos;s print function to save it as a PDF.
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-bold text-slate-900">Get the full checklist</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">{CONSENT_TEXT}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.co.uk"
          autoComplete="email"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-transparent focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {state === "loading" ? "One moment…" : "Send it to me"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-3 text-xs text-slate-400">
        We only use your email for the newsletter you&apos;re subscribing to. Full details in our{" "}
        <Link href="/privacy" className="text-brand-700 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
