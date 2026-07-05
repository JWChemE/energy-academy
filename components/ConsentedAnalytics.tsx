"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { getCookieConsent } from "@/components/CookieConsent";

/**
 * Vercel Web Analytics, mounted only after the visitor accepts non-essential
 * cookies in the consent banner.
 *
 * The analytics itself is cookieless and first-party (script and beacon are
 * served from this site's own origin under /_vercel/insights/, so no CSP
 * change is needed), but the Cookie and Privacy policies promise that any
 * analytics loads only after "Accept all", so we honour that promise here.
 *
 * Listens for the banner's "energy:cookie-consent" event so a choice made in
 * this tab applies immediately, and re-checks on the cross-tab storage event.
 */
export default function ConsentedAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () => setConsented(getCookieConsent() === "accepted");
    check();
    window.addEventListener("energy:cookie-consent", check);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("energy:cookie-consent", check);
      window.removeEventListener("storage", check);
    };
  }, []);

  if (!consented) return null;
  return <Analytics />;
}
