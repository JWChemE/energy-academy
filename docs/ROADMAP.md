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
- [x] Custom domain purchased: energyacademyuk.org *(Jul 2026 — code fallback
      updated; still to do in dashboards: point the domain at Vercel, set
      NEXT_PUBLIC_SITE_URL, update Supabase Site URL + redirect URLs to
      https://energyacademyuk.org/**)*
- [x] Google Search Console: domain verified, sitemap submitted *(Jul 2026)*
- [ ] Bing Webmaster Tools: same (can import the verified GSC property)
- [x] Fill identity placeholders: privacy policy + terms (Energy Management
      Academy, contact email) *(Jul 2026 — ICO number + postal address still
      to add once registered/trading)*
- [x] Author identity: byline on every lesson, bio + Person structured data
      on the About page, footer credit *(Jul 2026)*
- [x] Rewrite Monitoring & Targeting course to the style-guide bar *(Jul 2026)*
- [x] Rewrite UK Energy Regulation course to the style-guide bar *(Jul 2026)*

## Phase 2 — The knowledge-base turn

Make it a reference, not just a course catalogue.

**Content floor.** Rewrite the remaining pre-style-guide courses (avg words
per lesson at review time; the bar is roughly 600+ words of teaching prose
with sources and a reviewed date; ~300 is the informal search-engine
"thin content" floor).

**SEO note on ordering (Jul 2026):** only Level 1 lesson bodies are fully
public and indexable; gated courses expose ~120-word excerpts regardless of
their true length. Public-and-thin therefore outranks gated-and-thin for
rewrite priority. That put electrical-science (Level 1, 242 avg) to the top;
the gated courses follow in practitioner-relevance order.

- [x] electrical-science (242, Level 1 public) *(Jul 2026)*
- [x] energy-audits (241) *(Jul 2026)*
- [x] compressed-air (200) *(Jul 2026)*
- [x] steam-and-condensate (231) *(Jul 2026)*
- [x] refrigeration-and-heat-pumps (224) *(Jul 2026)*
- [x] motors-and-drives (269) *(Jul 2026)*
- [x] economic-analysis (242) *(Jul 2026)*
- [x] control-systems-and-bms (187) *(Jul 2026)*
- [x] commissioning (190) *(Jul 2026 — also fixed a fabricated "ETICS" framework;
      lesson renamed to Retro-Commissioning Existing Buildings)*
- [x] waste-heat-recovery (197) *(Jul 2026)*
- [x] buildings-and-envelope (271) *(Jul 2026)*
- [x] insulation-systems (294) *(Jul 2026)*
- [x] lighting (305) *(Jul 2026 — also reordered modules to Fundamentals →
      Retrofit & Design → Controls for a cleaner teaching sequence)*
- [x] intro-to-energy-management (348) *(Jul 2026 — flagship Level 1; removed
      em-dashes, added sources, dropped a placeholder video embed)*
- [x] chp-and-cogeneration (310) *(Jul 2026)*
- [x] thermal-energy-storage (345) *(Jul 2026)*
- [x] renewable-energy (358) *(Jul 2026)*
- [x] maintenance (380) *(Jul 2026)*

**Content floor: COMPLETE (Jul 2026).** All pre-style-guide courses rewritten
to the bar. Every content lesson on the platform now carries teaching prose,
worked examples verified by calculation, a key callout, cross-links, a
"Sources and further reading" section, and a reviewed date. ~250 lessons across
five batches.

**Citations backfill.**
- [x] Sources + reviewed dates added to all 136 remaining lessons (the six
      pre-style-guide technical courses + all eight Level 3 courses); also
      removed every em-dash left in content (999 platform-wide) *(Jul 2026)*

**Reference features.**
- [x] Site search — build-time index, gating respected (gated lessons expose
      title + excerpt only; headings indexed for Level 1 only); /search is
      noindex *(Jul 2026)*
- [x] /tools index — 3 free standalone tool pages (payback, affinity laws,
      vapour-compression cycle) + directory of all 22 gated diagnostics
      *(Jul 2026)*
- [x] Quick-reference data pages — energy units, saturated steam, motor
      efficiency, typical plant efficiencies, prices & carbon factors, built
      from the same lib/*Tables.ts data the simulators use *(Jul 2026)*
- [x] Glossary — 118 terms, each linked to its owning lesson *(Jul 2026)*
- [ ] Continue the visuals rollout (step-through diagrams, concept sliders,
      WorkedExample/KeyFigures) as courses evolve. Live so far: affinity laws,
      vapour-compression cycle, power triangle, composite curves, excess air,
      economic thickness, boiler Sankey, PDCA cycle, Ohm's law triangle,
      AC vs DC waves, three-phase progression, boiler boundaries, motor
      black-box balance, energy signature *(Jul 2026)*. Every Level 1
      course except UK Regulation now has at least one visual; next
      passes: remaining mass-balance lessons (combustion, psychrometrics,
      steam/HVAC balances), CUSUM chart for M&T, Level 2 sliders

**Phase 2 is complete** apart from the ongoing visuals rollout *(Jul 2026)*.

## Phase 3 — Audience

- [ ] Choose an email service provider; wire the consented streams and the
      leads table to it (nothing sends today)
- [ ] Monthly newsletter: what's new plus one worked insight
- [x] Privacy-friendly analytics *(Jul 2026 — architecture: Vercel Web
      Analytics for anonymous traffic (cookieless, first-party, mounted only
      after consent via ConsentedAnalytics), Supabase for signed-in behaviour
      (progress was already recorded; quiz results now persist via
      saveQuizResult wired into Quiz.tsx), Google Search Console for search
      queries. Policy pages updated. OWNER TASK: enable Web Analytics for the
      project in the Vercel dashboard or no data will arrive. Deferred to
      later: internal-search query logging; funnel events such as gate-hit
      → signup, which need Vercel Pro custom events or Plausible)*
- [ ] Repurpose best lessons as LinkedIn posts (audience + personal
      credibility compound together)
- [ ] Second and third lead magnets (benchmark cheat-sheets, degree-day
      normalisation walkthrough)
- [x] Commercial Real Estate sector course — 13 lessons, 4 quizzes, two-case
      diagnostics and an office audit capstone *(Jul 2026)*
- [x] Food Manufacturing sector course — same shape (13 lessons, 4 quizzes,
      diagnostics, factory audit capstone); sectors page now grouped into
      Industrial / Buildings / Transportation categories *(Jul 2026)*
- [ ] More sectors (data centres next; Fleet Electrification & Depot Charging
      to open the Transportation category)

## Phase 4 — Commercialisation

Do not start until the content floor (Phase 2) is substantially done.

**Decision (Jul 2026): no display ads.** The economics don't work below tens
of thousands of sessions/month, and ads would undercut the professional-
reference positioning, hurt Core Web Vitals, and cannibalise the real funnel
(email list → paid tier → consultancy), where one engaged professional is
worth orders of magnitude more than their ad impressions. If pre-Phase-4
revenue is ever wanted at real traffic, direct sponsorship from relevant
vendors beats programmatic ads. Revisit only if traffic becomes large AND
Phase 4/5 monetisation fails.

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
