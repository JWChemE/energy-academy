import { promises as fs } from "fs";
import path from "path";
import { curriculum, sectors, type Level } from "@/content/curriculum";
import { lessonExcerpt } from "@/lib/excerpt";
import { isGated } from "@/lib/content";
import { GLOSSARY } from "@/content/glossary";

/**
 * Build-time search index.
 *
 * Gating rule (must match app/api/lesson/route.ts and the lesson page):
 *   gated = isGated(level) — the single paywall rule from lib/content.ts
 *
 * For GATED lessons the index carries only what is already public on the
 * lesson page shell: title, summary and the short lead-paragraph excerpt.
 * Section headings (## lines) are indexed for PUBLIC (Level 1) lessons only,
 * so no gated body text ever reaches the client through search.
 */

export type SearchDoc = {
  /** Route to link to. */
  href: string;
  title: string;
  /** "Level 1" | "Level 2" | "Level 3" | "Sector" | "Reference" | "Tool" | "Glossary" | "Course" */
  badge: string;
  /** Course title for lessons; section context otherwise. */
  context: string;
  /** Shown as the result snippet and searched at weight 1. */
  snippet: string;
  /** Searched at weight 2. Only populated for public (Level 1) lessons. */
  headings: string;
  /** Reading minutes for lessons; 0 otherwise. */
  minutes: number;
};

const COURSES_DIR = path.join(process.cwd(), "content", "courses");

function levelBadge(level: Level): string {
  return level.kind === "sector" ? "Sector" : `Level ${level.number}`;
}


/** ## headings from MDX source (public lessons only). */
function extractHeadings(mdx: string): string {
  const matches = mdx.match(/^##\s+(.+)$/gm) ?? [];
  return matches
    .map((h) => h.replace(/^##\s+/, "").trim())
    .filter((h) => h.toLowerCase() !== "sources and further reading")
    .join(" · ");
}

function trimWords(text: string, maxWords: number): string {
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}…`;
}

export async function buildSearchIndex(): Promise<SearchDoc[]> {
  const docs: SearchDoc[] = [];

  for (const level of [...curriculum, ...sectors]) {
    const badge = levelBadge(level);
    const gated = isGated(level);

    for (const course of level.courses) {
      // Course pages are indexable for every course, including coming-soon.
      docs.push({
        href: `/courses/${course.slug}`,
        title: course.title,
        badge: "Course",
        context: badge,
        snippet: course.summary,
        headings: "",
        minutes: 0,
      });

      if (course.status !== "available") continue;

      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          let excerpt = "";
          let headings = "";
          try {
            const mdx = await fs.readFile(
              path.join(COURSES_DIR, course.slug, `${lesson.slug}.mdx`),
              "utf8",
            );
            excerpt = trimWords(lessonExcerpt(mdx, 120), 40);
            if (!gated) headings = extractHeadings(mdx);
          } catch {
            // Missing MDX: index the manifest metadata only.
          }

          docs.push({
            href: `/courses/${course.slug}/${lesson.slug}`,
            title: lesson.title,
            badge,
            context: course.title,
            snippet: excerpt || lesson.summary,
            headings,
            minutes: lesson.minutes,
          });
        }
      }
    }
  }

  // Reference pages, tools and the glossary — keep in step with app/ routes.
  const extras: SearchDoc[] = [
    {
      href: "/reference",
      title: "Quick reference",
      badge: "Reference",
      context: "Data tables",
      snippet:
        "Energy unit conversions, saturated steam tables, motor efficiency classes, typical plant efficiencies and UK reference prices in one place.",
      headings: "",
      minutes: 0,
    },
    {
      href: "/reference/energy-units",
      title: "Energy unit conversions",
      badge: "Reference",
      context: "Quick reference",
      snippet: "kWh, MJ, GJ, therms and tonnes of oil equivalent, with SI prefixes.",
      headings: "",
      minutes: 0,
    },
    {
      href: "/reference/saturated-steam",
      title: "Saturated steam table",
      badge: "Reference",
      context: "Quick reference",
      snippet:
        "Saturation temperature, sensible, latent and total heat by gauge pressure, plus pipe heat losses and flash steam fractions.",
      headings: "",
      minutes: 0,
    },
    {
      href: "/reference/motor-efficiency",
      title: "Motor efficiency classes",
      badge: "Reference",
      context: "Quick reference",
      snippet:
        "IE1 to IE4 efficiency, part-load efficiency, belt losses and the affinity laws.",
      headings: "",
      minutes: 0,
    },
    {
      href: "/reference/typical-plant-efficiency",
      title: "Typical plant efficiencies",
      badge: "Reference",
      context: "Quick reference",
      snippet:
        "Boilers, chillers, compressed air, lighting efficacy and heat pump COPs: the working figures for first-pass estimates.",
      headings: "",
      minutes: 0,
    },
    {
      href: "/reference/prices-and-carbon-factors",
      title: "Reference prices and carbon factors",
      badge: "Reference",
      context: "Quick reference",
      snippet:
        "The platform's standard energy prices and UK greenhouse-gas conversion factors, with their as-at dates.",
      headings: "",
      minutes: 0,
    },
    {
      href: "/tools",
      title: "Interactive tools",
      badge: "Tool",
      context: "Calculators & simulators",
      snippet:
        "Free calculators plus the course diagnostic simulators: payback, affinity laws, refrigeration cycle and more.",
      headings: "",
      minutes: 0,
    },
    {
      href: "/tools/payback-calculator",
      title: "Payback calculator",
      badge: "Tool",
      context: "Free tool",
      snippet: "Simple payback from capital cost and annual saving.",
      headings: "",
      minutes: 0,
    },
    {
      href: "/tools/affinity-laws",
      title: "Affinity laws explorer",
      badge: "Tool",
      context: "Free tool",
      snippet:
        "Interactive cube-law slider comparing VFD speed control with damper throttling on fans and pumps.",
      headings: "",
      minutes: 0,
    },
    {
      href: "/tools/vapour-compression-cycle",
      title: "Vapour-compression cycle explainer",
      badge: "Tool",
      context: "Free tool",
      snippet:
        "Step-through diagram of the refrigeration and heat pump cycle: evaporator, compressor, condenser, expansion valve.",
      headings: "",
      minutes: 0,
    },
  ];
  docs.push(...extras);

  // Glossary terms — each is its own search hit, linking to its anchor.
  for (const entry of GLOSSARY) {
    docs.push({
      href: `/glossary#${entry.anchor}`,
      title: entry.term,
      badge: "Glossary",
      context: "Glossary",
      snippet: entry.definition,
      headings: "",
      minutes: 0,
    });
  }

  return docs;
}
