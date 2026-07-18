export type LeadFormData = {
  fullName: string;
  email: string;
  company: string;
  budget: string;
  projectDescription: string;
};

export type LeadSubmission = LeadFormData & {
  id: string;
  submittedAt: string;
};

export type LeadFormErrors = Partial<Record<keyof LeadFormData, string>>;
