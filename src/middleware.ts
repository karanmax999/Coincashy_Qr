import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin/* and /api/email/* routes
  const isAdminRoute = pathname.startsWith('/admin');
  const isEmailApiRoute = pathname.startsWith('/api/email');

  if (!isAdminRoute && !isEmailApiRoute) {
    return NextResponse.next();
  }

  // Exempt public & dedicated-auth email endpoints:
  // 1. /api/email/unsubscribe (secured by HMAC-signed recipient token)
  // 2. /api/email/webhooks (secured by Resend/Svix webhook signatures)
  // 3. /api/email/cron/* (secured by Bearer CRON_SECRET for Vercel Cron)
  if (
    pathname.startsWith('/api/email/unsubscribe') ||
    pathname.startsWith('/api/email/webhooks') ||
    pathname.startsWith('/api/email/cron')
  ) {
    return NextResponse.next();
  }

  // HTTP Basic Auth verification for protected console & endpoints
  const authHeader = request.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Basic ')) {
    const base64Credentials = authHeader.split(' ')[1];
    try {
      const decoded = atob(base64Credentials);
      const [user, ...pwdParts] = decoded.split(':');
      const password = pwdParts.join(':');

      const expectedUser = process.env.ADMIN_USER;
      const expectedPassword = process.env.ADMIN_PASSWORD;

      // Ensure credentials are configured and match
      if (
        expectedUser &&
        expectedPassword &&
        user === expectedUser &&
        password === expectedPassword
      ) {
        return NextResponse.next();
      }
    } catch {
      // Decode failed, fall through to 401
    }
  }

  return new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Coincashy Admin Console", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/api/email/:path*'],
};
