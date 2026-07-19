import {
  escapeHtml,
  formatBudgetLabel,
  formatSubmittedAt,
} from "../utils";
import { renderDetailRow, renderEmailLayout, renderPrimaryButton } from "./layout";

export type AdminLeadNotificationData = {
  fullName: string;
  email: string;
  company: string;
  budget: string;
  projectDescription: string;
  leadId: string;
  submittedAt: string;
  adminLeadsUrl: string;
};

export function renderAdminLeadNotificationEmail(data: AdminLeadNotificationData): {
  subject: string;
  html: string;
} {
  const company = data.company.trim() || "Not provided";
  const budget = formatBudgetLabel(data.budget);
  const submittedAt = formatSubmittedAt(data.submittedAt);

  const bodyHtml = `
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#ffffff;">
      A new consultation request just arrived. Review the details below and follow up from the admin dashboard.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 0;">
      ${renderDetailRow("Full name", data.fullName)}
      ${renderDetailRow("Email", data.email)}
      ${renderDetailRow("Company", company)}
      ${renderDetailRow("Budget", budget)}
      ${renderDetailRow("Project description", data.projectDescription)}
      ${renderDetailRow("Lead ID", data.leadId)}
      ${renderDetailRow("Submitted", submittedAt)}
    </table>
    ${renderPrimaryButton(data.adminLeadsUrl, "Open leads in admin")}
    <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#a1a1aa;">
      Reply directly to <a href="mailto:${escapeHtml(data.email)}" style="color:#dc2626;text-decoration:none;">${escapeHtml(data.email)}</a> to start the conversation.
    </p>`;

  return {
    subject: `New lead: ${data.fullName}`,
    html: renderEmailLayout({
      preheader: `New consultation request from ${data.fullName}`,
      eyebrow: "Nexora AI Admin",
      title: "New lead submitted",
      bodyHtml,
      footerNote: "You received this because a lead was captured on your Nexora AI site.",
    }),
  };
}
