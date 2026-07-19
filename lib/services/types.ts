export type ServicePricingPlan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
};

export type ServiceFaqItem = {
  question: string;
  answer: string;
};

export type ServicePageContent = {
  slug: string;
  title: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    headline: string;
    description: string;
    highlights: string[];
  };
  benefits: {
    title: string;
    description: string;
    items: { title: string; description: string }[];
  };
  features: {
    title: string;
    description: string;
    items: { title: string; description: string }[];
  };
  process: {
    title: string;
    description: string;
    steps: { title: string; description: string }[];
  };
  pricing: {
    title: string;
    description: string;
    plans: ServicePricingPlan[];
  };
  faq: {
    title: string;
    description: string;
    items: ServiceFaqItem[];
  };
  cta: {
    title: string;
    description: string;
  };
};
