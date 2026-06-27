import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Energy Academy collects, uses and protects your personal data under UK GDPR.",
};

// NOTE FOR THE OWNER: this is a template covering the standard UK GDPR / Data
// Protection Act 2018 requirements. Replace every [BRACKETED] placeholder with
// your real details and have it reviewed before you rely on it. It is not legal
// advice.

export default function PrivacyPolicy() {
  return (
    <article className="prose prose-slate mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-slate-500">Last updated: [ADD DATE]</p>

      <p>
        This policy explains how <strong>[YOUR ORGANISATION NAME]</strong> (&quot;we&quot;,
        &quot;us&quot;) collects and uses your personal data when you use Energy Academy (the
        &quot;Service&quot;), and your rights under the UK General Data Protection Regulation (UK GDPR)
        and the Data Protection Act 2018.
      </p>

      <h2>Who we are</h2>
      <p>
        The data controller for your personal data is <strong>[YOUR ORGANISATION NAME]</strong>,
        [REGISTERED ADDRESS]. You can contact us about privacy at{" "}
        <strong>[PRIVACY CONTACT EMAIL]</strong>. [If applicable: our ICO registration number is
        [ICO NUMBER].]
      </p>

      <h2>The data we collect</h2>
      <ul>
        <li>
          <strong>Account data</strong> — your name and email address when you create an account. Your
          password is handled by our authentication provider; we never see or store it in plain text.
        </li>
        <li>
          <strong>Learning data</strong> — which lessons you mark complete and your quiz/exercise
          results, so we can show your progress.
        </li>
        <li>
          <strong>Technical data</strong> — strictly-necessary local storage to keep you signed in and
          to remember your cookie choice. See our{" "}
          <Link href="/cookies">Cookie Policy</Link>.
        </li>
        <li>
          <strong>Communications</strong> — any messages you send us (e.g. support requests).
        </li>
      </ul>
      <p>We do not knowingly collect special-category data, and the Service is not directed at children.</p>

      <h2>How we use your data, and our lawful bases</h2>
      <ul>
        <li>
          <strong>To provide the Service</strong> (create and run your account, save your progress) —
          lawful basis: <em>performance of a contract</em> with you.
        </li>
        <li>
          <strong>To keep the Service secure and working</strong> (authentication, preventing abuse) —
          lawful basis: <em>our legitimate interests</em> in operating a secure service.
        </li>
        <li>
          <strong>To remember your preferences</strong> (e.g. cookie choice) — lawful basis:{" "}
          <em>legal obligation / your consent</em> as applicable.
        </li>
        <li>
          <strong>To respond to you</strong> when you contact us — lawful basis:{" "}
          <em>legitimate interests</em>.
        </li>
      </ul>
      <p>
        We do not currently use analytics, advertising or other non-essential tracking. If we ever do,
        we will ask for your consent first and update this policy.
      </p>

      <h2>Who we share it with</h2>
      <p>We use trusted service providers who process data on our behalf, under contract:</p>
      <ul>
        <li>
          <strong>Supabase</strong> — database and authentication (stores your account and learning
          data). Hosting region: West EU (Ireland), <code>eu-west-1</code>.
        </li>
        <li>
          <strong>Vercel</strong> — website hosting and delivery.
        </li>
      </ul>
      <p>
        We do not sell your personal data. We only disclose it to others where required by law.
      </p>

      <h2>International data transfers</h2>
      <p>
        Some of your personal data is stored and processed in the European Economic Area (EEA) — our
        database and authentication provider, Supabase, hosts your data in Ireland. The EEA is covered
        by the UK&apos;s data protection adequacy regulations, which the UK Government has determined
        provide an adequate level of protection for personal data. These transfers are therefore
        permitted without additional safeguards. If we ever move your data outside the UK or the EEA,
        we will put appropriate safeguards in place (such as the UK International Data Transfer
        Agreement) and update this policy.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your account and learning data for as long as your account is active. If you close your
        account or ask us to delete your data, we will delete it within [RETENTION PERIOD, e.g. 30 days],
        except where we must keep some information to meet a legal obligation.
      </p>

      <h2>Your rights</h2>
      <p>Under UK GDPR you have the right to:</p>
      <ul>
        <li>access the personal data we hold about you;</li>
        <li>have inaccurate data corrected;</li>
        <li>have your data erased (&quot;right to be forgotten&quot;);</li>
        <li>restrict or object to certain processing;</li>
        <li>data portability (receive your data in a usable format);</li>
        <li>withdraw consent at any time, where we rely on consent.</li>
      </ul>
      <p>
        To exercise any of these, email <strong>[PRIVACY CONTACT EMAIL]</strong>. We will respond within
        one month. You also have the right to complain to the UK&apos;s Information Commissioner&apos;s
        Office (ICO) at{" "}
        <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
          ico.org.uk
        </a>{" "}
        — though we&apos;d appreciate the chance to help first.
      </p>

      <h2>How we protect your data</h2>
      <p>
        Access to your account is protected by authentication, and data is transmitted over encrypted
        (HTTPS) connections. No system is perfectly secure, but we take reasonable technical and
        organisational measures to protect your information.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We will change the &quot;last updated&quot; date
        above and, for significant changes, let you know.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about your privacy? Email <strong>[PRIVACY CONTACT EMAIL]</strong> or write to us at
        [REGISTERED ADDRESS].
      </p>
    </article>
  );
}
