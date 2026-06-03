"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import type { GiscusConfig } from "@/types/profile";

interface GiscusCommentsProps {
  config?: GiscusConfig;
}

export function GiscusComments({ config }: GiscusCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  const giscusTheme =
    resolvedTheme === "dark" || resolvedTheme === "light"
      ? resolvedTheme
      : config?.theme ?? "preferred_color_scheme";
  const giscusThemeRef = useRef(giscusTheme);

  useEffect(() => {
    giscusThemeRef.current = giscusTheme;
  }, [giscusTheme]);

  useEffect(() => {
    const container = containerRef.current;

    if (
      !container ||
      !config?.repo ||
      !config.repoId ||
      !config.category ||
      !config.categoryId
    ) {
      return;
    }

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.repo = config.repo;
    script.dataset.repoId = config.repoId;
    script.dataset.category = config.category;
    script.dataset.categoryId = config.categoryId;
    script.dataset.mapping = config.mapping ?? "pathname";
    script.dataset.strict = config.strict ?? "0";
    script.dataset.reactionsEnabled = config.reactionsEnabled ?? "1";
    script.dataset.emitMetadata = config.emitMetadata ?? "0";
    script.dataset.inputPosition = config.inputPosition ?? "top";
    script.dataset.theme = giscusThemeRef.current;
    script.dataset.lang = config.lang ?? "zh-CN";
    script.dataset.loading = config.loading ?? "lazy";

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [config]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !config) {
      return;
    }

    const updateGiscusTheme = () => {
      const iframe = container.querySelector<HTMLIFrameElement>("iframe.giscus-frame");

      iframe?.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              theme: giscusTheme,
            },
          },
        },
        "https://giscus.app"
      );
    };

    updateGiscusTheme();
    const timeoutIds = [
      window.setTimeout(updateGiscusTheme, 500),
      window.setTimeout(updateGiscusTheme, 1500),
    ];
    const observer = new MutationObserver(updateGiscusTheme);

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      observer.disconnect();
    };
  }, [config, giscusTheme]);

  if (!config) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-border/30">
      <div ref={containerRef} />
    </section>
  );
}
