import { faqs } from "@/content/faqs";

/**
 * Renders an FAQ section from the registry in content/faqs.ts, with FAQPage
 * structured data so search engines can show the questions directly. Usable
 * from free-lesson MDX as <FAQList id="…" /> (registry-id pattern, like
 * Quiz), from course pages (course `faqId`), or from lesson pages (lesson
 * `faqId`, rendered outside the gated body so it is always in the public
 * HTML). Server component: no hooks, safe in static HTML.
 */
export default function FAQList({ id }: { id: string }) {
  const items = faqs[id];
  if (!items || items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="not-prose my-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-xl font-bold tracking-tight text-slate-900">
        Frequently asked questions
      </h2>
      <dl className="mt-4 space-y-3">
        {items.map((f) => (
          <div key={f.q} className="rounded-xl border border-slate-200 bg-white p-4">
            <dt className="font-semibold text-slate-900">{f.q}</dt>
            <dd className="mt-1.5 text-sm leading-6 text-slate-600">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
