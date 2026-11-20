'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type AccountType = 'personal' | 'corporate';

export default function SignupPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute password strength score (0 to 4)
  const computeStrength = (pass: string): number => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = computeStrength(password);
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['var(--coral)', 'var(--coral)', 'var(--pending)', 'var(--coin-usdt)', 'var(--coin-usdt)'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }

    if (!agreePrivacy) {
      setError('You must agree to the Privacy Policy.');
      return;
    }

    setIsLoading(true);

    // Simulate account setup and onboarding
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1200);
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

      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2
          style={{
            fontSize: '1.35rem',
            fontWeight: 650,
            letterSpacing: '-0.02em',
            color: 'var(--hi)',
            marginBottom: '0.35rem',
          }}
        >
          Create Account
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', lineHeight: 1.45 }}>
          Enter your email address to establish your European crypto-fiat treasury.
        </p>
      </div>

      {/* Account Type Selector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4px',
          padding: '3px',
          borderRadius: '10px',
          background: 'var(--surface-2)',
          border: '1px solid var(--line)',
          marginBottom: '1.25rem',
        }}
      >
        <button
          type="button"
          onClick={() => setAccountType('personal')}
          style={{
            padding: '6px 10px',
            borderRadius: '7px',
            fontSize: '0.78rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            background: accountType === 'personal' ? 'var(--ground)' : 'transparent',
            color: accountType === 'personal' ? 'var(--hi)' : 'var(--fg-dim)',
            boxShadow: accountType === 'personal' ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
          }}
        >
          Personal
        </button>
        <button
          type="button"
          onClick={() => setAccountType('corporate')}
          style={{
            padding: '6px 10px',
            borderRadius: '7px',
            fontSize: '0.78rem',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            background: accountType === 'corporate' ? 'var(--ground)' : 'transparent',
            color: accountType === 'corporate' ? 'var(--hi)' : 'var(--fg-dim)',
            boxShadow: accountType === 'corporate' ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
          }}
        >
          Corporate / B2B
        </button>
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
        {/* Email Address */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="signup-email"
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
            {accountType === 'corporate' ? 'Corporate Work Email' : 'Email Address'}
          </label>
          <input
            id="signup-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={accountType === 'corporate' ? 'alex@company.com' : 'you@example.com'}
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

        {/* Password Field */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="signup-password"
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
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a secure password"
              autoComplete="new-password"
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
                outline: 'none',
                transition: 'border-color 0.2s',
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

          {/* Password Strength Indicator */}
          {password && (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '3px', height: '3px', marginBottom: '0.35rem' }}>
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    style={{
                      flex: 1,
                      borderRadius: '2px',
                      background: strength >= step ? strengthColors[strength] : 'var(--line)',
                      transition: 'background 0.3s ease',
                    }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                <span style={{ color: strengthColors[strength], fontWeight: 500 }}>{strengthLabels[strength]}</span>
                <span style={{ color: 'var(--fg-faint)' }}>Min 8 chars with numbers &amp; symbols</span>
              </div>
            </div>
          )}
        </div>

        {/* Checkbox 1: Terms */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '0.75rem' }}>
          <input
            id="terms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            style={{
              width: '15px',
              height: '15px',
              marginTop: '2px',
              borderRadius: '4px',
              accentColor: '#3B82F6',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          />
          <label htmlFor="terms" style={{ fontSize: '0.75rem', color: 'var(--fg-dim)', cursor: 'pointer', lineHeight: 1.4 }}>
            I agree to the{' '}
            <Link href="/terms" target="_blank" style={{ color: 'var(--hi)', textDecoration: 'underline' }}>
              Terms and Conditions
            </Link>{' '}
            and{' '}
            <Link href="/disclaimer" target="_blank" style={{ color: 'var(--hi)', textDecoration: 'underline' }}>
              Risk Disclosure
            </Link>
          </label>
        </div>

        {/* Checkbox 2: Privacy */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '1.25rem' }}>
          <input
            id="privacy"
            type="checkbox"
            checked={agreePrivacy}
            onChange={(e) => setAgreePrivacy(e.target.checked)}
            style={{
              width: '15px',
              height: '15px',
              marginTop: '2px',
              borderRadius: '4px',
              accentColor: '#3B82F6',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          />
          <label htmlFor="privacy" style={{ fontSize: '0.75rem', color: 'var(--fg-dim)', cursor: 'pointer', lineHeight: 1.4 }}>
            I agree to the{' '}
            <Link href="/privacy" target="_blank" style={{ color: 'var(--hi)', textDecoration: 'underline' }}>
              Privacy Policy
            </Link>{' '}
            and GDPR processing
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
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      {/* Bottom Switcher */}
      <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--fg-dim)' }}>
        Already have an account?{' '}
        <Link
          href="/auth/login"
          style={{
            color: 'var(--jade-text-d)',
            fontWeight: 600,
            textDecoration: 'none',
          }}
          className="hover:underline"
        >
          Back to login
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
