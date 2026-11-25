import { NextRequest, NextResponse } from 'next/server';
import { db, emailCampaigns, campaignRecipients } from '@/lib/db';
import { eq, and, sql, gte, desc } from 'drizzle-orm';
import { isEmailSuppressed, sendEmail } from '@/lib/resend';
import { logEmailActivityNote } from '@/lib/hubspot';
import { BaseTemplate } from '@/components/email/BaseTemplate';
import React from 'react';

/**
 * Queue Processor / Vercel Cron Endpoint
 * Schedule: Every 5 minutes (Vercel Cron)
 * Security: Authorization: Bearer ${CRON_SECRET}
 */
export async function GET(request: NextRequest) {
  return handleQueueProcess(request);
}

export async function POST(request: NextRequest) {
  return handleQueueProcess(request);
}

async function handleQueueProcess(request: NextRequest) {
  // 1. Verify Bearer CRON_SECRET
  const expectedSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization') || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!expectedSecret || bearerToken !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing Bearer CRON_SECRET' },
      { status: 401 }
    );
  }

  try {
    // 2. Locate active scheduled or sending campaign (most recent first)
    const activeCampaigns = await db
      .select()
      .from(emailCampaigns)
      .where(sql`${emailCampaigns.status} IN ('scheduled', 'sending')`)
      .orderBy(desc(emailCampaigns.createdAt))
      .limit(1);

    if (!activeCampaigns.length) {
      return NextResponse.json({
        message: 'No active campaigns scheduled or sending.',
        processed: 0,
      });
    }

    const campaign = activeCampaigns[0];

    // Transition scheduled to sending
    if (campaign.status === 'scheduled') {
      await db
        .update(emailCampaigns)
        .set({ status: 'sending' })
        .where(eq(emailCampaigns.id, campaign.id));
    }

    // 3. Compute rate limits: Daily cap and Hourly cap
    const dailyCap = parseInt(process.env.WARMUP_DAILY_CAP || '100', 10);
    const hourlyCap = campaign.warmupRatePerHour || 25;

    // Count sends today (UTC midnight)
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayIso = todayStart.toISOString();

    const todaySentCountRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(campaignRecipients)
      .where(
        and(
          sql`${campaignRecipients.status} IN ('sent', 'delivered', 'opened', 'clicked')`,
          gte(campaignRecipients.sentAt, todayIso)
        )
      );
    const totalSentToday = Number(todaySentCountRes[0]?.count || 0);

    if (totalSentToday >= dailyCap) {
      console.warn(`[Queue Worker] Daily warmup cap reached (${totalSentToday}/${dailyCap}). Pausing dispatch for today.`);
      return NextResponse.json({
        message: 'Daily warmup cap reached',
        totalSentToday,
        dailyCap,
        processed: 0,
      });
    }

    // Count sends in the last 60 minutes for this campaign
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const lastHourSentRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(campaignRecipients)
      .where(
        and(
          eq(campaignRecipients.campaignId, campaign.id),
          sql`${campaignRecipients.status} IN ('sent', 'delivered', 'opened', 'clicked')`,
          gte(campaignRecipients.sentAt, oneHourAgo)
        )
      );
    const sentLastHour = Number(lastHourSentRes[0]?.count || 0);

    if (sentLastHour >= hourlyCap) {
      console.warn(`[Queue Worker] Hourly rate limit reached for campaign (${sentLastHour}/${hourlyCap}).`);
      return NextResponse.json({
        message: 'Hourly warmup rate reached',
        sentLastHour,
        hourlyCap,
        processed: 0,
      });
    }

    // Micro-batch size: up to 10 per 5-minute cron cycle, bounded by quotas
    const remainingDaily = dailyCap - totalSentToday;
    const remainingHourly = hourlyCap - sentLastHour;
    const batchSize = Math.max(1, Math.min(10, remainingDaily, remainingHourly));

    // 4. Fetch pending recipients
    const pendingRecipients = await db
      .select()
      .from(campaignRecipients)
      .where(
        and(
          eq(campaignRecipients.campaignId, campaign.id),
          eq(campaignRecipients.status, 'pending')
        )
      )
      .limit(batchSize);

    if (pendingRecipients.length === 0) {
      // Check if any pending remain at all
      const anyPending = await db
        .select({ id: campaignRecipients.id })
        .from(campaignRecipients)
        .where(
          and(
            eq(campaignRecipients.campaignId, campaign.id),
            eq(campaignRecipients.status, 'pending')
          )
        )
        .limit(1);

      if (anyPending.length === 0) {
        // Mark campaign completed!
        await db
          .update(emailCampaigns)
          .set({ status: 'completed' })
          .where(eq(emailCampaigns.id, campaign.id));

        return NextResponse.json({
          message: `Campaign ${campaign.title} completed. No pending recipients remain.`,
          campaignStatus: 'completed',
          processed: 0,
        });
      }

      return NextResponse.json({ message: 'No recipients in batch', processed: 0 });
    }

    let processedCount = 0;
    let sentCount = 0;
    let suppressedCount = 0;

    for (const recipient of pendingRecipients) {
      processedCount++;
      const email = recipient.email.toLowerCase().trim();

      // 5. Re-check suppression list at exact moment of send
      const suppressed = await isEmailSuppressed(email);
      if (suppressed) {
        suppressedCount++;
        await db
          .update(campaignRecipients)
          .set({
            status: 'unsubscribed',
            errorMessage: 'Suppressed at send time',
          })
          .where(eq(campaignRecipients.id, recipient.id));
        continue;
      }

      // 6. Token interpolation
      const firstName = recipient.firstName || 'there';
      const company = recipient.company || 'your team';

      const renderedBody = campaign.contentMarkdown
        .replace(/\{\{\s*first_name\s*\|\s*["']?([^"']*)["']?\s*\}\}/g, firstName)
        .replace(/\{\{\s*first_name\s*\}\}/g, firstName)
        .replace(/\{\{\s*company\s*\|\s*["']?([^"']*)["']?\s*\}\}/g, company)
        .replace(/\{\{\s*company\s*\}\}/g, company);

      const paragraphs = renderedBody
        .split('\n\n')
        .filter((p: string) => p.trim().length > 0);

      const emailComponent = React.createElement(
        BaseTemplate,
        {
          previewText: campaign.preheader || undefined,
          recipientEmail: email,
          unsubscribeToken: undefined, // Generated in sendEmail headers
          consentVariant: 'registered',
        },
        paragraphs.map((p: string, idx: number) => {
          if (p.startsWith('### ')) {
            return React.createElement(
              'h3',
              {
                key: idx,
                style: {
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 600,
                  marginTop: '20px',
                  marginBottom: '8px',
                },
              },
              p.replace('### ', '')
            );
          }
          return React.createElement(
            'p',
            {
              key: idx,
              style: {
                color: '#F2F2F2',
                fontSize: '15px',
                lineHeight: '1.65',
                margin: '0 0 16px 0',
              },
            },
            p
          );
        })
      );

      // 7. Dispatch via Resend
      const result = await sendEmail({
        to: email,
        subject: campaign.subject,
        react: emailComponent,
      });

      const now = new Date().toISOString();

      if (result.success && result.messageId) {
        sentCount++;
        await db
          .update(campaignRecipients)
          .set({
            status: 'sent',
            sentAt: now,
            resendMessageId: result.messageId,
            errorMessage: null,
          })
          .where(eq(campaignRecipients.id, recipient.id));

        // 8. Log engagement activity note to HubSpot timeline (non-blocking)
        if (recipient.hubspotContactId && process.env.HUBSPOT_ACCESS_TOKEN) {
          logEmailActivityNote(
            recipient.hubspotContactId,
            `Sent Email Campaign: "${campaign.title}" via Coincashy Console.\nSubject: ${campaign.subject}\nSent At: ${now}`
          ).catch((err) => {
            console.warn(`[HubSpot Note Sync Warning] Could not log note for contact ${recipient.hubspotContactId}:`, err);
          });
        }
      } else {
        // Track error & evaluate retry threshold
        console.error(`[Queue Dispatch Failed] Recipient: ${email}, Error: ${result.error}`);
        await db
          .update(campaignRecipients)
          .set({
            status: 'failed',
            errorMessage: result.error || 'Dispatch error',
          })
          .where(eq(campaignRecipients.id, recipient.id));
      }
    }

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      processed: processedCount,
      sent: sentCount,
      suppressed: suppressedCount,
      hourlyQuotaRemaining: remainingHourly - sentCount,
      dailyQuotaRemaining: remainingDaily - sentCount,
    });
  } catch (error) {
    console.error('[Queue Processor Exception]', error);
    return NextResponse.json(
      { error: 'Queue processing error', details: String(error) },
      { status: 500 }
    );
  }
}
