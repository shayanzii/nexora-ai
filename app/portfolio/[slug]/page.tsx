import { notFound } from "next/navigation";
import { PortfolioCaseStudyTemplate } from "@/components/portfolio/PortfolioCaseStudyTemplate";
import { getPortfolioProject, PORTFOLIO_SLUGS } from "@/lib/portfolio/content";
import { createPageMetadata } from "@/lib/site/seo";
import type { Metadata } from "next";

type PortfolioCaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PORTFOLIO_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PortfolioCaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getPortfolioProject(slug);

  if (!project) {
    return { title: "Project Not Found | Nexora AI" };
  }

  return createPageMetadata({
    title: project.title,
    description: project.metaDescription,
    path: `/portfolio/${slug}`,
  });
}

export default async function PortfolioCaseStudyPage({ params }: PortfolioCaseStudyPageProps) {
  const { slug } = await params;
  const project = getPortfolioProject(slug);

  if (!project) {
    notFound();
  }

  return <PortfolioCaseStudyTemplate project={project} />;
}
