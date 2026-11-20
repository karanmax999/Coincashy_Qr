'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your username or email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication processing
    setTimeout(() => {
      setIsLoading(false);
      // For now, redirect to dashboard or show simulated logged-in state
      router.push('/dashboard');
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
      {/* Mobile Branding (only visible on smaller screens) */}
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

      {/* Header */}
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
          Login
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', lineHeight: 1.45 }}>
          Enter your credentials to access your trading workspace and accounts.
        </p>
      </div>

      {/* Error Alert */}
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

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        {/* Username / Email Field */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="identifier"
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
          <div style={{ position: 'relative' }}>
            <input
              id="identifier"
              type="text"
              name="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Username or work email"
              autoComplete="username"
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
                transition: 'border-color 0.2s, box-shadow 0.2s',
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#3B82F6')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line-2)')}
            />
          </div>
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <label
              htmlFor="password"
              style={{
                fontSize: '0.74rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--fg-dim)',
              }}
            >
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              style={{
                fontSize: '0.74rem',
                color: 'var(--jade-text-d)',
                fontWeight: 500,
                transition: 'opacity 0.2s',
              }}
              className="hover:underline"
            >
              Reset password
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                height: '42px',
                padding: '0 2.5rem 0 0.85rem',
                borderRadius: '10px',
                background: 'var(--surface-2)',
                border: '1px solid var(--line-2)',
                color: 'var(--hi)',
                fontSize: '0.84rem',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#3B82F6')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--line-2)')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--fg-dim)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg className="ic" style={{ width: 16, height: 16 }}>
                <use href={showPassword ? '#i-eye' : '#i-eye'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{
              width: '15px',
              height: '15px',
              borderRadius: '4px',
              accentColor: '#3B82F6',
              cursor: 'pointer',
            }}
          />
          <label htmlFor="remember" style={{ fontSize: '0.76rem', color: 'var(--fg-dim)', cursor: 'pointer', userSelect: 'none' }}>
            Remember this device for 30 days
          </label>
        </div>

        {/* Submit Button */}
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
          {isLoading ? (
            <>
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid currentColor',
                  borderRightColor: 'transparent',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.6s linear infinite',
                }}
              />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <svg className="ic" aria-hidden="true" style={{ width: 14, height: 14 }}><use href="#i-arrow-right" /></svg>
            </>
          )}
        </button>
      </form>

      {/* Alternative SSO / Passkey */}
      <div style={{ margin: '1.25rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-faint)' }}>or</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--line)' }} />
      </div>

      <button
        type="button"
        onClick={() => router.push('/dashboard')}
        className="btn btn-line"
        style={{
          width: '100%',
          height: '40px',
          borderRadius: '10px',
          fontSize: '0.8rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: 'var(--hi)',
          borderColor: 'var(--line-2)',
        }}
      >
        <svg className="ic" style={{ width: 14, height: 14 }}><use href="#i-lock" /></svg>
        <span>Sign in with Passkey / Security Key</span>
      </button>

      {/* Bottom Switcher */}
      <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--fg-dim)' }}>
        New user?{' '}
        <Link
          href="/auth/signup"
          style={{
            color: 'var(--jade-text-d)',
            fontWeight: 600,
            textDecoration: 'none',
          }}
          className="hover:underline"
        >
          Sign up
        </Link>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
