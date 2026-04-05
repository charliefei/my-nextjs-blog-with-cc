import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getProfile } from "@/lib/profile";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: resolvedLocale } = await params;

  // Validate locale
  if (!routing.locales.includes(resolvedLocale as "en" | "zh")) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(resolvedLocale);

  const messages = await getMessages();
  const profile = getProfile();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <div className="min-h-screen flex flex-col gradient-bg noise">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer profile={profile} />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}