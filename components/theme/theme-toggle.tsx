"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";

type ThemeName = "light" | "dark" | "system";
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => ViewTransition;
};

const themeClasses = ["light", "dark"];

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeClass(theme: ThemeName) {
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
  const root = document.documentElement;

  root.classList.remove(...themeClasses);
  root.classList.add(resolvedTheme);
  root.style.colorScheme = resolvedTheme;
}

function setTopRightTransitionOrigin() {
  const root = document.documentElement;
  const x = window.innerWidth;
  const y = 0;
  const radius = Math.hypot(window.innerWidth, window.innerHeight);

  root.style.setProperty("--theme-transition-x", `${x}px`);
  root.style.setProperty("--theme-transition-y", `${y}px`);
  root.style.setProperty("--theme-transition-radius", `${radius}px`);
}

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const t = useTranslations("theme");

  const handleThemeChange =
    (theme: ThemeName) => () => {
      const root = document.documentElement;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const viewTransitionDocument = document as ViewTransitionDocument;
      const canUseViewTransition =
        !prefersReducedMotion &&
        typeof viewTransitionDocument.startViewTransition === "function";

      setTopRightTransitionOrigin();
      root.classList.add("theme-transitioning");
      if (canUseViewTransition) {
        root.classList.add("theme-view-transitioning");
      }

      const cleanup = () => {
        root.classList.remove("theme-transitioning");
        root.classList.remove("theme-view-transitioning");
        root.style.removeProperty("--theme-transition-x");
        root.style.removeProperty("--theme-transition-y");
        root.style.removeProperty("--theme-transition-radius");
      };

      const updateTheme = () => {
        applyThemeClass(theme);
        setTheme(theme);
      };

      if (!canUseViewTransition) {
        updateTheme();
        window.setTimeout(cleanup, prefersReducedMotion ? 0 : 640);
        return;
      }

      const transition = viewTransitionDocument.startViewTransition!(updateTheme);
      transition.finished.finally(cleanup);
    };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-md text-sm font-medium transition-all duration-300 ease-out hover:bg-accent hover:text-accent-foreground hover:shadow-sm focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span className="absolute inset-1 rounded-full bg-primary/10 opacity-0 blur-sm transition-opacity duration-300 dark:opacity-100" />
        <Sun className="relative h-5 w-5 rotate-0 scale-100 text-primary transition-all duration-300 ease-out dark:-rotate-90 dark:scale-0 dark:opacity-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 text-primary opacity-0 transition-all duration-300 ease-out dark:rotate-0 dark:scale-100 dark:opacity-100" />
        <span className="sr-only">{t("switch")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleThemeChange("light")}>
          <Sun className="mr-2 h-4 w-4" />
          {t("light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleThemeChange("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          {t("dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleThemeChange("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          {t("system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
