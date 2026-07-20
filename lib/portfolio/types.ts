export type PortfolioResult = {
  value: string;
  label: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  metaDescription: string;
  industry: string;
  summary: string;
  heroAccent: string;
  before: string;
  after: string;
  challenge: string;
  solution: string;
  technologies: string[];
  results: PortfolioResult[];
  isIllustrative?: boolean;
};
