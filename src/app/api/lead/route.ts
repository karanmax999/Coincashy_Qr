import { NextResponse } from 'next/server';

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request: Request) {
  try {
    const data = await request.json().catch(() => null);

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Request body is required.' },
        { status: 400 }
      );
    }

    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const email = typeof data.email === 'string' ? data.email.trim() : '';
    const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
    const company = typeof data.company === 'string' ? data.company.trim() : '';
    const telegram = typeof data.telegram === 'string' ? data.telegram.trim() : '';
    const notes = typeof data.notes === 'string' ? data.notes.trim() : '';
    const eventName = typeof data.eventName === 'string' && data.eventName.trim() ? data.eventName.trim() : 'Coincashy Event';
    const source = typeof data.source === 'string' && data.source.trim() ? data.source.trim() : 'qr';
    const interests = Array.isArray(data.interests) ? data.interests.join(', ') : (typeof data.interests === 'string' ? data.interests : '');

    // Validation
    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Full name is required.' },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Phone or WhatsApp number is required for follow-up.' },
        { status: 400 }
      );
    }

    // Parse first name and last name
    const nameParts = name.split(/\s+/);
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(' ') || '';

    // Build structured message summary
    const messageLines = [
      `--- Event Lead Capture ---`,
      `Event: ${eventName}`,
      `Source: ${source}`,
      interests ? `Interested Topics: ${interests}` : '',
      telegram ? `Telegram: ${telegram}` : '',
      company ? `Company / Project: ${company}` : '',
      notes ? `Notes / Inquiry: ${notes}` : '',
      `Submitted At: ${new Date().toISOString()}`,
    ].filter(Boolean);

    const formattedMessage = messageLines.join('\n');

    const portalId = process.env.HUBSPOT_PORTAL_ID || '247718972';
    const formId = process.env.HUBSPOT_LEAD_FORM_ID || '7106e4ce-0d13-4c1d-8958-77280cc48f9a';
    const region = (process.env.HUBSPOT_REGION || 'na2').toLowerCase();

    const baseHost = region === 'na2'
      ? 'https://api-na2.hsforms.com'
      : region === 'eu1'
      ? 'https://api-eu1.hsforms.com'
      : 'https://api.hsforms.com';

    const hubspotEndpoint = `${baseHost}/submissions/v3/integration/submit/${portalId}/${formId}`;

    // Extract client IP address from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : (realIp || undefined);

    // Extract HubSpot tracking cookie (hubspotutk)
    const cookieHeader = request.headers.get('cookie') || '';
    const cookieMatch = cookieHeader.match(/hubspotutk=([^;]+)/);
    const hutk = (typeof data.hutk === 'string' && data.hutk.trim())
      ? data.hutk.trim()
      : (cookieMatch ? decodeURIComponent(cookieMatch[1].trim()) : undefined);

    const context: Record<string, string> = {
      pageUri: typeof data.pageUri === 'string' && data.pageUri.trim()
        ? data.pageUri.trim()
        : `https://coincashy.io/lead?event=${encodeURIComponent(eventName)}&source=${encodeURIComponent(source)}`,
      pageName: `Coincashy Event - ${eventName}`,
    };

    if (clientIp) {
      context.ipAddress = clientIp;
    }
    if (hutk) {
      context.hutk = hutk;
    }

    const hubspotPayload = {
      submittedAt: Date.now(),
      fields: [
        { name: 'firstname', value: firstName },
        { name: 'lastname', value: lastName },
        { name: 'email', value: email },
        { name: 'phone', value: phone },
        { name: 'company', value: company || 'Individual / Web3' },
        { name: 'message', value: formattedMessage },
        { name: 'notes', value: formattedMessage },
        { name: 'interested_products', value: interests || 'Event Lead' },
      ],
      context,
    };

    const hsResponse = await fetch(hubspotEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hubspotPayload),
    });

    if (!hsResponse.ok) {
      const errorText = await hsResponse.text();
      console.error('HubSpot lead submission error:', hsResponse.status, errorText);
      return NextResponse.json(
        { success: false, message: 'HubSpot rejected the submission.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lead captured successfully.',
      firstName,
    });
  } catch (error) {
    console.error('Unexpected lead submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while capturing lead.' },
      { status: 500 }
    );
  }
}
