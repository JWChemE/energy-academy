import type { Metadata } from "next";
import { buildSearchIndex } from "@/lib/searchIndex";
import SearchClient from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search every course, lesson, tool, reference table and glossary term on Energy Academy.",
  // Internal search results pages shouldn't be indexed; the content they
  // point at is indexed at its own URLs.
  robots: { index: false, follow: true },
};

export default async function SearchPage() {
  const docs = await buildSearchIndex();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Search
      </h1>
      <p className="mt-2 text-slate-600">
        Every course, lesson, tool, reference table and glossary term. For
        gated lessons, search covers the public title, summary and preview.
      </p>
      <SearchClient docs={docs} />
    </div>
  );
}
