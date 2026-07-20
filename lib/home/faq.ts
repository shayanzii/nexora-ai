export type HomeFaqItem = {
  question: string;
  answer: string;
};

export const homeFaqItems: HomeFaqItem[] = [
  {
    question: "How much does an AI solution cost?",
    answer:
      "Plans start at CA$199 for a one-time setup on our Starter tier. Growth and Pro packages scale with integrations and automation depth, and Enterprise scopes are quoted custom. We'll recommend the right fit during your free strategy call—no hidden fees.",
  },
  {
    question: "How long does development take?",
    answer:
      "Most projects launch in days to a few weeks, not months. Starter chatbots often go live within two weeks; Growth and Pro builds typically complete in two to four weeks depending on integrations and content readiness.",
  },
  {
    question: "Do you work with small businesses?",
    answer:
      "Absolutely. Nexora AI is built for Canadian small and mid-sized businesses—local shops, clinics, agencies, and service teams that need enterprise-quality AI without enterprise complexity or cost.",
  },
  {
    question: "Can you integrate with existing software?",
    answer:
      "Yes. We connect with the tools you already use—CRMs, booking systems, help desks, calendars, e-commerce platforms, and more. If it has an API or webhook, we can usually integrate it within your plan.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Yes. Every launch includes post-go-live support, and optional monthly care plans keep your AI accurate, integrations healthy, and automations optimized as your business grows.",
  },
];
