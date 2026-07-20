import { notFound } from "next/navigation";
import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import { getServiceContent, SERVICE_SLUGS } from "@/lib/services/content";
import { createPageMetadata } from "@/lib/site/seo";
import type { Metadata } from "next";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getServiceContent(slug);

  if (!content) {
    return { title: "Service Not Found | Nexora AI" };
  }

  return createPageMetadata({
    title: content.title,
    description: content.metaDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const content = getServiceContent(slug);

  if (!content) {
    notFound();
  }

  return <ServicePageTemplate content={content} />;
}
