"use client";

import { useEffect, useState } from "react";
import { TocItem } from "@/lib/toc";
import { List, ChevronDown, ChevronUp } from "lucide-react";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // Track active heading using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      }
    );

    // Observe all headings
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  // Scroll to heading
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile TOC Toggle Button - sticky below header */}
      <div className="lg:hidden sticky top-16 z-40 -mx-6 px-6 py-3 bg-background/95 backdrop-blur-sm border-b border-border/30">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors shadow-sm"
        >
          <List className="h-4 w-4" />
          目录
          <span className="text-xs text-muted-foreground">({items.length})</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </button>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="mt-3 mb-6 p-4 rounded-lg border border-border/40 bg-card/50 backdrop-blur-sm animate-slide-up">
            <nav className="space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeading(item.id);
                  }}
                  className={`
                    block w-full text-left py-1.5 px-2 rounded text-sm transition-colors
                    ${item.level === 3 ? "pl-5 text-xs" : ""}
                    ${activeId === item.id
                      ? "text-primary bg-primary/10 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }
                  `}
                >
                  {item.text}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Desktop Sidebar TOC */}
      <div className="hidden lg:block">
        <div className="p-4 rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-3 pb-2 border-b border-border/30">
            <List className="h-4 w-4 text-primary" />
            <span>目录</span>
          </div>

          {/* Navigation - scrollable within viewport */}
          <nav className="space-y-0.5 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-thin">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={`
                  block w-full text-left py-1.5 px-2 rounded text-sm transition-all duration-200
                  ${item.level === 2 ? "pl-5 text-xs" : ""}
                  ${item.level === 3 ? "pl-10 text-sm" : ""}
                  ${activeId === item.id
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }
                `}
              >
                <span className="line-clamp-1">{item.text}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}