import { ProfileConfig } from "@/types/profile";
import profileData from "@/content/config/profile.json";
import { getAssetPath } from "./utils";

export function getProfile(): ProfileConfig {
  const profile = profileData as ProfileConfig;
  // Add basePath to avatar URL (used in img tags, not Link components)
  return {
    ...profile,
    personal: {
      ...profile.personal,
      avatar: getAssetPath(profile.personal.avatar),
    },
    // pdfUrl is used with Link component which auto-adds basePath,
    // and iframe which needs manual basePath - handle in components
  };
}

export function getSocialLink(
  platform: ProfileConfig["social"][number]["platform"]
): ProfileConfig["social"][number] | undefined {
  return getProfile().social.find((link) => link.platform === platform);
}

// Get PDF URL with basePath for iframe/native elements
export function getPdfUrl(): string {
  const profile = profileData as ProfileConfig;
  return getAssetPath(profile.resume.pdfUrl);
}