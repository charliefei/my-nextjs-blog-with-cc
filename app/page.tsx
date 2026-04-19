"use client";

import { useEffect } from "react";

export default function RootPage() {
  useEffect(() => {
    // Use relative path to preserve basePath
    window.location.replace("./en/");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
}