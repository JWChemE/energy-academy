# Energy Academy

A Coursera-style web app for learning **energy management**, structured into three
tiers — Foundations, System Deep Dives, and Leadership & Strategy.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, and MDX.

## Getting started

```bash
npm install      # first time only
npm run dev      # http://localhost:3000
```

Other commands:

```bash
npm run build    # production build (statically generates every page)
npm run start    # serve the production build
npm run lint     # eslint
```

## What's here so far

- The full **three-tier curriculum** for 30 courses (the catalogue), defined in
  `content/curriculum.ts`.
- One complete course, end to end: **Introduction to Energy Management**
  (7 lessons across 3 modules) with prose, callouts, a YouTube embed, an
  interactive payback calculator, and a scored quiz.
- The remaining courses appear as "coming soon" teasers, ready to be filled in.

## Adding content

See **`AGENTS.md`** (imported by `CLAUDE.md`) for the full guide. In short:

- Lessons are MDX files in `content/courses/<course>/<lesson>.mdx`, listed in the
  manifest at `content/curriculum.ts`.
- Quizzes live in `content/quizzes.ts` and are referenced from MDX as
  `<Quiz id="..." />`.
- Reusable lesson components (`Callout`, `Figure`, `YouTubeEmbed`, `Quiz`,
  `PaybackCalculator`) are registered in `components/mdx/index.tsx`.

## Deploying

Designed to deploy to [Vercel](https://vercel.com/new) with zero config (it's a
standard Next.js app). Push to a Git repo and import it, or run `vercel`.
