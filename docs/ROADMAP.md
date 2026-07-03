# Energy Academy roadmap

The working plan for turning the platform into a best-in-class knowledge base
that professionals return to, with a route to commercialisation and, longer
term, consultancy lead generation. Drawn from the July 2026 full-project
review. Tick items off as they land; add dates when they do.

**Positioning (agreed):** we are not competing with professional bodies on
accreditation. We sell the knowledge layer: UK-specific, quantified, credible,
interactive, at a fraction of the cost. The product is a *reference*
professionals consult when they need help, not just a course catalogue.

---

## Phase 1 — Credibility and trust (current)

The blocker to everything else is that the site is anonymous and its weakest
content undermines its best. Nothing here needs new infrastructure.

- [x] Fix mobile navigation (no nav existed on phones) *(Jul 2026)*
- [x] Style guide: human voice rules, credibility requirements, last-reviewed
      dates *(Jul 2026 — see AGENTS.md)*
- [x] Last-reviewed date mechanism (manifest field, shown on lesson page) *(Jul 2026)*
- [x] About page: the mission, editorial standards *(Jul 2026)*
- [x] Terms of Use page *(Jul 2026)*
- [ ] Custom domain purchased and configured (incl. NEXT_PUBLIC_SITE_URL,
      Supabase redirect URLs)
- [ ] Fill identity placeholders: privacy policy + terms (organisation name,
      address, contact email, ICO number if registered)
- [ ] Personal bio on the About page (who is behind this and why)
- [x] Rewrite Monitoring & Targeting course to the style-guide bar *(Jul 2026)*
- [x] Rewrite UK Energy Regulation course to the style-guide bar *(Jul 2026)*

## Phase 2 — The knowledge-base turn

Make it a reference, not just a course catalogue.

**Content floor.** Rewrite the remaining pre-style-guide courses (avg words
per lesson at review time; the bar is roughly 450+ of teaching prose with
sources and a reviewed date). Order by how core the topic is to practitioners:

- [ ] energy-audits (241)
- [ ] compressed-air (200)
- [ ] steam-and-condensate (231)
- [ ] refrigeration-and-heat-pumps (224)
- [ ] motors-and-drives (269)
- [ ] economic-analysis (242)
- [ ] control-systems-and-bms (187)
- [ ] commissioning (190)
- [ ] waste-heat-recovery (197)
- [ ] electrical-science (242)
- [ ] buildings-and-envelope (271)
- [ ] insulation-systems (294)
- [ ] lighting (305)
- [ ] chp-and-cogeneration (310)
- [ ] thermal-energy-storage (345)
- [ ] intro-to-energy-management (348) — flagship Level 1 course, worth an
      early pass despite the middling count
- [ ] renewable-energy (358)
- [ ] maintenance (380)

**Citations backfill.** Lessons already at the prose bar but missing a
"Sources and further reading" section and a reviewed date get both.

**Reference features.**
- [ ] Site search (client-side index over titles, summaries, headings;
      gated lessons surface title + excerpt only)
- [ ] /tools index page surfacing the calculators and diagnostics already
      built but buried inside lessons
- [ ] Quick-reference data pages (conversion factors, typical plant
      efficiencies, benchmark tables — much of this data already exists in
      lib/*Tables.ts)
- [ ] Glossary
- [ ] Continue the visuals rollout (step-through diagrams, concept sliders,
      WorkedExample/KeyFigures) as each course is rewritten

## Phase 3 — Audience

- [ ] Choose an email service provider; wire the consented streams and the
      leads table to it (nothing sends today)
- [ ] Monthly newsletter: what's new plus one worked insight
- [ ] Privacy-friendly analytics (Plausible/Fathom), loaded only behind the
      existing consent banner
- [ ] Repurpose best lessons as LinkedIn posts (audience + personal
      credibility compound together)
- [ ] Second and third lead magnets (benchmark cheat-sheets, degree-day
      normalisation walkthrough)
- [ ] More sectors (data centres and commercial offices are the obvious next
      two)

## Phase 4 — Commercialisation

Do not start until the content floor (Phase 2) is substantially done.

- [ ] Completion certificates (professionals need CPD evidence; "log this
      course as CPD" uses the professional bodies' own system rather than
      fighting it)
- [ ] Pricing decision (working assumption: free Level 1 + previews; paid
      tier roughly £50–120/yr for Levels 2/3, sectors, capstones)
- [ ] Payments (Stripe) + entitlements in /api/lesson
- [ ] Move quiz/capstone answer checking server-side (answers currently ship
      in the client bundle — fine free, leaky paid)
- [ ] Error monitoring (Sentry or similar) before taking money
- [ ] Terms updated for paid service (refunds, billing)

## Phase 5 — Consultancy bridge (long term)

- [ ] Services/"work with me" page
- [ ] Case studies as they exist
- [ ] "Ask an expert" funnel from lesson pages
- [ ] Segment the email list by sector/interest (profile data already
      collected supports this)

## Engineering debt register

Not blocking, but pay down before Phase 4:

- [ ] Tests for the pure scoring/calculation logic (capstone scoring,
      diagnostics tolerance checks) + a CI workflow running tsc/build
- [ ] Rate limiting is per-instance in-memory; move to a shared store if
      abuse appears or before payments
- [ ] Admin page protection is client-redirect + RLS only; add a server-side
      role check when the admin surface grows
- [ ] npm audit: moderate advisory in Next's bundled postcss (not exploitable
      here; clears with a future Next upgrade)

## Review cadence

Revisit this file monthly. When a phase completes, note the date. When
priorities change, edit the file rather than keeping the plan in anyone's
head; this document is the single source of truth for "what's next".
