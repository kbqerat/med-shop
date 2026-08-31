import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { I18nProvider } from "@/context/i18n";
import { SITE, absoluteUrl } from "@/lib/site";
import { LOCALES, OG_LOCALE, isRtl, localePath } from "@/lib/i18n/config";
import { getCanonicalPath, getDictionary, getLocale } from "@/lib/i18n/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Latin fonts lack Arabic glyphs — Cairo covers the RTL default well.
const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const path = await getCanonicalPath();

  const languages = Object.fromEntries([
    ...LOCALES.map((l) => [l, absoluteUrl(localePath(path, l))]),
    ["x-default", absoluteUrl(localePath(path, "ar"))],
  ]);

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${SITE.name} — ${SITE.tagline}`,
      template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    applicationName: SITE.name,
    keywords: [
      "caps",
      "hats",
      "snapback",
      "casquette",
      "New Era",
      "streetwear",
      "Morocco",
      "Maroc",
      "المغرب",
      "قبعات",
      "الدفع عند الاستلام",
    ],
    category: "shopping",
    alternates: { canonical: localePath(path, locale), languages },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: OG_LOCALE[locale],
      url: absoluteUrl(localePath(path, locale)),
      title: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const messages = getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider locale={locale} messages={messages}>
          <CartProvider>{children}</CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
