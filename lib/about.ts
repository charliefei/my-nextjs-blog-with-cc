import fs from "fs";
import path from "path";

const configDirectory = path.join(process.cwd(), "content/config");

export function getAboutMarkdown(locale: string): string {
  const localizedPath = path.join(configDirectory, `about.${locale}.md`);
  const fallbackPath = path.join(configDirectory, "about.en.md");
  const filePath = fs.existsSync(localizedPath) ? localizedPath : fallbackPath;

  if (!fs.existsSync(filePath)) {
    return "";
  }

  return fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
}
