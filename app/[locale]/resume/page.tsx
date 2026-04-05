import { setRequestLocale } from "next-intl/server";
import { getProfile } from "@/lib/profile";
import { ResumeContent } from "@/components/resume/resume-content";

interface ResumePageProps {
  params: Promise<{ locale: string }>;
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const profile = getProfile();

  return <ResumeContent profile={profile} />;
}