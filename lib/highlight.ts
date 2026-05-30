import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import { visit } from "unist-util-visit";
import { toHtml } from "hast-util-to-html";
import type { Root } from "mdast";
import type { Element, Root as HastRoot } from "hast";

const prettyCodeOptions: Options = {
  theme: { dark: "one-dark-pro", light: "github-light" },
  keepBackground: false,
  grid: true,
  defaultLang: "plaintext",
};

/**
 * Server-only: highlight every fenced code block in the markdown with
 * rehype-pretty-code (Shiki). Returns a map keyed by the trimmed source of
 * each block to its highlighted `<code>` HTML string.
 *
 * Runs at build time only — the client renderer (lib/markdown.tsx) is
 * synchronous and cannot run the async Shiki pipeline itself, so it looks up
 * the precomputed HTML from this map by source text.
 */
export async function highlightCodeBlocks(
  content: string,
): Promise<Record<string, string>> {
  // Pass 1: collect raw block sources in document order (matches the key the
  // client computes from the rendered code element's text).
  const mdast = unified().use(remarkParse).use(remarkGfm).parse(content) as Root;
  const sources: string[] = [];
  visit(mdast, "code", (node) => {
    sources.push(node.value);
  });

  if (sources.length === 0) return {};

  // Pass 2: run the highlighter and collect each figure's <code> HTML in order.
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, prettyCodeOptions);

  const tree = (await processor.run(processor.parse(content))) as HastRoot;

  const codeHtmls: string[] = [];
  visit(tree, "element", (node: Element) => {
    const isFigure =
      node.tagName === "figure" &&
      node.properties != null &&
      "data-rehype-pretty-code-figure" in node.properties;
    if (!isFigure) return;

    let codeEl: Element | null = null;
    visit(node, "element", (child: Element) => {
      if (child.tagName === "code") codeEl = child;
    });
    if (codeEl) codeHtmls.push(toHtml(codeEl));
    return "skip"; // don't descend into the figure again
  });

  // Zip sources to highlighted HTML by document order.
  const map: Record<string, string> = {};
  const len = Math.min(sources.length, codeHtmls.length);
  for (let i = 0; i < len; i++) {
    map[sources[i].trim()] = codeHtmls[i];
  }
  return map;
}
