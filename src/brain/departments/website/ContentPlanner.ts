import type { BlueprintPage, ContentPlan, PageContentPlan } from "./WebsiteTypes";

export interface ExecutionContentPlannerInput {
  business: string;
  industry: string;
  targetAudience: string;
  goals: readonly string[];
  pages: readonly BlueprintPage[];
}

/** Generates page-level content plans. */
export function planContent(input: ExecutionContentPlannerInput): ContentPlan {
  const pages = input.pages.map((page) => buildPageContent(page, input));

  return {
    pages,
    toneOfVoice: resolveToneOfVoice(input.industry),
    contentPillars: buildContentPillars(input.industry, input.goals),
  };
}

function buildPageContent(
  page: BlueprintPage,
  input: ExecutionContentPlannerInput,
): PageContentPlan {
  const ctas = page.conversionPage
    ? ["Book Appointment", "Contact Us"]
    : page.slug === "home"
      ? ["Book Appointment", "View Services", "Contact Us"]
      : ["Learn More", "Contact Us"];

  return {
    slug: page.slug,
    title: page.title,
    purpose: page.purpose,
    targetAudience: input.targetAudience,
    mainMessage: buildMainMessage(page, input.business, input.goals),
    requiredContent: buildRequiredContent(page),
    callsToAction: ctas,
  };
}

function buildMainMessage(
  page: BlueprintPage,
  business: string,
  goals: readonly string[],
): string {
  const goal = goals[0] ?? "grow the business";
  if (page.slug === "home") {
    return `${business} helps patients achieve ${goal.toLowerCase()} with trusted, modern care.`;
  }
  return `${page.title} — supporting ${goal.toLowerCase()} for ${business}.`;
}

function buildRequiredContent(page: BlueprintPage): string[] {
  if (page.slug === "home") {
    return ["Value proposition", "Service overview", "Trust signals", "Primary CTA"];
  }
  if (page.conversionPage || page.slug.includes("book")) {
    return ["Booking form", "Availability", "Confirmation message", "Privacy note"];
  }
  if (page.slug === "services") {
    return ["Service descriptions", "Benefits", "Process overview", "CTA to book"];
  }
  if (page.slug === "faq") {
    return ["Common questions", "Booking policy", "Insurance info", "Contact fallback"];
  }
  if (page.slug === "blog") {
    return ["Featured articles", "Category navigation", "Author trust", "Newsletter signup"];
  }
  return ["Page headline", "Supporting copy", "Visual assets", "Secondary CTA"];
}

function resolveToneOfVoice(industry: string): string {
  const normalized = industry.toLowerCase();
  if (normalized.includes("dental") || normalized.includes("medical")) {
    return "Professional, reassuring, and patient-focused.";
  }
  if (normalized.includes("law")) {
    return "Authoritative, clear, and confidence-building.";
  }
  if (normalized.includes("restaurant")) {
    return "Warm, inviting, and appetite-driven.";
  }
  return "Professional, approachable, and conversion-focused.";
}

function buildContentPillars(industry: string, goals: readonly string[]): string[] {
  const pillars = ["Trust and credibility", "Clear service value", "Strong calls to action"];
  if (goals.some((goal) => goal.toLowerCase().includes("appointment"))) {
    pillars.push("Frictionless booking");
  }
  if (industry.toLowerCase().includes("dental")) {
    pillars.push("Patient education");
  }
  return pillars;
}
