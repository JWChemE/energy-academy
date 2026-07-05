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
          <strong>Profile &amp; interests (optional)</strong> — details you choose to add, such as your
          industry, job role and topics of interest, and your email-communication preferences. These
          are never required and are used only to send you relevant content if you&apos;ve opted in.
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
        <li>
          <strong>To send you marketing communications</strong> you&apos;ve asked for (course updates,
          newsletter, services and events) and to tailor them using your optional profile details —
          lawful basis: <em>your consent</em>.
        </li>
      </ul>
      <p>
        <strong>Analytics (only with your consent).</strong> If you accept non-essential cookies in
        our banner, we use Vercel Web Analytics to understand which pages are visited and where
        visitors come from. It is cookieless and aggregate: it does not store your IP address or
        identify you, and it never loads if you reject or ignore the banner. Lawful basis:{" "}
        <em>your consent</em>. We do not use advertising or any other tracking.
      </p>
      <p>
        If you have an account, we also store your lesson progress and quiz results (score and
        answers) so your dashboard works and you can pick up where you left off. These live in our
        database alongside your account, are visible only to you (and to us as the operator), and
        are deleted with your account.
      </p>

      <h2>Marketing communications and your choices</h2>
      <p>
        We only send you marketing emails if you have opted in, and you can choose which types you
        receive (course and platform updates, our newsletter and energy tips, consulting and services,
        and events and webinars). You can change your choices or unsubscribe at any time from the{" "}
        <strong>Email preferences</strong> section of your profile, or via the unsubscribe link in any
        marketing email. Withdrawing consent does not affect anything we sent before you withdrew it.
      </p>
      <p>
        We use the optional details you give us (such as your industry, role and interests) only to
        make those communications more relevant to you. <strong>We do not sell your personal data,
        and we do not share it with third parties for their own marketing.</strong>
      </p>

      <h2>Who we share it with</h2>
      <p>We use trusted service providers who process data on our behalf, under contract:</p>
      <ul>
        <li>
          <strong>Supabase</strong> — database and authentication (stores your account and learning
          data). Hosting region: West EU (Ireland), <code>eu-west-1</code>.
        </li>
        <li>
          <strong>Vercel</strong> — website hosting and delivery, and (only if you consent)
          cookieless, aggregate web analytics.
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
        We keep your account and learning data for as long as your account is active. When you delete
        your account (from your profile page) or ask us to delete your data, your account, profile,
        learning progress, quiz results and consent records are deleted immediately, and any residual
        copies clear from our provider&apos;s encrypted backups within 30 days. We may retain a minimal
        record for longer only where we must meet a legal obligation (for example, evidence that a
        marketing consent was withdrawn).
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
