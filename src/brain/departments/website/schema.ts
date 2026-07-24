import type { StrategicReasoningResult } from "../../reasoning/types";
import type { SalesDepartmentResult } from "../../types/sales";
import type { ProjectRequest } from "../../types/project";
import type { Proposal } from "../sales/proposal/schema";
import type { WebsiteBlueprint } from "./types/WebsiteBlueprint";

export type { WebsiteBlueprint };

/** Canonical schema version for WebsitePlan documents. */
export const WEBSITE_PLAN_SCHEMA_VERSION = "1.1.0" as const;
export type WebsitePlanSchemaVersion = typeof WEBSITE_PLAN_SCHEMA_VERSION;

export type InputSource =
  | "client-request"
  | "strategic-analysis"
  | "sales-analysis"
  | "proposal"
  | "knowledge-industry"
  | "knowledge-playbook"
  | "inferred";

export type ConfidenceLevel = "low" | "medium" | "high";
export type SiteModel = "single-page" | "multi-page" | "hybrid";

export type JourneyStageType =
  | "awareness"
  | "consideration"
  | "decision"
  | "conversion"
  | "retention";

export type PageType =
  | "home"
  | "services"
  | "service-detail"
  | "about"
  | "contact"
  | "booking"
  | "faq"
  | "testimonials"
  | "portfolio"
  | "pricing"
  | "blog"
  | "legal"
  | "landing"
  | "location";

export type CTAAction =
  | "book-appointment"
  | "request-quote"
  | "call-now"
  | "chat-now"
  | "contact-form"
  | "download"
  | "view-services"
  | "get-directions";

export type TrustElementType =
  | "reviews"
  | "certifications"
  | "guarantees"
  | "before-after"
  | "team-photos"
  | "case-studies"
  | "associations"
  | "insurance-badges"
  | "years-in-business"
  | "service-area-map"
  | "privacy-compliance";

export type BrandArchetype =
  | "caregiver"
  | "expert"
  | "helper"
  | "leader"
  | "creator"
  | "everyman";

export type BuilderIssueType =
  | "missing-page"
  | "wrong-page-priority"
  | "weak-cta"
  | "missing-trust-element"
  | "seo-gap"
  | "journey-break"
  | "brand-inconsistency"
  | "accessibility-gap"
  | "integration-missing"
  | "content-gap"
  | "architecture-mismatch"
  | "mobile-flow-issue"
  | "local-seo-gap"
  | "conversion-drop-off"
  | "other";

export interface WebsiteGoal {
  id: string;
  objective: string;
  priority: "primary" | "secondary";
  rationale: string;
  source: InputSource;
  measurableOutcome: string;
  linkedKpi?: string;
}

export interface AudienceSegment {
  id: string;
  label: string;
  description: string;
  priority: "primary" | "secondary";
}

export interface TargetAudienceProfile {
  primary: string;
  segments: AudienceSegment[];
  painPoints: string[];
  decisionFactors: string[];
  preferredChannels: string[];
}

export interface ValueProposition {
  headline: string;
  supportingPoints: string[];
  differentiators: string[];
  proofPoints: string[];
}

export interface BrandPositioning {
  positioningStatement: string;
  toneGuidance: "professional" | "friendly" | "authoritative" | "approachable";
  trustSignals: string[];
  competitiveAngle: string;
  regulatedIndustryNotes?: string[];
}

export interface BrandPersonality {
  traits: string[];
  archetype: BrandArchetype;
  emotionalTone: string;
  avoidTraits: string[];
  rationale: string;
  source: InputSource;
}

export interface CommunicationExample {
  topic: string;
  do: string;
  dont: string;
}

export interface CommunicationStyle {
  voiceDescriptor: string;
  readingLevel: "simple" | "moderate" | "professional";
  sentenceStyle: "short-direct" | "conversational" | "formal";
  terminologyGuidance: string;
  callToActionTone: string;
  regulatedLanguageNotes: string[];
  examples: CommunicationExample[];
}

export interface VisualDirection {
  moodKeywords: string[];
  layoutPreference: "spacious" | "compact" | "balanced";
  visualWeight: "image-led" | "text-led" | "balanced";
  mobileFirst: boolean;
  localBusinessSignals: string[];
  rationale: string;
}

export interface ColorRole {
  purpose: string;
  semanticIntent: string;
  usageContexts: string[];
  avoidContexts: string[];
}

export interface SemanticColorStrategy {
  primaryRole: ColorRole;
  secondaryRole: ColorRole;
  accentRole: ColorRole;
  neutralRole: ColorRole;
  trustRole: ColorRole;
  contrastRequirement: "standard" | "enhanced";
  guidance: string;
}

export interface TypographyLevel {
  level: "h1" | "h2" | "h3" | "body" | "caption" | "cta";
  purpose: string;
  emphasis: "high" | "medium" | "low";
  usageGuidance: string;
}

export interface SemanticTypographyGuidance {
  hierarchyIntent: TypographyLevel[];
  readabilityPriority: "high" | "standard";
  headingStyle: "bold-confident" | "elegant" | "friendly" | "authoritative";
  bodyStyle: "clean-readable" | "warm-conversational";
  mobileReadabilityNotes: string;
  regulatedContentNotes: string[];
}

export interface ImageryDirection {
  photographyStyle: string;
  subjectPriorities: string[];
  avoidImagery: string[];
  heroImageryGuidance: string;
  trustImageryGuidance: string;
  industrySpecificNotes: string[];
  altTextPolicy: string;
}

export interface IconographyGuidance {
  style: "line" | "filled" | "mixed" | "minimal";
  usageContexts: string[];
  avoidContexts: string[];
  accessibilityNote: string;
}

export interface AccessibilityConsiderations {
  wcagTarget: "AA" | "AAA";
  priorityRequirements: string[];
  regulatedIndustryRequirements: string[];
  formAccessibility: string;
  mobileAccessibility: string;
  rationale: string;
}

export interface BrandIdentity {
  personality: BrandPersonality;
  communicationStyle: CommunicationStyle;
  visualDirection: VisualDirection;
  colorStrategy: SemanticColorStrategy;
  typographyGuidance: SemanticTypographyGuidance;
  imageryDirection: ImageryDirection;
  iconographyGuidance: IconographyGuidance;
  accessibilityConsiderations: AccessibilityConsiderations;
  summary: string;
}

export interface JourneyPageRef {
  pageId: string;
  role: string;
  priority: "primary" | "secondary";
  rationale: string;
}

export interface JourneyCTA {
  label: string;
  action: CTAAction;
  pageId: string;
  placement: string;
  rationale: string;
}

export interface JourneyTrustRequirement {
  trustElementType: TrustElementType;
  description: string;
  required: boolean;
  pageIds: string[];
}

export interface JourneyObjection {
  objection: string;
  responseStrategy: string;
  addressedOnPages: string[];
  priority: "high" | "medium" | "low";
}

export interface JourneySuccessMetric {
  metric: string;
  kpiId: string;
  measurementMethod: string;
  targetDirection: "increase" | "decrease" | "maintain";
}

export interface JourneyStage {
  stage: JourneyStageType;
  label: string;
  visitorIntent: string;
  businessObjective: string;
  recommendedPages: JourneyPageRef[];
  primaryCTA: JourneyCTA;
  secondaryCTAs: JourneyCTA[];
  trustRequirements: JourneyTrustRequirement[];
  objections: JourneyObjection[];
  successMetric: JourneySuccessMetric;
  contentEmphasis: string[];
}

export interface DropOffRisk {
  stage: JourneyStageType;
  risk: string;
  mitigation: string;
  affectedPages: string[];
  severity: "low" | "medium" | "high";
}

export interface UserJourney {
  id: string;
  requestId: string;
  stages: JourneyStage[];
  primaryConversionPath: string[];
  dropOffRisks: DropOffRisk[];
  summary: string;
}

export interface ArchitectureAlternative {
  model: SiteModel;
  score: number;
  summary: string;
  blockers: string[];
}

export interface ArchitectureReasoningStep {
  step: number;
  factor: string;
  impact: string;
  favoredModel: SiteModel;
  detail: string;
}

export interface ArchitectureScoringDimension {
  id: string;
  label: string;
  weight: number;
  scoreSinglePage: number;
  scoreMultiPage: number;
  scoreHybrid: number;
  evaluatedValue: string;
  rationale: string;
}

export interface ArchitectureDecision {
  decision: SiteModel;
  score: number;
  alternatives: ArchitectureAlternative[];
  reasoning: ArchitectureReasoningStep[];
  confidence: ConfidenceLevel;
  scoringDimensions: ArchitectureScoringDimension[];
  decidedAt: string;
}

export interface ConversionPathStep {
  step: number;
  stage: "awareness" | "consideration" | "conversion" | "retention";
  pageId: string;
  action: string;
}

export interface SiteArchitecture {
  model: SiteModel;
  rationale: string;
  maxDepth: number;
  homepageRole: string;
  conversionPath: ConversionPathStep[];
  architectureDecision: ArchitectureDecision;
}

export interface NavigationItem {
  id: string;
  label: string;
  pageId: string;
  priority: number;
  cta?: boolean;
}

export interface NavigationPlan {
  primary: NavigationItem[];
  secondary: NavigationItem[];
  footer: NavigationItem[];
  mobileStrategy: string;
  stickyElements: string[];
}

export interface PageSectionPlan {
  id: string;
  name: string;
  purpose: string;
  priority: number;
  contentType:
    | "hero"
    | "services"
    | "trust"
    | "faq"
    | "cta"
    | "form"
    | "testimonials"
    | "about"
    | "contact"
    | "map"
    | "gallery";
  required: boolean;
}

export interface PageCTA {
  id: string;
  label: string;
  action: CTAAction;
  placement: "hero" | "inline" | "sticky" | "footer";
  priority: "primary" | "secondary";
}

export interface PageSEO {
  titlePattern: string;
  metaDescriptionPattern: string;
  primaryKeywords: string[];
  schemaTypes: string[];
  localSeo: boolean;
}

export interface ContentRequirement {
  id: string;
  topic: string;
  format: "short-copy" | "long-copy" | "list" | "faq" | "data" | "media";
  priority: "required" | "recommended";
  notes: string;
}

export interface PagePlan {
  id: string;
  slug: string;
  name: string;
  type: PageType;
  priority: "required" | "recommended" | "optional";
  purpose: string;
  targetAudience: string;
  primaryGoal: string;
  sections: PageSectionPlan[];
  ctas: PageCTA[];
  seo: PageSEO;
  integrations: string[];
  contentRequirements: ContentRequirement[];
  trustElements: string[];
}

export interface CTAPlacementRule {
  pageType: PageType;
  minCtaCount: number;
  requiredActions: CTAAction[];
  rationale: string;
}

export interface CTAStrategy {
  primaryCTA: PageCTA;
  secondaryCTAs: PageCTA[];
  placementRules: CTAPlacementRule[];
  afterHoursStrategy: string;
  mobileStrategy: string;
}

export interface LeadCapturePoint {
  id: string;
  location: string;
  pageId: string;
  formType: "contact" | "quote" | "booking" | "callback" | "newsletter" | "chat";
  fields: string[];
  priority: "primary" | "secondary";
}

export interface LeadGenerationStrategy {
  capturePoints: LeadCapturePoint[];
  qualificationFlow: string;
  routingTarget: "crm" | "email" | "chatbot" | "voice-agent";
  followUpSequence: string[];
  estimatedConversionPoints: number;
}

export interface LocalSEOStrategy {
  googleBusinessProfile: boolean;
  napConsistency: boolean;
  serviceAreaPages: boolean;
  locationKeywords: string[];
  reviewStrategy: string;
}

export interface SchemaRecommendation {
  type: string;
  pages: string[];
  rationale: string;
}

export interface SEOPlan {
  primaryKeywords: string[];
  localSeoStrategy: LocalSEOStrategy;
  technicalRequirements: string[];
  contentSeoPriorities: string[];
  schemaMarkup: SchemaRecommendation[];
  pageIndexStrategy: string;
}

export interface ContentPriority {
  id: string;
  topic: string;
  pageIds: string[];
  priority: "critical" | "high" | "medium" | "low";
  rationale: string;
  source: InputSource;
  audienceSegment?: string;
}

export interface TrustElement {
  id: string;
  type: TrustElementType;
  label: string;
  description: string;
  placement: string[];
  priority: "required" | "recommended";
  industrySpecific: boolean;
}

export interface IntegrationRequirement {
  id: string;
  serviceId: string;
  name: string;
  purpose: string;
  placement: string[];
  dependencies: string[];
  priority: "required" | "recommended";
  phase: 1 | 2 | 3;
}

export interface AnalyticsRequirement {
  id: string;
  event: string;
  trigger: string;
  pages: string[];
  kpiMapping: string;
  tooling: "ga4" | "gtm" | "custom";
}

export interface WebsitePlanRisk {
  id: string;
  severity: "low" | "medium" | "high";
  description: string;
  mitigation: string;
  source: "regulated-industry" | "budget" | "timeline" | "missing-input" | "integration";
}

export interface PlanUpdateSuggestion {
  targetField: string;
  action: "add" | "modify" | "remove" | "reprioritize";
  currentValue: string;
  suggestedValue: string;
  priority: "required" | "recommended";
  rationale: string;
}

export interface BuilderFeedbackIssue {
  id: string;
  issueType: BuilderIssueType;
  severity: "low" | "medium" | "high" | "critical";
  affectedPages: string[];
  affectedSections: string[];
  affectedJourneyStages: JourneyStageType[];
  title: string;
  description: string;
  recommendation: string;
  suggestedPlanUpdates: PlanUpdateSuggestion[];
  evidence: string;
}

export interface RegenerationScope {
  regenerateBrandIdentity: boolean;
  regenerateUserJourney: boolean;
  regenerateArchitecture: boolean;
  regeneratePages: boolean;
  regenerateConversion: boolean;
  regenerateSeo: boolean;
  affectedPageIds: string[];
  preserveUnaffected: boolean;
}

export interface BuilderFeedback {
  id: string;
  websitePlanId: string;
  requestId: string;
  submittedAt: string;
  submittedBy: "website-builder" | "human-review" | "qa-agent";
  builderVersion: string;
  issues: BuilderFeedbackIssue[];
  overallSeverity: "low" | "medium" | "high" | "critical";
  regenerationScope: RegenerationScope;
  notes: string;
}

/**
 * Top-level website planning artifact — reasoning only, no UI/HTML.
 */
export interface WebsitePlan {
  id: string;
  requestId: string;
  clientName: string;
  industry: string;
  industryId: string;
  country: string;
  generatedAt: string;
  schemaVersion: WebsitePlanSchemaVersion;
  version: number;
  priorPlanId?: string;
  regeneratedFromFeedbackId?: string;
  websiteGoals: WebsiteGoal[];
  targetAudience: TargetAudienceProfile;
  valueProposition: ValueProposition;
  brandPositioning: BrandPositioning;
  brandIdentity: BrandIdentity;
  userJourney: UserJourney;
  siteArchitecture: SiteArchitecture;
  navigation: NavigationPlan;
  pages: PagePlan[];
  ctaStrategy: CTAStrategy;
  leadGenerationStrategy: LeadGenerationStrategy;
  trustElements: TrustElement[];
  seoPlan: SEOPlan;
  contentPriorities: ContentPriority[];
  recommendedIntegrations: IntegrationRequirement[];
  analyticsRequirements: AnalyticsRequirement[];
  assumptions: string[];
  risks: WebsitePlanRisk[];
  successMetrics: string[];
  inputCompletenessScore: number;
  confidenceLevel: ConfidenceLevel;
  summary: string;
  nextSteps: string[];
  websiteBlueprint?: WebsiteBlueprint;
}

export interface WebsiteDepartmentOptions {
  siteModel?: SiteModel | "auto";
  includeOptionalPages?: boolean;
  maxPages?: number;
  prioritizeLocalSeo?: boolean;
  includeBlog?: boolean;
}

export interface WebsiteDepartmentRequest {
  requestId: string;
  clientName: string;
  industry: string;
  country: string;
  goals: string[];
  targetAudience: string;
  services: string[];
  budget: number;
  timeline?: string;
  regulated: boolean;
  strategicAnalysis?: StrategicReasoningResult;
  salesResult?: SalesDepartmentResult;
  proposal?: Proposal;
  options?: WebsiteDepartmentOptions;
  feedback?: BuilderFeedback;
}

export interface WebsiteDepartmentInputParams {
  requestId: string;
  request: ProjectRequest;
  strategicAnalysis?: StrategicReasoningResult;
  salesResult?: SalesDepartmentResult;
  proposal?: Proposal;
  options?: WebsiteDepartmentOptions;
}

export interface WebsiteDepartmentResult {
  departmentId: "website-department";
  requestId: string;
  status: "complete" | "partial" | "failed";
  generatedAt: string;
  websitePlan?: WebsitePlan;
  stepsExecuted: string[];
  stepsSkipped: string[];
  inputCompletenessScore: number;
  inputWarnings: string[];
  summary: string;
  nextStep: string;
  error?: string;
  regenerationApplied: boolean;
  feedbackIssuesResolved: string[];
  feedbackIssuesRemaining: string[];
}
