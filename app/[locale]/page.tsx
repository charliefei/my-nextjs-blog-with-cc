import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProfile } from "@/lib/profile";
import { getAllPosts } from "@/lib/posts";
import { getExperienceData } from "@/lib/experience";
import { HomeContent } from "@/components/home/home-content";
import { buildPageMetadata, type Locale } from "@/lib/seo";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return buildPageMetadata({
    locale: locale as Locale,
    path: "/",
    title: t("title"),
    description: t("description"),
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const profile = getProfile();
  const posts = getAllPosts(locale).slice(0, 3);
  const postCount = getAllPosts(locale).length;
  const experienceData = getExperienceData(locale);

  return <HomeContent profile={profile} posts={posts} postCount={postCount} experienceData={experienceData} />;
}
