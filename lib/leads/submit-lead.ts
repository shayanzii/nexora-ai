import type { LeadFormData, LeadFormErrors, LeadSubmission } from "./types";

export class LeadSubmitError extends Error {
  readonly status?: number;
  readonly fieldErrors?: LeadFormErrors;

  constructor(message: string, status?: number, fieldErrors?: LeadFormErrors) {
    super(message);
    this.name = "LeadSubmitError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function getUserFacingError(status: number, serverMessage?: string): string {
  if (status === 503) {
    return "Our consultation service is temporarily unavailable. Please try again in a few minutes.";
  }

  if (status === 502) {
    return "We couldn't save your request due to a server error. Please try again.";
  }

  if (typeof serverMessage === "string" && serverMessage.length > 0) {
    return serverMessage;
  }

  return "Unable to save your request. Please try again.";
}

export async function submitLead(data: LeadFormData): Promise<LeadSubmission> {
  let response: Response;

  try {
    response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    throw new LeadSubmitError(
      "Network error. Check your connection and try again.",
    );
  }

  const payload = (await response.json().catch(() => null)) as {
    lead?: LeadSubmission;
    error?: string;
    errors?: LeadFormErrors;
  } | null;

  if (!response.ok) {
    if (response.status === 400 && payload?.errors) {
      throw new LeadSubmitError(
        payload.error ?? "Validation failed.",
        400,
        payload.errors,
      );
    }

    throw new LeadSubmitError(
      getUserFacingError(response.status, payload?.error),
      response.status,
    );
  }

  if (!payload?.lead) {
    throw new LeadSubmitError("Invalid response from server.");
  }

  return payload.lead;
}
