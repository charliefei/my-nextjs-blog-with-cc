/**
 * Fix locale-specific HTML attributes that cannot be derived in the root
 * layout during static export.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.resolve(__dirname, "../out");

function findHtmlFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...findHtmlFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      results.push(fullPath);
    }
  }

  return results;
}

function getLangForPath(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");

  if (normalized === "zh.html" || normalized.startsWith("zh/")) {
    return "zh-CN";
  }

  if (normalized === "en.html" || normalized.startsWith("en/")) {
    return "en-US";
  }

  return "en-US";
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error("out/ directory not found. Run `next build` first.");
    process.exit(1);
  }

  let fixed = 0;

  for (const file of findHtmlFiles(OUT_DIR)) {
    const relativePath = path.relative(OUT_DIR, file);
    const lang = getLangForPath(relativePath);
    const html = fs.readFileSync(file, "utf8");
    const nextHtml = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);

    if (nextHtml !== html) {
      fs.writeFileSync(file, nextHtml, "utf8");
      fixed++;
    }
  }

  console.log(`Fixed HTML lang attribute in ${fixed} file(s)`);
}

main();
