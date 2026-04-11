import { setRequestLocale } from "next-intl/server";
import { getProfile } from "@/lib/profile";
import { getAllPosts } from "@/lib/posts";
import { getExperienceData } from "@/lib/experience";
import { HomeContent } from "@/components/home/home-content";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const profile = getProfile();
  const posts = getAllPosts(locale).slice(0, 3);
  const experienceData = getExperienceData(locale);

  return <HomeContent profile={profile} posts={posts} experienceData={experienceData} />;
}