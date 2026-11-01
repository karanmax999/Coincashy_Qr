'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Coincashy Production Brand Settings
const BRAND_HOME_URL = 'https://coincashy.io';

const TOPIC_PRESETS = [
  'OTC & Deep Liquidity',
  'Corporate Cards',
  'vIBANs & Fiat Rails',
  'Crypto Processing',
  'Just Networking / Meeting',
];

export default function LeadCaptureContent() {
  const searchParams = useSearchParams();

  // Read search params with sensible defaults
  const rawEvent = searchParams.get('event');
  const rawSource = searchParams.get('source');

  const eventName = rawEvent && rawEvent.trim() ? rawEvent.trim() : 'Coincashy Event';
  const sourceName = rawSource && rawSource.trim() ? rawSource.trim() : 'qr';

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [telegram, setTelegram] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['OTC & Deep Liquidity']);
  const [notes, setNotes] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedName, setSubmittedName] = useState('');

  // Toggle interest topic pills
  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  // Submit native form directly to /api/lead which feeds HubSpot v3 API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid work or personal email.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please provide your phone or WhatsApp number for follow-up.');
      return;
    }

    setSubmitting(true);

    try {
      // Extract hubspotutk cookie if present
      let hutk: string | undefined = undefined;
      if (typeof document !== 'undefined') {
        const cookieMatch = document.cookie.match(/hubspotutk=([^;]+)/);
        if (cookieMatch) hutk = decodeURIComponent(cookieMatch[1].trim());
      }

      const payload = {
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim(),
        telegram: telegram.trim(),
        interests: selectedTopics,
        notes: notes.trim(),
        eventName,
        source: sourceName,
        hutk,
        pageUri: typeof window !== 'undefined' ? window.location.href : undefined,
      };

      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json().catch(() => ({}));

      if (res.ok && resData.success) {
        setSubmittedName(resData.firstName || fullName.split(' ')[0] || fullName);
        setSubmitted(true);
      } else {
        setErrorMessage(
          resData.message ||
            'There was an issue submitting your details. Please try again or ping support@coincashy.io.'
        );
      }
    } catch (err) {
      console.error('Lead form submission error:', err);
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="lead-page-root"
      className="lead-capture-page"
      style={{
        minHeight: '100dvh', // dynamic viewport height for mobile browsers
        width: '100%',
        backgroundColor: 'var(--vault, #000000)',
        color: 'var(--chalk, #F2F2F2)',
        fontFamily: "var(--f-body, 'Inter', -apple-system, BlinkMacSystemFont, sans-serif)",
        position: 'relative',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Mobile-first scoped responsive styles */}
      <style>{`
        /* Crucial: Prevent iOS Safari from auto-zooming input fields */
        input, select, textarea {
          font-size: 16px !important;
          -webkit-tap-highlight-color: transparent;
        }
        @media (max-width: 640px) {
          .lead-card-box {
            padding: 24px 16px !important;
            border-radius: 20px !important;
          }
          .lead-field-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Background ambient lighting */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'clamp(320px, 90vw, 650px)',
            height: '450px',
            background: 'radial-gradient(circle, rgba(0, 0, 255, 0.20) 0%, rgba(142, 78, 198, 0.10) 50%, transparent 75%)',
            filter: 'blur(75px)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            right: '-100px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(0, 0, 255, 0.10) 0%, transparent 70%)',
            filter: 'blur(60px)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Clean Website-Authentic Header with Logo redirecting to coincashy.io */}
      <header
        style={{
          position: 'relative',
          zIndex: 20,
          width: '100%',
          borderBottom: '1px solid var(--line-d, rgba(255, 255, 255, 0.1))',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div
          style={{
            maxWidth: '580px',
            margin: '0 auto',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Link
            href={BRAND_HOME_URL}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
            title="Coincashy"
          >
            <img
              src="/media/logo-white.png"
              alt="Coincashy"
              style={{
                height: '24px',
                width: 'auto',
                display: 'block',
              }}
            />
          </Link>
        </div>
      </header>

      {/* Main Container - Mobile Centered */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 14px 40px 14px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '100%', maxWidth: '520px', boxSizing: 'border-box' }}>
          {!submitted ? (
            /* Active Form Card */
            <div
              className="lead-card-box"
              style={{
                backgroundColor: 'var(--vault-2, #0A0A0A)',
                border: '1px solid var(--line-d, rgba(255, 255, 255, 0.1))',
                borderRadius: '24px',
                padding: '32px 24px',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              {/* Event Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 12px',
                  borderRadius: '99px',
                  background: 'var(--vault-3, #141414)',
                  border: '1px solid var(--line-d-2, rgba(255, 255, 255, 0.22))',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#8A99FF',
                  marginBottom: '16px',
                  maxWidth: '100%',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 8px #10B981',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '220px',
                    color: '#FFFFFF',
                  }}
                >
                  {eventName}
                </span>
                {sourceName && (
                  <span
                    style={{
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      color: 'rgba(255, 255, 255, 0.45)',
                      paddingLeft: '6px',
                      borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    {sourceName}
                  </span>
                )}
              </div>

              {/* Title and Subtitle */}
              <h1
                style={{
                  fontFamily: "var(--f-display, 'Plus Jakarta Sans', sans-serif)",
                  fontSize: 'clamp(22px, 5.5vw, 30px)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: 'var(--hi, #FFFFFF)',
                  margin: '0 0 8px 0',
                  lineHeight: 1.2,
                }}
              >
                Connect with Coincashy
              </h1>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                  margin: '0 0 20px 0',
                  lineHeight: 1.5,
                }}
              >
                Drop your details in 30 seconds. Our desk team will connect with you on WhatsApp or Email.
              </p>

              {/* Error banner */}
              {errorMessage && (
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid #EF4444',
                    color: '#F87171',
                    fontSize: '13px',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Custom Smooth Mobile-First Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Full Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label
                      htmlFor="lead-name"
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                      }}
                    >
                      Your Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      placeholder="e.g. Satoshi Nakamoto"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        height: '52px',
                        padding: '0 16px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--vault-3, #141414)',
                        border: '1px solid var(--line-d-2, rgba(255, 255, 255, 0.22))',
                        color: 'var(--hi, #FFFFFF)',
                        fontSize: '16px', // 16px prevents iOS Safari auto-zoom
                        outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3E63DD';
                        e.target.style.boxShadow = '0 0 0 3px rgba(62, 99, 221, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--line-d-2, rgba(255, 255, 255, 0.22))';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Work Email */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label
                      htmlFor="lead-email"
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                      }}
                    >
                      Work / Personal Email <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      required
                      placeholder="e.g. satoshi@bitcoin.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        height: '52px',
                        padding: '0 16px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--vault-3, #141414)',
                        border: '1px solid var(--line-d-2, rgba(255, 255, 255, 0.22))',
                        color: 'var(--hi, #FFFFFF)',
                        fontSize: '16px', // 16px prevents iOS Safari auto-zoom
                        outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3E63DD';
                        e.target.style.boxShadow = '0 0 0 3px rgba(62, 99, 221, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--line-d-2, rgba(255, 255, 255, 0.22))';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label
                      htmlFor="lead-phone"
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                      }}
                    >
                      WhatsApp / Phone Number <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input
                      id="lead-phone"
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210 or +44 7452 022306"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        height: '52px',
                        padding: '0 16px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--vault-3, #141414)',
                        border: '1px solid var(--line-d-2, rgba(255, 255, 255, 0.22))',
                        color: 'var(--hi, #FFFFFF)',
                        fontSize: '16px', // 16px prevents iOS Safari auto-zoom
                        outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3E63DD';
                        e.target.style.boxShadow = '0 0 0 3px rgba(62, 99, 221, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--line-d-2, rgba(255, 255, 255, 0.22))';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Company & Telegram Grid (Adapts on mobile) */}
                  <div
                    className="lead-field-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label
                        htmlFor="lead-company"
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                        }}
                      >
                        Company / Project
                      </label>
                      <input
                        id="lead-company"
                        type="text"
                        placeholder="e.g. Acme Labs"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          height: '50px',
                          padding: '0 14px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--vault-3, #141414)',
                          border: '1px solid var(--line-d-2, rgba(255, 255, 255, 0.22))',
                          color: 'var(--hi, #FFFFFF)',
                          fontSize: '16px',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label
                        htmlFor="lead-telegram"
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                        }}
                      >
                        Telegram Handle
                      </label>
                      <input
                        id="lead-telegram"
                        type="text"
                        placeholder="e.g. @satoshi"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          height: '50px',
                          padding: '0 14px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--vault-3, #141414)',
                          border: '1px solid var(--line-d-2, rgba(255, 255, 255, 0.22))',
                          color: 'var(--hi, #FFFFFF)',
                          fontSize: '16px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Topics / Interests Tap Chips */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                      }}
                    >
                      I&apos;m interested in:
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {TOPIC_PRESETS.map((topic) => {
                        const isSelected = selectedTopics.includes(topic);
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => toggleTopic(topic)}
                            style={{
                              fontSize: '12px',
                              fontWeight: isSelected ? 600 : 500,
                              padding: '8px 12px',
                              borderRadius: '99px',
                              cursor: 'pointer',
                              border: isSelected
                                ? '1px solid #3E63DD'
                                : '1px solid var(--line-d, rgba(255, 255, 255, 0.1))',
                              backgroundColor: isSelected
                                ? 'rgba(62, 99, 221, 0.25)'
                                : 'var(--vault-3, #141414)',
                              color: isSelected ? '#FFFFFF' : 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                              transition: 'all 0.15s ease',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              minHeight: '36px',
                            }}
                          >
                            <span>{isSelected ? '✓' : '+'}</span>
                            <span>{topic}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Notes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label
                      htmlFor="lead-notes"
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                      }}
                    >
                      Inquiry / Notes (Optional)
                    </label>
                    <textarea
                      id="lead-notes"
                      rows={2}
                      placeholder="e.g. Looking to settle €500k monthly in USDT / EUR..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--vault-3, #141414)',
                        border: '1px solid var(--line-d-2, rgba(255, 255, 255, 0.22))',
                        color: 'var(--hi, #FFFFFF)',
                        fontSize: '16px',
                        outline: 'none',
                        resize: 'none',
                      }}
                    />
                  </div>

                  {/* Big Mobile-Touch CTA */}
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      height: '54px',
                      borderRadius: '99px',
                      border: 'none',
                      backgroundColor: 'var(--chalk, #F2F2F2)',
                      color: 'var(--vault, #000000)',
                      fontWeight: 700,
                      fontSize: '15px',
                      letterSpacing: '-0.01em',
                      cursor: submitting ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 8px 24px -6px rgba(255, 255, 255, 0.25)',
                      transition: 'transform 0.15s ease, background-color 0.15s ease',
                      marginTop: '6px',
                      touchAction: 'manipulation',
                    }}
                  >
                    <span>{submitting ? 'Connecting...' : 'Connect with Coincashy'}</span>
                    <span>→</span>
                  </button>
                </form>
            </div>
          ) : (
            /* Branded Success Screen */
            <div
              className="lead-card-box"
              style={{
                backgroundColor: 'var(--vault-2, #0A0A0A)',
                border: '1px solid #10B981',
                borderRadius: '24px',
                padding: '36px 20px',
                textAlign: 'center',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(20px)',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Celebration Icon */}
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 16px auto',
                  borderRadius: '18px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '30px',
                  boxShadow: '0 0 28px rgba(16, 185, 129, 0.3)',
                }}
              >
                🎉
              </div>

              <h2
                style={{
                  fontFamily: "var(--f-display, 'Plus Jakarta Sans', sans-serif)",
                  fontSize: 'clamp(24px, 5vw, 32px)',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  margin: '0 0 10px 0',
                  letterSpacing: '-0.02em',
                }}
              >
                You&apos;re in 🎉
              </h2>

              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                  maxWidth: '340px',
                  margin: '0 auto 20px auto',
                  lineHeight: 1.5,
                }}
              >
                Thanks for connecting, <strong style={{ color: '#FFFFFF' }}>{submittedName}</strong>! Our desk team will reach out shortly to follow up.
              </p>

              {/* Delivery Receipt Box */}
              <div
                style={{
                  backgroundColor: 'var(--vault-3, #141414)',
                  border: '1px solid var(--line-d, rgba(255, 255, 255, 0.1))',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  marginBottom: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.5)' }}>
                  <span>Event</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{eventName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.5)' }}>
                  <span>Phone / WhatsApp</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255, 255, 255, 0.5)' }}>
                  <span>Follow-up Status</span>
                  <span style={{ color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    Sent to OTC Desk
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  href={BRAND_HOME_URL}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    height: '50px',
                    borderRadius: '99px',
                    backgroundColor: 'var(--chalk, #F2F2F2)',
                    color: 'var(--vault, #000000)',
                    fontWeight: 700,
                    fontSize: '14px',
                    textDecoration: 'none',
                    boxShadow: '0 8px 24px -4px rgba(255, 255, 255, 0.25)',
                  }}
                >
                  <span>Explore Coincashy (coincashy.io)</span>
                  <span>→</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFullName('');
                    setEmail('');
                    setPhone('');
                    setCompany('');
                    setTelegram('');
                    setNotes('');
                  }}
                  style={{
                    height: '46px',
                    borderRadius: '99px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--line-d-2, rgba(255, 255, 255, 0.22))',
                    color: 'var(--chalk, #F2F2F2)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Submit Another Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Website-Authentic Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          borderTop: '1px solid var(--line-d, rgba(255, 255, 255, 0.1))',
          padding: '16px 14px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '580px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.45)',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <p style={{ margin: 0 }}>© {new Date().getFullYear()} Coincashy.io. Regulated Polish VASP (KRS 0001135823).</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href={`${BRAND_HOME_URL}/privacy`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              Privacy
            </Link>
            <Link
              href={`${BRAND_HOME_URL}/terms`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
