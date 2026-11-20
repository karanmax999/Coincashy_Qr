'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please provide your username or email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div
      style={{
        padding: 'clamp(1.25rem, 3.5vw, 2rem)',
        borderRadius: '20px',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Mobile Branding */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }} className="lg:hidden">
        <Link href="/" style={{ display: 'inline-block' }}>
          <Image
            src="/media/logo-white.png"
            alt="Coincashy"
            width={120}
            height={26}
            style={{ height: '26px', width: 'auto' }}
            className="logo-on-dark"
          />
          <Image
            src="/media/logo-black.png"
            alt="Coincashy"
            width={120}
            height={26}
            style={{ height: '26px', width: 'auto' }}
            className="logo-on-paper"
          />
        </Link>
      </div>

      {isSubmitted ? (
        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(39, 161, 127, 0.15)',
              color: 'var(--coin-usdt)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              border: '1px solid rgba(107, 107, 255, 0.3)',
            }}
          >
            <svg className="ic" style={{ width: 22, height: 22 }}><use href="#i-check" /></svg>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 650, color: 'var(--hi)', marginBottom: '0.5rem' }}>
            Check your email
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--fg-dim)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            If an account exists for <b style={{ color: 'var(--hi)' }}>{identifier}</b>, we have dispatched a secure password reset link. Please check your inbox and spam folder.
          </p>
          <Link
            href="/auth/login"
            className="btn btn-solid"
            style={{
              width: '100%',
              height: '42px',
              borderRadius: '10px',
              fontSize: '0.86rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0000FF, #3B82F6)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 4px 14px rgba(0, 0, 255, 0.3)',
            }}
          >
            Back to login
          </Link>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.35rem',
                fontWeight: 650,
                letterSpacing: '-0.02em',
                color: 'var(--hi)',
                marginBottom: '0.35rem',
              }}
            >
              Reset password
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', lineHeight: 1.45 }}>
              Enter your verified email or username and we'll send a secure link to reset your password.
            </p>
          </div>

          {error && (
            <div
              style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                background: 'rgba(242, 154, 136, 0.12)',
                border: '1px solid var(--coral)',
                color: 'var(--coral)',
                fontSize: '0.78rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg className="ic" style={{ width: 14, height: 14, flexShrink: 0 }}><use href="#i-x" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="reset-identifier"
                style={{
                  display: 'block',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--fg-dim)',
                  marginBottom: '0.35rem',
                }}
              >
                Username or Email
              </label>
              <input
                id="reset-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Username or work email"
                autoComplete="email"
                required
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 0.85rem',
                  borderRadius: '10px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line-2)',
                  color: 'var(--hi)',
                  fontSize: '0.84rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#3B82F6')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line-2)')}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-solid"
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '10px',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: isLoading ? 'wait' : 'pointer',
                opacity: isLoading ? 0.75 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #0000FF, #3B82F6)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 4px 14px rgba(0, 0, 255, 0.3)',
              }}
            >
              {isLoading ? 'Sending link...' : 'Send reset link'}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.78rem' }}>
            <Link
              href="/auth/login"
              style={{
                color: 'var(--fg-dim)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              className="hover:text-[var(--hi)]"
            >
              <svg className="ic" style={{ width: 14, height: 14 }}><use href="#i-chevron-left" /></svg>
              <span>Back to login</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
