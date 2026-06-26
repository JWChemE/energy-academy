<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Energy Academy — project guide

A Coursera-style platform for learning energy management, organised into three
tiers aligned to how the profession develops expertise:

- **Level 1 – Foundations:** principles for everyone (the only tier with full
  content so far — the _Introduction to Energy Management_ course).
- **Level 2 – System Deep Dives:** technical, system-by-system courses.
- **Level 3 – Leadership & Strategy:** policy, finance, procurement, net zero.

## Stack

- **Next.js 16 (App Router) + TypeScript** — pages + (future) backend in one app.
- **Tailwind CSS v4** — styling. Brand tokens (`brand-*`) live in `app/globals.css`.
- **MDX via `next-mdx-remote/rsc`** — lessons are MDX files compiled at runtime.
- No database yet. Content is file-based; accounts/progress/payments come later.

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

## Routes (all statically generated via `generateStaticParams`)

- `/` — landing (3 tiers)
- `/levels/[level]` — tier overview (its courses)
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

Milestone 1 (done): platform shell + the full _Introduction to Energy Management_
course. Next: user accounts + progress tracking (needs a database — Postgres via
Supabase is the planned choice), then paid tiers, then self-hosted video.
