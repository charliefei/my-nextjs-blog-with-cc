import type { Metadata } from "next";
import { LocaleRedirect } from "@/components/layout/locale-redirect";
import { getLanguageAlternates, SITE_NAME } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: SITE_NAME,
  description:
    "Charlie Fei's personal blog for full-stack development writing, AI coding notes, projects, resume, and professional experience.",
  alternates: {
    canonical: getSiteUrl("/"),
    languages: getLanguageAlternates("/"),
  },
};

export default function RootPage() {
  return <LocaleRedirect />;
}
