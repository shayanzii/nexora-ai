import type { Metadata } from "next";
import { NEXORA_CONTACT_EMAIL, NEXORA_LOCATION } from "@/lib/site/contact";

export const SITE_NAME = "Nexora AI";

export const DEFAULT_DESCRIPTION =
  "Nexora AI helps Canadian businesses deploy AI automation, chatbots, and voice agents with transparent pricing and fast delivery.";

export function getSiteUrl(): string {
  const url =
    process.env.NEXORA_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  if (!url) return "http://localhost:3000";
  if (url.startsWith("http")) return url.replace(/\/$/, "");
  return `https://${url.replace(/\/$/, "")}`;
}

type PageMetadataOptions = {
  title: string;
  description?: string;
  path?: string;
};

export function createPageMetadata({ title, description, path = "" }: PageMetadataOptions): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const pageDescription = description ?? DEFAULT_DESCRIPTION;
  const shortTitle = title.includes(SITE_NAME) ? title.replace(` | ${SITE_NAME}`, "") : title;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: shortTitle,
    description: pageDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_CA",
      url: canonical,
      siteName: SITE_NAME,
      title: fullTitle,
      description: pageDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: pageDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: getSiteUrl(),
  email: NEXORA_CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Toronto",
    addressCountry: "CA",
  },
  areaServed: "CA",
  description: DEFAULT_DESCRIPTION,
});

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export { NEXORA_LOCATION };
