import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllPosts } from "@/lib/posts";
import { getSiteUrl } from "@/lib/site";
import {
  getLanguageAlternates,
  getLocalizedPath,
  type Locale,
} from "@/lib/seo";

export const dynamic = "force-static";

type SitemapEntry = MetadataRoute.Sitemap[number];

const staticPaths = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/blog/", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about/", changeFrequency: "monthly", priority: 0.7 },
  { path: "/experience/", changeFrequency: "monthly", priority: 0.7 },
  { path: "/resume/", changeFrequency: "monthly", priority: 0.6 },
] as const;

function toDate(date: string): Date | undefined {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: SitemapEntry[] = routing.locales.flatMap((locale) =>
    staticPaths.map((entry): SitemapEntry => ({
      url: getSiteUrl(getLocalizedPath(locale, entry.path)),
      lastModified: new Date(),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: getLanguageAlternates(entry.path),
      },
    }))
  );

  const postEntries: SitemapEntry[] = routing.locales.flatMap((locale) =>
    getAllPosts(locale).map((post) => {
      const path = `/blog/${post.slug}/`;
      const languages: Record<string, string> = {};

      routing.locales.forEach((alternateLocale) => {
        const alternatePost = getAllPosts(alternateLocale).find(
          (candidate) => candidate.slug === post.slug
        );

        if (alternatePost) {
          const key = alternateLocale === "zh" ? "zh-CN" : "en-US";
          languages[key] = getSiteUrl(
            getLocalizedPath(alternateLocale as Locale, path)
          );
        }
      });

      if (languages["en-US"]) {
        languages["x-default"] = languages["en-US"];
      }

      return {
        url: getSiteUrl(getLocalizedPath(locale, path)),
        lastModified: toDate(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates:
          Object.keys(languages).length > 0 ? { languages } : undefined,
      } satisfies SitemapEntry;
    })
  );

  return [...staticEntries, ...postEntries];
}
