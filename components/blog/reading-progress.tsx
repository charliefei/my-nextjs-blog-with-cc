"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    setProgress(Math.min(scrollPercent, 100));
    setShowBackToTop(scrollTop > 400);
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(handleScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="reading-progress-bar" aria-hidden="true">
        <div
          className="reading-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`back-to-top-btn ${showBackToTop ? "visible" : ""}`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}
