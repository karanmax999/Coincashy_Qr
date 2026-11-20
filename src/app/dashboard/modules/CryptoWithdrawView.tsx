'use client';

import React, { useState } from 'react';
import CryptoLogo from '@/components/CryptoLogo';

export default function CryptoWithdrawView() {
  const [selectedAsset, setSelectedAsset] = useState<'USDT' | 'BTC' | 'ETH' | 'USDC'>('USDT');
  const [selectedNetwork, setSelectedNetwork] = useState('ERC-20');
  const [destinationAddress, setDestinationAddress] = useState('0x8a1948210482Bce84CC94821a8f9b2047D1Bce84');
  const [amount, setAmount] = useState('1000');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const whitelistedAddresses = [
    { label: 'Binance Corporate Desk Vault', address: '0x8a1948210482Bce84CC94821a8f9b2047D1Bce84', network: 'ERC-20' },
    { label: 'BitGo Institutional Cold Storage', address: '0x3f99482019481bce94821a8f9b2047D1Bce84821', network: 'ERC-20' },
    { label: 'Kraken Treasury Primary', address: 'TWhitelistedKrakenDeskAlpha8492018492', network: 'TRC-20' },
  ];

  const gasFee = selectedAsset === 'BTC' ? '0.0002 BTC' : selectedAsset === 'ETH' ? '0.0015 ETH' : '3.50 USDT';
  const numAmount = parseFloat(amount) || 0;
  const receiveAmount = (numAmount - (selectedAsset === 'USDT' || selectedAsset === 'USDC' ? 3.5 : 0)).toFixed(2);

  const handleWithdraw = () => {
    if (!twoFactorCode || twoFactorCode.length < 6) {
      alert('Please enter your 6-digit Authenticator (TOTP) code to authorize withdrawal.');
      return;
    }
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      alert(`Withdrawal of ${amount} ${selectedAsset} broadcast successfully to MPC quorum.`);
      setTwoFactorCode('');
    }, 1200);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* ============ TITLE ============ */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--hi)' }}>MPC Protected Crypto Withdrawal</h2>
        <p style={{ fontSize: '0.86rem', color: 'var(--fg-dim)', marginTop: '4px' }}>
          Authorized outbound transfers protected by dual-key MPC signing and 2FA.
        </p>
      </div>

      {/* ============ WITHDRAWAL CARD ============ */}
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
            Select Asset
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {(['USDT', 'BTC', 'ETH', 'USDC'] as const).map((asset) => {
              const isSelected = selectedAsset === asset;
              return (
                <button
                  key={asset}
                  type="button"
                  onClick={() => setSelectedAsset(asset)}
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

        {/* WHITELISTED DESTINATION SELECTOR */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)' }}>
              Whitelisted Destination Address
            </label>
            <span style={{ fontSize: '0.72rem', color: 'var(--coin-usdt)', fontWeight: 600 }}>
              ✓ Whitelist Enforced
            </span>
          </div>

          <select
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--line)',
              background: 'var(--ground)',
              color: 'var(--hi)',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {whitelistedAddresses.map((w) => (
              <option key={w.address} value={w.address}>
                {w.label} ({w.network}) - {w.address.slice(0, 10)}...
              </option>
            ))}
          </select>
        </div>

        {/* AMOUNT */}
        <div style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--ground)', border: '1px solid var(--line)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--fg-faint)', marginBottom: '0.5rem' }}>
            <span>WITHDRAWAL AMOUNT</span>
            <span>Available: 5,030.00 {selectedAsset}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                flex: 1,
                minWidth: '80px',
                background: 'none',
                border: 'none',
                color: 'var(--hi)',
                fontSize: 'clamp(1.35rem, 4.5vw, 1.75rem)',
                fontWeight: 650,
                fontFamily: 'var(--f-display)',
                fontVariantNumeric: 'tabular-nums lining-nums',
                letterSpacing: '-0.02em',
                outline: 'none',
              }}
            />

            <button
              type="button"
              onClick={() => setAmount('5030')}
              style={{
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'var(--surface-2)',
                border: '1px solid var(--line)',
                fontSize: '0.72rem',
                color: '#3B82F6',
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              MAX
            </button>

            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--hi)', flexShrink: 0 }}>{selectedAsset}</span>
          </div>
        </div>

        {/* 2FA AUTHORIZATION CODE */}
        <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', borderRadius: '12px', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
          <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-faint)', display: 'block', marginBottom: '0.5rem' }}>
            Two-Factor Authenticator (TOTP) Code
          </label>
          <input
            type="text"
            maxLength={6}
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
            placeholder="6-digit code (e.g. 123456)"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              background: 'var(--ground)',
              color: 'var(--hi)',
              fontSize: '1.1rem',
              letterSpacing: '0.2em',
              fontFamily: 'var(--f-mono)',
              textAlign: 'center',
            }}
          />
        </div>

        {/* SUMMARY DETAILS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem', color: 'var(--fg-dim)', borderTop: '1px solid var(--line)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Network Mining / Gas Fee</span>
            <span style={{ color: 'var(--hi)', fontFamily: 'var(--f-mono)' }}>{gasFee}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Net Received by Counterparty</span>
            <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--hi)', fontWeight: 700 }}>
              {receiveAmount} {selectedAsset}
            </span>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="button"
          onClick={handleWithdraw}
          disabled={isBroadcasting || numAmount <= 0}
          className="btn btn-solid"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '1rem',
            fontWeight: 600,
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--coral), #9B2C2C)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: isBroadcasting || numAmount <= 0 ? 'not-allowed' : 'pointer',
            opacity: isBroadcasting || numAmount <= 0 ? 0.6 : 1,
          }}
        >
          {isBroadcasting ? 'Signing MPC Quorum...' : `Withdraw ${amount} ${selectedAsset}`}
        </button>

      </div>

    </div>
  );
}
