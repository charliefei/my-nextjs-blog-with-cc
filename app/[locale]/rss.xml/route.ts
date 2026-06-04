import { routing } from "@/i18n/routing";
import { generateRssFeed, type FeedLocale } from "@/lib/rss";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;

  return new Response(await generateRssFeed(locale as FeedLocale), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
