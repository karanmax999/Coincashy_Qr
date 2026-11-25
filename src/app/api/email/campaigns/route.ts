import { NextRequest, NextResponse } from 'next/server';
import { db, emailCampaigns, campaignRecipients } from '@/lib/db';
import { eq, desc, sql } from 'drizzle-orm';
import crypto from 'crypto';

/**
 * GET /api/email/campaigns
 * Returns all campaigns with aggregated metrics (sent, delivered, opened, clicked, bounced).
 */
export async function GET() {
  try {
    const campaigns = await db
      .select()
      .from(emailCampaigns)
      .orderBy(desc(emailCampaigns.createdAt));

    // Aggregate statistics per campaign
    const enriched = await Promise.all(
      campaigns.map(async (c) => {
        const stats = await db
          .select({
            status: campaignRecipients.status,
            count: sql<number>`count(*)`,
          })
          .from(campaignRecipients)
          .where(eq(campaignRecipients.campaignId, c.id))
          .groupBy(campaignRecipients.status);

        let sent = 0;
        let delivered = 0;
        let opened = 0;
        let clicked = 0;
        let bounced = 0;
        let failed = 0;
        let pending = 0;

        for (const s of stats) {
          const cnt = Number(s.count);
          if (s.status === 'sent') sent += cnt;
          if (s.status === 'delivered') {
            sent += cnt;
            delivered += cnt;
          }
          if (s.status === 'opened') {
            sent += cnt;
            delivered += cnt;
            opened += cnt;
          }
          if (s.status === 'clicked') {
            sent += cnt;
            delivered += cnt;
            opened += cnt;
            clicked += cnt;
          }
          if (s.status === 'bounced') bounced += cnt;
          if (s.status === 'failed') failed += cnt;
          if (s.status === 'pending') pending += cnt;
        }

        return {
          ...c,
          metrics: {
            total: c.totalRecipients || 0,
            pending,
            sent,
            delivered,
            opened,
            clicked,
            bounced,
            failed,
          },
        };
      })
    );

    return NextResponse.json({ campaigns: enriched });
  } catch (error) {
    console.error('[Campaigns List Error]', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

/**
 * POST /api/email/campaigns
 * Creates a new draft campaign
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.title || !body.subject || !body.contentMarkdown) {
      return NextResponse.json(
        { error: 'title, subject, and contentMarkdown are required' },
        { status: 400 }
      );
    }

    const campaignId = crypto.randomUUID();
    const newCampaign = {
      id: campaignId,
      title: body.title,
      subject: body.subject,
      preheader: body.preheader || '',
      templateName: body.templateName || 'base-institutional',
      contentMarkdown: body.contentMarkdown,
      targetSegmentId: body.targetSegmentId || null,
      totalRecipients: body.totalRecipients || 0,
      status: 'draft' as const,
      warmupRatePerHour: body.warmupRatePerHour || 25,
      createdAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
    };

    await db.insert(emailCampaigns).values(newCampaign);

    return NextResponse.json({ success: true, campaign: newCampaign });
  } catch (error) {
    console.error('[Campaign Create Error]', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
