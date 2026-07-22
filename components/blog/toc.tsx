"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { TocItem, TocNode, buildTocTree } from "@/lib/toc";
import { List, ChevronDown, ChevronRight, ChevronsUpDown, ChevronsDownUp, ChevronUp } from "lucide-react";

/* ─────────────────────────────────────────────
   Shared hook — all TOC state + logic
   ───────────────────────────────────────────── */

function useToc(items: TocItem[]) {
  const [activeId, setActiveId] = useState<string>("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const tree = useRef<TocNode[]>(buildTocTree(items));
  const allIds = useRef<string[]>(items.map((i) => i.id));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-15% 0% -70% 0%", threshold: 0 }
    );
    for (const id of allIds.current) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  const scrollToHeading = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const toggleNode = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => setExpandedIds(new Set(allIds.current)), []);
  const collapseAll = useCallback(() => setExpandedIds(new Set()), []);

  const hasAnyCollapsible = tree.current.some(
    (node) => node.children.length > 0 || hasCollapsibleDescendants(node)
  );

  return { activeId, expandedIds, tree: tree.current, hasAnyCollapsible, scrollToHeading, toggleNode, expandAll, collapseAll };
}

/* ─────────────────────────────────────────────
   Mobile TOC — sticky bar with dropdown
   ───────────────────────────────────────────── */

interface MobileTocProps {
  items: TocItem[];
}

export function MobileToc({ items }: MobileTocProps) {
  const t = useTranslations("blog");
  const [isOpen, setIsOpen] = useState(false);
  const { activeId, expandedIds, tree, hasAnyCollapsible, scrollToHeading, toggleNode, expandAll, collapseAll } = useToc(items);

  if (items.length === 0) return null;

  const handleScroll = (id: string) => {
    scrollToHeading(id);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating bottom container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
        {/* Expanded panel — slides up above the pill */}
        {isOpen && (
          <div className="w-72 max-h-[50vh] rounded-2xl border border-border/40 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <span className="text-sm font-medium text-foreground">{t("toc")}</span>
              {hasAnyCollapsible && (
                <div className="flex items-center gap-0.5">
                  <button type="button" onClick={expandAll} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title={t("tocExpandAll")}>
                    <ChevronsUpDown className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={collapseAll} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title={t("tocCollapseAll")}>
                    <ChevronsDownUp className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
            {/* Tree */}
            <nav className="p-2 overflow-y-auto max-h-[calc(50vh-48px)] scrollbar-thin space-y-0.5">
              {tree.map((node) => (
                <TocTreeNode key={node.id} node={node} activeId={activeId} expandedIds={expandedIds} onToggle={toggleNode} onScroll={handleScroll} />
              ))}
            </nav>
          </div>
        )}

        {/* Pill button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/90 backdrop-blur-xl px-4 py-2.5 text-sm font-medium shadow-lg hover:bg-card hover:shadow-xl transition-all active:scale-95"
        >
          <List className="h-4 w-4 text-primary" />
          <span>{t("toc")}</span>
          <span className="text-xs text-muted-foreground tabular-nums">({items.length})</span>
          {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Desktop TOC — sidebar panel
   ───────────────────────────────────────────── */

interface DesktopTocProps {
  items: TocItem[];
}

export function DesktopToc({ items }: DesktopTocProps) {
  const t = useTranslations("blog");
  const { activeId, expandedIds, tree, hasAnyCollapsible, scrollToHeading, toggleNode, expandAll, collapseAll } = useToc(items);

  if (items.length === 0) return null;

  return (
    <div className="p-4 rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/30">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <List className="h-4 w-4 text-primary" />
          <span>{t("toc")}</span>
          <span className="text-xs text-muted-foreground tabular-nums">({items.length})</span>
        </div>
        {hasAnyCollapsible && (
          <div className="flex items-center gap-0.5">
            <button type="button" onClick={expandAll} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title={t("tocExpandAll")}>
              <ChevronsUpDown className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={collapseAll} className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title={t("tocCollapseAll")}>
              <ChevronsDownUp className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="toc-nav relative space-y-0.5 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin">
        {tree.map((node) => (
          <TocTreeNode key={node.id} node={node} activeId={activeId} expandedIds={expandedIds} onToggle={toggleNode} onScroll={scrollToHeading} />
        ))}
      </nav>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Legacy export — renders both (for backward compat)
   ───────────────────────────────────────────── */

export function TableOfContents({ items }: { items: TocItem[] }) {
  return (
    <>
      <MobileToc items={items} />
      <DesktopToc items={items} />
    </>
  );
}

/* ─────────────────────────────────────────────
   Recursive tree node
   ───────────────────────────────────────────── */

interface TocTreeNodeProps {
  node: TocNode;
  activeId: string;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  onScroll: (id: string) => void;
  depth?: number;
}

function TocTreeNode({ node, activeId, expandedIds, onToggle, onScroll, depth = 0 }: TocTreeNodeProps) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isActive = activeId === node.id;
  const isImplicitlyActive = !isActive && hasChildren && isDescendantActive(node, activeId);

  return (
    <div>
      <div
        className={`toc-node-row ${isActive ? "toc-node-active" : ""} ${isImplicitlyActive ? "toc-node-implicit" : ""}`}
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        {hasChildren ? (
          <button type="button" onClick={(e) => { e.stopPropagation(); onToggle(node.id); }} className="toc-chevron shrink-0" aria-label={isExpanded ? "Collapse" : "Expand"}>
            <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
          </button>
        ) : (
          <span className="toc-leaf-marker shrink-0" />
        )}
        <button
          type="button"
          onClick={() => onScroll(node.id)}
          className={`toc-label block w-full text-left text-sm transition-colors duration-200 truncate ${isActive ? "text-primary font-medium" : "text-muted-foreground"} ${depth === 0 || !hasChildren ? "" : "text-xs"}`}
        >
          {node.text}
        </button>
      </div>
      {hasChildren && isExpanded && (
        <div className="toc-children">
          {node.children.map((child) => (
            <TocTreeNode key={child.id} node={child} activeId={activeId} expandedIds={expandedIds} onToggle={onToggle} onScroll={onScroll} depth={depth + 1} />
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
