"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Cookie consent banner (UK PECR / ICO compliant pattern).
 *
 * The site currently only uses strictly-necessary storage (the Supabase auth
 * session and this consent choice), which doesn't require consent. This banner
 * still informs visitors and records an accept/reject choice with EQUAL
 * prominence — and gates any future non-essential cookies (e.g. analytics) so
 * they only load after "Accept". Withdraw/change any time via the footer's
 * "Cookie preferences" link.
 */
const STORAGE_KEY = "cookie-consent";

/** Read the stored choice — usable elsewhere to gate analytics before loading it. */
export function getCookieConsent(): "accepted" | "rejected" | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "accepted" || v === "rejected" ? v : null;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Client-only init: consent lives in localStorage, unreadable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!getCookieConsent()) setVisible(true);
    const reopen = () => setVisible(true);
    window.addEventListener("energy:cookie-settings", reopen);
    return () => window.removeEventListener("energy:cookie-settings", reopen);
  }, []);

  function choose(choice: "accepted" | "rejected") {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
    // Notify listeners (ConsentedAnalytics mounts/unmounts on this signal).
    window.dispatchEvent(new CustomEvent("energy:cookie-consent", { detail: choice }));
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="text-sm leading-relaxed text-slate-600">
          <p className="font-semibold text-slate-900">We value your privacy</p>
          <p className="mt-1">
            We use cookies and similar storage that are strictly necessary to run the site and keep
            you signed in. We&apos;d only ever use non-essential cookies (such as analytics) with your
            consent — and we don&apos;t use any today. See our{" "}
            <Link href="/cookies" className="font-medium text-brand-700 hover:underline">
              Cookie Policy
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-brand-700 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => choose("rejected")}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 md:flex-none"
          >
            Reject non-essential
          </button>
          <button
            onClick={() => choose("accepted")}
            className="flex-1 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 md:flex-none"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
