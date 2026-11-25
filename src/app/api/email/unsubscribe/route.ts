import { NextRequest, NextResponse } from 'next/server';
import { verifyUnsubscribeToken } from '@/lib/email-token';
import { suppressEmail } from '@/lib/resend';
import { syncSuppressionToHubSpot } from '@/lib/hubspot';

/**
 * RFC 8058 One-Click & Web Unsubscribe Endpoint
 * Excluded from admin HTTP Basic Auth middleware in src/middleware.ts.
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let token = searchParams.get('token');

    if (!token) {
      // Try reading token from body if sent via JSON / form-data
      const body = await request.json().catch(() => null);
      if (body && typeof body.token === 'string') {
        token = body.token;
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unsubscribe token is required' },
        { status: 400 }
      );
    }

    const verification = verifyUnsubscribeToken(token);
    if (!verification.valid || !verification.email) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired unsubscribe token' },
        { status: 403 }
      );
    }

    const email = verification.email;

    // 1. Write to local suppression database
    await suppressEmail(email, 'unsubscribe', 'one-click-header');

    // 2. Sync to HubSpot custom contact property (console_email_suppressed = true)
    syncSuppressionToHubSpot(email).catch((err) => {
      console.error('[HubSpot Unsubscribe Sync Background Error]', err);
    });

    return NextResponse.json({
      success: true,
      message: `Successfully unsubscribed ${email}`,
    });
  } catch (error) {
    console.error('[Unsubscribe API Error]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process unsubscribe request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/unsubscribe?error=missing_token', request.url));
  }

  const verification = verifyUnsubscribeToken(token);
  if (!verification.valid || !verification.email) {
    return NextResponse.redirect(new URL('/unsubscribe?error=invalid_token', request.url));
  }

  const email = verification.email;

  try {
    // 1. Write to local suppression database
    await suppressEmail(email, 'unsubscribe', 'landing-page');

    // 2. Sync to HubSpot custom contact property
    syncSuppressionToHubSpot(email).catch((err) => {
      console.error('[HubSpot Unsubscribe Sync Background Error]', err);
    });

    const redirectUrl = new URL('/unsubscribe', request.url);
    redirectUrl.searchParams.set('unsubscribed', 'true');
    redirectUrl.searchParams.set('email', email);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('[Unsubscribe GET Error]', error);
    return NextResponse.redirect(new URL('/unsubscribe?error=server_error', request.url));
  }
}
