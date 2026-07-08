<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Energy Academy — project guide

A Coursera-style platform for learning energy management, organised into three
tiers aligned to how the profession develops expertise, plus sector courses:

- **Level 1 – Foundations:** principles for everyone. Free and public.
- **Level 2 – System Deep Dives:** technical, system-by-system courses.
- **Level 3 – Leadership & Strategy:** policy, finance, procurement, net zero.
- **Sectors:** a peer section (not a fourth tier) applying Levels 1–2 to one
  industry at a time, grouped into Industrial / Buildings / Transportation
  categories (Breweries, Commercial Real Estate, Food Manufacturing so far).
  Sector lessons assume the Level 1/2 grounding and cross-link back rather
  than re-teach.

Level 2/3 and Sector lesson bodies are gated behind a free account (served via
`/api/lesson` with a Supabase token); only a short lead-paragraph excerpt is
public/indexable. The commercial goal: the free account and its opt-in comms
streams build an email list for future services.

## Stack

- **Next.js 16 (App Router) + TypeScript** — pages + API routes in one app.
- **Tailwind CSS v4** — styling. Brand tokens (`brand-*`) live in `app/globals.css`.
- **MDX via `next-mdx-remote/rsc`** — lessons are MDX files compiled at runtime.
- **Supabase (UK-hosted Postgres + auth)** — accounts, progress, quiz results,
  comms consent (with a `consent_events` audit table). Schema/migrations live
  in `docs/*.sql` and are applied manually in the Supabase SQL editor.

Run it: `npm run dev` (dev) · `npm run build` (prod build) · `npm run start` (serve build).

## How the content model works

Everything hangs off one manifest: **`content/curriculum.ts`** — the single
source of truth for Level → Course → Module → Lesson, plus per-level accent
colours and lesson metadata (title, summary, minutes).

- `lib/content.ts` traverses the manifest (find course, flatten lessons, compute
  prev/next, read MDX from disk, generate static params).
- Lesson bodies live at `content/courses/<course-slug>/<lesson-slug>.mdx`.
  The MDX is **body only** — the page renders the H1/title from the manifest, so
  start MDX at the lead paragraph and use `##` for sections.
- Quizzes live in **`content/quizzes.ts`** (typed registry), referenced from MDX
  by id. Do _not_ pass quiz arrays as MDX props — passing complex objects from
  MDX across the server/client boundary is unreliable; the id lookup is robust.

### Components available inside any lesson MDX

Registered in `components/mdx/index.tsx`:

- `<Callout variant="note|tip|warning|key" title="...">…</Callout>`
- `<Figure src="/img.png" alt="..." caption="..." credit="..." />`
- `<YouTubeEmbed id="VIDEO_ID" title="..." />` — short-term video strategy is
  YouTube embeds; only this component changes when we self-host later.
- `<Quiz id="some-quiz-id" />` — data from `content/quizzes.ts`.
- `<PaybackCalculator defaultCost={8000} defaultSaving={2500} />`
- `<KeyFigures><KeyFigure value="489 kWh" label="per batch" /></KeyFigures>` —
  a stat strip lifting a lesson's headline numbers out of the prose.
- `<WorkedExample title="…"><Given>…</Given><Find>…</Find><Solution>…</Solution></WorkedExample>`
  — structured worked example; the solution sits behind a "try it first"
  reveal. Slots take ordinary markdown.
- `<VapourCompressionCycle />` — step-through SVG diagram (refrigeration /
  heat pumps). To add a new step-through diagram: define its steps + SVG in a
  component under `components/mdx/diagrams/`, render via `StepDiagramShell`,
  register it, and use it as a no-prop tag (same registry principle as
  quizzes — never pass complex data as MDX props).
- `<AffinityLawsExplorer />` — interactive cube-law slider (VFD vs damper);
  the template for future single-concept sliders. Chart colour pairs must
  pass the dataviz palette validator (CVD separation + contrast).

## Content style guide — every lesson must meet this bar

The reference standard is the newer courses (Mass & Energy Balances, Pinch
Analysis, Breweries). The older terse lessons (bullet-fragment "Pros:/Cons:"
style — much of HVAC, motors, compressed air, lighting, controls) predate this
guide and are being brought up to it incrementally.

1. **Teaching prose, not fragments.** Sections are written paragraphs that
   explain *why*, not shorthand notes. Bullets only for genuine enumerations
   (a list of parts, a checklist) — never as a substitute for explanation.
2. **The lead paragraph must stand alone.** No heading before it; it hooks the
   reader and says why the topic matters. For gated lessons the first ~120
   words become the public SEO preview — write them to work out of context.
3. **Quantify everything.** Every claim of size, saving or cost carries a
   worked example with real numbers, and every stated number is verified with
   a quick calculation script *before* it goes into the MDX. Use the
   platform's consistent reference prices (elec £0.20/kWh, gas £0.06/kWh
   unless a lesson explicitly varies them) so examples agree across courses.
4. **Cross-link, don't re-teach.** Link to the lesson that owns a concept
   (markdown links to `/courses/...`) instead of re-explaining it. Sector
   courses in particular assume Levels 1–2.
5. **One `<Callout variant="key">` per lesson** carrying the single idea the
   reader must retain. `tip`/`warning` sparingly, where they earn their place.
6. **UK voice and units** — £, kWh, °C, UK regulation, en-GB spelling.
7. **Shape:** lead paragraph → 3–5 `##` sections → close by pointing forward
   (what the next lesson builds on this). Target 8–12 minutes' reading.
8. **Quizzes teach — and give nothing away.** 4–5 questions, plausible
   distractors, and explanations that add understanding rather than restating
   the correct option. No answer tells: the correct option must not be
   predictable by position (vary it; a seeded shuffle script normalised the
   registry in Jul 2026) or by length — keep options comparable in length and
   detail, and let a distractor be the longest at least as often as the answer.
   Same rule for capstone candidate lists in `lib/*Cases.ts`: never list the
   correct causes/actions first.
9. **Write like a person, not a model.** The tone is professional and
   educational: a good tutor walking the reader through a problem. Avoid the
   tics that mark machine-written text:
   - **No em-dashes.** Use a comma, colon, brackets, or start a new sentence.
   - No "it's not X, it's Y" reversals, no rule-of-three flourishes, no
     paragraphs that all open the same way.
   - No filler ("it's worth noting", "importantly", "in today's world") and
     no bolding whole phrases for emphasis; bold is for terms being defined.
   - Vary sentence length. Short sentences are fine. So are plain ones.
10. **Credible and current.** Every lesson ends with a `## Sources and further
    reading` section: 2–4 links to authoritative bodies (GOV.UK, Ofgem, HSE,
    the Environment Agency, CIBSE, the Carbon Trust, BSI/ISO, BEIS/DESNZ
    successor departments). Facts that change over time (rates, thresholds,
    deadlines) are stated with their as-at date in the text. Every new or
    rewritten lesson sets `reviewed` in its `content/curriculum.ts` entry
    (ISO date, shown on the lesson page as "Last reviewed"); update it
    whenever the content is checked, especially for regulation lessons.

## Routes (all statically generated via `generateStaticParams`)

- `/` — landing (3 tiers + sectors)
- `/levels/[level]` — tier overview (its courses)
- `/sectors` and `/sectors/[sector]` — the sector section
- `/courses/[course]` — course overview (modules + lessons, or a "coming soon" state)
- `/courses/[course]/[lesson]` — the lesson reader (outline sidebar, MDX, prev/next)

## Common tasks

- **Add a lesson:** add it to the right module in `content/curriculum.ts`, then
  create `content/courses/<course>/<lesson>.mdx`.
- **Turn a "coming soon" course on:** change its `status` to `"available"` and
  give it `modules`/`lessons`, then write the MDX files.
- **Add a quiz:** add an entry to `content/quizzes.ts`, reference `<Quiz id="…" />`.
- **Rebrand colours:** edit `--color-brand-*` in `app/globals.css`; per-tier
  accents are in `content/curriculum.ts` (`accents`). Tailwind classes there must
  be complete literal strings so the scanner picks them up.

## Roadmap

The formal, phased plan lives in **`docs/ROADMAP.md`** — treat it as the
single source of truth for what's next, and tick items off there as they land.
Short version: Phase 1 credibility (identity, style guide, M&T + UK Regulation
rewrites), Phase 2 knowledge-base turn (content floor, search, reference
pages), Phase 3 audience (ESP, analytics, LinkedIn), Phase 4 commercialisation
(certificates, payments), Phase 5 consultancy bridge.
