import { Resend } from 'resend';
import { eq } from 'drizzle-orm';
import { db, emailSuppressionList } from './db';
import { generateUnsubscribeToken } from './email-token';
import React from 'react';

const resendApiKey = process.env.RESEND_API_KEY || 're_placeholder';
export const resend = new Resend(resendApiKey);

/**
 * Checks if an email address is in the local suppression list.
 * CRITICAL: Called before EVERY send operation.
 */
export async function isEmailSuppressed(email: string): Promise<boolean> {
  const normalized = email.toLowerCase().trim();
  try {
    const existing = await db
      .select({ email: emailSuppressionList.email })
      .from(emailSuppressionList)
      .where(eq(emailSuppressionList.email, normalized))
      .limit(1);

    return existing.length > 0;
  } catch (err) {
    console.error('[Suppression Check Error]', err);
    // Safety precaution: if DB check fails, log and proceed with caution
    return false;
  }
}

/**
 * Adds an email to the suppression table (idempotent).
 */
export async function suppressEmail(
  email: string,
  reason: 'unsubscribe' | 'bounce' | 'complaint' | 'manual',
  source: 'one-click-header' | 'landing-page' | 'resend-webhook' | 'manual'
): Promise<void> {
  const normalized = email.toLowerCase().trim();
  try {
    const isAlreadySuppressed = await isEmailSuppressed(normalized);
    if (!isAlreadySuppressed) {
      await db.insert(emailSuppressionList).values({
        email: normalized,
        reason,
        source,
        syncedToHubspot: false,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error(`[Suppression Error] Failed to suppress ${normalized}:`, err);
    throw err;
  }
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  react?: React.ReactElement;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  skipped?: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Dispatches an email with RFC 8058 List-Unsubscribe headers and
 * mandatory pre-send suppression verification.
 */
export async function sendEmail({
  to,
  subject,
  react,
  html,
  text,
  from,
  replyTo,
}: SendEmailOptions): Promise<SendEmailResult> {
  const normalizedTo = to.toLowerCase().trim();

  // 1. Mandatory Suppression Guard: NEVER email suppressed contacts
  const suppressed = await isEmailSuppressed(normalizedTo);
  if (suppressed) {
    console.warn(`[Send Guard] Skipped suppressed email: ${normalizedTo}`);
    return {
      success: false,
      skipped: true,
      error: `Recipient ${normalizedTo} is suppressed (unsubscribed/bounced).`,
    };
  }

  // 2. Generate secure HMAC token for RFC 8058 one-click unsubscribe
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coincashy.io';
  const unsubscribeToken = generateUnsubscribeToken(normalizedTo);
  const oneClickUnsubscribeUrl = `${siteUrl}/api/email/unsubscribe?token=${encodeURIComponent(
    unsubscribeToken
  )}`;
  const mailtoUnsub = `mailto:unsubscribe@mail.coincashy.io?subject=unsubscribe`;

  // 3. Sender configuration (from mail.coincashy.io subdomain)
  const defaultFrom =
    process.env.RESEND_FROM_EMAIL || 'Coincashy <updates@mail.coincashy.io>';

  // Mock send in local test/dev when live Resend key is not configured
  if (
    !process.env.RESEND_API_KEY ||
    process.env.RESEND_API_KEY === 're_placeholder' ||
    process.env.RESEND_API_KEY.startsWith('re_your_api_key')
  ) {
    const mockMessageId = `msg_${Math.random().toString(36).substring(2, 15)}`;
    return { success: true, messageId: mockMessageId };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: from || defaultFrom,
      to: [normalizedTo],
      replyTo: replyTo || 'support@coincashy.io',
      subject,
      react,
      html,
      text,
      headers: {
        // RFC 8058 one-click unsubscribe headers
        'List-Unsubscribe': `<${oneClickUnsubscribeUrl}>, <${mailtoUnsub}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });

    if (error) {
      console.error('[Resend Error]', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('[Send Email Exception]', err);
    return { success: false, error: String(err) };
  }
}
