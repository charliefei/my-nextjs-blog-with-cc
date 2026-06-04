"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import type { GiscusConfig } from "@/types/profile";

interface GiscusCommentsProps {
  config?: GiscusConfig;
  locale: string;
  term: string;
}

function getGiscusLang(locale: string) {
  return locale === "zh" ? "zh-CN" : "en";
}

export function GiscusComments({ config, locale, term }: GiscusCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const giscusLang = getGiscusLang(locale);

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
      !config.categoryId ||
      !term
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
    script.dataset.mapping = "specific";
    script.dataset.term = term;
    script.dataset.strict = config.strict ?? "0";
    script.dataset.reactionsEnabled = config.reactionsEnabled ?? "1";
    script.dataset.emitMetadata = config.emitMetadata ?? "0";
    script.dataset.inputPosition = config.inputPosition ?? "top";
    script.dataset.theme = giscusThemeRef.current;
    script.dataset.lang = giscusLang;
    script.dataset.loading = config.loading ?? "lazy";

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [config, giscusLang, term]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || !config || !term) {
      return;
    }

    const updateGiscusConfig = () => {
      const iframe = container.querySelector<HTMLIFrameElement>("iframe.giscus-frame");

      iframe?.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              term,
              theme: giscusTheme,
              lang: giscusLang,
            },
          },
        },
        "https://giscus.app"
      );
    };

    updateGiscusConfig();
    const timeoutIds = [
      window.setTimeout(updateGiscusConfig, 500),
      window.setTimeout(updateGiscusConfig, 1500),
    ];
    const observer = new MutationObserver(updateGiscusConfig);

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      observer.disconnect();
    };
  }, [config, giscusLang, giscusTheme, term]);

  if (!config) {
    return null;
  }

  return (
    <section className="border-t border-border/30">
      <div ref={containerRef} />
    </section>
  );
}
