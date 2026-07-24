import type { BlueprintPage, NavigationPlan } from "./WebsiteTypes";

/** Builds header/footer navigation from planned pages. */
export function planNavigation(pages: readonly BlueprintPage[]): NavigationPlan {
  const header = pages
    .filter((page) => page.inHeaderNav)
    .map((page) => ({
      label: page.title,
      slug: page.slug,
      isCta: page.conversionPage,
    }));

  const footer = pages
    .filter((page) => page.inFooterNav || page.slug === "privacy" || page.slug === "terms")
    .map((page) => ({
      label: page.title,
      slug: page.slug,
      isCta: false,
    }));

  const stickyElements: string[] = [];
  if (pages.some((page) => page.conversionPage)) {
    stickyElements.push("Book Appointment CTA");
  }
  stickyElements.push("Navbar");

  return {
    header,
    footer,
    mobileStrategy: "Hamburger menu with prioritized booking/contact CTA visible on mobile.",
    stickyElements,
  };
}
