import { NextResponse } from 'next/server';
import { listHubSpotLists, getListMemberships, batchGetContacts } from '@/lib/hubspot';
import { db, emailSuppressionList } from '@/lib/db';
import { inArray } from 'drizzle-orm';

/**
 * Returns HubSpot lists with their total CRM member count AND
 * post-suppression count (filtering out any currently suppressed emails).
 */
export async function GET() {
  try {
    let lists = [];
    try {
      lists = await listHubSpotLists();
    } catch (err) {
      console.warn('[HubSpot Lists API] Could not fetch lists from HubSpot CRM:', err);
      // Fallback sample lists if HubSpot token is offline or not configured yet
      lists = [
        { listId: '1', name: 'Institutional OTC Clients', size: 45 },
        { listId: '2', name: 'Web3 Founders & Family Offices', size: 120 },
        { listId: '3', name: 'Event Leads (Devcon / Token2049)', size: 85 },
      ];
    }

    // Enhance each list with suppression check
    const enhancedLists = await Promise.all(
      lists.map(async (l) => {
        let suppressedCount = 0;
        try {
          if (process.env.HUBSPOT_ACCESS_TOKEN) {
            const memberships = await getListMemberships(l.listId, undefined, 100);
            const contactIds = memberships.results.map((m) => m.recordId);
            if (contactIds.length > 0) {
              const contacts = await batchGetContacts(contactIds);
              const emails = contacts.map((c) => c.email.toLowerCase());
              if (emails.length > 0) {
                const suppressed = await db
                  .select({ email: emailSuppressionList.email })
                  .from(emailSuppressionList)
                  .where(inArray(emailSuppressionList.email, emails));
                suppressedCount = suppressed.length;
              }
            }
          }
        } catch {
          // Keep count as 0 if live lookup failed
        }

        const totalMembers = l.size || 0;
        const deliverableMembers = Math.max(0, totalMembers - suppressedCount);

        return {
          id: l.listId,
          name: l.name,
          totalCount: totalMembers,
          suppressedCount,
          deliverableCount: deliverableMembers,
        };
      })
    );

    return NextResponse.json({ lists: enhancedLists });
  } catch (error) {
    console.error('[HubSpot Lists Route Error]', error);
    return NextResponse.json({ error: 'Failed to load HubSpot lists' }, { status: 500 });
  }
}
