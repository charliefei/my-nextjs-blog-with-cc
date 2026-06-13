import fs from "fs";
import path from "path";
import { FriendLink } from "@/types/link";
import { getAssetPath } from "./utils";

const linksDirectory = path.join(process.cwd(), "content/links");
const linksPath = path.join(linksDirectory, "links.json");

function withAssetPath(link: FriendLink): FriendLink {
  return {
    ...link,
    avatar: link.avatar ? getAssetPath(link.avatar) : link.avatar,
  };
}

export function getFriendLinks(): FriendLink[] {
  if (!fs.existsSync(linksPath)) {
    return [];
  }

  return (JSON.parse(fs.readFileSync(linksPath, "utf8")) as FriendLink[]).map(withAssetPath);
}
