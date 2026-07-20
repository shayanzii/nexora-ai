import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist, Geist_Mono } from "next/font/google";
import { ChatWidgetLoader } from "@/components/chat/ChatWidgetLoader";
import { SkipToMain } from "@/components/layout/SkipToMain";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata, getSiteUrl, organizationJsonLd, DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/site/seo";
import "./globals.css";

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
    default: "Nexora AI | Premium AI Automation for Modern Businesses",
    template: "%s | Nexora AI",
  },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: getSiteUrl() },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: getSiteUrl(),
    siteName: SITE_NAME,
    title: "Nexora AI | Premium AI Automation for Modern Businesses",
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora AI | Premium AI Automation for Modern Businesses",
    description: DEFAULT_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-CA"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SkipToMain />
        <JsonLd data={organizationJsonLd()} />
        {children}
        <ChatWidgetLoader />
        <GoogleAnalytics gaId="G-6C6MDRSXDM" />
      </body>
    </html>
  );
}
