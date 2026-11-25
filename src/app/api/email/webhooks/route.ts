import { NextRequest, NextResponse } from 'next/server';
import { suppressEmail } from '@/lib/resend';
import { syncSuppressionToHubSpot } from '@/lib/hubspot';
import { db, campaignRecipients } from '@/lib/db';
import { eq } from 'drizzle-orm';

/**
 * Resend & Svix Webhook Ingestion Endpoint
 * Public route exempted from HTTP Basic Auth in src/middleware.ts.
 *
 * Handles:
 * - email.bounced: immediately writes to suppression list & flags HubSpot
 * - email.complained: immediately writes to suppression list & flags HubSpot
 * - email.delivered / email.opened / email.clicked: updates recipient analytics
 */
export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    // Optional verification check if secret configured
    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');
    const svixSignature = request.headers.get('svix-signature');

    if (webhookSecret && (!svixId || !svixTimestamp || !svixSignature)) {
      console.warn('[Webhook Warning] Missing Svix verification headers');
      // In production with RESEND_WEBHOOK_SECRET, reject unauthenticated calls
      // return NextResponse.json({ error: 'Invalid signature headers' }, { status: 401 });
    }

    const payload = await request.json().catch(() => null);
    if (!payload || !payload.type) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    const { type, data } = payload;
    const email = data?.to?.[0] || data?.email;
    const messageId = data?.email_id || data?.id;

    console.log(`[Resend Webhook] Event: ${type} for ${email || 'unknown'} (Message ID: ${messageId || 'none'})`);

    if (email) {
      const normalizedEmail = String(email).toLowerCase().trim();

      // Bounces & Spam Complaints -> Instant Suppression & HubSpot Sync
      if (type === 'email.bounced') {
        await suppressEmail(normalizedEmail, 'bounce', 'resend-webhook');
        syncSuppressionToHubSpot(normalizedEmail).catch(console.error);
      } else if (type === 'email.complained') {
        await suppressEmail(normalizedEmail, 'complaint', 'resend-webhook');
        syncSuppressionToHubSpot(normalizedEmail).catch(console.error);
      }
    }

    // Update campaign_recipients metrics if messageId is matched
    if (messageId) {
      const now = new Date().toISOString();
      if (type === 'email.delivered') {
        await db
          .update(campaignRecipients)
          .set({ status: 'delivered' })
          .where(eq(campaignRecipients.resendMessageId, messageId));
      } else if (type === 'email.opened') {
        await db
          .update(campaignRecipients)
          .set({ status: 'opened', openedAt: now })
          .where(eq(campaignRecipients.resendMessageId, messageId));
      } else if (type === 'email.clicked') {
        await db
          .update(campaignRecipients)
          .set({ status: 'clicked', clickedAt: now })
          .where(eq(campaignRecipients.resendMessageId, messageId));
      } else if (type === 'email.bounced') {
        await db
          .update(campaignRecipients)
          .set({
            status: 'bounced',
            errorMessage: data?.bounce?.message || 'Bounced',
          })
          .where(eq(campaignRecipients.resendMessageId, messageId));
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook Processing Error]', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
