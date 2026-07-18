import type { LeadFormData, LeadFormErrors } from "./types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLeadForm(data: LeadFormData): LeadFormErrors {
  const errors: LeadFormErrors = {};

  const fullName = data.fullName.trim();
  if (!fullName) {
    errors.fullName = "Full name is required.";
  } else if (fullName.length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  const email = data.email.trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const projectDescription = data.projectDescription.trim();
  if (!projectDescription) {
    errors.projectDescription = "Project description is required.";
  } else if (projectDescription.length < 10) {
    errors.projectDescription = "Please provide at least 10 characters.";
  }

  return errors;
}

export function hasLeadFormErrors(errors: LeadFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
