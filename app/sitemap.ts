import type { MetadataRoute } from "next";
import {
  getLevels,
  getSectors,
  getAllLessonParams,
  getAllCourseParams,
} from "@/lib/content";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * Sitemap for every public URL. Lesson pages are included even when their
 * body is gated — the page shell (title, summary, outline and, for gated
 * lessons, the preview excerpt) is public and indexable.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/sectors`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${SITE_URL}/resources/energy-audit-checklist`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Knowledge-base pages. /search is deliberately excluded (noindex).
    { url: `${SITE_URL}/tools`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/tools/payback-calculator`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/tools/affinity-laws`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/tools/vapour-compression-cycle`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/reference`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/reference/energy-units`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/reference/saturated-steam`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/reference/motor-efficiency`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/reference/typical-plant-efficiency`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/reference/prices-and-carbon-factors`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/glossary`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const levelPages: MetadataRoute.Sitemap = getLevels().map((l) => ({
    url: `${SITE_URL}/levels/${l.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const sectorPages: MetadataRoute.Sitemap = getSectors().map((s) => ({
    url: `${SITE_URL}/sectors/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const coursePages: MetadataRoute.Sitemap = getAllCourseParams().map(({ course }) => ({
    url: `${SITE_URL}/courses/${course}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const lessonPages: MetadataRoute.Sitemap = getAllLessonParams().map(
    ({ course, lesson }) => ({
      url: `${SITE_URL}/courses/${course}/${lesson}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  return [...staticPages, ...levelPages, ...sectorPages, ...coursePages, ...lessonPages];
}
