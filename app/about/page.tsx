import type { Metadata } from "next";
import Link from "next/link";
import { AUTHOR, SITE_NAME, SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Energy Academy exists: professional-grade energy management knowledge, made accessible to everyone who needs it.",
  alternates: { canonical: "/about" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: AUTHOR.name,
  jobTitle: AUTHOR.title,
  url: `${SITE_URL}/about`,
  worksFor: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
};

export default function AboutPage() {
  return (
    <article className="prose prose-slate mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <h1>About Energy Academy</h1>

      <p className="lead">
        Energy Academy exists for a simple reason: the knowledge that makes
        buildings and industry more efficient should not be locked behind
        four-figure course fees.
      </p>

      <h2>The problem we are trying to fix</h2>
      <p>
        Energy management is one of the most valuable skills a technical
        professional can hold. It cuts costs, cuts carbon, and pays for itself
        many times over. Yet the structured training for it sits mostly with
        professional bodies and commercial providers charging thousands of
        pounds per course. That price is fine for a corporate training budget.
        It shuts out the facilities manager at a small firm, the graduate
        engineer building their skills, the brewery owner staring at an
        electricity bill that has doubled.
      </p>
      <p>
        The knowledge itself is not secret. It is physics, arithmetic,
        regulation and practical judgement. What people pay for is having it
        organised, explained well, and made usable. That is exactly what this
        site sets out to do, at a price (currently: free) that makes the
        knowledge available to anyone who wants it.
      </p>

      <h2>What you will find here</h2>
      <p>
        The curriculum follows the way the profession actually develops
        expertise. <Link href="/levels/level-1">Level 1</Link> covers the
        foundations everyone should know. <Link href="/levels/level-2">Level
        2</Link> goes deep on individual systems: boilers, HVAC, compressed
        air, refrigeration, motors and more.{" "}
        <Link href="/levels/level-3">Level 3</Link> covers the leadership
        side: strategy, finance, procurement and net zero. The{" "}
        <Link href="/sectors">Sectors</Link> section applies all of it to one
        industry at a time.
      </p>
      <p>
        Lessons are not summaries or bullet-point notes. They are written to
        teach: every claim about a saving or a cost carries a worked example
        with real numbers, and the interactive tools and capstone projects let
        you practise the calculations and judgement calls that the job
        actually requires.
      </p>

      <h2>Our editorial standards</h2>
      <ul>
        <li>
          <strong>Quantified.</strong> Claims carry worked examples, and the
          numbers in them are checked by calculation before publication.
        </li>
        <li>
          <strong>Sourced.</strong> Lessons link to authoritative references
          (GOV.UK, Ofgem, CIBSE, the Carbon Trust and similar) so you can
          verify anything we say and go deeper where you need to.
        </li>
        <li>
          <strong>Dated.</strong> Lessons carry a &quot;last reviewed&quot;
          date, and facts that change over time (rates, thresholds, deadlines)
          are stated with the date they were checked. Regulation drifts;
          always confirm compliance-critical details against the official
          source before acting.
        </li>
        <li>
          <strong>Independent.</strong> Energy Academy is self-funded and not
          affiliated with any professional body, energy supplier or equipment
          manufacturer. Nothing here is trying to sell you a particular
          product.
        </li>
      </ul>

      <h2>Who is behind this</h2>
      <p>
        Energy Academy is written and maintained by <strong>Jacob Willis</strong>,
        a chemical engineer by training who works as a Net Zero Lead, helping
        organisations cut their energy use and carbon emissions in practice.
        The lessons here are the material he wishes had been affordable when he
        was building the same skills: the physics, the numbers and the
        judgement calls of real sites, written down properly.
      </p>

      <h2>What this site is not</h2>
      <p>
        We are not an accreditation body, and completing a course here does
        not confer a professional qualification. If you need chartered status
        or an accredited certificate, the professional bodies remain the right
        route. What we offer is the knowledge itself: organised, explained and
        practised, for a fraction of the cost.
      </p>
      <p>
        The content is educational. It will make you better at identifying,
        sizing and arguing for energy projects, but it is not a substitute for
        professional engineering advice on a specific installation, or legal
        advice on a specific compliance question. Our{" "}
        <Link href="/terms">Terms of Use</Link> cover this in more detail.
      </p>

      <h2>The road ahead</h2>
      <p>
        The platform is young and improving continuously: courses are being
        rewritten to a rising standard, interactive tools are being added, and
        more sectors are on the way. If some of the content eventually sits
        behind a modest fee, the aim will stay the same: professional-grade
        knowledge at a price an individual can justify, not just an employer.
      </p>
      <p>
        A free account tracks your progress and, if you choose, keeps you
        informed as new material lands. That is the whole exchange: your
        interest for our best effort at the most useful energy management
        resource on the web.
      </p>
    </article>
  );
}
