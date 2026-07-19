export type PortfolioResult = {
  value: string;
  label: string;
};

export type PortfolioTestimonial = {
  quote: string;
  name: string;
  role: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  metaDescription: string;
  industry: string;
  summary: string;
  heroAccent: string;
  challenge: string;
  solution: string;
  technologies: string[];
  results: PortfolioResult[];
  testimonial: PortfolioTestimonial;
};
