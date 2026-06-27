"use client";

/** Footer link that re-opens the cookie consent banner so users can change or
 *  withdraw their choice at any time (an ICO requirement). */
export default function CookiePreferencesButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("energy:cookie-settings"))}
      className="text-slate-400 transition-colors hover:text-slate-700"
    >
      Cookie preferences
    </button>
  );
}
