"use client";

import { useEffect } from "react";

export default function RootPage() {
  useEffect(() => {
    // Check browser language preference
    const browserLang = navigator.language.toLowerCase();
    const targetLocale = browserLang.startsWith("zh") ? "/zh" : "/en";
    window.location.replace(targetLocale);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
}