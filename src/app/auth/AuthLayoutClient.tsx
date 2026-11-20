'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleToggleTheme = () => {
    if (typeof window !== 'undefined' && window.__toggleTheme) {
      window.__toggleTheme();
    }
  };

  return (
    <div className="auth-split-layout">
      {/* ============ LEFT SHOWCASE PANE (Desktop >= 1024px, Static & Locked) ============ */}
      <aside className="auth-showcase-pane" aria-label="Coincashy Institutional Highlights">
        {/* Background Visual Effects */}
        <div className="auth-glow-top" />
        <div className="auth-glow-bottom" />
        <div className="auth-glow-center" />
        <svg
          className="auth-bg-rings"
          viewBox="0 0 800 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <g fill="none" stroke="currentColor" strokeWidth={1.2}>
            <circle cx={400} cy={400} r={180} />
            <circle cx={400} cy={400} r={280} />
            <circle cx={400} cy={400} r={380} strokeDasharray="4 6" opacity="0.8" />
            <circle cx={400} cy={400} r={480} />
            <circle cx={400} cy={400} r={580} strokeDasharray="6 8" opacity="0.6" />
          </g>
        </svg>

        {/* Top Header & Brand */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Link href="/" aria-label="Back to Coincashy home" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Image src="/media/logo-white.png" alt="Coincashy" width={135} height={30} style={{ height: '30px', width: 'auto' }} priority />
          </Link>
          
          <div style={{ marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', fontSize: '0.75rem', color: '#fff', fontWeight: 500, backdropFilter: 'blur(10px)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3B82F6', boxShadow: '0 0 10px rgba(59, 130, 246, 0.8)' }} />
            <span>Polish VASP Registered · KRS: 0001135823 · EU MiCA</span>
          </div>
        </div>

        {/* Middle Value Proposition (Compact, 1-screen fit) */}
        <div style={{ position: 'relative', zIndex: 2, margin: 'auto 0', padding: '1.5rem 0' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '1rem', color: '#ffffff' }}>
            The institutional gateway for European <em style={{ fontStyle: 'italic', color: '#60A5FA' }}>crypto-fiat settlement.</em>
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.95rem', lineHeight: 1.55, maxWidth: '480px', margin: 0 }}>
            Access deep institutional liquidity, automated SEPA Instant clearing, and dedicated multi-currency virtual IBANs from a single regulated workspace.
          </p>
        </div>

        {/* Bottom Institutional Trust Seals (Compact 2x2 Grid) */}
        <div style={{ position: 'relative', zIndex: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem 1rem', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg className="ic" style={{ width: 14, height: 14, color: '#3B82F6' }}><use href="#i-check" /></svg>
              <span>BitGo &amp; Utila MPC Custody</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg className="ic" style={{ width: 14, height: 14, color: '#3B82F6' }}><use href="#i-check" /></svg>
              <span>1:1 Segregated Fiat Safeguarding</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg className="ic" style={{ width: 14, height: 14, color: '#3B82F6' }}><use href="#i-check" /></svg>
              <span>SEPA Instant &amp; FPS Clearing</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg className="ic" style={{ width: 14, height: 14, color: '#3B82F6' }}><use href="#i-check" /></svg>
              <span>Real-Time AML Screening</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ============ RIGHT FORM PANE (Independently Scrollable) ============ */}
      <main className="auth-main-pane">
        <div className="auth-form-container">
          {/* Top Bar: Return Link + Theme Switcher */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '440px', margin: '0 auto 1.25rem' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                color: 'var(--fg-dim)',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
              className="hover:text-[var(--fg)]"
            >
              <svg className="ic" style={{ width: 14, height: 14 }}><use href="#i-chevron-left" /></svg>
              <span>Back to coincashy.io</span>
            </Link>

            <button
              className="theme-btn"
              type="button"
              data-theme-toggle
              aria-label="Switch to light mode"
              title="Switch theme"
              onClick={handleToggleTheme}
              style={{ width: 34, height: 34 }}
            >
              <svg className="ic ic-sun" aria-hidden="true"><use href="#i-sun" /></svg>
              <svg className="ic ic-moon" aria-hidden="true"><use href="#i-moon" /></svg>
            </button>
          </header>

          {/* Centered Form Wrapper */}
          <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
            {children}
          </div>

          {/* Security Trust Footnote */}
          <footer style={{ width: '100%', maxWidth: '440px', margin: '1.5rem auto 0', textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--fg-faint)', justifyContent: 'center' }}>
              <svg className="ic" style={{ width: 12, height: 12 }}><use href="#i-lock" /></svg>
              <span>256-bit TLS Encryption · ISO 27001 · Polish VASP KRS 0001135823</span>
            </div>
          </footer>
        </div>
      </main>

      <style jsx>{`
        .auth-split-layout {
          min-height: 100vh;
          display: flex;
          background: var(--ground);
          color: var(--fg);
          position: relative;
        }

        .auth-showcase-pane {
          display: none;
        }

        .auth-main-pane {
          flex: 1 1 100%;
          min-height: 100vh;
          background: var(--ground);
        }

        .auth-form-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          padding: clamp(1rem, 2.5vw, 2rem);
          width: 100%;
        }

        @media (min-width: 1024px) {
          .auth-split-layout {
            height: 100vh;
            max-height: 100vh;
            overflow: hidden;
          }

          .auth-showcase-pane {
            display: flex !important;
            flex: 0 0 50%;
            width: 50%;
            height: 100vh;
            max-height: 100vh;
            position: sticky;
            top: 0;
            flex-direction: column;
            justifyContent: space-between;
            padding: clamp(2rem, 3.5vw, 3.5rem);
            background: radial-gradient(130% 130% at 15% 15%, #0e1426 0%, #070914 45%, #020308 100%);
            border-right: 1px solid var(--line);
            overflow: hidden;
            color: #ffffff;
            user-select: none;
          }

          .auth-main-pane {
            flex: 0 0 50%;
            width: 50%;
            height: 100vh;
            max-height: 100vh;
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
          }

          .auth-form-container {
            min-height: 100%;
            padding: clamp(2rem, 3.5vw, 3.5rem);
          }
        }

        .auth-glow-top {
          position: absolute;
          top: -15%;
          left: -15%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.45) 0%, rgba(37, 99, 235, 0.25) 40%, transparent 70%);
          filter: blur(65px);
          pointer-events: none;
        }

        .auth-glow-bottom {
          position: absolute;
          bottom: -15%;
          right: -10%;
          width: 650px;
          height: 650px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(226, 184, 102, 0.35) 0%, rgba(245, 166, 35, 0.18) 40%, transparent 70%);
          filter: blur(75px);
          pointer-events: none;
        }

        .auth-glow-center {
          position: absolute;
          top: 35%;
          right: 5%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 0, 255, 0.35) 0%, rgba(59, 130, 246, 0.2) 45%, transparent 70%);
          filter: blur(70px);
          pointer-events: none;
        }

        .auth-bg-rings {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.3;
          color: rgba(226, 184, 102, 0.55);
          pointer-events: none;
        }

        /* Sleek scrollbar for right pane */
        .auth-main-pane::-webkit-scrollbar {
          width: 6px;
        }
        .auth-main-pane::-webkit-scrollbar-track {
          background: transparent;
        }
        .auth-main-pane::-webkit-scrollbar-thumb {
          background: var(--line);
          border-radius: 999px;
        }
        .auth-main-pane::-webkit-scrollbar-thumb:hover {
          background: var(--fg-faint);
        }
      `}</style>
    </div>
  );
}
