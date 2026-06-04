import { routing } from "@/i18n/routing";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getProfile } from "@/lib/profile";
import { getAbsoluteUrl, getSiteUrl } from "@/lib/site";
import type { Post } from "@/types/post";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export type FeedLocale = (typeof routing.locales)[number];

type FeedItem = {
  locale: FeedLocale;
  post: Post;
};

const FEED_DESCRIPTION =
  "Technical articles, tutorials, and thoughts from Charlie Fei.";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapCdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function toRssDate(date: string): string {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? new Date(0).toUTCString()
    : parsedDate.toUTCString();
}

function getLanguage(locale?: FeedLocale): string {
  if (locale === "zh") return "zh-CN";
  if (locale === "en") return "en-US";
  return "en-US";
}

function getFeedTitle(locale?: FeedLocale): string {
  if (locale === "en") return "Charlie's Personal Blog - English";
  if (locale === "zh") return "Charlie's Personal Blog - Chinese";
  return "Charlie's Personal Blog";
}

function getFeedPath(locale?: FeedLocale): string {
  return locale ? `/${locale}/rss.xml` : "/rss.xml";
}

function getFeedItems(locale?: FeedLocale): FeedItem[] {
  const locales = locale ? [locale] : routing.locales;

  return locales
    .flatMap((currentLocale) =>
      getAllPosts(currentLocale)
        .map((post) => getPostBySlug(post.slug, currentLocale))
        .filter((post): post is Post => Boolean(post))
        .map((post) => ({
          locale: currentLocale,
          post,
        }))
    )
    .sort(
      (a, b) =>
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    );
}

function renderCategory(category: string): string {
  return `            <category>${escapeXml(category)}</category>`;
}

function normalizeFeedHtml(html: string): string {
  return html
    .replace(/\s(href|src)="\/(?!\/)([^"]*)"/g, (_match, attr, path) => {
      return ` ${attr}="${escapeXml(getAbsoluteUrl(`/${path}`))}"`;
    })
    .replace(/\s(href|src)='\/(?!\/)([^']*)'/g, (_match, attr, path) => {
      return ` ${attr}="${escapeXml(getAbsoluteUrl(`/${path}`))}"`;
    });
}

async function markdownToHtml(content: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(content);

  return normalizeFeedHtml(String(file));
}

async function renderItem({ locale, post }: FeedItem): Promise<string> {
  const postUrl = getSiteUrl(`/${locale}/blog/${post.slug}/`);
  const categories = [post.category, ...post.tags]
    .filter(Boolean)
    .map(renderCategory)
    .join("\n");
  const contentHtml = await markdownToHtml(post.content);
  const authorEmail = getProfile().personal.email;

  return `        <item>
            <title>${wrapCdata(post.title)}</title>
            <link>${escapeXml(postUrl)}</link>
            <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
            <pubDate>${toRssDate(post.date)}</pubDate>
            <description>${wrapCdata(post.description)}</description>
            <content:encoded>${wrapCdata(contentHtml)}</content:encoded>
            <dc:creator>${escapeXml(post.author)}</dc:creator>
            <author>${escapeXml(`${authorEmail} (${post.author})`)}</author>
${categories}
        </item>`;
}

export async function generateRssFeed(locale?: FeedLocale): Promise<string> {
  const items = getFeedItems(locale);
  const updatedDate = items[0]?.post.date;
  const feedUrl = getSiteUrl(getFeedPath(locale));
  const siteUrl = getSiteUrl(locale ? `/${locale}/blog/` : "/");
  const profile = getProfile();
  const authorName = profile.personal.name;
  const avatarUrl = getAbsoluteUrl(profile.personal.avatar);
  const renderedItems = await Promise.all(items.map(renderItem));

  return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${escapeXml(getFeedTitle(locale))}</title>
        <link>${escapeXml(siteUrl)}</link>
        <description>${escapeXml(FEED_DESCRIPTION)}</description>
        <language>${getLanguage(locale)}</language>
        <lastBuildDate>${toRssDate(updatedDate || new Date().toISOString())}</lastBuildDate>
        <docs>https://validator.w3.org/feed/docs/rss2.html</docs>
        <generator>Charlie Fei Blog RSS Generator</generator>
        <image>
            <title>${escapeXml(authorName)}</title>
            <url>${escapeXml(avatarUrl)}</url>
            <link>${escapeXml(getSiteUrl("/"))}</link>
        </image>
        <copyright>All rights reserved by ${escapeXml(authorName)}</copyright>
        <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>
${renderedItems.join("\n")}
    </channel>
</rss>
`;
}
