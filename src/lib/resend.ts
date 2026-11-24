import { Resend } from "resend";

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  sent: boolean;
  skipped?: boolean;
  id?: string;
  error?: string;
}

let cachedResend: Resend | null | undefined;

export function getResendClient(): Resend | null {
  if (cachedResend !== undefined) {
    return cachedResend;
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    cachedResend = null;
    return null;
  }

  cachedResend = new Resend(apiKey);
  return cachedResend;
}

export function getAdminNotificationEmail(): string | null {
  const email = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();
  return email || null;
}

export async function sendEmailSafe(
  input: SendEmailInput
): Promise<SendEmailResult> {
  const client = getResendClient();
  if (!client) {
    return { sent: false, skipped: true };
  }

  const defaultFrom =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Homem Abusado <onboarding@resend.dev>";

  try {
    const response = await client.emails.send({
      from: input.from ?? defaultFrom,
      to: input.to,
      subject: input.subject,
      html: input.html,
      replyTo: input.replyTo,
    });

    if (response.error) {
      return {
        sent: false,
        error: response.error.message,
      };
    }

    return {
      sent: true,
      id: response.data?.id,
    };
  } catch (err) {
    return {
      sent: false,
      error: err instanceof Error ? err.message : "Erro ao enviar e-mail",
    };
  }
}

export async function notifyAdminSafe(
  subject: string,
  html: string
): Promise<SendEmailResult> {
  const adminEmail = getAdminNotificationEmail();
  if (!adminEmail) {
    return { sent: false, skipped: true };
  }

  return sendEmailSafe({
    to: adminEmail,
    subject,
    html,
  });
}
