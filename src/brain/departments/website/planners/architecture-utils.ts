/** Converts a page title to a URL slug. */
export function titleToSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-");
}

/** Converts an architecture slug to a WebsitePlan page id. */
export function slugToPageId(slug: string): string {
  return slug === "home" ? "page-home" : `page-${slug}`;
}

/** Converts an architecture slug to a URL path. */
export function slugToPath(slug: string): string {
  return slug === "home" ? "/" : `/${slug}`;
}
