/**
 * Extract a short, plain-text preview from a lesson's MDX source.
 *
 * Used to render an indexable teaser above the sign-in wall on gated
 * (Level 2/3 and Sector) lessons: search engines and visitors see the lead
 * paragraphs; the full body still only ever leaves the server through the
 * authenticated /api/lesson route.
 *
 * Deliberately conservative: only the lead prose BEFORE the first `##`
 * heading is considered, JSX components are stripped whole, and the result
 * is capped by word count — so at most a lesson's intro ever becomes public.
 */
export function lessonExcerpt(mdxSource: string, maxWords = 120): string {
  // Lead section only — everything before the first heading.
  const lead = mdxSource.split(/^##\s/m)[0];

  const text = lead
    // Remove multi-line JSX blocks (<Callout>…</Callout> etc.), then any
    // remaining single tags (<Quiz id="…" />, stray closers).
    .replace(/<[A-Z][a-zA-Z]*[\s\S]*?(\/>|<\/[A-Z][a-zA-Z]*>)/g, " ")
    .replace(/<\/?[a-zA-Z][^>]*>/g, " ")
    // Markdown links → keep the link text.
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // Emphasis/bold/code markers.
    .replace(/[*_`]/g, "")
    // Blockquotes and list markers at line starts.
    .replace(/^\s*[>\-+]\s?/gm, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "";

  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}…`;
}
