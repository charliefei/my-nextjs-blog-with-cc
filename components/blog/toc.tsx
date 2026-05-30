"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { TocItem, TocNode, buildTocTree } from "@/lib/toc";
import { List, ChevronDown, ChevronRight, ChevronUp } from "lucide-react";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const t = useTranslations("blog");
  const [activeId, setActiveId] = useState<string>("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Track which nodes are expanded (by id). Default: expand all.
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Build tree once
  const tree = useRef<TocNode[]>(buildTocTree(items));

  // Collect all IDs in the tree for observer registration
  const allIds = useRef<string[]>(items.map((i) => i.id));

  // Initialize expanded state — expand all on first render
  useEffect(() => {
    setExpandedIds(new Set(allIds.current));
  }, []);

  // Intersection Observer for active heading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break; // Use the first intersecting one (topmost visible)
          }
        }
      },
      {
        rootMargin: "-15% 0% -70% 0%",
        threshold: 0,
      }
    );

    for (const id of allIds.current) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [items]);

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileOpen(false);
    }
  }, []);

  const toggleNode = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedIds(new Set(allIds.current));
  }, []);

  const collapseAll = useCallback(() => {
    // Only keep root-level items expanded (those without children can remain)
    setExpandedIds(new Set());
  }, []);

  const hasAnyCollapsible = tree.current.some(
    (node) => node.children.length > 0 || hasCollapsibleDescendants(node)
  );

  if (items.length === 0) return null;

  const totalItems = items.length;

  return (
    <>
      {/* ── Mobile TOC ── */}
      <div className="lg:hidden sticky top-16 z-40 -mx-6 px-6 py-3 bg-background/95 backdrop-blur-sm border-b border-border/30">
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors shadow-sm"
        >
          <List className="h-4 w-4" />
          <span>{t("toc")}</span>
          <span className="text-xs text-muted-foreground tabular-nums">({totalItems})</span>
          {isMobileOpen ? (
            <ChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </button>

        {isMobileOpen && (
          <div className="mt-3 mb-3 p-3 rounded-xl border border-border/40 bg-card/80 backdrop-blur-md animate-slide-up shadow-lg max-h-[60vh] overflow-y-auto">
            {/* Expand/Collapse all for mobile */}
            {hasAnyCollapsible && (
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/20">
                <button
                  type="button"
                  onClick={expandAll}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("tocExpandAll")}
                </button>
                <span className="text-border/60">·</span>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("tocCollapseAll")}
                </button>
              </div>
            )}
            <nav className="space-y-0.5">
              {tree.current.map((node) => (
                <TocTreeNode
                  key={node.id}
                  node={node}
                  activeId={activeId}
                  expandedIds={expandedIds}
                  onToggle={toggleNode}
                  onScroll={scrollToHeading}
                />
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* ── Desktop Sidebar TOC ── */}
      <div ref={containerRef} className="hidden lg:block">
        <div className="p-4 rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/30">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <List className="h-4 w-4 text-primary" />
              <span>{t("toc")}</span>
              <span className="text-xs text-muted-foreground tabular-nums">({totalItems})</span>
            </div>
            {hasAnyCollapsible && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={expandAll}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
                  title={t("tocExpandAll")}
                >
                  {t("tocExpandAll")}
                </button>
                <span className="text-border/50 text-xs">·</span>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors px-1"
                  title={t("tocCollapseAll")}
                >
                  {t("tocCollapseAll")}
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="toc-nav relative space-y-0.5 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin">
            {tree.current.map((node) => (
              <TocTreeNode
                key={node.id}
                node={node}
                activeId={activeId}
                expandedIds={expandedIds}
                onToggle={toggleNode}
                onScroll={scrollToHeading}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   Recursive tree node component
   ───────────────────────────────────────────── */

interface TocTreeNodeProps {
  node: TocNode;
  activeId: string;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onScroll: (id: string) => void;
  depth?: number;
}

function TocTreeNode({
  node,
  activeId,
  expandedIds,
  onToggle,
  onScroll,
  depth = 0,
}: TocTreeNodeProps) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isActive = activeId === node.id;

  // A node is "implicitly active" if one of its descendants is the active heading
  const isImplicitlyActive =
    !isActive &&
    hasChildren &&
    isDescendantActive(node, activeId);

  return (
    <div>
      {/* Node row */}
      <div
        className={`toc-node-row ${isActive ? "toc-node-active" : ""} ${isImplicitlyActive ? "toc-node-implicit" : ""}`}
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        {/* Expand/Collapse Chevron */}
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            className="toc-chevron shrink-0"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <ChevronRight
              className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
            />
          </button>
        ) : (
          <span className="toc-leaf-marker shrink-0" />
        )}

        {/* Label button */}
        <button
          type="button"
          onClick={() => onScroll(node.id)}
          className={`toc-label block w-full text-left text-sm transition-colors duration-200 truncate ${isActive ? "text-primary font-medium" : "text-muted-foreground"} ${depth === 0 || !hasChildren ? "" : "text-xs"}`}
        >
          {node.text}
        </button>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="toc-children">
          {node.children.map((child) => (
            <TocTreeNode
              key={child.id}
              node={child}
              activeId={activeId}
              expandedIds={expandedIds}
              onToggle={onToggle}
              onScroll={onScroll}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */

function hasCollapsibleDescendants(node: TocNode): boolean {
  if (node.children.length > 0) return true;
  for (const child of node.children) {
    if (hasCollapsibleDescendants(child)) return true;
  }
  return false;
}

function isDescendantActive(node: TocNode, activeId: string): boolean {
  for (const child of node.children) {
    if (child.id === activeId || isDescendantActive(child, activeId)) return true;
  }
  return false;
}