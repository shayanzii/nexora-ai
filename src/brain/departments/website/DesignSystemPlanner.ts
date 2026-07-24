import type { DesignSystemPlan, WebsiteType } from "./WebsiteTypes";

/** Generates design system recommendations by website type. */
export function planDesignSystem(
  websiteType: WebsiteType,
  industry: string,
): DesignSystemPlan {
  if (websiteType === "dental-clinic" || industry.toLowerCase().includes("dental")) {
    return {
      colorPalette: ["#0F766E", "#14B8A6", "#F0FDFA", "#1E293B", "#FFFFFF"],
      typography: ["Inter (headings)", "Inter (body)", "System UI fallback"],
      spacing: "8px base grid with generous whitespace for clinical trust.",
      borderRadius: "12px cards, 8px buttons, 16px hero panels",
      iconStyle: "Rounded line icons with medical-friendly clarity.",
      visualStyle: "Clean, modern healthcare aesthetic with warm trust accents.",
    };
  }

  if (websiteType === "restaurant") {
    return {
      colorPalette: ["#B45309", "#F59E0B", "#FFFBEB", "#1C1917", "#FFFFFF"],
      typography: ["Playfair Display (headings)", "Inter (body)"],
      spacing: "8px grid with rich imagery spacing.",
      borderRadius: "8px cards, 999px pill buttons",
      iconStyle: "Filled food and hospitality icons.",
      visualStyle: "Warm, appetite-forward visual style with rich photography.",
    };
  }

  return {
    colorPalette: ["#2563EB", "#1D4ED8", "#EFF6FF", "#0F172A", "#FFFFFF"],
    typography: ["Inter (headings)", "Inter (body)", "System UI fallback"],
    spacing: "8px base grid with consistent section rhythm.",
    borderRadius: "12px cards, 8px buttons",
    iconStyle: "Minimal line icons with consistent stroke weight.",
    visualStyle: "Modern professional aesthetic optimized for conversions.",
  };
}
