import type { Metadata } from "next";
import Link from "next/link";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "The cookies and similar storage Energy Academy uses, and how to manage them.",
};

// NOTE FOR THE OWNER: keep this accurate. It currently reflects a site that uses
// only strictly-necessary storage and no analytics. If you add analytics or
// other non-essential cookies, list them here and make sure they only load
// after the visitor accepts.

export default function CookiePolicy() {
  return (
    <article className="prose prose-slate mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1>Cookie Policy</h1>
      <p className="text-sm text-slate-500">Last updated: [ADD DATE]</p>

      <p>
        This policy explains how Energy Academy uses cookies and similar technologies (such as your
        browser&apos;s local storage). For how we handle personal data more generally, see our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>What these technologies are</h2>
      <p>
        Cookies and local storage are small pieces of information saved in your browser. Some are{" "}
        <strong>strictly necessary</strong> to run a website and don&apos;t require consent under UK
        rules (PECR). Others — like analytics or advertising — are{" "}
        <strong>non-essential</strong> and only load if you agree to them.
      </p>

      <h2>What we use today</h2>
      <p>We only use strictly-necessary storage:</p>
      <div className="not-prose overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Type</th>
              <th className="py-2 pr-4 font-medium">Purpose</th>
              <th className="py-2 font-medium">Retention</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            <tr className="border-b border-slate-100">
              <td className="py-2 pr-4 font-mono text-xs">supabase auth token</td>
              <td className="py-2 pr-4">Local storage (necessary)</td>
              <td className="py-2 pr-4">Keeps you signed in to your account.</td>
              <td className="py-2">Until you sign out / it expires</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2 pr-4 font-mono text-xs">cookie-consent</td>
              <td className="py-2 pr-4">Local storage (necessary)</td>
              <td className="py-2 pr-4">Remembers your cookie choice so we don&apos;t ask again.</td>
              <td className="py-2">Until you clear it</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Analytics and other non-essential cookies</h2>
      <p>
        We <strong>do not currently use</strong> any analytics, advertising or other non-essential
        cookies. If we add them in future, they will only be set after you select{" "}
        <strong>Accept</strong> in our cookie banner, and we&apos;ll list them here.
      </p>

      <h2>Managing your choice</h2>
      <p>
        You can change or withdraw your choice at any time:{" "}
        <span className="font-medium text-brand-700">
          <CookiePreferencesButton />
        </span>
        . You can also block or delete cookies and local storage in your browser settings, though the
        Service may not work properly without the strictly-necessary items above.
      </p>
    </article>
  );
}
