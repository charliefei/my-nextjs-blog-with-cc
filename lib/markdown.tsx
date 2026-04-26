"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { slugify } from "@/lib/toc";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Custom heading components with anchor IDs
        h1: ({ children }) => {
          const text = String(children);
          const id = slugify(text);
          return (
            <h1 id={id} className="font-heading text-3xl md:text-4xl font-bold mt-10 md:mt-14 mb-4 md:mb-6 scroll-mt-20">
              {children}
            </h1>
          );
        },
        h2: ({ children }) => {
          const text = String(children);
          const id = slugify(text);
          return (
            <h2 id={id} className="font-heading text-2xl md:text-3xl font-semibold mt-8 md:mt-12 mb-3 md:mb-4 scroll-mt-20">
              {children}
            </h2>
          );
        },
        h3: ({ children }) => {
          const text = String(children);
          const id = slugify(text);
          return (
            <h3 id={id} className="font-heading text-xl md:text-2xl font-semibold mt-6 md:mt-8 mb-2 md:mb-3 scroll-mt-20">
              {children}
            </h3>
          );
        },
        h4: ({ children }) => {
          const text = String(children);
          const id = slugify(text);
          return (
            <h4 id={id} className="font-heading text-lg md:text-xl font-semibold mt-5 md:mt-6 mb-2 scroll-mt-20">
              {children}
            </h4>
          );
        },
        // Table wrapper for horizontal scroll
        table: ({ children }) => (
          <div className="table-wrapper">
            <table className="w-full border-collapse text-sm md:text-base">
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
        // Paragraph with overflow protection
        p: ({ children }) => (
          <p className="text-base md:text-lg leading-relaxed mb-4 md:mb-6 break-words">
            {children}
          </p>
        ),
        // Link with word break for long URLs
        a: ({ href, children, ...props }) => (
          <a
            href={href}
            className="underline decoration-primary/30 hover:decoration-primary transition-colors break-all"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            {...props}
          >
            {children}
          </a>
        ),
        // Custom code block wrapper with copy button
        pre: ({ children, ...props }) => {
          const codeElement = children as React.ReactNode;
          let codeContent = "";

          // Extract code content for copy
          if (codeElement && typeof codeElement === "object") {
            const child = codeElement as { props?: { children?: React.ReactNode } };
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

          return (
            <div className="code-block-wrapper group relative my-6 max-w-full overflow-hidden">
              {/* Copy button */}
              <CopyButton content={codeContent.trim()} />
              {/* Code container */}
              <pre
                className="relative rounded-lg border border-border/40 p-3 md:p-4 pt-4 md:pt-5 text-sm leading-relaxed shadow-sm font-mono overflow-x-auto"
                style={{ background: "var(--code-bg)", color: "var(--code-text)", maxWidth: "100%" }}
              >
                {children}
              </pre>
            </div>
          );
        },
        // Inline code styling with overflow protection
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

          // Block code with language class
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

// Copy button component
function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-md bg-muted/50 hover:bg-muted border border-border/30 text-muted-foreground hover:text-foreground"
      aria-label="Copy code"
    >
      {copied ? (
        <CheckIcon className="h-3.5 w-3.5 text-primary" />
      ) : (
        <CopyIcon className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

// Simple icons
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