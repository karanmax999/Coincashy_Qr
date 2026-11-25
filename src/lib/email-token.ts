import crypto from 'crypto';

const HMAC_SECRET =
  process.env.UNSUBSCRIBE_SECRET ||
  process.env.ADMIN_PASSWORD ||
  'coincashy-default-secret-change-in-prod';

/**
 * Generates an HMAC-signed unsubscribe token for an email address.
 * Format: base64url(email).hmac_signature
 */
export function generateUnsubscribeToken(email: string): string {
  const normalized = email.toLowerCase().trim();
  const hmac = crypto
    .createHmac('sha256', HMAC_SECRET)
    .update(normalized)
    .digest('hex');

  const emailEncoded = Buffer.from(normalized, 'utf8').toString('base64url');
  return `${emailEncoded}.${hmac}`;
}

/**
 * Verifies an HMAC-signed unsubscribe token and returns the normalized email.
 */
export function verifyUnsubscribeToken(
  token: string
): { valid: boolean; email?: string } {
  if (!token || typeof token !== 'string') {
    return { valid: false };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false };
  }

  const [emailEncoded, receivedHmac] = parts;

  try {
    const email = Buffer.from(emailEncoded, 'base64url').toString('utf8');
    const expectedHmac = crypto
      .createHmac('sha256', HMAC_SECRET)
      .update(email)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    const isValid =
      receivedHmac.length === expectedHmac.length &&
      crypto.timingSafeEqual(
        Buffer.from(receivedHmac, 'hex'),
        Buffer.from(expectedHmac, 'hex')
      );

    if (isValid) {
      return { valid: true, email };
    }
  } catch (err) {
    console.warn('[Unsubscribe Token] Verification failed:', err);
  }

  return { valid: false };
}
