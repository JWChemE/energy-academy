# Design, UX and gated-page SEO plan

Written July 2026. Scope: (1) why the site currently looks AI-generated and a
design direction to move away from that, (2) UX fixes independent of the visual
skin, (3) SEO for gated (account-required) pages, (4) building backlinks
without posting on a personal LinkedIn.

---

## 1. Why the site reads as "AI-generated"

The generic feel is not an accident of taste, it comes from shipping the
defaults that every AI-scaffolded Next.js site ships:

1. **Stock Tailwind palette.** The `brand-*` scale in `app/globals.css` is
   Tailwind's emerald scale copied verbatim (#10b981, #059669, ...), on
   slate greys, with a `sky-50` gradient in the hero. This exact
   slate-plus-emerald combination is the single most recognisable tell.
2. **Geist.** The font `create-next-app` ships by default. Every scaffolded
   site has it.
3. **The component vocabulary.** Rounded-2xl cards with thin gradient top
   strips, hover lift plus `shadow-lg`, pill badges above headings
   ("Energy management, made learnable"), a two-button hero CTA row, a stat
   trio (3 tiers / N courses / Free), and a `backdrop-blur` sticky header.
   Each is fine alone; together they are the template.
4. **Emoji as icons.** 🏭 🔒 🔖 🎉 🚧 ▶ stand in for a real icon language.
5. **A note on the "cream" background.** The body is actually `slate-50`
   (#f8fafc), a cool blue-white, not cream. The readability you like would
   survive, and improve, on a genuinely warm paper tone, and moving off the
   slate default is itself a big step away from the template look.

## 2. Design direction (settled and built, July 2026)

An earlier proposal here ("technical handbook on warm paper": serif type,
cream background, flat hairline rules, mono labels) was built, reviewed and
rejected; it survives in a git stash on main for reference. The settled
direction, arrived at through structured review questions, is:

**Modern SaaS polish on the original layout.** Cool off-white base, white
surfaces, soft shadows and hover states, Geist sans throughout. The
differentiation from AI-generic sites comes from execution quality and a
fully custom palette, not from novelty:

- **Brand green: deep pine** (`#0d6b4a` scale in `app/globals.css`),
  replacing stock Tailwind emerald on every button, link and progress bar.
  Nothing brand-coloured uses a default Tailwind swatch.
- **Level identities are custom hues**, wired through the `accents` record
  in `content/curriculum.ts`: L1 pine green, L2 denim blue, L3 honey amber,
  Sectors terracotta. Level and sector pages keep the neutral header /
  pastel band / neutral content sandwich.
- **Course links are detailed list rows** (numbered tile in the level hue,
  title, summary, lesson count), not card grids.
- **Homepage is a compact hero plus the full curriculum index** with course
  summaries: the catalogue is the pitch, and every course title and summary
  is crawlable from the landing page.
- **One dark moment**: the deep pine footer. Everything else stays light.
- **Drawn SVG icons replace all UI emoji** (paywall lock, callouts, sector
  mark, lesson numbering).

## 3. UX findings (worth doing regardless of the reskin)

1. **Desktop nav hides the knowledge base.** Tools, Quick reference and
   Glossary exist only in the mobile menu (`components/SiteHeader.tsx`).
   Phase 2 of the roadmap is the knowledge-base turn; these pages are also
   the natural link magnets. Add a "Reference" group to the desktop nav.
   *Done, July 2026.*
2. **Lesson line length is too long.** The lesson column is roughly 850px
   with `prose max-w-none`, giving 95 to 105 characters per line. Cap the
   prose at about 70ch. This is the single cheapest readability win.
   *Done, July 2026.*
3. **The signed-in home page does nothing personal.** Progress is tracked,
   but the landing hero is identical for a returning learner. Swap the hero
   CTA for a "continue where you left off" card when signed in.
4. **Every sector card shows 🏭**, including Buildings sectors
   (`app/page.tsx`). Falls out of the icon-language fix. *Done, July 2026.*
5. **Gated pages end dead at the wall.** Below the sign-up card there is
   nothing: no FAQ, no outline of what the lesson covers, no related
   content. This is the UX half of the SEO plan in section 4.
6. **The paywall card is the generic centred lock.** Restyled July 2026
   (drawn lock icon, level-hue badge); the "In this lesson" list of section
   headings is still to do as part of section 4b.
7. Minor: the header labels "L1 Foundations / L2 System Deep Dives" are
   cryptic to first-time visitors; consider plain names with the level
   de-emphasised. *Done, July 2026 (Foundations / Systems / Leadership).*
   Long lessons (8 to 12 min) would still benefit from an "on this page"
   heading list under the course outline in the sidebar.

## 4. SEO plan for gated pages

Currently a gated lesson exposes: title, summary, a ~120-word excerpt, and
Article + breadcrumb structured data. Good foundations, three gaps to close.

### 4a. Lesson-level FAQs rendered outside the gate (the core ask)

The registry (`content/faqs.ts`), the renderer with FAQPage structured data
(`components/mdx/FAQList.tsx`) and course-level wiring all exist. But the one
lesson-level use, ESOS, sits inside the gated MDX body, so signed-out
visitors and crawlers never see it. **Google currently gets no FAQ content
for the exact lesson the FAQs were written for.**

1. Add `faqId?: string` to the lesson entry type in `content/curriculum.ts`.
2. Render `<FAQList id={lesson.faqId} />` in the lesson page server
   component, after the gated body / wall, so it is always in the static
   HTML.
3. Move the ESOS FAQ reference out of `esos.mdx` to the lesson entry.
4. Extend the validator's FAQ wiring rules (registry ids referenced by
   course `faqId`, lesson `faqId`, or MDX, and every reference resolves).
5. Write FAQ sets for the highest-value gated lessons first (regulation and
   compliance topics; they match how people actually search). Target the
   "People also ask" phrasings.

Honest caveat: since 2023 Google shows FAQ rich results only for a small set
of authoritative government and health sites, so do not expect stars in the
SERP. The value is (a) indexable, keyword-relevant content on otherwise thin
gated pages, and (b) clean question-answer pairs that AI search engines can
quote and cite, which increasingly drives discovery.

### 4b. More public surface per gated lesson, without leaking the body

- Server-render an **"In this lesson"** list of the H2 headings. Headings
  are keyword-rich, they sell the content, and they give nothing away.
- Show **related content** below the wall: the free Level 1 lessons the
  gated lesson builds on, plus relevant reference pages. Free-tier internal
  links from every gated URL strengthen the pages that can actually rank.
- Consider exposing the lesson's KeyFigures strip as a teaser.

### 4c. Paywalled-content structured data

Google's guidance for gated content is to mark the gated portion explicitly:
`Article.hasPart` with `isAccessibleForFree: false` and a `cssSelector`
pointing at the gated container. We set `isAccessibleForFree` on the whole
Article but not `hasPart`. Adding it keeps us squarely inside the
flexible-sampling rules and avoids any risk of the excerpt-then-wall pattern
being read as cloaking.

### 4d. Aim links at the free assets, not the gated lessons

Nobody links to a sign-up wall. The linkable assets are `/reference/*`
(steam tables, compliance deadlines, prices and carbon factors) and
`/tools/*` (calculators). Expand these and treat every backlink effort in
section 5 as pointing at them; the gated courses then benefit through
internal links.

## 5. Backlinks without personal LinkedIn

The conflict-of-interest concern is about posting *as yourself*. Most of
what works does not require that:

- **Post as the brand.** An Energy Academy LinkedIn company page (and the
  site's name on guest articles) rather than a personal profile. Worth a
  quick read of the employment contract's side-business clause either way.
- **UK trade press.** edie, Energy Manager Magazine, The Energyst, Energy in
  Buildings & Industry all take contributed pieces. Pitch data-led articles
  under the Energy Academy byline.
- **Journalist request services.** ResponseSource (UK), Qwoted, Featured.
  Respond to energy and net-zero queries as the founder of Energy Academy.
- **Communities where a link is the answer.** Sustainability Stack Exchange,
  r/AskEngineers, r/sustainability, CIBSE and EMA member forums. Answer
  properly, link a reference page or calculator only when it genuinely is
  the answer.
- **Directories.** Free-course directories (Class Central and similar), tool
  roundups, resource lists on university and professional-body pages.
- **Original data is the strongest magnet.** A short annual analysis piece
  (for example, what the new UK conversion factors mean for a typical site's
  reported footprint) gives trade press a number worth citing and linking.

## 6. Suggested sequence

**Phase A, quick wins (days):** UX items 1, 2 and 4; SEO items 4a.1 to 4a.4
(lesson FAQ plumbing plus the ESOS fix), 4b's "In this lesson" list, and the
`hasPart` markup. No visual redesign required, all high value.

**Phase B, the redesign:** done, July 2026, per the settled direction in
section 2 (custom palette, detailed course rows, hero + curriculum index
homepage, dark footer, icons for emoji).

**Phase C, ongoing:** FAQ sets for the top gated lessons, one reference page
or tool per month as a link asset, one brand-bylined article per quarter,
journalist-request responses opportunistically.
