"use client";

import { useEffect } from "react";

export function LocaleRedirect() {
  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const browserLang = navigator.language.toLowerCase();
    const targetLocale = browserLang.startsWith("zh") ? "/zh/" : "/en/";
    window.location.replace(`${basePath}${targetLocale}`);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
}
