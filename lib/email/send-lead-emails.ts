import "server-only";

import { Resend } from "resend";
import {
  getAdminNotificationEmail,
  getEmailEnvDiagnostics,
  getNexoraSiteUrl,
  getResendApiKey,
  getResendFromEmail,
  isEmailConfigured,
} from "./env";
import { renderAdminLeadNotificationEmail } from "./templates/admin-lead-notification";
import { renderClientLeadConfirmationEmail } from "./templates/client-lead-confirmation";

export type LeadEmailPayload = {
  id: string;
  fullName: string;
  email: string;
  company: string;
  budget: string;
  projectDescription: string;
  submittedAt: string;
};

export type LeadEmailResult = {
  configured: boolean;
  adminSent: boolean;
  clientSent: boolean;
  errors: string[];
};

function getResendClient(): Resend | null {
  const apiKey = getResendApiKey();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendLeadNotificationEmails(
  lead: LeadEmailPayload,
): Promise<LeadEmailResult> {
  const result: LeadEmailResult = {
    configured: isEmailConfigured(),
    adminSent: false,
    clientSent: false,
    errors: [],
  };

  if (!result.configured) {
    console.warn("[email/leads] Skipping notifications — email not configured", getEmailEnvDiagnostics());
    return result;
  }

  const resend = getResendClient();
  const from = getResendFromEmail()!;
  const adminEmail = getAdminNotificationEmail()!;
  const siteUrl = getNexoraSiteUrl();
  const adminLeadsUrl = `${siteUrl}/admin/leads`;

  const adminTemplate = renderAdminLeadNotificationEmail({
    fullName: lead.fullName,
    email: lead.email,
    company: lead.company,
    budget: lead.budget,
    projectDescription: lead.projectDescription,
    leadId: lead.id,
    submittedAt: lead.submittedAt,
    adminLeadsUrl,
  });

  const clientTemplate = renderClientLeadConfirmationEmail({
    fullName: lead.fullName,
    email: lead.email,
    company: lead.company,
    budget: lead.budget,
    projectDescription: lead.projectDescription,
    submittedAt: lead.submittedAt,
    siteUrl,
  });

  const [adminOutcome, clientOutcome] = await Promise.allSettled([
    resend!.emails.send({
      from,
      to: [adminEmail],
      replyTo: lead.email,
      subject: adminTemplate.subject,
      html: adminTemplate.html,
    }),
    resend!.emails.send({
      from,
      to: [lead.email],
      replyTo: adminEmail,
      subject: clientTemplate.subject,
      html: clientTemplate.html,
    }),
  ]);

  if (adminOutcome.status === "fulfilled") {
    if (adminOutcome.value.error) {
      result.errors.push(`Admin notification: ${adminOutcome.value.error.message}`);
    } else {
      result.adminSent = true;
    }
  } else {
    result.errors.push(
      `Admin notification: ${adminOutcome.reason instanceof Error ? adminOutcome.reason.message : String(adminOutcome.reason)}`,
    );
  }

  if (clientOutcome.status === "fulfilled") {
    if (clientOutcome.value.error) {
      result.errors.push(`Client confirmation: ${clientOutcome.value.error.message}`);
    } else {
      result.clientSent = true;
    }
  } else {
    result.errors.push(
      `Client confirmation: ${clientOutcome.reason instanceof Error ? clientOutcome.reason.message : String(clientOutcome.reason)}`,
    );
  }

  if (result.errors.length > 0) {
    console.error("[email/leads] Notification failures", {
      leadId: lead.id,
      ...getEmailEnvDiagnostics(),
      errors: result.errors,
    });
  }

  return result;
}
