'use client';

import React, { useState } from 'react';
import CryptoLogo from '@/components/CryptoLogo';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

interface AssetItem {
  symbol: string;
  name: string;
  type: 'fiat' | 'crypto';
  holdings: string;
  unitPrice: string;
  valEUR: string;
  allocation: string;
  locked: string;
  change: string;
  isPositive: boolean;
  tag: string;
  network: string;
}

export default function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const [hideBalance, setHideBalance] = useState(false);
  const [currency, setCurrency] = useState<'EUR' | 'USD'>('EUR');
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [assetsExpanded, setAssetsExpanded] = useState(true);
  const [assetCategory, setAssetCategory] = useState<'all' | 'crypto' | 'fiat'>('all');

  const assets: AssetItem[] = [
    {
      symbol: 'EUR',
      name: 'European Virtual IBAN',
      type: 'fiat',
      holdings: '42,100.00 EUR',
      unitPrice: '€1.00 EUR',
      valEUR: '€42,100.00',
      allocation: '32.8%',
      locked: '€0.00',
      change: 'Active',
      isPositive: true,
      tag: 'SEPA Instant',
      network: 'Polish KNF Safeguarded',
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin (Custody Vault)',
      type: 'crypto',
      holdings: '1.0245 BTC',
      unitPrice: '€79,375.30 EUR',
      valEUR: '€81,320.00',
      allocation: '63.3%',
      locked: '0.0000 BTC',
      change: '+1.8%',
      isPositive: true,
      tag: 'BitGo MPC',
      network: 'Bitcoin Mainnet',
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      type: 'crypto',
      holdings: '5,030.00 USDT',
      unitPrice: '€0.922 EUR',
      valEUR: '€4,640.00',
      allocation: '3.6%',
      locked: '0.00 USDT',
      change: '+0.1%',
      isPositive: true,
      tag: 'TRC-20 / ERC-20',
      network: 'Multi-Chain',
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      type: 'crypto',
      holdings: '2,500.00 USDC',
      unitPrice: '€0.922 EUR',
      valEUR: '€2,305.00',
      allocation: '1.8%',
      locked: '0.00 USDC',
      change: '0.0%',
      isPositive: true,
      tag: 'ERC-20 Native',
      network: 'Ethereum',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      type: 'crypto',
      holdings: '1.4500 ETH',
      unitPrice: '€2,640.00 EUR',
      valEUR: '€3,828.00',
      allocation: '3.0%',
      locked: '0.0000 ETH',
      change: '+2.4%',
      isPositive: true,
      tag: 'Staking Eligible',
      network: 'Proof-of-Stake',
    },
  ];

  const filteredAssets = assets.filter((a) => {
    if (assetCategory === 'crypto') return a.type === 'crypto';
    if (assetCategory === 'fiat') return a.type === 'fiat';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ============ TOP METRICS & FINANCIAL OVERVIEW (ETHER.FI CENTERED HERO ON MOBILE) ============ */}
      <div
        style={{
          padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
          borderRadius: '24px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* Glow ambient background */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 0, 255, 0.12) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <div className="hero-content-wrapper">
          
          {/* Balance & PnL Section */}
          <div className="hero-balance-col">
            <div className="hero-label-row">
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-faint)', fontWeight: 600 }}>
                PORTFOLIO VALUE · {currency}
              </span>
              <button
                type="button"
                onClick={() => setHideBalance(!hideBalance)}
                aria-label={hideBalance ? 'Show balance' : 'Hide balance'}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--fg-dim)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
                title={hideBalance ? 'Reveal balance' : 'Mask balance'}
              >
                <svg className="ic" style={{ width: 16, height: 16 }}>
                  <use href={hideBalance ? '#i-x' : '#i-eye'} />
                </svg>
              </button>
            </div>

            <div
              className="display hero-amount-display"
              style={{
                fontSize: 'clamp(2.4rem, 6.5vw, 3.75rem)',
                fontWeight: 650,
                color: 'var(--hi)',
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                marginTop: '0.35rem',
                fontVariantNumeric: 'tabular-nums lining-nums',
                fontFamily: 'var(--f-display)',
              }}
            >
              {hideBalance ? '€ ••••••••' : currency === 'EUR' ? '€128,450.00' : '$139,215.00'}
            </div>

            <div className="hero-pnl-row">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: 'rgba(0, 0, 255, 0.12)',
                  color: 'var(--jade-text-d)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  fontVariantNumeric: 'tabular-nums lining-nums',
                }}
              >
                <svg className="ic" style={{ width: 13, height: 13 }}><use href="#i-arrow-up-right" /></svg>
                <span>+€3,012.40 (+2.4%) past 24h</span>
              </div>
            </div>
          </div>

          {/* 4-Pillar Floating Circular Quick Actions (Direct Ether.fi Pattern) */}
          <div className="quick-actions-grid">
            
            {/* 1. Deposit */}
            <div className="quick-action-item">
              <button
                type="button"
                onClick={() => onNavigate('fiat-deposit')}
                className="action-circle-btn"
                title="Deposit EUR via vIBAN or Crypto"
              >
                <svg className="ic" style={{ width: 20, height: 20 }}><use href="#i-arrow-down" /></svg>
              </button>
              <span className="action-circle-label">Deposit</span>
            </div>

            {/* 2. Send */}
            <div className="quick-action-item">
              <button
                type="button"
                onClick={() => onNavigate('crypto-withdraw')}
                className="action-circle-btn"
                title="Send Crypto or Outbound SEPA Wire"
              >
                <svg className="ic" style={{ width: 20, height: 20 }}><use href="#i-arrow-up-right" /></svg>
              </button>
              <span className="action-circle-label">Send</span>
            </div>

            {/* 3. Buy */}
            <div className="quick-action-item">
              <button
                type="button"
                onClick={() => onNavigate('buy')}
                className="action-circle-btn"
                title="Buy Crypto with Card or SEPA"
              >
                <svg className="ic" style={{ width: 20, height: 20 }}><use href="#i-credit-card" /></svg>
              </button>
              <span className="action-circle-label">Buy</span>
            </div>

            {/* 4. More (Opens mobile Action Sheet) */}
            <div className="quick-action-item">
              <button
                type="button"
                onClick={() => setShowMoreActions(true)}
                className="action-circle-btn"
                title="Treasury Services & More Actions"
              >
                <svg className="ic" style={{ width: 20, height: 20 }}><use href="#i-more-horizontal" /></svg>
              </button>
              <span className="action-circle-label">More</span>
            </div>

          </div>

        </div>
      </div>

      {/* ============ 4-PILLAR INSTITUTIONAL LIQUIDITY STRIP (DIRECT CLARITY FROM ORIGINAL DASHBOARD) ============ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.85rem',
        }}
      >
        {/* Card 1: Available Fiat Balance */}
        <div
          style={{
            padding: '1rem 1.15rem',
            borderRadius: '16px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <CryptoLogo symbol="EUR" size={34} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--fg-dim)', fontWeight: 600 }}>
              Available Fiat Balance
            </div>
            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 650,
                color: 'var(--hi)',
                marginTop: '2px',
                fontVariantNumeric: 'tabular-nums lining-nums',
                fontFamily: 'var(--f-display)',
                letterSpacing: '-0.015em',
              }}
            >
              {hideBalance ? '••••••' : '€42,100.00'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--jade-text-d)', marginTop: '1px' }}>
              SEPA Instant Virtual IBAN
            </div>
          </div>
        </div>

        {/* Card 2: Locked Fiat Balance */}
        <div
          style={{
            padding: '1rem 1.15rem',
            borderRadius: '16px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3B82F6',
              flexShrink: 0,
            }}
          >
            <svg className="ic" style={{ width: 17, height: 17 }}><use href="#i-shield-check" /></svg>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--fg-dim)', fontWeight: 600 }}>
              Locked Fiat Balance
            </div>
            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 650,
                color: 'var(--hi)',
                marginTop: '2px',
                fontVariantNumeric: 'tabular-nums lining-nums',
                fontFamily: 'var(--f-display)',
                letterSpacing: '-0.015em',
              }}
            >
              {hideBalance ? '••••••' : '€0.00'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--fg-faint)', marginTop: '1px' }}>
              0 pending outwires
            </div>
          </div>
        </div>

        {/* Card 3: Crypto (Value in Fiat) */}
        <div
          style={{
            padding: '1rem 1.15rem',
            borderRadius: '16px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <CryptoLogo symbol="BTC" size={34} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--fg-dim)', fontWeight: 600 }}>
              Crypto (Value in Fiat)
            </div>
            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 650,
                color: 'var(--hi)',
                marginTop: '2px',
                fontVariantNumeric: 'tabular-nums lining-nums',
                fontFamily: 'var(--f-display)',
                letterSpacing: '-0.015em',
              }}
            >
              {hideBalance ? '••••••' : '€86,350.00'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--jade-text-d)', marginTop: '1px' }}>
              BitGo MPC Institutional Vault
            </div>
          </div>
        </div>

        {/* Card 4: Locked Crypto Balance */}
        <div
          style={{
            padding: '1rem 1.15rem',
            borderRadius: '16px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(38, 161, 123, 0.12)',
              border: '1px solid rgba(38, 161, 123, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#26A17B',
              flexShrink: 0,
            }}
          >
            <svg className="ic" style={{ width: 17, height: 17 }}><use href="#i-shield" /></svg>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--fg-dim)', fontWeight: 600 }}>
              Locked Crypto Balance
            </div>
            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 650,
                color: 'var(--hi)',
                marginTop: '2px',
                fontVariantNumeric: 'tabular-nums lining-nums',
                fontFamily: 'var(--f-display)',
                letterSpacing: '-0.015em',
              }}
            >
              {hideBalance ? '••••••' : '€0.00'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--fg-faint)', marginTop: '1px' }}>
              100% available &amp; unencumbered
            </div>
          </div>
        </div>
      </div>

      {/* ============ PROMPT CARD: ENABLE BANK TRANSFERS / vIBAN (ETHER.FI DIRECT MATCH) ============ */}
      <div
        onClick={() => onNavigate('fiat-deposit')}
        style={{
          padding: '1.25rem clamp(1rem, 2.5vw, 1.5rem)',
          borderRadius: '20px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          gap: '12px',
        }}
        className="hover:border-[#3B82F6] hover:translate-y-[-1px]"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
          
          {/* Overlapping Crisp SVG Flag Badges (Universal across Windows/Mac/Mobile) */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {/* European Union Blue Circle Flag */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#003399',
                border: '2px solid var(--surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                zIndex: 1,
              }}
              title="European Union"
            >
              <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }}>
                <circle cx="12" cy="12" r="7.5" fill="none" stroke="#FFCC00" strokeWidth="1.8" strokeDasharray="1.2 2.7" strokeLinecap="round" />
              </svg>
            </div>

            {/* Poland White/Red Circle Flag */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid var(--surface)',
                marginLeft: '-12px',
                zIndex: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
              }}
              title="Poland"
            >
              <div style={{ flex: 1, background: '#FFFFFF' }} />
              <div style={{ flex: 1, background: '#DC143C' }} />
            </div>
          </div>

          {/* Text & Badge */}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.96rem', fontWeight: 650, color: 'var(--hi)' }}>
                Enable bank transfers
              </span>
              <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '999px', background: 'rgba(0, 0, 255, 0.12)', color: 'var(--jade-text-d)', fontWeight: 600 }}>
                0% SEPA Instant
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', marginTop: '2px', lineHeight: 1.4 }}>
              Get your own Polish bank account and dedicated European virtual IBAN.
            </div>
          </div>
        </div>

        {/* Right Arrow Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3B82F6', fontSize: '0.84rem', fontWeight: 600, flexShrink: 0 }}>
          <span className="desktop-inline">View Details</span>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg className="ic" style={{ width: 14, height: 14 }}><use href="#i-chevron-right" /></svg>
          </div>
        </div>
      </div>

      {/* ============ HOLDINGS OVERVIEW (ETHER.FI CLASS + INSTITUTIONAL BREAKDOWN FROM ORIGINAL DASHBOARD) ============ */}
      <div
        style={{
          padding: '1.5rem clamp(1rem, 2.5vw, 1.75rem)',
          borderRadius: '20px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 650, color: 'var(--hi)', margin: 0 }}>Holdings Overview</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--fg-dim)', marginTop: '2px', margin: 0 }}>
              Segregated fiat safeguarding &amp; BitGo MPC institutional custody.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Real Vector Asset Logos Stack (Ether.fi signature pattern) */}
            <div
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setAssetsExpanded(!assetsExpanded)}
              title="Click to expand / collapse holdings"
            >
              {['EUR', 'BTC', 'ETH', 'USDT', 'USDC'].map((sym, idx) => (
                <div
                  key={sym}
                  style={{
                    marginLeft: idx === 0 ? 0 : '-10px',
                    zIndex: 10 - idx,
                    borderRadius: '50%',
                    border: '2px solid var(--surface)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CryptoLogo symbol={sym} size={28} />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('fiat-deposit')}
              className="btn btn-line btn-sm"
              style={{ borderRadius: '999px', padding: '6px 14px' }}
            >
              + Add Funds
            </button>
          </div>
        </div>

        {/* Currency Category Tabs (Direct Pattern from Original Dashboard) */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--line)',
            paddingBottom: '0.85rem',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'all', label: 'All Currencies', count: assets.length },
            { id: 'crypto', label: 'Crypto Currencies', count: assets.filter((a) => a.type === 'crypto').length },
            { id: 'fiat', label: 'Fiat Currencies', count: assets.filter((a) => a.type === 'fiat').length },
          ].map((tab) => {
            const isActive = assetCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAssetCategory(tab.id as any)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  background: isActive ? 'var(--hi)' : 'var(--surface-2)',
                  color: isActive ? 'var(--ground)' : 'var(--fg-dim)',
                  borderColor: isActive ? 'var(--hi)' : 'var(--line)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.label}</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>({tab.count})</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Table View (≥ 768px) */}
        {assetsExpanded && (
          <div className="holdings-desktop-view">
            {/* Column Headers */}
            <div
              className="holdings-grid"
              style={{
                padding: '0.6rem 1.25rem 0.75rem',
                border: '1px solid transparent',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--fg-faint)',
                fontWeight: 600,
              }}
            >
              <div>Currency</div>
              <div style={{ textAlign: 'right' }}>Holdings</div>
              <div style={{ textAlign: 'right' }}>Unit Price</div>
              <div style={{ textAlign: 'right' }}>Total Value</div>
              <div style={{ textAlign: 'right' }}>Portfolio %</div>
            </div>

            {/* Asset Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {filteredAssets.map((asset) => (
                <div
                  key={asset.symbol}
                  className="asset-row-card"
                  style={{
                    padding: '0.9rem 1.25rem',
                    borderRadius: '14px',
                    background: 'var(--ground)',
                    border: '1px solid var(--line)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div className="holdings-grid">
                    {/* Col 1: Currency & Logos */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <CryptoLogo symbol={asset.symbol} size={38} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 650, color: 'var(--hi)' }}>{asset.symbol}</span>
                          <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '999px', background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--fg-dim)' }}>
                            {asset.tag}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--fg-dim)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {asset.name}
                        </div>
                      </div>
                    </div>

                    {/* Col 2: Holdings */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 650, color: 'var(--hi)', fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                        {hideBalance ? '••••••' : asset.holdings}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--fg-faint)', marginTop: '2px' }}>
                        {asset.symbol}
                      </div>
                    </div>

                    {/* Col 3: Unit Price */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg)', fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                        {asset.unitPrice}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--fg-faint)', marginTop: '2px' }}>
                        Spot Market
                      </div>
                    </div>

                    {/* Col 4: Total Value */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.96rem', fontWeight: 650, color: 'var(--hi)', fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                        {hideBalance ? '••••••' : asset.valEUR}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: asset.isPositive ? 'var(--jade-text-d)' : 'var(--coral)', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                        <span>{asset.change}</span>
                        {asset.locked !== '€0.00' && asset.locked !== '0.0000 BTC' && (
                          <span style={{ color: 'var(--fg-faint)' }}>· Locked: {asset.locked}</span>
                        )}
                      </div>
                    </div>

                    {/* Col 5: Portfolio % */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 650, color: 'var(--hi)', fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                        {asset.allocation}
                      </div>
                      <div style={{ width: '100%', height: '4px', borderRadius: '2px', background: 'var(--line)', marginTop: '6px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: asset.allocation,
                            height: '100%',
                            background: asset.type === 'fiat' ? '#3B82F6' : '#F7931A',
                            borderRadius: '2px',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Responsive Cards View (< 768px) */}
        {assetsExpanded && (
          <div className="holdings-mobile-view" style={{ flexDirection: 'column', gap: '0.65rem' }}>
            {filteredAssets.map((asset) => (
              <div
                key={asset.symbol}
                className="asset-row-card"
                style={{
                  padding: '0.9rem 1rem',
                  borderRadius: '14px',
                  background: 'var(--ground)',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <CryptoLogo symbol={asset.symbol} size={36} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 650, color: 'var(--hi)' }}>{asset.symbol}</span>
                      <span style={{ fontSize: '0.66rem', padding: '2px 6px', borderRadius: '999px', background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--fg-dim)' }}>
                        {asset.tag}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--fg-dim)', marginTop: '2px' }}>
                      {asset.holdings}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.96rem', fontWeight: 650, color: 'var(--hi)', fontFamily: 'var(--f-display)', fontVariantNumeric: 'tabular-nums lining-nums' }}>
                    {hideBalance ? '••••••' : asset.valEUR}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: asset.isPositive ? 'var(--jade-text-d)' : 'var(--coral)', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    <span>{asset.change}</span>
                    <span style={{ color: 'var(--fg-faint)' }}>({asset.allocation})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table Footer Summary (From Original Dashboard) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            marginTop: '0.75rem',
            borderTop: '1px solid var(--line)',
            fontSize: '0.78rem',
            color: 'var(--fg-dim)',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600, color: 'var(--hi)' }}>Total Portfolio Value:</span>
            <span
              style={{
                fontWeight: 650,
                color: 'var(--hi)',
                fontFamily: 'var(--f-display)',
                fontVariantNumeric: 'tabular-nums lining-nums',
                fontSize: '0.9rem',
              }}
            >
              {hideBalance ? '€••••••••' : currency === 'EUR' ? '€128,450.00' : '$139,215.00'}
            </span>
          </div>
          <div style={{ color: 'var(--fg-faint)', fontSize: '0.74rem' }}>
            Showing {filteredAssets.length} of {assets.length} currencies
          </div>
        </div>

      </div>

      {/* ============ 2x2 INSTITUTIONAL FEATURES GRID (ETHER.FI SHORTCUTS) ============ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        
        <div
          onClick={() => onNavigate('convert')}
          style={{
            padding: '1.5rem',
            borderRadius: '18px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          className="hover:border-[#3B82F6] hover:translate-y-[-2px]"
        >
          <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(0, 0, 255, 0.12)', color: 'var(--jade-text-d)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <svg className="ic" style={{ width: 20, height: 20 }}><use href="#i-repeat" /></svg>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--hi)' }}>0% Slippage RFQ Swaps</div>
          <p style={{ fontSize: '0.82rem', color: 'var(--fg-dim)', marginTop: '4px', lineHeight: 1.5 }}>
            Execute large-ticket institutional conversions locked at live institutional rates with zero price impact.
          </p>
          <span style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--jade-text-d)', fontWeight: 500 }}>
            Launch RFQ Engine →
          </span>
        </div>

        <div
          onClick={() => onNavigate('fiat-deposit')}
          style={{
            padding: '1.5rem',
            borderRadius: '18px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          className="hover:border-[#3B82F6] hover:translate-y-[-2px]"
        >
          <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(0, 0, 255, 0.12)', color: 'var(--jade-text-d)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <svg className="ic" style={{ width: 20, height: 20 }}><use href="#i-landmark" /></svg>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--hi)' }}>Multi-Currency Virtual IBANs</div>
          <p style={{ fontSize: '0.82rem', color: 'var(--fg-dim)', marginTop: '4px', lineHeight: 1.5 }}>
            Dedicated EUR accounts provisioned under your registered entity name for zero-fee SEPA Instant wires.
          </p>
          <span style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--jade-text-d)', fontWeight: 500 }}>
            View Account Credentials →
          </span>
        </div>

        <div
          onClick={() => onNavigate('crypto-deposit')}
          style={{
            padding: '1.5rem',
            borderRadius: '18px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          className="hover:border-[#3B82F6] hover:translate-y-[-2px]"
        >
          <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(0, 0, 255, 0.12)', color: 'var(--jade-text-d)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <svg className="ic" style={{ width: 20, height: 20 }}><use href="#i-shield" /></svg>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--hi)' }}>BitGo MPC Vault Custody</div>
          <p style={{ fontSize: '0.82rem', color: 'var(--fg-dim)', marginTop: '4px', lineHeight: 1.5 }}>
            Multi-signature digital asset infrastructure insured up to $250M through Lloyd&apos;s of London underwriters.
          </p>
          <span style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--jade-text-d)', fontWeight: 500 }}>
            Manage Vault Addresses →
          </span>
        </div>

        <div
          onClick={() => onNavigate('orders-history')}
          style={{
            padding: '1.5rem',
            borderRadius: '18px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          className="hover:border-[#3B82F6] hover:translate-y-[-2px]"
        >
          <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(0, 0, 255, 0.12)', color: 'var(--jade-text-d)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <svg className="ic" style={{ width: 20, height: 20 }}><use href="#i-file-text" /></svg>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--hi)' }}>Audited Statement Exports</div>
          <p style={{ fontSize: '0.82rem', color: 'var(--fg-dim)', marginTop: '4px', lineHeight: 1.5 }}>
            Download timestamped corporate audit-ready statements and trade confirmations in CSV, PDF, and MT940.
          </p>
          <span style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--jade-text-d)', fontWeight: 500 }}>
            Export Tax Reports →
          </span>
        </div>

      </div>

      {/* ============ ETHER.FI SLIDE-UP ACTION SHEET (FOR "MORE" BUTTON) ============ */}
      {showMoreActions && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setShowMoreActions(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: 'var(--surface)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              border: '1px solid var(--line)',
              borderBottom: 'none',
              padding: '1.5rem 1.25rem 2.5rem',
              animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--line-2)', margin: '0 auto 1.25rem' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 650, color: 'var(--hi)', margin: 0 }}>Treasury Actions</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--fg-dim)', marginTop: '2px', margin: 0 }}>Direct institutional transaction shortcuts</p>
              </div>
              <button
                type="button"
                onClick={() => setShowMoreActions(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--line)',
                  color: 'var(--fg)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg className="ic" style={{ width: 14, height: 14 }}><use href="#i-x" /></svg>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { title: 'RFQ Swap', sub: '0% slippage crypto-to-fiat', tab: 'convert', icon: '#i-repeat', color: '#3B82F6' },
                { title: 'SEPA Outwire', sub: 'Transfer EUR to external bank', tab: 'fiat-withdraw', icon: '#i-arrow-up-right', color: '#10B981' },
                { title: 'Bank Accounts', sub: 'Verified corporate whitelist', tab: 'bank-accounts', icon: '#i-landmark', color: '#F59E0B' },
                { title: 'Address Book', sub: 'BitGo screened recipients', tab: 'address-book', icon: '#i-bookmark', color: '#8B5CF6' },
                { title: 'Trade Orders', sub: 'Real-time execution log', tab: 'orders-history', icon: '#i-file-text', color: '#06B6D4' },
                { title: 'Guest Wire', sub: 'Counterparty payment link', tab: 'guest-deposit', icon: '#i-users', color: '#EC4899' },
              ].map((action) => (
                <div
                  key={action.tab}
                  onClick={() => {
                    setShowMoreActions(false);
                    onNavigate(action.tab);
                  }}
                  style={{
                    padding: '1rem',
                    borderRadius: '14px',
                    background: 'var(--ground)',
                    border: '1px solid var(--line)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  className="hover:border-[var(--line-2)] hover:bg-[var(--surface-2)]"
                >
                  <div style={{ width: 34, height: 34, borderRadius: '8px', background: action.color + '15', color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.65rem' }}>
                    <svg className="ic" style={{ width: 18, height: 18 }}><use href={action.icon} /></svg>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--hi)' }}>{action.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--fg-dim)', marginTop: '2px', lineHeight: 1.3 }}>{action.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style jsx>{`
        .hero-content-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          position: relative;
          z-index: 2;
        }

        .hero-balance-col {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .hero-label-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hero-pnl-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }

        .quick-actions-grid {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .quick-action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .action-circle-btn {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: #0000FF;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(0, 0, 255, 0.35);
        }

        .action-circle-btn:hover {
          transform: translateY(-2px);
          background: #1a1aff;
          box-shadow: 0 6px 20px rgba(0, 0, 255, 0.45);
        }

        .action-circle-btn:active {
          transform: translateY(0);
        }

        .action-circle-label {
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--fg);
        }

        .asset-row-card:hover {
          border-color: var(--line-2);
          background: var(--surface-2);
        }

        .holdings-grid {
          display: grid;
          grid-template-columns: minmax(200px, 2.4fr) minmax(110px, 1.2fr) minmax(110px, 1.2fr) minmax(130px, 1.4fr) minmax(80px, 0.9fr);
          align-items: center;
          gap: 16px;
          width: 100%;
        }

        .holdings-desktop-view {
          display: block;
        }

        .holdings-mobile-view {
          display: none;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @media (max-width: 767px) {
          .hero-content-wrapper {
            flex-direction: column;
            text-align: center;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
          }

          .hero-balance-col {
            align-items: center;
            justify-content: center;
            width: 100%;
          }

          .hero-label-row {
            justify-content: center;
          }

          .hero-pnl-row {
            justify-content: center;
          }

          .quick-actions-grid {
            width: 100%;
            justify-content: space-around;
            gap: 0.5rem;
            padding-top: 1rem;
            border-top: 1px solid var(--line);
          }

          .action-circle-btn {
            width: 52px;
            height: 52px;
          }

          .holdings-desktop-view {
            display: none !important;
          }

          .holdings-mobile-view {
            display: flex !important;
          }
        }
      `}</style>

    </div>
  );
}