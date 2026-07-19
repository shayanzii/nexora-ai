import {
  escapeHtml,
  formatBudgetLabel,
  formatSubmittedAt,
} from "../utils";
import { renderDetailRow, renderEmailLayout } from "./layout";

export type ClientLeadConfirmationData = {
  fullName: string;
  email: string;
  company: string;
  budget: string;
  projectDescription: string;
  submittedAt: string;
  siteUrl: string;
};

export function renderClientLeadConfirmationEmail(data: ClientLeadConfirmationData): {
  subject: string;
  html: string;
} {
  const firstName = escapeHtml(data.fullName.trim().split(/\s+/)[0] || "there");
  const company = data.company.trim() || "Not provided";
  const budget = formatBudgetLabel(data.budget);
  const submittedAt = formatSubmittedAt(data.submittedAt);

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#ffffff;">
      Hi ${firstName},
    </p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#ffffff;">
      Thank you for reaching out to <strong style="color:#dc2626;">Nexora AI</strong>. We received your consultation request and our strategy team is reviewing it now.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 24px;background-color:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
      <tr>
        <td style="padding:20px 22px;">
          <p style="margin:0 0 16px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#dc2626;">
            Your submission summary
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            ${renderDetailRow("Name", data.fullName)}
            ${renderDetailRow("Email", data.email)}
            ${renderDetailRow("Company", company)}
            ${renderDetailRow("Budget", budget)}
            ${renderDetailRow("Project", data.projectDescription)}
            ${renderDetailRow("Submitted", submittedAt)}
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#ffffff;">
      What happens next:
    </p>
    <ul style="margin:0 0 20px;padding-left:20px;color:#a1a1aa;font-size:14px;line-height:1.8;">
      <li style="margin-bottom:8px;color:#ffffff;">A Nexora AI specialist reviews your goals and timeline.</li>
      <li style="margin-bottom:8px;color:#ffffff;">We respond within <strong style="color:#dc2626;">24 hours</strong> with next steps.</li>
      <li style="color:#ffffff;">If your project is a fit, we schedule a strategy call.</li>
    </ul>
    <p style="margin:0;font-size:14px;line-height:1.7;color:#a1a1aa;">
      Questions before then? Reply to this email or visit
      <a href="${escapeHtml(data.siteUrl)}" style="color:#dc2626;text-decoration:none;">${escapeHtml(data.siteUrl.replace(/^https?:\/\//, ""))}</a>.
    </p>`;

  return {
    subject: "We received your consultation request — Nexora AI",
    html: renderEmailLayout({
      preheader: "Thanks for contacting Nexora AI. We will respond within 24 hours.",
      eyebrow: "Nexora AI",
      title: "Your request is confirmed",
      bodyHtml,
      footerNote: "Nexora AI — Intelligent automation for ambitious teams.",
    }),
  };
}
