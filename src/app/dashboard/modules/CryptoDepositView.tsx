'use client';

import React, { useState } from 'react';
import CryptoLogo from '@/components/CryptoLogo';

export default function CryptoDepositView() {
  const [selectedAsset, setSelectedAsset] = useState<'USDT' | 'BTC' | 'ETH' | 'USDC'>('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState('TRC-20');
  const [copied, setCopied] = useState(false);

  const depositAddresses: Record<string, Record<string, string>> = {
    USDT: {
      'TRC-20': 'TCoincashyDeskAlpha99482Vault99281a8c',
      'ERC-20': '0x71C83648a8f9b2047D1Bce84CC94821a8f9b2047',
      'Arbitrum': '0x71C83648a8f9b2047D1Bce84CC94821a8f9b2047',
    },
    BTC: {
      'Bitcoin Native': 'bc1qcoincashydeskalpha948210vault892104',
    },
    ETH: {
      'Ethereum (ERC-20)': '0x71C83648a8f9b2047D1Bce84CC94821a8f9b2047',
    },
    USDC: {
      'ERC-20': '0x71C83648a8f9b2047D1Bce84CC94821a8f9b2047',
      'Solana': 'CC94821VaultSolDeskAlpha99281829104821',
    },
  };

  const currentNetwork = (depositAddresses[selectedAsset] && depositAddresses[selectedAsset][selectedNetwork])
    ? selectedNetwork
    : Object.keys(depositAddresses[selectedAsset] || {})[0] || '';

  const address = depositAddresses[selectedAsset]?.[currentNetwork] || '0x71C8...2047';

  const handleCopy = () => {
    navigator.clipboard?.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* ============ TITLE ============ */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--hi)' }}>Multi-Chain Crypto Deposit</h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--fg-dim)', marginTop: '4px' }}>
          Securely fund your corporate treasury into BitGo &amp; Utila MPC segregated vaults.
        </p>
      </div>

      {/* ============ DEPOSIT CARD ============ */}
      <div
        style={{
          borderRadius: '24px',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          padding: 'clamp(1rem, 3vw, 2rem)',
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* ASSET SELECTOR */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', display: 'block', marginBottom: '0.5rem' }}>
            Select Deposit Asset
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {(['USDT', 'BTC', 'ETH', 'USDC'] as const).map((asset) => {
              const isSelected = selectedAsset === asset;
              return (
                <button
                  key={asset}
                  type="button"
                  onClick={() => {
                    setSelectedAsset(asset);
                    const nets = Object.keys(depositAddresses[asset] || {});
                    setSelectedNetwork(nets[0] || '');
                  }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '12px',
                    border: isSelected ? '1px solid #3B82F6' : '1px solid var(--line)',
                    background: isSelected ? 'var(--surface-2)' : 'var(--ground)',
                    color: isSelected ? 'var(--hi)' : 'var(--fg-dim)',
                    fontWeight: isSelected ? 650 : 500,
                    cursor: 'pointer',
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <CryptoLogo symbol={asset} size={22} />
                  <span>{asset}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* NETWORK TABS */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', display: 'block', marginBottom: '0.5rem' }}>
            Select Network
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {Object.keys(depositAddresses[selectedAsset] || {}).map((net) => {
              const isSelected = currentNetwork === net;
              return (
                <button
                  key={net}
                  type="button"
                  onClick={() => setSelectedNetwork(net)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: isSelected ? '1px solid var(--gold, #E2B866)' : '1px solid var(--line)',
                    background: isSelected ? 'var(--surface-2)' : 'transparent',
                    color: isSelected ? 'var(--hi)' : 'var(--fg-dim)',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  {net}
                </button>
              );
            })}
          </div>
        </div>

        {/* QR CODE & ADDRESS DISPLAY */}
        <div
          style={{
            padding: '1.75rem',
            borderRadius: '16px',
            background: 'var(--ground)',
            border: '1px solid var(--line)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}
        >
          {/* Simulated High-Res QR Code */}
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: '12px',
              background: '#ffffff',
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            {/* SVG QR Code Pattern */}
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
              {/* Corner squares */}
              <rect x="10" y="10" width="30" height="30" fill="#000000" />
              <rect x="15" y="15" width="20" height="20" fill="#ffffff" />
              <rect x="20" y="20" width="10" height="10" fill="#000000" />
              
              <rect x="60" y="10" width="30" height="30" fill="#000000" />
              <rect x="65" y="15" width="20" height="20" fill="#ffffff" />
              <rect x="70" y="20" width="10" height="10" fill="#000000" />

              <rect x="10" y="60" width="30" height="30" fill="#000000" />
              <rect x="15" y="65" width="20" height="20" fill="#ffffff" />
              <rect x="20" y="70" width="10" height="10" fill="#000000" />
              
              {/* Data dots */}
              <rect x="45" y="15" width="8" height="8" fill="#000000" />
              <rect x="45" y="30" width="8" height="8" fill="#000000" />
              <rect x="25" y="45" width="8" height="8" fill="#000000" />
              <rect x="45" y="45" width="12" height="12" fill="#3B82F6" />
              <rect x="65" y="45" width="8" height="8" fill="#000000" />
              <rect x="45" y="65" width="8" height="8" fill="#000000" />
              <rect x="60" y="65" width="8" height="8" fill="#000000" />
              <rect x="75" y="75" width="12" height="12" fill="#000000" />
            </svg>
          </div>

          <div style={{ fontSize: '0.76rem', color: 'var(--fg-faint)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            {selectedAsset} ({currentNetwork}) Deposit Address
          </div>

          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'var(--surface-2)',
              border: '1px solid var(--line)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: '0.82rem',
                color: 'var(--hi)',
                wordBreak: 'break-all',
                textAlign: 'left',
              }}
            >
              {address}
            </span>

            <button
              type="button"
              onClick={handleCopy}
              className="btn btn-solid btn-sm"
              style={{ flexShrink: 0, padding: '4px 10px', fontSize: '0.74rem' }}
            >
              <svg className="ic" style={{ width: 12, height: 12 }}><use href="#i-copy" /></svg>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* SECURITY & CLEARING DISCLOSURE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.78rem', color: 'var(--fg-dim)', borderTop: '1px solid var(--line)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--coin-usdt)' }} />
            <span>Minimum Deposit: <strong>10.00 {selectedAsset}</strong> (smaller amounts will not credit)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--coin-usdt)' }} />
            <span>Network Confirmation: <strong>12 block confirmations</strong> required for credit</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--coin-usdt)' }} />
            <span>MPC Vault Protection: Insured by BitGo &amp; Utila multi-party computation</span>
          </div>
        </div>

      </div>

    </div>
  );
}
