import type { Metadata } from "next";
import type { ProfileConfig } from "@/types/profile";
import { routing } from "@/i18n/routing";
import { getAbsoluteUrl, getSiteUrl } from "@/lib/site";

export type Locale = (typeof routing.locales)[number];

export const SITE_NAME = "Charlie's Personal Blog";
export const DEFAULT_LOCALE = routing.defaultLocale;
export const DEFAULT_OG_IMAGE = "/logo.png";

const localeConfig = {
  en: {
    ogLocale: "en_US",
    htmlLang: "en-US",
    keywords: [
      "Charlie Fei",
      "personal blog",
      "full stack developer",
      "frontend development",
      "AI coding",
      "Next.js",
      "TypeScript",
    ],
  },
  zh: {
    ogLocale: "zh_CN",
    htmlLang: "zh-CN",
    keywords: [
      "Charlie Fei",
      "个人博客",
      "全栈开发",
      "前端开发",
      "AI Coding",
      "Next.js",
      "TypeScript",
    ],
  },
} satisfies Record<
  Locale,
  {
    ogLocale: string;
    htmlLang: string;
    keywords: string[];
  }
>;

function normalizePath(path = "/"): string {
  if (path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
}

export function getLocalizedPath(locale: Locale, path = "/"): string {
  const normalizedPath = normalizePath(path);
  if (normalizedPath === "/") {
    return `/${locale}/`;
  }

  return `/${locale}${normalizedPath}`;
}

export function getLanguageAlternates(path = "/"): Record<string, string> {
  return {
    "en-US": getSiteUrl(getLocalizedPath("en", path)),
    "zh-CN": getSiteUrl(getLocalizedPath("zh", path)),
    "x-default": getSiteUrl(getLocalizedPath(DEFAULT_LOCALE, path)),
  };
}

export function getLocaleConfig(locale: string) {
  return localeConfig[locale as Locale] ?? localeConfig[DEFAULT_LOCALE];
}

export function getProfileSameAs(profile: ProfileConfig): string[] {
  return profile.social
    .map((link) => link.url)
    .filter((url) => /^https?:\/\//i.test(url));
}

export function getPersonJsonLd(profile: ProfileConfig) {
  const sameAs = getProfileSameAs(profile);

  return {
    "@type": "Person",
    "@id": getSiteUrl("/#person"),
    name: profile.personal.name,
    url: getSiteUrl("/"),
    image: getAbsoluteUrl(profile.personal.avatar),
    jobTitle: profile.personal.profession,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.personal.location,
    },
    ...(profile.personal.email ? { email: profile.personal.email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function getWebsiteJsonLd(locale: Locale, profile: ProfileConfig) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      getPersonJsonLd(profile),
      {
        "@type": "WebSite",
        "@id": getSiteUrl("/#website"),
        name: SITE_NAME,
        url: getSiteUrl("/"),
        inLanguage: getLocaleConfig(locale).htmlLang,
        publisher: {
          "@id": getSiteUrl("/#person"),
        },
      },
    ],
  };
}

export function getBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  type = "website",
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const config = getLocaleConfig(locale);
  const canonical = getSiteUrl(getLocalizedPath(locale, path));
  const imageUrl = getAbsoluteUrl(image);

  return {
    title,
    description,
    keywords: config.keywords,
    alternates: {
      canonical,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type,
      locale: config.ogLocale,
      images: [
        {
          url: imageUrl,
          width: image === DEFAULT_OG_IMAGE ? 1638 : 1200,
          height: image === DEFAULT_OG_IMAGE ? 1638 : 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
