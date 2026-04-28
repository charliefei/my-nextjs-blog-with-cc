/**
 * Flatten RSC segment data file paths for static export deployments.
 *
 * Next.js 16 static export generates RSC .txt files in nested directories
 * (e.g., __next.$d$locale/blog/$d$slug/__PAGE__.txt), but the client router
 * requests them using flat dot-separated URLs
 * (e.g., __next.$d$locale.blog.$d$slug.__PAGE__.txt).
 *
 * This script copies the nested files to flat paths to fix 404 errors on
 * static hosting platforms like GitHub Pages.
 *
 * Usage: node scripts/flatten-rsc-paths.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUT_DIR = path.resolve(__dirname, "../out");

/**
 * Recursively find all files under a directory
 */
function findFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Find RSC files that need flattening and compute their flat paths.
 * Returns an array of { src, dest } objects.
 */
function getFlatRscMappings() {
  const mappings = [];
  const allFiles = findFiles(OUT_DIR);

  for (const file of allFiles) {
    const relative = path.relative(OUT_DIR, file).replace(/\\/g, "/");
    const parts = relative.split("/");

    for (let i = 0; i < parts.length; i++) {
      if (parts[i].startsWith("__next.")) {
        const nestedParts = parts.slice(i + 1);

        // Skip: no files inside __next. directory at all
        if (nestedParts.length === 0) break;

        // Skip: __next._* internal directories (like __next._full, __next._tree)
        const segmentPath = parts[i].substring("__next.".length);
        if (segmentPath.startsWith("_")) break;

        // Build the flat filename
        // e.g., __next.$d$locale/blog/$d$slug/__PAGE__.txt
        //       -> __next.$d$locale.blog.$d$slug.__PAGE__.txt
        const nestedPath = nestedParts.join(".").replace(/\.txt$/, "");
        const flatName = `__next.${segmentPath}.${nestedPath}.txt`;

        // Base directory is everything before the __next. directory
        const baseDirParts = parts.slice(0, i);
        const baseDir = path.join(OUT_DIR, ...baseDirParts);
        const flatPath = path.join(baseDir, flatName);

        mappings.push({ src: file, dest: flatPath });
        break;
      }
    }
  }

  return mappings;
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error("out/ directory not found. Run `next build` first.");
    process.exit(1);
  }

  // Clean up any outdated flat files from previous runs
  const allTxtFiles = findFiles(OUT_DIR).filter((f) => f.endsWith(".txt"));
  let cleaned = 0;
  for (const file of allTxtFiles) {
    const relative = path.relative(OUT_DIR, file).replace(/\\/g, "/");
    const parts = relative.split("/");
    const basename = path.basename(file);

    // Skip index.txt files
    if (basename === "index.txt") continue;

    // Skip files inside __next. directories (original files)
    if (parts.some((p) => p.startsWith("__next."))) continue;

    // Delete flat RSC files that will be regenerated
    if (basename.startsWith("__next.")) {
      fs.unlinkSync(file);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    console.log(`Cleaned ${cleaned} outdated flat file(s)`);
  }

  // Create flat copies for nested RSC files
  const mappings = getFlatRscMappings();
  let flattened = 0;

  for (const { src, dest } of mappings) {
    if (fs.existsSync(dest)) continue;

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    flattened++;
    console.log(`  ${path.basename(dest)}`);
  }

  console.log(`\nFlattened ${flattened} RSC path(s)`);
}

main();
