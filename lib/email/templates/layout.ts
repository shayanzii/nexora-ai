import { NEXORA_BRAND, escapeHtml } from "../utils";

type EmailLayoutOptions = {
  preheader: string;
  eyebrow: string;
  title: string;
  bodyHtml: string;
  footerNote?: string;
};

export function renderEmailLayout({
  preheader,
  eyebrow,
  title,
  bodyHtml,
  footerNote = "Nexora AI — Premium automation for modern businesses.",
}: EmailLayoutOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .content-pad { padding: 24px 20px !important; }
      .hero-pad { padding: 28px 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${NEXORA_BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${NEXORA_BRAND.bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;">
          <tr>
            <td class="hero-pad" style="padding:32px 32px 24px;background:linear-gradient(160deg, ${NEXORA_BRAND.bg} 0%, ${NEXORA_BRAND.surface} 48%, ${NEXORA_BRAND.bg} 100%);border:1px solid ${NEXORA_BRAND.border};border-radius:16px 16px 0 0;">
              <p style="margin:0 0 8px;font-size:10px;font-weight:600;letter-spacing:0.35em;text-transform:uppercase;color:${NEXORA_BRAND.hover};">
                ${escapeHtml(eyebrow)}
              </p>
              <h1 style="margin:0;font-size:28px;line-height:1.25;font-weight:700;color:${NEXORA_BRAND.text};">
                ${escapeHtml(title)}
              </h1>
            </td>
          </tr>
          <tr>
            <td class="content-pad" style="padding:28px 32px 32px;background-color:${NEXORA_BRAND.card};border:1px solid ${NEXORA_BRAND.border};border-top:none;border-radius:0 0 16px 16px;">
              ${bodyHtml}
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:32px;">
                <tr>
                  <td style="padding-top:24px;border-top:1px solid ${NEXORA_BRAND.border};">
                    <p style="margin:0;font-size:12px;line-height:1.6;color:${NEXORA_BRAND.muted};">
                      ${escapeHtml(footerNote)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderDetailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:12px 0;border-bottom:1px solid ${NEXORA_BRAND.border};vertical-align:top;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${NEXORA_BRAND.muted};">
        ${escapeHtml(label)}
      </p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:${NEXORA_BRAND.text};white-space:pre-wrap;">
        ${escapeHtml(value)}
      </p>
    </td>
  </tr>`;
}

export function renderPrimaryButton(href: string, label: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 8px;">
    <tr>
      <td style="border-radius:12px;background:linear-gradient(135deg, ${NEXORA_BRAND.primary} 0%, ${NEXORA_BRAND.hover} 100%);">
        <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;padding:14px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;">
          ${escapeHtml(label)}
        </a>
      </td>
    </tr>
  </table>`;
}
