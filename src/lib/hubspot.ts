/**
 * HubSpot CRM Integration (Sales Hub Starter compatible)
 *
 * NOTE ON PERMISSIONS & RESTRICTIONS:
 * 1. Single-send marketing email APIs require Marketing Hub Enterprise/Pro. We use
 *    HubSpot strictly as the CRM source of truth (lists, properties, activity notes).
 * 2. CORRECTION #1: `hs_email_optout` is a READ-ONLY system property in HubSpot CRM v3 API.
 *    Do not attempt to PATCH it. Instead, we sync suppression to the custom contact
 *    property `console_email_suppressed` (boolean).
 */

const HUBSPOT_BASE_URL = 'https://api.hubapi.com';

function getHubSpotToken(): string {
  const token = process.env.HUBSPOT_ACCESS_TOKEN || process.env.HUBSPOT_API_KEY;
  if (!token) {
    throw new Error('HUBSPOT_ACCESS_TOKEN is not set in environment variables');
  }
  return token;
}

async function hubspotFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getHubSpotToken();
  const url = endpoint.startsWith('http') ? endpoint : `${HUBSPOT_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`HubSpot API error [${res.status} ${res.statusText}]: ${errorBody}`);
  }

  // Handle empty responses (like 204 No Content)
  if (res.status === 204) {
    return {} as T;
  }

  return (await res.json()) as T;
}

export interface HubSpotList {
  listId: string;
  name: string;
  objectTypeId: string;
  size?: number;
  updatedAt?: string;
}

export interface HubSpotListMembershipResponse {
  results: Array<{
    recordId: string;
    membershipTimestamp?: string;
  }>;
  paging?: {
    next?: {
      after: string;
      link?: string;
    };
  };
}

export interface HubSpotContactRecord {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  consoleEmailSuppressed?: boolean;
}

/**
 * 1. List HubSpot Lists/Segments (v3 API)
 */
export async function listHubSpotLists(): Promise<HubSpotList[]> {
  try {
    // Try CRM Lists v3 search / listing
    const data = await hubspotFetch<{
      lists?: Array<{
        listId: string;
        name: string;
        objectTypeId: string;
        additionalProperties?: { hs_list_size?: string };
        updatedAt?: string;
      }>;
      results?: Array<{
        listId: string;
        name: string;
        objectTypeId: string;
        additionalProperties?: { hs_list_size?: string };
        updatedAt?: string;
      }>;
    }>('/crm/v3/lists/search', {
      method: 'POST',
      body: JSON.stringify({
        count: 100,
      }),
    });

    const rawLists = data.lists || data.results || [];
    return rawLists.map((l) => ({
      listId: String(l.listId),
      name: l.name,
      objectTypeId: l.objectTypeId,
      size: l.additionalProperties?.hs_list_size
        ? parseInt(l.additionalProperties.hs_list_size, 10)
        : undefined,
      updatedAt: l.updatedAt,
    }));
  } catch (err) {
    console.warn('[HubSpot] /crm/v3/lists/search failed, falling back to legacy endpoint:', err);
    // Fallback to legacy contact lists endpoint if v3 list search isn't enabled
    const legacyData = await hubspotFetch<{
      lists: Array<{
        internalListId: number;
        name: string;
        metaData?: { size?: number };
        updatedAt?: number;
      }>;
    }>('/contacts/v1/lists?count=100');

    return (legacyData.lists || []).map((l) => ({
      listId: String(l.internalListId),
      name: l.name,
      objectTypeId: '0-1',
      size: l.metaData?.size,
      updatedAt: l.updatedAt ? new Date(l.updatedAt).toISOString() : undefined,
    }));
  }
}

/**
 * 2. Pull list memberships with pagination
 */
export async function getListMemberships(
  listId: string,
  after?: string,
  limit: number = 100
): Promise<HubSpotListMembershipResponse> {
  const query = new URLSearchParams({ limit: String(limit) });
  if (after) {
    query.set('after', after);
  }

  return hubspotFetch<HubSpotListMembershipResponse>(
    `/crm/v3/lists/${encodeURIComponent(listId)}/memberships?${query.toString()}`
  );
}

/**
 * 3. Batch contact fetch by IDs (extracts email, firstname, lastname, company)
 */
export async function batchGetContacts(contactIds: string[]): Promise<HubSpotContactRecord[]> {
  if (!contactIds.length) return [];

  // Chunk to 100 contacts max per batch request
  const chunks: string[][] = [];
  for (let i = 0; i < contactIds.length; i += 100) {
    chunks.push(contactIds.slice(i, i + 100));
  }

  const results: HubSpotContactRecord[] = [];

  for (const chunk of chunks) {
    const data = await hubspotFetch<{
      results: Array<{
        id: string;
        properties: {
          email?: string;
          firstname?: string;
          lastname?: string;
          company?: string;
          console_email_suppressed?: string;
        };
      }>;
    }>('/crm/v3/objects/contacts/batch/read', {
      method: 'POST',
      body: JSON.stringify({
        properties: [
          'email',
          'firstname',
          'lastname',
          'company',
          'console_email_suppressed',
        ],
        inputs: chunk.map((id) => ({ id })),
      }),
    });

    for (const record of data.results || []) {
      if (record.properties?.email) {
        results.push({
          id: record.id,
          email: record.properties.email.toLowerCase().trim(),
          firstName: record.properties.firstname || '',
          lastName: record.properties.lastname || '',
          company: record.properties.company || '',
          consoleEmailSuppressed:
            record.properties.console_email_suppressed === 'true' ||
            record.properties.console_email_suppressed === '1',
        });
      }
    }
  }

  return results;
}

/**
 * 4. Log email dispatch note to contact timeline
 * Uses associationTypeId 202 (HubSpot Defined: Note to Contact)
 */
export async function logEmailActivityNote(
  hubspotContactId: string,
  noteBody: string
): Promise<{ noteId: string }> {
  const response = await hubspotFetch<{ id: string }>('/crm/v3/objects/notes', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        hs_timestamp: new Date().toISOString(),
        hs_note_body: noteBody,
      },
      associations: [
        {
          to: { id: hubspotContactId },
          types: [
            {
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: 202, // Note to Contact
            },
          ],
        },
      ],
    }),
  });

  return { noteId: response.id };
}

/**
 * 5. Sync suppression to HubSpot contact
 *
 * IMPORTANT (CORRECTION #1):
 * `hs_email_optout` is a read-only field in HubSpot CRM.
 * We write to `console_email_suppressed: "true"` instead.
 *
 * TODO: Hook for HubSpot subscription-preferences API
 * (e.g. POST /communication-preferences/v3/unsubscribe requires specific marketing scopes).
 */
export async function syncSuppressionToHubSpot(email: string): Promise<boolean> {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Search for contact by email
    const searchRes = await hubspotFetch<{
      total: number;
      results: Array<{ id: string }>;
    }>('/crm/v3/objects/contacts/search', {
      method: 'POST',
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: normalizedEmail,
              },
            ],
          },
        ],
        properties: ['email'],
        limit: 1,
      }),
    });

    if (!searchRes.results || searchRes.results.length === 0) {
      console.log(`[HubSpot Suppression] Contact with email ${normalizedEmail} not found in CRM. Skipping property sync.`);
      return false;
    }

    const contactId = searchRes.results[0].id;

    // 2. Update custom contact property `console_email_suppressed`
    await hubspotFetch(`/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        properties: {
          console_email_suppressed: 'true',
        },
      }),
    });

    // TODO: Hook for HubSpot subscription-preferences API once marketing scopes are active:
    // await hubspotFetch('/communication-preferences/v3/unsubscribe', {
    //   method: 'POST',
    //   body: JSON.stringify({ emailAddress: normalizedEmail, subscriptionId: '...' })
    // });

    console.log(`[HubSpot Suppression] Flagged console_email_suppressed=true for contact ${contactId} (${normalizedEmail})`);
    return true;
  } catch (err) {
    console.error('[HubSpot Suppression Error] Failed to update suppression status:', err);
    return false;
  }
}
