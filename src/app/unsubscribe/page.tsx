'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const initialUnsubscribed = searchParams.get('unsubscribed') === 'true';
  const paramEmail = searchParams.get('email');
  const errorParam = searchParams.get('error');

  const [status, setStatus] = useState<'initial' | 'processing' | 'done' | 'error'>(
    initialUnsubscribed ? 'done' : errorParam ? 'error' : 'initial'
  );
  const [email, setEmail] = useState<string>(paramEmail || '');
  const [errorMessage, setErrorMessage] = useState<string>(
    errorParam ? 'Invalid or expired unsubscribe link.' : ''
  );

  useEffect(() => {
    if (token && !initialUnsubscribed && !errorParam) {
      // Decode email preview from token if possible
      try {
        const [emailEncoded] = token.split('.');
        if (emailEncoded) {
          const decoded = atob(emailEncoded.replace(/-/g, '+').replace(/_/g, '/'));
          if (decoded && decoded.includes('@')) {
            setEmail(decoded);
          }
        }
      } catch {
        // fallback
      }
    }
  }, [token, initialUnsubscribed, errorParam]);

  async function handleConfirm() {
    if (!token) {
      setStatus('error');
      setErrorMessage('Missing unsubscribe token.');
      return;
    }

    setStatus('processing');
    try {
      const res = await fetch('/api/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus('done');
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Failed to process unsubscribe request.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('A network error occurred. Please try again or contact support.');
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#F2F2F2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#0A0A0A',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Brand Header */}
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#F2F2F2',
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            <span
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: '#0000FF',
                borderRadius: '50%',
                marginRight: '8px',
                display: 'inline-block',
              }}
            />
            COINCASHY
          </Link>
          <div
            style={{
              fontSize: '12px',
              color: '#8E8E93',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: '4px',
            }}
          >
            Communication Preferences
          </div>
        </div>

        {status === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 255, 0.15)',
                color: '#6B6BFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                fontSize: '24px',
              }}
            >
              ✓
            </div>
            <h1
              style={{
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#FFFFFF',
              }}
            >
              Unsubscribed Successfully
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#94A3B8',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}
            >
              {email ? (
                <>
                  <strong style={{ color: '#F2F2F2' }}>{email}</strong> has been
                  removed from our mailing lists.
                </>
              ) : (
                'You have been removed from our communications list.'
              )}
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                backgroundColor: '#F2F2F2',
                color: '#000000',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Return to Coincashy
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(242, 154, 136, 0.15)',
                color: '#F29A88',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                fontSize: '22px',
              }}
            >
              !
            </div>
            <h1
              style={{
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#FFFFFF',
              }}
            >
              Unable to Unsubscribe
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#94A3B8',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}
            >
              {errorMessage || 'The link may be invalid or expired.'}
            </p>
            <p style={{ fontSize: '13px', color: '#666666', marginBottom: '24px' }}>
              If you need help, please email{' '}
              <a
                href="mailto:support@coincashy.io"
                style={{ color: '#6B6BFF', textDecoration: 'underline' }}
              >
                support@coincashy.io
              </a>
              .
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#F2F2F2',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Go to Homepage
            </Link>
          </div>
        )}

        {status === 'initial' && (
          <div>
            <h1
              style={{
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '12px',
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              Unsubscribe Confirmation
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#94A3B8',
                lineHeight: '1.6',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              {email ? (
                <>
                  Are you sure you want to stop receiving market updates and
                  announcements for <strong style={{ color: '#F2F2F2' }}>{email}</strong>?
                </>
              ) : (
                'Are you sure you want to unsubscribe from Coincashy communications?'
              )}
            </p>

            <button
              onClick={handleConfirm}
              style={{
                width: '100%',
                backgroundColor: '#0000FF',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '12px',
              }}
            >
              Confirm Unsubscribe
            </button>

            <div style={{ textAlign: 'center' }}>
              <Link
                href="/"
                style={{
                  fontSize: '13px',
                  color: '#8E8E93',
                  textDecoration: 'none',
                }}
              >
                Cancel and return to site
              </Link>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <p style={{ fontSize: '15px', color: '#94A3B8' }}>Processing your request...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: '#000000',
            color: '#F2F2F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Loading preferences...
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
