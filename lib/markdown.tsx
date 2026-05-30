"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { slugify } from "@/lib/toc";

interface MarkdownRendererProps {
  content: string;
  highlightedCode?: Record<string, string>;
}

function HeadingWithAnchor({
  level,
  id,
  className,
  children,
}: {
  level: 1 | 2 | 3 | 4;
  id: string;
  className: string;
  children: React.ReactNode;
}) {
  const Tag = `h${level}` as const;
  return (
    <Tag id={id} className={className}>
      {children}
      <a href={`#${id}`} className="heading-anchor" aria-hidden="true">
        #
      </a>
    </Tag>
  );
}

export function MarkdownRenderer({ content, highlightedCode = {} }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => {
          const text = String(children);
          const id = slugify(text);
          return (
            <HeadingWithAnchor level={1} id={id} className="font-heading text-3xl md:text-4xl font-bold mt-10 md:mt-14 mb-4 md:mb-6 scroll-mt-24">
              {children}
            </HeadingWithAnchor>
          );
        },
        h2: ({ children }) => {
          const text = String(children);
          const id = slugify(text);
          return (
            <HeadingWithAnchor level={2} id={id} className="font-heading text-2xl md:text-3xl font-semibold mt-8 md:mt-12 mb-3 md:mb-4 scroll-mt-24">
              {children}
            </HeadingWithAnchor>
          );
        },
        h3: ({ children }) => {
          const text = String(children);
          const id = slugify(text);
          return (
            <HeadingWithAnchor level={3} id={id} className="font-heading text-xl md:text-2xl font-semibold mt-6 md:mt-8 mb-2 md:mb-3 scroll-mt-24">
              {children}
            </HeadingWithAnchor>
          );
        },
        h4: ({ children }) => {
          const text = String(children);
          const id = slugify(text);
          return (
            <HeadingWithAnchor level={4} id={id} className="font-heading text-lg md:text-xl font-semibold mt-5 md:mt-6 mb-2 scroll-mt-24">
              {children}
            </HeadingWithAnchor>
          );
        },
        blockquote: ({ children }) => (
          <blockquote className="border-l-3 pl-4 md:pl-5 italic text-muted-foreground text-sm md:text-base rounded-r-lg py-3 px-4 md:px-5 my-6 bg-primary/4 dark:bg-primary/8">
            {children}
          </blockquote>
        ),
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt || ""}
            className="prose-image rounded-xl shadow-lg my-6 w-full"
            loading="lazy"
          />
        ),
        hr: () => (
          <div className="gradient-divider my-10" role="separator" />
        ),
        table: ({ children }) => (
          <div className="table-wrapper">
            <table className="border-collapse text-sm md:text-base">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="px-2 md:px-4 py-2 border border-border/40 bg-muted/30 font-semibold text-left">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-2 md:px-4 py-2 border border-border/40">
            {children}
          </td>
        ),
        p: ({ children }) => (
          <p className="text-sm md:text-base leading-relaxed mb-4 md:mb-5 wrap-break-word">
            {children}
          </p>
        ),
        a: ({ href, children, ...props }) => (
          <a
            href={href}
            className="underline decoration-primary/30 hover:decoration-primary underline-offset-2 transition-colors break-all"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            {...props}
          >
            {children}
          </a>
        ),
        pre: ({ children }) => {
          const codeElement = children as React.ReactNode;
          let codeContent = "";
          let lang = "";

          if (codeElement && typeof codeElement === "object") {
            const child = codeElement as { props?: { className?: string; children?: React.ReactNode } };
            const langMatch = child.props?.className?.match(/language-(\w+)/);
            lang = langMatch?.[1] ?? "";
            if (child.props?.children) {
              if (typeof child.props.children === "string") {
                codeContent = child.props.children;
              } else if (child.props.children && typeof child.props.children === "object") {
                const nested = child.props.children as React.ReactNode[];
                if (Array.isArray(nested)) {
                  codeContent = nested.map(n => {
                    if (typeof n === "string") return n;
                    const node = n as { props?: { children?: string } };
                    return node.props?.children || "";
                  }).join("");
                }
              }
            }
          }

          const lineCount = codeContent.trim().split("\n").length;
          const highlighted = highlightedCode[codeContent.trim()];

          return (
            <CodeBlock
              content={codeContent.trim()}
              collapsible={lineCount > 15}
              highlightedHtml={highlighted}
              lang={lang || "plaintext"}
            >
              {children}
            </CodeBlock>
          );
        },
        code: ({ className, children, ...props }) => {
          const isInline = !className;

          if (isInline) {
            return (
              <code
                className="inline-code px-1.5 py-0.5 rounded-md bg-muted/70 border border-border/30 font-mono text-sm break-all"
                {...props}
              >
                {children}
              </code>
            );
          }

          const langMatch = className?.match(/language-(\w+)/);
          const lang = langMatch?.[1];

          return (
            <code className={`font-mono ${className || ""}`} data-lang={lang} style={{ whiteSpace: "pre" }} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// Code block with copy + collapse
function CodeBlock({
  content,
  collapsible,
  highlightedHtml,
  lang,
  children,
}: {
  content: string;
  collapsible: boolean;
  highlightedHtml?: string;
  lang: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(collapsible);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const preClassName = `relative rounded-xl border border-border/40 p-3 md:p-4 pt-4 md:pt-5 text-sm leading-normal shadow-sm font-mono overflow-x-auto transition-[max-height] duration-300 ${collapsed ? "max-h-50 overflow-hidden" : ""}`;
  const preStyle = {
    background: "var(--code-bg)",
    color: "var(--code-text)",
    maxWidth: "100%",
  } as const;

  return (
    <div className="code-block-wrapper group relative my-6 max-w-full overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span
          className="px-2 py-1 rounded-md bg-muted/50 border border-border/30 text-muted-foreground font-mono text-xs leading-none select-none"
          aria-label={`Language: ${lang}`}
        >
          {lang}
        </span>
        {collapsible && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md bg-muted/50 hover:bg-muted border border-border/30 text-muted-foreground hover:text-foreground"
            aria-label={collapsed ? "Expand code" : "Collapse code"}
          >
            <CollapseIcon className="h-3.5 w-3.5" collapsed={collapsed} />
          </button>
        )}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-muted/50 hover:bg-muted border border-border/30 text-muted-foreground hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? (
            <CheckIcon className="h-3.5 w-3.5 text-primary" />
          ) : (
            <CopyIcon className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Code container — highlighted HTML (Shiki) when available, plain otherwise */}
      {highlightedHtml ? (
        <pre
          className={preClassName}
          style={preStyle}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className={preClassName} style={preStyle}>
          {children}
        </pre>
      )}

      {/* Collapsed fade overlay + expand button */}
      {collapsed && (
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
          <div className="w-full h-16 bg-linear-to-t from-(--code-bg) to-transparent" />
          <button
            onClick={() => setCollapsed(false)}
            className="absolute bottom-2 px-3 py-1 text-xs font-medium rounded-md bg-muted/80 hover:bg-muted border border-border/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            &#x25BC; Expand
          </button>
        </div>
      )}
    </div>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CollapseIcon({ className, collapsed }: { className?: string; collapsed: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {collapsed ? (
        <>
          <polyline points="7 13 12 18 17 13" />
          <polyline points="7 6 12 11 17 6" />
        </>
      ) : (
        <>
          <polyline points="17 11 12 6 7 11" />
          <polyline points="17 18 12 13 7 18" />
        </>
      )}
    </svg>
  );
}