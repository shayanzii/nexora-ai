export function getResendApiKey(): string | undefined {
  return process.env.RESEND_API_KEY?.trim() || undefined;
}

export function getResendFromEmail(): string | undefined {
  return process.env.RESEND_FROM_EMAIL?.trim() || undefined;
}

export function getAdminNotificationEmail(): string | undefined {
  return process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || undefined;
}

export function getNexoraSiteUrl(): string {
  const url =
    process.env.NEXORA_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  if (!url) return "http://localhost:3000";
  if (url.startsWith("http://") || url.startsWith("https://")) return url.replace(/\/$/, "");
  return `https://${url.replace(/\/$/, "")}`;
}

export function isEmailConfigured(): boolean {
  return Boolean(getResendApiKey() && getResendFromEmail() && getAdminNotificationEmail());
}

export function getEmailEnvDiagnostics() {
  return {
    hasResendApiKey: Boolean(getResendApiKey()),
    hasFromEmail: Boolean(getResendFromEmail()),
    hasAdminNotificationEmail: Boolean(getAdminNotificationEmail()),
  };
}
