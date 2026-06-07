"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, Home, FileText, User, Star, Rss } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { getAssetPath, cn } from "@/lib/utils";
import { getProfile } from "@/lib/profile";

const navItems = [
  { key: "home", href: "/" },
  { key: "blog", href: "/blog" },
  { key: "about", href: "/about" },
  { key: "resume", href: "/resume" },
  { key: "experience", href: "/experience" },
];

// Pixels of scroll before the header morphs into the floating pill.
const SCROLL_THRESHOLD = 24;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const logoSrc = getProfile().personal.logo;

  useEffect(() => {
    // Throttle scroll updates to one rAF tick to avoid layout thrash.
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > SCROLL_THRESHOLD);
        ticking = false;
      });
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={cn(
          "group/bar relative mx-auto flex items-center justify-between",
          "will-change-[height,max-width,padding,border-radius,background-color,box-shadow]",
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "mt-3 h-12 max-w-3xl px-2.5 rounded-full glass-float shadow-float"
            : "header-top h-16 max-w-7xl px-6 lg:px-8"
        )}
      >
        {/* Brand — monogram ring + gradient wordmark */}
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-2.5 shrink-0"
          aria-label="Charlie Fei's Blog"
        >
          <span
            className={cn(
              "brand-ring relative flex items-center justify-center rounded-full overflow-hidden",
              "bg-linear-to-br from-primary via-primary to-accent",
              "ring-1 ring-border/40",
              "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              scrolled ? "h-7 w-7" : "h-8 w-8"
            )}
          >
            <img
              src={logoSrc}
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </span>
          <span
            className={cn(
              "font-heading font-bold tracking-tight transition-all duration-500 whitespace-nowrap",
              scrolled ? "text-sm" : "text-xl"
            )}
          >
            <span className="gradient-text">Charlie</span>
            <span
              className={cn(
                "ml-1.5 text-muted-foreground font-normal transition-all duration-500",
                scrolled && "hidden sm:inline"
              )}
            >
              / Blog
            </span>
          </span>
        </Link>

        {/* Desktop Navigation — pill highlight on active + hover */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === `/${locale}` || pathname === `/${locale}/`
                : pathname.startsWith(`/${locale}${item.href}`);
            return (
              <Link
                key={item.key}
                href={`/${locale}${item.href}`}
                className={cn(
                  "relative px-3 py-1.5 rounded-full text-sm font-medium",
                  "transition-colors duration-200",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full bg-foreground/10 ring-1 ring-foreground/5"
                    aria-hidden
                  />
                )}
                <span className="relative">{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-0.5 shrink-0">
          <LanguageSwitcher />
          <ThemeToggle />
          <a
            href={getAssetPath(`/${locale}/rss.xml`)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center justify-center rounded-full text-sm font-medium",
              "text-muted-foreground transition-all duration-200",
              "hover:bg-accent/20 hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              scrolled ? "h-8 w-8" : "h-9 w-9"
            )}
            aria-label={t("rss")}
            title={t("rss")}
          >
            <Rss className={scrolled ? "h-3.5 w-3.5" : "h-4 w-4"} />
            <span className="sr-only">{t("rss")}</span>
          </a>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              className={cn(
                "md:hidden inline-flex items-center justify-center rounded-full",
                "text-muted-foreground transition-all duration-200",
                "hover:bg-accent/20 hover:text-foreground",
                scrolled ? "h-8 w-8" : "h-9 w-9"
              )}
            >
              <Menu className={scrolled ? "h-3.5 w-3.5" : "h-4 w-4"} />
              <span className="sr-only">{t("toggleMenu")}</span>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[380px] p-0"
              showCloseButton={false}
            >
              {/* Sheet Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full overflow-hidden bg-linear-to-br from-primary to-accent ring-1 ring-border/40">
                    <img
                      src={logoSrc}
                      alt="Logo"
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <span className="font-heading text-lg font-bold tracking-tight">
                    <span className="gradient-text">Charlie</span>{" "}
                    <span className="text-muted-foreground font-normal">Fei</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center rounded-md h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                  <span className="sr-only">{t("closeMenu")}</span>
                </button>
              </div>

              {/* Sheet Nav */}
              <nav className="flex-1 flex flex-col gap-1 px-3 py-6 overflow-y-auto">
                {navItems.map((item, index) => {
                  const Icon = navIconMap[item.key];
                  const isActive =
                    item.href === "/"
                      ? pathname === `/${locale}` || pathname === `/${locale}/`
                      : pathname.startsWith(`/${locale}${item.href}`);
                  return (
                    <Link
                      key={item.key}
                      href={`/${locale}${item.href}`}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "relative flex items-center gap-3.5 px-4 py-3 rounded-lg text-[15px] font-medium",
                        "transition-all duration-200 ease-out",
                        "hover:bg-accent/10 hover:text-foreground hover:translate-x-0.5",
                        "animate-slide-up opacity-0",
                        isActive
                          ? "text-foreground bg-accent/5 font-semibold"
                          : "text-muted-foreground"
                      )}
                      style={{
                        animationDelay: `${0.1 + index * 0.06}s`,
                        animationFillMode: "forwards",
                      }}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary" />
                      )}
                      {Icon && (
                        <Icon
                          className="h-[18px] w-[18px] shrink-0"
                          strokeWidth={isActive ? 2.25 : 1.75}
                        />
                      )}
                      {t(item.key)}
                    </Link>
                  );
                })}
              </nav>

              {/* Sheet Footer */}
              <div className="mt-auto px-6 py-4 border-t border-border/40">
                <p className="text-xs text-muted-foreground">
                  &copy; {new Date().getFullYear()} Charlie Fei
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

const navIconMap: Record<string, React.ElementType> = {
  home: Home,
  blog: FileText,
  about: User,
  resume: FileText,
  experience: Star,
};
