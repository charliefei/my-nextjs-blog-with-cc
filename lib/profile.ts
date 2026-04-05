import { ProfileConfig } from "@/types/profile";
import profileData from "@/content/config/profile.json";

export function getProfile(): ProfileConfig {
  return profileData as ProfileConfig;
}

export function getSocialLink(
  platform: ProfileConfig["social"][number]["platform"]
): ProfileConfig["social"][number] | undefined {
  return getProfile().social.find((link) => link.platform === platform);
}