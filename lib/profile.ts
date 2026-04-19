import { ProfileConfig } from "@/types/profile";
import profileData from "@/content/config/profile.json";
import { getAssetPath } from "./utils";

export function getProfile(): ProfileConfig {
  const profile = profileData as ProfileConfig;
  // Add basePath to asset URLs
  return {
    ...profile,
    personal: {
      ...profile.personal,
      avatar: getAssetPath(profile.personal.avatar),
    },
    resume: {
      ...profile.resume,
      pdfUrl: getAssetPath(profile.resume.pdfUrl),
    },
  };
}

export function getSocialLink(
  platform: ProfileConfig["social"][number]["platform"]
): ProfileConfig["social"][number] | undefined {
  return getProfile().social.find((link) => link.platform === platform);
}