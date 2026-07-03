import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern your use of Energy Academy.",
  alternates: { canonical: "/terms" },
};

// NOTE FOR THE OWNER: as with the privacy policy, replace every [BRACKETED]
// placeholder with your real details and have the document reviewed before
// relying on it. It is a sensible starting template, not legal advice.

export default function TermsPage() {
  return (
    <article className="prose prose-slate mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1>Terms of Use</h1>
      <p className="text-sm text-slate-500">Last updated: [ADD DATE]</p>

      <p>
        These terms govern your use of Energy Academy (the &quot;Service&quot;), operated by{" "}
        <strong>[YOUR ORGANISATION NAME]</strong> (&quot;we&quot;, &quot;us&quot;). By using the
        Service you agree to them. If you do not agree, please do not use the Service.
      </p>

      <h2>1. The Service</h2>
      <p>
        Energy Academy provides educational content on energy management: courses, lessons,
        quizzes, interactive tools and downloadable resources. Some content is free to everyone;
        some requires a free account. We may add, change or remove content and features at any
        time.
      </p>

      <h2>2. Your account</h2>
      <p>
        You are responsible for keeping your login details secure, and for everything done under
        your account. Accounts are for individual use and must be registered with accurate
        information. You can delete your account at any time from your profile page; our{" "}
        <Link href="/privacy">Privacy Policy</Link> explains what happens to your data when you
        do.
      </p>

      <h2>3. Educational content, not professional advice</h2>
      <p>
        The Service exists to teach. Its content is general education, not advice on any specific
        installation, project, contract or compliance obligation. In particular:
      </p>
      <ul>
        <li>
          Content about engineering systems does not replace the judgement of a competent,
          qualified person examining your specific plant and site.
        </li>
        <li>
          Content about legislation and regulation (for example ESOS, SECR or the Climate Change
          Levy) summarises schemes for learning purposes. Rules, rates, thresholds and deadlines
          change. Always confirm compliance-critical details against the official source (such as
          GOV.UK or the relevant regulator) or take professional advice before acting.
        </li>
        <li>
          Worked examples, calculators and financial figures use stated assumptions and reference
          prices. They illustrate methods; they are not quotations, forecasts or investment
          advice.
        </li>
      </ul>
      <p>
        Completing a course on the Service does not confer a qualification, accreditation or
        professional status.
      </p>

      <h2>4. Accuracy</h2>
      <p>
        We work to keep the content accurate: figures are checked before publication, lessons
        carry a &quot;last reviewed&quot; date, and sources are linked so you can verify what we
        say. Even so, we cannot guarantee that everything is complete, current or error-free, and
        the Service is provided &quot;as is&quot;. If you spot an error, we would genuinely like
        to hear about it.
      </p>

      <h2>5. Using the content</h2>
      <p>
        The content, design and software of the Service are protected by copyright and other
        intellectual property rights, and remain ours (or our licensors&apos;). You may use the
        content for your own personal, non-commercial learning, including printing or saving
        copies for your own reference. You may not, without our written permission:
      </p>
      <ul>
        <li>republish, redistribute or sell the content, in whole or substantial part;</li>
        <li>use the content to build or train a competing product or service;</li>
        <li>scrape, bulk-download or systematically extract material from the Service;</li>
        <li>remove or obscure any attribution or notices.</li>
      </ul>
      <p>
        Quoting short extracts with attribution and a link (for example in a workplace
        presentation or an article) is welcome.
      </p>

      <h2>6. Acceptable use</h2>
      <p>
        You agree not to misuse the Service: no attempting to breach its security, probe or
        overload its infrastructure, access other users&apos; data, share your account, or use
        the Service for anything unlawful.
      </p>

      <h2>7. Third-party links</h2>
      <p>
        Lessons link to external sites (regulators, standards bodies, publications) because
        credible sourcing matters to us. We do not control those sites and are not responsible
        for their content.
      </p>

      <h2>8. Liability</h2>
      <p>
        Nothing in these terms excludes or limits liability that cannot be excluded or limited
        under the law of England and Wales, including liability for death or personal injury
        caused by negligence, or for fraud. Subject to that, we are not liable for: losses
        arising from decisions made in reliance on educational content (see section 3); loss of
        profit, revenue, data or business opportunity; or indirect or consequential loss. The
        Service is currently provided free of charge; our total liability to you in connection
        with it is limited to £100.
      </p>

      <h2>9. Suspension and termination</h2>
      <p>
        We may suspend or close accounts that breach these terms. You may stop using the Service,
        and delete your account, at any time.
      </p>

      <h2>10. Changes to these terms</h2>
      <p>
        We may update these terms from time to time, for example if the Service gains new
        features or paid tiers. The &quot;last updated&quot; date above will change when we do,
        and material changes will be flagged on the site. Continuing to use the Service after a
        change means you accept the updated terms.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These terms are governed by the law of England and Wales, and the courts of England and
        Wales have exclusive jurisdiction over any dispute relating to them.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about these terms: <strong>[CONTACT EMAIL]</strong>, or write to us at
        [REGISTERED ADDRESS].
      </p>
    </article>
  );
}
