"use client";

import { useEffect, useState, useRef } from "react";
import { TocItem } from "@/lib/toc";
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const tocRef = useRef<HTMLDivElement>(null);

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
      {/* Mobile TOC Toggle Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <List className="h-4 w-4" />
          目录
          <span className="text-xs text-muted-foreground">({items.length})</span>
        </Button>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="mt-2 p-3 rounded-lg border border-border/40 bg-card/50 backdrop-blur-sm animate-slide-up">
            <nav className="space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={`
                    block w-full text-left py-1.5 px-2 rounded text-sm transition-colors
                    ${item.level === 3 ? "pl-4 text-xs" : ""}
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
      <div
        ref={tocRef}
        className="hidden lg:block sticky top-8 self-start w-56 shrink-0"
      >
        <div className="p-4 rounded-lg border border-border/40 bg-card/30 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-3 pb-2 border-b border-border/30">
            <List className="h-4 w-4 text-primary" />
            <span>目录</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-0.5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={`
                  block w-full text-left py-1.5 px-2 -mx-2 rounded text-sm transition-all duration-200
                  ${item.level === 3 ? "pl-4 text-xs" : ""}
                  ${activeId === item.id
                    ? "text-primary bg-primary/10 font-medium border-l-2 border-primary -ml-[2px] pl-[calc(0.5rem+2px)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-l-2 border-transparent"
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