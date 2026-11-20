"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    __toggleTheme?: () => void;
  }
}

export default function Nav() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isTickerOpen, setIsTickerOpen] = useState(true);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.documentElement.classList.add('no-scroll');
      document.body.classList.add('no-scroll');
    } else {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
    };
  }, [isMobileOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash === '#personal' && window.location.pathname === '/') {
        window.location.replace('/personal');
      } else if (hash === '#business' && window.location.pathname === '/') {
        window.location.replace('/business');
      }
    }
  }, []);

  // Hide the global marketing nav on auth and internal dashboard pages
  if (pathname && (pathname.startsWith('/auth') || pathname.startsWith('/dashboard'))) {
    return null;
  }

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const closeMobile = () => setIsMobileOpen(false);

  const handleNavClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) {
      (document.activeElement as HTMLElement)?.blur();
      closeMobile();
    }
  };

  return (
    <>
      <header className={"nav" + (isMobileOpen ? " menu-open" : "") + (isScrolled ? " is-scrolled" : "")} id="nav">
        {isTickerOpen && (
          <div id="top-ticker" className="top-ticker">
            <div className="ticker-inner">
              <a
                href="https://devcon.org/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="ticker-logo"
                aria-label="Devcon 8 Mumbai"
              >
                <span>DEVCON 8</span>
                <span className="ticker-logo-sub">MUMBAI</span>
              </a>
              <span className="ticker-text">
                See you at the event &middot; <strong>3—6 November, 2026</strong>, Mumbai, India{' '}
                <a
                  href="https://devcon.org/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ticker-link"
                >
                  Meet us there ↗
                </a>
              </span>
            </div>
            <button className="ticker-close" data-close-ticker aria-label="Close banner" type="button" onClick={() => setIsTickerOpen(false)}>
              <svg className="ic"><use href="#i-x" /></svg>
            </button>
          </div>
        )}
        <div className="nav-bar">
          <Link className="brand" href="/" aria-label="Coincashy home" onClick={closeMobile}>
            <Image className="brand-logo logo-on-dark" src="/media/logo-white.png" alt="Coincashy" height={100} width={100} />
            <Image className="brand-logo logo-on-paper" src="/media/logo-black.png" alt="" height={100} width={100} />
          </Link>
          <nav className="nav-links" aria-label="Primary" onClick={handleNavClick}>
            <div className="nav-item has-menu">
              <Link className="nav-link" href="/personal" data-nav="personal">Personal<svg className="ic" aria-hidden="true"><use href="#i-chevron-down" /></svg></Link>
              <div className="menu">
                <div className="menu-grid cols-2">
                  <Link className="menu-item" href="/buy-crypto"><span className="menu-ic"><svg className="ic" aria-hidden="true"><use href="#i-arrow-down-left" /></svg></span><span><b>Buy crypto</b><small>Card, Apple Pay, SEPA</small></span></Link>
                  <Link className="menu-item" href="/sell-crypto"><span className="menu-ic"><svg className="ic" aria-hidden="true"><use href="#i-arrow-up-right" /></svg></span><span><b>Sell crypto</b><small>Direct to bank account</small></span></Link>
                  <Link className="menu-item" href="/convert-crypto"><span className="menu-ic"><svg className="ic" aria-hidden="true"><use href="#i-repeat" /></svg></span><span><b>Convert crypto</b><small>0% slippage swaps</small></span></Link>
                  <Link className="menu-item" href="/cards"><span className="menu-ic"><svg className="ic" aria-hidden="true"><use href="#i-credit-card" /></svg></span><span><b>Personal crypto card</b><small>Everyday card spending</small></span></Link>
                </div>
                <Link className="menu-foot" href="/personal#how">How it works, in four steps<svg className="ic" aria-hidden="true"><use href="#i-arrow-right" /></svg></Link>
              </div>
            </div>
            <div className="nav-item has-menu">
              <Link className="nav-link" href="/business" data-nav="business">Business<svg className="ic" aria-hidden="true"><use href="#i-chevron-down" /></svg></Link>
              <div className="menu menu-wide">
                <div className="menu-grid cols-2">
                  <Link className="menu-item" href="/processing"><span className="menu-ic"><svg className="ic" aria-hidden="true"><use href="#i-qr-code" /></svg></span><span><b>Crypto processing</b></span></Link>
                  <Link className="menu-item" href="/otc"><span className="menu-ic"><svg className="ic" aria-hidden="true"><use href="#i-chart-candlestick" /></svg></span><span><b>OTC &amp; liquidity</b></span></Link>
                  <Link className="menu-item" href="/ramp"><span className="menu-ic"><svg className="ic" aria-hidden="true"><use href="#i-arrow-left-right" /></svg></span><span><b>On/off-ramp</b></span></Link>
                  <Link className="menu-item" href="/vibans"><span className="menu-ic"><svg className="ic" aria-hidden="true"><use href="#i-landmark" /></svg></span><span><b>vIBANs</b></span></Link>
                  <Link className="menu-item" href="/wallets"><span className="menu-ic"><svg className="ic" aria-hidden="true"><use href="#i-wallet" /></svg></span><span><b>Wallet as a Service</b></span></Link>
                  <Link className="menu-item" href="/cards#corporate"><span className="menu-ic"><svg className="ic" aria-hidden="true"><use href="#i-credit-card" /></svg></span><span><b>Corporate cards</b></span></Link>
                  <Link className="menu-item" href="/settlement"><span className="menu-ic"><svg className="ic" aria-hidden="true"><use href="#i-globe" /></svg></span><span><b>Stablecoin settlement</b></span></Link>
                  <Link className="menu-item" href="/developers"><span className="menu-ic"><svg className="ic" aria-hidden="true"><use href="#i-code-xml" /></svg></span><span><b>APIs &amp; webhooks</b></span></Link>
                </div>
                <div className="menu-feature">
                  <p>Tell us how your money needs to move.</p>
                  <small>Share your markets, currencies, volumes and settlement requirements.</small>
                  <Link className="btn btn-solid btn-sm" href="/contact">Talk to our team</Link>
                </div>
              </div>
            </div>
            <div className="nav-item has-menu">
              <Link className="nav-link" href="/business" data-nav="solutions">Solutions<svg className="ic" aria-hidden="true"><use href="#i-chevron-down" /></svg></Link>
              <div className="menu menu-wide">
                <div className="menu-grid cols-2">
                  <div className="menu-col">
                    <h4>By Audience</h4>
                    <Link className="menu-link" href="/personal">Individuals</Link>
                    <Link className="menu-link" href="/business">Fintechs &amp; Platforms</Link>
                    <Link className="menu-link" href="/processing">Merchants &amp; PSPs</Link>
                    <Link className="menu-link" href="/otc">OTC Desks &amp; Brokers</Link>
                  </div>
                  <div className="menu-col">
                    <h4>By Use Case</h4>
                    <Link className="menu-link" href="/processing">Crypto Payment Processing</Link>
                    <Link className="menu-link" href="/ramp">On/Off Ramp Integration</Link>
                    <Link className="menu-link" href="/settlement">Treasury &amp; Settlement</Link>
                    <Link className="menu-link" href="/business#wallets">Wallet as a Service</Link>
                  </div>
                </div>
                <div className="menu-feature">
                  <p>Tell us how your money needs to move.</p>
                  <small>Share your markets, currencies, volumes and settlement requirements.</small>
                  <Link className="btn btn-solid btn-sm" href="/contact">Talk to our team</Link>
                </div>
              </div>
            </div>
            <div className="nav-item has-menu">
              <Link className="nav-link" href="/about" data-nav="company">Company<svg className="ic" aria-hidden="true"><use href="#i-chevron-down" /></svg></Link>
              <div className="menu" style={{ width: '680px' }}>
                <div className="menu-grid cols-3">
                  <div className="menu-col">
                    <h4>Discover Coincashy</h4>
                    <Link className="menu-link" href="/about">About Us</Link>
                    <Link className="menu-link" href="/compliance">Compliance &amp; Security</Link>
                    <Link className="menu-link" href="/about#culture">Life at Coincashy</Link>
                    <Link className="menu-link" href="/contact">Contact</Link>
                  </div>
                  <div className="menu-col">
                    <h4>Careers</h4>
                    <Link className="menu-link" href="/careers#open-roles">Open Roles</Link>
                    <Link className="menu-link" href="/careers#why-join">Join our team</Link>
                  </div>
                  <div className="menu-col">
                    <h4>Resources</h4>
                    <Link className="menu-link" href="/help">Help Center</Link>
                    <Link className="menu-link" href="/developers">API Documentation</Link>
                    <Link className="menu-link" href="/privacy">Privacy Policy</Link>
                    <Link className="menu-link" href="/terms">Terms</Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <div className="nav-actions">
            <Link className="nav-link nav-signin" href="/auth/login">Log in</Link>
            <Link className="btn btn-line btn-sm nav-contact" href="/contact">Talk to sales</Link>
            <Link className="btn btn-solid btn-sm" id="nav-cta" href="/auth/signup"><span className="l-long">Get started</span><span className="l-short">Get started</span></Link>
            <button className="theme-btn" type="button" data-theme-toggle aria-label="Switch to light mode" title="Switch theme" onClick={() => { if (typeof window !== 'undefined' && window.__toggleTheme) window.__toggleTheme(); }}><svg className="ic ic-sun" aria-hidden="true"><use href="#i-sun" /></svg><svg className="ic ic-moon" aria-hidden="true"><use href="#i-moon" /></svg></button>
            <button className="burger" id="burger" type="button" aria-label={isMobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMobileOpen} aria-controls="mnav" onClick={toggleMobile}><span /><span /></button>
          </div>
        </div>
      </header>
      <div className={"mnav " + (isMobileOpen ? 'open' : '')} id="mnav" aria-hidden={!isMobileOpen}>
        <nav className="mnav-list" aria-label="Mobile" onClick={handleNavClick}>
          <Link className="m-link" href="/">Home</Link>
          <details>
            <summary>Personal<svg className="ic" aria-hidden="true"><use href="#i-chevron-down" /></svg></summary>
            <div className="m-sub">
              <Link href="/personal">Overview</Link>
              <Link href="/buy-crypto">Buy crypto</Link>
              <Link href="/sell-crypto">Sell crypto</Link>
              <Link href="/convert-crypto">Convert crypto</Link>
              <Link href="/cards">Personal crypto card</Link>
              <Link href="/personal#how">How it works</Link>
            </div>
          </details>
          <details>
            <summary>Business<svg className="ic" aria-hidden="true"><use href="#i-chevron-down" /></svg></summary>
            <div className="m-sub">
              <Link href="/business">Overview</Link>
              <Link href="/processing">Crypto processing</Link>
              <Link href="/otc">OTC &amp; liquidity</Link>
              <Link href="/ramp">On/off-ramp</Link>
              <Link href="/vibans">vIBANs</Link>
              <Link href="/wallets">Wallet as a Service</Link>
              <Link href="/cards#corporate">Corporate cards</Link>
              <Link href="/settlement">Stablecoin settlement</Link>
              <Link href="/developers">APIs &amp; webhooks</Link>
            </div>
          </details>
          <details>
            <summary>Solutions<svg className="ic" aria-hidden="true"><use href="#i-chevron-down" /></svg></summary>
            <div className="m-sub">
              <Link href="/personal">Individuals</Link>
              <Link href="/business">Fintechs &amp; Platforms</Link>
              <Link href="/processing">Merchants &amp; PSPs</Link>
              <Link href="/otc">OTC Desks</Link>
              <Link href="/processing">Payment Processing</Link>
              <Link href="/ramp">On/Off Ramp</Link>
              <Link href="/settlement">Treasury &amp; Settlement</Link>
              <Link href="/wallets">Wallet as a Service</Link>
            </div>
          </details>
          <details>
            <summary>Company<svg className="ic" aria-hidden="true"><use href="#i-chevron-down" /></svg></summary>
            <div className="m-sub">
              <Link href="/about">About Us</Link>
              <Link href="/compliance">Security &amp; Compliance</Link>
              <Link href="/careers">Careers</Link>
              <Link href="/help">Help Center</Link>
              <Link href="/developers">API Docs</Link>
              <Link href="/privacy">Privacy</Link>
            </div>
          </details>
          <div className="m-cta">
            <Link className="btn btn-solid" href="/personal">Buy crypto</Link>
            <Link className="btn btn-solid" href="/auth/login">Login</Link>
            <Link className="btn btn-line" href="/contact">Talk to our team</Link>
            <button className="btn btn-line" type="button" data-theme-toggle onClick={() => { if (typeof window !== 'undefined' && window.__toggleTheme) window.__toggleTheme(); }}>
              <svg className="ic ic-sun" aria-hidden="true"><use href="#i-sun" /></svg>
              <svg className="ic ic-moon" aria-hidden="true"><use href="#i-moon" /></svg>
              <span data-theme-label>Light mode</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
