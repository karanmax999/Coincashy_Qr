import { NextRequest, NextResponse } from 'next/server';
import { db, emailCampaigns, campaignRecipients } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getListMemberships, batchGetContacts } from '@/lib/hubspot';
import { isEmailSuppressed } from '@/lib/resend';
import crypto from 'crypto';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) || {};

    const campaigns = await db
      .select()
      .from(emailCampaigns)
      .where(eq(emailCampaigns.id, id))
      .limit(1);

    if (!campaigns.length) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const campaign = campaigns[0];

    // Gather candidate recipient list
    interface CandidateRecipient {
      email: string;
      firstName?: string;
      company?: string;
      hubspotContactId?: string;
    }

    let candidates: CandidateRecipient[] = [];

    // 1. Pull from HubSpot segment if targetSegmentId is provided
    if (campaign.targetSegmentId && process.env.HUBSPOT_ACCESS_TOKEN) {
      try {
        const memberships = await getListMemberships(campaign.targetSegmentId);
        const contactIds = memberships.results.map((m) => m.recordId);
        if (contactIds.length > 0) {
          const contacts = await batchGetContacts(contactIds);
          candidates = contacts.map((c) => ({
            email: c.email,
            firstName: c.firstName,
            company: c.company,
            hubspotContactId: c.id,
          }));
        }
      } catch (err) {
        console.warn('[Approve Pipeline] Failed to fetch list from HubSpot CRM:', err);
      }
    }

    // 2. Allow passing custom recipients (e.g. for test dispatches or manual cohorts)
    if (Array.isArray(body.recipients) && body.recipients.length > 0) {
      candidates = [
        ...candidates,
        ...body.recipients.map((r: { email: string; firstName?: string; company?: string }) => ({
          email: r.email,
          firstName: r.firstName || '',
          company: r.company || '',
        })),
      ];
    }

    // 3. Fallback for testing if no recipients gathered
    if (candidates.length === 0) {
      const testEmail = process.env.TEST_EMAIL || 'test@coincashy.io';
      candidates = [
        {
          email: testEmail,
          firstName: 'Institutional Lead',
          company: 'Coincashy Treasury Test',
        },
      ];
    }

    // 4. CRITICAL: Suppression Filter Audit (Excludes ANY suppressed recipient)
    const validRecipients: CandidateRecipient[] = [];
    let suppressedFilteredCount = 0;

    for (const cand of candidates) {
      const normalized = cand.email.toLowerCase().trim();
      const suppressed = await isEmailSuppressed(normalized);
      if (suppressed) {
        suppressedFilteredCount++;
      } else {
        // Prevent duplicate emails in the same campaign snapshot
        if (!validRecipients.some((r) => r.email.toLowerCase() === normalized)) {
          validRecipients.push({
            ...cand,
            email: normalized,
          });
        }
      }
    }

    if (validRecipients.length === 0) {
      return NextResponse.json(
        {
          error:
            'No valid deliverable recipients found (all candidate emails are in the suppression list).',
          suppressedFilteredCount,
        },
        { status: 400 }
      );
    }

    // 5. Freeze snapshot into campaign_recipients
    const rowsToInsert = validRecipients.map((r) => ({
      id: crypto.randomUUID(),
      campaignId: campaign.id,
      email: r.email,
      firstName: r.firstName || null,
      company: r.company || null,
      hubspotContactId: r.hubspotContactId || null,
      status: 'pending' as const,
      resendMessageId: null,
      sentAt: null,
      openedAt: null,
      clickedAt: null,
      errorMessage: null,
    }));

    // Clear any previous draft recipient rows if re-approving
    await db
      .delete(campaignRecipients)
      .where(eq(campaignRecipients.campaignId, campaign.id));

    // Batch insert snapshotted recipients
    await db.insert(campaignRecipients).values(rowsToInsert);

    // 6. Transition campaign status to 'scheduled'
    const now = new Date().toISOString();
    await db
      .update(emailCampaigns)
      .set({
        status: 'scheduled',
        approvedAt: now,
        approvedBy: body.approvedBy || 'admin',
        totalRecipients: rowsToInsert.length,
      })
      .where(eq(emailCampaigns.id, campaign.id));

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      snapshottedRecipients: rowsToInsert.length,
      suppressedFilteredCount,
      status: 'scheduled',
      approvedAt: now,
    });
  } catch (error) {
    console.error('[Campaign Approval Error]', error);
    return NextResponse.json(
      { error: 'Failed to approve and snapshot campaign recipients' },
      { status: 500 }
    );
  }
}
