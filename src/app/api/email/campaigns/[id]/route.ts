import { NextRequest, NextResponse } from 'next/server';
import { db, emailCampaigns, campaignRecipients } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const campaign = await db
      .select()
      .from(emailCampaigns)
      .where(eq(emailCampaigns.id, id))
      .limit(1);

    if (!campaign.length) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const recipients = await db
      .select()
      .from(campaignRecipients)
      .where(eq(campaignRecipients.campaignId, id))
      .orderBy(desc(campaignRecipients.sentAt));

    const total = recipients.length;
    const sent = recipients.filter((r) => ['sent', 'delivered', 'opened', 'clicked'].includes(r.status)).length;
    const delivered = recipients.filter((r) => ['delivered', 'opened', 'clicked'].includes(r.status)).length;
    const opened = recipients.filter((r) => ['opened', 'clicked'].includes(r.status)).length;
    const clicked = recipients.filter((r) => r.status === 'clicked').length;
    const bounced = recipients.filter((r) => r.status === 'bounced').length;
    const pending = recipients.filter((r) => r.status === 'pending').length;

    return NextResponse.json({
      campaign: campaign[0],
      recipients,
      metrics: {
        total,
        pending,
        sent,
        delivered,
        opened,
        clicked,
        bounced,
        deliveredRate: sent > 0 ? ((delivered / sent) * 100).toFixed(1) : '0.0',
        openRate: delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : '0.0',
        clickRate: delivered > 0 ? ((clicked / delivered) * 100).toFixed(1) : '0.0',
        bounceRate: sent > 0 ? ((bounced / sent) * 100).toFixed(1) : '0.0',
      },
    });
  } catch (error) {
    console.error('[Campaign Detail Error]', error);
    return NextResponse.json({ error: 'Failed to fetch campaign details' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => null);

    if (!body || !body.status) {
      return NextResponse.json({ error: 'Status update is required' }, { status: 400 });
    }

    const validStatuses = ['draft', 'reviewing', 'scheduled', 'sending', 'completed', 'paused'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    await db
      .update(emailCampaigns)
      .set({ status: body.status })
      .where(eq(emailCampaigns.id, id));

    return NextResponse.json({ success: true, status: body.status });
  } catch (error) {
    console.error('[Campaign Status Update Error]', error);
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}
