'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';

const PRESET_EVENTS = [
  'Delhi Web3 Meetup',
  'ETHIndia 2026',
  'Devcon 8 Mumbai',
  'Token2049 Dubai',
  'Campus Web3 Workshop',
  'Crypto Founders Dinner',
  'Web3 Builders Summit',
];

export default function AdminQrPage() {
  const [eventName, setEventName] = useState<string>('Delhi Web3 Meetup');
  const [source, setSource] = useState<string>('qr');
  const [baseDomain, setBaseDomain] = useState<string>('https://coincashy.io');
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Automatically detect the current live origin (e.g. https://coincashyqr.vercel.app or http://localhost:3000)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      setBaseDomain(window.location.origin);
    }
  }, []);

  const qrContainerRef = useRef<HTMLDivElement>(null);
  const eventInputId = useId();
  const sourceInputId = useId();
  const domainInputId = useId();

  // URL generation
  const computeUrl = (event: string, src: string, domain: string) => {
    const cleanEvent = event.trim() || 'Coincashy Event';
    const cleanSource = src.trim() || 'qr';
    let cleanDomain = domain.trim().replace(/\/$/, '');
    if (!cleanDomain.startsWith('http://') && !cleanDomain.startsWith('https://')) {
      cleanDomain = `https://${cleanDomain}`;
    }
    return `${cleanDomain}/lead?event=${encodeURIComponent(cleanEvent)}&source=${encodeURIComponent(cleanSource)}`;
  };

  const activeQrUrl = computeUrl(eventName, source, baseDomain);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(activeQrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleDownloadPng = () => {
    if (!qrContainerRef.current) return;
    const canvas = qrContainerRef.current.querySelector('canvas');
    if (!canvas) return;

    setIsDownloading(true);

    try {
      // 1024x1024 high-res export for printing on roll-up banners, badges, and booth flyers
      const exportCanvas = document.createElement('canvas');
      const exportSize = 1024;
      exportCanvas.width = exportSize;
      exportCanvas.height = exportSize;
      const ctx = exportCanvas.getContext('2d');

      if (ctx) {
        // High contrast white ground
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, exportSize, exportSize);

        // QR Code centered with ample 120px quiet zone
        const margin = 120;
        const qrDrawSize = exportSize - margin * 2 - 80;
        ctx.drawImage(canvas, margin, margin - 20, qrDrawSize, qrDrawSize);

        // Event title header
        const cleanEvent = eventName.trim() || 'Coincashy Event';
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(cleanEvent, exportSize / 2, exportSize - 110);

        // Subtitle / domain URL
        ctx.fillStyle = '#0000FF';
        ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        const displayDomain = baseDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
        ctx.fillText(`Scan to connect · ${displayDomain}`, exportSize / 2, exportSize - 65);

        const pngUrl = exportCanvas.toDataURL('image/png');
        const safeSlug = (eventName.trim() || 'event')
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `coincashy-qr-${safeSlug}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } finally {
      setTimeout(() => setIsDownloading(false), 600);
    }
  };

  return (
    <div
      id="admin-qr-root"
      className="admin-qr-page"
      style={{
        minHeight: '100dvh',
        width: '100%',
        backgroundColor: 'var(--vault, #000000)',
        color: 'var(--chalk, #F2F2F2)',
        position: 'relative',
        overflowX: 'hidden',
        fontFamily: "var(--f-body, 'Inter', -apple-system, BlinkMacSystemFont, sans-serif)",
      }}
    >
      {/* Mobile-first scoped responsive styles */}
      <style>{`
        input, select, textarea {
          font-size: 16px !important;
          -webkit-tap-highlight-color: transparent;
        }
        .admin-qr-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          align-items: start;
        }
        @media (min-width: 960px) {
          .admin-qr-grid {
            grid-template-columns: 1.15fr 0.85fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 640px) {
          .admin-main-wrap {
            padding: 24px 14px 60px 14px !important;
          }
          .admin-card-box {
            padding: 20px 14px !important;
            border-radius: 18px !important;
          }
          .admin-qr-preview-box {
            padding: 20px 14px !important;
            border-radius: 18px !important;
          }
          .admin-domain-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Ambient background glows */}
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
            top: '-15%',
            right: '20%',
            width: 'clamp(300px, 60vw, 600px)',
            height: '600px',
            background: 'radial-gradient(circle, rgba(0, 0, 255, 0.16) 0%, rgba(142, 78, 198, 0.08) 50%, transparent 75%)',
            filter: 'blur(75px)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '5%',
            left: '5%',
            width: 'clamp(250px, 40vw, 450px)',
            height: '450px',
            background: 'radial-gradient(circle, rgba(0, 0, 255, 0.10) 0%, transparent 70%)',
            filter: 'blur(65px)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Clean Website-Authentic Header */}
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
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Authentic Logo redirecting directly to coincashy.io */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              href="https://coincashy.io"
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

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href={activeQrUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#8A99FF',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 600,
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '99px',
                backgroundColor: 'rgba(0, 0, 255, 0.12)',
                border: '1px solid rgba(0, 0, 255, 0.28)',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              <span>Test /lead Live</span>
              <span style={{ fontSize: '11px' }}>↗</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main
        className="admin-main-wrap"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '32px 20px 80px 20px',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {/* Header Introduction */}
        <div style={{ marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '99px',
              backgroundColor: 'var(--vault-3, #141414)',
              border: '1px solid var(--line-d-2, rgba(255, 255, 255, 0.22))',
              fontSize: '12px',
              fontWeight: 600,
              color: '#8A99FF',
              marginBottom: '10px',
            }}
          >
            <span>✨</span>
            <span>Booth &amp; Conference Lead Generation System</span>
          </div>

          <h1
            style={{
              fontFamily: "var(--f-display, 'Plus Jakarta Sans', sans-serif)",
              fontSize: 'clamp(24px, 5.5vw, 40px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--hi, #FFFFFF)',
              margin: '0 0 8px 0',
              lineHeight: 1.15,
            }}
          >
            Event QR Code Generator
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
              margin: 0,
              maxWidth: '680px',
              lineHeight: 1.6,
            }}
          >
            Generate branded, high-density QR codes for on-site conference booths, summits, and meetups.
            Attendees scanning the code land directly on the mobile-first lead capture form.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="admin-qr-grid">
          {/* Left Column: Configuration Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Form Box */}
            <div
              className="admin-card-box"
              style={{
                backgroundColor: 'var(--vault-2, #0A0A0A)',
                border: '1px solid var(--line-d, rgba(255, 255, 255, 0.1))',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(20px)',
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              <h2
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--hi, #FFFFFF)',
                  margin: '0 0 18px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  letterSpacing: '-0.01em',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '22px',
                    height: '22px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--jade, #0000FF)',
                    fontSize: '11px',
                    color: '#FFFFFF',
                  }}
                >
                  1
                </span>
                Event Parameters
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Event Name Input */}
                <div>
                  <label
                    htmlFor={eventInputId}
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}
                  >
                    Event Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    id={eventInputId}
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Delhi Web3 Meetup"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      height: '52px',
                      padding: '0 16px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--vault-3, #141414)',
                      border: '1px solid var(--line-d-2, rgba(255, 255, 255, 0.22))',
                      color: 'var(--hi, #FFFFFF)',
                      fontSize: '16px',
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

                {/* Quick Presets */}
                <div>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--fg-faint, rgba(255, 255, 255, 0.46))',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px',
                    }}
                  >
                    Quick Event Suggestions:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {PRESET_EVENTS.map((preset) => {
                      const isSelected = eventName === preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setEventName(preset)}
                          style={{
                            fontSize: '12px',
                            fontWeight: isSelected ? 600 : 500,
                            padding: '6px 12px',
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
                            minHeight: '34px',
                          }}
                        >
                          {preset}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Source and Domain Configuration */}
                <div
                  className="admin-domain-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '12px',
                    paddingTop: '4px',
                  }}
                >
                  <div>
                    <label
                      htmlFor={sourceInputId}
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                      }}
                    >
                      Source Tag
                    </label>
                    <input
                      id={sourceInputId}
                      type="text"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      placeholder="qr"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        height: '48px',
                        padding: '0 14px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--vault-3, #141414)',
                        border: '1px solid var(--line-d-2, rgba(255, 255, 255, 0.22))',
                        color: 'var(--hi, #FFFFFF)',
                        fontSize: '16px',
                        outline: 'none',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--fg-faint, rgba(255, 255, 255, 0.46))',
                        marginTop: '4px',
                        display: 'block',
                      }}
                    >
                      Default: <code style={{ color: '#8A99FF' }}>qr</code>
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label
                        htmlFor={domainInputId}
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Target Domain
                      </label>
                      {/* One-click quick toggle if running on Vercel */}
                      {typeof window !== 'undefined' && window.location.origin && baseDomain !== window.location.origin && (
                        <button
                          type="button"
                          onClick={() => setBaseDomain(window.location.origin)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            fontSize: '10px',
                            color: '#10B981',
                            textDecoration: 'underline',
                          }}
                        >
                          Use Current Host
                        </button>
                      )}
                    </div>
                    <input
                      id={domainInputId}
                      type="text"
                      value={baseDomain}
                      onChange={(e) => setBaseDomain(e.target.value)}
                      placeholder="https://coincashyqr.vercel.app"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        height: '48px',
                        padding: '0 14px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--vault-3, #141414)',
                        border: '1px solid var(--line-d-2, rgba(255, 255, 255, 0.22))',
                        color: 'var(--hi, #FFFFFF)',
                        fontSize: '16px',
                        outline: 'none',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--fg-faint, rgba(255, 255, 255, 0.46))',
                        marginTop: '4px',
                        display: 'block',
                        wordBreak: 'break-all',
                      }}
                    >
                      Active: <code style={{ color: '#10B981' }}>{baseDomain}</code>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Destination URL Card */}
            <div
              className="admin-card-box"
              style={{
                backgroundColor: 'var(--vault-2, #0A0A0A)',
                border: '1px solid var(--line-d, rgba(255, 255, 255, 0.1))',
                borderRadius: '20px',
                padding: '20px',
                backdropFilter: 'blur(20px)',
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--hi, #FFFFFF)',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      height: '20px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(0, 0, 255, 0.25)',
                      fontSize: '10px',
                      color: '#8A99FF',
                    }}
                  >
                    2
                  </span>
                  Destination URL
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  ● Live Sync
                </span>
              </div>

              {/* URL Display Box */}
              <div
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--vault, #000000)',
                  border: '1px solid var(--line-d, rgba(255, 255, 255, 0.1))',
                  fontFamily: "var(--f-mono, 'IBM Plex Mono', monospace)",
                  fontSize: '12px',
                  color: '#8A99FF',
                  wordBreak: 'break-all',
                  overflowWrap: 'anywhere',
                  lineHeight: 1.5,
                  userSelect: 'all',
                  marginBottom: '12px',
                  boxSizing: 'border-box',
                }}
              >
                {activeQrUrl}
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '99px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: copied ? '#FFFFFF' : 'var(--vault, #000000)',
                    backgroundColor: copied ? '#10B981' : 'var(--chalk, #F2F2F2)',
                    border: 'none',
                    transition: 'all 0.2s ease',
                    minHeight: '38px',
                  }}
                >
                  <span>{copied ? '✓' : '📋'}</span>
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Link'}</span>
                </button>

                <a
                  href={activeQrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '9px 16px',
                    borderRadius: '99px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#8A99FF',
                    backgroundColor: 'rgba(0, 0, 255, 0.12)',
                    border: '1px solid rgba(0, 0, 255, 0.28)',
                    transition: 'all 0.2s ease',
                    minHeight: '38px',
                  }}
                >
                  <span>Test Link</span>
                  <span style={{ fontSize: '11px' }}>↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Live QR Preview & PNG Export */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              className="admin-qr-preview-box"
              style={{
                backgroundColor: 'var(--vault-2, #0A0A0A)',
                border: '1px solid var(--line-d, rgba(255, 255, 255, 0.1))',
                borderRadius: '24px',
                padding: '28px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(20px)',
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: '16px', width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--fg-faint, rgba(255, 255, 255, 0.46))',
                    }}
                  >
                    Print-Ready QR
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#10B981',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    Level H (30%)
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--f-display, 'Plus Jakarta Sans', sans-serif)",
                    fontSize: '17px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    margin: '6px 0 0 0',
                    textAlign: 'left',
                  }}
                >
                  {eventName || 'Coincashy Event'}
                </h3>
              </div>

              {/* QR Container Canvas Frame (Responsive scaled) */}
              <div
                ref={qrContainerRef}
                style={{
                  position: 'relative',
                  padding: 'clamp(14px, 4vw, 22px)',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <QRCodeCanvas
                  value={activeQrUrl}
                  size={240}
                  level="H"
                  includeMargin={false}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  style={{
                    width: '100%',
                    maxWidth: '240px',
                    height: 'auto',
                    display: 'block',
                  }}
                />
              </div>

              {/* Scan instructions */}
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                  margin: '0 0 20px 0',
                  maxWidth: '280px',
                  lineHeight: 1.5,
                }}
              >
                Scan with any iPhone or Android camera to open the lead capture form.
              </p>

              {/* Big CTA Download PNG */}
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={isDownloading}
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '99px',
                  border: 'none',
                  cursor: isDownloading ? 'wait' : 'pointer',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: 'var(--vault, #000000)',
                  backgroundColor: 'var(--chalk, #F2F2F2)',
                  boxShadow: '0 8px 24px -4px rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'transform 0.15s ease',
                  opacity: isDownloading ? 0.8 : 1,
                  touchAction: 'manipulation',
                }}
              >
                <span style={{ fontSize: '16px' }}>💾</span>
                <span>{isDownloading ? 'Generating High-Res PNG...' : 'Download Print PNG (1024×1024)'}</span>
              </button>

              {/* Specifications Footer */}
              <div
                style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  fontSize: '11px',
                  color: 'var(--fg-faint, rgba(255, 255, 255, 0.46))',
                }}
              >
                <span>Format: PNG</span>
                <span>•</span>
                <span>1024×1024</span>
                <span>•</span>
                <span>Quiet Zone: 120px</span>
              </div>
            </div>

            {/* Quick Tips */}
            <div
              style={{
                backgroundColor: 'var(--vault-2, #0A0A0A)',
                border: '1px solid var(--line-d, rgba(255, 255, 255, 0.1))',
                borderRadius: '16px',
                padding: '16px 18px',
                fontSize: '12px',
                color: 'var(--fg-dim, rgba(255, 255, 255, 0.66))',
                lineHeight: 1.55,
                boxSizing: 'border-box',
              }}
            >
              <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '4px' }}>
                💡 Event Organizer Tip:
              </strong>
              Print this QR code on roll-up pull-banners, registration desks, and tabletop badges. 
              The 30% error correction guarantees instant scanning even in low-light conference halls.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
