import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProfile } from "@/lib/profile";
import { getSkills } from "@/lib/experience";
import { getAboutMarkdown } from "@/lib/about";
import { getFriendLinks } from "@/lib/links";
import { AboutContent } from "@/components/about/about-content";
import { buildPageMetadata, type Locale } from "@/lib/seo";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });

  return buildPageMetadata({
    locale: locale as Locale,
    path: "/about/",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const profile = getProfile();
  const skills = getSkills(locale);
  const aboutMarkdown = getAboutMarkdown(locale);
  const links = getFriendLinks();

  return (
    <AboutContent
      profile={profile}
      locale={locale}
      skills={skills}
      aboutMarkdown={aboutMarkdown}
      links={links}
    />
  );
}
