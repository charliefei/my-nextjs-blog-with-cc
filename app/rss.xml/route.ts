import { generateRssFeed } from "@/lib/rss";

export const dynamic = "force-static";

export async function GET() {
  return new Response(await generateRssFeed(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
