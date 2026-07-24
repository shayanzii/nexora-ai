import type { DeploymentPlan, PerformanceStrategy, ResponsiveStrategy } from "./WebsiteTypes";

/** Generates deployment and hosting plan. */
export function planDeployment(business: string, country: string): DeploymentPlan {
  return {
    platform: "Vercel",
    hostingRequirements: [
      "Edge-optimized static and server-rendered pages",
      "Automatic SSL/TLS certificates",
      "Preview deployments for staging review",
      "Environment variable management for integrations",
    ],
    domainStrategy: `Primary domain for ${business} with www redirect and ${country} locale targeting.`,
    analytics: ["Google Analytics 4", "Conversion event tracking for booking forms"],
    searchConsole: [
      "Submit sitemap after launch",
      "Monitor Core Web Vitals weekly",
      "Track indexed pages and search queries",
    ],
  };
}

/** Generates responsive layout strategy. */
export function planResponsiveStrategy(): ResponsiveStrategy {
  return {
    desktop: "Multi-column layouts with expanded navigation, hero imagery, and side-by-side CTAs.",
    tablet: "Two-column sections with condensed navigation and touch-friendly controls.",
    mobile: "Single-column stack, sticky booking CTA, hamburger navigation, and thumb-zone forms.",
  };
}

/** Generates performance optimization strategy. */
export function planPerformanceStrategy(): PerformanceStrategy {
  return {
    lighthouseTarget: 95,
    imageOptimization: [
      "Next.js Image component with WebP/AVIF formats",
      "Responsive srcset for hero and gallery images",
      "Compress uploads to target < 200KB per hero image",
    ],
    lazyLoading: [
      "Lazy-load below-the-fold images and testimonial carousels",
      "Defer non-critical third-party scripts",
    ],
    caching: [
      "Static page caching via CDN edge network",
      "ISR for blog content with 24-hour revalidation",
    ],
    accessibility: [
      "WCAG 2.1 AA color contrast compliance",
      "Keyboard navigable forms and menus",
      "Semantic HTML landmarks and ARIA labels",
    ],
    coreWebVitals: [
      "LCP target < 2.5s on mobile",
      "CLS target < 0.1 with reserved image dimensions",
      "INP target < 200ms for interactive elements",
    ],
  };
}
