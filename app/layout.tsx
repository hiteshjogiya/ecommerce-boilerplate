import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { JsonLd } from "@/components/seo/json-ld";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/src/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE_SUFFIX, getSiteUrl } from "@/src/lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | ${SITE_TITLE_SUFFIX}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TITLE_SUFFIX}`,
    description: SITE_DESCRIPTION,
    url: getSiteUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TITLE_SUFFIX}`,
    description: SITE_DESCRIPTION,
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900"
        >
          Skip to main content
        </a>
        <JsonLd id="organization-jsonld" data={buildOrganizationJsonLd()} />
        <JsonLd id="website-jsonld" data={buildWebsiteJsonLd()} />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
